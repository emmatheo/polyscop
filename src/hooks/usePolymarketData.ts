import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WhaleActivity {
  id: string;
  wallet: string;
  market: string;
  side: "YES" | "NO";
  amount: number;
  price: number;
  timestamp: string;
  profitability: number;
}

export interface Trader {
  wallet: string;
  totalProfit: number;
  winRate: number;
  totalTrades: number;
  recentActivity: string;
  profitChange24h: number;
}

export const useWhaleActivity = (searchQuery: string = "") => {
  return useQuery({
    queryKey: ["whale-activity", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("polymarket-trades", {
        body: { 
          minAmount: 50000, // Minimum $50k for whale trades
          limit: 50,
          search: searchQuery 
        },
      });

      if (error) throw error;
      return data as WhaleActivity[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useTopTraders = (searchQuery: string = "") => {
  return useQuery({
    queryKey: ["top-traders", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("polymarket-traders", {
        body: { 
          limit: 1000,
          search: searchQuery 
        },
      });

      if (error) throw error;
      return data as Trader[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
