export interface ProfileDetails {
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

export type ProfileUpdatePayload = Omit<ProfileDetails, "id" | "is_verified">;