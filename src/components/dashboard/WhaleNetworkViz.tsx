import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";

export const WhaleNetworkViz = () => {
  const clusters = [
    { id: 1, name: "Alpha Cluster", members: 8, accuracy: 82, position: { x: 30, y: 40 } },
    { id: 2, name: "Beta Group", members: 5, accuracy: 75, position: { x: 60, y: 25 } },
    { id: 3, name: "Gamma Whales", members: 12, accuracy: 88, position: { x: 70, y: 70 } },
    { id: 4, name: "Delta Squad", members: 6, accuracy: 79, position: { x: 20, y: 75 } },
  ];

  return (
    <Card className="p-6 card-elevated border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Whale Network Clusters</h3>
        <Network className="h-6 w-6 text-primary" />
      </div>
      
      <div className="relative h-[400px] bg-muted/20 rounded-lg border border-border overflow-hidden">
        {/* Network Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {clusters.map((cluster, i) => 
            clusters.slice(i + 1).map((target, j) => (
              <line
                key={`${i}-${j}`}
                x1={`${cluster.position.x}%`}
                y1={`${cluster.position.y}%`}
                x2={`${target.position.x}%`}
                y2={`${target.position.y}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeOpacity="0.2"
              />
            ))
          )}
        </svg>
        
        {/* Cluster Nodes */}
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${cluster.position.x}%`, top: `${cluster.position.y}%` }}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-lg font-bold text-primary">{cluster.members}</span>
              </div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center w-32">
                <p className="text-xs font-semibold text-foreground">{cluster.name}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {cluster.accuracy}% acc
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
        {clusters.map((cluster) => (
          <div key={cluster.id} className="p-3 bg-muted/30 rounded-lg border border-border">
            <p className="font-semibold text-sm text-foreground">{cluster.name}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{cluster.members} members</span>
              <Badge variant="outline" className="text-xs">{cluster.accuracy}%</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
