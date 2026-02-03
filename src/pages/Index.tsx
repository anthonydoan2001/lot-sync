import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pallet, Lot } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, List, Edit, Package, Box, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePallets } from "@/hooks/usePallets";
import { useLots } from "@/hooks/useLots";
import { CATEGORY_ORDER } from "@/constants/categories";
import { Header } from "@/components/layout/Header";
import { PalletCard, PalletListView, PalletModal } from "@/components/pallets";
import { LotCard, LotModal } from "@/components/lots";
import { AnnouncementBanner } from "@/components/announcements";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  // View state
  const [viewMode, setViewMode] = useState<"active" | "history">("active");
  const [activeTab, setActiveTab] = useState<"pallets" | "lots">("pallets");
  const [palletViewMode, setPalletViewMode] = useState<"card" | "list">("card");

  // Modal state
  const [palletModalOpen, setPalletModalOpen] = useState(false);
  const [lotModalOpen, setLotModalOpen] = useState(false);
  const [editingPallet, setEditingPallet] = useState<Pallet | null>(null);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<"pallet" | "lot">("pallet");

  // Data hooks
  const {
    filteredPallets,
    categorizedPallets,
    searchQuery: palletSearchQuery,
    setSearchQuery: setPalletSearchQuery,
    addPallet,
    updatePallet,
    retirePallet,
    unretirePallet,
    deletePallet,
  } = usePallets(viewMode, !!user);

  const {
    filteredLots,
    searchQuery: lotSearchQuery,
    setSearchQuery: setLotSearchQuery,
    addLot,
    updateLot,
    retireLot,
    unretireLot,
    deleteLot,
  } = useLots(viewMode, !!user);

  // Combined search query
  const searchQuery = activeTab === "pallets" ? palletSearchQuery : lotSearchQuery;
  const setSearchQuery = activeTab === "pallets" ? setPalletSearchQuery : setLotSearchQuery;

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Handlers
  const handleAddPallet = async (data: Partial<Pallet>) => {
    const success = await addPallet(data);
    if (success) {
      setPalletModalOpen(false);
      setActiveTab("pallets");
    }
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
    await deletePallet(deletingId);
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleAddLot = async (data: Partial<Lot>) => {
    const success = await addLot(data);
    if (success) {
      setLotModalOpen(false);
      setActiveTab("lots");
    }
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
    await deleteLot(deletingId);
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  // Loading state - skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card/95 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-40 rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-72 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {palletViewMode === "list" && activeTab === "pallets" ? (
        <div className="container mx-auto px-4 py-8">
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
      ) : (
        <>
          <Header
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onLogout={handleLogout}
          />

          <main className="container mx-auto px-4 py-8">
            <AnnouncementBanner />
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pallets" | "lots")}>
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="pallets" className="gap-2">
                    <Package className="h-4 w-4" />
                    Pallets ({filteredPallets.length})
                  </TabsTrigger>
                  <TabsTrigger value="lots" className="gap-2">
                    <Box className="h-4 w-4" />
                    Lots ({filteredLots.length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {activeTab === "pallets" && (
                    <Button
                      onClick={() => setPalletViewMode(palletViewMode === "card" ? "list" : "card")}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {palletViewMode === "card" ? (
                        <>
                          <List className="h-4 w-4 sm:mr-1.5" />
                          <span className="hidden sm:inline">List View</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 sm:mr-1.5" />
                          <span className="hidden sm:inline">Edit Mode</span>
                        </>
                      )}
                    </Button>
                  )}

                  {viewMode === "active" && palletViewMode === "card" && (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              <TabsContent value="pallets" className="mt-6">
                {filteredPallets.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/70 mb-4">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl text-muted-foreground">No pallets found</p>
                    <p className="text-base text-muted-foreground/70 mt-1">
                      {viewMode === "active" ? "Add your first pallet to get started" : "No archived pallets yet"}
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
                  <div className="flex flex-col gap-2">
                    {filteredPallets.map((pallet) => (
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
                          setDeletingType("pallet");
                          setDeleteDialogOpen(true);
                        }}
                        isHistory={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-10">
                    {CATEGORY_ORDER.map((category) => {
                      const categoryPallets = categorizedPallets[category];
                      if (!categoryPallets || categoryPallets.length === 0) return null;

                      return (
                        <div
                          key={category}
                          className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                        >
                          {category !== "MISC" && (
                            <div className="flex items-center gap-3 border-l-4 border-l-primary pl-4 pb-2">
                              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                                {category === "AIO" ? "ALL-IN-ONE" : category}
                              </h2>
                              <span className="text-sm font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                                {categoryPallets.length}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            {categoryPallets.map((pallet) => (
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
                                  setDeletingType("pallet");
                                  setDeleteDialogOpen(true);
                                }}
                                isHistory={false}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="lots" className="mt-6">
                {filteredLots.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/70 mb-4">
                      <Box className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl text-muted-foreground">No lots found</p>
                    <p className="text-base text-muted-foreground/70 mt-1">
                      {viewMode === "active" ? "Add your first lot to get started" : "No archived lots yet"}
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
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredLots.map((lot) => (
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
                          setDeletingType("lot");
                          setDeleteDialogOpen(true);
                        }}
                        isHistory={viewMode === "history"}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </>
      )}

      <PalletModal
        open={palletModalOpen}
        onClose={() => {
          setPalletModalOpen(false);
          setEditingPallet(null);
        }}
        onSubmit={editingPallet ? handleEditPallet : handleAddPallet}
        pallet={editingPallet}
      />

      <LotModal
        open={lotModalOpen}
        onClose={() => {
          setLotModalOpen(false);
          setEditingLot(null);
        }}
        onSubmit={editingLot ? handleEditLot : handleAddLot}
        lot={editingLot}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-destructive/20">
          <AlertDialogHeader>
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This action cannot be undone. This will permanently delete the {deletingType}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deletingType === "pallet" ? handleDeletePallet : handleDeleteLot}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
