export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  phone?: string;
  city?: string;
  address?: string;
  country?: string;
  bio?: string;
  is_verified: boolean;
}

export type ProfileUpdatePayload = Omit<UserProfile, "id" | "is_verified">;