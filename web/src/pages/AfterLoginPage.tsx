import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useUser } from "../context/UserContext";

type UserWithAdmin = {
  isAdmin?: boolean;
};

export default function AfterLoginPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      const adminUser = user as UserWithAdmin | null;

      if (adminUser?.isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else if (user) {
        navigate("/user/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, 1600);

    return () => clearTimeout(timer);
  }, [navigate, user]);

  return (
    <div className="after-login-root">
      <div className="after-login-overlay" />

      <div className={`after-login-content ${visible ? "visible" : ""}`}>
        <img src={logo} alt="Logo" width={96} height={96} />
        <h1 className="after-login-title">
          Guten Tag, Twoja mać!
        </h1>
      </div>
    </div>
  );
}