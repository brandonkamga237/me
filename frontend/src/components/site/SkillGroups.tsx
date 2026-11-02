import { BrandIcon } from "@/components/ui/BrandIcon";
import type { Dictionary } from "@/lib/dictionaries";
import { getSkills } from "@/services/api";
import { skillCategories } from "@/services/types";

interface SkillGroupsProps {
  dict: Dictionary;
}

export async function SkillGroups({ dict }: SkillGroupsProps) {
  const skills = await getSkills();
  const groups = skillCategories
    .map((category) => ({ category, items: skills.filter((s) => s.category === category) }))
    .filter((g) => g.items.length > 0);
  return (
    <dl className="divide-y divide-border border-y border-border">
      {groups.map(({ category, items }) => (
        <div key={category} className="grid gap-4 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
          <dt className="font-mono text-xs uppercase tracking-widest text-muted sm:pt-2">
            {dict.skills.categories[category]}
          </dt>
          <dd>
            <ul className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <li
                  key={skill.id}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3.5 py-1.5 text-sm"
                >
                  {skill.icon && <BrandIcon slug={skill.icon} />}
                  {skill.name}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
