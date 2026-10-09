import { SKILL_GROUPS, simple } from "@/lib/data";
import { Container, Eyebrow, Icon, cx, monoLabel, panelClass } from "../ui";

export function Skills({ hl, onHighlight }: { hl: string | null; onHighlight: (part: string | null) => void }) {
  return (
    <section id="skills" data-chapter="3" className="relative h-auto lg:h-[300vh]">
      <div className="relative top-0 flex h-auto flex-col justify-between gap-8 pt-[46vh] pb-[6vh] lg:sticky lg:h-screen lg:pt-[110px] lg:pb-8">
        <Container>
          <div className={cx(panelClass, "max-w-[600px] lg:max-w-[400px]")}>
            <Eyebrow n="03" label="Skills" />
            <h2 data-reveal="" data-delay="60" className="mt-0 mb-4 text-[clamp(36px,4.2vw,56px)] leading-[1.02] font-semibold tracking-[-.045em] text-balance">
              O que tem por dentro
            </h2>
            <p data-reveal="" data-delay="120" className="m-0 text-[16px] leading-[1.6] text-pretty text-fg2">
              Cada peça do notebook corresponde a uma ferramenta que uso. Passe o mouse sobre as peças ou sobre os nomes abaixo.
            </p>
          </div>
        </Container>
        <Container>
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
            {SKILL_GROUPS.map((gr, gi) => (
              <div key={gr.title} data-reveal="" data-delay={gi * 90} className="rounded-2xl border border-line bg-panel p-4 backdrop-blur-[12px]">
                <div className={`mb-3 ${monoLabel}`}>{gr.title}</div>
                <div className="flex flex-wrap gap-1.5">
                  {gr.items.map(([name, icon, part]) => {
                    const on = hl === part;
                    return (
                      <span
                        key={name}
                        data-skill=""
                        onMouseEnter={() => onHighlight(part)}
                        onMouseLeave={() => onHighlight(null)}
                        className={cx(
                          "inline-flex h-[34px] cursor-default items-center gap-[7px] rounded-[9px] border px-[11px] text-[13.5px] text-fg transition-[border-color,background-color] duration-[250ms]",
                          on ? "border-acc bg-acc-soft" : "border-line bg-transparent",
                        )}
                      >
                        <Icon src={simple(icon)} className="size-3.5" />
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
