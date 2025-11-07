import { useEffect, useState, useCallback } from 'react';

interface WhaleTrade {
  id: string;
  wallet: string;
  market: string;
  side: string;
  amount: number;
  price: number;
  timestamp: string;
  category: string;
}

interface MarketStat {
  market: string;
  volume: number;
  tradeCount: number;
  whaleCount: number;
}

interface PricePoint {
  timestamp: number;
  price: number;
  outcome: string;
}

interface MarketPriceHistory {
  market: string;
  history: PricePoint[];
}

interface RealtimeData {
  whaleTrades: WhaleTrade[];
  marketStats: MarketStat[];
  priceMovements: MarketPriceHistory[];
  isConnected: boolean;
}

interface FilterOptions {
  categories?: string[];
  minTradeSize?: number;
}

const WS_URL = 'wss://rckbdhmwdhblcfquedsh.supabase.co/functions/v1/polymarket-realtime';

export const useRealtimePolymarket = (filters?: FilterOptions) => {
  const [data, setData] = useState<RealtimeData>({
    whaleTrades: [],
    marketStats: [],
    priceMovements: [],
    isConnected: false,
  });

  const [error, setError] = useState<string | null>(null);

  const applyFilters = useCallback((trades: WhaleTrade[]) => {
    if (!filters) return trades;

    return trades.filter(trade => {
      // Filter by categories
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(trade.category)) {
          return false;
        }
      }

      // Filter by minimum trade size
      if (filters.minTradeSize && trade.amount < filters.minTradeSize) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected to Polymarket stream');
        setData(prev => ({ ...prev, isConnected: true }));
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'update' && message.trades) {
            const newTrades = message.trades.map((t: any) => t.data);
            const filteredTrades = applyFilters(newTrades);
            
            setData(prev => ({
              ...prev,
              whaleTrades: [...filteredTrades, ...prev.whaleTrades].slice(0, 100),
            }));
          }

          if (message.type === 'market_stats' && message.data) {
            setData(prev => ({
              ...prev,
              marketStats: message.data,
            }));
          }

          if (message.type === 'price_movements' && message.data) {
            setData(prev => ({
              ...prev,
              priceMovements: message.data,
            }));
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setData(prev => ({ ...prev, isConnected: false }));
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setData(prev => ({ ...prev, isConnected: false }));
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 5000);
      };

      return ws;
    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
      return null;
    }
  }, []);

  useEffect(() => {
    const ws = connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  // Apply filters to existing data when filters change
  useEffect(() => {
    if (filters) {
      setData(prev => ({
        ...prev,
        whaleTrades: applyFilters(prev.whaleTrades),
      }));
    }
  }, [filters, applyFilters]);

  return { ...data, error };
};
