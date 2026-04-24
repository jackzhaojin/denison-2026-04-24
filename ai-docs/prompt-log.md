# Denison CS Demo - Prompt Log

**Date**: 2026-04-23
**Agent**: claude-code
**Status**: In Progress
**Deliverable**: University demo site (CS 271 algorithms visualization) targeting jackzhaojin.github.io

---

## Session 1: Demo Buildout (Apr 23, 2026)

### Prompt 1: Repo Setup and CS 271 Research (9:55 PM)

> Hello! Create a new gh repo with this root folder name and make it public, have the standard nodejs / vite gitignore with mac stuff, i like local-only gitignored as well.
>
> Also, can you do a bit of research on a course like CS 271 data structures? I think about 10 to 20 common courses that we need that's typically offered or you know coursework you need to do. First let's spin up some parallel agents and then just kind of parallel tasks even to maybe research you know these things in different subcategories of data structure.
>
> Output results to '/Users/jackjin/dev/denison-2026-04-24/ai-docs/cs-271-topic-breakdown.md'

→ Response: Created public GH repo with Node/Vite + macOS gitignore (including local-only), and ran parallel research agents to produce CS 271 topic breakdown.
→ Action: Created `ai-docs/cs-271-topic-breakdown.md`, `.gitignore`, initial repo scaffolding. ✅

---

### Prompt 2: One-Shot Demo Build with Shadcn + Denison Style (10:07 PM)

> OK - Now that we have the potential topics breakdown, let's try into one-shot something that's fairly complex. make sure we really break down the tasks.
>
> So I'm going to university to do a demo. Ideally I want to be show the students that it's possible to do an entire semester of coursework in one single prompt and have it be presented back to the students in an illustrative way. So each one of these solutions should be tackled and solved and also be graphically displayed in some ways on how the algorithm actually works. So not the only algorithm actually working, but you know visually make it realistic. And this is why we're using Vite to do this.
>
> Ideally since this is a show-off thing, let's you know make it look pretty, maybe let's use /shadcn skill '/Users/jackjin/dev/denison-2026-04-24/.agents/skills/shadcn' and build something that's worth demoing.
>
> Also, even going even more meta, Let's kind of have a UI on how this is built, right? First we set up the the course outline and gitignore, second we figure out some skills like shadcn we want to use. Third way we literally one shot the whole thing, including how it's built in a graphical way. Our prompts should be featured and results shown
>
> Also graphics and style system should follow the big red '/Users/jackjin/dev/denison-2026-04-24/ai-docs/denison-deck-design-system.md', focus on red, and white and gold yellow texts.
>
> Feel free to use agent teams or subagents for this task

→ Response: One-shot built Vite/React app with shadcn components, algorithm visualizations for CS 271 topics, meta "How it's built" narrative, all styled per Denison red/white/gold design system.
→ Action: Created `web/` app, component library, visualizations, meta-section; used parallel subagents. ✅

---

### Prompt 3: File Cleanup + CLAUDE.md + Commit Prompts 2 and 3 (10:32 PM)

> Before we commit - let's analyze all the files outstanding - ideally move all the png files into '/Users/jackjin/dev/denison-2026-04-24/.playwright-mcp'.
>
> load up /init also and generate one CLAUDE.md for this, note that playwright mcp and playwright cli should go into their own folders.
>
> Add .playwright* folders to gignore. After that, let's do one commit for all outstanding files for prompts 2 and 3

→ Response: Relocated PNGs into `.playwright-mcp/`, generated project `CLAUDE.md` via /init, updated gitignore with `.playwright*` folders.
→ Action: Moved PNGs, created `CLAUDE.md`, updated `.gitignore`, committed outstanding changes. ✅

---

### Prompt 4: GH Pages Deploy + Meta Section Expansion + Log This Session (10:37 PM)

> For prompt 4 - let's work on getting this deployed to jackzhaojin.github.io - we have a few subsites running there already and let's have a github action. triage until it's all done.
>
> Since we're trying to keep our AI conversation to a minimum to show AI capabilities, let's also in the same thing parallel task updating "How it was built". I was hoping this section would be more grand with more animations (maybe aech prompt should be it's dedicated capability)
>
> Since I want to limit our working session to 4 prompts, also, /conversation-logger this to '/Users/jackjin/dev/denison-2026-04-24/ai-docs'

→ Response: Wiring up GH Pages deploy via GitHub Actions as subsite of jackzhaojin.github.io, expanding "How it was built" with per-prompt animated sections, and logging this conversation.
→ Action: Adding GH Actions workflow, enhancing meta section with per-prompt animations, created `ai-docs/prompt-log.md`. ✅
