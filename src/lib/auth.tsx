import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, tokenStore, type AuthUser, type Business } from "./api";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  business: Business | null;
  businessLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshBusiness: () => Promise<Business | null>;
  setBusiness: (b: Business) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => tokenStore.getUser());
  const [token, setToken] = useState<string | null>(() => tokenStore.get());
  const [business, setBusinessState] = useState<Business | null>(null);
  const [businessLoaded, setBusinessLoaded] = useState(false);

  const refreshBusiness = async () => {
    if (!tokenStore.get()) {
      setBusinessLoaded(true);
      return null;
    }
    try {
      const res = await api.getBusiness();
      const b = res?.data ?? null;
      setBusinessState(b);
      setBusinessLoaded(true);
      return b;
    } catch {
      setBusinessState(null);
      setBusinessLoaded(true);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      void refreshBusiness();
    } else {
      setBusinessLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login: AuthContextValue["login"] = async (email, password) => {
    const res = await api.login(email, password);
    tokenStore.set(res.token);
    tokenStore.setUser(res.user);
    setToken(res.token);
    setUser(res.user);
  };

  const register: AuthContextValue["register"] = async (email, password) => {
    await api.register(email, password);
    // Auto sign-in after register so we can route to onboarding.
    await login(email, password);
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
    setToken(null);
    setBusinessState(null);
    setBusinessLoaded(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        business,
        businessLoaded,
        login,
        register,
        logout,
        refreshBusiness,
        setBusiness: setBusinessState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
