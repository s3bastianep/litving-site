"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "../components/brand-logo";
import { PortalDashboard } from "../components/portal-dashboard";
import { isValidEmail } from "../lib/contact";

const STORAGE_KEY = "litving-portal-user";

type PortalUser = {
  name: string;
  email: string;
};

function readUser(): PortalUser | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PortalUser;
    if (!parsed.name || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function PortalPage() {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [ready, setReady] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    setUser(readUser());
    setReady(true);
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (name.length < 2) return;
    if (!isValidEmail(email)) {
      setEmailError("Escribe un correo válido.");
      return;
    }
    const next = { name, email };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  };

  const logout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  if (!ready) {
    return <div className="portal-app" />;
  }

  if (!user) {
    return (
      <div className="portal-app portal-app--login">
        <header className="portal-login-bar">
          <Link href="/" className="brand" aria-label="Litving, inicio">
            <BrandLogo />
          </Link>
        </header>
        <section className="portal-login-card" aria-labelledby="portal-login-title">
          <p className="eyebrow">LITVING · PORTAL</p>
          <h1 id="portal-login-title">Iniciar sesión</h1>
          <p>Entra para ver el estado de tu propiedad, pagos y gestiones.</p>
          <form onSubmit={onSubmit} noValidate>
            <label>
              Nombre
              <input name="name" autoComplete="name" required autoFocus minLength={2} placeholder="Carolina" />
            </label>
            <label>
              Correo
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="correo@email.com"
                aria-invalid={emailError ? true : undefined}
                onBlur={event => {
                  const value = event.currentTarget.value.trim();
                  setEmailError(value && !isValidEmail(value) ? "Escribe un correo válido." : null);
                }}
              />
              {emailError ? <em className="contact-field-error">{emailError}</em> : null}
            </label>
            <button type="submit">Entrar al portal</button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="portal-app">
      <PortalDashboard variant="app" userName={user.name} onLogout={logout} />
    </div>
  );
}
