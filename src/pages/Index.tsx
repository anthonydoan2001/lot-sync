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
import { Plus, List, Edit, Package, Box } from "lucide-react";
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-secondary/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {palletViewMode === "list" && activeTab === "pallets" ? (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              onClick={() => setPalletViewMode("card")}
              variant="outline"
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow duration-150"
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
                <TabsList className="shadow-md">
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
                      className="flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-150"
                    >
                      {palletViewMode === "card" ? (
                        <>
                          <List className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">List View</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 sm:mr-2" />
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
                        className="bg-secondary hover:bg-secondary/90 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add Pallet</span>
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingLot(null);
                          setLotModalOpen(true);
                        }}
                        className="bg-secondary hover:bg-secondary/90 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add Lot</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <TabsContent value="pallets" className="mt-6">
                {filteredPallets.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl text-muted-foreground">No pallets found</p>
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
                            <div className="flex items-center gap-3 pb-3 border-b border-border">
                              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                                {category === "AIO" ? "ALL-IN-ONE" : category}
                              </h2>
                              <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
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
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                      <Box className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl text-muted-foreground">No lots found</p>
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
        <AlertDialogContent className="shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deletingType}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
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
