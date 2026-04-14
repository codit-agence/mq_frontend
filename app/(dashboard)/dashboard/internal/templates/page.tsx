"use client";

import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { toast } from "react-hot-toast";
import { LayoutTemplate, Search, Plus, Copy, Star, Eye, TrendingUp } from "lucide-react";
import {
  InternalTemplateRow,
  InternalTemplateStats,
  InternalTemplateFilterOptions,
  internalTemplatesService,
} from "@/src/projects/admin-dashboard/internal/services/internal-templates.service";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import {
  previewTemplateStats,
  previewTemplatesRows,
  previewTemplateFilterOptions,
  filterPreviewTemplateRows,
} from "@/src/projects/admin-dashboard/internal/preview/internal-templates.preview";

export default function InternalTemplatesPage() {
  const { previewMode } = useInternalPreviewMode();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InternalTemplateStats | null>(null);
  const [rows, setRows] = useState<InternalTemplateRow[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    resolution: "",
  });
  const deferredSearch = useDeferredValue(search);
  const [filterOptions, setFilterOptions] = useState<InternalTemplateFilterOptions | null>(null);

  const loadTemplates = async () => {
    if (previewMode) {
      setStats(previewTemplateStats);
      setRows(filterPreviewTemplateRows(previewTemplatesRows, { ...filters, search: deferredSearch }));
      setFilterOptions(previewTemplateFilterOptions);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [statsData, templatesData, optionsData] = await Promise.all([
        internalTemplatesService.getStats(),
        internalTemplatesService.getTemplates({
          search: deferredSearch || undefined,
          category: filters.category || undefined,
          resolution: filters.resolution || undefined,
        }),
        internalTemplatesService.getFilterOptions(),
      ]);
      setStats(statsData);
      setRows(templatesData.results);
      setFilterOptions(optionsData);
    } catch (error) {
      console.error("Load templates error", error);
      toast.error("Erreur lors du chargement des templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [previewMode, deferredSearch, filters.category, filters.resolution]);

  const totalCount = stats?.total_templates ?? 0;
  const totalVariants = stats?.total_variants ?? 0;

  const filteredRows = useMemo(() => {
    if (previewMode) {
      return filterPreviewTemplateRows(rows, {
        search: deferredSearch,
        ...filters,
      });
    }
    return rows;
  }, [rows, deferredSearch, filters, previewMode]);

  const handleDuplicate = async (templateId: string) => {
    if (previewMode) {
      toast("Mode preview: duplication desactivee");
      return;
    }
    try {
      await internalTemplatesService.duplicateTemplate(templateId);
      toast.success("Template duplique");
      await loadTemplates();
    } catch (error) {
      toast.error("Erreur lors de la duplication");
    }
  };

  const topUsedTemplates = useMemo(() => {
    return [...rows].sort((a, b) => b.usage_count - a.usage_count).slice(0, 3);
  }, [rows]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Total Templates</p>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
            </div>
            <LayoutTemplate className="h-8 w-8 text-cyan-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Total Variantes</p>
              <p className="text-2xl font-bold text-indigo-400">{totalVariants}</p>
            </div>
            <Copy className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Utilisation Moy.</p>
              <p className="text-2xl font-bold text-green-400">
                {rows.length > 0 ? Math.round(rows.reduce((sum, t) => sum + t.usage_count, 0) / rows.length) : 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="dashboard-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Systeme</p>
              <p className="text-2xl font-bold text-purple-400">
                {rows.filter((t) => t.is_system).length}
              </p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
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
              placeholder="Rechercher par nom ou code..."
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
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les categories</option>
              {filterOptions?.categories.map((opt) => (
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
          </div>
        </div>
      </div>

      {/* Top Used Templates */}
      {topUsedTemplates.length > 0 && (
        <div className="dashboard-surface p-6 sm:p-7">
          <h3 className="text-lg font-semibold text-white mb-4">Most Used Templates</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {topUsedTemplates.map((template) => (
              <div key={template.id} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white text-sm">{template.name}</p>
                  <Eye className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Usage:</span>
                  <span className="text-amber-400 font-semibold">{template.usage_count}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="dashboard-surface p-8 text-center text-slate-400">Chargement...</div>
        ) : filteredRows.length === 0 ? (
          <div className="dashboard-surface p-8 text-center text-slate-400">Aucun template trouve</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredRows.map((row) => (
              <div key={row.id} className="dashboard-surface p-4 hover:bg-slate-700/50 transition">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{row.name}</h3>
                      {row.is_system && <Star className="h-4 w-4 text-amber-500" />}
                    </div>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{row.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{row.code}</span>
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{row.category}</span>
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{row.resolution}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div>
                        <p className="text-xs text-slate-400">Variantes</p>
                        <p className="text-sm font-semibold text-white">{row.variants_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Usage</p>
                        <p className="text-sm font-semibold text-amber-400">{row.usage_count}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Duree</p>
                        <p className="text-sm font-semibold text-white">{row.recommended_duration_seconds}s</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDuplicate(row.id)}
                        className="flex-1 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded font-medium text-white transition inline-flex items-center justify-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Dupliquer
                      </button>
                      <button className="flex-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded font-medium text-white transition inline-flex items-center justify-center gap-1">
                        <Eye className="h-3 w-3" />
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
