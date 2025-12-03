import { memo } from "react";
import { Pallet } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Pencil, Archive, Trash2 } from "lucide-react";

interface PalletCardProps {
  pallet: Pallet;
  onEdit: (pallet: Pallet) => void;
  onRetire: (id: string) => void;
  onUnretire: (id: string) => void;
  onDelete: (id: string) => void;
  isHistory?: boolean;
}

export const PalletCard = memo(function PalletCard({ pallet, onEdit, onRetire, onUnretire, onDelete, isHistory = false }: PalletCardProps) {
  const getDisplayDescription = () => {
    let desc = pallet.description;
    if (pallet.grade && desc.startsWith(pallet.grade)) {
      desc = desc.substring(pallet.grade.length).trim();
    }
    return `${desc} ${pallet.type || ""}`.trim();
  };

  const isLowGrade = pallet.grade && ["D/F", "D", "F"].includes(pallet.grade.toUpperCase());

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      {pallet.grade && (
        <span
          className={`text-sm font-bold uppercase px-2 py-1 rounded ${
            isLowGrade
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {pallet.grade}
        </span>
      )}
      <span className="font-bold text-primary uppercase">{pallet.pallet_number}</span>
      <span className="text-muted-foreground uppercase flex-1">{getDisplayDescription()}</span>
      
      <div className="flex items-center gap-1">
        {!isHistory ? (
          <>
            <Button size="icon" variant="ghost" onClick={() => onEdit(pallet)} className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onRetire(pallet.id)} className="h-8 w-8 text-accent">
              <Archive className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(pallet.id)} className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={() => onUnretire(pallet.id)}>
            Unretire
          </Button>
        )}
      </div>
    </div>
  );
});
