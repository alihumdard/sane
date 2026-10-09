import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { fieldClass, primaryBtn, selectClass } from "@/components/ui/styles";
import { categoryLabels } from "./data";

interface Props {
  query: string;
  category: string;
  sort: string;
  onQuery: (v: string) => void;
  onCategory: (v: string) => void;
  onSort: (v: string) => void;
}

export function SearchBar({ query, category, sort, onQuery, onCategory, onSort }: Props) {
  return (
    <section className="border-b border-[var(--sane-border)] bg-white py-6">
      <Container>
        <div className="mb-2 flex items-center gap-2">
          <span className="sane-eyebrow-bar" />
          <span className="sane-eyebrow">Recherchez une actualité</span>
        </div>
        <p className="sane-small mb-4">Trouvez rapidement les informations qui vous intéressent.</p>

        <form onSubmit={(e) => e.preventDefault()} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_170px_auto]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Rechercher un article, un événement..."
              aria-label="Rechercher une actualité"
              className={`${fieldClass} pl-10`}
            />
          </div>
          <select value={category} onChange={(e) => onCategory(e.target.value)} aria-label="Catégorie" className={selectClass}>
            <option value="tous">Toutes les catégories</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Trier par date" className={selectClass}>
            <option value="recent">Plus récent</option>
            <option value="ancien">Plus ancien</option>
          </select>
          <button type="submit" className={`${primaryBtn} sm:col-span-2 lg:col-span-1`}>
            Rechercher
          </button>
        </form>
      </Container>
    </section>
  );
}
