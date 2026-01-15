import { createContext, useContext, useState } from "react";
import type { User } from "../api/users.api";

// 1. Definicja interfejsu (to linter dopuszcza)
export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// 2. PRYWATNY KONTEKST - Usuwamy słowo 'export'.
// To kluczowy krok, który rozwiązuje błąd Fast Refresh.
const UserContext = createContext<UserContextType | null>(null);

/**
 * UserProvider - Komponent dostarczający stan użytkownika.
 */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Warto wyczyścić oba klucze
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * useUser - Jedyny zalecany sposób dostępu do danych użytkownika.
 * Hooki są dopuszczalne obok komponentów w jednym pliku.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
};