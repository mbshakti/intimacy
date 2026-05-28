# Master List of Community-Written Guides Across AI Chatbot Platforms

This report compiles the most notable community-authored guides discovered across the major AI chatbot ecosystems — Character.AI, Pygmalion, KoboldAI/KoboldCpp, SillyTavern, Janitor AI, Chub.ai/Venus, NovelAI, TavernAI, Oobabooga, and adjacent communities (4chan /aicg/, /lmg/, /aids/, Reddit, GitHub, HuggingFace). It is organized first by the **measured popularity / cross-citation rank** (Tier S → Tier C, based on how often each guide is referenced in other community guides, OPs, wikis, and aggregator pages), then secondarily grouped by category of guide.

A few methodological notes before the list:

- "Popularity" in this niche cannot be reduced to a single metric. Reddit upvotes, GitHub stars, Discord pins, and 4chan /aicg/ OP inclusion all matter, but the most reliable signal is **how many other guides cite a given guide**. I weighted that heavily.
- Cross-references were counted across the canonical aggregator pages — `rentry.org/aicgOP`, `rentry.org/aicg_op_overflow`, `rentry.org/Aicg4Retards`, `rentry.org/wAIfu_AI_Guides`, `rentry.org/lmg_template`, `rentry.org/lmg-resources`, `rentry.org/pygmalionlinks`, `rentry.org/meta_botmaking_list`, `wikia.schneedc.com`, the official SillyTavern docs, the Pygmalion Wiki, the KoboldCpp wiki, JanitorAI's help center, and the Chub.ai docs.
- Many of the most influential guides live on rentry.co/rentry.org (a markdown pastebin); upvote counts are not exposed there, so popularity is inferred from view counts (where shown) and citation density.
- Some "popularity" indicators are approximate or self-reported (e.g., view counts, GitHub stars at time of access). Treat single numbers as snapshots, not authoritative.

---

## Tier S — Foundational, Almost Universally Cited

These six guides are referenced by virtually every other character-creation guide in the ecosystem. They form the de-facto canon for how to write AI roleplay characters.

### 1. Trappu's Character Writing Guide ("PLists + Ali:Chat")
- **URL:** https://wikia.schneedc.com/bot-creation/trappu/creation (intro: `/trappu/introduction`, post-creation tips: `/trappu/post-creation`)
- **Platform:** PygmalionAI Wiki (cross-used by SillyTavern, Chub, JanitorAI communities)
- **Author:** Trappu (with AliCat, AVAKSon, Tav)
- **Type:** Character/persona creation, prompt formatting
- **Popularity signal:** Cited as "the" recommended guide in the **official SillyTavern docs** (Character Design page), in the Pygmalion Links rentry, in `rentry.co/creating-a-bot`, in HuggingFace SillyTavern beginners' summaries, in dozens of Chub creator pages, and in /aicg/ OP templates. Probably the single most-linked character-writing guide in the entire ecosystem.
- **Description:** Multi-chapter, in-depth walkthrough of building characters using PLists (Python-list trait blocks) combined with Ali:Chat (interview-style example dialogue). Considered the modern canonical character-card structure.

### 2. AliCat's "Ali:Chat Style (v1.5)"
- **URL:** https://rentry.co/alichat
- **Platform:** Rentry / PygmalionAI / SillyTavern community
- **Author:** AliCat
- **Type:** Character formatting / dialogue style
- **Popularity signal:** Original source of the "Ali:Chat" format that Trappu, kingbri, Bronya, and most modern card formats build on. Linked from official SillyTavern docs, Chub docs, and effectively every "how to make a bot" rentry.
- **Description:** Establishes the principle that example dialogue itself is the best vector for traits — interview-style or dialogue-exchange formatting is used to bake personality, appearance, speech, and lore into a character.

### 3. kingbri's "MinimALIstic (Ali:Chat Lite)"
- **URL:** https://rentry.co/kingbri-chara-guide
- **Platform:** Rentry / SillyTavern / Pygmalion community
- **Author:** kingbri
- **Type:** Character creation, token optimization
- **Popularity signal:** Co-listed with Trappu and AliCat in the official SillyTavern documentation; linked from the Pygmalion Wiki, World Info Encyclopedia, and most major hub pages.
- **Description:** Token-efficient variant of Ali:Chat that pushes PLists into the Author's Note, demonstrating how to compress a character from ~1300 tokens to ~600 while keeping persistence.

### 4. Kuma's "W++ For Dummies"
- **URL:** https://rentry.co/WPP_For_Dummies
- **Platform:** Rentry / Pygmalion / TavernAI
- **Author:** Kuma
- **Type:** Character creation in W++ format
- **Popularity signal:** Listed alongside Ali:Chat / PList / kingbri in nearly every "create a character" rentry; cited in `cringeguide`, `create-a-character-for-fucking-idiots`, `koboldcpp` issues, /aicg/ OP. The single most-recommended W++ tutorial.
- **Description:** Step-by-step guide to writing characters using the W++ template (parent-child trait categories like `Mind`, `Personality`, `Loves`, `Description`), with explanations of Scenario, Example Dialogue, and First Message sections.

