"use client";

import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import { Lot } from "@/types/database.types";
import { groupByRetiredMonth, groupByIO } from "@/utils/formatting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Box, Search, AlertTriangle } from "lucide-react";
import { useLots } from "@/hooks/useLots";
import { LotCard, LotModal } from "@/components/lots";
import { AnnouncementBanner } from "@/components/announcements";

export default function LotsPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = use(params);

  if (status !== "active" && status !== "history") {
    notFound();
  }

  const viewMode = status as "active" | "history";

  return <LotsContent viewMode={viewMode} />;
}

function LotsContent({ viewMode }: { viewMode: "active" | "history" }) {
  const [lotModalOpen, setLotModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    filteredLots,
    loading,
    mutatingId,
    mutatingAction,
    searchQuery,
    setSearchQuery,
    addLot,
    updateLot,
    retireLot,
    unretireLot,
    deleteLot,
  } = useLots(viewMode);

  const isSubmitting = mutatingAction === "add" || mutatingAction === "update";

  const lotMonthGroups = useMemo(
    () =>
      viewMode === "history"
        ? groupByRetiredMonth(filteredLots).map((month) => ({
            ...month,
            ioGroups: groupByIO(month.items),
          }))
        : [],
    [viewMode, filteredLots],
  );

  const activeLotIOGroups = useMemo(
    () => (viewMode === "active" ? groupByIO(filteredLots) : []),
    [viewMode, filteredLots],
  );

  const handleAddLot = async (data: Partial<Lot>) => {
    const success = await addLot(data);
    if (success) setLotModalOpen(false);
  };

  const handleEditLot = async (data: Partial<Lot>) => {
    if (!editingLot) return;
    const success = await updateLot(editingLot.id, data);
    if (success) {
      setLotModalOpen(false);
      setEditingLot(null);
    }
  };

  const handleDeleteLot = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deleteLot(deletingId);
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } finally {
      setDeleting(false);
    }
  };

  const renderLotCard = (lot: Lot, isHistory: boolean) => (
    <LotCard
      key={lot.id}
      lot={lot}
      onEdit={(l) => {
        setEditingLot(l);
        setLotModalOpen(true);
      }}
      onRetire={retireLot}
      onUnretire={unretireLot}
      onDelete={(id) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
      }}
      isHistory={isHistory}
      isMutating={mutatingId === lot.id}
      mutatingAction={mutatingId === lot.id ? mutatingAction : null}
    />
  );

  return (
    <>
      {viewMode === "active" && <AnnouncementBanner />}

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 sm:w-80 sm:flex-none">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {viewMode === "active" && (
            <Button
              onClick={() => {
                setEditingLot(null);
                setLotModalOpen(true);
              }}
              size="sm"
              className="bg-secondary hover:bg-secondary/90 flex-shrink-0"
            >
              <Plus className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Add Lot</span>
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[60px] w-full rounded-lg" />
          ))}
        </div>
      ) : filteredLots.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/70 mb-4">
            <Box className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-2xl font-medium text-muted-foreground">
            No lots found
          </p>
          <p className="text-lg text-muted-foreground/70 mt-2">
            {viewMode === "active"
              ? "Add your first lot to get started"
              : "No archived lots yet"}
          </p>
          {viewMode === "active" && (
            <Button
              variant="ghost"
              className="mt-4 text-muted-foreground"
              onClick={() => {
                setEditingLot(null);
                setLotModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Lot
            </Button>
          )}
        </div>
      ) : viewMode === "history" ? (
        <div className="space-y-12">
          {lotMonthGroups.map((month) => (
            <div key={month.label} className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-l-primary pl-4 pb-2">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                  {month.label}
                </h2>
                <span className="text-base font-semibold bg-primary/10 text-primary px-3 py-0.5 rounded-full">
                  {month.items.length}
                </span>
              </div>
              <div className="space-y-6 pl-4">
                {month.ioGroups.map((ioGroup) => (
                  <div key={ioGroup.label} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
                        {ioGroup.label === "No IO"
                          ? ioGroup.label
                          : `IO-${ioGroup.label}`}
                      </h3>
                      <span className="text-sm font-medium bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full">
                        {ioGroup.items.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {ioGroup.items.map((lot) => renderLotCard(lot, true))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {activeLotIOGroups.map((ioGroup) => (
            <div key={ioGroup.label} className="space-y-4">
              <div className="flex items-center gap-3 border-l-4 border-l-primary pl-4 pb-2">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                  {ioGroup.label === "No IO"
                    ? ioGroup.label
                    : `IO-${ioGroup.label}`}
                </h2>
                <span className="text-base font-semibold bg-primary/10 text-primary px-3 py-0.5 rounded-full">
                  {ioGroup.items.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {ioGroup.items.map((lot) => renderLotCard(lot, false))}
              </div>
            </div>
          ))}
        </div>
      )}

      <LotModal
        open={lotModalOpen}
        onClose={() => {
          setLotModalOpen(false);
          setEditingLot(null);
        }}
        onSubmit={editingLot ? handleEditLot : handleAddLot}
        lot={editingLot}
        submitting={isSubmitting}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => { if (!deleting) setDeleteDialogOpen(open); }}>
        <AlertDialogContent className="border-destructive/20">
          <AlertDialogHeader>
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This action cannot be undone. This will permanently delete the lot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteLot();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
