import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * AuthLayout - Obsługuje animacje przejścia (fade-in) dla stron autoryzacji.
 * Wykorzystuje 'key' na poziomie kontenera, aby zresetować stan przy zmianie ścieżki.
 */
export function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Stan początkowy to zawsze "out" dla każdego nowego montowania komponentu
  const [state, setState] = useState<"in" | "out">("out");
  const location = useLocation();

  useEffect(() => {
    // Po zamontowaniu komponentu (lub zmianie ścieżki dzięki kluczowi) 
    // czekamy chwilę i zmieniamy stan na "in", co uruchamia animację.
    const id = setTimeout(() => {
      setState("in");
    }, 120);

    // Czyszczenie timeoutu zapobiega wyciekom pamięci
    return () => clearTimeout(id);
  }, [location.pathname]);

  return (
    // 'key={location.pathname}' jest kluczowy: zmusza React do zresetowania 
    // tego drzewa komponentów przy każdej zmianie strony.
    <div key={location.pathname} style={{ width: '100%', height: '100%' }}>
      <div className="page-fade" data-state={state} />
      <div className="login-content" data-state={state}>
        {children}
      </div>
    </div>
  );
}