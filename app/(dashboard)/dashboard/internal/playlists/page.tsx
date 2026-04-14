"use client";

import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { toast } from "react-hot-toast";
import { Layers3, Search, Plus, Play, Pause, Clock, TrendingUp } from "lucide-react";
import {
  InternalPlaylistRow,
  InternalPlaylistStats,
  InternalPlaylistFilterOptions,
  internalPlaylistsService,
} from "@/src/projects/admin-dashboard/internal/services/internal-playlists.service";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import {
  previewPlaylistStats,
  previewPlaylistsRows,
  previewPlaylistFilterOptions,
  filterPreviewPlaylistRows,
} from "@/src/projects/admin-dashboard/internal/preview/internal-playlists.preview";

export default function InternalPlaylistsPage() {
  const { previewMode } = useInternalPreviewMode();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InternalPlaylistStats | null>(null);
  const [rows, setRows] = useState<InternalPlaylistRow[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    scheduling_type: "",
  });
  const deferredSearch = useDeferredValue(search);
  const [filterOptions, setFilterOptions] = useState<InternalPlaylistFilterOptions | null>(null);

  const loadPlaylists = async () => {
    if (previewMode) {
      setStats(previewPlaylistStats);
      setRows(filterPreviewPlaylistRows(previewPlaylistsRows, filters));
      setFilterOptions(previewPlaylistFilterOptions);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [statsData, playlistsData, optionsData] = await Promise.all([
        internalPlaylistsService.getStats(),
        internalPlaylistsService.getPlaylists({
          search: deferredSearch || undefined,
          status: filters.status || undefined,
          scheduling_type: filters.scheduling_type || undefined,
        }),
        internalPlaylistsService.getFilterOptions(),
      ]);
      setStats(statsData);
      setRows(playlistsData.results);
      setFilterOptions(optionsData);
    } catch (error) {
      console.error("Load playlists error", error);
      toast.error("Erreur lors du chargement des playlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, [previewMode, deferredSearch, filters.status, filters.scheduling_type]);

  const activeCount = stats?.active_playlists ?? 0;
  const totalCount = stats?.total_playlists ?? 0;
  const totalItems = stats?.total_items ?? 0;
  const activePercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  const filteredRows = useMemo(() => {
    if (previewMode) {
      return filterPreviewPlaylistRows(rows, {
        search: deferredSearch,
        ...filters,
      });
    }
    return rows;
  }, [rows, deferredSearch, filters, previewMode]);

  const handleStatusChange = async (playlistId: string, newStatus: string) => {
    if (previewMode) {
      toast("Mode preview: modification desactivee");
      return;
    }
    try {
      await internalPlaylistsService.updatePlaylist(playlistId, {
        status: newStatus as any,
      });
      toast.success("Statut mise a jour");
      await loadPlaylists();
    } catch (error) {
      toast.error("Erreur lors de la mise a jour");
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Total Playlists</p>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
            </div>
            <Layers3 className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Actifs</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-green-400">{activeCount}</p>
                <p className="text-sm text-slate-400">{activePercentage}%</p>
              </div>
            </div>
            <Play className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Total Items</p>
              <p className="text-2xl font-bold text-purple-400">{totalItems}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Moyenne Duree</p>
              <p className="text-2xl font-bold text-orange-400">
                {filteredRows.length > 0
                  ? formatDuration(Math.round(filteredRows.reduce((sum, p) => sum + p.duration_seconds, 0) / filteredRows.length))
                  : "—"}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-surface p-6 sm:p-7">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, code ou tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-white transition inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              {filterOptions?.statuses.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={filters.scheduling_type}
              onChange={(e) => setFilters({ ...filters, scheduling_type: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les types</option>
              {filterOptions?.scheduling_types.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Playlists List */}
      <div className="space-y-3">
        {loading ? (
          <div className="dashboard-surface p-8 text-center text-slate-400">Chargement...</div>
        ) : filteredRows.length === 0 ? (
          <div className="dashboard-surface p-8 text-center text-slate-400">Aucune playlist trouvee</div>
        ) : (
          filteredRows.map((row) => (
            <div key={row.id} className="dashboard-surface p-4 sm:p-5 hover:bg-slate-700/50 transition">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{row.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{row.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{row.code}</span>
                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{row.tenant_name}</span>
                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                          {row.items_count} items
                        </span>
                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                          {row.screens_count} ecrans
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Duree</p>
                      <p className="text-sm font-medium text-white">{formatDuration(row.duration_seconds)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Type</p>
                      <p className="text-sm font-medium text-white capitalize">
                        {row.scheduling_type === "time_based" ? "Horaire" : row.scheduling_type === "date_range" ? "Periode" : "Continu"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusChange(row.id, e.target.value)}
                      className={`flex-1 px-2 py-1 rounded text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        row.status === "active"
                          ? "bg-green-900/30 text-green-300"
                          : row.status === "paused"
                            ? "bg-orange-900/30 text-orange-300"
                            : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      <option value="active">Actif</option>
                      <option value="paused">Pause</option>
                      <option value="archived">Archive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
