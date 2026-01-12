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
    setState("out");
    const id = setTimeout(() => setState("in"), 120);
    return () => clearTimeout(id);
  }, [location.pathname]);

  return (
    <>
      <div className="page-fade" data-state={state} />
      <div className="login-content" data-state={state}>
        {children}
      </div>
    </>
  );
}
