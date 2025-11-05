import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";

export const WatchlistToggle = () => {
  const [isWatchlist, setIsWatchlist] = useState(false);

  return (
    <Button
      variant={isWatchlist ? "default" : "outline"}
      onClick={() => setIsWatchlist(!isWatchlist)}
      className="gap-2"
    >
      <Star className={`h-4 w-4 ${isWatchlist ? "fill-current" : ""}`} />
      {isWatchlist ? "Watching" : "Add to Watchlist"}
    </Button>
  );
};
