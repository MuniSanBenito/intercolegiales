import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { PageLoader } from "../../components/PageLoader";
import { auth } from "../../lib/firebase";

export function Component() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
