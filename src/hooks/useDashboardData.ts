import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WalletStats {
  totalTrades: number;
  totalVolume: number;
  volumeChange24h: number;
  winRate: number;
  profitLoss: number;
}

export const useWalletStats = (wallet: string) => {
  return useQuery({
    queryKey: ["wallet-stats", wallet],
    queryFn: async () => {
      if (!wallet) throw new Error("No wallet provided");

      const { data, error } = await supabase.functions.invoke("polymarket-wallet-trades", {
        body: { wallet },
      });

      if (error) throw error;
      
      // Transform the data to match our interface
      const stats: WalletStats = {
        totalTrades: data.totalTrades || 0,
        totalVolume: Math.abs(data.totalProfit || 0),
        volumeChange24h: Math.random() * 20 - 10, // Mock data for now
        winRate: data.winRate || 0,
        profitLoss: data.totalProfit || 0,
      };

      return stats;
    },
    enabled: !!wallet && wallet.length > 10,
    refetchInterval: 60000, // Refetch every minute
  });
};
