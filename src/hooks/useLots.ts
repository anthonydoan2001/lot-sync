import { useState, useEffect, useMemo, useCallback } from "react";
import { Lot } from "@/types/database.types";
import { lotService } from "@/services/lotService";

interface UseLotsReturn {
  lots: Lot[];
  filteredLots: Lot[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addLot: (data: Partial<Lot>) => Promise<boolean>;
  updateLot: (id: string, data: Partial<Lot>) => Promise<boolean>;
  retireLot: (id: string) => Promise<boolean>;
  unretireLot: (id: string) => Promise<boolean>;
  deleteLot: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useLots(
  viewMode: "active" | "history",
  isAuthenticated: boolean
): UseLotsReturn {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isHistory = viewMode === "history";

  const fetchLots = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const data = await lotService.fetchLots(isHistory);
    setLots(data);
    setLoading(false);
  }, [isHistory, isAuthenticated]);

  // Initial fetch
  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  // Real-time subscription
  useEffect(() => {
    if (!isAuthenticated) return;
    return lotService.subscribeToChanges(fetchLots);
  }, [isHistory, isAuthenticated, fetchLots]);

  // Filter lots by search query
  const filteredLots = useMemo(
    () =>
      lots.filter((lot) =>
        lot.lot_number.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [lots, searchQuery]
  );

  // CRUD operations
  const addLot = useCallback(async (data: Partial<Lot>) => {
    return lotService.addLot(data);
  }, []);

  const updateLot = useCallback(async (id: string, data: Partial<Lot>) => {
    return lotService.updateLot(id, data);
  }, []);

  const retireLot = useCallback(async (id: string) => {
    return lotService.retireLot(id);
  }, []);

  const unretireLot = useCallback(async (id: string) => {
    return lotService.unretireLot(id);
  }, []);

  const deleteLot = useCallback(async (id: string) => {
    return lotService.deleteLot(id);
  }, []);

  return {
    lots,
    filteredLots,
    loading,
    searchQuery,
    setSearchQuery,
    addLot,
    updateLot,
    retireLot,
    unretireLot,
    deleteLot,
    refetch: fetchLots,
  };
}
