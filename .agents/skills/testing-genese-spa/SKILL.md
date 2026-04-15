# Testing: Gênese do Equilíbrio SPA

## Overview
Pure HTML5/CSS3/Vanilla JS Single Page Application for mental health. No backend — all data persisted in `localStorage`. No CI configured.

## Environment Setup
```bash
cd /home/ubuntu/repos/pilar-da-consciencia
python3 -m http.server 8080 &
# App available at http://localhost:8080
```
No dependencies to install — static files only.

## Devin Secrets Needed
None — no authentication services or APIs required.

## Authentication Flow
- On fresh load (no `genese_user` in localStorage), the auth portal (`#auth-portal`) is shown
- **Login**: Submit `#form-login` with any email/password → username derived from email prefix
- **Signup**: Submit `#form-signup` with Name, Email, Password (min 8 chars) → stores password as cofre password
- **Auto-login**: If `genese_user.loggedIn === true` in localStorage, auth portal is skipped
- To test fresh state: clear localStorage via browser console `localStorage.clear()` then reload

## Key Testing Paths

### Dashboard (default page after login)
- Streak counter at top: `#streak-days` shows current streak count
- Diário Terapêutico form: select mood via `.btn-mood` buttons → type in `#texto-diario` → click "Registrar Agora"
- Diary submission triggers: `registerStreakEntry()` + `addXP(10)` + TCC analysis in `#ia-feedback`
- Stats cards show: Qualidade Sono, Ofensiva (streak days), XP Total

### Streak System
- First entry: count = 1
- If 24h ≤ delta_t < 48h since last entry: count increments + blue fire animation
- If delta_t ≥ 48h: saves record to Mural de Resiliência, resets to 1
- To test streak reset: manually set `genese_streak.lastEntry` to 3+ days ago in localStorage

### Theme Switching
- Theme selector: `#theme-select` dropdown in header bar
- Options: azul (default), verde, sepia, noturno
- Changes `body.className` to `theme-{value}` and saves to `genese_theme` in localStorage
- Verify: background color changes visibly, toast "Tema alterado para {name}." appears

### SOS Button
- Button: `#sos-fab` at bottom-right (position: fixed)
- Requires **3-second continuous hold** (mousedown → 3000ms timer → openSOSPanel)
- A quick click will NOT open the panel — this is intentional safety design
- Panel contains: breathing animation circle, "Ligar CVV (188)" link (href="tel:188"), "Estou melhor agora" close button
- To test: use `mouse_move` to SOS button → `left_mouse_down` → wait 4 seconds → `left_mouse_up`

### Page Navigation
- Sidebar nav links: `.nav-link[data-page]` → shows `#page-{page}` content
- Available pages: dashboard, diario, educacional, evolucao, chatbot, foco, meditacao, metas, sono, gad7, glossario, comunidade

### Chatbot Lumi
- Page: chatbot → `#page-chatbot`
- Input: type message in chat input → click send button
- Lumi responds with TCC-based empathetic phrases
- Each message exchange adds 3 XP

### Psicoeducação
- Page: educacional → `#page-educacional`
- Contains Schema.org MedicalCondition articles: Depressão (serotonina), Ansiedade (eixo HPA), Burnout (cortisol), Transtornos Alimentares

## localStorage Keys
| Key | Type | Description |
|-----|------|-------------|
| `genese_user` | Object | `{name, email, loggedIn}` |
| `genese_streak` | Object | `{count, lastEntry, record, records[]}` |
| `genese_diary` | Array | Diary entries with humor, relato, timestamp |
| `genese_xp` | Object | `{xp, level}` |
| `genese_theme` | String | Current theme name |
| `genese_cofre_password` | String | Password for Cofre de Memórias |
| `genese_heatmap` | Object | Mood data keyed by ISO date |

## Known Behaviors
- Password strength meter shows in real-time during signup (Fraca/Razoável/Boa/Forte)
- Tempo de Tela counter resets on page reload (tracks active session time)
- Backup Local shows "Sincronizando..." animation periodically
- The SOS button might not respond to simple click — this is correct behavior (3-second hold required)
- Web Audio API features (Pomodoro binaural beats, Meditation) require user interaction to start due to browser autoplay policy
