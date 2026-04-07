# Prism Design System — Starter Kit

**Version:** 1.0 by imagine.io
**Figma:** https://www.figma.com/design/kiwttYrNajH3hQwrtGtrle/Prism-Design-System?node-id=1-3

---

## What's in this folder

```
prism-setup/
├── CLAUDE.md                 — Activates the Prism Design System for this project
├── prism-design-system.md    — Full design system tokens, rules, and typography
├── fonts/                    — PP Neue Montreal font files (6 weights, .otf)
├── logos/                    — imagine.io logo SVGs (5 variants)
└── README.md                 — This file
```

---

## Step 1 — First time on a new machine (do this once)

Open this folder in Claude Code and run this prompt:

```
I've unzipped the Prism Design System starter kit. Please set up my machine:

1. Copy prism-design-system.md from this folder to ~/.claude/prism-design-system.md
2. Check if ~/.claude/CLAUDE.md exists:
   - If it does NOT exist: create it with this exact content:
     @~/.claude/prism-design-system.md

     # Scope
     The Prism Design System is exclusively for imagine.io projects.
     Only apply it when the project's CLAUDE.md identifies it as an imagine.io project.
     For all other projects, ignore all Prism rules entirely.
   - If it already exists: add @~/.claude/prism-design-system.md as the first line
     (only if not already there), and add the Scope section above below it
3. Copy all .otf files from the fonts/ folder to ~/Library/Fonts/
4. Create ~/.claude/logos/ and copy all files from the logos/ folder there
5. Confirm everything is set up correctly
```

That's it. Your machine is now fully configured.

---

## Step 2 — Starting a new imagine.io project

1. **Duplicate this folder** and rename it to your project name
2. **Open the new folder** in Claude Code
3. **Start building** — the design system is already active

The `CLAUDE.md` in the folder tells Claude this is an imagine.io project. All Prism tokens, PP Neue Montreal font, and logos are automatically applied.

---

## Keeping in sync with Figma

When the design system updates in Figma, run this prompt from any project in Claude Code:

```
Re-sync ~/.claude/prism-design-system.md with the latest Prism Design System from this Figma file: https://www.figma.com/design/kiwttYrNajH3hQwrtGtrle/Prism-Design-System?node-id=1-3
```

Claude updates the tokens automatically. Share the updated `prism-design-system.md` with the team so everyone stays in sync.

---

## Font weights reference

| File | Weight |
|------|--------|
| PPNeueMontreal-Light.otf | 300 |
| PPNeueMontreal-Regular.otf | 400 |
| PPNeueMontreal-Book.otf | 450 |
| PPNeueMontreal-Medium.otf | 500 |
| PPNeueMontreal-SemiBold.otf | 600 |
| PPNeueMontreal-Bold.otf | 700 |

## Logo variants reference

| File | Use |
|------|-----|
| Horizontal.svg | Horizontal lockup, dark backgrounds |
| Horizontal Light.svg | Horizontal lockup, light backgrounds |
| Vertical.svg | Vertical lockup, dark backgrounds |
| Vertical Light.svg | Vertical lockup, light backgrounds |
| Mark.svg | Logo mark only |
