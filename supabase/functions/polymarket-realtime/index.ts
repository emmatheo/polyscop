import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  let intervalId: number | null = null;
  let lastTradeTimestamp = 0;
  const marketPriceHistory = new Map<string, Array<{ timestamp: number; price: number; outcome: string }>>();

  socket.onopen = () => {
    console.log("WebSocket client connected");
    
    // Send initial data immediately
    fetchAndSendUpdates(socket);
    
    // Poll every 10 seconds for new updates
    intervalId = setInterval(() => {
      fetchAndSendUpdates(socket);
    }, 10000);
  };

  socket.onclose = () => {
    console.log("WebSocket client disconnected");
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  async function fetchAndSendUpdates(socket: WebSocket) {
    try {
      // Fetch recent trades
      const tradesUrl = `https://data-api.polymarket.com/trades?limit=50&filterType=CASH&filterAmount=5000&takerOnly=true`;
      const response = await fetch(tradesUrl);
      
      if (!response.ok) {
        console.error(`Polymarket API error: ${response.status}`);
        return;
      }

      const trades = await response.json();
      
      // Filter for new trades only
      const newTrades = trades.filter((trade: any) => trade.timestamp > lastTradeTimestamp);
      
      if (newTrades.length > 0) {
        lastTradeTimestamp = Math.max(...newTrades.map((t: any) => t.timestamp));
        
        // Transform and send whale trades
        const whaleTrades = newTrades.map((trade: any) => {
          const tags = trade.tags || [];
          const category = detectCategory(tags, trade.title || '');
          
          return {
            type: 'whale_trade',
            data: {
              id: `${trade.proxyWallet}-${trade.timestamp}`,
              wallet: trade.proxyWallet,
              market: trade.title || 'Unknown Market',
              side: trade.outcome || (trade.side === 'BUY' ? 'YES' : 'NO'),
              amount: Math.round(trade.size * trade.price),
              price: trade.price,
              timestamp: formatTimestamp(trade.timestamp),
              category: category,
            }
          };
        });

        socket.send(JSON.stringify({
          type: 'update',
          trades: whaleTrades,
          timestamp: Date.now()
        }));
      }

      // Calculate and send market stats
      const marketStats = calculateMarketStats(trades);
      socket.send(JSON.stringify({
        type: 'market_stats',
        data: marketStats,
        timestamp: Date.now()
      }));

      // Track price movements for top markets
      updatePriceHistory(trades, marketPriceHistory);
      const priceData = Array.from(marketPriceHistory.entries())
        .slice(0, 5)
        .map(([market, history]) => ({
          market,
          history: history.slice(-30), // Last 30 data points
        }));

      socket.send(JSON.stringify({
        type: 'price_movements',
        data: priceData,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  }

  return response;
});

function calculateMarketStats(trades: any[]) {
  const marketVolumes = new Map<string, { volume: number, count: number, whales: Set<string> }>();
  
  trades.forEach((trade: any) => {
    const market = trade.title || 'Unknown';
    const volume = trade.size * trade.price;
    
    if (!marketVolumes.has(market)) {
      marketVolumes.set(market, { volume: 0, count: 0, whales: new Set() });
    }
    
    const stats = marketVolumes.get(market)!;
    stats.volume += volume;
    stats.count += 1;
    if (volume >= 5000) {
      stats.whales.add(trade.proxyWallet);
    }
  });

  return Array.from(marketVolumes.entries())
    .map(([market, stats]) => ({
      market,
      volume: Math.round(stats.volume),
      tradeCount: stats.count,
      whaleCount: stats.whales.size
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function updatePriceHistory(
  trades: any[],
  marketPriceHistory: Map<string, Array<{ timestamp: number; price: number; outcome: string }>>
) {
  const now = Date.now();
  const marketPrices = new Map<string, { price: number; outcome: string }>();

  // Get latest price for each market
  trades.forEach((trade: any) => {
    const market = trade.title || 'Unknown';
    if (!marketPrices.has(market)) {
      marketPrices.set(market, {
        price: trade.price * 100, // Convert to percentage
        outcome: trade.outcome || trade.side
      });
    }
  });

  // Update history for each market
  marketPrices.forEach((data, market) => {
    if (!marketPriceHistory.has(market)) {
      marketPriceHistory.set(market, []);
    }
    
    const history = marketPriceHistory.get(market)!;
    history.push({
      timestamp: now,
      price: data.price,
      outcome: data.outcome
    });

    // Keep only last 50 data points per market
    if (history.length > 50) {
      history.shift();
    }
  });

  // Clean up old markets (keep only top 10 by recent activity)
  if (marketPriceHistory.size > 10) {
    const sortedMarkets = Array.from(marketPriceHistory.entries())
      .sort((a, b) => {
        const lastA = a[1][a[1].length - 1]?.timestamp || 0;
        const lastB = b[1][b[1].length - 1]?.timestamp || 0;
        return lastB - lastA;
      })
      .slice(0, 10);
    
    marketPriceHistory.clear();
    sortedMarkets.forEach(([market, history]) => {
      marketPriceHistory.set(market, history);
    });
  }
}

function detectCategory(tags: string[], title: string): string {
  const tagsLower = tags.map(tag => tag.toLowerCase());
  const titleLower = title.toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
    'Sports': ['sports', 'nfl', 'nba', 'mlb', 'soccer', 'football', 'basketball', 'baseball', 'tennis', 'hockey'],
    'Crypto': ['crypto', 'bitcoin', 'ethereum', 'btc', 'eth', 'blockchain', 'defi', 'nft'],
    'Politics': ['politics', 'election', 'president', 'government', 'congress', 'senate', 'policy', 'law', 'trump'],
    'Economy': ['economy', 'economics', 'market', 'stock', 'finance', 'gdp', 'inflation', 'fed', 'interest'],
    'Entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'awards', 'tv', 'show'],
    'Technology': ['technology', 'tech', 'ai', 'software', 'hardware', 'startup', 'innovation', 'apple', 'google'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    const matches = keywords.some(keyword => 
      tagsLower.some(tag => tag.includes(keyword)) || titleLower.includes(keyword)
    );
    if (matches) return category;
  }
  
  return 'Other';
}
