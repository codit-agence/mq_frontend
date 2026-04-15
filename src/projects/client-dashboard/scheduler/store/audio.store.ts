// src/features/medialib/store/audio.store.ts
import { create } from 'zustand';
import api from '@/src/core/api/axios';

interface AudioTrack {
  id: string;
  title: string;
  file: string;
  duration?: number;
  category?: string;
  track_type?: string;
}

interface AudioState {
  tracks: AudioTrack[];
  fetchTracks: (tenantId?: string | null) => Promise<void>;
}

export const useAudioStore = create<AudioState>((set) => ({
  tracks: [],
  fetchTracks: async (tenantId) => {
    try {
      const res = await api.get('/medialib/audio', {
        headers: tenantId ? { 'X-Tenant-ID': tenantId } : undefined,
      });
      set({ tracks: res.data });
    } catch (error) {
      console.error("Erreur tracks:", error);
    }
  },
}));