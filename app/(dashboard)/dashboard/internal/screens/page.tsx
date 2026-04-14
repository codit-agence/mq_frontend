"use client";

import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { toast } from "react-hot-toast";
import { Monitor, Search, AlertCircle, CheckCircle2, Radio, TrendingUp } from "lucide-react";
import {
  InternalScreenRow,
  InternalScreenStats,
  InternalScreenFilterOptions,
  internalScreensService,
} from "@/src/projects/admin-dashboard/internal/services/internal-screens.service";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import {
  previewScreenStats,
  previewScreensRows,
  previewScreenFilterOptions,
  filterPreviewScreenRows,
} from "@/src/projects/admin-dashboard/internal/preview/internal-screens.preview";

export default function InternalScreensPage() {
  const { previewMode } = useInternalPreviewMode();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InternalScreenStats | null>(null);
  const [rows, setRows] = useState<InternalScreenRow[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    resolution: "",
    screen_group: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const [filterOptions, setFilterOptions] = useState<InternalScreenFilterOptions | null>(null);

  const loadScreens = async () => {
    if (previewMode) {
      setStats(previewScreenStats);
      setRows(filterPreviewScreenRows(previewScreensRows, filters));
      setFilterOptions(previewScreenFilterOptions);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [statsData, screensData, optionsData] = await Promise.all([
        internalScreensService.getStats(),
        internalScreensService.getScreens({
          search: deferredSearch || undefined,
          status: filters.status || undefined,
          resolution: filters.resolution || undefined,
          screen_group: filters.screen_group || undefined,
        }),
        internalScreensService.getFilterOptions(),
      ]);
      setStats(statsData);
      setRows(screensData.results);
      setFilterOptions(optionsData);
    } catch (error) {
      console.error("Load screens error", error);
      toast.error("Erreur lors du chargement des écrans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreens();
  }, [previewMode, deferredSearch, filters.status, filters.resolution, filters.screen_group]);

  const onlineCount = stats?.online_screens ?? 0;
  const offlineCount = stats?.offline_screens ?? 0;
  const totalCount = stats?.total_screens ?? 0;
  const onlinePercentage = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;

  const filteredRows = useMemo(() => {
    if (previewMode) {
      return filterPreviewScreenRows(rows, {
        search: deferredSearch,
        ...filters,
      });
    }
    return rows;
  }, [rows, deferredSearch, filters, previewMode]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadScreens();
      toast.success("Actualisation terminée");
    } catch (error) {
      toast.error("Erreur lors de l'actualisation");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Total Ecrans</p>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
            </div>
            <Monitor className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">En ligne</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-green-400">{onlineCount}</p>
                <p className="text-sm text-slate-400">{onlinePercentage}%</p>
              </div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Hors ligne</p>
              <p className="text-2xl font-bold text-orange-400">{offlineCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Temperature Moy.</p>
              <p className="text-2xl font-bold text-purple-400">
                {filteredRows.length > 0
                  ? Math.round(filteredRows.reduce((sum, r) => sum + (r.temperature ?? 0), 0) / filteredRows.length)
                  : 0}
                °C
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-surface p-6 sm:p-7">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, code ou tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded font-medium text-white transition"
            >
              {refreshing ? "..." : "Actualiser"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              value={filters.resolution}
              onChange={(e) => setFilters({ ...filters, resolution: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes resolutions</option>
              {filterOptions?.resolutions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={filters.screen_group}
              onChange={(e) => setFilters({ ...filters, screen_group: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les groupes</option>
              {filterOptions?.screen_groups.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Screens List */}
      <div className="dashboard-surface overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Ecran</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Tenant</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Statut</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Resolution</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Groupe</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">CPU / Temp</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Stockage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Chargement...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Aucun écran trouvé
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-700/50 transition">
                    <td className="px-4 py-3 text-white">
                      <div>
                        <p className="font-medium">{row.code}</p>
                        <p className="text-xs text-slate-400 truncate max-w-xs">{row.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{row.tenant_name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          row.status === "online"
                            ? "bg-green-900/30 text-green-300"
                            : row.status === "offline"
                              ? "bg-orange-900/30 text-orange-300"
                              : "bg-red-900/30 text-red-300"
                        }`}
                      >
                        <Radio className="h-3 w-3" />
                        {row.status === "online" ? "En ligne" : row.status === "offline" ? "Hors ligne" : "Erreur"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{row.resolution}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{row.screen_group}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">
                      {row.cpu_usage}% / {row.temperature}°C
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">
                      {row.storage_free ? `${Math.round(row.storage_free / 1024)} GB` : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
