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
    
    // If there's a grade, remove it from the start of the description
    if (pallet.grade && desc.startsWith(pallet.grade)) {
      desc = desc.substring(pallet.grade.length).trim();
    }
    
    // Append type if it exists
    return `${desc} ${pallet.type || ''}`.trim();
  };

  // Determine if grade should be red (D/F, D, or F)
  const isLowGrade = pallet.grade && ['D/F', 'D', 'F'].includes(pallet.grade.toUpperCase());

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:border-accent/30 border-2">
      <CardHeader className="space-y-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              {pallet.grade && (
                <span className={`text-lg font-bold uppercase px-4 py-2 rounded-lg shadow-sm ${
                  isLowGrade 
                    ? 'bg-destructive text-destructive-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {pallet.grade}
                </span>
              )}
              <p className="text-xl font-semibold text-foreground uppercase flex-1">
                {getDisplayDescription()}
              </p>
            </div>
            <h3 className="text-3xl font-bold text-primary uppercase tracking-wide">{pallet.pallet_number}</h3>
          </div>
          {!isHistory && (
            <div className="flex gap-2 pt-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(pallet)}
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(pallet.id)}
                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-6 pb-4">
        <p className="text-sm text-muted-foreground">
          Created: {format(new Date(pallet.created_at), "PPpp")}
        </p>
        {isHistory && pallet.retired_at && (
          <p className="text-sm text-muted-foreground">
            Retired: {format(new Date(pallet.retired_at), "PPpp")}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 px-6 pb-6">
        {!isHistory ? (
          <Button
            variant="outline"
            onClick={() => onRetire(pallet.id)}
            className="h-10 px-5 font-semibold text-accent border-2 border-accent hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <Archive className="h-4 w-4 mr-2" />
            Retire
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => onUnretire(pallet.id)}
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
