// Conteúdo do portfólio. Itens entre [colchetes] são placeholders a preencher.

export const EMAIL = "devglaubermonteiro@gmail.com";
export const PHONE = "+55 (83) 98908-4615";
export const PHONE_RAW = "5583989084615";
export const WHATSAPP = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent("Olá, Glauber! Vim pelo seu portfólio.")}`;
export const LINKEDIN = "https://www.linkedin.com/in/glaubersm";
export const GITHUB = "https://github.com/glauber2k2";

/** Layout desktop (cena 3D lateral). Espelha a variante `desk:` de app/globals.css. */
export const DESK_MQ = "(min-width: 1100px) and (min-height: 640px), (min-width: 900px) and (min-height: 700px) and (orientation: landscape)";

export const lucide = (n: string) => `https://unpkg.com/lucide-static@0.400.0/icons/${n}.svg`;
export const simple = (n: string) => `https://cdn.simpleicons.org/${n}`;

export const ABOUT =
  "Sou desenvolvedor focado em front-end, com experiência em React, Next.js e Tailwind CSS. Comecei com projetos freelance em 2022, passei por projetos para as mais diversas áreas, e hoje trabalho como desenvolvedor front-end.";

export type Chapter = { id: string; n: string; label: string };
export const CHAPTERS: Chapter[] = [
  { id: "top", n: "00", label: "Início" },
  { id: "sobre", n: "01", label: "Sobre" },
  { id: "trajetoria", n: "02", label: "Trajetória" },
  { id: "skills", n: "03", label: "Skills" },
  { id: "projetos", n: "04", label: "Projetos" },
  { id: "servicos", n: "05", label: "Serviços" },
  { id: "contato", n: "06", label: "Contato" },
];

export type TimelineItem = {
  kind: "Formação" | "Experiência";
  year: string;
  ys: string;
  title: string;
  org?: string;
  desc?: string;
  tags?: string[];
  current?: boolean;
};
export const TIMELINE: TimelineItem[] = [
  { kind: "Formação", year: "2020", ys: "2020", title: "Início da graduação em Ciência da Computação" },
  { kind: "Experiência", year: "2022", ys: "2022", title: "Desenvolvedor freelance", desc: "Página de exibição de projetos arquitetônicos para a Trinity e página de apresentação e cadastro de novos membros para um clube de tiro da minha cidade." },
  { kind: "Experiência", year: "2023", ys: "2023", title: "Estagiário front-end", org: "Conte Cornetet Arquitetura", desc: "Desenvolvi um sistema de transcrição de áudio em tempo real para apoiar relatórios e vistorias.", tags: ["React", "Next.js", "Tailwind CSS"] },
  { kind: "Experiência", year: "2023", ys: "2023", title: "Estagiário e líder de front-end", org: "UNIPE (Cruzeiro do Sul)", desc: "Sistema de gestão de plantões do curso de Medicina. Divisão de equipes por matéria e local, e registro de presença dos alunos por geolocalização.", tags: ["React", "Next.js"] },
  { kind: "Experiência", year: "Set/2023 – Mar/2024", ys: "2023–24", title: "Desenvolvedor front-end", org: "Btor Soluções Computacionais", desc: "Iniciei como estagiário. Atuei com Flutter, Angular e React, além de contato com C#.", tags: ["Flutter", "Angular", "React", "C#"] },
  { kind: "Formação", year: "2024", ys: "2024", title: "Conclusão da graduação em Ciência da Computação" },
  { kind: "Formação", year: "2025 – 2026", ys: "2025–26", title: "Pós-graduação em Programação Web Full Stack" },
  { kind: "Experiência", year: "2026", ys: "2026", title: "Desenvolvedor Front-end Júnior", org: "AAHBRANT Engenharia & Construções", desc: "[Atuando como front-end Júnior, desenvolvendo interfaces responsivas e funcionais com React, Next.js e Tailwind,]", current: true },
];

