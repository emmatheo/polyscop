import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";

interface DataExportProps {
  selectedCategories?: string[];
  minTradeSize?: number;
  searchQuery?: string;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

export const DataExport = ({ 
  selectedCategories, 
  minTradeSize, 
  searchQuery, 
  dateRange 
}: DataExportProps) => {
  const { toast } = useToast();
  const { whaleTrades, marketStats } = useRealtimePolymarket({
    categories: selectedCategories,
    minTradeSize,
    searchQuery,
    dateRange,
  });

  const exportToCSV = () => {
    if (whaleTrades.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no trades matching your current filters.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Timestamp", "Market", "Wallet", "Side", "Amount", "Price", "Category"];
    const rows = whaleTrades.map(trade => [
      new Date(trade.timestamp).toISOString(),
      trade.market,
      trade.wallet,
      trade.side,
      trade.amount.toString(),
      trade.price.toString(),
      trade.category,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `polyscop-trades-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${whaleTrades.length} trades to CSV`,
    });
  };

  const exportToJSON = () => {
    if (whaleTrades.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no trades matching your current filters.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      exportDate: new Date().toISOString(),
      filters: {
        categories: selectedCategories,
        minTradeSize,
        searchQuery,
        dateRange,
      },
      trades: whaleTrades,
      marketStats,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `polyscop-data-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${whaleTrades.length} trades to JSON`,
    });
  };

  return (
    <Card className="p-4 sm:p-6 card-elevated border-primary/20 hover-lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">Export Data</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Download filtered data ({whaleTrades.length} trades)
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportToCSV} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToJSON} className="gap-2">
              <FileJson className="h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
