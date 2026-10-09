import type { CSSProperties, ReactNode } from "react";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Ícone monocromático (SVG remoto como máscara, herda currentColor). */
export function Icon({ src, className, style }: { src: string; className?: string; style?: CSSProperties }) {
  return <span aria-hidden="true" className={cx("icon", className)} style={{ ["--icon" as string]: `url(${src})`, ...style }} />;
}

/** Todo link que não é âncora interna (#) abre em nova aba. */
export const ext = (href: string) => (href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" });

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1280px] px-[clamp(20px,4vw,48px)]", className)}>{children}</div>;
}

/** Grade 2 colunas no desktop: o conteúdo fica num lado e o notebook 3D no outro. */
export function SplitGrid({ children }: { children: ReactNode }) {
  return <Container className="grid grid-cols-1 lg:grid-cols-2">{children}</Container>;
}

/** Painel de vidro no mobile/tablet; transparente no desktop (onde a cena fica ao lado). */
export const panelClass =
  "min-w-0 max-w-[600px] rounded-[24px] border border-line bg-panel p-[clamp(22px,5vw,32px)] backdrop-blur-[14px] backdrop-saturate-[1.4] lg:border-transparent lg:bg-transparent lg:p-0 lg:[backdrop-filter:none] lg:[-webkit-backdrop-filter:none]";

export function Panel({ side, children, className }: { side: "L" | "R"; children: ReactNode; className?: string }) {
  return <div className={cx(panelClass, side === "L" ? "lg:col-start-1" : "lg:col-start-2", className)}>{children}</div>;
}

export function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div data-reveal="" className="mb-5 flex items-center gap-3 font-mono text-[12px] tracking-[.08em] text-fg3 uppercase">
      <span className="text-acc">{n}</span>
      <span className="h-px w-8 bg-line2" />
      <span>{label}</span>
    </div>
  );
}

/** Substitui "Ver projeto" em trabalhos empresariais (sob confidencialidade). */
export function ConfidentialBadge({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Projeto confidencial: link não disponível"
      title="Projeto empresarial sob acordo de confidencialidade"
      className={cx("inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-line2 font-medium text-fg3 select-none", className)}
    >
      <Icon src="https://unpkg.com/lucide-static@0.400.0/icons/lock.svg" className="size-3.5" />
      Confidencial
    </span>
  );
}

export const monoLabel ="font-mono text-[11px] tracking-[.08em] uppercase text-fg3";
export const tagClass = "inline-flex h-[26px] items-center rounded-full border border-line2 px-2.5 font-mono text-[12px] text-fg2";
export const h2Class = "font-semibold leading-none tracking-[-.045em] text-[clamp(40px,5vw,68px)]";
