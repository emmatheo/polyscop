import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type SignalType = "momentum" | "volume" | "whale" | "contrarian";

interface SignalBadgeProps {
  type: SignalType;
  score: number;
  className?: string;
}

const signalConfig = {
  momentum: {
    label: "Momentum",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
  },
  volume: {
    label: "Volume Spike",
    icon: Zap,
    color: "text-warning",
    bg: "bg-warning/10 border-warning/30",
  },
  whale: {
    label: "Whale Activity",
    icon: Wallet,
    color: "text-accent",
    bg: "bg-accent/10 border-accent/30",
  },
  contrarian: {
    label: "Contrarian",
    icon: TrendingUp,
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
  },
};

export const SignalBadge = ({ type, score, className }: SignalBadgeProps) => {
  const config = signalConfig[type];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", config.bg, config.color, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
      <span className="ml-1 opacity-70">({score.toFixed(1)})</span>
    </Badge>
  );
};
