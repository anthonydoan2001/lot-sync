import { Lot } from "@/types/database.types";
import { toast } from "sonner";

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function call<T>(path: string, init?: RequestInit): Promise<Envelope<T>> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  return (await res.json()) as Envelope<T>;
}

export const lotService = {
  fetchLots: async (isHistory: boolean): Promise<Lot[]> => {
    const env = await call<Lot[]>(`/api/lots?retired=${isHistory ? 1 : 0}`);
    if (!env.success) {
      toast.error(env.error ?? "Failed to fetch lots");
      return [];
    }
    return env.data ?? [];
  },

  addLot: async (data: Partial<Lot>): Promise<Lot | null> => {
    const env = await call<Lot>("/api/lots", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!env.success || !env.data) {
      toast.error(env.error ?? "Failed to add lot");
      return null;
    }
    toast.success("Lot added successfully");
    return env.data;
  },

  updateLot: async (id: string, data: Partial<Lot>): Promise<boolean> => {
    const env = await call<Lot>(`/api/lots/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!env.success) {
      toast.error(env.error ?? "Failed to update lot");
      return false;
    }
    toast.success("Lot updated successfully");
    return true;
  },

  retireLot: async (id: string): Promise<boolean> => {
    const env = await call<Lot>(`/api/lots/${id}/retire`, { method: "POST" });
    if (!env.success) {
      toast.error(env.error ?? "Failed to retire lot");
      return false;
    }
    toast.success("Lot retired successfully");
    return true;
  },

  unretireLot: async (id: string): Promise<boolean> => {
    const env = await call<Lot>(`/api/lots/${id}/unretire`, { method: "POST" });
    if (!env.success) {
      toast.error(env.error ?? "Failed to unretire lot");
      return false;
    }
    toast.success("Lot unretired successfully");
    return true;
  },

  deleteLot: async (id: string): Promise<boolean> => {
    const env = await call<null>(`/api/lots/${id}`, { method: "DELETE" });
    if (!env.success) {
      toast.error(env.error ?? "Failed to delete lot");
      return false;
    }
    toast.success("Lot deleted successfully");
    return true;
  },
};
