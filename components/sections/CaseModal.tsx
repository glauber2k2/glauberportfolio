import { isConfidential, lucide, type Project } from "@/lib/data";
import { ConfidentialBadge, Icon, ext } from "../ui";

const hatch = "bg-bg3 bg-[repeating-linear-gradient(135deg,var(--line)_0_1px,transparent_1px_11px)]";

export function CaseModal({ project: m, onClose }: { project: Project; onClose: () => void }) {
  const sections = [
    { label: "Contexto", text: m.ctx },
    { label: "Problema", text: m.prob },
    { label: "O que eu fiz", text: m.did },
    { label: "Resultado", text: m.res },
  ];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Estudo de caso: ${m.title}`}
      onClick={onClose}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-[rgba(5,5,6,.72)] p-0 backdrop-blur-[10px] [animation:fadeIn_.35s_ease] md:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-full w-full max-w-[1120px] flex-col overflow-hidden rounded-none border border-line2 bg-bg2 [animation:modalIn_.6s_cubic-bezier(.22,1,.36,1)] md:max-h-[calc(100vh-48px)] md:rounded-[20px]"
      >
        <div className="flex flex-none items-center justify-between gap-4 border-b border-line py-3 pr-3.5 pl-6">
          <span className="font-mono text-[12px] text-fg3">Estudo de caso · {m.cat} · {m.year}</span>
          <button onClick={onClose} aria-label="Fechar" className="flex size-10 cursor-pointer items-center justify-center rounded-[10px] border border-line2 bg-transparent text-fg hover:bg-bg3">
            <Icon src={lucide("x")} className="size-4" />
          </button>
        </div>
        <div data-lenis-prevent="" className="grid min-h-0 flex-auto grid-cols-1 gap-[clamp(20px,3vw,40px)] overflow-y-auto p-[clamp(20px,2.6vw,32px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <div className="text-[14px] text-fg2">{m.org || "Projeto pessoal"}</div>
              <h2 className="m-0 text-[clamp(26px,2.6vw,36px)] leading-[1.05] font-semibold tracking-[-.035em] text-balance">{m.title}</h2>
            </div>
            <div className={`flex aspect-video items-end rounded-xl border border-line p-3 ${hatch}`}>
              <span className="font-mono text-[12px] text-fg3">imagem de capa · {m.short}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {["tela 01", "tela 02"].map((i) => (
                <div key={i} className={`flex aspect-video items-end rounded-[10px] border border-line p-2.5 ${hatch}`}>
                  <span className="font-mono text-[11px] text-fg3">{i}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            {sections.map((sx) => (
              <div key={sx.label} className="flex flex-col gap-1 border-b border-line py-3">
                <div className="font-mono text-[11px] tracking-[.08em] text-acc uppercase">{sx.label}</div>
                <p className="m-0 text-[14.5px] leading-[1.5] text-pretty text-fg">{sx.text}</p>
              </div>
            ))}
            <div className="flex flex-col gap-2 py-3">
              <div className="font-mono text-[11px] tracking-[.08em] text-acc uppercase">Tecnologias</div>
              <div className="flex flex-wrap gap-1.5">
                {m.tags.map((g) => (
                  <span key={g} className="rounded-full border border-line2 px-[11px] py-1 font-mono text-[12px] text-fg2">{g}</span>
                ))}
              </div>
            </div>
            <div className="mt-auto flex flex-wrap gap-2.5 pt-3">
              {isConfidential(m) ? (
                <ConfidentialBadge className="h-11 px-5 text-[15px]" />
              ) : (
                <>
                  {m.url && (
                    <a href={m.url} {...ext(m.url)} className="inline-flex h-11 items-center gap-2 rounded-full bg-acc-btn px-5 text-[15px] font-medium text-white hover:text-white">
                      Ver projeto <Icon src={lucide("arrow-up-right")} className="size-3.5" />
                    </a>
                  )}
                  {m.repo && (
                    <a href={m.repo} {...ext(m.repo)} className="inline-flex h-11 items-center gap-2 rounded-full border border-line2 px-5 text-[15px] font-medium text-fg hover:bg-bg3 hover:text-fg">Código</a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