### 5. Junko's "How to Make a Character (For F***ing Idiots)"
- **URL:** https://rentry.org/create-a-character-for-fucking-idiots
- **Platform:** Rentry / Character.AI + Pygmalion + Tavern
- **Author:** Junko
- **Type:** Beginner character creation, including NSFW behavior tuning
- **Popularity signal:** ~43,725 views as of recent snapshot — among the highest view counts of any rentry guide; linked from `cringeguide`, `creating-a-bot`, `wAIfu_AI_Guides`, and many more.
- **Description:** Frank, beginner-friendly walk-through of every character-card field with practical tips (e.g., why "horny" or "straight/gay" tags don't behave as expected, how `Features()` shapes appearance, why you should keep Scenario vague).

### 6. Chai's "Pygmalion Character Creation & Writing Tips"
- **URL:** https://rentry.co/chai-pygmalion-tips (also `rentry.org/pygtips`)
- **Platform:** Rentry / Pygmalion / TavernAI
- **Author:** Chai (they/them)
- **Type:** Writing & dialogue tips, formatting, NSFW
- **Popularity signal:** Linked from the Pygmalion Wiki, /aicg/ OP, Noxx's guide, and many bot-maker rentries; one of the most-cited "tips" guides for Tavern-era characters.
- **Description:** Encyclopedic collection of empirical tips: tokenizer aiming, "name bias" trick, the truth about adding "horny," how to escape adverbs, how short-term vs. long-term memory works, scenario writing, and context-recovery tactics.

---

## Tier A — Highly Cited, Format-Defining Guides

### 7. AVAKSon's "How to Write in PList + Ali:Chat"
- **URL:** https://rentry.org/plists_alichat_avakson
- **Platform:** Rentry / Pygmalion / SillyTavern
- **Author:** AVAKSon
- **Type:** Hybrid character format, NSFW worked examples
- **Popularity signal:** Trappu's guide explicitly builds on AVAKSon's work; cited in HuggingFace ST summary, kingbri's guide, and many botmaking rentries.
- **Description:** Walkthrough of creating SFW and NSFW Ali:Chat+PList characters using Scathach and Nyanners as worked examples; canonical for understanding how PList trait reinforcement actually works at the example-dialogue level.

### 8. World Info Encyclopedia (kingbri / Alicat / Trappu)
- **URL:** https://rentry.co/world-info-encyclopedia
- **Platform:** Rentry / SillyTavern
- **Authors:** kingbri, AliCat, Trappu
- **Type:** Lorebook / World Info / memory
- **Popularity signal:** Referenced directly in the official SillyTavern World Info docs as the "Exhaustive in-depth guide"; cited from HuggingFace, the Pygmalion Wiki, and dozens of bot rentries.
- **Description:** Definitive reference on key/value pairs, embedded lorebooks, lorebook stacking, character-bound vs. global lorebooks, depth/scan settings, and using lorebooks as character storage instead of cramming everything into the description.

### 9. Pume's Lorebook Guide
- **URL:** https://rentry.org/lorebook-guide
- **Platform:** Rentry / NovelAI / SillyTavern
- **Author:** Pume
- **Type:** Lorebook prose-writing guide
- **Popularity signal:** Linked from Blip's NovelAI Guide, AliCat's guide ("same prose rules apply"), and `aicg_extra_information`.
- **Description:** Focuses on the *prose style* of lorebook entries — how the AI parses them, how to write them so they integrate naturally rather than as awkward inserted blocks.

### 10. Pume's Memory Guide
- **URL:** https://rentry.org/memory-guide
- **Platform:** Rentry / NovelAI
- **Author:** Pume
- **Type:** Memory / context-window management for NovelAI
- **Popularity signal:** Companion to the Lorebook Guide; linked from Blip's Beginner Guide and the NAI subreddit/Discord.
- **Description:** How to write effective Memory entries (placement at top of context, ATTG, prose density), and how Memory interacts with author's note and lorebook entries.

### 11. Blip's Beginner Guide to NovelAI
- **URL:** https://rentry.co/NovelAI-Quick-Start
- **Platform:** Rentry / NovelAI
- **Author:** Blip
- **Type:** End-to-end NovelAI text-gen guide (Quick Start, Preset, Memory, ATTG, Author's Note, Lorebook)
- **Popularity signal:** Treated as the de-facto onboarding doc on r/NovelAI and the NovelAI Discord; references Pume's guides as further reading.
- **Description:** Concise, illustrated walkthrough covering presets, Memory, ATTG (Author/Title/Tags/Genre), Author's Note pitfalls, and a recommended Lorebook format.

### 12. Pixi's Universal Claude Prompt ("pixijb")
- **URL:** https://pixibots.neocities.org/prompts/pixijb (hub at https://pixibots.neocities.org/)
- **Platform:** Neocities / SillyTavern + Claude
- **Author:** Pixi
- **Type:** Jailbreak / system prompt for Anthropic Claude
- **Popularity signal:** Recommended by Sukino, Smiley, Salenai, and SillyTavern community guides; explicitly inspired Sukino's Game Master prompt; its versioning notes (v18+) are routinely discussed in /aicg/ threads.
- **Description:** Maintained, versioned universal Claude prompt designed to maximize card compatibility and intelligence. Detailed changelog covers content-warning bypasses, prefill design, XML tagging, chain-of-thought toggle, and writing-style controls.

### 13. CharacterProvider (XMLK)
- **URL:** https://rentry.co/CharacterProvider (latest versions e.g. `CharacterProvider-V10-1-FAWORKI`); explanation: https://rentry.co/CharacterProvider-Explanation
- **Platform:** Rentry / SillyTavern + Claude/GPT
- **Author:** XMLK / "victorianmaids"
- **Type:** Multi-version system prompt + jailbreak preset
- **Popularity signal:** One of the most-cited Claude prompts in Sukino's references, the SillyTavern feature requests, and JanitorAI/Chub creator notes; the rentry was even targeted by impersonators (XMLK had to recover the page), indicating its prominence.
- **Description:** Versioned XML-tagged prompt suite for Claude and GPT in SillyTavern, including pozzed-key fixes, Author's Note presets, allowed-content blocks, and per-version explanation pages.

### 14. Smiley's Presets ("SmileyJB" / "Sal's Choice")
- **URL:** https://rentry.org/SmileyJB
- **Platform:** Rentry / SillyTavern
- **Author:** Smiley
- **Type:** Importable JSON presets + Regex extension setup for SFW/NSFW Claude RP
- **Popularity signal:** Listed as a top recommended preset on Salenai's setup guide and many community hub pages.
- **Description:** Drop-in JSON preset that uses the Regex extension to dynamically transform prompts in flight; documentation walks the user through Regex import, "Global" scope, and required toggle states.

### 15. Sukino's SillyTavern Settings & Presets (with Sukino-Guides / Sukino-Findings)
- **URL:** https://huggingface.co/Sukino/SillyTavern-Settings-and-Presets and https://rentry.org/Sukino-Settings (guides at https://rentry.org/Sukino-Guides , findings at https://rentry.org/Sukino-Findings)
- **Platform:** HuggingFace + Rentry / SillyTavern + KoboldCPP
- **Author:** Sukino
- **Type:** Banned-tokens lists, Game Master system prompt, jailbreaks (Gemma 2), guides
- **Popularity signal:** Highlighted in PromptLayer model index, recommended in Salenai's onboarding guide and many small-model-RP tutorials; ~149 commits over a year.
- **Description:** The most popular curated kit for *local-model* RP — the Anti-Slop banned-phrase list, the Game-Master simulation prompt, Gemma 2 jailbreak, recommended models (Mistral Small, Cydonia, Magnum, MN-12B Mag Mell, Wayfarer), and accompanying explanations.

### 16. Sphiratrioth's SillyTavern Presets
- **URL:** https://huggingface.co/sphiratrioth666/SillyTavern-Presets-Sphiratrioth (companion: `sphiratrioth666/Lorebooks_as_ACTIVE_scenario_and_character_guidance_tool`)
- **Platform:** HuggingFace / SillyTavern
- **Author:** Sphiratrioth
- **Type:** Universal RP presets, regex set, lorebook-as-procedural-DM
- **Popularity signal:** Frequently surfaced on HuggingFace and in r/SillyTavernAI discussions; companion lorebook procedural-guidance write-up has been widely shared.
- **Description:** Mistral / Mistral V7 / ChatML / Llama 3 / Alpaca / Metharme/Pygmalion templates plus a "procedural guided generation" technique that uses lorebook entries to roll positive/negative outcomes for actions like a tabletop GM.

---

## Tier B — Heavily Used Within Single Communities or Sub-Domains

### 17. AVAKSon's & Tav's Bronya/Pygmalion Walkthrough
- **URL:** https://ganstakingofsa.github.io/reimagined-couscous/alicat-bronya (hub: https://bronya-rand.github.io/reimagined-couscous/)
- **Platform:** GitHub Pages / Pygmalion / SillyTavern
- **Author:** Bronya Rand (with AVAKSon)
- **Type:** Beginner character creation + lorebook examples
- **Description:** Long-form, screenshot-driven walkthrough that has become the recommended "first guide" pinned by parts of the Pygmalion Discord; also hosts an extensive Genshin/HSR lorebook archive.

### 18. Pygmalion Guide & FAQ
- **URL:** https://rentry.co/pygmalion-ai (canonical Pygmalion link list at https://rentry.org/pygmalionlinks)
- **Platform:** Rentry / Pygmalion
- **Type:** Onboarding/FAQ/install
- **Description:** Top-level explanation of the Pygmalion project, Agnaistic, Horde, local install requirements, model lineage (Pygmalion 6B → 13B → Pygmalion-2 → Mythalion), and Colab notes.

### 19. "Pygmalion Guide" (Alpin-style local install)
- **URL:** https://rentry.co/pygmalion-guide and Linux/Windows version: https://rentry.org/pygmalion-local
- **Platform:** Rentry / Pygmalion
- **Author:** Alpin (and contributors)
- **Type:** Local install (NVIDIA / AMD / Linux / Windows / Colab)
- **Description:** End-to-end install guide — VRAM requirements, ROCm/CUDA setup, KoboldAI/Oobabooga choice, Tavern integration. The "spiritual successor" to the original Pyggymancy intro.

### 20. PygTips (Pygmalion Tips for new users)
- **URL:** https://rentry.org/pygtips
- **Platform:** Rentry / Pygmalion
- **Author:** Crow
- **Type:** Settings, generation parameters, W++ tips
- **Description:** Practical generation-parameter reference (max_new_tokens, temperature, repetition penalty), W++ usage notes, and explanations of why particular settings break the model. Cited in /aicg/ OP overflow.

### 21. Pyggymancy
- **URL:** https://rentry.org/Pyggymancy
- **Platform:** Rentry / Pygmalion
- **Type:** All-in-one onboarding/links list
- **Description:** Older but still-referenced umbrella page that links the original Pygmalion guide, CAI dump tools, character creator, and Tavern resources.

### 22. Anon's Guide to LLaMA Roleplay ("better-llama-roleplay")
- **URL:** https://rentry.co/better-llama-roleplay
- **Platform:** Rentry / Oobabooga + SillyTavern
- **Type:** Local LLaMA model setup for RP, Simple Proxy
- **Description:** How to run Airoboros + SuperHOT + 8k context, configure Oobabooga's flags, and route through the Simple Proxy for instruct formatting; deprecated note in favor of newer methods, but heavily cited in /lmg/ history.

### 23. Ayumi's ERP Rating Archive (and Archive 2)
- **URL:** https://rentry.co/ayumi_erp_rating_archive ; v2: https://rentry.co/ayumi_erp_rating_archive2
- **Platform:** Rentry / /lmg/
- **Author:** Anon (with `ALC-IQ` benchmarking framework)
- **Type:** Model ranking / benchmark
- **Description:** Standardized scoring of dozens of LLaMA-family GGML/GGUF models on coherence, "ERP score," and word-IQ for roleplay. The most-cited reference benchmark for local roleplay models.

### 24. Another LLM Roleplay Rankings (ALLMRR)
- **URL:** https://rentry.co/ALLMRR
- **Platform:** Rentry / /lmg/
- **Authors:** AliCat & Trappu
- **Type:** Subjective model ranking
- **Description:** Curated, non-automated model rankings from the /aicg/ side; treated as a softer, more taste-driven counterweight to Ayumi's automated benchmark.

### 25. /aicg/ Master OP (aicgOP)
- **URL:** https://rentry.org/aicgOP (overflow: https://rentry.org/aicg_op_overflow)
- **Platform:** Rentry / 4chan /aicg/
- **Type:** Living link aggregator
- **Description:** Maintained OP template that everyone in /aicg/ rebakes — links to bots (chub, booru.plus), JBs, frontends (SillyTavern, Agnai, RisuAI, Miku), botmaking, and meta lists.

### 26. "Aicg4Retards"
- **URL:** https://rentry.org/Aicg4Retards
- **Platform:** Rentry / /aicg/
- **Type:** SillyTavern feature explanation, prompt walkthrough, JBs
- **Description:** The most-cited "explain every option in SillyTavern" rentry. `oaicards` and many other guides explicitly defer to it for prompt-settings explanations.

### 27. OAI Cards / OAI Models & Character Creation
- **URL:** https://rentry.co/oaicards
- **Platform:** Rentry / SillyTavern + OpenAI/Claude
- **Type:** Card design for chat-completion APIs
- **Description:** Concept-heavy explainer of how chat-completion frontends compose prompts, with prompt-design tips (implication, OOC instructions, ban-words) and example main/NSFW/UJB prompts.

### 28. Moth's Personal Findings & Tips on Tavern Bot Building
- **URL:** https://rentry.co/MothsBotMakingStuff (draft mirror: `mothsbotmakingstufftemp`)
- **Platform:** Rentry / SillyTavern
- **Author:** Moth
- **Type:** Advanced Tavern card writing
- **Description:** "Advanced" tier-tagged guide in the wAIfu_AI_Guides hub; covers per-model prompt biases, optimizing token counts, V2 cards, and stress-testing bots.

### 29. Noxx's Guide on Making (NSFW) Bots ("cringeguide")
- **URL:** https://rentry.co/cringeguide
- **Platform:** Rentry / Pygmalion / Tavern
- **Author:** Noxx
- **Type:** NSFW bot-making, dialogue examples
- **Description:** Focus on example-dialogue craft for getting consistent NSFW behavior; lists W++, Drappier's, Junko's, Chai's guides as prerequisite reading.

### 30. Glub's Basic Character Making/Editing Guide
- **URL:** https://rentry.co/glubs-character-guide
- **Platform:** Rentry / SillyTavern / JanitorAI
- **Author:** Glub
- **Type:** Mixed format primer (PList + Card-as-Prompt + Ali:Chat)
- **Description:** Approachable primer that walks through PList ("the vacuum-sealed plushie"), Ali:Chat formats (interviewer-style, exchange-style), Card-as-Prompt narrative style, and Permanent vs. Temporary tokens.

### 31. Wizard's Ultimate Detailed Character Template
- **URL:** https://rentry.co/the-ultimate-character-template
- **Platform:** Rentry / Pygmalion / Tavern / Chub
- **Author:** Wizard
- **Type:** Full template (with Roleplay/location subsection)
- **Description:** Template with `[Character()]`, `[Roleplay()]`, sexuality, sexual characteristics, and grammar-strictness notes — frequently re-used as a starting point for Chub characters.

### 32. CharacterProvider Botmaking Guide
- **URL:** https://rentry.co/CharacterProvider-GuideToBotmaking
- **Platform:** Rentry / SillyTavern / Chub
- **Author:** XMLK
- **Type:** Botmaking + JED format
- **Description:** Companion guide to the CharacterProvider preset, recommended by many Chub/JanitorAI creators alongside Pixi's botmaking guide; promotes the JED-style structured card.

### 33. Pixi's Botmaking Guide (pixiguide)
- **URL:** https://rentry.org/pixiguide (and `NG_CharCard`)
- **Platform:** Rentry / SillyTavern / Chub
- **Author:** Pixi
- **Type:** Botmaking, card structure
- **Description:** Concise, opinionated card-writing approach that pairs naturally with the pixijb prompt; often recommended together with CharacterProvider and kingbri.

### 34. "Advanced Card Writing Tricks"
- **URL:** https://rentry.org/advancedcardwritingtricks
- **Platform:** Rentry / SillyTavern / Chub
- **Type:** Advanced techniques (tracking, conditional injects)
- **Description:** Linked widely as the "next step" beyond basic Ali:Chat/PList — explains stat-trackers, XML role tags, and depth-based author's-note injects.

### 35. NAI Chatbotting Guide
- **URL:** https://rentry.co/NAIChatbot
- **Platform:** Rentry / NovelAI
- **Type:** Using NovelAI on its native site as a chatbot
- **Description:** Step-by-step on configuring NovelAI's web client for chat-style RP with a card, ATTG usage, dinkus separators, phrase bias, and stop tokens.

### 36. SillyNAIGuide ("Basic NAI Settings and Guide")
- **URL:** https://rentry.co/SillyNAIGuide
- **Platform:** Rentry / SillyTavern + NovelAI
- **Type:** SillyTavern + NAI Opus integration
- **Description:** Focused guide on connecting SillyTavern 1.9.7+ to NovelAI Opus (Erato/Kayra), getting an API key, and configuring presets/lorebooks for chat use.

### 37. AnotherSillyGuide for NovelAI
- **URL:** https://rentry.co/AnotherSillyGuide
- **Platform:** Rentry / SillyTavern + NovelAI
- **Type:** Cost/pricing/setup walkthrough, summarization tips
- **Description:** Pairs with SillyNAIGuide; covers the staging branch, NAI pricing tiers, summarization extension config for NAI, and stop-sequence tuning.

### 38. NovelAI with Instruct (Kayra)
- **URL:** https://rentry.co/sillytavern-novelai-instruct
- **Platform:** Rentry / NovelAI + SillyTavern
- **Type:** Instruct module for Kayra
- **Description:** How to enable NAI's Instruct module in SillyTavern, structure `{ }` braces as instructions, set Author's Note depth, and reinforce styling.

### 39. ESL-Anon Guide to Solo RPG with NovelAI
- **URL:** https://rentry.co/SoloAI (V2: `SoloAI2`)
- **Platform:** Rentry / NovelAI
- **Type:** Solo TTRPG / scenario building
- **Description:** Combines NovelAI with Pocket Notes, Mythic GM Emulator, and Fate Core for solo TTRPGs; defines workflows for events, oracle rolls, and smut interludes.

### 40. /aids/ Lorebook Repository
- **URL:** https://rentry.co/lorebooks (mirror: https://aidsrentfree.github.io/lorebooks/)
- **Platform:** Rentry / NovelAI / /aids/
- **Type:** Community lorebook archive + creation tips
- **Description:** Curated archive of dozens of fandom lorebooks (Touhou, Megaten, Berserk, TF2, Walking Dead S1, Beast Wars, monstergirl wikis, D&D Forgotten Realms) plus authoring notes from each contributor.

### 41. Megami Tensei Lorebook for NovelAI
- **URL:** https://rentry.co/megatenLorebook
- **Platform:** Rentry / NovelAI
- **Type:** Lorebook (570+ entries)
- **Description:** Reference example of a serious, large lorebook (covers Nocturne, Strange Journey, SMT IV/IV Apocalypse demons + general MegaTen lore).

### 42. AIDS Wiki — Lorebooks (Miraheze)
- **URL:** https://aids.miraheze.org/wiki/Lorebooks
- **Platform:** Miraheze wiki / NovelAI
- **Type:** Reference / configuration deep-dive
- **Description:** Most thorough technical reference for NAI lorebook fields — cascading, search range, key relativity, force-activate, prefix/suffix, budget, and "type" patterns.

### 43. KoboldCpp Wiki
- **URL:** https://github.com/LostRuins/koboldcpp/wiki (FAQ: `/The-KoboldCpp-FAQ-and-Knowledgebase`)
- **Platform:** GitHub / KoboldCpp
- **Author:** LostRuins + contributors
- **Type:** Setup, model selection, memory, image gen, TTS, networking
- **Popularity signal:** The official, project-owned guide; baked into the README and recommended by every "how to run a local model" rentry.
- **Description:** Beginner-friendly GUI launcher walkthrough, model recommendations (Gemma 3, Stheno, Tiefighter), Memory/Author's Note guidance, Cloudflared remote-link setup, and Anti-Slop banned-tokens feature documentation.

### 44. KoboldAI Setup Guide ("itsnotthathard")
- **URL:** https://rentry.co/itsnotthathard
- **Platform:** Rentry / KoboldAI
- **Type:** Local KoboldAI install
- **Description:** Older but historically influential install guide for KoboldAI-Client (`play.bat`, model picking, half-precision tradeoffs, Colab encryption notes).

### 45. Oobabooga text-generation-webui Wiki
- **URL:** https://github.com/oobabooga/text-generation-webui/wiki
- **Platform:** GitHub
- **Type:** Setup, API, multimodal, image gen, tool calling, training
- **Popularity signal:** Project's official wiki on a 46.8k-star repo; routinely linked from KoboldCpp, SillyTavern, Pygmalion, and /lmg/ guides.
- **Description:** Updated home for Oobabooga's UI/API tutorials (multimodal, image generation, tool-calling), training guidance, and integration patterns.

### 46. SillyTavern Documentation
- **URL:** https://docs.sillytavern.app/ (especially `/usage/core-concepts/characterdesign/`, `/usage/core-concepts/worldinfo/`, `/usage/st-script/`)
- **Platform:** Official docs / SillyTavern
- **Type:** Project-official reference
- **Description:** Authoritative explanation of character cards, World Info/lorebooks, STscript (slash-command scripting language), Quick Replies, and prompt building. Frequently anchors community guides.

### 47. SillyTavern Community Guides Index
- **URL:** https://sillytavern.dev/guides/
- **Platform:** Official SillyTavern site
- **Type:** Community-authored guides aggregator
- **Description:** Project-curated index of community-written guides for SillyTavern features, presets, and extensions.

### 48. "A Guide to Hosting Your Own SillyTavern Instance"
- **URL:** https://rentry.co/guide-to-host-an-st-instance
- **Platform:** Rentry / SillyTavern
- **Type:** Self-host / VPS guide
- **Description:** Walkthrough for deploying SillyTavern on Linode/Vultr/Hetzner using Easypanel, with subdomains, File Browser, security hardening, and backup directories.

### 49. STAI-Termux ("Installing SillyTavern on Android via Termux")
- **URL:** https://rentry.org/STAI-Termux
- **Platform:** Rentry / SillyTavern + Android
- **Type:** Mobile install
- **Description:** Cross-referenced from /aicg/ OP and Aicg4Retards; the canonical Termux install procedure. Pair with `dotsgd` for update commands (`git stash && git pull`, `git checkout dev`).

### 50. SillyTavern STscript / Quick Replies (Guided Generations)
- **URL:** https://github.com/Samueras/Guided-Generations (companion library: https://github.com/LenAnderson/SillyTavern-LALib ; STscript ref: https://docs.sillytavern.app/usage/st-script/)
- **Platform:** GitHub
- **Author:** Samueras (LALib by LenAnderson)
- **Type:** Quick Reply set / scripting / scenario rules
- **Description:** Importable Quick Reply set that adds buttons for outline-to-prose generation, scenario rule management, send-without-reply, intro-rewrite menus, and POV switching; the LALib companion adds a deep library of slash commands (regex, lists, swipes, message ops).

### 51. SillyTavern MemoryBooks
- **URL:** https://github.com/aikohanasaki/SillyTavern-MemoryBooks
- **Platform:** GitHub / SillyTavern
- **Author:** aikohanasaki
- **Type:** Extension + guide for AI-summarized lorebook memories
- **Description:** Pairs with `SillyTavern-LorebookOrdering` (STLO) to mark scene boundaries, generate JSON memories, and consolidate multi-tier summaries — the most-shipped community memory system for ST.

### 52. Chub AI Documentation (Character Creation, Lorebooks, Stages)
- **URL:** https://docs.chub.ai/docs (e.g. `/the-basics/character-creation`, `/venus-documentation/character-creation`, `/stages/quickstart-setup`)
- **Platform:** Official Chub docs
- **Type:** Project-official onboarding + advanced "Stages" SDK
- **Description:** Walks through Chub's character creator (Name/Tags/Type/Rating, alternate greetings with `<START>`, Character Notes, Character Books); Stages section documents extending chats with custom components.

### 53. JanitorAI Help Center — "Absolute Beginner's Guide to Using a Proxy" (Parts 1 & 2)
- **URL:** https://help.janitorai.com/en/article/the-absolute-beginners-guide-to-using-a-proxy-with-janitor-part-one-19to7y9 and `...part-two-jciqmu`
- **Platform:** JanitorAI Help Center
- **Type:** API/proxy onboarding for JanitorAI
- **Description:** Two-part newcomer flow for connecting JanitorAI to OpenRouter, DeepSeek, Chutes, and Anthropic via proxy; covers free vs. paid tiers, model swapping, configuration profiles, and refresh-after-save.

### 54. Tydorius's JanitorAI Lorebook Scripts
- **URL:** https://github.com/Tydorius/JanitorAI_Scripts
- **Platform:** GitHub / JanitorAI
- **Author:** Tydorius
- **Type:** Lorebook script templates with stat tracking
- **Description:** JS-based "Script" templates for JanitorAI lorebooks with keyword-priority activation, filters (requiresAny / requiresAll / notWith), probability rolls, timeline events, and stat trackers (Power, Influence, Magic, etc.). Includes Claude/Gemini-ready prompts to populate the template from your worldbuilding notes.

### 55. Forgotten Realms RPG (Bimaadizi) Prompt Toolkit
- **URL:** https://bimaadizi.github.io/Forgotten-Realms-RPG/
- **Platform:** GitHub Pages / JanitorAI
- **Type:** D&D-style modules + segments for JanitorAI bots
- **Description:** Modular system-prompt collection (character sheet, spellbook, encumbrance, shops) derived from Cheese's DeepSeek R1 prompt. Designed to bolt onto roleplay bots for tabletop-style mechanics.

### 56. Saturnine's DeepSeek Masterlist (Cheesey-Wizards)
- **URL:** https://cheesey-wizards-organization.gitbook.io/masterlist/
- **Platform:** GitBook / JanitorAI
- **Author:** Saturnine ("cheesey wizards")
- **Type:** GameMaster prompt catalog for DeepSeek models
- **Description:** Original DeepSeek R1 GameMaster system prompt that other JanitorAI prompts (including the Forgotten Realms toolkit) build on. The "My Prompt" section is widely linked in the OpenRouter Janitor tutorial.

### 57. Elise's Advanced Prompts for DeepSeek & GLM
- **URL:** https://elises-aps.gitbook.io/elises-aps-docs
- **Platform:** GitBook / JanitorAI
- **Author:** softelise (@softelise on Discord)
- **Type:** Advanced Prompts (RPRF, CRP, story-mode, slow-burn variants)
- **Description:** Maintained suite of Advanced Prompts for DeepSeek and GLM 5+, with patch notes (e.g. v3.0 RPRF Prohibited Tactics), supplemental "anti-claiming," "no-impersonation," and OOC modules.

### 58. JanitorAI OpenRouter Tutorial (in-character)
- **URL:** https://janitorai.com/characters/95dc37e1-f050-4bb8-ba2b-d198b154eaa1_character-open-router-tutorial
- **Platform:** JanitorAI character / community
- **Type:** Proxy setup tutorial as a chat character
- **Description:** A continually-updated, character-card-formatted tutorial pinning best free OpenRouter models (DeepSeek R1/V3/R1T2-Chimera, Grok 4 Fast, GLM 4.5 Air, Longcat) with screenshots and refresh instructions; one of the most-shared JanitorAI proxy guides on Reddit.

### 59. JanitorAI "Advanced Prompting 101"
- **URL:** https://help.janitorai.com/en/article/advanced-prompting-101-1ka4aon/
- **Platform:** JanitorAI Help Center
- **Type:** System / Advanced Prompt fundamentals
- **Description:** Beginner-to-intermediate explainer on what an Advanced Prompt is, why LLMs need explicit step-by-step instructions, and a "PEC" persona for analyzing your own prompts.

### 60. /lmg/ Templates & Resources
- **URL:** https://rentry.co/lmg_template (and `lmg-resources`, `lmg_models`, `lmg_template_september`)
- **Platform:** Rentry / 4chan /lmg/
- **Type:** Living link aggregator for local LLMs
- **Description:** Master rentry of model rankings, datasets, training-set links, RP/ERP guides, and architecture-related papers; plus the `lmg_models` torrent/HF directory.

### 61. LLM Training Guide (Alpin)
- **URL:** https://rentry.org/llm-training (gist mirror: https://gist.github.com/btbytes/cf845f9ade1cb34348110c14c8c49cea)
- **Platform:** Rentry / /lmg/
- **Author:** Alpin
- **Type:** Fine-tuning / LoRA / QLoRA
- **Description:** Comprehensive guide for fine-tuning a 7B-class chat/RP model: dataset structure, diversity, Transformer Math 101 references, axolotl trainer migration, and GPU-rental advice.

### 62. CharacterAI Creation Guide ("CHAICreationGuide")
- **URL:** https://rentry.org/CHAICreationGuide
- **Platform:** Rentry / Character.AI
- **Type:** Character.AI bot definition guide
- **Description:** Walks through CAI's Name/Description/Greeting/Definition with practical advice on rating responses (1 vs. 4), dealing with "soft resets" / context loss, and shaping bot speech patterns.

### 63. Character.AI Bot Lists & Tools
- **URL:** https://rentry.co/94dm7
- **Platform:** Rentry / Character.AI
- **Type:** CAI tools/scripts/bot lists hub
- **Description:** Aggregator of CAI scripts (HearYourWaifu, Tilde-Fix, Dark italics, Reload Autoscroll, Interaction Count, room creation), bot lists (`cai-list`), and dump tools.

### 64. Slaude Tips / Slaude Prompts
- **URL:** https://rentry.co/slaude_Tips and https://rentry.org/slaude_prompts (with code: https://github.com/PandarusAnon/slaude and https://github.com/AmmoniaM/Spermack)
- **Platform:** Rentry + GitHub / Claude via Slack
- **Type:** Slack-Claude jailbreak proxy + prompt library
- **Description:** Setup tips for the original Slaude/Spermack proxies that piped Claude through Slack; how to disable jailbreak in ST and put NSFW into the proxy's `PING_MESSAGE`.

### 65. "MyClaudeCantBeThisCute"
- **URL:** https://rentry.org/myclaudecantbethiscute
- **Platform:** Rentry / SillyTavern + Claude
- **Type:** Cuter speech-pattern / shorter response guide for Claude
- **Description:** Settings + main/NSFW prompts to consistently produce concise (800–1500 word) cute-character responses on Claude; emphasizes "leave NSFW toggle ON, field empty" trick.

### 66. Karukaru Base Jailbreak (Karukaru_BaseJB)
- **URL:** https://rentry.co/Karukaru_BaseJB
- **Platform:** Rentry / SillyTavern (Claude/Clewd/GPT)
- **Author:** Karukaru
- **Type:** Jailbreak base/template
- **Description:** XML-tag + nested-instruction JB framework; explains anti-stall, strip-assistant settings, ban lists, and includes a worked sample prompt (~443 tokens) with instructions for Claude.ai and Clewd specifics.

### 67. The "Jailbreak Sea" / Listing Pages
- **URL:** https://rentry.co/full_jailbreak_guide ; https://rentry.org/jb-listing ; https://rentry.org/collected_jb
- **Platform:** Rentry / /aicg/
- **Type:** Aggregators of JBs / main prompts / global notes
- **Description:** Continuously updated lists of Claude/GPT jailbreak prompts pulled from /aicg/, with notes on which JBs work for which model.

### 68. RaccoonTavern Presets
- **URL:** https://rentry.co/RaccoonTavern
- **Platform:** Rentry / SillyTavern
- **Type:** GPT-4 NSFW + Claude prompts
- **Description:** Donor preset with Main Prompt + Jailbreak modules and themed extras (Trap Dungeon, Monster, Estaria, Todd) plus per-message choice and "thoughts" toggles.

### 69. DK's SillyTavern Settings
- **URL:** https://rentry.co/xhbdp
- **Platform:** Rentry / SillyTavern
- **Type:** Personal settings + prompts for OAI gpt-3.5-turbo
- **Description:** Compact, well-tuned starter for SillyTavern on the OpenAI free tier — temperature 1.05, frequency/presence penalty 0.80, plus main and NSFW prompts.

### 70. AICG / Tavern4Retards
- **URL:** https://rentry.org/Tavern4Retards
- **Platform:** Rentry / SillyTavern (TavernAI)
- **Type:** Frontend onboarding
- **Description:** "Tavern explained for new anons" — pinned in /aicg/ OPs as the default Tavern setup walkthrough.

### 71. "Catchup" / AICG Info Rentry
- **URL:** https://rentry.co/catchup
- **Platform:** Rentry / /aicg/
- **Type:** Beginner roadmap
- **Description:** Quick-start landing page that points new users to the right tooling (Tavern, Pyg, CAI dump utilities) while filtering out outdated paths.

### 72. /wAIfu/ AI Guides + Pygmalion Guides
- **URL:** https://rentry.co/wAIfu_AI_Guides ; companion: https://rentry.org/wAIfu_Pygmalion_Guides
- **Platform:** Rentry / 4chan /vt/ /wAIfu/
- **Type:** Hub linking CAI/Tavern/Slaude/Pygmalion guides
- **Description:** /wAIfu/ thread-baked aggregator of bot lists, card editors, CAI→Tavern porting, Tavern card creators, and Slaude alternatives.

### 73. /wAIfu/ DIY AI Resources
- **URL:** https://rentry.org/waifu-diy-ai
- **Platform:** Rentry / Pygmalion / DIY ML
- **Type:** ML curriculum
- **Description:** Annotated reading list (CGP Grey, 3Blue1Brown, StatQuest, Khan Academy, BlenderBot, LaMDA, Hyena, LLaMA papers) for community members who want to actually train their own waifu model.

### 74. NovelAI (Pume) Memory + Pocket Notes Modules
- **URL:** https://aidsrentfree.github.io/modules/ (Pocket Notes: https://github.com/l-io-n/AI-Resources/tree/main/NovelAI/Lorebooks%20and%20Biases/Pocket%20Notes)
- **Platform:** /aids/ rentries + GitHub / NovelAI
- **Type:** Modular author's-note add-ons for NAI
- **Description:** Annotated Writing module, RPG generator expansions, "Boring to Sexy," Scenes/Descriptions/Moods modules — frequently combined with Pocket Notes for fine-grained NAI control.

### 75. Janitor.AI Proxy (rentry)
- **URL:** https://rentry.co/janitorproxy
- **Platform:** Rentry / JanitorAI
- **Type:** Public OAI/Anthropic proxy info
- **Description:** Live status page for a community-operated reverse proxy that's frequently used in Janitor's reverse-proxy slot. Useful as a reference for what a "key/url" pair looks like when configuring proxies.

### 76. Janitor "OpenRouter Tutorial" Step-by-Step (TikTok-popular)
- **URL:** Hayden's Medium write-up (https://medium.com/@hayden_89155/unlock-uncensored-ai-roleplay-janitorai-free-manta-proxy-setup-8e3e3322c0be) and Nebula Block's setup guide (https://blog.nebulablock.com/free-deepseek-proxy-for-janitorai-nebula-block-setup-guide/)
- **Platform:** Medium / Nebula Block / JanitorAI
- **Type:** Free-proxy setup walkthroughs for JanitorAI
- **Description:** Two well-shared setup guides — one for the Manta proxy, one for using Mega Nova / Nebula Block's free DeepSeek inference as a Chutes replacement.

### 77. Sphiratrioth's "Lorebooks as Active Scenario Tool"
- **URL:** https://huggingface.co/sphiratrioth666/Lorebooks_as_ACTIVE_scenario_and_character_guidance_tool
- **Platform:** HuggingFace / SillyTavern
- **Author:** Sphiratrioth
- **Type:** Lorebook procedural-DM technique
- **Description:** Demonstrates how to build TTRPG-style success/failure rolls and dynamic instructions inside SillyTavern lorebook entry groups — without code, just trigger-word gating.

### 78. RisuAI / Agnai Guides
- **URL:** RisuAI: https://risuai.xyz (mirror http://risu.pages.dev/) ; Agnai: https://rentry.org/agnai_guides
- **Platform:** RisuAI / Agnai community
- **Type:** Frontend onboarding / per-frontend feature notes
- **Description:** Risu-specific feature docs (regex, lorebook port) and the Agnai guides rentry, which is the canonical reference for Agnaistic's room/multi-user/Claude/Scale features. Both are pinned in /aicg/ frontend lists.

### 79. SillyTavern-LorebookOrdering (STLO)
- **URL:** https://github.com/aikohanasaki/SillyTavern-LorebookOrdering (referenced from MemoryBooks)
- **Platform:** GitHub / SillyTavern
- **Author:** aikohanasaki
- **Type:** Extension + guide
- **Description:** Companion to MemoryBooks that re-orders multiple lorebooks within budget for cleaner narrative continuity; widely shared in the ST Discord.

### 80. SillyTavern-Settings-and-Presets ashuotaku
- **URL:** https://github.com/ashuotaku/sillytavern
- **Platform:** GitHub / SillyTavern
- **Author:** ashuotaku
- **Type:** Personal preset/regex/settings repo + guides
- **Description:** Active personal repo of SillyTavern presets, regex chains, and beginner-friendly write-ups, frequently surfaced in r/SillyTavernAI.

### 81. ST Preset Creator (cha1latte)
- **URL:** https://github.com/cha1latte/sillytavern-preset-creator
- **Platform:** GitHub / SillyTavern
- **Author:** cha1latte
- **Type:** AI-generated SillyTavern preset builder
- **Description:** Three-part prompt set you give to an AI (e.g. Claude) to generate a complete custom SillyTavern preset JSON, including layered instructions (Foundation → Patterns → Mid-Context → Recent → PHI).

---

## Tier C — Specialized, Niche, or Older-but-Still-Useful

### Character / Persona Creation
- **82. wpp_for_dummies** (already covered as #4) — but note its companion **rentry.co/qeubi** by Drappier and **rentry.org/aiwaifu** are recurring "next reads."
- **83. "Easily Port CAI Bots to Tavern Cards"** — https://rentry.org/Easily_Port_CAI_Bots_to_tavern_cards (Type: import/export; Platform: Tavern)
- **84. Avakson Character Editor** — https://avakson.github.io/character-editor/ (Type: tool, but ships its own how-to; widely linked)
- **85. Zoltanai Character Editor** — https://zoltanai.github.io/character-editor/ (Type: tool/guide)
- **86. Character-tools (SrJuggernaut)** — https://character-tools.srjuggernaut.dev/ (Type: tool with library/instructions)
- **87. malfoyslastname character-card-spec-v2** — https://github.com/malfoyslastname/character-card-spec-v2 + https://malfoyslastname.github.io/chara-card-utils-web (Type: spec + utility; the canonical V2 card spec)

### Jailbreaks / System Prompts
- **88. ClaudeJB** — https://rentry.org/ClaudeJB (Type: Claude jailbreak rentry; a long-running base used by many other JBs)
- **89. Fumblebum** — https://rentry.org/fumblebum (Type: Claude jailbreak; in /aicg/ OP)
- **90. PitanonBots Claude RP Prompts** — https://rentry.org/pitanonbots#claude-rp-prompts
- **91. YAnonTurbo** — https://rentry.org/YAnonTurbo (Type: GPT-3.5 turbo jailbreak)
- **92. HochiTurboTips** — https://rentry.org/HochiTurboTips (Type: Generation settings & SillyTavern tips for turbo)
- **93. CollectedJB** — https://rentry.org/collected_jb
- **94. Spring Twister Hardcore JB** (from `cedionhg`) — long-form roleplay jailbreak permitting graphic content; archived in `rentry.co/cedionhg`
- **95. The "Saif Bypass" / DAN Jailbreak Prompt** — https://rentry.co/saifbypass and the canonical https://gist.github.com/coolaj86/6f4f7b30129b0251f61fa7baaa881516 (DAN/STAN/DUDE family — historically the most widely-shared general LLM jailbreak text on the internet, appears in countless YouTube tutorials and TikToks).

### Lorebook / Memory / World Info
- **96. WyvernWiki Lorebooks** — https://wiki.wyvern.chat/Features/Lorebooks (clear explanation of Scan Depth, Token Budget, Recursive Scanning for non-ST users)
- **97. Bronya Rand World & Lore Books archive** — https://bronya-rand.github.io/reimagined-couscous/world-lore-books (Genshin/HSR canonical lorebook archive)
- **98. "WHAT IS LOREBOOK"** — https://rentry.co/fukatsu_lorebook_help (Chub-focused lorebook intro)
- **99. Lorebook Procedural Guidance (Sphiratrioth)** — already #77, but worth emphasizing as the most-shared technique for using lorebooks as dynamic DMs.

### Self-Hosting / Setup
- **100. KoboldCpp ROCm fork (YellowRoseCx)** — https://github.com/YellowRoseCx/koboldcpp-rocm (Type: AMD-specific KoboldCpp build + wiki; widely cited in /lmg/)
- **101. RunPod's Worldbuilding with Oobabooga + Pygmalion** — https://www.runpod.io/blog/textual-worldbuilding-with-oobabooga-pygmalion (Type: cloud-RunPod walkthrough)
- **102. Frederico Moreira's KoboldCpp fork** — https://github.com/frederico-moreira/koboldcpp
- **103. Pygmalion local guides (`pygmalion-local`)** — already covered as #19; cross-listed because of mobile/Termux patterns

### Bot Lists / Card Sharing
- **104. Char Card Rentry List** — https://rentry.co/charcardrentrylistbeta (and `charcardrentrylistalpha`)
- **105. Meta Bot List (4chan-made)** — https://rentry.org/meta_bot_list
- **106. Anon-Made C.AI Characters** — https://rentry.co/vpcai-backup
- **107. wAIfu Bot List Final** — https://rentry.org/wAIfu_Bot_List_Final
- **108. Chub-Archive (Evulid)** — https://chub-archive.evulid.cc

### Side / Personal Settings & Tips
- **109. dotsgd ("Side rentries")** — https://rentry.co/dotsgd (Type: personal SillyTavern settings + per-model meta + JB list; commonly cited)
- **110. cedionhg ("My own collection")** — https://rentry.co/cedionhg (a personal scrapbook frequently linked in /aicg/)

### Reddit Megathreads & Wiki Pages
- **111. r/PygmalionAI Megathread "My tips for new users"** (libreddit mirror: https://libreddit.garudalinux.org/r/PygmalionAI/comments/10obani/) — context for the original `pygtips` rentry, includes corrections/comments from other early Pygmalion creators.
- **112. r/SillyTavernAI / Community FAQ** — points back to https://docs.sillytavern.app and the SillyTavern Discord.
- **113. JanitorAI subreddit pinned proxy guides** — drive most of the traffic to `help.janitorai.com` and the OpenRouter tutorial character.
- **114. r/NovelAI** — directs to NAI's official `docs.novelai.net` plus Pume's and Blip's rentries.
- **115. r/LocalLLaMA wiki** — pins WolframRavenwolf's model-comparison threads (referenced from `ayumi_erp_rating_archive` as alternative benchmarks).
- **116. r/CharacterAI / r/CharacterAI_** — most highly-upvoted "make a great bot" posts ultimately link to `CHAICreationGuide` and `create-a-character-for-fucking-idiots`.

### General / Cross-Platform Prompt Engineering
- **117. f/awesome-chatgpt-prompts (prompts.chat)** — https://github.com/f/awesome-chatgpt-prompts (143k+ GitHub stars; not RP-specific but the universal entry point for prompt patterns).
- **118. ai-boost/awesome-prompts** — https://github.com/ai-boost/awesome-prompts (curated GPT-store / context-engineering prompts).
- **119. friuns2/BlackFriday-GPTs-Prompts (RPMaster 8.0)** — https://github.com/friuns2/BlackFriday-GPTs-Prompts/blob/main/gpts/rpmaster-80-best-roleplay-prompt.md (a long-running NSFW roleplay jailbreak prompt with extensive in-prompt documentation).
- **120. kogakisaki/GPT-RP-Prompt** — https://github.com/kogakisaki/GPT-RP-Prompt (RPG/OC prompt directory).

### CAI Tooling Scripts
- **121. CAI Tools (Greasyfork scripts)** — `HearYourWaifu` (`456393`), Tilde-Fix (`458317`), Dark Italics Mod (`458319`), Reload Autoscroll (`458400`), unlisted-room creator (`460287`) — listed in `94dm7`/`charai-bots` rentries.

### Visual / Mobile
- **122. Pygmalion on Mobile (pygmobile)** — https://rentry.co/pygmobile (Type: Colab desktop-mode tricks for keeping notebooks alive on Android)
- **123. ipfub** — https://rentry.org/ipfub (Type: Windows install guide for KoboldAI + Tavern + Pygmalion stack)

### LLM Model References
- **124. lmg_models** — https://rentry.co/lmg_models (Type: model directory + torrent links; pairs with `ayumi_erp_rating_archive`)
- **125. nur779** — https://rentry.org/nur779 (Type: LLaMA model curation)

### TavernAI / Legacy
- **126. Original TavernAI (SillyLossy)** — https://github.com/SillyLossy/TavernAI (the predecessor of SillyTavern; some older guides still target it).

---

## Caveats and What This List Cannot Do

- **Reddit/Discord upvote counts** are not directly observable through public web search for most pinned/megathread posts — many of the most-engaged Reddit guides on r/CharacterAI, r/SillyTavernAI, r/NovelAI, and r/JanitorAI_Official ultimately *link out* to the rentries above, which is why this list is rentry-heavy. A truly upvote-ranked Reddit list would require Reddit API access or direct scraping, which was not available.
- Some popular Discord-pinned guides exist as `discord.com/channels/...` links inside community handouts (see, e.g., the SillyTavern Discord channel link `1135319829788770375`); their content is not reliably mirrored to the public web and is therefore not enumerable here.
- Several guides (e.g., older Slaude flows, original Tavern install guides) remain widely linked but reflect deprecated stacks. They are included where they're still cross-referenced, but their *practical* relevance is lower than their citation count would suggest.
- "Popularity ranking" mixes evidence from view counters (where shown — e.g., `create-a-character-for-fucking-idiots` showing 43,725 views, `aicg_op_2_rework` 1,566, `slaude_Tips`, etc.), GitHub stars (Oobabooga 46.8k, SillyTavern 25.3k, KoboldCpp ~9k+, awesome-chatgpt-prompts 143k+), and citation density. It is a reasoned synthesis, not a precise leaderboard.
- A handful of pages referenced by the OPs (e.g., `meta_botmaking_list`, `meta_claude_list`, `desuproxyreborn`, `pixiguide`, `NG_CharCard`, `aiwaifu`, `qeubi`) host the actual prompt or template content but are deliberately gated behind content warnings or have minimal extractable text from search results; they are listed by name and URL so a reader can navigate to them directly.

---

## Suggested Reading Order for a New Power User

If you are building a roleplay character from scratch, the canonical study path that emerges from cross-citation is:

1. **Read** Chai's tips → Junko's "For Idiots" guide → Kuma's W++ For Dummies (concept exposure).
2. **Pick a format**: AliCat's Ali:Chat → Trappu's PList+Ali:Chat → kingbri's Lite variant → AVAKSon for worked NSFW examples.
3. **Move complex info into lorebooks**: World Info Encyclopedia → Pume's Lorebook Guide → AIDS Wiki Lorebooks (for NAI specifically).
4. **Pick a frontend** and follow its docs: SillyTavern docs + sphiratrioth/Sukino presets, or Chub.ai docs, or JanitorAI Help Center proxy guide.
5. **For local models**: KoboldCpp wiki + Oobabooga wiki + Ayumi/ALLMRR rankings + Anon's Better-LLaMA-Roleplay (deprecated but instructive) + Alpin's LLM training guide if you want to fine-tune.
6. **For prompt/jailbreak work**: PixiJB → CharacterProvider → Smiley's presets → Sukino Game Master + Banned Tokens → Karukaru base + Saturnine's DeepSeek Masterlist.
7. **For NovelAI**: Blip's Beginner Guide → Pume's Memory + Lorebook guides → NAIChatbot or SillyNAIGuide depending on whether you stay native or move to ST.
8. **For Janitor**: Help Center Parts 1 & 2 → OpenRouter Tutorial character → Saturnine's masterlist → Elise's Advanced Prompts.
9. **For Character.AI**: CHAICreationGuide + the "94dm7" tools rentry + the OOC/jailbreak primer in `beedai`/`tenorshare` style write-ups.

This sequencing recurs across nearly every aggregator page surveyed and represents the closest thing the chatbot-roleplay community has to a shared curriculum.