export type User = {
  id: number; // ✅ KLUCZOWE
  login?: string;
  email?: string;
  role?: "Admin" | "User";
  isAdmin: boolean;
};
