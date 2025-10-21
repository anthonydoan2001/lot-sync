import { Lot } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Pencil, Archive, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface LotCardProps {
  lot: Lot;
  onEdit: (lot: Lot) => void;
  onRetire: (id: string) => void;
  onDelete: (id: string) => void;
  isHistory?: boolean;
}

export function LotCard({ lot, onEdit, onRetire, onDelete, isHistory = false }: LotCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-2">
        <h3 className="text-2xl font-bold text-secondary uppercase">{lot.lot_number}</h3>
        <p className="text-xl font-semibold text-foreground uppercase">{lot.customer_name}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground uppercase">
          {lot.contents}
        </p>
        <p className="text-xs text-muted-foreground">
          Created: {format(new Date(lot.created_at), "PPpp")}
        </p>
        {isHistory && lot.retired_at && (
          <p className="text-xs text-muted-foreground">
            Retired: {format(new Date(lot.retired_at), "PPpp")}
          </p>
        )}
      </CardContent>
      {!isHistory && (
        <CardFooter className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => onEdit(lot)}
            className="flex-1"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRetire(lot.id)}
            className="flex-1 text-accent border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Archive className="h-4 w-4 mr-1" />
            Retire
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(lot.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
