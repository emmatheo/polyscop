import { Search, Activity, Moon, Sun, DollarSign, LayoutDashboard, Waves } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import polyscopLogo from "@/assets/polyscop-logo.png";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  minAmount: number;
  setMinAmount: (amount: number) => void;
}

export const Header = ({ searchQuery, setSearchQuery, minAmount, setMinAmount }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group transition-all duration-300">
          <img 
            src={polyscopLogo} 
            alt="PolyScop Logo" 
            className="h-10 w-auto animate-fade-in group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(var(--primary-glow),0.5)] transition-all duration-300"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gradient leading-none group-hover:tracking-wide transition-all duration-300">polyScop</span>
            <span className="text-[10px] text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">Whale & Trader Intelligence</span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search markets, wallets, traders..."
              className="pl-9 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Whale Price Range Filter */}
        <Select value={minAmount.toString()} onValueChange={(value) => setMinAmount(Number(value))}>
          <SelectTrigger className="w-[180px] bg-muted/50">
            <DollarSign className="h-4 w-4 mr-2 text-warning" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5000">$5K+ Whales</SelectItem>
            <SelectItem value="10000">$10K+ Whales</SelectItem>
            <SelectItem value="25000">$25K+ Whales</SelectItem>
            <SelectItem value="50000">$50K+ Whales</SelectItem>
            <SelectItem value="100000">$100K+ Whales</SelectItem>
            <SelectItem value="250000">$250K+ Whales</SelectItem>
            <SelectItem value="500000">$500K+ Whales</SelectItem>
            <SelectItem value="1000000">$1M+ Whales</SelectItem>
          </SelectContent>
        </Select>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/whale-tracking">
            <Button 
              variant={location.pathname === '/whale-tracking' ? 'default' : 'ghost'}
              size="sm"
            >
              <Waves className="h-4 w-4 mr-2" />
              Whale Tracking
            </Button>
          </Link>
          
          <Link to="/whale-activity">
            <Button 
              variant={location.pathname === '/whale-activity' ? 'default' : 'ghost'}
              size="sm"
            >
              <Activity className="h-4 w-4 mr-2" />
              Activity Feed
            </Button>
          </Link>
        </div>

        {/* Live Status */}
        <Badge variant="outline" className="gap-1.5 bg-success/10 border-success/30 text-success">
          <Activity className="h-3 w-3 animate-pulse" />
          Live
        </Badge>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hover:bg-muted/50 transition-all duration-300"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};
