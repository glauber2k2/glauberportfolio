import { FILTERS, isConfidential, lucide, type Filter, type Project } from "@/lib/data";
import { ConfidentialBadge, Eyebrow, Icon, Panel, SplitGrid, cx, ext, h2Class, tagClass } from "../ui";

type Props = {
  visible: Project[];
  active: number;
  filter: Filter;
  onFilter: (f: Filter) => void;
  onHover: (i: number | null) => void;
  onOpen: (id: string) => void;
};

export function Projects({ visible, active, filter, onFilter, onHover, onOpen }: Props) {
  return (
    <section id="projetos" data-chapter="4" className="relative pt-[46vh] pb-[6vh] lg:pt-[24vh] lg:pb-[16vh]">
      <SplitGrid>
        <Panel side="R">
          <Eyebrow n="04" label="Projetos" />
          <h2 data-reveal="" data-delay="60" className={`mt-0 mb-3.5 ${h2Class}`}>Projetos</h2>
          <p data-reveal="" data-delay="120" className="mt-0 mb-7 text-[17px] text-fg2">Estudos de caso de projetos profissionais, freelance e pessoais.</p>

          <div data-reveal="" data-delay="160" role="tablist" aria-label="Filtrar projetos" className="no-scrollbar mb-3 inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-line bg-bg2 p-1">
            {FILTERS.map((fl) => {
              const on = filter === fl;
              return (
                <button
                  key={fl}
                  role="tab"
                  aria-selected={on}
                  onClick={() => onFilter(fl)}
                  className={cx(
                    "h-[38px] flex-none cursor-pointer rounded-[9px] border-0 px-[15px] text-[14px] transition-[background-color,color] duration-300",
                    on ? "bg-bg3 text-fg" : "bg-transparent text-fg2",
                  )}
                >
                  {fl}
                </button>
              );
            })}
          </div>

          <div>
            {visible.map((p, i) => (
              <article
                key={p.id}
                data-proj=""
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
                className={cx("relative border-b border-line py-8 transition-opacity duration-500 lg:min-h-[50vh]", i === active ? "lg:opacity-100" : "lg:opacity-40")}
              >
                <div className="mb-3.5 flex items-center gap-2.5 font-mono text-[12px] tracking-[.04em] text-fg3">
                  <span className="text-acc">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-5 bg-line2" />
                  <span>{p.cat} · {p.year}</span>
                </div>
                <h3 className="mt-0 mb-1.5 text-[clamp(26px,2.6vw,36px)] leading-[1.08] font-semibold tracking-[-.035em] text-balance">{p.title}</h3>
                <div className="mb-3.5 text-[15px] text-fg2">{p.org || "Projeto pessoal"}</div>
                <p className="mt-0 mb-[18px] max-w-[500px] text-[16px] leading-[1.55] text-pretty text-fg2">{p.problem}</p>
                <div className="mb-[22px] flex flex-wrap gap-1.5">
                  {p.tags.map((g) => <span key={g} className={tagClass}>{g}</span>)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onOpen(p.id)}
                    className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-full border-0 bg-acc-btn px-[18px] text-[14px] font-medium text-white transition-transform duration-300 hover:-translate-y-px"
                  >
                    Ver estudo de caso
                  </button>
                  {isConfidential(p) ? (
                    <ConfidentialBadge className="h-[42px] px-4 text-[14px]" />
                  ) : (
                    <>
                      {p.url && (
                        <a href={p.url} {...ext(p.url)} className="inline-flex h-[42px] items-center gap-1.5 rounded-full border border-line2 px-4 text-[14px] font-medium text-fg hover:bg-bg3 hover:text-fg">
                          Ver projeto <Icon src={lucide("arrow-up-right")} className="size-3.5" />
                        </a>
                      )}
                      {p.repo && (
                        <a href={p.repo} {...ext(p.repo)} className="inline-flex h-[42px] items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium text-fg2 hover:bg-bg3 hover:text-fg">
                          Código
                        </a>
                      )}
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </SplitGrid>
    </section>
  );
}
