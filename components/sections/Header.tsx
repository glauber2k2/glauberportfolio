import { CHAPTERS, SOCIALS, lucide } from "@/lib/data";
import { Icon, cx, ext } from "../ui";

type Props = {
  chapter: number;
  scrolled: boolean;
  menuOpen: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onToggleMenu: () => void;
};

const NAV = CHAPTERS.slice(1).map((c, i) => ({ ...c, j: i + 1 }));

export function Header({ chapter, scrolled, menuOpen, theme, onToggleTheme, onToggleMenu }: Props) {
  const compact = scrolled && !menuOpen;
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[85] px-[clamp(12px,3vw,28px)]">
        <div
          className={cx(
            "pointer-events-auto mx-auto flex items-center justify-between gap-4 rounded-full border",
            "transition-[max-width,padding,margin,background-color,border-color] duration-[600ms,500ms,500ms,400ms,400ms] ease-nav",
            compact
              ? "mt-3 max-w-[1040px] border-line2 bg-nav p-[7px] backdrop-blur-[16px] backdrop-saturate-[1.4]"
              : "mt-3.5 max-w-[1280px] border-transparent bg-transparent px-0 py-3.5",
          )}
        >
          <a href="#top" aria-label="Início" className="flex items-center gap-2.5 text-fg">
            <span className="flex size-[34px] items-center justify-center rounded-full border border-line2 font-mono text-[13px] font-medium tracking-[-.02em]">GM</span>
          </a>

          <nav
            aria-label="Capítulos"
            className={cx(
              "hidden items-center gap-0.5 rounded-full border p-[3px] transition-[border-color,background-color] duration-400 lg:flex",
              compact ? "border-transparent bg-transparent" : "border-line bg-nav",
            )}
          >
            {NAV.map((c) => {
              const on = chapter === c.j;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className={cx(
                    "relative flex h-9 items-center gap-[7px] rounded-full px-3 text-[13.5px] transition-[color,background-color] duration-300 hover:bg-bg3 hover:text-fg",
                    on ? "text-fg" : "text-fg2",
                  )}
                >
                  <span className={cx("font-mono text-[11px]", on ? "text-acc" : "text-fg3")}>{c.n}</span>
                  <span>{c.label}</span>
                  <span aria-hidden="true" className="absolute inset-x-3 bottom-[5px] h-px overflow-hidden bg-line">
                    <span data-navfill={c.j} className="absolute inset-0 origin-left bg-acc" style={{ transform: "scaleX(0)" }} />
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-transparent text-fg2 transition-[color,background-color] duration-300 hover:bg-bg3 hover:text-fg"
            >
              <Icon src={lucide(theme === "dark" ? "sun" : "moon")} className="size-[17px]" />
            </button>
            <a
              href="#contato"
              className="hidden h-10 items-center gap-2 rounded-full bg-acc-btn px-[18px] text-[14px] font-medium text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-px hover:text-white hover:shadow-[0_8px_24px_-10px_var(--glow)] md:flex"
            >
              Fale comigo
            </a>
            <button
              onClick={onToggleMenu}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-transparent text-fg lg:hidden"
            >
              <Icon src={lucide(menuOpen ? "x" : "menu")} className="size-[18px]" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-bg px-[clamp(20px,6vw,40px)] pt-[104px] pb-8 [animation:fadeIn_.3s_ease]">
          <nav aria-label="Menu" className="flex flex-col">
            {NAV.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="flex items-baseline gap-4 border-b border-line py-3 text-[clamp(32px,9vw,48px)] leading-[1.15] font-semibold tracking-[-.04em] text-fg [animation:rise_.6s_cubic-bezier(.22,1,.36,1)_both]"
                style={{ animationDelay: `${(0.08 + i * 0.06).toFixed(2)}s` }}
              >
                <span className="font-mono text-[13px] tracking-normal text-acc">{c.n}</span>
                <span>{c.label}</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto flex gap-2.5">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} {...ext(s.href)} className="flex size-12 items-center justify-center rounded-xl border border-line2 text-fg">
                <Icon src={s.icon} className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
