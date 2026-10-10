import * as THREE from "three";
import { ABOUT, CALLOUTS, EMAIL, PROJECTS, STEPS, TIMELINE, lucide, type FormState, type FormStatus, type Project } from "./data";

/** Estado que a cena lê a cada frame (vem do componente React). */
export type SceneInput = {
  /** Capítulo contínuo: 0..7 (parte inteira = seção, fração = progresso na seção). */
  c: number;
  /** Progresso de chegada ao rodapé (0..1) — o notebook se desfaz. */
  endT: number;
  mx: number | null;
  my: number | null;
  hoverTarget: Element | null;
  reduced: boolean;
  fine: boolean;
  modal: string | null;
  hl: string | null;
  projHover: number | null;
  proj: number;
  visible: Project[];
  tl: number;
  step: number;
  form: FormState;
  status: FormStatus;
  /** Loader terminou (no modo compacto o notebook já abre no hero). */
  loaded: boolean;
  /** Menu mobile aberto (esconde o dock). */
  menu: boolean;
  /** Layout desktop (DESK_MQ); fora dele a cena vai para o slot do hero / dock. */
  desk: boolean;
};

type Hooks = {
  host: HTMLDivElement;
  glow: HTMLDivElement | null;
  callouts: HTMLDivElement | null;
  read: () => SceneInput;
  setLapClick: (fn: (() => void) | null) => void;
  openModal: (id: string) => void;
  /** Abre o estudo de caso do projeto ativo no carrossel (toque no dock). */
  openActive: () => void;
  /** Slot do hero onde o notebook aparece antes de encolher para o dock. */
  heroSlot: () => HTMLElement | null;
};

type Explode = { x?: number; y?: number; z?: number; rx?: number };
type Part = {
  name: string;
  grp: THREE.Group;
  ex: Explode;
  win: [number, number];
  em: THREE.LineBasicMaterial;
  anchor: THREE.Vector3 | null;
  home: THREE.Vector3;
  lit: boolean | null;
  sc: THREE.Vector3;
  sr: THREE.Vector3;
};
type Pose = { x: number; y: number; s: number; rx: number; ry: number; lid: number; keys: number; ex: number; on: number };

const cssv = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

