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
    <Card className="data-card p-5 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-display font-semibold text-foreground mb-1">Export Data</h3>
        <p className="text-xs text-muted-foreground font-body">
          {whaleTrades.length} trades available
        </p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2 w-full mt-4 h-9 text-xs font-body press-scale">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportToCSV} className="gap-2 text-xs font-body">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToJSON} className="gap-2 text-xs font-body">
            <FileJson className="h-3.5 w-3.5" />
            JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};
