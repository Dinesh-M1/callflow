# CALLFLOW — Contact Centre Staff App

A React + TypeScript + Vite frontend prototype. No backend is required.

## Requirements
- Node.js 20+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (`http://localhost:5173/`).

## Production build
```bash
npm run build
npm run preview
```

## Included Screens & Modals
- **My Shift** — personalized shift overview, metrics, shift story, next-best-action card, live-feeling queue, and follow-up list.
- **Call Cockpit** — simulated call controls, customer context, interaction notes, history, resolution guide, and follow-up transition.
- **Customers** — searchable and filterable customer and case directory.
- **Follow-ups** — add and complete shift follow-up tasks.
- **Team Pulse** — sample team workload and capacity overview.
- **Accounts & Northstar Support Modal** — accessible from the workspace switch, profile row, avatar, and help button:
  - **Operator Login & Credentials**: view account holder details, Employee ID (`EMP-8842`), username (`dinesh.kumar@northstar.internal`), masked password toggle (`demo_pass2026`), active shift status, and copy-to-clipboard functionality.
  - **Northstar Customer Support**: toll-free escalation line, support desk email (`support@northstar.internal`), shift leads, 24/7 SLA metrics, and direct link to workspace customization.
- **Workspace Preferences** — customize visual direction (Midnight Lime, Editorial Warmth, Signal Blue) and layout modes (Classic sidebar, Command centre, Keyboard-first).

## AI Tools Used in this Project
This project was developed, enhanced, and verified using the following AI toolstack:

1. **Antigravity AI Agent (DeepMind Advanced Agentic Coding)**
   - Autonomous code inspection, syntax analysis, and TypeScript refactoring.
   - Context-aware state management and component synthesis for React + TypeScript.
2. **Antigravity Browser Subagent & Automation**
   - End-to-end autonomous browser interaction testing.
   - Real-time DOM element navigation, password toggle testing, and screenshot recording.
3. **Automated Source Editing Tools (`replace_file_content` & `multi_replace_file_content`)**
   - Precision chunk-based AST/code editing without destructive rewrites, keeping code integrity intact.
4. **Agentic System & Shell Runner (`run_command` & `manage_task`)**
   - Asynchronous build verification (`tsc -b && vite build`) and persistent dev server execution management.
5. **Codebase Intelligence & Static Analysis (`grep_search`, `view_file`, `list_dir`)**
   - High-performance ripgrep search for state tracing, prop resolution, and error elimination.

## Notes
- All records and team metrics are sample/demo data.
- Call controls simulate state changes; they do not connect to a telephony provider.
- Theme, layout, customer status, notes, and tasks are persisted in browser `localStorage`.
