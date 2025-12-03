import { memo } from "react";
import { Lot } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Pencil, Archive, Trash2 } from "lucide-react";

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
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <span className="font-bold text-secondary uppercase">{lot.lot_number}</span>
      <span className="text-muted-foreground uppercase flex-1">{lot.contents}</span>
      
      <div className="flex items-center gap-1">
        {!isHistory ? (
          <>
            <Button size="icon" variant="ghost" onClick={() => onEdit(lot)} className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onRetire(lot.id)} className="h-8 w-8 text-accent">
              <Archive className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(lot.id)} className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={() => onUnretire(lot.id)}>
            Unretire
          </Button>
        )}
      </div>
    </div>
  );
});
