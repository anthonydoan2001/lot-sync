import { useState, useEffect, useMemo, useCallback } from "react";
import { Pallet } from "@/types/database.types";
import { palletService } from "@/services/palletService";
import { categorizePallets } from "@/utils/sorting";
import { PalletCategory } from "@/constants/categories";

interface UsePalletsReturn {
  pallets: Pallet[];
  filteredPallets: Pallet[];
  categorizedPallets: Record<PalletCategory, Pallet[]>;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addPallet: (data: Partial<Pallet>) => Promise<boolean>;
  updatePallet: (id: string, data: Partial<Pallet>) => Promise<boolean>;
  retirePallet: (id: string) => Promise<boolean>;
  unretirePallet: (id: string) => Promise<boolean>;
  deletePallet: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function usePallets(
  viewMode: "active" | "history",
  isAuthenticated: boolean
): UsePalletsReturn {
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isHistory = viewMode === "history";

  const fetchPallets = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const data = await palletService.fetchPallets(isHistory);
    setPallets(data);
    setLoading(false);
  }, [isHistory, isAuthenticated]);

  // Initial fetch
  useEffect(() => {
    fetchPallets();
  }, [fetchPallets]);

  // Real-time subscription
  useEffect(() => {
    if (!isAuthenticated) return;
    return palletService.subscribeToChanges(fetchPallets);
  }, [isHistory, isAuthenticated, fetchPallets]);

  // Filter pallets by search query
  const filteredPallets = useMemo(
    () =>
      pallets.filter((pallet) =>
        pallet.pallet_number.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [pallets, searchQuery]
  );

  // Categorize and sort pallets
  const categorizedPallets = useMemo(
    () => categorizePallets(filteredPallets),
    [filteredPallets]
  );

  // CRUD operations
  const addPallet = useCallback(async (data: Partial<Pallet>) => {
    return palletService.addPallet(data);
  }, []);

  const updatePallet = useCallback(async (id: string, data: Partial<Pallet>) => {
    return palletService.updatePallet(id, data);
  }, []);

  const retirePallet = useCallback(async (id: string) => {
    return palletService.retirePallet(id);
  }, []);

  const unretirePallet = useCallback(async (id: string) => {
    return palletService.unretirePallet(id);
  }, []);

  const deletePallet = useCallback(async (id: string) => {
    return palletService.deletePallet(id);
  }, []);

  return {
    pallets,
    filteredPallets,
    categorizedPallets,
    loading,
    searchQuery,
    setSearchQuery,
    addPallet,
    updatePallet,
    retirePallet,
    unretirePallet,
    deletePallet,
    refetch: fetchPallets,
  };
}
