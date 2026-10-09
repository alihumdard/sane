import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fieldClass, primaryBtn, secondaryBtn, selectClass } from "@/components/ui/styles";
import { domaines, formats, niveaux } from "./data";

export interface FormationFilterState {
  search: string;
  domaine: string;
  niveau: string;
  format: string;
}

interface Props {
  value: FormationFilterState;
  onChange: (patch: Partial<FormationFilterState>) => void;
  onReset: () => void;
  dirty: boolean;
}

/** the first entry of each list is its placeholder ("Domaine de formation"…) */
const selects = [
  { key: "domaine", options: domaines, label: "Domaine" },
  { key: "niveau", options: niveaux, label: "Niveau" },
  { key: "format", options: formats, label: "Format" },
] as const;

export function FormationFilters({ value, onChange, onReset, dirty }: Props) {
  return (
    <section className="bg-[var(--sane-green-light)] py-10 sm:py-12 md:py-14">
      <Container>
        <SectionHeading
          eyebrow="Trouvez votre formation"
          title="Recherchez la formation qui vous correspond"
          description="Explorez nos formations et développez les compétences dont vous avez besoin."
          className="mb-7"
        />

        <form onSubmit={(e) => e.preventDefault()} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
            <input
              type="search"
              value={value.search}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Mot-clé, formation..."
              aria-label="Rechercher une formation"
              className={`${fieldClass} pl-10`}
            />
          </div>

          {selects.map(({ key, options, label }) => (
            <select
              key={key}
              value={value[key]}
              onChange={(e) => onChange({ [key]: e.target.value })}
              aria-label={label}
              className={selectClass}
            >
              <option value="">{options[0]}</option>
              {options.slice(1).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ))}

          {dirty ? (
            <button type="button" onClick={onReset} className={`${secondaryBtn} sm:col-span-2 lg:col-span-1`}>
              Réinitialiser
            </button>
          ) : (
            <button type="submit" className={`${primaryBtn} sm:col-span-2 lg:col-span-1`}>
              Rechercher
            </button>
          )}
        </form>
      </Container>
    </section>
  );
}
