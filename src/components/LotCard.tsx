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

export function LotCard({ lot, onEdit, onRetire, onUnretire, onDelete, isHistory = false }: LotCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:border-accent/30 border-2">
      <CardHeader className="space-y-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <p className="text-xl font-semibold text-foreground uppercase tracking-wide">{lot.customer_name}</p>
            <h3 className="text-3xl font-bold text-secondary uppercase tracking-wide">{lot.lot_number}</h3>
          </div>
          {!isHistory && (
            <div className="flex gap-2 pt-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(lot)}
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(lot.id)}
                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-4">
        <p className="text-base text-foreground uppercase font-medium">
          {lot.contents}
        </p>
        <p className="text-sm text-muted-foreground">
          Created: {format(new Date(lot.created_at), "PPpp")}
        </p>
        {isHistory && lot.retired_at && (
          <p className="text-sm text-muted-foreground">
            Retired: {format(new Date(lot.retired_at), "PPpp")}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 px-6 pb-6">
        {!isHistory ? (
          <Button
            variant="outline"
            onClick={() => onRetire(lot.id)}
            className="h-10 px-5 font-semibold text-accent border-2 border-accent hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <Archive className="h-4 w-4 mr-2" />
            Retire
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => onUnretire(lot.id)}
            className="h-10 px-5 font-semibold"
          >
            <Archive className="h-4 w-4 mr-2" />
            Unretire
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
