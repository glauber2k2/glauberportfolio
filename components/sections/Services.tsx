import { SERVICES, STEPS, lucide } from "@/lib/data";
import { Eyebrow, Icon, Panel, SplitGrid, cx, h2Class } from "../ui";

export function Services({ step, onAskQuote }: { step: number; onAskQuote: () => void }) {
  return (
    <section id="servicos" data-chapter="5" className="relative pt-8 pb-14 desk:pt-[24vh] desk:pb-[16vh]">
      <SplitGrid>
        <Panel side="L">
          <Eyebrow n="05" label="Serviços" />
          <h2 data-reveal="" data-delay="60" className={`mt-0 mb-8 ${h2Class}`}>Como posso ajudar</h2>

          <div className="flex flex-col gap-2.5">
            {SERVICES.map((sv) => (
              <div key={sv.title} data-reveal="" data-delay={sv.delay} className="flex flex-col gap-3 rounded-[18px] border border-line bg-bg2 p-[22px] transition-[border-color] duration-300 hover:border-line2">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex size-[38px] flex-none items-center justify-center rounded-[10px] border border-line2 text-acc">
                    <Icon src={sv.icon} className="size-[18px]" />
                  </span>
                  <h3 className="m-0 text-[18px] leading-[1.3] font-semibold tracking-[-.02em]">{sv.title}</h3>
                </div>
                <p className="m-0 text-[15px] leading-[1.55] text-fg2">{sv.text}</p>
                <a href="#contato" onClick={onAskQuote} className="inline-flex h-9 items-center gap-1.5 self-start text-[14px] font-medium text-acc hover:text-fg">
                  Pedir orçamento <Icon src={lucide("arrow-right")} className="size-3.5" />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <div data-reveal="" className="mb-7 font-mono text-[12px] tracking-[.08em] text-fg3 uppercase">Processo</div>
            {STEPS.map((t, i) => {
              const done = i < step, cur = i === step;
              return (
                <div key={t} data-step="" className="relative flex gap-[18px] pb-7 desk:min-h-[14vh]">
                  {i < 3 && (
                    <span aria-hidden="true" className={cx("absolute top-[38px] bottom-1 left-[17px] w-px transition-[background-color] duration-400", done ? "bg-acc" : "bg-line2")} />
                  )}
                  <span
                    className={cx(
                      "flex size-9 flex-none items-center justify-center rounded-full border font-mono text-[12px] transition-[background-color,border-color,color] duration-400",
                      done ? "border-acc bg-acc-btn text-white" : cur ? "border-acc bg-acc-soft text-acc" : "border-line2 bg-transparent text-fg3",
                    )}
                  >
                    {"0" + (i + 1)}
                  </span>
                  <span className={cx("pt-[5px] text-[18px] font-medium tracking-[-.015em] transition-colors duration-400", done || cur ? "text-fg" : "text-fg2")}>{t}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </SplitGrid>
    </section>
  );
}
