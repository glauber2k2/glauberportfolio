import { SOCIALS, lucide } from "@/lib/data";
import { Container, Icon, ext } from "../ui";

export function Footer({ year }: { year: number }) {
  return (
    <footer className="relative z-[2] border-t border-line bg-bg pt-12 pb-7">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col leading-[1.35]">
            <span className="text-[18px] font-semibold tracking-[-.02em]">Glauber Monteiro</span>
            <span className="text-[14px] text-fg2">Desenvolvedor Front-end</span>
          </div>
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                {...ext(s.href)}
                className="flex size-[42px] items-center justify-center rounded-[11px] border border-line text-fg2 transition-[color,background-color] duration-300 hover:bg-bg3 hover:text-fg"
              >
                <Icon src={s.icon} className="size-[17px]" />
              </a>
            ))}
            <a href="#top" className="ml-1.5 flex h-[42px] items-center gap-2 rounded-[11px] border border-line2 px-3.5 text-[14px] text-fg hover:bg-bg3 hover:text-fg">
              Voltar ao topo <Icon src={lucide("arrow-up")} className="size-3.5" />
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-2 border-t border-line pt-[22px] font-mono text-[12px] text-fg3">
          <span>Trazendo soluções digitais para problemas reais</span>
          <span>© {year} Glauber Monteiro</span>
        </div>
      </Container>
    </footer>
  );
}
