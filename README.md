# glauberportfolio

Portfólio de Glauber Monteiro: Next.js 16 (App Router), React 19, Tailwind CSS v4. É a implementação do protótipo **Portfolio v5** do Claude Design.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Stack de animação

| Efeito | Biblioteca | Onde |
|---|---|---|
| Loader 000→100 + cortina, nome letra a letra, reveal com blur no scroll | **anime.js v4** | `lib/motion.ts` |
| Contadores das estatísticas | **React Bits** (`CountUp`, via registry reactbits.dev) | `components/reactbits/CountUp.tsx` |
| Notebook 3D que muda a tela e se desmonta a cada capítulo | **Three.js** | `lib/laptop-scene.ts` |
| Scroll suave | **Lenis** | `components/Portfolio.tsx` |

## Estrutura

- `lib/data.ts`: **todo o conteúdo** (textos, trajetória, projetos, skills, links). Comece editando aqui.
- `components/Portfolio.tsx`: orquestra o estado, o loop de scroll, o Lenis e a cena 3D.
- `components/sections/*`: uma seção por arquivo.
- `app/globals.css`: tokens de cor (tema escuro/claro), keyframes e breakpoints (`md` = 768px, `lg` = 1100px).

## Pendências do conteúdo

Os placeholders entre `[colchetes]` vieram do protótipo: resultados dos projetos, projetos pessoais, número de projetos entregues, prazo de resposta, WhatsApp, LinkedIn e GitHub.
O formulário de contato **simula** o envio: veja o `TODO` em `submit` (`components/Portfolio.tsx`) para integrar com Resend, Formspree ou uma rota `/api`.
