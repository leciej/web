import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<"in" | "out">("out");
  const location = useLocation();

  useEffect(() => {
    const id = setTimeout(() => {
      setState("in");
    }, 120);

    return () => clearTimeout(id);
  }, [location.pathname]);

  return (
    <div key={location.pathname} style={{ width: '100%', height: '100%' }}>
      <div className="page-fade" data-state={state} />
      <div className="login-content" data-state={state}>
        {children}
      </div>
    </div>
  );
}