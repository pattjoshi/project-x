export interface UserPublic {
  id: string;
  email: string;
  display_name: string;
  age_verified: boolean;
  is_admin: boolean;
}

export interface AuthResponse {
  user: UserPublic;
  access_token: string;
}
