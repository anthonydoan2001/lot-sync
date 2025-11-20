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
  const getDisplayDescription = () => {
    let desc = pallet.description;

    if (pallet.grade && desc.startsWith(pallet.grade)) {
      desc = desc.substring(pallet.grade.length).trim();
    }

    return `${desc} ${pallet.type || ""}`.trim();
  };

  const isLowGrade = pallet.grade && ["D/F", "D", "F"].includes(pallet.grade.toUpperCase());

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 border-2 overflow-hidden bg-gradient-to-br from-card to-card/80">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="space-y-3 p-6 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              {pallet.grade && (
                <span
                  className={`text-lg font-bold uppercase px-4 py-2 rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg ${
                    isLowGrade
                      ? "bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground"
                      : "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground"
                  }`}
                >
                  {pallet.grade}
                </span>
              )}
              <p className="text-xl font-semibold text-foreground uppercase flex-1">{getDisplayDescription()}</p>
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent uppercase tracking-wide">
              {pallet.pallet_number}
            </h3>
          </div>
          {!isHistory && (
            <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(pallet)}
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(pallet.id)}
                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 px-6 pb-4 relative">
        <div className="inline-block px-3 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground font-medium">
            Created: {format(new Date(pallet.created_at), "PPpp")}
          </p>
        </div>
        {isHistory && pallet.retired_at && (
          <div className="inline-block px-3 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground font-medium">
              Retired: {format(new Date(pallet.retired_at), "PPpp")}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 px-6 pb-6 relative">
        {!isHistory ? (
          <Button
            variant="outline"
            onClick={() => onRetire(pallet.id)}
            className="h-10 px-5 font-semibold text-accent border-2 border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Archive className="h-4 w-4 mr-2" />
            Retire
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => onUnretire(pallet.id)}
            className="h-10 px-5 font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Archive className="h-4 w-4 mr-2" />
            Unretire
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
