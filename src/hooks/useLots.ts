import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Lot } from "@/types/database.types";
import { lotService } from "@/services/lotService";

interface UseLotsReturn {
  lots: Lot[];
  filteredLots: Lot[];
  loading: boolean;
  mutatingId: string | null;
  mutatingAction: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addLot: (data: Partial<Lot>) => Promise<boolean>;
  updateLot: (id: string, data: Partial<Lot>) => Promise<boolean>;
  retireLot: (id: string) => Promise<boolean>;
  unretireLot: (id: string) => Promise<boolean>;
  deleteLot: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useLots(viewMode: "active" | "history"): UseLotsReturn {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutatingAction, setMutatingAction] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const isHistory = viewMode === "history";

  const fetchLots = useCallback(async () => {
    if (!initialLoadDone.current) setLoading(true);
    const data = await lotService.fetchLots(isHistory);
    setLots(data);
    setLoading(false);
    initialLoadDone.current = true;
  }, [isHistory]);

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  const filteredLots = useMemo(
    () =>
      lots.filter((lot) =>
        lot.lot_number.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [lots, searchQuery],
  );

  const addLot = useCallback(
    async (data: Partial<Lot>) => {
      setMutatingId("__new__");
      setMutatingAction("add");
      try {
        const inserted = await lotService.addLot(data);
        if (!inserted) return false;
        await fetchLots();
        return true;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchLots],
  );

  const updateLot = useCallback(
    async (id: string, data: Partial<Lot>) => {
      setMutatingId(id);
      setMutatingAction("update");
      try {
        const success = await lotService.updateLot(id, data);
        if (success) await fetchLots();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchLots],
  );

  const retireLot = useCallback(
    async (id: string) => {
      setMutatingId(id);
      setMutatingAction("retire");
      try {
        const success = await lotService.retireLot(id);
        if (success) await fetchLots();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchLots],
  );

  const unretireLot = useCallback(
    async (id: string) => {
      setMutatingId(id);
      setMutatingAction("unretire");
      try {
        const success = await lotService.unretireLot(id);
        if (success) await fetchLots();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchLots],
  );

  const deleteLot = useCallback(
    async (id: string) => {
      setMutatingId(id);
      setMutatingAction("delete");
      try {
        const success = await lotService.deleteLot(id);
        if (success) await fetchLots();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchLots],
  );

  return {
    lots,
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
    refetch: fetchLots,
  };
}
