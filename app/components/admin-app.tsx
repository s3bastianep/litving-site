"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ManagedListing } from "../lib/listings-store";

type Mode = "login" | "list" | "edit";

const emptyForm: Partial<ManagedListing> = {
  code: "",
  operation: "arriendo",
  kind: "Apartamento",
  zone: "",
  city: "Bogotá",
  address: "",
  priceValue: 0,
  adminFeeValue: undefined,
  priceNote: "",
  areaM2: 0,
  rooms: 1,
  baths: 1,
  parking: 0,
  floor: "",
  pets: false,
  furnished: false,
  elevator: true,
  stratum: "5",
  status: "disponible",
  published: true,
  image: "",
  gallery: [],
  lat: 4.65,
  lng: -74.06,
  description: "",
  amenities: [],
};

function statusLabel(status: ManagedListing["status"]) {
  if (status === "reservado") return "Reservado";
  if (status === "no_disponible") return "No disponible";
  return "Disponible";
}

export function AdminApp() {
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [listings, setListings] = useState<ManagedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<ManagedListing>>(emptyForm);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todas" | "arriendo" | "venta">("todas");

  const filtered = useMemo(() => {
    if (filter === "todas") return listings;
    return listings.filter(item => item.operation === filter);
  }, [filter, listings]);

  async function checkSession() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", { credentials: "include" });
      if (!res.ok) {
        setMode("login");
        return;
      }
      setMode("list");
      await loadListings();
    } finally {
      setLoading(false);
    }
  }

  async function loadListings() {
    const res = await fetch("/api/admin/listings", { credentials: "include" });
    if (res.status === 401) {
      setMode("login");
      return;
    }
    if (!res.ok) {
      setMessage("No se pudieron cargar las publicaciones. Recarga la página.");
      setListings([]);
      setMode("list");
      return;
    }
    const data = (await res.json()) as { listings: ManagedListing[] };
    setListings(data.listings || []);
  }

  useEffect(() => {
    void checkSession();
  }, []);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setAuthError(null);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ user, password }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setAuthError(data.error || "No se pudo iniciar sesión.");
      return;
    }
    setPassword("");
    setMode("list");
    await loadListings();
  }

  async function onLogout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "logout" }),
    });
    setMode("login");
    setListings([]);
  }

  function openCreate() {
    setForm({ ...emptyForm, code: `L-${String(Math.floor(1000 + Math.random() * 9000))}` });
    setAmenitiesText("");
    setMessage(null);
    setMode("edit");
  }

  function openEdit(item: ManagedListing) {
    setForm({ ...item });
    setAmenitiesText((item.amenities || []).join(", "));
    setMessage(null);
    setMode("edit");
  }

  function patch<K extends keyof ManagedListing>(key: K, value: ManagedListing[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    const body = new FormData();
    Array.from(files).forEach(file => body.append("files", file));
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body,
    });
    const data = (await res.json()) as { urls?: string[]; error?: string };
    if (!res.ok) {
      setMessage(data.error || "No se pudieron subir las fotos.");
      return;
    }
    const urls = data.urls || [];
    setForm(prev => {
      const gallery = [...(prev.gallery || []), ...urls];
      return {
        ...prev,
        gallery,
        image: prev.image || gallery[0] || "",
      };
    });
    setMessage(`${urls.length} foto(s) subida(s).`);
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload: Partial<ManagedListing> = {
        ...form,
        amenities: amenitiesText
          .split(",")
          .map(item => item.trim())
          .filter(Boolean),
      };
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/listings", {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string; listing?: ManagedListing };
      if (!res.ok) {
        setMessage(data.error || "No se pudo guardar.");
        return;
      }
      await loadListings();
      setMode("list");
      setMessage("Publicación guardada.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    const res = await fetch(`/api/admin/listings?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setMessage(data.error || "No se pudo eliminar.");
      return;
    }
    await loadListings();
    setMessage("Publicación eliminada.");
  }

  if (loading) {
    return (
      <main className="admin-shell">
        <p className="admin-muted">Cargando panel…</p>
      </main>
    );
  }

  if (mode === "login") {
    return (
      <main className="admin-shell admin-shell--login">
        <form className="admin-card admin-login" onSubmit={onLogin}>
          <p className="admin-kicker">LITVING</p>
          <h1>Iniciar sesión</h1>
          <p className="admin-muted">Entra a tu panel para gestionar inmuebles.</p>
          <label>
            Usuario
            <input
              value={user}
              onChange={e => setUser(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {authError ? <p className="admin-error">{authError}</p> : null}
          <button type="submit" className="admin-btn admin-btn--primary">
            Entrar
          </button>
          <Link href="/" className="admin-back">
            ← Volver al sitio
          </Link>
        </form>
      </main>
    );
  }

  if (mode === "edit") {
    const gallery = form.gallery || [];
    return (
      <main className="admin-shell">
        <header className="admin-top">
          <div>
            <p className="admin-kicker">Publicación</p>
            <h1>{form.id ? "Editar inmueble" : "Nueva publicación"}</h1>
          </div>
          <button type="button" className="admin-btn" onClick={() => setMode("list")}>
            Cancelar
          </button>
        </header>

        <form className="admin-form" onSubmit={onSave}>
          <section className="admin-card">
            <h2>Datos generales</h2>
            <div className="admin-grid">
              <label>
                Código
                <input value={form.code || ""} onChange={e => patch("code", e.target.value)} required />
              </label>
              <label>
                Operación
                <select
                  value={form.operation || "arriendo"}
                  onChange={e => patch("operation", e.target.value as ManagedListing["operation"])}
                >
                  <option value="arriendo">Arriendo</option>
                  <option value="venta">Venta</option>
                </select>
              </label>
              <label>
                Tipo
                <select
                  value={form.kind || "Apartamento"}
                  onChange={e => patch("kind", e.target.value as ManagedListing["kind"])}
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Oficina">Oficina</option>
                </select>
              </label>
              <label>
                Estado
                <select
                  value={form.status || "disponible"}
                  onChange={e => patch("status", e.target.value as ManagedListing["status"])}
                >
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="no_disponible">No disponible</option>
                </select>
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={Boolean(form.published)}
                  onChange={e => patch("published", e.target.checked)}
                />
                Publicado en el sitio
              </label>
            </div>
          </section>

          <section className="admin-card">
            <h2>Ubicación</h2>
            <div className="admin-grid">
              <label>
                Barrio
                <input value={form.zone || ""} onChange={e => patch("zone", e.target.value)} required />
              </label>
              <label>
                Ciudad
                <input value={form.city || ""} onChange={e => patch("city", e.target.value)} required />
              </label>
              <label className="admin-span-2">
                Dirección
                <input value={form.address || ""} onChange={e => patch("address", e.target.value)} required />
              </label>
              <label>
                Piso
                <input value={form.floor || ""} onChange={e => patch("floor", e.target.value)} placeholder="Piso 8" />
              </label>
              <label>
                Estrato
                <input value={form.stratum || ""} onChange={e => patch("stratum", e.target.value)} />
              </label>
              <label>
                Latitud
                <input
                  type="number"
                  step="any"
                  value={form.lat ?? 4.65}
                  onChange={e => patch("lat", Number(e.target.value))}
                />
              </label>
              <label>
                Longitud
                <input
                  type="number"
                  step="any"
                  value={form.lng ?? -74.06}
                  onChange={e => patch("lng", Number(e.target.value))}
                />
              </label>
            </div>
          </section>

          <section className="admin-card">
            <h2>Precio y espacios</h2>
            <div className="admin-grid">
              <label>
                Precio (COP)
                <input
                  type="number"
                  min={0}
                  value={form.priceValue ?? 0}
                  onChange={e => patch("priceValue", Number(e.target.value))}
                  required
                />
              </label>
              <label>
                Administración (COP)
                <input
                  type="number"
                  min={0}
                  value={form.adminFeeValue ?? ""}
                  onChange={e =>
                    patch(
                      "adminFeeValue",
                      e.target.value === "" ? undefined : Number(e.target.value),
                    )
                  }
                  placeholder="Opcional"
                />
              </label>
              <label className="admin-span-2">
                Nota de precio
                <input
                  value={form.priceNote || ""}
                  onChange={e => patch("priceNote", e.target.value)}
                  placeholder="Ej. Incluye administración"
                />
              </label>
              <label>
                Área (m²)
                <input
                  type="number"
                  min={0}
                  value={form.areaM2 ?? 0}
                  onChange={e => patch("areaM2", Number(e.target.value))}
                  required
                />
              </label>
              <label>
                Habitaciones
                <input
                  type="number"
                  min={0}
                  value={form.rooms ?? 0}
                  onChange={e => patch("rooms", Number(e.target.value))}
                />
              </label>
              <label>
                Baños
                <input
                  type="number"
                  min={0}
                  value={form.baths ?? 0}
                  onChange={e => patch("baths", Number(e.target.value))}
                />
              </label>
              <label>
                Parqueaderos
                <input
                  type="number"
                  min={0}
                  value={form.parking ?? 0}
                  onChange={e => patch("parking", Number(e.target.value))}
                />
              </label>
            </div>
            <div className="admin-checks">
              <label className="admin-check">
                <input type="checkbox" checked={Boolean(form.pets)} onChange={e => patch("pets", e.target.checked)} />
                Mascotas
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={Boolean(form.furnished)}
                  onChange={e => patch("furnished", e.target.checked)}
                />
                Amoblado
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={Boolean(form.elevator)}
                  onChange={e => patch("elevator", e.target.checked)}
                />
                Ascensor
              </label>
            </div>
          </section>

          <section className="admin-card">
            <h2>Descripción y conjunto</h2>
            <label>
              Descripción
              <textarea
                rows={5}
                value={form.description || ""}
                onChange={e => patch("description", e.target.value)}
                required
              />
            </label>
            <label>
              Características del conjunto (separadas por coma)
              <textarea
                rows={3}
                value={amenitiesText}
                onChange={e => setAmenitiesText(e.target.value)}
                placeholder="Portería 24h, Gimnasio, Pet friendly"
              />
            </label>
          </section>

          <section className="admin-card">
            <h2>Fotos</h2>
            <label className="admin-upload">
              Subir imágenes
              <input type="file" accept="image/*" multiple onChange={e => void onUpload(e.target.files)} />
            </label>
            {gallery.length ? (
              <ul className="admin-gallery">
                {gallery.map(url => (
                  <li key={url}>
                    <img src={url} alt="" />
                    <div className="admin-gallery-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--small"
                        onClick={() => patch("image", url)}
                      >
                        {form.image === url ? "Portada" : "Usar portada"}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--small admin-btn--danger"
                        onClick={() =>
                          setForm(prev => {
                            const next = (prev.gallery || []).filter(item => item !== url);
                            return {
                              ...prev,
                              gallery: next,
                              image: prev.image === url ? next[0] || "" : prev.image,
                            };
                          })
                        }
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-muted">Aún no hay fotos. Sube al menos una.</p>
            )}
          </section>

          {message ? <p className="admin-banner">{message}</p> : null}

          <div className="admin-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar publicación"}
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-top">
        <div>
          <p className="admin-kicker">LITVING</p>
          <h1>Mis publicaciones</h1>
        </div>
        <div className="admin-top-actions">
          <button type="button" className="admin-btn admin-btn--primary" onClick={openCreate}>
            Nueva publicación
          </button>
          <button type="button" className="admin-btn" onClick={() => void onLogout()}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {message ? <p className="admin-banner">{message}</p> : null}

      <div className="admin-toolbar">
        <div className="admin-filters" role="group" aria-label="Filtrar">
          {(["todas", "arriendo", "venta"] as const).map(item => (
            <button
              key={item}
              type="button"
              className={filter === item ? "is-on" : undefined}
              onClick={() => setFilter(item)}
            >
              {item === "todas" ? "Todas" : item === "arriendo" ? "Arriendo" : "Venta"}
            </button>
          ))}
        </div>
        <p className="admin-muted">{filtered.length} publicaciones</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Código</th>
              <th>Inmueble</th>
              <th>Operación</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Web</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>
                  <img className="admin-thumb" src={item.image} alt="" />
                </td>
                <td>{item.code}</td>
                <td>
                  <strong>
                    {item.kind} · {item.zone}
                  </strong>
                  <span className="admin-muted">{item.address}</span>
                </td>
                <td>{item.operation === "arriendo" ? "Arriendo" : "Venta"}</td>
                <td>{item.priceLabel}</td>
                <td>{statusLabel(item.status)}</td>
                <td>{item.published ? "Publicado" : "Borrador"}</td>
                <td className="admin-row-actions">
                  <button type="button" className="admin-btn admin-btn--small" onClick={() => openEdit(item)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={() => void onDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="admin-footer">
        <Link href="/arrendar">Ver arriendos</Link> · <Link href="/comprar">Ver ventas</Link> ·{" "}
        <Link href="/">Inicio</Link>
      </p>
    </main>
  );
}
