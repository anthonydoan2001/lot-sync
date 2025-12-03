import { memo } from "react";
import { Lot } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Pencil, Archive, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface LotCardProps {
  lot: Lot;
  onEdit: (lot: Lot) => void;
  onRetire: (id: string) => void;
  onUnretire: (id: string) => void;
  onDelete: (id: string) => void;
  isHistory?: boolean;
}

export const LotCard = memo(function LotCard({ lot, onEdit, onRetire, onUnretire, onDelete, isHistory = false }: LotCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-shadow duration-200 hover:border-accent/50 border-2 overflow-hidden bg-card">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <CardHeader className="space-y-3 p-6 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-secondary to-secondary/60 bg-clip-text text-transparent uppercase tracking-wide">
              {lot.lot_number}
            </h3>
          </div>
          {!isHistory && (
            <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(lot)}
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(lot.id)}
                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-6 pb-4 relative">
        <div className="p-3 rounded-lg bg-muted/50 backdrop-blur-sm">
          <p className="text-base text-foreground uppercase font-medium">{lot.contents}</p>
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground font-medium">
            Created: {format(new Date(lot.created_at), "PPpp")}
          </p>
        </div>
        {isHistory && lot.retired_at && (
          <div className="inline-block px-3 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground font-medium">
              Retired: {format(new Date(lot.retired_at), "PPpp")}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 px-6 pb-6 relative">
        {!isHistory ? (
          <Button
            variant="outline"
            onClick={() => onRetire(lot.id)}
            className="h-10 px-5 font-semibold text-accent border-2 border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Archive className="h-4 w-4 mr-2" />
            Retire
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => onUnretire(lot.id)}
            className="h-10 px-5 font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Archive className="h-4 w-4 mr-2" />
            Unretire
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});
