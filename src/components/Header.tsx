import { Search, Activity, Moon, Sun, DollarSign, LayoutDashboard, Waves, Zap, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/whale-tracking', label: 'Tracking', icon: Waves },
    { path: '/whale-activity', label: 'Activity', icon: Zap },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 glass backdrop-blur-xl">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent animate-glow-pulse" />
      
      <div className="container flex h-16 sm:h-20 items-center gap-2 sm:gap-4 px-4">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10 transition-all duration-300"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] glass border-border/30">
            <SheetHeader>
              <SheetTitle className="text-left">
                <div className="flex items-center gap-2">
                  <img src={polyscopLogo} alt="PolyScop" className="h-8 w-auto" />
                  <span className="text-lg font-display font-black text-gradient">POLYSCOP</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-6">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start font-heading ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-secondary glow-cyan'
                          : 'hover:bg-primary/10'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative shrink-0">
          <div className="relative">
            {/* Glowing background effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Logo */}
            <div className="relative flex items-center justify-center">
              <img 
                src={polyscopLogo} 
                alt="PolyScop Logo" 
                className="h-7 sm:h-10 w-auto relative z-10 transition-all duration-500 ease-out
                  group-hover:scale-110 
                  group-hover:drop-shadow-[0_0_20px_rgba(0,217,255,0.6)]
                  animate-float"
              />
              
              {/* Orbital rings */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full scale-125 opacity-0 group-hover:opacity-100 group-hover:animate-[orbit_4s_linear_infinite]" />
              <div className="absolute inset-0 border border-secondary/20 rounded-full scale-150 opacity-0 group-hover:opacity-100 group-hover:animate-[orbit_6s_linear_infinite_reverse]" />
            </div>
          </div>
          
          <div className="hidden sm:flex flex-col relative">
            <span className="text-lg sm:text-xl font-display font-black text-gradient leading-none tracking-wider group-hover:text-shadow-glow transition-all duration-300">
              POLYSCOP
            </span>
            <span className="text-[8px] sm:text-[9px] font-heading font-medium text-muted-foreground group-hover:text-primary/80 transition-all duration-300 tracking-widest uppercase">
              Whale Intelligence
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md hidden sm:block">
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
          <SelectTrigger className="w-[120px] sm:w-[170px] glass border-border/50 hover:border-accent/50 text-xs sm:text-sm font-body transition-all shrink-0">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-accent" />
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
        <div className="hidden lg:flex items-center gap-1 shrink-0">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary glow-cyan font-heading'
                      : 'hover:bg-primary/10 font-heading'
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Live Status */}
        <Badge variant="outline" className="hidden sm:flex gap-1.5 bg-success/10 border-success/40 text-success text-xs font-heading glow-border-cyan shrink-0">
          <Activity className="h-3 w-3 animate-pulse" />
          LIVE
        </Badge>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hover:bg-primary/10 transition-all duration-300 group relative overflow-hidden shrink-0"
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
