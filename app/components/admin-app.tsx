"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ManagedListing } from "../lib/listings-store";
import type { SaleDetails } from "../lib/sale-details";

type Mode = "login" | "list" | "edit";

const DRAFT_KEY = "litving-admin-draft-v1";

const emptyForm: Partial<ManagedListing> = {
  code: "",
  operation: "arriendo",
  kind: "Apartamento",
  zone: "",
  city: "Bogotá",
  address: "",
  buildingName: "",
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
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "todas") return listings;
    return listings.filter(item => item.operation === filter);
  }, [filter, listings]);

  function clearLocalDraft() {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }

  function writeLocalDraft(nextForm: Partial<ManagedListing>, amenities: string) {
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ form: nextForm, amenitiesText: amenities, savedAt: Date.now() }),
      );
    } catch {
      /* ignore quota */
    }
  }

  function readLocalDraft(): { form: Partial<ManagedListing>; amenitiesText: string } | null {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { form?: Partial<ManagedListing>; amenitiesText?: string };
      if (!parsed?.form) return null;
      return { form: parsed.form, amenitiesText: parsed.amenitiesText || "" };
    } catch {
      return null;
    }
  }

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

  // Autosave local while editing so nothing is lost on refresh.
  useEffect(() => {
    if (mode !== "edit") return;
    const timer = window.setTimeout(() => {
      writeLocalDraft(form, amenitiesText);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [mode, form, amenitiesText]);

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
    const draft = readLocalDraft();
    if (draft?.form && window.confirm("Hay un borrador guardado en este navegador. ¿Continuar con él?")) {
      setForm({ ...emptyForm, ...draft.form });
      setAmenitiesText(draft.amenitiesText);
      setMessage("Borrador local restaurado. Puedes seguir editando y guardar.");
    } else {
      setForm({ ...emptyForm, code: `L-${String(Math.floor(1000 + Math.random() * 9000))}`, published: false });
      setAmenitiesText("");
      setMessage("Puedes ir guardando borrador cuando quieras; no hace falta terminar todo de una.");
    }
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

  function patchSale<K extends keyof SaleDetails>(key: K, value: SaleDetails[K]) {
    setForm(prev => ({
      ...prev,
      saleDetails: { ...(prev.saleDetails || {}), [key]: value },
    }));
  }

  const sale = form.saleDetails || {};
  const yesNoOptions = [
    { key: "renovated" as const, label: "Remodelado" },
    { key: "balcony" as const, label: "Balcón" },
    { key: "terrace" as const, label: "Terraza" },
    { key: "livingRoom" as const, label: "Sala de estar" },
    { key: "study" as const, label: "Estudio" },
    { key: "storage" as const, label: "Depósito" },
    { key: "serviceRoom" as const, label: "Cuarto de servicio" },
    { key: "integralKitchen" as const, label: "Cocina integral" },
    { key: "penthouse" as const, label: "Penthouse" },
    { key: "exteriorView" as const, label: "Vista exterior" },
    { key: "coveredGarage" as const, label: "Garaje cubierto" },
    { key: "acOrHeating" as const, label: "Aire / calefacción" },
    { key: "grayWorkBathroom" as const, label: "Baño en obra gris" },
    { key: "grayWorkProperty" as const, label: "Inmueble en obra gris" },
  ];

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    setUploading(true);
    setMessage(`Subiendo ${list.length} foto(s) en alta calidad…`);
    const allUrls: string[] = [];
    try {
      for (let i = 0; i < list.length; i += 1) {
        const file = list[i];
        const body = new FormData();
        body.append("files", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          credentials: "include",
          body,
        });
        let data: { urls?: string[]; error?: string } = {};
        try {
          data = (await res.json()) as { urls?: string[]; error?: string };
        } catch {
          setMessage(`Error al subir “${file.name}”. Intenta esa foto sola.`);
          return;
        }
        if (!res.ok) {
          setMessage(data.error || `No se pudo subir “${file.name}” (${res.status}).`);
          return;
        }
        allUrls.push(...(data.urls || []));
        setForm(prev => {
          const gallery = [...(prev.gallery || []), ...(data.urls || [])];
          return {
            ...prev,
            gallery,
            image: prev.image || gallery[0] || "",
          };
        });
        setMessage(`Subidas ${allUrls.length} de ${list.length} foto(s)…`);
      }
      setMessage(`${allUrls.length} foto(s) lista(s). Ya puedes guardar borrador o publicar.`);
    } catch {
      setMessage("No se pudo subir. Revisa la conexión e intenta de nuevo (una o varias fotos).");
    } finally {
      setUploading(false);
    }
  }

  async function saveListing(asDraft: boolean) {
    setSaving(true);
    setMessage(null);
    try {
      if (!asDraft) {
        if (!form.code?.trim() || !form.zone?.trim() || !form.priceValue) {
          setMessage("Para publicar necesitas código, barrio y precio.");
          return;
        }
      }
      const payload: Partial<ManagedListing> = {
        ...form,
        published: asDraft ? false : true,
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
      let data: { error?: string; listing?: ManagedListing } = {};
      try {
        data = (await res.json()) as { error?: string; listing?: ManagedListing };
      } catch {
        setMessage(`No se pudo guardar (error del servidor ${res.status}). Recarga e intenta de nuevo.`);
        return;
      }
      if (!res.ok) {
        setMessage(data.error || `No se pudo guardar (${res.status}).`);
        return;
      }
      if (data.listing) {
        setForm({ ...data.listing });
        setAmenitiesText((data.listing.amenities || []).join(", "));
      }
      await loadListings();
      if (asDraft) {
        writeLocalDraft(data.listing || payload, amenitiesText);
        setMessage("Borrador guardado. Puedes cerrar y seguir después desde la lista.");
      } else {
        clearLocalDraft();
        setMode("list");
        setMessage("Publicación guardada y visible en el sitio.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    await saveListing(false);
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
            </div>
          </section>

          {form.operation === "venta" ? (
            <section className="admin-card">
              <h2>Detalles de venta</h2>
              <div className="admin-grid">
                <label className="admin-span-2">
                  Nombre del edificio / conjunto
                  <input
                    value={form.buildingName || ""}
                    onChange={e => patch("buildingName", e.target.value)}
                    placeholder="Ej. Edificio Claudia Cecilia"
                  />
                </label>
                <label>
                  Nº apartamento
                  <input
                    value={sale.apartmentNumber || ""}
                    onChange={e => patchSale("apartmentNumber", e.target.value)}
                  />
                </label>
                <label>
                  Torre
                  <input value={sale.tower || ""} onChange={e => patchSale("tower", e.target.value)} />
                </label>
                <label>
                  Nº parqueadero
                  <input
                    value={sale.parkingNumber || ""}
                    onChange={e => patchSale("parkingNumber", e.target.value)}
                  />
                </label>
                <label>
                  Antigüedad (años)
                  <input
                    type="number"
                    min={0}
                    value={sale.ageYears ?? ""}
                    onChange={e =>
                      patchSale("ageYears", e.target.value === "" ? undefined : Number(e.target.value))
                    }
                  />
                </label>
                <label>
                  Nº de ascensores
                  <input
                    type="number"
                    min={0}
                    value={sale.elevatorCount ?? ""}
                    onChange={e =>
                      patchSale("elevatorCount", e.target.value === "" ? undefined : Number(e.target.value))
                    }
                  />
                </label>
                <label>
                  Tipo de garaje
                  <input
                    value={sale.garageType || ""}
                    onChange={e => patchSale("garageType", e.target.value)}
                    placeholder="Privado, comunal…"
                  />
                </label>
                <label>
                  Piso área social
                  <input
                    value={sale.socialAreaFlooring || ""}
                    onChange={e => patchSale("socialAreaFlooring", e.target.value)}
                    placeholder="Porcelanato, madera…"
                  />
                </label>
                <label>
                  Piso habitaciones
                  <input
                    value={sale.bedroomFlooring || ""}
                    onChange={e => patchSale("bedroomFlooring", e.target.value)}
                  />
                </label>
                <label className="admin-span-2">
                  Observaciones
                  <textarea
                    rows={3}
                    value={sale.observations || ""}
                    onChange={e => patchSale("observations", e.target.value)}
                    placeholder="Ej. Régimen de propiedad horizontal"
                  />
                </label>
              </div>
              <div className="admin-checks admin-checks--sale">
                {yesNoOptions.map(item => (
                  <label key={item.key} className="admin-check">
                    <input
                      type="checkbox"
                      checked={Boolean(sale[item.key])}
                      onChange={e => patchSale(item.key, e.target.checked)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </section>
          ) : null}

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
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={e => {
                  void onUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <p className="admin-muted">
              Fotos en alta calidad (hasta 25 MB c/u). Se suben una por una; puedes guardar borrador en cualquier
              momento.
            </p>
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
            <button
              type="button"
              className="admin-btn"
              disabled={saving || uploading}
              onClick={() => void saveListing(true)}
            >
              {saving ? "Guardando…" : "Guardar borrador"}
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving || uploading}>
              {saving ? "Guardando…" : "Publicar en el sitio"}
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
                    {item.operation === "venta" && item.buildingName ? ` · ${item.buildingName}` : ""}
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
