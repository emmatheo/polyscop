import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { X, Filter, Search, Calendar } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const CATEGORIES = [
  { value: "Politics", color: "bg-chart-4" },
  { value: "Sports", color: "bg-success" },
  { value: "Crypto", color: "bg-warning" },
  { value: "Economy", color: "bg-chart-1" },
  { value: "Entertainment", color: "bg-chart-2" },
  { value: "Technology", color: "bg-chart-5" },
  { value: "Other", color: "bg-muted" },
];

interface AdvancedFiltersProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  minTradeSize: number;
  onMinTradeSizeChange: (size: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const AdvancedFilters = ({
  selectedCategories,
  onCategoriesChange,
  minTradeSize,
  onMinTradeSizeChange,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const clearAllFilters = () => {
    onCategoriesChange([]);
    onMinTradeSizeChange(5000);
    onSearchChange("");
    onDateRangeChange({ from: undefined, to: undefined });
  };

  const activeFiltersCount = 
    selectedCategories.length + 
    (minTradeSize !== 5000 ? 1 : 0) + 
    (searchQuery ? 1 : 0) + 
    (dateRange.from || dateRange.to ? 1 : 0);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-4 card-elevated border-primary/20">
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10">
              <Filter className="h-4 w-4" />
              <span className="font-semibold">Advanced Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
              <X className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>

        <CollapsibleContent className="mt-6 space-y-6">
          {/* Search Filter */}
          <div className="animate-fade-in">
            <h4 className="text-sm font-semibold text-foreground mb-3">Search Trades</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by market, wallet, or trade..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-muted border-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <h4 className="text-sm font-semibold text-foreground mb-3">Date Range</h4>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal border-primary/30 hover:border-primary"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => onDateRangeChange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal border-primary/30 hover:border-primary"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {(dateRange.from || dateRange.to) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateRangeChange({ from: undefined, to: undefined })}
                className="text-muted-foreground hover:text-foreground mt-2"
              >
                Clear dates
              </Button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-sm font-semibold text-foreground mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.value);
                return (
                  <Badge
                    key={category.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? `${category.color} text-foreground border-primary` 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleCategory(category.value)}
                  >
                    {category.value}
                    {isSelected && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Min Trade Size Filter */}
          <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">Minimum Trade Size</h4>
              <Badge variant="outline" className="font-mono">
                ${minTradeSize.toLocaleString()}
              </Badge>
            </div>
            <Slider
              value={[minTradeSize]}
              onValueChange={([value]) => onMinTradeSizeChange(value)}
              min={1000}
              max={100000}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>$1K</span>
              <span>$100K</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Presets</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMinTradeSizeChange(5000)}
                className="text-xs"
              >
                Whales ($5K+)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMinTradeSizeChange(25000)}
                className="text-xs"
              >
                Mega Whales ($25K+)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMinTradeSizeChange(50000)}
                className="text-xs"
              >
                Ultra Whales ($50K+)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onCategoriesChange(["Politics", "Crypto"]);
                }}
                className="text-xs"
              >
                Politics + Crypto
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
