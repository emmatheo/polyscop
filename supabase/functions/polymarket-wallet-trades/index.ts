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
    const { wallet } = await req.json();
    
    if (!wallet) {
      throw new Error('Wallet address is required');
    }

    console.log(`Fetching trades for wallet: ${wallet}`);

    // Fetch more trades to increase chance of finding wallet's trades
    const tradesUrl = `https://data-api.polymarket.com/trades?limit=1000`;
    
    console.log(`Calling Polymarket API: ${tradesUrl}`);
    const response = await fetch(tradesUrl);
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status} ${response.statusText}`);
    }

    const allTrades = await response.json();
    console.log(`Received ${allTrades.length} total trades from API`);
    
    // Filter trades for this specific wallet (check both proxyWallet and taker)
    const walletTrades = allTrades.filter((trade: any) => {
      const tradeWallet = (trade.proxyWallet || trade.taker || '').toLowerCase();
      return tradeWallet === wallet.toLowerCase();
    });
    
    console.log(`Found ${walletTrades.length} trades for wallet ${wallet}`);

    // Calculate wins and losses
    let wins = 0;
    let losses = 0;
    let totalProfit = 0;

    const transformedTrades = walletTrades.map((trade: any) => {
      const tradeValue = trade.size * trade.price;
      // Simulate win/loss based on trade side and price
      const isWin = Math.random() > 0.4; // 60% win rate simulation
      const profitLoss = isWin ? tradeValue * 0.15 : -tradeValue * 0.1;
      
      if (isWin) wins++;
      else losses++;
      
      totalProfit += profitLoss;

      return {
        id: `${trade.proxyWallet}-${trade.timestamp}-${Math.random()}`,
        market: trade.title || 'Unknown Market',
        side: trade.outcome || (trade.side === 'BUY' ? 'YES' : 'NO'),
        amount: Math.round(tradeValue),
        price: trade.price,
        timestamp: formatTimestamp(trade.timestamp),
        profitLoss: Math.round(profitLoss),
        isWin,
      };
    });

    const stats = {
      totalTrades: walletTrades.length,
      wins,
      losses,
      winRate: walletTrades.length > 0 ? Math.round((wins / walletTrades.length) * 100) : 0,
      totalProfit: Math.round(totalProfit),
      trades: transformedTrades,
    };

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching wallet trades:', error);
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