export function createLaptopScene(h: Hooks) {
  const { host } = h;
  THREE.ColorManagement.enabled = false;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(renderer.domElement);

  const fontMono = cssv("--font-geist-mono") || '"Geist Mono"';
  const fontSans = cssv("--font-geist-sans") || '"Geist"';

  const V = THREE.Vector3;
  const acc0 = cssv("--acc") || "#4F7CFF";
  const DIST = 12.5;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
  cam.position.set(0, 1.4, DIST);
  cam.lookAt(0, 0.2, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(5, 9, 7);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-6, 3, -4);
  scene.add(fill);
  const rim = new THREE.PointLight(acc0, 26, 30);
  rim.position.set(-4, 1.5, 3);
  scene.add(rim);

  // PRNG determinístico: a explosão é sempre igual
  let seed = 5;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rdir = (m: number) => new V(rnd() - 0.5, rnd() - 0.2, rnd() - 0.5 + 0.35).normalize().multiplyScalar(m);
  const std = (c: THREE.ColorRepresentation, r: number, m: number) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const M = {
    case: std(0x3f3f46, 0.42, 0.6), deck: std(0x46464f, 0.45, 0.55), key: std(0x161618, 0.75, 0.1),
    board: std(0x1f2a24, 0.8, 0.2), chip: std(acc0, 0.35, 0.25), ram: std(0x3a3a40, 0.6, 0.3),
    ssd: std(0x52525b, 0.5, 0.4), fan: std(0x71717a, 0.5, 0.4), bat: std(0x27272a, 0.7, 0.2), pad: std(0x55555e, 0.3, 0.5),
  };
  M.chip.emissive = new THREE.Color(acc0).multiplyScalar(0.2);

  // Tela do notebook = canvas 2D desenhado conforme o capítulo
  const SW = 1024, SH = 640;
  const sc = document.createElement("canvas");
  sc.width = SW;
  sc.height = SH;
  const g = sc.getContext("2d")!;
  const tex = new THREE.CanvasTexture(sc);
  tex.anisotropy = 4;
  const scr = new THREE.MeshBasicMaterial({ map: tex });

  const parts: Record<string, Part> = {};
  const all: Part[] = [];
  const pick: THREE.Object3D[] = [];
  const part = (name: string, ex: Explode, win: [number, number], anchor?: [number, number, number]) => {
    const p: Part = {
      name, grp: new THREE.Group(), ex, win,
      em: new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 }),
      anchor: anchor ? new V(...anchor) : null, home: new V(), lit: false, sc: new V(), sr: new V(),
    };
    parts[name] = p;
    all.push(p);
    return p;
  };
  const box = (p: Part, w: number, hh: number, d: number, mat: THREE.Material, x: number, y: number, z: number, noEdge?: boolean) => {
    const geo = new THREE.BoxGeometry(w, hh, d);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.userData.part = p;
    if (!noEdge) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), p.em));
    p.grp.add(m);
    pick.push(m);
    return m;
  };

  const root = new THREE.Group();
  scene.add(root);
  const bottom = part("Gabinete inferior", { y: -1.7 }, [0.6, 1], [-1.8, 0.05, 1.2]);
  box(bottom, 4, 0.1, 2.7, M.case, 0, 0.05, 0);
  const bat = part("Bateria", { y: -1.0, z: 0.3 }, [0.55, 0.95], [-1.0, 0.15, 0.6]);
  box(bat, 2.5, 0.07, 0.95, M.bat, 0, 0.14, 0.6);
  box(bat, 0.5, 0.072, 0.95, M.chip, -1.0, 0.141, 0.6, true);
  const board = part("Placa-mãe", { y: -0.15 }, [0.5, 0.9], [1.5, 0.14, -0.3]);
  box(board, 3.3, 0.03, 1.15, M.board, 0, 0.13, -0.55);
  for (let i = 0; i < 9; i++) box(board, 0.08 + rnd() * 0.14, 0.04, 0.08 + rnd() * 0.12, M.ssd, -1.5 + rnd() * 3, 0.16, -1 + rnd() * 0.9, true);
  const cpu = part("Processador", { y: 0.85, x: -0.2 }, [0.35, 0.75], [-0.45, 0.2, -0.55]);
  box(cpu, 0.5, 0.05, 0.5, M.chip, -0.45, 0.17, -0.55);
  box(cpu, 0.32, 0.02, 0.32, M.ram, -0.45, 0.205, -0.55, true);
  const ram = part("Memória RAM", { y: 0.6, x: 0.5 }, [0.4, 0.8], [0.55, 0.18, -0.46]);
  box(ram, 0.85, 0.03, 0.18, M.ram, 0.55, 0.16, -0.32);
  box(ram, 0.85, 0.03, 0.18, M.ram, 0.55, 0.16, -0.6);
  const ssd = part("SSD", { y: 0.5, x: 1.0, z: -0.2 }, [0.45, 0.85], [1.3, 0.18, -0.85]);
  box(ssd, 0.62, 0.03, 0.2, M.ssd, 1.3, 0.16, -0.85);
  const fan = part("Cooler", { y: 1.05, x: -0.9 }, [0.3, 0.7], [-1.25, 0.2, -0.6]);
  const fanRot = new THREE.Group();
  fanRot.position.set(-1.25, 0.17, -0.6);
  fan.grp.add(fanRot);
  {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 40), M.chip);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(-1.25, 0.17, -0.6);
    ring.userData.part = fan;
    fan.grp.add(ring);
    pick.push(ring);
    for (let i = 0; i < 7; i++) {
      const bl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.012, 0.08), M.fan);
      bl.position.set(Math.cos((i / 7) * 6.283) * 0.16, 0, Math.sin((i / 7) * 6.283) * 0.16);
      bl.rotation.y = (-i / 7) * 6.283;
      bl.rotation.x = 0.35;
      bl.userData.part = fan;
      fanRot.add(bl);
      pick.push(bl);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), M.key);
    hub.userData.part = fan;
    fanRot.add(hub);
  }
  const deck = part("Gabinete superior", { y: 1.35 }, [0.1, 0.45]);
  box(deck, 4, 0.05, 2.7, M.deck, 0, 0.235, 0);
  const pad = part("Trackpad", { y: 1.85, z: 0.7 }, [0.05, 0.4]);
  box(pad, 1.25, 0.012, 0.74, M.pad, 0, 0.266, 0.78);

  const keys = part("Teclado", {}, [0, 1]);
  type Key = { m: THREE.Mesh; home: THREE.Vector3; up: number; rx: number; rz: number; s: number; sc: THREE.Vector3; sr: number };
  const keyList: Key[] = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 14; c++) {
      const wide = r === 4 && c === 4;
      if (r === 4 && c > 4 && c <= 8) continue;
      const w = wide ? 0.2 * 5 + 0.045 * 4 : 0.2;
      const x = -1.62 + c * 0.245 + (wide ? (w - 0.2) / 2 : 0);
      const m = box(keys, w, 0.04, 0.2, M.key, x, 0.285, -1.12 + r * 0.25);
      keyList.push({ m, home: m.position.clone(), up: 1.05 + rnd() * 0.75, rx: (rnd() - 0.5) * 0.9, rz: (rnd() - 0.5) * 0.9, s: c * 0.03 + r * 0.04, sc: rdir(8 + rnd() * 9), sr: (rnd() - 0.5) * 10 });
    }

  const lid = part("Tela", { y: 2.4, z: -1.0, rx: 0.3 }, [0, 0.35]);
  const lidIn = new THREE.Group();
  lid.grp.add(lidIn);
  const back = new THREE.Mesh(new THREE.BoxGeometry(4, 0.06, 2.62), M.case);
  back.position.set(0, 0, 1.31);
  back.add(new THREE.LineSegments(new THREE.EdgesGeometry(back.geometry), lid.em));
  back.userData.part = lid;
  lidIn.add(back);
  pick.push(back);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 2.3), scr);
  screen.rotation.x = Math.PI / 2;
  screen.position.set(0, -0.032, 1.33);
  screen.userData.part = lid;
  lidIn.add(screen);
  pick.push(screen);
  lid.grp.position.set(0, 0.345, -1.35);

  all.forEach((p) => {
    root.add(p.grp);
    p.home.copy(p.grp.position);
    p.sc = rdir(9 + rnd() * 7);
    p.sr = new V((rnd() - 0.5) * 6, (rnd() - 0.5) * 6, (rnd() - 0.5) * 6);
  });
  const anchorOf: Record<string, () => THREE.Vector3> = {
    Teclado: () => keyList[13].m.getWorldPosition(new V()),
    Tela: () => back.localToWorld(new V(1.7, 0, 0.9)),
  };

  const c01 = (v: number) => Math.max(0, Math.min(1, v));
  const ramp = (x: number, a: number, b: number) => c01((x - a) / (b - a));
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const S = (o: Partial<Pose>): Pose => ({ x: 1, y: -0.2, s: 1, rx: 0.15, ry: -0.45, lid: 1, keys: 0, ex: 0, on: 1, ...o });

  // Keyframes de pose por capítulo (posição/rotação/tampa/teclas/explosão)
  const KF: [number, Pose][] = [
    [0, S({ y: -0.35, s: 1.08, rx: 0.38, ry: -0.62, lid: 0.1, on: 0.15 })],
    [0.22, S({ y: -0.35, s: 1.08, rx: 0.38, ry: -0.62, lid: 0.1, on: 0.15 })],
    [0.62, S({ y: -0.15, s: 1.08, rx: 0.16, ry: -0.45 })],
    [1.15, S({ x: -1, y: -0.1, rx: 0.12, ry: 0.5 })],
    [1.85, S({ x: -1, y: -0.1, rx: 0.14, ry: 0.36 })],
    [2.15, S({ y: -0.25, rx: 0.45, ry: -0.4, lid: 0.95 })],
    [2.85, S({ y: -0.25, rx: 0.5, ry: -0.25, lid: 0.95, keys: 1 })],
    [3.08, S({ x: 0, y: 0.35, s: 0.78, rx: 0.5, ry: -0.7, keys: 1 })],
    [3.42, S({ x: 0, y: 0.35, s: 0.78, rx: 0.45, ry: -0.45, keys: 1, ex: 1 })],
    [3.85, S({ x: 0, y: 0.35, s: 0.78, rx: 0.4, ry: 0.15, keys: 1, ex: 1 })],
    [4.15, S({ x: -1, y: -0.1, s: 1.05, rx: 0.12, ry: 0.45 })],
    [4.85, S({ x: -1, y: -0.1, s: 1.05, rx: 0.12, ry: 0.32 })],
    [5.15, S({ y: -0.25, s: 0.95, rx: 0.32, ry: -0.85, lid: 0.8 })],
    [5.85, S({ y: -0.25, s: 0.95, rx: 0.28, ry: -0.6, lid: 0.9 })],
    [6.15, S({ y: -0.15, s: 1.05, rx: 0.14, ry: -0.42 })],
    [7, S({ y: -0.15, s: 1.05, rx: 0.14, ry: -0.42 })],
  ];
  const FIELDS: (keyof Pose)[] = ["x", "y", "s", "rx", "ry", "lid", "keys", "ex", "on"];
  const sample = (c: number): Pose => {
    let i = 0;
    while (i < KF.length - 2 && c > KF[i + 1][0]) i++;
    const [c0, a] = KF[i], [c1, b] = KF[i + 1];
    const t = smooth(c01((c - c0) / (c1 - c0)));
    const o = {} as Pose;
    FIELDS.forEach((k) => { o[k] = a[k] + (b[k] - a[k]) * t; });
    return o;
  };
  const cur = sample(0);

  // ---------- Desenho da tela (canvas 2D) ----------
  const FM = (px: number, wt?: number) => `${wt || 400} ${px}px ${fontMono}`;
  const FS = (px: number, wt?: number) => `${wt || 500} ${px}px ${fontSans}`;
  const wrap = (txt: string, n: number) => {
    const out: string[] = [];
    String(txt).split("\n").forEach((par) => {
      let line = "";
      par.split(" ").forEach((w) => {
        while (w.length > n) { if (line) { out.push(line); line = ""; } out.push(w.slice(0, n)); w = w.slice(n); }
        if ((line ? line + " " + w : w).length > n) { out.push(line); line = w; } else line = line ? line + " " + w : w;
      });
      out.push(line);
    });
    return out;
  };
  const rr = (x: number, y: number, w: number, hh: number, r: number) => {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  };
  const check = (x: number, y: number, s: number) => {
    g.strokeStyle = "#fff"; g.lineWidth = s * 0.11; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(x + s * 0.27, y + s * 0.52); g.lineTo(x + s * 0.44, y + s * 0.68); g.lineTo(x + s * 0.75, y + s * 0.34); g.stroke();
  };
  const chrome = (title: string, A: string) => {
    g.fillStyle = "#0B0B0E"; g.fillRect(0, 0, SW, SH);
    g.fillStyle = "#141418"; g.fillRect(0, 0, SW, 46);
    g.fillStyle = "#1E1E24"; g.fillRect(0, 46, SW, 1);
    ["#3A3A42", "#3A3A42", A].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(26 + i * 22, 23, 6, 0, 7); g.fill(); });
    g.font = FM(17); g.fillStyle = "#71717A"; g.textAlign = "center"; g.fillText(title, SW / 2, 29); g.textAlign = "left";
  };
  const termLines = ["$ whoami", "glauber-monteiro", "", "$ cat sobre.txt", ...wrap(ABOUT, 62)];
  const termTotal = termLines.reduce((a, l) => a + l.length + 1, 0);

  type DrawData = { p?: number; i?: number; hl?: string | null; proj?: Project; kind?: number; f?: FormState; status?: FormStatus };
  const draw = (mode: string, d: DrawData, blink: number) => {
    const A = cssv("--acc") || acc0;
    if (mode === "hero") {
      chrome("dev.ts", A);
      const K = "#8B8B94", T = "#EDEDEF", P = "#5A5A63";
      const code: [string, string][][] = [
        [["const ", K], ["dev", T], [" = {", P]],
        [["  nome", T], [": ", P], ["'Glauber Monteiro'", A], [",", P]],
        [["  cargo", T], [": ", P], ["'Desenvolvedor Front-end'", A], [",", P]],
        [["  stack", T], [": [", P], ["'React'", A], [", ", P], ["'Next.js'", A], [", ", P], ["'Tailwind CSS'", A], ["],", P]],
        [["  disponivel", T], [": ", P], ["true", A], [",", P]],
        [["};", P]],
        [],
        [["export default ", K], ["dev", T], [";", P]],
      ];
      g.font = FM(23);
      code.forEach((ln, i) => {
        const y = 112 + i * 46;
        g.fillStyle = "#3A3A42"; g.fillText(String(i + 1).padStart(2, " "), 30, y);
        let x = 96;
        ln.forEach(([t, c]) => { g.fillStyle = c; g.fillText(t, x, y); x += g.measureText(t).width; });
        if (i === code.length - 1 && blink) { g.fillStyle = A; g.fillRect(x + 4, y - 20, 12, 26); }
      });
    } else if (mode === "about") {
      chrome("terminal — zsh", A); g.font = FM(20);
      let n = Math.floor(d.p! * termTotal), y = 96, lx = 40, ly = 96;
      for (const l of termLines) {
        if (n <= 0) break;
        const sh = l.slice(0, n); n -= l.length + 1;
        if (sh.startsWith("$")) { g.fillStyle = A; g.fillText("$", 40, y); g.fillStyle = "#EDEDEF"; g.fillText(sh.slice(1), 40 + g.measureText("$").width, y); }
        else { g.fillStyle = "#A1A1AA"; g.fillText(sh, 40, y); }
        lx = 40 + g.measureText(sh).width; ly = y; y += 34;
      }
      if (blink) { g.fillStyle = A; g.fillRect(lx + 4, ly - 17, 11, 22); }
    } else if (mode === "tl") {
      chrome("trajetoria.json", A);
      const i0 = d.i!, t = TIMELINE[i0];
      g.font = FM(19);
      TIMELINE.forEach((tt, i) => { const y = 106 + i * 60, on = i === i0; g.fillStyle = on ? A : i < i0 ? "#71717A" : "#3A3A42"; g.fillText((on ? "› " : "  ") + tt.ys, 34, y); });
      g.fillStyle = "#1E1E24"; g.fillRect(290, 74, 1, 530);
      g.font = FM(17); g.fillStyle = "#8B8B94"; g.fillText(t.kind.toUpperCase(), 336, 112);
      g.font = FS(92, 600); g.fillStyle = "#EDEDEF"; g.fillText(t.ys, 330, 214);
      const tl = wrap(t.title, 30).slice(0, 3); g.font = FS(34, 600); tl.forEach((l, k) => g.fillText(l, 336, 282 + k * 44));
      const y = 282 + tl.length * 44 + 8;
      if (t.org) { g.font = FM(19); g.fillStyle = A; g.fillText(t.org, 336, y); }
      if (t.tags) {
        let x = 336; g.font = FM(16);
        t.tags.forEach((tag) => { const w = g.measureText(tag).width + 26; g.strokeStyle = "#3A3A42"; g.lineWidth = 2; rr(x, 520, w, 36, 18); g.stroke(); g.fillStyle = "#A1A1AA"; g.fillText(tag, x + 13, 544); x += w + 10; });
      }
    } else if (mode === "skills") {
      chrome("inspecionar — componentes", A);
      g.font = FM(15); g.fillStyle = "#5A5A63"; g.fillText("PEÇA", 48, 90); g.fillText("FERRAMENTA", 470, 90);
      CALLOUTS.forEach((k, i) => {
        const y = 138 + i * 52, on = k.part === d.hl;
        if (on) { g.globalAlpha = 0.18; g.fillStyle = A; g.fillRect(28, y - 34, SW - 56, 50); g.globalAlpha = 1; }
        g.font = FM(19); g.fillStyle = on ? A : "#A1A1AA"; g.fillText(k.part, 48, y);
        g.font = FS(22, 500); g.fillStyle = "#EDEDEF"; g.fillText(k.text, 470, y);
        g.fillStyle = "#1E1E24"; g.fillRect(48, y + 16, SW - 96, 1);
      });
    } else if (mode === "proj") {
      const p = d.proj!;
      chrome("glaubermonteiro.dev/projetos/" + p.id, A);
      g.font = FM(16); g.fillStyle = A; g.fillText((p.cat + " · " + p.year).toUpperCase(), 48, 110);
      g.font = FS(40, 600); g.fillStyle = "#EDEDEF";
      const tl = wrap(p.title, 20).slice(0, 4); tl.forEach((l, k) => g.fillText(l, 48, 168 + k * 48));
      const y = 168 + tl.length * 48 + 6;
      g.font = FM(17); g.fillStyle = "#8B8B94"; g.fillText(p.org || "Projeto pessoal", 48, y);
      g.font = FS(20, 400); g.fillStyle = "#A1A1AA"; wrap(p.problem, 38).slice(0, 4).forEach((l, k) => g.fillText(l, 48, y + 46 + k * 30));
      const vx = 540, vy = 84, vw = 444, vh = 510;
      g.fillStyle = "#121216"; rr(vx, vy, vw, vh, 16); g.fill(); g.strokeStyle = "#26262D"; g.lineWidth = 2; g.stroke();
      if (d.kind === 0) {
        for (let i = 0; i < 38; i++) { const hh = 14 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 110; g.fillStyle = i < 26 ? A : "#3A3A42"; rr(vx + 30 + i * 10.2, vy + 150 - hh / 2, 5, hh, 2.5); g.fill(); }
        [300, 360, 250, 330, 200].forEach((w, i) => { g.fillStyle = i === 0 ? "#71717A" : "#2A2A31"; rr(vx + 30, vy + 270 + i * 40, w, 14, 7); g.fill(); });
        g.font = FM(15); g.fillStyle = A; g.fillText("● gravando", vx + 30, vy + 50);
      } else if (d.kind === 1) {
        const on = [2, 5, 9, 10, 16, 19, 23, 26];
        for (let i = 0; i < 28; i++) { const cx = vx + 28 + (i % 7) * 57, cy = vy + 40 + Math.floor(i / 7) * 57; g.fillStyle = on.includes(i) ? A : "#1E1E24"; rr(cx, cy, 49, 49, 8); g.fill(); }
        g.fillStyle = "#1A1A1F"; rr(vx + 28, vy + 290, vw - 56, 180, 12); g.fill();
        g.fillStyle = A; g.beginPath(); g.arc(vx + vw / 2, vy + 360, 14, 0, 7); g.fill();
        g.globalAlpha = 0.25; g.beginPath(); g.arc(vx + vw / 2, vy + 360, 42, 0, 7); g.fill(); g.globalAlpha = 1;
        g.font = FM(15); g.fillStyle = "#A1A1AA"; g.textAlign = "center"; g.fillText("presença confirmada", vx + vw / 2, vy + 440); g.textAlign = "left";
      } else if (d.kind === 2) {
        for (let i = 0; i < 4; i++) {
          const cx = vx + 28 + (i % 2) * 200, cy = vy + 30 + Math.floor(i / 2) * 230;
          g.save(); rr(cx, cy, 188, 216, 10); g.clip(); g.fillStyle = "#1A1A1F"; g.fillRect(cx, cy, 188, 216);
          g.strokeStyle = "#26262D"; g.lineWidth = 1.5;
          for (let k = -216; k < 188; k += 14) { g.beginPath(); g.moveTo(cx + k, cy + 216); g.lineTo(cx + k + 216, cy); g.stroke(); }
          g.restore();
        }
      } else if (d.kind === 3) {
        ["NOME", "E-MAIL", "TELEFONE"].forEach((l, i) => { const cy = vy + 40 + i * 104; g.font = FM(14); g.fillStyle = "#71717A"; g.fillText(l, vx + 32, cy + 14); g.strokeStyle = "#2A2A31"; g.lineWidth = 2; rr(vx + 32, cy + 26, vw - 64, 50, 10); g.stroke(); });
        g.fillStyle = A; rr(vx + 32, vy + 380, 200, 54, 27); g.fill(); g.font = FS(20, 600); g.fillStyle = "#fff"; g.fillText("Cadastrar", vx + 82, vy + 414);
      } else {
        g.setLineDash([10, 8]); g.strokeStyle = "#3A3A42"; g.lineWidth = 2; rr(vx + 28, vy + 28, vw - 56, vh - 56, 12); g.stroke(); g.setLineDash([]);
        g.font = FM(17); g.fillStyle = "#71717A"; g.textAlign = "center"; g.fillText("[imagem do projeto]", vx + vw / 2, vy + vh / 2); g.textAlign = "left";
      }
    } else if (mode === "proc") {
      chrome("processo.md", A);
      g.font = FS(38, 600); g.fillStyle = "#EDEDEF"; g.fillText("Processo", 56, 124);
      STEPS.forEach((t, i) => {
        const y = 196 + i * 90, done = i < d.i!, curS = i === d.i;
        if (done) { g.fillStyle = A; rr(56, y, 40, 40, 10); g.fill(); check(56, y, 40); }
        else { g.strokeStyle = curS ? A : "#3A3A42"; g.lineWidth = 3; rr(56, y, 40, 40, 10); g.stroke(); }
        g.font = FS(27, 500); g.fillStyle = done || curS ? "#EDEDEF" : "#5A5A63"; g.fillText(t, 120, y + 30);
        g.font = FM(15); g.fillStyle = "#5A5A63"; g.fillText("0" + (i + 1), SW - 92, y + 28);
      });
      g.fillStyle = "#1E1E24"; g.fillRect(56, 576, SW - 112, 8);
      g.fillStyle = A; g.fillRect(56, 576, (SW - 112) * c01((d.i! + 1) / 4), 8);
    } else if (mode === "mail") {
      chrome("nova mensagem", A);
      if (d.status === "success") {
        g.fillStyle = A; g.beginPath(); g.arc(SW / 2, 250, 58, 0, 7); g.fill(); check(SW / 2 - 58, 192, 116);
        g.textAlign = "center"; g.font = FS(44, 600); g.fillStyle = "#EDEDEF"; g.fillText("Mensagem pronta", SW / 2, 380);
        g.font = FM(18); g.fillStyle = "#8B8B94"; g.fillText("Finalize o envio no seu e-mail.", SW / 2, 424); g.textAlign = "left";
        return;
      }
      const f = d.f!;
      ([["Para", EMAIL], ["De", f.name || "—"], ["E-mail", f.email || "—"], ["Assunto", f.type]] as [string, string][]).forEach(([k, v], i) => {
        const y = 106 + i * 54;
        g.font = FM(16); g.fillStyle = "#5A5A63"; g.fillText(k.toUpperCase(), 48, y);
        g.font = FS(22, 500); g.fillStyle = i === 0 ? A : "#EDEDEF"; g.fillText(String(v).slice(0, 48), 190, y);
        g.fillStyle = "#1E1E24"; g.fillRect(48, y + 20, SW - 96, 1);
      });
      const ml = f.msg ? wrap(f.msg, 60).slice(-7) : ["Sua mensagem aparece aqui."];
      g.font = FM(20); g.fillStyle = f.msg ? "#C4C4CC" : "#3A3A42";
      ml.forEach((l, k) => g.fillText(l, 48, 352 + k * 32));
      if (blink && d.status === "idle") {
        const lx = f.msg ? 48 + g.measureText(ml[ml.length - 1]).width + 4 : 48, ly = f.msg ? 352 + (ml.length - 1) * 32 : 352;
        g.fillStyle = A; g.fillRect(lx, ly - 18, 11, 23);
      }
      if (d.status === "loading") { g.font = FM(17); g.fillStyle = A; g.fillText("Enviando…", 48, 600); }
    }
  };

  // ---------- Loop de render ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tmp = new V();
  let lw = 0, lh = 0, lastKey = "", themeLight: boolean | null = null, f = 0;
  const cw: [number, number][] = [];
  let disposed = false;
  if (document.fonts?.ready) document.fonts.ready.then(() => { lastKey = ""; });
  const t0 = performance.now();

  // ---------- Dock (mobile/tablet) ----------
  // O host sai do fundo em tela cheia e passa a ser uma "janela" fixa: começa sobre o slot do hero
  // e, conforme o slot sai da tela, encolhe até o canto inferior direito. Pode ser minimizado.
  const HOST_CSS = "position:fixed;inset:0;z-index:1;pointer-events:none";
  const iconHtml = (n: string, px: number) =>
    `<span aria-hidden="true" style="width:${px}px;height:${px}px;background:currentColor;-webkit-mask:url(${lucide(n)}) center/contain no-repeat;mask:url(${lucide(n)}) center/contain no-repeat"></span>`;
  let docked = false, dockMin = false, dockBtn: HTMLButtonElement | null = null, btnMin: boolean | null = null, dockChapter = 0;
  const onHostClick = () => {
    if (dockMin) { dockMin = false; return; }
    if (dockChapter === 4) h.openActive();
  };
  const layoutDock = (s: SceneInput) => {
    if (!docked) {
      docked = true;
      host.removeAttribute("aria-hidden");
      host.style.cssText = "position:fixed;z-index:4;pointer-events:auto;cursor:pointer;background:transparent";
      host.addEventListener("click", onHostClick);
      const b = document.createElement("button");
      b.type = "button";
      b.onclick = (e) => { e.stopPropagation(); dockMin = !dockMin; };
      host.appendChild(b);
      dockBtn = b; btnMin = null;
    }
    const vw = innerWidth, vh = innerHeight, dw = vw < 768 ? 150 : 220, dh = Math.round(dw * 0.72), g = 14;
    const slot = h.heroSlot();
    const r = slot && slot.offsetParent ? slot.getBoundingClientRect() : null;
    let m = r ? c01((84 - r.top) / (r.height * 0.75)) : 1;
    m = m * m * (3 - 2 * m);
    const min = dockMin && m > 0.99, dL = vw - dw - g, dT = vh - dh - g;
    let L = dL, T = dT, W = dw, H = dh, rad = 16;
    if (min) { W = H = 48; L = vw - 48 - g; T = vh - 48 - g; rad = 24; }
    else if (r) { L = r.left + (dL - r.left) * m; T = r.top + (dT - r.top) * m; W = r.width + (dw - r.width) * m; H = r.height + (dh - r.height) * m; rad = 22 - 6 * m; }
    const st = host.style;
    st.left = L.toFixed(1) + "px"; st.top = T.toFixed(1) + "px"; st.width = W.toFixed(1) + "px"; st.height = H.toFixed(1) + "px"; st.borderRadius = rad + "px";
    st.visibility = s.modal || s.menu ? "hidden" : "visible";
    const b = dockBtn!;
    if (btnMin !== min) {
      btnMin = min;
      b.setAttribute("aria-label", min ? "Mostrar notebook" : "Minimizar notebook");
      b.style.cssText = min
        ? "position:absolute;inset:0;z-index:3;border:0;border-radius:999px;background:transparent;color:var(--fg);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0"
        : "position:absolute;right:6px;top:6px;z-index:3;width:28px;height:28px;border:1px solid var(--line2);border-radius:999px;background:var(--nav);color:var(--fg2);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0";
      b.innerHTML = min ? iconHtml("laptop", 20) : iconHtml("minus", 12);
    }
    b.style.visibility = min || m > 0.6 ? "visible" : "hidden";
    renderer.domElement.style.visibility = min ? "hidden" : "visible";
    return !min;
  };
  const resetDock = () => {
    docked = false;
    host.removeEventListener("click", onHostClick);
    dockBtn?.remove(); dockBtn = null;
    host.style.cssText = HOST_CSS;
    host.setAttribute("aria-hidden", "true");
    renderer.domElement.style.visibility = "visible";
  };

  let lastCompact: boolean | null = null;
  const render = (now: number) => {
    if (disposed) return;
    const s = h.read();
    const t = (now - t0) / 1000;
    f++;
    const compact = !s.desk;
    if (compact !== lastCompact) {
      lastCompact = compact;
      renderer.setPixelRatio(Math.min(compact ? 1.5 : 2, devicePixelRatio || 1));
      lw = -1;
    }
    if (compact) { if (!layoutDock(s)) return; }
    else if (docked) resetDock();
    if (host.clientWidth !== lw || host.clientHeight !== lh) {
      lw = host.clientWidth; lh = host.clientHeight;
      if (lw && lh) { renderer.setSize(lw, lh, false); cam.aspect = lw / lh; cam.updateProjectionMatrix(); }
    }
    if (!lw || !lh) return;

    const light = document.documentElement.dataset.theme === "light";
    if (light !== themeLight) {
      themeLight = light;
      const A = cssv("--acc") || acc0;
      M.chip.color.set(A); M.chip.emissive.set(A).multiplyScalar(0.2); rim.color.set(A);
      M.case.color.set(light ? 0xc9c9cf : 0x3f3f46); M.deck.color.set(light ? 0xd4d4d8 : 0x46464f);
      M.key.color.set(light ? 0xfafafa : 0x161618); M.pad.color.set(light ? 0xbdbdc4 : 0x55555e);
      M.bat.color.set(light ? 0x52525b : 0x27272a);
      all.forEach((p) => { p.lit = null; });
      lastKey = "";
    }

    // No modo compacto o notebook já aparece aberto no hero (após o loader)
    const cc = compact && s.c < 1 ? Math.max(s.c, s.loaded ? 0.62 : 0) : s.c;
    const tgt = sample(cc), k = s.reduced ? 1 : 0.085;
    FIELDS.forEach((n) => { cur[n] += (tgt[n] - cur[n]) * k; });
    const endT = s.endT, eS = ease(endT), lidV = cur.lid, onV = cur.on * (1 - eS);
    const fade = 1 - ramp(endT, 0.45, 1);
    host.style.opacity = fade.toFixed(3);
    if (h.glow) h.glow.style.opacity = (0.5 * fade).toFixed(3);

    const halfW = Math.tan((17 * Math.PI) / 180) * DIST * cam.aspect;
    const px = s.mx != null ? s.mx / innerWidth - 0.5 : 0, py = s.my != null ? s.my / innerHeight - 0.5 : 0;
    const X = compact ? 0 : cur.x * Math.min(halfW * 0.46, 3.4);
    const Y = compact ? cur.y * 0.6 - 0.45 : cur.y;
    const Sc = compact ? cur.s * Math.min(0.95, halfW / 4.2) : cur.s;
    root.position.set(X, Y, 0);
    root.scale.setScalar(Sc);
    root.rotation.set(cur.rx + py * 0.1, cur.ry + px * 0.18 + (s.reduced ? 0 : Math.sin(t * 0.35) * 0.03), 0);

    const exOf = (p: Part) => ease(ramp(cur.ex, p.win[0], p.win[1]));
    all.forEach((p) => {
      if (p === keys) return;
      const e = exOf(p), x = p.ex;
      p.grp.position.set(p.home.x + (x.x || 0) * e + p.sc.x * eS, p.home.y + (x.y || 0) * e + p.sc.y * eS, p.home.z + (x.z || 0) * e + p.sc.z * eS);
      p.grp.rotation.set((p === lid ? -1.86 * lidV : 0) + (x.rx || 0) * e + p.sr.x * eS, p.sr.y * eS, p.sr.z * eS);
    });
    const eDeck = exOf(deck);
    keyList.forEach((q) => {
      const e = ease(ramp(cur.keys, q.s, q.s + 0.45));
      q.m.position.set(q.home.x + q.sc.x * eS, q.home.y + q.up * e + 1.35 * eDeck + q.sc.y * eS, q.home.z + q.sc.z * eS);
      q.m.rotation.set(q.rx * e + q.sr * eS, q.sr * 0.7 * eS, q.rz * e + q.sr * eS);
    });
    if (!s.reduced) fanRot.rotation.y = t * (1.5 + cur.ex * 6);
    scr.color.setScalar(0.1 + 0.9 * onV);
    root.updateMatrixWorld(true);

    // Hover nas peças (raycast), ignorado quando o ponteiro está sobre conteúdo
    let hov: Part | null = null;
    if (!compact && s.fine && s.mx != null && s.my != null && !s.modal) {
      const tg = s.hoverTarget;
      const blocked = tg?.closest?.("a,button,input,textarea,label,[data-callout],[data-skill],header,form,p,h1,h2,h3");
      if (!blocked) {
        ndc.set((s.mx / innerWidth) * 2 - 1, -(s.my / innerHeight) * 2 + 1);
        ray.setFromCamera(ndc, cam);
        const hit = ray.intersectObjects(pick, false)[0];
        hov = hit ? (hit.object.userData.part as Part) : null;
      }
    }
    const ch = Math.min(6, Math.floor(cc));
    dockChapter = ch;
    let hlName = s.hl || hov?.name || null;
    // Sem hover no mobile: em Skills as peças acendem uma a uma conforme o scroll
    if (compact && ch === 3 && !hlName) {
      const q = ramp(cc - 3, 0.15, 0.9);
      if (q > 0) hlName = CALLOUTS[Math.min(CALLOUTS.length - 1, Math.floor(q * CALLOUTS.length))].part;
    }
    all.forEach((p) => {
      const want = p.name === hlName;
      if (p.lit !== want) {
        p.lit = want;
        p.em.color.set(want ? cssv("--acc") || acc0 : light ? 0x09090b : 0xffffff);
        p.em.opacity = want ? 0.95 : light ? 0.16 : 0.1;
      }
    });
    const clickable = !!hov && hov.name === "Tela" && ch === 4;
    document.body.style.cursor = clickable ? "pointer" : "";
    const vis = s.visible.length ? s.visible : PROJECTS;
    const ap = Math.min(vis.length - 1, !compact && s.projHover != null ? s.projHover : s.proj);
    const proj = vis[Math.max(0, ap)] || PROJECTS[0];
    h.setLapClick(clickable ? () => h.openModal(proj.id) : null);

    const blink = s.reduced ? 1 : Math.floor(t * 1.8) % 2;
    let mode: string, key: string;
    const d: DrawData = {};
    if (ch === 0) { mode = "hero"; key = "h" + blink; }
    else if (ch === 1) { d.p = Math.max(0.01, ramp(cc - 1, 0.02, 0.7)); mode = "about"; key = "a" + Math.floor(d.p * termTotal) + blink; }
    else if (ch === 2) { d.i = s.tl; mode = "tl"; key = "t" + d.i; }
    else if (ch === 3) { d.hl = hlName; mode = "skills"; key = "s" + d.hl; }
    else if (ch === 4) { d.proj = proj; d.kind = ["transcricao", "plantoes", "trinity", "clube"].indexOf(proj.id); mode = "proj"; key = "p" + proj.id; }
    else if (ch === 5) { d.i = s.step; mode = "proc"; key = "r" + d.i; }
    else { d.f = s.form; d.status = s.status; mode = "mail"; key = "m" + d.f.name + "|" + d.f.email + "|" + d.f.type + "|" + d.f.msg + d.status + blink; }
    if (key !== lastKey) { lastKey = key; draw(mode, d, blink); tex.needsUpdate = true; }

    renderer.render(scene, cam);

    // Glow segue o notebook; callouts acompanham as peças na vista explodida
    const W = lw, H = lh;
    tmp.setFromMatrixPosition(root.matrixWorld).project(cam);
    const cx = ((tmp.x + 1) / 2) * W, cy = ((1 - tmp.y) / 2) * H;
    if (h.glow) { const gs = h.glow.offsetWidth; h.glow.style.transform = `translate(${(cx - gs / 2).toFixed(1)}px,${(cy - gs / 2).toFixed(1)}px)`; }
    const cr = h.callouts;
    if (cr && !compact) {
      const op = ramp(cur.ex, 0.55, 0.95) * (1 - endT);
      cr.style.opacity = op.toFixed(3);
      cr.style.visibility = op < 0.04 ? "hidden" : "visible";
      if (op >= 0.04) {
        const els = cr.querySelectorAll<HTMLElement>("[data-callout]");
        CALLOUTS.forEach((c, i) => {
          const el = els[i];
          if (!el) return;
          const p = parts[c.part];
          const wp = anchorOf[c.part] ? anchorOf[c.part]() : p.grp.localToWorld(p.anchor!.clone());
          wp.project(cam);
          const sx = ((wp.x + 1) / 2) * W, sy = ((1 - wp.y) / 2) * H, left = sx < cx;
          if (!cw[i] || f % 30 === 0) cw[i] = [el.offsetWidth, el.offsetHeight];
          el.style.flexDirection = left ? "row-reverse" : "row";
          el.style.transform = `translate(${(left ? sx - cw[i][0] + 5 : sx - 5).toFixed(1)}px,${(sy - cw[i][1] / 2).toFixed(1)}px)`;
          const card = el.querySelector<HTMLElement & { _on?: boolean }>("[data-ccard]");
          const on = c.part === hlName;
          if (card && card._on !== on) {
            card._on = on;
            card.style.borderColor = on ? "var(--acc)" : "";
            card.style.backgroundColor = on ? "var(--acc-soft)" : "";
          }
        });
      }
    }
  };

  const dispose = () => {
    disposed = true;
    if (docked) resetDock();
    document.body.style.cursor = "";
    tex.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };

  return { render, dispose };
}
