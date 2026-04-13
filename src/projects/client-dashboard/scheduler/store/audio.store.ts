// src/features/medialib/store/audio.store.ts
import { create } from 'zustand';
import api from '@/src/core/api/axios';

interface AudioTrack {
  id: string;
  title: string;
  file: string;
}

interface AudioState {
  tracks: AudioTrack[];
  fetchTracks: () => Promise<void>;
}

export const useAudioStore = create<AudioState>((set) => ({
  tracks: [],
  fetchTracks: async () => {
    try {
      const res = await api.get('/medialib/audio'); // Ajuste l'URL selon ton Swagger
      set({ tracks: res.data });
    } catch (error) {
      console.error("Erreur tracks:", error);
    }
  },
}));