import { memo } from "react";
import { Lot } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Archive, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatting";

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
    <div className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-l-2 border-l-transparent hover:border-l-primary bg-card hover:bg-muted/50 transition-colors duration-150">
      <span className="font-mono font-bold text-foreground uppercase">{lot.lot_number}</span>
      {lot.io && (
        <Badge variant="outline" className="text-xs font-medium">
          IO-{lot.io}
        </Badge>
      )}
      <span className="text-sm text-muted-foreground uppercase flex-1 truncate">{lot.contents}</span>

      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {isHistory && lot.retired_at ? (
          <>
            {formatDate(lot.created_at)} - <span className="font-bold underline">{formatDate(lot.retired_at)}</span>
          </>
        ) : formatDate(lot.created_at)}
      </span>

      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {!isHistory ? (
          <>
            <Button size="icon" variant="ghost" onClick={() => onEdit(lot)} className="h-8 w-8 hover:bg-muted">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onRetire(lot.id)} className="h-8 w-8 text-accent hover:bg-accent/10">
              <Archive className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(lot.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
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
