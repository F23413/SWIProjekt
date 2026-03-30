export type UserRole = "ADM" | "USR";

export type AuthState = {
    employeeId: number | null;
    email: string;
    isLoggedIn: boolean;
    role: UserRole | null;
};

export const defaultAuthState: AuthState = {
    employeeId: null,
    email: "",
    isLoggedIn: false,
    role: null
};

export const AUTH_STORAGE_KEY = "swiprojekt-auth";
