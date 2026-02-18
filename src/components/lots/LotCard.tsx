import { memo } from "react";
import { LotWithWorkers } from "@/hooks/useLots";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Pencil, Archive, Trash2, UserPlus, UserMinus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/utils/formatting";

interface LotCardProps {
  lot: LotWithWorkers;
  onEdit: (lot: LotWithWorkers) => void;
  onRetire: (id: string) => void;
  onUnretire: (id: string) => void;
  onDelete: (id: string) => void;
  isHistory?: boolean;
  currentUserId?: string;
  onJoin?: (lotId: string) => void;
  onLeave?: (lotId: string) => void;
  isMutating?: boolean;
  mutatingAction?: string | null;
}

export const LotCard = memo(function LotCard({
  lot,
  onEdit,
  onRetire,
  onUnretire,
  onDelete,
  isHistory = false,
  currentUserId,
  onJoin,
  onLeave,
  isMutating = false,
  mutatingAction,
}: LotCardProps) {
  const workers = lot.workers || [];
  const isWorker = currentUserId
    ? workers.some((w) => w.id === currentUserId)
    : false;

  return (
    <div className="group flex items-center gap-3 px-5 py-4 rounded-lg border border-l-2 border-l-border hover:border-l-primary bg-card hover:bg-muted/50 transition-colors duration-150">
      <span className="font-mono text-lg font-bold text-foreground uppercase shrink-0">
        {lot.lot_number}
      </span>
      {lot.io && (
        <Badge variant="outline" className="text-sm font-medium shrink-0">
          IO-{lot.io}
        </Badge>
      )}
      <span className="text-base text-muted-foreground uppercase flex-1 truncate">
        {lot.contents}
      </span>

      {workers.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          {workers.map((worker) => (
            <Badge
              key={worker.id}
              variant={worker.id === currentUserId ? "default" : "secondary"}
              className="text-xs"
            >
              {worker.display_name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {!isHistory &&
          currentUserId &&
          (isWorker ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onLeave?.(lot.id)}
                  disabled={isMutating}
                  className="h-8 w-8 text-orange-500 hover:bg-orange-500/20"
                >
                  {isMutating && mutatingAction === "leave" ? (
                    <Spinner size="sm" />
                  ) : (
                    <UserMinus className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Leave lot</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onJoin?.(lot.id)}
                  disabled={isMutating}
                  className="h-8 w-8 text-green-600 hover:bg-green-600/20"
                >
                  {isMutating && mutatingAction === "join" ? (
                    <Spinner size="sm" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Join lot</TooltipContent>
            </Tooltip>
          ))}
        {!isHistory ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(lot)}
                  disabled={isMutating}
                  className="h-8 w-8 hover:bg-primary/15 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onRetire(lot.id)}
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
                  onClick={() => onDelete(lot.id)}
                  disabled={isMutating}
                  className="h-8 w-8 text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUnretire(lot.id)}
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
            <TooltipContent>Restore lot</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
        {isHistory && lot.retired_at ? (
          <>
            {formatDate(lot.created_at)} -{" "}
            <span className="font-bold underline">
              {formatDate(lot.retired_at)}
            </span>
          </>
        ) : (
          formatDate(lot.created_at)
        )}
      </span>
    </div>
  );
});
