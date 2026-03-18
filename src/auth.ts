export type UserRole = "ADM" | "USR";

export type AuthState = {
    email: string;
    isLoggedIn: boolean;
    role: UserRole | null;
};

export const defaultAuthState: AuthState = {
    email: "",
    isLoggedIn: false,
    role: null
};

export const AUTH_STORAGE_KEY = "swiprojekt-auth";
