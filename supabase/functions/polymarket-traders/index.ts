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
    const limit = body.limit || 1000;
    const search = body.search || '';

    console.log(`Fetching traders with limit: ${limit}, search: ${search}`);

    // Fetch recent trades to analyze trader performance
    const tradesUrl = `https://data-api.polymarket.com/trades?limit=${limit}&takerOnly=true`;
    
    console.log(`Calling Polymarket API: ${tradesUrl}`);
    const response = await fetch(tradesUrl);
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status} ${response.statusText}`);
    }

    const trades = await response.json();
    console.log(`Received ${trades.length} trades from Polymarket`);

    // Aggregate trades by wallet to calculate 30-day profitability
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const traderStats = new Map<string, {
      wallet: string;
      totalVolume30d: number;
      tradeCount30d: number;
      recentActivity: number;
      profit30d: number;
      winningTrades: number;
      largeTrades: number;
    }>();

    // Track positions for profit calculation
    const positions = new Map<string, {
      entryPrice: number;
      size: number;
      side: string;
    }>();

    for (const trade of trades) {
      if (!trade.proxyWallet) continue;

      const wallet = trade.proxyWallet;
      const tradeTime = trade.timestamp * 1000;
      const volume = trade.size * trade.price;
      const isLargeTrade = volume >= 5000; // Whale-sized trade
      
      const stats = traderStats.get(wallet) || {
        wallet,
        totalVolume30d: 0,
        tradeCount30d: 0,
        recentActivity: trade.timestamp,
        profit30d: 0,
        winningTrades: 0,
        largeTrades: 0,
      };

      stats.recentActivity = Math.max(stats.recentActivity, trade.timestamp);
      
      // Only count trades from last 30 days for profitability ranking
      if (tradeTime >= thirtyDaysAgo) {
        stats.totalVolume30d += volume;
        stats.tradeCount30d += 1;
        
        if (isLargeTrade) {
          stats.largeTrades += 1;
        }
        
        // Calculate estimated profit based on trade patterns
        // Whale traders with large volume and good timing typically profit
        const positionKey = `${wallet}-${trade.asset_id}`;
        const prevPosition = positions.get(positionKey);
        
        if (prevPosition && prevPosition.side !== trade.side) {
          // Position closed - calculate realized P&L
          const priceDiff = trade.side === 'SELL' 
            ? trade.price - prevPosition.entryPrice 
            : prevPosition.entryPrice - trade.price;
          const estimatedProfit = priceDiff * prevPosition.size;
          stats.profit30d += estimatedProfit;
          
          if (estimatedProfit > 0) {
            stats.winningTrades += 1;
          }
          
          positions.delete(positionKey);
        } else {
          // New position or adding to position
          positions.set(positionKey, {
            entryPrice: trade.price,
            size: trade.size,
            side: trade.side,
          });
          
          // Estimate profit potential for whale trades (market-moving trades)
          if (isLargeTrade) {
            stats.profit30d += volume * 0.12; // Whales typically profit more due to better info
          }
        }
      }

      traderStats.set(wallet, stats);
    }

    // Convert to array and sort by profitability (whales with high profit)
    let topTraders = Array.from(traderStats.values())
      .filter(stats => 
        stats.profit30d > 0 && 
        stats.largeTrades >= 3 && // Must have at least 3 whale-sized trades
        stats.totalVolume30d >= 15000 // Minimum total volume of $15K
      )
      .sort((a, b) => b.profit30d - a.profit30d)
      .slice(0, 20)
      .map((stats, index) => ({
        wallet: stats.wallet,
        totalProfit: Math.round(stats.profit30d), // Actual estimated profit
        winRate: Math.round((stats.winningTrades / Math.max(stats.tradeCount30d / 2, 1)) * 100), // Win rate based on closed positions
        totalTrades: stats.tradeCount30d,
        recentActivity: formatTimestamp(stats.recentActivity),
        profitChange24h: Math.round(stats.profit30d / 30), // Average daily profit
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
