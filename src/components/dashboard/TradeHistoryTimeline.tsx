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
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
  ];

  const setQuickDate = (days: number) => {
    setDateRange({
      from: days === 0 ? new Date() : subDays(new Date(), days),
      to: new Date(),
    });
  };

  return (
    <Card className="p-6 card-elevated border-primary/20 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="text-xl font-bold text-foreground">Trade History Timeline</h3>
          </div>
          <Badge variant="outline" className="gap-1.5">
            {whaleTrades.length} trades
          </Badge>
        </div>

        {/* Quick Date Filters */}
        <div className="flex flex-wrap gap-2">
          {quickDateFilters.map((filter) => (
            <Button
              key={filter.label}
              variant="outline"
              size="sm"
              onClick={() => setQuickDate(filter.days)}
              className="hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range Picker */}
        <div className="flex gap-2 items-center flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "PPP")
                ) : (
                  <span>Pick start date</span>
                )}
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

          <span className="text-muted-foreground">to</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "PPP")
                ) : (
                  <span>Pick end date</span>
                )}
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

        {/* Timeline Display */}
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4 relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            {whaleTrades.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No trades found for the selected period
              </p>
            ) : (
              whaleTrades.map((trade, index) => {
                const tradeDate = new Date(trade.timestamp);
                const showDateHeader =
                  index === 0 ||
                  new Date(whaleTrades[index - 1].timestamp).toDateString() !==
                    tradeDate.toDateString();

                return (
                  <div key={trade.id} className="relative">
                    {/* Date Header */}
                    {showDateHeader && (
                      <div className="flex items-center gap-3 mb-4 mt-6 first:mt-0">
                        <Badge variant="secondary" className="font-semibold">
                          {format(tradeDate, "EEEE, MMMM do yyyy")}
                        </Badge>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}

                    {/* Trade Item */}
                    <div className="flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      {/* Timeline dot */}
                      <div className="relative z-10">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shadow-lg",
                          trade.side === "YES" 
                            ? "bg-gradient-to-br from-success to-success/50" 
                            : "bg-gradient-to-br from-destructive to-destructive/50"
                        )}>
                          {trade.side === "YES" ? (
                            <TrendingUp className="h-6 w-6 text-white" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Trade Details */}
                      <div className="flex-1 bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/50 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground">{trade.market}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {trade.wallet.slice(0, 6)}...{trade.wallet.slice(-4)}
                            </p>
                          </div>
                          <Badge variant={trade.side === "YES" ? "default" : "secondary"}>
                            {trade.side}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Amount</p>
                              <p className="font-bold text-foreground">${trade.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Price</p>
                              <p className="font-semibold text-foreground">{(trade.price * 100).toFixed(1)}¢</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-mono">
                              {format(tradeDate, "HH:mm:ss")}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {trade.category}
                            </Badge>
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
