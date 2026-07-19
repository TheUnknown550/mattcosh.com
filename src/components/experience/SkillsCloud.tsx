import type { SkillGroup } from "@/types/skill";

interface SkillsCloudProps {
  groups: SkillGroup[];
}

export function SkillsCloud({ groups }: SkillsCloudProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.category}>
          <p className="font-mono text-xs uppercase tracking-wide text-signal">
            {group.category}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted transition-colors duration-200 hover:border-signal hover:text-ink"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
