import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Filter } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
}

export const AdvancedFilters = ({
  selectedCategories,
  onCategoriesChange,
  minTradeSize,
  onMinTradeSizeChange,
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
  };

  const activeFiltersCount = selectedCategories.length + (minTradeSize !== 5000 ? 1 : 0);

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
          {/* Categories Filter */}
          <div>
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
          <div>
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
          <div>
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
