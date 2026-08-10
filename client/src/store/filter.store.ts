import { create } from 'zustand';

interface FilterState {
  sportFilter: string | null;
  statusFilter: string | null;
  mapZoom: number;
  setSportFilter: (sport: string | null) => void;
  setStatusFilter: (status: string | null) => void;
  setMapZoom: (zoom: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  sportFilter: null,
  statusFilter: null,
  mapZoom: 13,
  setSportFilter: (sport) => set({ sportFilter: sport }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  resetFilters: () => set({ sportFilter: null, statusFilter: null }),
}));
