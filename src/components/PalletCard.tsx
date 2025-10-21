import { Pallet } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Pencil, Archive, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface PalletCardProps {
  pallet: Pallet;
  onEdit: (pallet: Pallet) => void;
  onRetire: (id: string) => void;
  onUnretire: (id: string) => void;
  onDelete: (id: string) => void;
  isHistory?: boolean;
}

export function PalletCard({ pallet, onEdit, onRetire, onUnretire, onDelete, isHistory = false }: PalletCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          {pallet.grade && (
            <span className="text-lg font-semibold text-foreground uppercase px-3 py-1 bg-muted rounded">
              {pallet.grade}
            </span>
          )}
          <p className="text-xl font-semibold text-foreground uppercase flex-1">{pallet.description}</p>
        </div>
        <h3 className="text-2xl font-bold text-primary uppercase">{pallet.pallet_number}</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Created: {format(new Date(pallet.created_at), "PPpp")}
        </p>
        {isHistory && pallet.retired_at && (
          <p className="text-xs text-muted-foreground">
            Retired: {format(new Date(pallet.retired_at), "PPpp")}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {!isHistory ? (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={() => onEdit(pallet)}
              className="flex-1"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRetire(pallet.id)}
              className="flex-1 text-accent border-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Archive className="h-4 w-4 mr-1" />
              Retire
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(pallet.id)}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="default"
            onClick={() => onUnretire(pallet.id)}
            className="flex-1"
          >
            <Archive className="h-4 w-4 mr-1" />
            Unretire
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
