import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { ArrowLeft, Gamepad2, LoaderCircle, Lock } from "lucide-react";
import { useEffect, useId, useState, type SubmitEvent } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, replace, useNavigate } from "react-router";
import { PageLoader } from "../../../components/PageLoader";
import { auth } from "../../../lib/firebase";

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "El correo no es válido.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Correo o contraseña incorrectos.";
      case "auth/user-disabled":
        return "Esta cuenta está deshabilitada.";
      case "auth/too-many-requests":
        return "Demasiados intentos. Probá de nuevo más tarde.";
      case "auth/network-request-failed":
        return "Sin conexión. Revisá tu red e intentá de nuevo.";
      case "auth/missing-password":
        return "Ingresá tu contraseña.";
      default:
        return "No se pudo iniciar sesión. Intentá de nuevo.";
    }
  }

  return "No se pudo iniciar sesión. Intentá de nuevo.";
}

export async function loader() {
  await auth.authStateReady();

  if (auth.currentUser) {
    throw replace("/panel");
  }

  return null;
}

export function Component() {
  const emailId = useId();
  const passwordId = useId();
  const showPasswordId = useId();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 6000);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/panel", { replace: true });
    } catch (error) {
      setToast(getAuthErrorMessage(error));
      setLoading(false);
    }
  };

  const inputClassName =
    "h-12 w-full min-w-0 rounded-xl border border-slate-800 bg-slate-900 px-4 text-base text-slate-100 placeholder-slate-500 outline-none ring-0 transition-[border-color,box-shadow] duration-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-60";

  if (!ready) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to="/panel" replace />;
  }

  return (
    <div className="relative flex min-h-dvh [align-items:safe_center] bg-[#08090e] px-4 py-6 text-slate-100 sm:py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] sm:h-[480px] sm:w-[480px]" />
        <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {toast
        ? createPortal(
            <div
              role="alert"
              aria-live="assertive"
              className="pointer-events-none fixed top-4 right-4 left-4 z-50 mx-auto max-w-md"
            >
              <div className="rounded-xl border border-red-500/40 bg-slate-950/95 px-4 py-3 text-sm leading-5 text-red-200 shadow-lg shadow-red-950/30 backdrop-blur-md">
                {toast}
              </div>
            </div>,
            document.body,
          )
        : null}

      <main className="relative z-10 mx-auto w-full max-w-md">
        <section className="w-full min-w-0 rounded-3xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-md sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/30">
              <div className="grid h-full w-full place-items-center rounded-[10px] bg-[#0d0f1a] text-cyan-400">
                <Gamepad2 className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-cyber text-[10px] font-bold tracking-[0.24em] text-cyan-400 uppercase">
                Intercolegiales
              </p>
              <p className="font-cyber text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400">
                SAN BENITO
              </p>
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-cyber tracking-widest text-cyan-300 uppercase">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Acceso staff
            </div>
            <h1 className="mb-2 font-cyber text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
              Iniciar{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                sesión
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Ingresá con tu correo y contraseña para acceder al panel.
            </p>
          </div>

          <form
            className="grid w-full min-w-0 gap-3"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid gap-2">
              <label
                htmlFor={emailId}
                className="text-xs font-medium tracking-wide text-slate-300"
              >
                Correo electrónico
              </label>
              <input
                id={emailId}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="oscar.d@example.net"
                disabled={loading}
                className={inputClassName}
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor={passwordId}
                className="text-xs font-medium tracking-wide text-slate-300"
              >
                Contraseña
              </label>
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className={inputClassName}
              />
              <label
                htmlFor={showPasswordId}
                className="flex h-6 w-fit max-w-full cursor-pointer items-center gap-2 text-xs text-slate-400"
              >
                <input
                  id={showPasswordId}
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  disabled={loading}
                  className="size-4 shrink-0 accent-cyan-400"
                />
                <span>Mostrar contraseña</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="mt-1 grid h-12 w-full place-items-center rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 font-cyber text-xs font-black tracking-widest text-black uppercase transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
            >
              <span
                className={`col-start-1 row-start-1 ${loading ? "opacity-0" : "opacity-100"}`}
              >
                Ingresar
              </span>
              <span
                className={`col-start-1 row-start-1 ${loading ? "opacity-100" : "opacity-0"}`}
                aria-hidden={!loading}
              >
                <LoaderCircle className="h-5 w-5 animate-spin" />
              </span>
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 inline-flex h-6 items-center gap-2 text-xs text-slate-400 transition-colors hover:text-cyan-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Volver al inicio
          </Link>
        </section>
      </main>
    </div>
  );
}