export type ProjectCat = "Profissional" | "Freelance" | "Pessoal";
export type Project = {
  id: string;
  short: string;
  title: string;
  org: string;
  year: string;
  cat: ProjectCat;
  problem: string;
  tags: string[];
  ctx: string;
  prob: string;
  did: string;
  res: string;
  /** Site publicado (botão "Ver projeto"). */
  url?: string;
  /** Repositório (botão "Código"). */
  repo?: string;
};
export const PROJECTS: Project[] = [
  { id: "guf", short: "Guf App - Evolução Fitness", title: "Guf App - Evolução Fitness", org: "Dev Glauber", year: "2026", cat: "Pessoal", problem: "Medir evolução de um indivíduo ao longo de sua jornada da academia.", tags: ["React", "Next.js", "Tailwind CSS", "Supabase"], ctx: "Projeto desenvolvido em 2026", prob: "Um atleta ou iniciante na academia, não consegue saber com exatidão o peso, e repetição que fez no exercicio da semana passada, e com isso nunca tem noção se está estagnado ou evoluindo", did: "Desenvolvi todo o aplicativo, para que o usuário consiga medir sua evolução através de registro de cada exercício que faz, e em tempo real saber seu desempenho no mesmo da semana passada.", res: "Noção de progresso com o tempo, e melhora no avanço do emagrecimento e hipetrofia.", url: "https://gufapp.vercel.app/login/", repo: "https://github.com/glauber2k2/GUF_PWA"},
  { id: "transcricao", short: "transcrição em tempo real", title: "Transcrição de áudio em tempo real", org: "Conte Cornetet", year: "2023", cat: "Profissional", problem: "Transcrever falas em tempo real para apoiar relatórios e vistorias.", tags: ["React", "Next.js", "Tailwind CSS"], ctx: "Estágio front-end na Conte Cornetet Arquitetura, em 2023.", prob: "Durante as vistorias, a equipe precisava registrar o que era dito e depois transformar esse conteúdo em relatório.", did: "Desenvolvi o sistema de transcrição de áudio em tempo real: captura do áudio no navegador, exibição do texto conforme a fala e organização do conteúdo para uso nos relatórios. [Revisar detalhes técnicos]", res: "[Descrever o resultado: ex.: tempo economizado por relatório ou número de vistorias registradas]" },
  { id: "plantoes", short: "gestão de plantões", title: "Gestão de plantões com geolocalização", org: "UNIPE", year: "2023", cat: "Profissional", problem: "Organizar os plantões de Medicina e registrar a presença dos alunos pela localização.", tags: ["React", "Next.js"], ctx: "Estágio no sistema de gestão de plantões do curso de Medicina da UNIPE (Cruzeiro do Sul), onde atuei como líder de front-end.", prob: "Os plantões precisavam ser divididos por matéria e local, e a presença dos alunos tinha que ser confirmada no lugar do plantão.", did: "Liderei o front-end: telas de divisão de equipes por matéria e local e o fluxo de registro de presença por geolocalização.", res: "[Descrever o resultado]" },
  { id: "kreative", short: "site da agência", title: "Site da Kreative Agency", org: "Kreative Agency", year: "2026", cat: "Freelance", problem: "Apresentar os serviços de uma agência de marketing e produção audiovisual de João Pessoa e atrair novos clientes.", tags: ["Next.js", "React", "Motion", "Embla Carousel"], ctx: "Projeto freelance em 2026 para a Kreative Agency, agência de marketing e produção audiovisual em João Pessoa (PB).", prob: "A agência precisava de um site para apresentar seus serviços (tráfego pago, social media, criação de sites, foto e vídeo) para clientes de segmentos variados.", did: "Desenvolvi o site em Next.js, com animações em Motion e carrosséis com Embla Carousel (autoplay e auto-scroll). [Detalhar]", res: "[Descrever o resultado]", url: "https://kreative-site.vercel.app", repo: "https://github.com/glauber2k2/kreative_site" },
  { id: "bereshit", short: "missão bereshit", title: "Página da Missão Bereshit", org: "Missão Bereshit", year: "2025", cat: "Freelance", problem: "Divulgar uma missão de evangelismo e ação social em Igaracy (PB) e mobilizar doações de alimentos e recursos.", tags: ["Next.js", "React", "Motion"], ctx: "Página criada em 2025 para a Missão Bereshit, iniciativa de evangelismo e ação social na cidade de Igaracy (PB).", prob: "A missão precisava de uma página para apresentar o trabalho e convidar as pessoas a participar e contribuir com alimentos e recursos.", did: "Desenvolvi a página em Next.js com animações em Motion. [Detalhar funcionalidades, ex.: uso do html2canvas]", res: "[Descrever o resultado]", url: "https://bereshit.vercel.app", repo: "https://github.com/glauber2k2/bereshitpage" },
  { id: "trinity", short: "projetos arquitetônicos", title: "Página de projetos arquitetônicos", org: "Trinity", year: "2022", cat: "Freelance", problem: "Exibir os projetos arquitetônicos da Trinity em uma página.", tags: ["[Tecnologias]"], ctx: "Projeto freelance em 2022.", prob: "A Trinity precisava de uma página para apresentar seus projetos arquitetônicos.", did: "Desenvolvi a página de exibição dos projetos. [Detalhar]", res: "[Descrever o resultado]" },
  { id: "clube", short: "apresentação e cadastro", title: "Apresentação e cadastro de membros", org: "Clube de tiro", year: "2022", cat: "Freelance", problem: "Apresentar o clube e receber o cadastro de novos membros.", tags: ["[Tecnologias]"], ctx: "Projeto freelance em 2022 para um clube de tiro da minha cidade.", prob: "O clube precisava de uma página de apresentação e de uma forma de cadastrar novos membros.", did: "Desenvolvi a página de apresentação e o formulário de cadastro. [Detalhar]", res: "[Descrever o resultado]" },
  { id: "drprompt", short: "prompts na palma da mão", title: "DrPrompt", org: "", year: "2024", cat: "Pessoal", problem: "Ter prompts organizados e sempre à mão, em uma aplicação com conta de usuário.", tags: ["Next.js", "TypeScript", "Prisma", "NextAuth", "Tailwind CSS"], ctx: "Projeto pessoal full stack desenvolvido em 2024.", prob: "[Descrever o problema que motivou o projeto]", did: "Desenvolvi a aplicação em Next.js e TypeScript, com autenticação (NextAuth + Prisma), envio de e-mails com Nodemailer, tabelas com TanStack Table e formulários validados com React Hook Form e Zod.", res: "[Descrever o resultado]", url: "https://drprompt.vercel.app", repo: "https://github.com/glauber2k2/drprompt" },
  { id: "macros", short: "calculadora de macros", title: "MacroCalculator", org: "", year: "2024", cat: "Pessoal", problem: "Calcular os macronutrientes necessários de forma rápida e direta.", tags: ["Next.js", "TypeScript", "Tailwind CSS", "Zod"], ctx: "Projeto pessoal desenvolvido em 2024.", prob: "[Descrever o problema que motivou o projeto]", did: "Desenvolvi a calculadora em Next.js e TypeScript, com formulário validado por React Hook Form e Zod e componentes acessíveis com Radix UI.", res: "[Descrever o resultado]", url: "https://calculatemacros.vercel.app", repo: "https://github.com/glauber2k2/MacroCalculator" },
];

