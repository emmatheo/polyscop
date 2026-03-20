import { Search, Moon, Sun, DollarSign, LayoutDashboard, Waves, Zap, Menu } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center gap-3 px-4">
        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-8 w-8">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px]">
            <SheetHeader>
              <SheetTitle className="text-left">
                <span className="text-base font-display font-bold text-primary">POLYSCOP</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-6">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={`w-full justify-start text-sm font-body ${isActive ? 'font-semibold' : ''}`}
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
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-xs font-display font-bold text-primary-foreground">PS</span>
          </div>
          <span className="hidden sm:block text-sm font-display font-bold text-foreground group-hover:text-primary transition-colors">
            POLYSCOP
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs font-body h-8 px-3 ${
                    isActive
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 mr-1.5" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="hidden sm:block w-full max-w-[220px] lg:max-w-[280px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search markets..."
              className="h-8 pl-8 text-xs font-body bg-muted/50 border-transparent focus:border-border focus:bg-background transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Whale Filter */}
        <Select value={minAmount.toString()} onValueChange={(value) => setMinAmount(Number(value))}>
          <SelectTrigger className="w-[110px] sm:w-[140px] h-8 text-xs font-body bg-muted/50 border-transparent shrink-0">
            <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5000">$5K+</SelectItem>
            <SelectItem value="10000">$10K+</SelectItem>
            <SelectItem value="25000">$25K+</SelectItem>
            <SelectItem value="50000">$50K+</SelectItem>
            <SelectItem value="100000">$100K+</SelectItem>
            <SelectItem value="250000">$250K+</SelectItem>
            <SelectItem value="500000">$500K+</SelectItem>
            <SelectItem value="1000000">$1M+</SelectItem>
          </SelectContent>
        </Select>

        {/* Live badge */}
        <Badge variant="outline" className="hidden sm:flex gap-1.5 h-6 text-[10px] font-mono border-success/30 text-success shrink-0">
          <span className="signal-dot bg-success" />
          LIVE
        </Badge>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 shrink-0"
        >
          <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};
