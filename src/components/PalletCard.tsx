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
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              {pallet.grade && (
                <span className="text-lg font-semibold text-foreground uppercase px-3 py-1 bg-muted rounded">
                  {pallet.grade}
                </span>
              )}
              <p className="text-xl font-semibold text-foreground uppercase flex-1">
                {pallet.description} {pallet.type ? pallet.type : ''}
              </p>
            </div>
            <h3 className="text-2xl font-bold text-primary uppercase">{pallet.pallet_number}</h3>
          </div>
          {!isHistory && (
            <div className="flex gap-1.5 pt-0.5">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(pallet)}
                className="h-8 w-8 hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(pallet.id)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
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
          <Button
            variant="outline"
            onClick={() => onRetire(pallet.id)}
            className="h-8 px-3 text-xs text-accent border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Archive className="h-3.5 w-3.5 mr-1" />
            Retire
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => onUnretire(pallet.id)}
            className="h-8 px-3 text-xs"
          >
            <Archive className="h-3.5 w-3.5 mr-1" />
            Unretire
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
