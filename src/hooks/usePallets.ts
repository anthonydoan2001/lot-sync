import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Pallet } from "@/types/database.types";
import { palletService } from "@/services/palletService";
import { categorizePallets } from "@/utils/sorting";
import { PalletCategory } from "@/constants/categories";

interface UsePalletsReturn {
  pallets: Pallet[];
  filteredPallets: Pallet[];
  categorizedPallets: Record<PalletCategory, Pallet[]>;
  loading: boolean;
  mutatingId: string | null;
  mutatingAction: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addPallet: (data: Partial<Pallet>) => Promise<boolean>;
  updatePallet: (id: string, data: Partial<Pallet>) => Promise<boolean>;
  retirePallet: (id: string) => Promise<boolean>;
  unretirePallet: (id: string) => Promise<boolean>;
  deletePallet: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function usePallets(viewMode: "active" | "history"): UsePalletsReturn {
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutatingAction, setMutatingAction] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const isHistory = viewMode === "history";

  const fetchPallets = useCallback(async () => {
    if (!initialLoadDone.current) setLoading(true);
    const data = await palletService.fetchPallets(isHistory);
    setPallets(data);
    setLoading(false);
    initialLoadDone.current = true;
  }, [isHistory]);

  useEffect(() => {
    fetchPallets();
  }, [fetchPallets]);

  const filteredPallets = useMemo(
    () =>
      pallets.filter((pallet) =>
        pallet.pallet_number.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [pallets, searchQuery],
  );

  const categorizedPallets = useMemo(
    () => categorizePallets(filteredPallets),
    [filteredPallets],
  );

  const addPallet = useCallback(
    async (data: Partial<Pallet>) => {
      setMutatingId("__new__");
      setMutatingAction("add");
      try {
        const success = await palletService.addPallet(data);
        if (success) await fetchPallets();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchPallets],
  );

  const updatePallet = useCallback(
    async (id: string, data: Partial<Pallet>) => {
      setMutatingId(id);
      setMutatingAction("update");
      try {
        const success = await palletService.updatePallet(id, data);
        if (success) await fetchPallets();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchPallets],
  );

  const retirePallet = useCallback(
    async (id: string) => {
      setMutatingId(id);
      setMutatingAction("retire");
      try {
        const success = await palletService.retirePallet(id);
        if (success) await fetchPallets();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchPallets],
  );

  const unretirePallet = useCallback(
    async (id: string) => {
      setMutatingId(id);
      setMutatingAction("unretire");
      try {
        const success = await palletService.unretirePallet(id);
        if (success) await fetchPallets();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchPallets],
  );

  const deletePallet = useCallback(
    async (id: string) => {
      setMutatingId(id);
      setMutatingAction("delete");
      try {
        const success = await palletService.deletePallet(id);
        if (success) await fetchPallets();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchPallets],
  );

  return {
    pallets,
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
    refetch: fetchPallets,
  };
}
