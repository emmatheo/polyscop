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
    const category = body.category || '';

    console.log(`Fetching trades with minAmount: ${minAmount}, limit: ${limit}, search: ${search}, category: ${category}`);

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
        // Filter by search query
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesSearch = (
            trade.proxyWallet?.toLowerCase().includes(searchLower) ||
            trade.title?.toLowerCase().includes(searchLower) ||
            trade.outcome?.toLowerCase().includes(searchLower)
          );
          if (!matchesSearch) return false;
        }
        
        // Filter by category
        if (category) {
          const tags = (trade.tags || []).map((tag: string) => tag.toLowerCase());
          const categoryLower = category.toLowerCase();
          
          // Map categories to tag keywords
          const categoryMap: Record<string, string[]> = {
            'sports': ['sports', 'nfl', 'nba', 'mlb', 'soccer', 'football', 'basketball', 'baseball', 'tennis', 'hockey'],
            'crypto': ['crypto', 'bitcoin', 'ethereum', 'btc', 'eth', 'blockchain', 'defi', 'nft'],
            'politics': ['politics', 'election', 'president', 'government', 'congress', 'senate', 'policy', 'law'],
            'economy': ['economy', 'economics', 'market', 'stock', 'finance', 'gdp', 'inflation', 'fed', 'interest'],
            'trending': ['trending', 'viral', 'popular', 'hot'],
            'entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'awards', 'tv', 'show'],
            'technology': ['technology', 'tech', 'ai', 'software', 'hardware', 'startup', 'innovation', 'apple', 'google'],
            'weather': ['weather', 'climate', 'hurricane', 'temperature', 'storm', 'forecast'],
            'gaming': ['gaming', 'esports', 'game', 'video game', 'twitch', 'streamer', 'tournament']
          };
          
          const keywords = categoryMap[categoryLower] || [categoryLower];
          const matchesCategory = tags.some((tag: string) => 
            keywords.some(keyword => tag.includes(keyword))
          ) || keywords.some(keyword => trade.title?.toLowerCase().includes(keyword));
          
          if (!matchesCategory) return false;
        }
        
        return true;
      })
      .map((trade: any) => {
        const tags = trade.tags || [];
        const category = detectCategory(tags, trade.title || '');
        
        return {
          id: `${trade.proxyWallet}-${trade.timestamp}`,
          wallet: trade.proxyWallet,
          market: trade.title || 'Unknown Market',
          side: trade.outcome || (trade.side === 'BUY' ? 'YES' : 'NO'),
          amount: Math.round(trade.size * trade.price),
          price: trade.price,
          timestamp: formatTimestamp(trade.timestamp),
          profitability: Math.random() * 30 + 60,
          category: category,
        };
      });

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

function detectCategory(tags: string[], title: string): string {
  const tagsLower = tags.map(tag => tag.toLowerCase());
  const titleLower = title.toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
    'Sports': ['sports', 'nfl', 'nba', 'mlb', 'soccer', 'football', 'basketball', 'baseball', 'tennis', 'hockey'],
    'Crypto': ['crypto', 'bitcoin', 'ethereum', 'btc', 'eth', 'blockchain', 'defi', 'nft'],
    'Politics': ['politics', 'election', 'president', 'government', 'congress', 'senate', 'policy', 'law'],
    'Economy': ['economy', 'economics', 'market', 'stock', 'finance', 'gdp', 'inflation', 'fed', 'interest'],
    'Entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'awards', 'tv', 'show'],
    'Technology': ['technology', 'tech', 'ai', 'software', 'hardware', 'startup', 'innovation', 'apple', 'google'],
    'Weather': ['weather', 'climate', 'hurricane', 'temperature', 'storm', 'forecast'],
    'Gaming': ['gaming', 'esports', 'game', 'video game', 'twitch', 'streamer', 'tournament'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    const matches = keywords.some(keyword => 
      tagsLower.some(tag => tag.includes(keyword)) || titleLower.includes(keyword)
    );
    if (matches) return category;
  }
  
  return 'Other';
}
