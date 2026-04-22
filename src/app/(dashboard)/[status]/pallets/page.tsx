"use client";

import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import { Pallet } from "@/types/database.types";
import { groupByRetiredMonth } from "@/utils/formatting";
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
import { Plus, List, Edit, Package, Search, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePallets } from "@/hooks/usePallets";
import { CATEGORY_ORDER } from "@/constants/categories";
import { PalletCard, PalletListView, PalletModal } from "@/components/pallets";
import { AnnouncementBanner } from "@/components/announcements";

export default function PalletsPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = use(params);

  if (status !== "active" && status !== "history") {
    notFound();
  }

  const viewMode = status as "active" | "history";

  return <PalletsContent viewMode={viewMode} />;
}

function PalletsContent({ viewMode }: { viewMode: "active" | "history" }) {
  const { user } = useAuth();
  const [palletViewMode, setPalletViewMode] = useState<"card" | "list">("card");
  const [palletModalOpen, setPalletModalOpen] = useState(false);
  const [editingPallet, setEditingPallet] = useState<Pallet | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    filteredPallets,
    categorizedPallets,
    loading,
    mutatingId,
    mutatingAction,
    searchQuery,
    setSearchQuery,
    addPallet,
    updatePallet,
    retirePallet,
    unretirePallet,
    deletePallet,
  } = usePallets(viewMode, !!user);

  const isSubmitting = mutatingAction === "add" || mutatingAction === "update";

  const palletMonthGroups = useMemo(
    () => (viewMode === "history" ? groupByRetiredMonth(filteredPallets) : []),
    [viewMode, filteredPallets],
  );

  const handleAddPallet = async (data: Partial<Pallet>) => {
    const success = await addPallet(data);
    if (success) setPalletModalOpen(false);
  };

  const handleEditPallet = async (data: Partial<Pallet>) => {
    if (!editingPallet) return;
    const success = await updatePallet(editingPallet.id, data);
    if (success) {
      setPalletModalOpen(false);
      setEditingPallet(null);
    }
  };

  const handleDeletePallet = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deletePallet(deletingId);
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } finally {
      setDeleting(false);
    }
  };

  const renderPalletCard = (pallet: Pallet, isHistory: boolean) => (
    <PalletCard
      key={pallet.id}
      pallet={pallet}
      onEdit={(p) => {
        setEditingPallet(p);
        setPalletModalOpen(true);
      }}
      onRetire={retirePallet}
      onUnretire={unretirePallet}
      onDelete={(id) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
      }}
      isHistory={isHistory}
      isMutating={mutatingId === pallet.id}
      mutatingAction={mutatingId === pallet.id ? mutatingAction : null}
    />
  );

  if (palletViewMode === "list") {
    return (
      <div>
        <div className="mb-6">
          <Button
            onClick={() => setPalletViewMode("card")}
            variant="outline"
            size="lg"
            className="transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Mode
          </Button>
        </div>
        <PalletListView pallets={filteredPallets} />
      </div>
    );
  }

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
          <Button
            onClick={() => setPalletViewMode("list")}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            <List className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">List View</span>
          </Button>

          {viewMode === "active" && (
            <Button
              onClick={() => {
                setEditingPallet(null);
                setPalletModalOpen(true);
              }}
              size="sm"
              className="bg-secondary hover:bg-secondary/90 flex-shrink-0"
            >
              <Plus className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Add Pallet</span>
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
      ) : filteredPallets.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/70 mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-2xl font-medium text-muted-foreground">
            No pallets found
          </p>
          <p className="text-lg text-muted-foreground/70 mt-2">
            {viewMode === "active"
              ? "Add your first pallet to get started"
              : "No archived pallets yet"}
          </p>
          {viewMode === "active" && (
            <Button
              variant="ghost"
              className="mt-4 text-muted-foreground"
              onClick={() => {
                setEditingPallet(null);
                setPalletModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Pallet
            </Button>
          )}
        </div>
      ) : viewMode === "history" ? (
        <div className="space-y-12">
          {palletMonthGroups.map((group) => (
            <div key={group.label} className="space-y-4">
              <div className="flex items-center gap-3 border-l-4 border-l-primary pl-4 pb-2">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                  {group.label}
                </h2>
                <span className="text-base font-semibold bg-primary/10 text-primary px-3 py-0.5 rounded-full">
                  {group.items.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {group.items.map((pallet) => renderPalletCard(pallet, true))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {CATEGORY_ORDER.map((category) => {
            const categoryPallets = categorizedPallets[category];
            if (!categoryPallets || categoryPallets.length === 0) return null;

            return (
              <div key={category} className="space-y-4">
                {category !== "MISC" && (
                  <div className="flex items-center gap-3 border-l-4 border-l-primary pl-4 pb-2">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                      {category === "AIO" ? "ALL-IN-ONE" : category}
                    </h2>
                    <span className="text-base font-semibold bg-primary/10 text-primary px-3 py-0.5 rounded-full">
                      {categoryPallets.length}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {categoryPallets.map((pallet) => renderPalletCard(pallet, false))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PalletModal
        open={palletModalOpen}
        onClose={() => {
          setPalletModalOpen(false);
          setEditingPallet(null);
        }}
        onSubmit={editingPallet ? handleEditPallet : handleAddPallet}
        pallet={editingPallet}
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
              This action cannot be undone. This will permanently delete the
              pallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeletePallet();
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
