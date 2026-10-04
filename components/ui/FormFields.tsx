"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fieldClass, inputClass, inputWrap, labelClass, selectClass } from "./styles";

export function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-[var(--sane-orange)]">*</span>}
      </label>
      {children}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export function TextField({ id, label, value, onChange, icon: Icon, required, type = "text", placeholder, autoComplete }: TextFieldProps) {
  return (
    <Field id={id} label={label} required={required}>
      <div className={inputWrap}>
        {Icon && <Icon size={16} className="mx-3.5 shrink-0 text-[var(--sane-text-light)]" aria-hidden="true" />}
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${Icon ? "" : "pl-3.5"}`}
        />
      </div>
    </Field>
  );
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  required,
  placeholder,
  autoComplete,
}: Omit<TextFieldProps, "icon" | "type">) {
  const [show, setShow] = useState(false);
  return (
    <Field id={id} label={label} required={required}>
      <div className={inputWrap}>
        <Lock size={16} className="mx-3.5 shrink-0 text-[var(--sane-text-light)]" aria-hidden="true" />
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} !pr-0`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="px-3 py-3 text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-text)]"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </Field>
  );
}

export function PhoneField({ id = "telephone", label = "Téléphone", value, onChange, required }: Partial<TextFieldProps>) {
  return (
    <Field id={id} label={label} required={required}>
      <div className={inputWrap}>
        <span className="sane-small flex items-center gap-1.5 self-stretch border-r border-[var(--sane-border)] bg-[var(--sane-background)] px-3.5">
          <span aria-hidden="true">🇳🇪</span>
          +227
        </span>
        <input
          id={id}
          name={id}
          type="tel"
          required={required}
          autoComplete="tel-national"
          placeholder="XX XX XX XX"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={`${inputClass} pl-3`}
        />
      </div>
    </Field>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  list,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  list: string[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <Field id={id} label={label} required={required}>
      <select id={id} name={id} required={required} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="" disabled>
          {placeholder}
        </option>
        {list.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  required,
  placeholder,
  rows = 5,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Field id={id} label={label} required={required}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClass} resize-none`}
      />
    </Field>
  );
}
