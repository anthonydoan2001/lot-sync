import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Lot, Profile } from "@/types/database.types";
import { lotService } from "@/services/lotService";
import { lotWorkerService } from "@/services/lotWorkerService";

export interface LotWithWorkers extends Lot {
  workers: Profile[];
}

interface UseLotsReturn {
  lots: LotWithWorkers[];
  filteredLots: LotWithWorkers[];
  loading: boolean;
  mutatingId: string | null;
  mutatingAction: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addLot: (data: Partial<Lot>, userId?: string) => Promise<boolean>;
  updateLot: (id: string, data: Partial<Lot>) => Promise<boolean>;
  retireLot: (id: string) => Promise<boolean>;
  unretireLot: (id: string) => Promise<boolean>;
  deleteLot: (id: string) => Promise<boolean>;
  joinLot: (lotId: string, userId: string) => Promise<boolean>;
  leaveLot: (lotId: string, userId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useLots(
  viewMode: "active" | "history",
  isAuthenticated: boolean,
): UseLotsReturn {
  const [lots, setLots] = useState<LotWithWorkers[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutatingAction, setMutatingAction] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const isHistory = viewMode === "history";

  const fetchLots = useCallback(async () => {
    if (!isAuthenticated) return;
    if (!initialLoadDone.current) setLoading(true);
    const lotsData = await lotService.fetchLots(isHistory);

    // Fetch workers for all lots
    const lotIds = lotsData.map((l) => l.id);
    const workersMap = await lotWorkerService.getWorkersForLots(lotIds);

    const lotsWithWorkers: LotWithWorkers[] = lotsData.map((lot) => ({
      ...lot,
      workers: workersMap[lot.id] || [],
    }));

    setLots(lotsWithWorkers);
    setLoading(false);
    initialLoadDone.current = true;
  }, [isHistory, isAuthenticated]);

  // Initial fetch
  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  // Real-time subscription for lots and lot_workers
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubLots = lotService.subscribeToChanges(fetchLots);
    const unsubWorkers = lotWorkerService.subscribeToChanges(fetchLots);
    return () => {
      unsubLots();
      unsubWorkers();
    };
  }, [isHistory, isAuthenticated, fetchLots]);

  // Filter lots by search query
  const filteredLots = useMemo(
    () =>
      lots.filter((lot) =>
        lot.lot_number.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [lots, searchQuery],
  );

  // CRUD operations
  const addLot = useCallback(
    async (data: Partial<Lot>, userId?: string) => {
      setMutatingId("__new__");
      setMutatingAction("add");
      try {
        const inserted = await lotService.addLot(data);
        if (!inserted) return false;

        // Auto-join the creator as a worker
        if (userId) {
          await lotWorkerService.joinLot(inserted.id, userId);
        }
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

  const joinLot = useCallback(
    async (lotId: string, userId: string) => {
      setMutatingId(lotId);
      setMutatingAction("join");
      try {
        const success = await lotWorkerService.joinLot(lotId, userId);
        if (success) await fetchLots();
        return success;
      } finally {
        setMutatingId(null);
        setMutatingAction(null);
      }
    },
    [fetchLots],
  );

  const leaveLot = useCallback(
    async (lotId: string, userId: string) => {
      setMutatingId(lotId);
      setMutatingAction("leave");
      try {
        const success = await lotWorkerService.leaveLot(lotId, userId);
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
    joinLot,
    leaveLot,
    refetch: fetchLots,
  };
}
