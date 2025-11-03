import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const limit = body.limit || 5000; // Increased to get more data
    const search = body.search || '';

    console.log(`Fetching traders with limit: ${limit}, search: ${search}`);

    // Fetch recent trades to analyze trader performance
    const tradesUrl = `https://data-api.polymarket.com/trades?limit=${limit}`;
    
    console.log(`Calling Polymarket API: ${tradesUrl}`);
    const response = await fetch(tradesUrl);
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status} ${response.statusText}`);
    }

    const trades = await response.json();
    console.log(`Received ${trades.length} trades from Polymarket`);

    // Aggregate trades by wallet to calculate actual 30-day profitability
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    // Sort trades by timestamp (oldest first) for proper position tracking
    const sortedTrades = trades.sort((a: any, b: any) => a.timestamp - b.timestamp);
    
    const traderStats = new Map<string, {
      wallet: string;
      totalVolume30d: number;
      tradeCount30d: number;
      whaleTrades30d: number;
      recentActivity: number;
      realizedPnL: number;
      unrealizedPnL: number;
      totalProfit: number;
      positions: Map<string, { entryPrice: number; size: number; cost: number }>;
      winningPositions: number;
      totalPositions: number;
    }>();

    for (const trade of sortedTrades) {
      if (!trade.proxyWallet || !trade.asset_id) continue;

      const wallet = trade.proxyWallet;
      const tradeTime = trade.timestamp * 1000;
      const volume = trade.size * trade.price;
      const isBuy = trade.side === 'BUY';
      const isWhaleTrade = volume >= 5000;
      
      // Initialize or get trader stats
      if (!traderStats.has(wallet)) {
        traderStats.set(wallet, {
          wallet,
          totalVolume30d: 0,
          tradeCount30d: 0,
          whaleTrades30d: 0,
          recentActivity: trade.timestamp,
          realizedPnL: 0,
          unrealizedPnL: 0,
          totalProfit: 0,
          positions: new Map(),
          winningPositions: 0,
          totalPositions: 0,
        });
      }
      
      const stats = traderStats.get(wallet)!;
      stats.recentActivity = Math.max(stats.recentActivity, trade.timestamp);
      
      // Only analyze trades from last 30 days
      if (tradeTime >= thirtyDaysAgo) {
        stats.totalVolume30d += volume;
        stats.tradeCount30d += 1;
        if (isWhaleTrade) stats.whaleTrades30d += 1;
        
        const posKey = trade.asset_id;
        const existingPosition = stats.positions.get(posKey);
        
        if (isBuy) {
          // Opening or adding to position
          if (existingPosition) {
            // Average in
            const newSize = existingPosition.size + trade.size;
            const newCost = existingPosition.cost + volume;
            existingPosition.size = newSize;
            existingPosition.cost = newCost;
            existingPosition.entryPrice = newCost / newSize;
          } else {
            stats.positions.set(posKey, {
              entryPrice: trade.price,
              size: trade.size,
              cost: volume,
            });
          }
        } else {
          // Selling - closing or reducing position
          if (existingPosition) {
            const sellValue = trade.size * trade.price;
            const costBasis = (existingPosition.cost / existingPosition.size) * trade.size;
            const pnl = sellValue - costBasis;
            
            stats.realizedPnL += pnl;
            stats.totalPositions += 1;
            if (pnl > 0) stats.winningPositions += 1;
            
            // Update or close position
            if (trade.size >= existingPosition.size) {
              stats.positions.delete(posKey);
            } else {
              existingPosition.size -= trade.size;
              existingPosition.cost -= costBasis;
            }
          }
        }
      }
      
      traderStats.set(wallet, stats);
    }
    
    // Calculate total profit (realized + estimated unrealized for open positions)
    traderStats.forEach(stats => {
      // Estimate unrealized P&L on open positions (assume 10% profit on whale positions still held)
      stats.positions.forEach(pos => {
        if (pos.size > 0) {
          stats.unrealizedPnL += pos.cost * 0.1; // Conservative 10% estimate
        }
      });
      stats.totalProfit = stats.realizedPnL + stats.unrealizedPnL;
    });

    // Convert to array and filter/sort by actual profitability
    let topTraders = Array.from(traderStats.values())
      .filter(stats => 
        stats.totalProfit > 1000 && // Must have made at least $1K profit
        stats.whaleTrades30d >= 2 && // At least 2 whale trades
        stats.totalPositions >= 3 // At least 3 closed positions to calculate win rate
      )
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 20)
      .map((stats) => ({
        wallet: stats.wallet,
        totalProfit: Math.round(stats.totalProfit), // Total P&L (realized + unrealized estimate)
        winRate: stats.totalPositions > 0 
          ? Math.round((stats.winningPositions / stats.totalPositions) * 100)
          : 0,
        totalTrades: stats.tradeCount30d,
        recentActivity: formatTimestamp(stats.recentActivity),
        profitChange24h: Math.round(stats.totalProfit / 30), // Average daily profit
      }));

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      topTraders = topTraders.filter(trader =>
        trader.wallet.toLowerCase().includes(searchLower)
      );
    }

    console.log(`Returning ${topTraders.length} top traders`);

    return new Response(JSON.stringify(topTraders), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Polymarket traders:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

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
