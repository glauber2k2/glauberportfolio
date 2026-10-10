import { useRef, type UIEvent } from "react";
import { FILTERS, isConfidential, lucide, type Filter, type Project } from "@/lib/data";
import { ConfidentialBadge, Eyebrow, Icon, Panel, SplitGrid, cx, ext, h2Class, tagClass } from "../ui";

type Props = {
  visible: Project[];
  active: number;
  filter: Filter;
  reduced: boolean;
  onFilter: (f: Filter) => void;
  onHover: (i: number | null) => void;
  onActive: (i: number) => void;
  onOpen: (id: string) => void;
};

const GAP = 12;
const pad2 = (n: number) => String(n).padStart(2, "0");
const ctlClass = "flex size-11 cursor-pointer items-center justify-center rounded-full border border-line2 bg-transparent text-fg";

/** Lista vertical no desktop (sincronizada com o scroll); carrossel com snap no mobile/tablet. */
export function Projects({ visible, active, filter, reduced, onFilter, onHover, onActive, onOpen }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const stepOf = (el: HTMLElement) => {
    const c = el.querySelector<HTMLElement>("[data-proj]");
    return c ? c.offsetWidth + GAP : 300;
  };
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    onActive(Math.round(el.scrollLeft / stepOf(el)));
  };
  const go = (d: number) => {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: d * stepOf(el), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="projetos" data-chapter="4" className="relative pt-8 pb-14 desk:pt-[24vh] desk:pb-[16vh]">
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
                  onClick={() => {
                    onFilter(fl);
                    if (rowRef.current) rowRef.current.scrollLeft = 0;
                  }}
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

          <div
            ref={rowRef}
            onScroll={onScroll}
            className={cx(
              "no-scrollbar -mx-[clamp(20px,4vw,48px)] flex snap-x snap-mandatory scroll-px-[clamp(20px,4vw,48px)] gap-3 overflow-x-auto px-[clamp(20px,4vw,48px)] pt-1 pb-2",
              "desk:m-0 desk:block desk:overflow-visible desk:p-0",
            )}
          >
            {visible.map((p, i) => (
              <article
                key={p.id}
                data-proj=""
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
                className={cx(
                  "relative flex flex-[0_0_86%] snap-start flex-col rounded-[20px] border border-line bg-bg2 p-[22px] transition-opacity duration-500 md:flex-[0_0_58%]",
                  "desk:min-h-[50vh] desk:rounded-none desk:border-x-0 desk:border-t-0 desk:bg-transparent desk:px-0 desk:py-8",
                  i === active ? "desk:opacity-100" : "desk:opacity-40",
                )}
              >
                <div className="mb-3.5 flex items-center gap-2.5 font-mono text-[12px] tracking-[.04em] text-fg3">
                  <span className="text-acc">{pad2(i + 1)}</span>
                  <span className="h-px w-5 bg-line2" />
                  <span>{p.cat} · {p.year}</span>
                </div>
                <h3 className="mt-0 mb-1.5 text-[clamp(26px,2.6vw,36px)] leading-[1.08] font-semibold tracking-[-.035em] text-balance">{p.title}</h3>
                <div className="mb-3.5 text-[15px] text-fg2">{p.org || "Projeto pessoal"}</div>
                <p className="mt-0 mb-[18px] max-w-[500px] text-[16px] leading-[1.55] text-pretty text-fg2">{p.problem}</p>
                <div className="mb-[22px] flex flex-wrap gap-1.5">
                  {p.tags.map((g) => <span key={g} className={tagClass}>{g}</span>)}
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
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

          {/* Controles do carrossel (mobile/tablet) */}
          <div className="mt-3.5 flex items-center justify-between gap-3 desk:hidden">
            <span className="font-mono text-[12px] tracking-[.06em] text-fg3 tabular-nums">
              {pad2(Math.min(visible.length, active + 1))} / {pad2(visible.length)}
            </span>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} aria-label="Projeto anterior" className={ctlClass}>
                <Icon src={lucide("arrow-left")} className="size-4" />
              </button>
              <button onClick={() => go(1)} aria-label="Próximo projeto" className={ctlClass}>
                <Icon src={lucide("arrow-right")} className="size-4" />
              </button>
            </div>
          </div>
        </Panel>
      </SplitGrid>
    </section>
  );
}
