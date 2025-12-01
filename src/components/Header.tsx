import { Search, Activity, Moon, Sun, DollarSign, LayoutDashboard, Waves, Zap } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-border/30 glass backdrop-blur-xl">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent animate-glow-pulse" />
      
      <div className="container flex flex-wrap h-auto sm:h-20 items-center gap-2 sm:gap-4 px-4 py-3 sm:py-0">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative">
          <div className="relative">
            {/* Glowing background effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Logo */}
            <div className="relative flex items-center justify-center">
              <img 
                src={polyscopLogo} 
                alt="PolyScop Logo" 
                className="h-8 sm:h-10 w-auto relative z-10 transition-all duration-500 ease-out
                  group-hover:scale-110 
                  group-hover:drop-shadow-[0_0_20px_rgba(0,217,255,0.6)]
                  animate-float"
              />
              
              {/* Orbital rings */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full scale-125 opacity-0 group-hover:opacity-100 group-hover:animate-[orbit_4s_linear_infinite]" />
              <div className="absolute inset-0 border border-secondary/20 rounded-full scale-150 opacity-0 group-hover:opacity-100 group-hover:animate-[orbit_6s_linear_infinite_reverse]" />
            </div>
          </div>
          
          <div className="flex flex-col relative">
            <span className="text-lg sm:text-xl font-display font-black text-gradient leading-none tracking-wider group-hover:text-shadow-glow transition-all duration-300">
              POLYSCOP
            </span>
            <span className="text-[8px] sm:text-[9px] font-heading font-medium text-muted-foreground group-hover:text-primary/80 transition-all duration-300 tracking-widest uppercase">
              Whale Intelligence
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 w-full sm:w-auto sm:max-w-md order-last sm:order-none mt-2 sm:mt-0">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              placeholder="Search markets, wallets..."
              className="pl-9 glass border-border/50 hover:border-primary/50 focus:border-primary transition-all text-sm font-body bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-lg pointer-events-none transition-all" />
          </div>
        </div>

        {/* Whale Price Range Filter */}
        <Select value={minAmount.toString()} onValueChange={(value) => setMinAmount(Number(value))}>
          <SelectTrigger className="w-[130px] sm:w-[170px] glass border-border/50 hover:border-accent/50 text-xs sm:text-sm font-body transition-all">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-accent" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass">
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

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              className={location.pathname === '/' ? 'bg-gradient-to-r from-primary to-secondary glow-cyan font-heading' : 'hover:bg-primary/10 font-heading'}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/whale-tracking">
            <Button 
              variant={location.pathname === '/whale-tracking' ? 'default' : 'ghost'}
              size="sm"
              className={location.pathname === '/whale-tracking' ? 'bg-gradient-to-r from-primary to-secondary glow-cyan font-heading' : 'hover:bg-primary/10 font-heading'}
            >
              <Waves className="h-4 w-4 mr-2" />
              Tracking
            </Button>
          </Link>
          
          <Link to="/whale-activity">
            <Button 
              variant={location.pathname === '/whale-activity' ? 'default' : 'ghost'}
              size="sm"
              className={location.pathname === '/whale-activity' ? 'bg-gradient-to-r from-primary to-secondary glow-cyan font-heading' : 'hover:bg-primary/10 font-heading'}
            >
              <Zap className="h-4 w-4 mr-2" />
              Activity
            </Button>
          </Link>
        </div>

        {/* Live Status */}
        <Badge variant="outline" className="gap-1.5 bg-success/10 border-success/40 text-success text-xs font-heading glow-border-cyan">
          <Activity className="h-3 w-3 animate-pulse" />
          LIVE
        </Badge>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hover:bg-primary/10 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 relative z-10" />
          <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 relative z-10" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};
