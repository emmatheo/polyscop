import { StatsCard } from "@/components/StatsCard";
import { TrendingUp, DollarSign, Target, Activity } from "lucide-react";
import { useWalletStats } from "@/hooks/useDashboardData";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WalletStatsCardsProps {
  wallet: string;
}

export const WalletStatsCards = ({ wallet }: WalletStatsCardsProps) => {
  const { data: stats, isLoading, error } = useWalletStats(wallet);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load wallet statistics. Please check the wallet address.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-foreground">
        Wallet: {wallet.slice(0, 8)}...{wallet.slice(-6)}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Trades"
          value={stats.totalTrades.toString()}
          icon={Activity}
          iconColor="text-primary"
        />
        <StatsCard
          title="Total Volume"
          value={`$${stats.totalVolume.toLocaleString()}`}
          change={`${stats.volumeChange24h > 0 ? '+' : ''}${stats.volumeChange24h}%`}
          changeType={stats.volumeChange24h > 0 ? "positive" : "negative"}
          icon={DollarSign}
          iconColor="text-success"
        />
        <StatsCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          icon={Target}
          iconColor="text-accent"
        />
        <StatsCard
          title="Profit/Loss"
          value={`$${stats.profitLoss.toLocaleString()}`}
          changeType={stats.profitLoss >= 0 ? "positive" : "negative"}
          icon={TrendingUp}
          iconColor={stats.profitLoss >= 0 ? "text-success" : "text-destructive"}
        />
      </div>
    </div>
  );
};
