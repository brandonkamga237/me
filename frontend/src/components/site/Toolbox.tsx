import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Sticker } from "@/components/site/Sticker";
import { Stickers } from "@/components/motion/Stickers";
import { BrandIcon } from "@/components/ui/BrandIcon";
import type { Dictionary } from "@/lib/dictionaries";
import { getSkills } from "@/services/api";
import { type Skill, type SkillCategory, skillCategories } from "@/services/types";

const TONES: Record<SkillCategory, "light" | "dark" | "gold"> = {
  language: "gold",
  backend: "dark",
  frontend: "light",
  data: "gold",
  platform: "dark",
  practice: "light",
};
const dots = { light: "bg-white", dark: "bg-black", gold: "bg-accent" };

/** A steady, hand-placed looking tilt per sticker, between -8 and 8 degrees. */
function tilt(name: string): number {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 997;
  return (h % 17) - 8;
}

/** Two bands of tools sliding in opposite directions, then the toolbox as a numbered index. */
export async function Toolbox({ dict }: { dict: Dictionary }) {
  const skills = await getSkills();
  const groups = skillCategories
    .map((category) => ({ category, items: skills.filter((s) => s.category === category) }))
    .filter((g) => g.items.length > 0);
  const branded = skills.filter((s) => s.icon);
  const half = Math.ceil(branded.length / 2);

  return (
    <Reveal
      as="section"
      id="skills"
      index="04"
      className="mode-light relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] py-24 md:py-36"
    >
      <div className="gutter">
        <SectionHeader id="skills" index="04" label={dict.nav.skills} title={dict.skills.title} intro={dict.skills.intro} />
      </div>

      {branded.length > 0 && (
        <div aria-hidden className="-rotate-2 space-y-3 py-6 md:space-y-5">
          <Marquee duration={45}>
            <Band skills={branded.slice(0, half)} />
          </Marquee>
          <Marquee duration={50} reverse>
            <Band skills={branded.slice(half)} outlined />
          </Marquee>
        </div>
      )}

      {/* The toolbox as a wall of stickers: grab one, throw it. Colour tells the family. */}
      <div className="gutter mt-16 md:mt-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="eyebrow flex flex-wrap gap-x-5 gap-y-2 text-muted">
            {groups.map(({ category }) => (
              <li key={category} className="inline-flex items-center gap-2">
                <span className={`size-2.5 rounded-full border border-black/20 ${dots[TONES[category]]}`} />
                {dict.skills.categories[category]}
              </li>
            ))}
          </ul>
          <p aria-hidden className="eyebrow text-accent-ink">
            ↖ {dict.skills.drag}
          </p>
        </div>
        <Stickers className="corners relative flex min-h-[22rem] flex-wrap content-center items-center justify-center gap-x-3 gap-y-5 px-4 py-14 md:gap-x-4 md:gap-y-6 md:px-16">
          {groups.flatMap(({ category, items }) =>
            items.map((skill) => (
              <Sticker key={skill.id} tone={TONES[category]} tilt={tilt(skill.name)}>
                {skill.icon && <BrandIcon slug={skill.icon} className="size-4 md:size-5" />}
                {skill.name}
              </Sticker>
            )),
          )}
        </Stickers>
      </div>
    </Reveal>
  );
}

function Band({ skills, outlined = false }: { skills: Skill[]; outlined?: boolean }) {
  return (
    <>
      {skills.map((skill) => (
        <span key={skill.id} className="flex items-center gap-5 px-6 md:gap-7 md:px-9">
          {skill.icon && <BrandIcon slug={skill.icon} className="size-10 md:size-16" />}
          <span
            className={`whitespace-nowrap text-[clamp(2.6rem,7vw,7rem)] font-bold uppercase leading-none tracking-[-0.05em] ${outlined ? "text-outline" : ""}`}
          >
            {skill.name}
          </span>
          <span className="ml-5 text-3xl text-accent-ink md:ml-7">✦</span>
        </span>
      ))}
    </>
  );
}
