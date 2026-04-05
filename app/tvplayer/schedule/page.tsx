"use client";
import React, { useEffect, useState } from 'react';
import { useAdminScheduleStore } from '@/src/features/scheduler/store/admin.store';
import { Calendar, Plus, LayoutDashboard, Settings, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleForm from '../../../src/features/player/components/ScheduleForm';
import ScheduleTimeline from '../../../src/features/player/components/ScheduleTimeline';


interface Category {
  id: string;
  name: string;
}

interface AudioTrack {
  id: string;
  title: string;
}

interface Promotion {
  id: string;
  name: string;
}

export default function SchedulePage() {
  const { schedules, fetchSchedules, isLoading } = useAdminScheduleStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Mock data
  const mockCategories: Category[] = [
    { id: '1', name: 'Menu Matin' },
    { id: '2', name: 'Menu Midi' }
  ];
  const mockAudios: AudioTrack[] = [
    { id: '1', title: 'Jazz Soft' }
  ];
  const mockPromos: Promotion[] = [
    { id: '1', name: 'Promo Burger' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Calendar className="text-indigo-600" size={32} />
            Planning de Diffusion
          </h1>
          <p className="text-slate-500 font-medium">Contrôlez l'affichage de vos écrans en temps réel.</p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
        >
          {showForm ? <LayoutDashboard size={20} /> : <Plus size={20} />}
          {showForm ? "Retour au Dashboard" : "Ajouter un créneau"}
        </button>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <ScheduleForm 
                categories={mockCategories} 
                audios={mockAudios} 
                promos={mockPromos} 
              />
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-dashed border-slate-300">
                  <Loader2 className="animate-spin text-indigo-500 w-12 h-12 mb-4" />
                  <p className="text-slate-500 font-medium animate-pulse">Chargement de votre planning...</p>
                </div>
              ) : (
                <> {/* Fragment ouvert ici */}
                  <ScheduleTimeline />

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Règles actives</h3>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {schedules.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 italic">
                          Aucune planification configurée pour le moment.
                        </div>
                      ) : (
                        schedules.map((s) => (
                          <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                              <p className="font-bold text-slate-900">{s.label}</p>
                              <p className="text-sm text-slate-500 uppercase font-semibold">{s.category_ids}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded-lg text-slate-600">
                                {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                              </span>
                              <button className="text-slate-400 hover:text-indigo-600 p-2">
                                <Settings size={18} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </> /* Fragment fermé ici */
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}