/** Projetos empresariais: código e link ficam sob confidencialidade. */
export const isConfidential = (p: Project) => p.cat === "Profissional";

export const FILTERS =["Todos", "Profissional", "Freelance", "Pessoal"] as const;
export type Filter = (typeof FILTERS)[number];

/** Cada peça do notebook 3D corresponde a um grupo de ferramentas. */
export const CALLOUTS = [
  { part: "Processador", text: "React · Next.js" },
  { part: "Memória RAM", text: "TypeScript · JavaScript" },
  { part: "Cooler", text: "Tailwind CSS · CSS" },
  { part: "Placa-mãe", text: "HTML" },
  { part: "SSD", text: "Node.js · Express" },
  { part: "Bateria", text: "Angular · React Native · Flutter" },
  { part: "Teclado", text: "Git · GitHub" },
  { part: "Tela", text: "Figma" },
  { part: "Gabinete inferior", text: "Vercel" },
];

export const SKILL_GROUPS: { title: string; items: [name: string, icon: string, part: string][] }[] = [
  { title: "Uso no dia a dia", items: [["React", "react", "Processador"], ["Next.js", "nextdotjs", "Processador"], ["Tailwind CSS", "tailwindcss", "Cooler"], ["TypeScript", "typescript", "Memória RAM"], ["JavaScript", "javascript", "Memória RAM"], ["HTML", "html5", "Placa-mãe"], ["CSS", "css", "Cooler"]] },
  { title: "Já utilizei em projetos", items: [["Node.js", "nodedotjs", "SSD"], ["Express", "express", "SSD"], ["Angular", "angular", "Bateria"], ["React Native", "react", "Bateria"], ["Flutter", "flutter", "Bateria"]] },
  { title: "Ferramentas", items: [["Git", "git", "Teclado"], ["GitHub", "github", "Teclado"], ["Figma", "figma", "Tela"], ["Vercel", "vercel", "Gabinete inferior"]] },
];

