import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const movements = [
  { wallet: "0x7f3a...b821", market: "Trump 2024 Win", amount: "$125,000", side: "YES", timestamp: "2m ago" },
  { wallet: "0x4c2e...9a14", market: "Bitcoin >$100K", amount: "$98,500", side: "NO", timestamp: "5m ago" },
  { wallet: "0x9a1b...c3f2", market: "Lakers NBA Finals", amount: "$76,200", side: "YES", timestamp: "12m ago" },
  { wallet: "0x2d5e...4a8c", market: "Fed Rate Cut March", amount: "$65,000", side: "NO", timestamp: "18m ago" },
  { wallet: "0x8f3c...1d9b", market: "ETH >$5K Q1", amount: "$54,300", side: "YES", timestamp: "23m ago" },
];

export const WhaleMovementsTable = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Top Whale Movements</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((move, i) => (
              <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    {move.wallet}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{move.market}</TableCell>
                <TableCell className="text-warning font-bold">{move.amount}</TableCell>
                <TableCell>
                  <Badge variant={move.side === "YES" ? "default" : "secondary"}>
                    {move.side}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{move.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
