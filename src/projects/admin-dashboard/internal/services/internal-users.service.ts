import api from "@/src/core/api/axios";

export type InternalUserRole = "admin" | "super_admin";

export interface InternalUserRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  is_verified: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  role_key: InternalUserRole;
  created_at: string | null;
  last_login: string | null;
}

export interface InternalUsersStats {
  total_internal_users: number;
  active_internal_users: number;
  verified_internal_users: number;
  super_admins: number;
  admins: number;
  recent_30d: number;
}

export interface CreateInternalUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface UpdateInternalUserInput {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export const internalUsersService = {
  getStats: async () => {
    const response = await api.get("/internal/admin/users/stats");
    return response.data as InternalUsersStats;
  },

  getUsers: async (filters?: { search?: string; role?: InternalUserRole | ""; status?: "active" | "inactive" | "" }) => {
    const response = await api.get("/internal/admin/users", { params: filters });
    return response.data as { count: number; results: InternalUserRow[] };
  },

  createUser: async (payload: CreateInternalUserInput) => {
    const response = await api.post("/internal/admin/users", payload);
    return response.data as InternalUserRow;
  },

  updateUser: async (userId: string, payload: UpdateInternalUserInput) => {
    const response = await api.patch(`/internal/admin/users/${userId}`, payload);
    return response.data as InternalUserRow;
  },
};