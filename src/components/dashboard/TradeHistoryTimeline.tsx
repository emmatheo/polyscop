import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { format, subDays } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";

export const TradeHistoryTimeline = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { whaleTrades } = useRealtimePolymarket({
    dateRange,
    minTradeSize: 5000,
  });

  const quickDateFilters = [
    { label: "Today", days: 0 },
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
  ];

  const setQuickDate = (days: number) => {
    setDateRange({
      from: days === 0 ? new Date() : subDays(new Date(), days),
      to: new Date(),
    });
  };

  return (
    <Card className="data-card p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-display font-semibold text-foreground">Trade History</h3>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono tabular-nums">
            {whaleTrades.length} trades
          </Badge>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-1.5">
          {quickDateFilters.map((filter) => (
            <Button
              key={filter.label}
              variant="outline"
              size="sm"
              onClick={() => setQuickDate(filter.days)}
              className="h-7 text-xs font-body px-3 press-scale"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Date Range */}
        <div className="flex gap-2 items-center flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs font-body justify-start",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Start"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs text-muted-foreground">→</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs font-body justify-start",
                  !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "End"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[500px]">
          <div className="space-y-3 relative pr-3">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

            {whaleTrades.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-12 font-body">
                No trades found for the selected period
              </p>
            ) : (
              whaleTrades.map((trade, index) => {
                const tradeDate = new Date(trade.timestamp);
                const showDateHeader =
                  index === 0 ||
                  new Date(whaleTrades[index - 1].timestamp).toDateString() !== tradeDate.toDateString();

                return (
                  <div key={trade.id} className="relative">
                    {showDateHeader && (
                      <div className="flex items-center gap-2 mb-3 mt-4 first:mt-0">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {format(tradeDate, "MMM d, yyyy")}
                        </Badge>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}

                    <div className="flex gap-3 animate-reveal-up" style={{ animationDelay: `${index * 0.04}s` }}>
                      <div className="relative z-10 shrink-0">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          trade.side === "YES" ? "bg-success/10" : "bg-destructive/10"
                        )}>
                          {trade.side === "YES" ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 bg-muted/30 rounded-md p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-1">
                          <div className="min-w-0">
                            <p className="text-xs font-body font-semibold text-foreground truncate">{trade.market}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">
                              {trade.wallet.slice(0, 6)}…{trade.wallet.slice(-4)}
                            </p>
                          </div>
                          <Badge variant="outline" className={`text-[10px] font-mono ml-2 ${
                            trade.side === "YES" ? "text-success border-success/30" : "text-destructive border-destructive/30"
                          }`}>
                            {trade.side}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-4">
                            <div>
                              <p className="text-[10px] text-muted-foreground">Amount</p>
                              <p className="text-xs font-mono font-medium text-foreground tabular-nums">${trade.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground">Price</p>
                              <p className="text-xs font-mono font-medium text-foreground tabular-nums">{(trade.price * 100).toFixed(1)}¢</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground font-mono tabular-nums">
                              {format(tradeDate, "HH:mm:ss")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