export const STEPS = ["Conversa inicial", "Proposta e prazo", "Desenvolvimento com entregas parciais", "Publicação e suporte"];

export const SOCIALS = [
  { label: "GitHub", href: GITHUB, icon: simple("github") },
  { label: "LinkedIn", href: LINKEDIN, icon: lucide("linkedin") },
  { label: "WhatsApp", href: WHATSAPP, icon: simple("whatsapp") },
  { label: "E-mail", href: "mailto:" + EMAIL, icon: lucide("mail") },
];

const STACK_SIZE = SKILL_GROUPS.reduce((n, g) => n + g.items.length, 0);

export const STATS = [
  { pre: "Desde", count: 2022 as number | null, from: 2000, val: "2022", label: "programando profissionalmente", delay: 0 },
  { pre: "", count: 5 as number | null, from: 0, val: "5", label: "empresas e instituições atendidas", delay: 90 },
  // Total calculado a partir das Skills (atualiza sozinho ao adicionar tecnologias)
  { pre: "", count: STACK_SIZE as number | null, from: 0, val: String(STACK_SIZE), label: "tecnologias e ferramentas na stack", delay: 180 },
];

export const COMPANIES = ["Trinity", "Conte Cornetet Arquitetura", "UNIPE / Cruzeiro do Sul", "Btor Soluções Computacionais", "AAHBRANT Engenharia & Construções"];

export const SERVICES = [
  { title: "Sites institucionais e landing pages", text: "Páginas rápidas e responsivas para apresentar sua empresa ou produto, prontas para publicar.", icon: lucide("layout-template"), delay: 0 },
  { title: "Interfaces e dashboards para sistemas web", text: "Telas em React e Next.js integradas à sua API, com tabelas, filtros e formulários.", icon: lucide("layout-dashboard"), delay: 90 },
  { title: "Melhorias de performance e responsividade em sites existentes", text: "Ajustes de layout no celular e redução do tempo de carregamento em sites que já estão no ar.", icon: lucide("gauge"), delay: 180 },
];

export const CONTACT_TYPES = ["Vaga de emprego", "Projeto freelance", "Outro"];

export type FormState = { name: string; email: string; type: string; msg: string };
export type FormStatus = "idle" | "loading" | "success";
export const EMPTY_FORM: FormState = { name: "", email: "", type: "Projeto freelance", msg: "" };
