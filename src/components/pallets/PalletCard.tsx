import { memo } from "react";
import { Pallet } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Pencil, Archive, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/utils/formatting";

interface PalletCardProps {
  pallet: Pallet;
  onEdit: (pallet: Pallet) => void;
  onRetire: (id: string) => void;
  onUnretire: (id: string) => void;
  onDelete: (id: string) => void;
  isHistory?: boolean;
  isMutating?: boolean;
  mutatingAction?: string | null;
}

export const PalletCard = memo(function PalletCard({
  pallet,
  onEdit,
  onRetire,
  onUnretire,
  onDelete,
  isHistory = false,
  isMutating = false,
  mutatingAction,
}: PalletCardProps) {
  const getDisplayDescription = () => {
    let desc = pallet.description;
    if (pallet.grade && desc.startsWith(pallet.grade)) {
      desc = desc.substring(pallet.grade.length).trim();
    }
    const typeUpper = pallet.type?.toUpperCase();
    const displayType =
      pallet.type && typeUpper !== "OTHER" && typeUpper !== "MISC"
        ? pallet.type
        : "";
    return `${desc} ${displayType}`.trim();
  };

  const isLowGrade =
    pallet.grade && ["D/F", "D", "F"].includes(pallet.grade.toUpperCase());
  const isMisc = pallet.type?.toUpperCase() === "MISC";

  return (
    <div className="group flex items-center gap-3 px-5 py-4 rounded-lg border border-l-2 border-l-border hover:border-l-primary bg-card hover:bg-muted/50 transition-colors duration-150">
      {pallet.grade && (
        <Badge
          variant={isLowGrade ? "destructive" : "secondary"}
          className="uppercase"
        >
          {pallet.grade}
        </Badge>
      )}
      <span className="font-mono text-lg font-bold text-foreground uppercase">
        {pallet.pallet_number}
      </span>
      <span className="text-base text-muted-foreground uppercase flex-1 truncate">
        {getDisplayDescription()}
        {!isHistory && pallet.notes && (
          <span className="text-sm italic normal-case"> - {pallet.notes}</span>
        )}
      </span>

      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {!isHistory ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(pallet)}
                  disabled={isMutating}
                  className="h-8 w-8 hover:bg-primary/15 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            {!isMisc && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRetire(pallet.id)}
                      disabled={isMutating}
                      className="h-8 w-8 text-accent hover:bg-accent/20"
                    >
                      {isMutating && mutatingAction === "retire" ? (
                        <Spinner size="sm" />
                      ) : (
                        <Archive className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Retire</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(pallet.id)}
                      disabled={isMutating}
                      className="h-8 w-8 text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </>
            )}
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUnretire(pallet.id)}
                disabled={isMutating}
              >
                {isMutating && mutatingAction === "unretire" ? (
                  <>
                    <Spinner size="sm" className="mr-1.5" />
                    Restoring...
                  </>
                ) : (
                  "Unretire"
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Restore pallet</TooltipContent>
          </Tooltip>
        )}
      </div>

      {!isMisc && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {isHistory && pallet.retired_at ? (
            <>
              {formatDate(pallet.created_at)} -{" "}
              <span className="font-bold underline">
                {formatDate(pallet.retired_at)}
              </span>
            </>
          ) : (
            formatDate(pallet.created_at)
          )}
        </span>
      )}
    </div>
  );
});
