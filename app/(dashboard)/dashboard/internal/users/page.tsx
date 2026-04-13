"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle2, Plus, Search, ShieldCheck, Sparkles, UserCog, Users, XCircle } from "lucide-react";
import { internalAdminsPreview, internalPermissionMatrix, internalRoleCards } from "@/src/projects/admin-dashboard/internal/admin-console.data";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import {
  CreateInternalUserInput,
  InternalUserRole,
  InternalUserRow,
  InternalUsersStats,
  internalUsersService,
} from "@/src/projects/admin-dashboard/internal/services/internal-users.service";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { previewInternalUsersRows, previewInternalUsersStats } from "@/src/projects/admin-dashboard/internal/preview/internal-users.preview";

export default function InternalUsersPage() {
  const { previewMode } = useInternalPreviewMode();
  const { user } = useAuthStore();
  const canManageSuperAdmins = Boolean(user?.is_superuser);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InternalUsersStats | null>(null);
  const [rows, setRows] = useState<InternalUserRow[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<InternalUserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateInternalUserInput>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    is_active: true,
    is_verified: true,
    is_staff: true,
    is_superuser: false,
  });
  const deferredSearch = useDeferredValue(search);

  const loadUsers = async () => {
    if (previewMode) {
      const filtered = previewInternalUsersRows.filter((row) => {
        const matchesSearch = !deferredSearch || [row.email, row.first_name, row.last_name, row.phone].join(" ").toLowerCase().includes(deferredSearch.toLowerCase());
        const matchesRole = !roleFilter || row.role_key === roleFilter;
        const matchesStatus = !statusFilter || (statusFilter === "active" ? row.is_active : !row.is_active);
        return matchesSearch && matchesRole && matchesStatus;
      });
      setStats(previewInternalUsersStats);
      setRows(filtered);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        internalUsersService.getStats(),
        internalUsersService.getUsers({ search: deferredSearch || "", role: roleFilter, status: statusFilter }),
      ]);
      setStats(statsData);
      setRows(usersData.results);
    } catch (error) {
      console.error("Internal users load failed", error);
      toast.error("Impossible de charger les utilisateurs internes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [previewMode, deferredSearch, roleFilter, statusFilter]);

  const superAdminCount = stats?.super_admins ?? 0;
  const adminCount = stats?.admins ?? 0;
  const activeCount = stats?.active_internal_users ?? 0;

  const recentUsers = useMemo(() => rows.slice(0, 4), [rows]);

  const resetCreateForm = () => {
    setCreateForm({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      is_active: true,
      is_verified: true,
      is_staff: true,
      is_superuser: false,
    });
  };

  const handleCreateUser = async () => {
    if (!createForm.email || !createForm.password) {
      toast.error("Email et mot de passe sont requis");
      return;
    }

    if (previewMode) {
      toast("Mode preview: creation desactivee");
      return;
    }

    try {
      setCreating(true);
      await internalUsersService.createUser(createForm);
      toast.success("Utilisateur interne cree");
      resetCreateForm();
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Impossible de creer cet utilisateur");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (row: InternalUserRow, patch: Partial<InternalUserRow>) => {
    if (previewMode) {
      toast("Mode preview: modification desactivee");
      return;
    }

    try {
      setSavingId(row.id);
      await internalUsersService.updateUser(row.id, {
        first_name: patch.first_name ?? row.first_name,
        last_name: patch.last_name ?? row.last_name,
        phone: patch.phone ?? row.phone,
        is_active: patch.is_active ?? row.is_active,
        is_verified: patch.is_verified ?? row.is_verified,
        is_staff: patch.is_superuser ? true : (patch.is_staff ?? row.is_staff),
        is_superuser: patch.is_superuser ?? row.is_superuser,
      });
      toast.success("Utilisateur mis a jour");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Impossible de mettre a jour cet utilisateur");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="dashboard-surface p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white">
              <Sparkles size={14} /> Utilisateurs internes & droits
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Base propre pour gerer admins aujourd'hui et employes demain.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pour l'instant, l'espace est pense admin-first. Le modele prevoit deja qu'un admin puisse creer d'autres users,
              puis qu'on ouvre ensuite des droits plus fins pour les employes sans melanger tout le code du dashboard client.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Utilisateurs internes" value={stats?.total_internal_users ?? 0} description="Base admin exploitable" />
        <SummaryCard label="Super admins" value={superAdminCount} description="Gouvernance plateforme" />
        <SummaryCard label="Actifs" value={activeCount} description="Acces immediat" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {internalRoleCards.map((role) => (
          <article key={role.key} className="dashboard-surface p-5">
            <div className="inline-flex rounded-2xl bg-[#eef6e4] p-3 text-[#5f7f41]">
              <ShieldCheck size={18} />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950">{role.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{role.summary}</p>
            <div className="mt-5 space-y-2">
              {role.scope.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">{item}</div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="dashboard-surface p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Equipe admin</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Creation des autres users reservee aux bons niveaux</h2>
          <div className="mt-5 space-y-3">
            {internalAdminsPreview.map((admin) => (
              <div key={admin.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-950">{admin.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{admin.role}</p>
                  </div>
                  <div className="inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-700 border border-slate-200">{admin.focus}</div>
                </div>

                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                  <PermissionFlag label="Creer admins" ok={admin.canCreateAdmins} />
                  <PermissionFlag label="Creer clients" ok={admin.canCreateClients} />
                  <PermissionFlag label="Billing" ok={admin.canManageBilling} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-surface p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Matrice permissions</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Separer les droits pour eviter la dette plus tard</h2>
          <div className="mt-5 space-y-3">
            {internalPermissionMatrix.map((item) => (
              <div key={item.module} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1.1fr_0.3fr_0.3fr_0.3fr]">
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-2xl bg-white p-3 text-[#5f7f41] shadow-sm">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950">{item.module}</h3>
                  </div>
                </div>
                <MatrixCell label="Admin" ok={item.admin} />
                <MatrixCell label="Super" ok={item.superAdmin} />
                <MatrixCell label="Employe" ok={item.employee} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="dashboard-surface p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-2xl bg-[#eef6e4] p-3 text-[#5f7f41]">
              <Plus size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Creation</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Ajouter un utilisateur interne</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <input value={createForm.email} onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="email@qalyas.com" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={createForm.first_name} onChange={(e) => setCreateForm((prev) => ({ ...prev, first_name: e.target.value }))} placeholder="Prenom" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              <input value={createForm.last_name} onChange={(e) => setCreateForm((prev) => ({ ...prev, last_name: e.target.value }))} placeholder="Nom" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={createForm.phone || ""} onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Telephone" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              <input value={createForm.password} type="password" onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="Mot de passe initial" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            </div>
            <select
              value={createForm.is_superuser ? "super_admin" : "admin"}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  is_superuser: e.target.value === "super_admin",
                  is_staff: true,
                }))
              }
              disabled={!canManageSuperAdmins}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm disabled:opacity-60"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
              <label className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between gap-3">
                Actif
                <input type="checkbox" checked={Boolean(createForm.is_active)} onChange={(e) => setCreateForm((prev) => ({ ...prev, is_active: e.target.checked }))} />
              </label>
              <label className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between gap-3">
                Verifie
                <input type="checkbox" checked={Boolean(createForm.is_verified)} onChange={(e) => setCreateForm((prev) => ({ ...prev, is_verified: e.target.checked }))} />
              </label>
            </div>
            <button onClick={handleCreateUser} disabled={creating} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-600 disabled:opacity-50">
              <Plus size={14} />
              {creating ? "Creation..." : "Creer utilisateur"}
            </button>
          </div>
        </article>

        <article className="dashboard-surface p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Base interne</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Utilisateurs reels de la plateforme</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              {adminCount} admins • {superAdminCount} super admins
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Chercher email, nom ou telephone" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as InternalUserRole | "")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
              <option value="">Tous les roles</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "active" | "inactive" | "")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
              <option value="">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">Chargement des utilisateurs...</div>
          ) : rows.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">Aucun utilisateur interne pour ces filtres.</div>
          ) : (
            <div className="mt-5 space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black text-slate-950">{row.first_name || "-"} {row.last_name || ""}</h3>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${row.is_superuser ? "bg-slate-950 text-white" : "bg-white border border-slate-200 text-slate-700"}`}>
                          {row.role_key === "super_admin" ? "Super Admin" : "Admin"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{row.email}</p>
                      <p className="mt-1 text-xs text-slate-500">{row.phone || "Telephone non renseigne"}</p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3 xl:w-[420px]">
                      <label className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-700 flex items-center justify-between gap-3">
                        Actif
                        <input type="checkbox" checked={row.is_active} onChange={(e) => void handleUpdateUser(row, { is_active: e.target.checked })} disabled={savingId === row.id} />
                      </label>
                      <label className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-700 flex items-center justify-between gap-3">
                        Verifie
                        <input type="checkbox" checked={row.is_verified} onChange={(e) => void handleUpdateUser(row, { is_verified: e.target.checked })} disabled={savingId === row.id} />
                      </label>
                      <select
                        value={row.role_key}
                        onChange={(e) =>
                          void handleUpdateUser(row, {
                            is_superuser: e.target.value === "super_admin",
                            is_staff: true,
                          })
                        }
                        disabled={!canManageSuperAdmins || savingId === row.id}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-700 disabled:opacity-60"
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-surface p-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-2xl bg-[#eef6e4] p-3 text-[#5f7f41]">
            <UserCog size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Suite logique</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Etape suivante conseillee pour le code</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <NextStep title="Service users interne" text="Ajouter un vrai service API pour lister, creer et modifier les users internes." />
          <NextStep title="Roles persistants" text="Definir les roles backend et les permissions par module plutot que par simples flags visuels." />
          <NextStep title="Layouts admin dedies" text="Isoler encore davantage les composants admin si la plateforme grandit fortement." />
        </div>
      </section>

      {recentUsers.length > 0 && (
        <section className="dashboard-surface p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Nouveaux profils</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Derniers comptes internes ajoutes</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            {recentUsers.map((row) => (
              <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-950">{row.first_name || row.email}</p>
                <p className="mt-1 text-xs text-slate-500">{row.email}</p>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{row.role_key === "super_admin" ? "Super Admin" : "Admin"}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryCard({ label, value, description }: { label: string; value: number; description: string }) {
  return (
    <div className="dashboard-surface p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function PermissionFlag({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-slate-700">
      <div className="mb-2 flex justify-center">{ok ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-rose-500" />}</div>
      {label}
    </div>
  );
}

function MatrixCell({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <div className="mt-2 flex justify-center">{ok ? <CheckCircle2 size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-rose-500" />}</div>
    </div>
  );
}

function NextStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}