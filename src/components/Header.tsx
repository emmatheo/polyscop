import { Search, TrendingUp, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gradient leading-none">Polyscope</span>
            <span className="text-[10px] text-muted-foreground">Whale & Trader Intelligence</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search markets, wallets, traders..."
              className="pl-9 bg-muted/50"
            />
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 bg-success/10 border-success/30 text-success">
            <Activity className="h-3 w-3 animate-pulse" />
            Live Tracking
          </Badge>
        </div>
      </div>
    </header>
  );
};
