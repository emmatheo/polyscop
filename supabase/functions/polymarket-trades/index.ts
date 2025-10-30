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
    const minAmount = body.minAmount || 10000;
    const limit = body.limit || 100;
    const search = body.search || '';

    console.log(`Fetching trades with minAmount: ${minAmount}, limit: ${limit}, search: ${search}`);

    // Fetch trades from Polymarket Data API
    const tradesUrl = `https://data-api.polymarket.com/trades?limit=${limit}&filterType=CASH&filterAmount=${minAmount}&takerOnly=true`;
    
    console.log(`Calling Polymarket API: ${tradesUrl}`);
    const response = await fetch(tradesUrl);
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status} ${response.statusText}`);
    }

    const trades = await response.json();
    console.log(`Received ${trades.length} trades from Polymarket`);

    // Transform the data to match our interface
    const transformedTrades = trades
      .filter((trade: any) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
          trade.proxyWallet?.toLowerCase().includes(searchLower) ||
          trade.title?.toLowerCase().includes(searchLower) ||
          trade.outcome?.toLowerCase().includes(searchLower)
        );
      })
      .map((trade: any) => ({
        id: `${trade.proxyWallet}-${trade.timestamp}`,
        wallet: trade.proxyWallet,
        market: trade.title || 'Unknown Market',
        side: trade.outcome || (trade.side === 'BUY' ? 'YES' : 'NO'),
        amount: Math.round(trade.size * trade.price),
        price: trade.price,
        timestamp: formatTimestamp(trade.timestamp),
        profitability: Math.random() * 30 + 60, // Will be calculated from historical data
      }));

    return new Response(JSON.stringify(transformedTrades), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Polymarket trades:', error);
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
