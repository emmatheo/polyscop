import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface WalletSearchProps {
  selectedWallet: string;
  onWalletChange: (wallet: string) => void;
}

export const WalletSearch = ({ selectedWallet, onWalletChange }: WalletSearchProps) => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Enter wallet address to analyze..."
            value={selectedWallet}
            onChange={(e) => onWalletChange(e.target.value)}
            className="pl-10 bg-muted border-primary/30 focus:border-primary transition-all"
          />
        </div>
        {selectedWallet && (
          <Button
            variant="outline"
            onClick={() => onWalletChange("")}
            className="border-destructive/30 hover:border-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
};
