import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Pallet, Lot } from "@/types/database.types";
import { PalletCard } from "@/components/PalletCard";
import { LotCard } from "@/components/LotCard";
import { PalletModal } from "@/components/PalletModal";
import { LotModal } from "@/components/LotModal";
import { PalletListView } from "@/components/PalletListView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, List, Edit, LogOut, Package, Box } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type PalletCategory = "DESKTOPS" | "LAPTOPS" | "DISPLAYS" | "WORKSTATIONS" | "CHROMEBOOKS" | "OTHER";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"active" | "history">("active");
  const [activeTab, setActiveTab] = useState<"pallets" | "lots">("pallets");
  const [palletViewMode, setPalletViewMode] = useState<"card" | "list">("card");

  const [palletModalOpen, setPalletModalOpen] = useState(false);
  const [lotModalOpen, setLotModalOpen] = useState(false);
  const [editingPallet, setEditingPallet] = useState<Pallet | null>(null);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<"pallet" | "lot">("pallet");

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Helper function to categorize pallets
  const categorizePallet = (pallet: Pallet): PalletCategory => {
    if (!pallet.type) return "OTHER";
    return pallet.type as PalletCategory;
  };

  // Fetch pallets
  const fetchPallets = async () => {
    const { data, error } = await supabase
      .from("pallets")
      .select("*")
      .eq("is_retired", viewMode === "history")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch pallets");
      console.error(error);
    } else {
      setPallets(data || []);
    }
  };

  // Fetch lots
  const fetchLots = async () => {
    const { data, error } = await supabase
      .from("lots")
      .select("*")
      .eq("is_retired", viewMode === "history")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch lots");
      console.error(error);
    } else {
      setLots(data || []);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchPallets();
      fetchLots();
    }
  }, [viewMode, user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const palletChannel = supabase
      .channel("pallets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pallets",
        },
        () => {
          fetchPallets();
        },
      )
      .subscribe();

    const lotChannel = supabase
      .channel("lots-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lots",
        },
        () => {
          fetchLots();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(palletChannel);
      supabase.removeChannel(lotChannel);
    };
  }, [viewMode, user]);

  // Filter data based on search
  const filteredPallets = pallets.filter((pallet) =>
    pallet.pallet_number.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredLots = lots.filter((lot) => lot.lot_number.toLowerCase().includes(searchQuery.toLowerCase()));

  // Define sort orders for each category
  const DESKTOP_SORT_ORDER = ["B/C 1-2ND GEN", "B/C 3RD GEN", "B/C 4TH GEN", "B/C 5-7TH GEN", "B/C ↑ 8TH GEN", "OTHER", "D/F"];
  const LAPTOP_SORT_ORDER = ["B/C ↓ 4TH GEN", "B/C ↑ 5TH GEN", "D/F", "OTHER"];
  const DISPLAY_SORT_ORDER = ["B LCD", "CLCD", "OTHER"];
  const CHROMEBOOK_SORT_ORDER = ["B/C MANAGED", "B/C NON-MANAGED", "D", "F", "OTHER"];

  // Function to sort pallets within a category
  const sortPalletsByDescription = (pallets: Pallet[], category: PalletCategory): Pallet[] => {
    let sortOrder: string[] = [];

    switch (category) {
      case "DESKTOPS":
        sortOrder = DESKTOP_SORT_ORDER;
        break;
      case "LAPTOPS":
        sortOrder = LAPTOP_SORT_ORDER;
        break;
      case "DISPLAYS":
        sortOrder = DISPLAY_SORT_ORDER;
        break;
      case "CHROMEBOOKS":
        sortOrder = CHROMEBOOK_SORT_ORDER;
        break;
      case "WORKSTATIONS":
      case "OTHER":
        return [...pallets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return pallets;
    }

    return [...pallets].sort((a, b) => {
      const aDesc = a.description?.toUpperCase() || "OTHER";
      const bDesc = b.description?.toUpperCase() || "OTHER";

      const aIndex = sortOrder.indexOf(aDesc);
      const bIndex = sortOrder.indexOf(bDesc);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  // Group pallets by category
  const categorizedPallets = filteredPallets.reduce(
    (acc, pallet) => {
      const category = categorizePallet(pallet);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(pallet);
      return acc;
    },
    {} as Record<PalletCategory, Pallet[]>,
  );

  // Sort pallets within each category
  Object.keys(categorizedPallets).forEach((category) => {
    categorizedPallets[category as PalletCategory] = sortPalletsByDescription(
      categorizedPallets[category as PalletCategory],
      category as PalletCategory,
    );
  });

  // Define category order
  const categoryOrder: PalletCategory[] = ["DESKTOPS", "LAPTOPS", "DISPLAYS", "WORKSTATIONS", "CHROMEBOOKS", "OTHER"];

  // Pallet operations
  const handleAddPallet = async (data: Partial<Pallet>) => {
    const { error } = await supabase.from("pallets").insert([data as any]);

    if (error) {
      toast.error("Failed to add pallet");
      console.error(error);
    } else {
      toast.success("Pallet added successfully");
      setPalletModalOpen(false);
      setActiveTab("pallets");
    }
  };

  const handleEditPallet = async (data: Partial<Pallet>) => {
    if (!editingPallet) return;

    const { error } = await supabase.from("pallets").update(data).eq("id", editingPallet.id);

    if (error) {
      toast.error("Failed to update pallet");
      console.error(error);
    } else {
      toast.success("Pallet updated successfully");
      setPalletModalOpen(false);
      setEditingPallet(null);
    }
  };

  const handleRetirePallet = async (id: string) => {
    const { error } = await supabase
      .from("pallets")
      .update({ is_retired: true, retired_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to retire pallet");
      console.error(error);
    } else {
      toast.success("Pallet retired successfully");
    }
  };

  const handleUnretirePallet = async (id: string) => {
    const { error } = await supabase.from("pallets").update({ is_retired: false, retired_at: null }).eq("id", id);

    if (error) {
      toast.error("Failed to unretire pallet");
      console.error(error);
    } else {
      toast.success("Pallet unretired successfully");
    }
  };

  const handleDeletePallet = async () => {
    if (!deletingId) return;

    const { error } = await supabase.from("pallets").delete().eq("id", deletingId);

    if (error) {
      toast.error("Failed to delete pallet");
      console.error(error);
    } else {
      toast.success("Pallet deleted successfully");
    }

    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  // Lot operations
  const handleAddLot = async (data: Partial<Lot>) => {
    const { error } = await supabase.from("lots").insert([data as any]);

    if (error) {
      toast.error("Failed to add lot");
      console.error(error);
    } else {
      toast.success("Lot added successfully");
      setLotModalOpen(false);
      setActiveTab("lots");
    }
  };

  const handleEditLot = async (data: Partial<Lot>) => {
    if (!editingLot) return;

    const { error } = await supabase.from("lots").update(data).eq("id", editingLot.id);

    if (error) {
      toast.error("Failed to update lot");
      console.error(error);
    } else {
      toast.success("Lot updated successfully");
      setLotModalOpen(false);
      setEditingLot(null);
    }
  };

  const handleRetireLot = async (id: string) => {
    const { error } = await supabase
      .from("lots")
      .update({ is_retired: true, retired_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to retire lot");
      console.error(error);
    } else {
      toast.success("Lot retired successfully");
    }
  };

  const handleUnretireLot = async (id: string) => {
    const { error } = await supabase.from("lots").update({ is_retired: false, retired_at: null }).eq("id", id);

    if (error) {
      toast.error("Failed to unretire lot");
      console.error(error);
    } else {
      toast.success("Lot unretired successfully");
    }
  };

  const handleDeleteLot = async () => {
    if (!deletingId) return;

    const { error } = await supabase.from("lots").delete().eq("id", deletingId);

    if (error) {
      toast.error("Failed to delete lot");
      console.error(error);
    } else {
      toast.success("Lot deleted successfully");
    }

    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {palletViewMode === "list" && activeTab === "pallets" ? (
        /* List View - Minimal UI */
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              onClick={() => setPalletViewMode("card")}
              variant="outline"
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Mode
            </Button>
          </div>
          <PalletListView pallets={filteredPallets} />
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="border-b bg-card/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                    Inventory Manager
                  </h1>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "active" ? "default" : "outline"}
                      onClick={() => setViewMode("active")}
                      size="lg"
                      className="font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Active
                    </Button>
                    <Button
                      variant={viewMode === "history" ? "default" : "outline"}
                      onClick={() => setViewMode("history")}
                      size="lg"
                      className="font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      History
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 items-center w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-base shadow-md focus:shadow-lg transition-all duration-300"
                    />
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="lg"
                    className="flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
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
                      className="flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
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

              {/* Pallets Tab */}
              <TabsContent value="pallets" className="mt-6">
                {filteredPallets.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl text-muted-foreground">No pallets found</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {categoryOrder.map((category) => {
                      const categoryPallets = categorizedPallets[category];
                      if (!categoryPallets || categoryPallets.length === 0) return null;

                      return (
                        <div
                          key={category}
                          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                        >
                          <div className="flex items-center gap-4 pb-4 border-b-2 border-primary/20">
                            <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full" />
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
                              {category}
                            </h2>
                            <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                              {categoryPallets.length}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {categoryPallets.map((pallet, index) => (
                              <div
                                key={pallet.id}
                                className="animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <PalletCard
                                  pallet={pallet}
                                  onEdit={(p) => {
                                    setEditingPallet(p);
                                    setPalletModalOpen(true);
                                  }}
                                  onRetire={handleRetirePallet}
                                  onUnretire={handleUnretirePallet}
                                  onDelete={(id) => {
                                    setDeletingId(id);
                                    setDeletingType("pallet");
                                    setDeleteDialogOpen(true);
                                  }}
                                  isHistory={viewMode === "history"}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Lots Tab */}
              <TabsContent value="lots" className="mt-6">
                {filteredLots.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                      <Box className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl text-muted-foreground">No lots found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredLots.map((lot, index) => (
                      <div
                        key={lot.id}
                        className="animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <LotCard
                          lot={lot}
                          onEdit={(l) => {
                            setEditingLot(l);
                            setLotModalOpen(true);
                          }}
                          onRetire={handleRetireLot}
                          onUnretire={handleUnretireLot}
                          onDelete={(id) => {
                            setDeletingId(id);
                            setDeletingType("lot");
                            setDeleteDialogOpen(true);
                          }}
                          isHistory={viewMode === "history"}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </>
      )}

      {/* Modals */}
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

      {/* Delete Confirmation Dialog */}
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
