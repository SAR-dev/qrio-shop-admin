import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from "react";
import PocketBase from "pocketbase";
import { useInterval, useLocalStorage } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import { Collections, TypedPocketBase, UsersResponse } from "../types/pocketbase";
import { constants } from "../constants";
import { setAuthToken } from "../helpers";

interface DecodedToken {
    exp: number; // Expiration timestamp in seconds
}

const ONE_MINUTE_IN_MS = 60000;

interface PocketContextType {
    adminLogin: (email: string, password: string) => Promise<void>;
    logout: () => void;
    user: UsersResponse | null;
    token: string | null;
}

// Initialize PocketBase with type safety
export const pb = new PocketBase(import.meta.env.VITE_API_URL) as TypedPocketBase;

// Create React context for PocketBase
const PocketContext = createContext<PocketContextType | undefined>(undefined);

// PocketBase Provider component
export const PocketProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useLocalStorage<string | null>(
        constants.AUTH_TOKEN_API,
        pb.authStore.token
    );
    const [user, setUser] = useState<UsersResponse | null>(
        pb.authStore.record as unknown as UsersResponse
    );

    // Clear local storage and PocketBase store on logout
    const logout = useCallback(() => {
        localStorage.clear();
        pb.authStore.clear();
        setUser(null);
        setAuthToken()
    }, []);

    // Handle OAuth login with error handling
    const adminLogin = useCallback(async (email: string, password: string) => {
        try {
            await pb.collection(Collections.Superusers).authWithPassword(email, password);
            setAuthToken()
        } catch (error) {
            console.error("Admin login failed:", error);
            throw error;
        }
    }, []);

    // Refresh the session token periodically
    const refreshSession = useCallback(async () => {
        if (!token || !pb.authStore.isValid) return;

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const tokenExpiration = decoded.exp ?? 0;
            const currentTimeInSeconds = Date.now() / 1000;

            // Refresh the token if it's close to expiration
            if (currentTimeInSeconds >= tokenExpiration - 5 * 60) {
                await pb.collection(Collections.Users).authRefresh();
                setAuthToken()
            }
        } catch (error) {
            console.error("Failed to refresh session:", error);
            logout();
        }
    }, [token, logout]);

    // Sync auth store changes to local state
    useEffect(() => {
        const unsubscribe = pb.authStore.onChange((newToken, model) => {
            setToken(newToken);
            setUser(model as unknown as UsersResponse);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [setToken]);

    // Clear session if token becomes invalid
    useEffect(() => {
        if (!pb.authStore.isValid) logout();
    }, [logout]);

    // Periodically refresh the session
    useInterval(refreshSession, token ? 2 * ONE_MINUTE_IN_MS : null);

    return (
        <PocketContext.Provider value={{ adminLogin, logout, user, token }}>
            {children}
        </PocketContext.Provider>
    );
};

// Custom hook to access PocketContext
export const usePocket = () => {
    const context = useContext(PocketContext);
    if (!context) {
        throw new Error("usePocket must be used within a PocketProvider.");
    }
    return context;
};
