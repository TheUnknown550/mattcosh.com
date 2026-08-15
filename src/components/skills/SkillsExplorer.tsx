"use client";

import { useMemo, useState } from "react";
import type { SkillGroup } from "@/types/skill";

interface SkillsExplorerProps {
  groups: SkillGroup[];
}

/**
 * Client-side search over the full skills list. Categories with no
 * remaining matches are hidden rather than shown empty.
 */
export function SkillsExplorer({ groups }: SkillsExplorerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        category: group.category,
        skills: group.skills.filter((skill) => skill.toLowerCase().includes(q)),
      }))
      .filter((group) => group.skills.length > 0);
  }, [groups, query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search skills…"
        className="w-full max-w-sm rounded-md border border-line bg-surface/95 px-4 py-2.5 font-mono text-sm text-ink outline-none transition-colors placeholder:text-ink/70 focus:border-signal"
      />

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-ink">
          No skills match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {filtered.map((group) => (
            <div key={group.category}>
              <p className="font-mono text-xs uppercase tracking-wide text-signal">
                {group.category}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line bg-void/35 px-3 py-1 text-xs text-ink transition-colors duration-200 hover:border-signal hover:text-signal"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
