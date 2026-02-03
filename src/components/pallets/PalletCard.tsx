import { memo } from "react";
import { Pallet } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Archive, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatting";

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
    const typeUpper = pallet.type?.toUpperCase();
    const displayType = pallet.type && typeUpper !== "OTHER" && typeUpper !== "MISC" ? pallet.type : "";
    return `${desc} ${displayType}`.trim();
  };

  const isLowGrade = pallet.grade && ["D/F", "D", "F"].includes(pallet.grade.toUpperCase());
  const isMisc = pallet.type?.toUpperCase() === "MISC";

  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-l-2 border-l-transparent hover:border-l-primary bg-card hover:bg-muted/50 transition-colors duration-150">
      {pallet.grade && (
        <Badge variant={isLowGrade ? "destructive" : "secondary"} className="uppercase">
          {pallet.grade}
        </Badge>
      )}
      <span className="font-mono font-bold text-foreground uppercase">{pallet.pallet_number}</span>
      <span className="text-sm text-muted-foreground uppercase flex-1 truncate">
        {getDisplayDescription()}
        {!isHistory && pallet.notes && (
          <span className="text-xs italic normal-case"> - {pallet.notes}</span>
        )}
      </span>

      {!isMisc && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {isHistory && pallet.retired_at ? (
            <>
              {formatDate(pallet.created_at)} - <span className="font-bold underline">{formatDate(pallet.retired_at)}</span>
            </>
          ) : formatDate(pallet.created_at)}
        </span>
      )}

      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {!isHistory ? (
          <>
            <Button size="icon" variant="ghost" onClick={() => onEdit(pallet)} className="h-8 w-8 hover:bg-muted">
              <Pencil className="h-4 w-4" />
            </Button>
            {!isMisc && (
              <>
                <Button size="icon" variant="ghost" onClick={() => onRetire(pallet.id)} className="h-8 w-8 text-accent hover:bg-accent/10">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(pallet.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
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
