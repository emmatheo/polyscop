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

    // Fetch recent trades
    const tradesUrl = `https://data-api.polymarket.com/trades?limit=${limit}`;
    
    console.log(`Calling Polymarket API: ${tradesUrl}`);
    const response = await fetch(tradesUrl);
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status} ${response.statusText}`);
    }

    const trades = await response.json();
    console.log(`Received ${trades.length} trades from Polymarket`);

    // Calculate 30-day window
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    // Aggregate trades by wallet for last 30 days
    const traderStats = new Map<string, {
      wallet: string;
      totalVolume30d: number;
      tradeCount30d: number;
      whaleTrades30d: number;
      recentActivity: number;
      avgTradeSize: number;
    }>();

    for (const trade of trades) {
      if (!trade.proxyWallet) continue;

      const wallet = trade.proxyWallet;
      const tradeTime = trade.timestamp * 1000;
      
      // Only count trades from last 30 days
      if (tradeTime < thirtyDaysAgo) continue;
      
      const volume = trade.size * trade.price;
      const isWhaleTrade = volume >= 5000;
      
      // Initialize or get trader stats
      if (!traderStats.has(wallet)) {
        traderStats.set(wallet, {
          wallet,
          totalVolume30d: 0,
          tradeCount30d: 0,
          whaleTrades30d: 0,
          recentActivity: trade.timestamp,
          avgTradeSize: 0,
        });
      }
      
      const stats = traderStats.get(wallet)!;
      stats.totalVolume30d += volume;
      stats.tradeCount30d += 1;
      if (isWhaleTrade) stats.whaleTrades30d += 1;
      stats.recentActivity = Math.max(stats.recentActivity, trade.timestamp);
      
      traderStats.set(wallet, stats);
    }
    
    // Calculate average trade size and filter for top traders
    traderStats.forEach(stats => {
      stats.avgTradeSize = stats.totalVolume30d / stats.tradeCount30d;
    });

    // Convert to array and filter/sort by volume and whale activity
    let topTraders = Array.from(traderStats.values())
      .filter(stats => 
        stats.totalVolume30d >= 10000 && // At least $10K volume
        stats.whaleTrades30d >= 1 && // At least 1 whale trade
        stats.tradeCount30d >= 5 // At least 5 trades
      )
      .sort((a, b) => b.totalVolume30d - a.totalVolume30d)
      .slice(0, 20)
      .map((stats) => ({
        wallet: stats.wallet,
        totalProfit: Math.round(stats.totalVolume30d), // Using volume as main metric
        winRate: Math.round((stats.whaleTrades30d / stats.tradeCount30d) * 100), // Whale trade ratio
        totalTrades: stats.tradeCount30d,
        recentActivity: formatTimestamp(stats.recentActivity),
        profitChange24h: Math.round(stats.avgTradeSize), // Average trade size
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
