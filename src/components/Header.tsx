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
      <div className="container flex flex-wrap h-auto sm:h-16 items-center gap-2 sm:gap-3 px-4 py-3 sm:py-0">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative">
          <div className="relative animate-fade-in">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow to-primary blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700 animate-pulse" />
            
            {/* Logo with multiple animations */}
            <img 
              src={polyscopLogo} 
              alt="PolyScop Logo" 
              className="h-10 sm:h-12 w-auto relative z-10 transition-all duration-500 ease-out
                group-hover:scale-110 
                group-hover:rotate-3
                group-hover:drop-shadow-[0_0_25px_rgba(var(--primary-glow),0.8)]
                animate-[float_6s_ease-in-out_infinite]"
            />
            
            {/* Orbiting particles effect */}
            <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[orbit_3s_linear_infinite]" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-primary-glow rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[orbit_4s_linear_infinite_reverse]" />
          </div>
          
          <div className="flex flex-col relative z-10">
            <span className="text-lg sm:text-xl font-bold text-gradient leading-none group-hover:tracking-wide transition-all duration-300 group-hover:text-shadow-glow">
              polyScop
            </span>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground group-hover:text-primary/80 transition-all duration-300 group-hover:translate-x-1">
              Whale & Trader Intelligence
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 w-full sm:w-auto sm:max-w-md order-last sm:order-none mt-2 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search markets, wallets..."
              className="pl-9 bg-muted/50 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Whale Price Range Filter */}
        <Select value={minAmount.toString()} onValueChange={(value) => setMinAmount(Number(value))}>
          <SelectTrigger className="w-[140px] sm:w-[180px] bg-muted/50 text-xs sm:text-sm">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-warning" />
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
        <div className="hidden lg:flex items-center gap-2">
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
        <Badge variant="outline" className="gap-1.5 bg-success/10 border-success/30 text-success text-xs">
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
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};
