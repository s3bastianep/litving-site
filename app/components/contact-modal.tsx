"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  contactNeeds,
  isValidEmail,
  isValidPhone,
  submitContactLead,
  type ContactLead,
  type ContactNeed,
} from "../lib/contact";

export function ContactModal({
  lead,
  onClose,
}: {
  lead: ContactLead;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [savedTo, setSavedTo] = useState("");

  const title = useMemo(() => {
    if (lead.need === "portal") return "Pedir acceso al portal";
    if (lead.need === "visita") return "Confirmar visita";
    if (lead.need === "oferta") return "Enviar una oferta";
    if (lead.listing) return "Hablar con un asesor";
    return "Hablemos de tu propiedad";
  }, [lead]);

  const intro = useMemo(() => {
    if (lead.need === "portal") {
      return "El portal no es de ingreso libre: lo activamos con tu asesor. Déjanos tus datos y te enviamos el acceso.";
    }
    if (lead.need === "visita" && lead.listing) {
      return "Revisamos disponibilidad y te confirmamos la visita por correo o WhatsApp.";
    }
    if (lead.listing) {
      return "Un asesor te responde con el siguiente paso para este inmueble.";
    }
    return "Cuéntanos qué necesitas. Te respondemos con un siguiente paso concreto, sin abrir tu correo.";
  }, [lead]);

  const visitSummary =
    lead.visit && lead.listing
      ? `${lead.visit.kind === "virtual" ? "Virtual" : "Presencial"} · ${lead.visit.date} · ${lead.visit.time}`
      : null;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setEmailError(null);
    setPhoneError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const need = String(data.get("need") ?? lead.need) as ContactNeed;

    if (email && !isValidEmail(email)) {
      setEmailError("Escribe un correo válido.");
      return;
    }
    if (phone && !isValidPhone(phone)) {
      setPhoneError("Escribe un teléfono de 7 a 15 dígitos.");
      return;
    }
    if (!email && !phone) {
      setError("Deja un correo o un teléfono para poder responderte.");
      return;
    }

    setSending(true);
    try {
      await submitContactLead({
        name,
        email,
        phone,
        need,
        listing: lead.listing,
        visit: lead.visit,
      });
      setSavedTo(email || phone);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos enviar. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <header className="contact-modal-head">
          <p className="eyebrow">LITVING · BOGOTÁ</p>
          <h2 id="contact-title">{title}</h2>
          <p className="contact-modal-lead">{intro}</p>
        </header>
        {lead.listing ? (
          <p className="contact-context">
            <b>{lead.listing.title}</b>
            <span>
              {lead.listing.code} · {lead.listing.zone} · {lead.listing.price}
            </span>
            {visitSummary ? <span>{visitSummary}</span> : null}
          </p>
        ) : null}
        {sent ? (
          <div className="success-message" role="status" aria-live="polite">
            <b>Recibimos tu solicitud.</b>
            <span>
              Te contactamos a {savedTo}. Si no hay respuesta en un día hábil, escríbenos a{" "}
              <a href="mailto:hola@litving.com">hola@litving.com</a>.
            </span>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <label>
              Nombre
              <input
                name="name"
                autoComplete="name"
                required
                autoFocus
                minLength={2}
                placeholder="Tu nombre"
              />
            </label>
            <div className="contact-pair">
              <div className="contact-fields">
                <label>
                  Correo
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="correo@email.com"
                    aria-invalid={emailError ? true : undefined}
                    onBlur={event => {
                      const value = event.currentTarget.value.trim();
                      setEmailError(value && !isValidEmail(value) ? "Escribe un correo válido." : null);
                    }}
                  />
                  {emailError ? <em className="contact-field-error">{emailError}</em> : null}
                </label>
                <label>
                  Teléfono
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="300 000 0000"
                    aria-invalid={phoneError ? true : undefined}
                    onBlur={event => {
                      const value = event.currentTarget.value.trim();
                      setPhoneError(value && !isValidPhone(value) ? "Escribe un teléfono válido." : null);
                    }}
                  />
                  {phoneError ? <em className="contact-field-error">{phoneError}</em> : null}
                </label>
              </div>
              <p className="contact-hint">Basta con uno de los dos: correo o teléfono.</p>
            </div>
            <label>
              Quiero
              <select name="need" key={lead.need} defaultValue={lead.need}>
                {contactNeeds.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            {error ? (
              <p className="contact-form-error" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" disabled={sending}>
              {sending ? "Enviando…" : "Enviar solicitud"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
