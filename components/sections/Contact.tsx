import type { FormEvent, ReactNode } from "react";
import { CONTACT_TYPES, EMAIL, GITHUB, LINKEDIN, WHATSAPP, lucide, simple, type FormState, type FormStatus } from "@/lib/data";
import { Eyebrow, Icon, Panel, SplitGrid, cx, ext, monoLabel } from "../ui";

type Props = {
  form: FormState;
  status: FormStatus;
  copied: boolean;
  onField: (k: keyof FormState, v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onReset: () => void;
  onCopy: () => void;
};

const inputClass = "rounded-[10px] border border-line2 bg-bg px-3.5 text-[15px] text-fg outline-none transition-[border-color] duration-[250ms] focus:border-acc";
const linkCard = "flex min-h-[58px] items-center justify-between gap-3 rounded-[14px] border border-line bg-bg2 px-[18px] text-[15px] text-fg transition-[border-color,background-color] duration-300 hover:border-line2 hover:bg-bg3 hover:text-fg";

function LinkCard({ href, icon, label, delay }: { href: string; icon: string; label: ReactNode; delay?: number }) {
  return (
    <a data-reveal="" data-delay={delay} href={href} {...ext(href)} className={linkCard}>
      <span className="flex items-center gap-3"><Icon src={icon} className="size-[19px]" />{label}</span>
      <Icon src={lucide("arrow-up-right")} className="size-[15px] text-fg3" />
    </a>
  );
}

export function Contact({ form, status, copied, onField, onSubmit, onReset, onCopy }: Props) {
  const loading = status === "loading";
  const firstName = form.name.trim().split(" ")[0] || "pelo contato";
  return (
    <section id="contato" data-chapter="6" className="relative pt-[46vh] pb-[6vh] lg:pt-[24vh] lg:pb-[10vh]">
      <SplitGrid>
        <Panel side="L">
          <Eyebrow n="06" label="Contato" />
          <h2 data-reveal="" data-delay="60" className="mt-0 mb-[18px] text-[clamp(44px,5.6vw,76px)] leading-none font-semibold tracking-[-.05em]">Vamos conversar</h2>
          <p data-reveal="" data-delay="120" className="mt-0 mb-9 max-w-[520px] text-[17px] leading-[1.6] text-pretty text-fg2">
            Respondo em até [24h]. Para vagas, envie a descrição da oportunidade; para projetos, conte o que você precisa.
          </p>

          {status !== "success" ? (
            <form data-reveal="" data-delay="160" onSubmit={onSubmit} className="flex flex-col gap-4 rounded-[20px] border border-line bg-bg2 p-[clamp(20px,2.4vw,28px)]">
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                <label className="flex min-w-0 flex-col gap-2">
                  <span className={monoLabel}>Nome</span>
                  <input required value={form.name} onChange={(e) => onField("name", e.target.value)} placeholder="Seu nome" className={cx(inputClass, "h-12")} />
                </label>
                <label className="flex min-w-0 flex-col gap-2">
                  <span className={monoLabel}>E-mail</span>
                  <input required type="email" value={form.email} onChange={(e) => onField("email", e.target.value)} placeholder="voce@empresa.com" className={cx(inputClass, "h-12")} />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <span className={monoLabel}>Tipo de contato</span>
                <div role="radiogroup" aria-label="Tipo de contato" className="flex flex-wrap gap-1.5">
                  {CONTACT_TYPES.map((ty) => {
                    const on = form.type === ty;
                    return (
                      <button
                        key={ty}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => onField("type", ty)}
                        className={cx(
                          "h-10 cursor-pointer rounded-full border px-[15px] text-[14px] transition-[background-color,border-color,color] duration-[250ms]",
                          on ? "border-acc bg-acc-soft text-fg" : "border-line2 bg-transparent text-fg2",
                        )}
                      >
                        {ty}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex flex-col gap-2">
                <span className={monoLabel}>Mensagem</span>
                <textarea required rows={4} value={form.msg} onChange={(e) => onField("msg", e.target.value)} placeholder="Conte o que você precisa" className={cx(inputClass, "resize-y py-3 leading-[1.55]")} />
              </label>
              <button
                type="submit"
                disabled={loading}
                className={cx(
                  "inline-flex h-[50px] cursor-pointer items-center justify-center gap-2.5 self-stretch rounded-full border-0 bg-acc-btn px-[26px] text-[15px] font-medium text-white transition-[transform,opacity] duration-300 hover:-translate-y-px md:self-start",
                  loading ? "opacity-75" : "opacity-100",
                )}
              >
                {loading && <span aria-hidden="true" className="size-4 rounded-full border-2 border-white/35 border-t-white [animation:spin_.8s_linear_infinite]" />}
                <span>{loading ? "Enviando…" : "Enviar mensagem"}</span>
              </button>
            </form>
          ) : (
            <div role="status" className="flex flex-col items-start gap-3.5 rounded-[20px] border border-line bg-bg2 p-[clamp(24px,3vw,36px)] [animation:rise_.6s_cubic-bezier(.22,1,.36,1)]">
              <span aria-hidden="true" className="flex size-[52px] items-center justify-center rounded-full bg-acc-btn text-white [animation:pop_.5s_cubic-bezier(.22,1,.36,1)_.1s_both]">
                <Icon src={lucide("check")} className="size-6" />
              </span>
              <h3 className="m-0 text-[26px] font-semibold tracking-[-.03em]">Mensagem pronta para envio</h3>
              <p className="m-0 text-[16px] leading-[1.6] text-fg2">Obrigado, {firstName}. Finalize o envio no seu app de e-mail — respondo em até [24h]. Se preferir, chame no WhatsApp.</p>
              <button onClick={onReset} className="h-[42px] cursor-pointer rounded-full border border-line2 bg-transparent px-[18px] text-[14px] text-fg hover:bg-bg3">
                Enviar outra mensagem
              </button>
            </div>
          )}

          <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
            <LinkCard href={WHATSAPP} icon={simple("whatsapp")} label="WhatsApp" />
            <button data-reveal="" data-delay="60" onClick={onCopy} aria-label={`Copiar e-mail ${EMAIL}`} className={cx(linkCard, "cursor-pointer text-left")}>
              <span className="flex min-w-0 items-center gap-3">
                <Icon src={lucide("mail")} className="size-[19px]" />
                <span className="truncate">{EMAIL}</span>
              </span>
              <span className={cx("flex-none font-mono text-[11px] tracking-[.06em] uppercase", copied ? "text-ok" : "text-fg3")}>{copied ? "Copiado" : "Copiar"}</span>
            </button>
            <LinkCard href={LINKEDIN} icon={lucide("linkedin")} label="LinkedIn" delay={120} />
            <LinkCard href={GITHUB} icon={simple("github")} label="GitHub" delay={180} />
          </div>
        </Panel>
      </SplitGrid>
    </section>
  );
}
