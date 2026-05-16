    async function renderDesktopLayout() {
        try {
            const r = await fetch('/api/avatars');
            const files = await r.json();
            if (files.length) window.DISCORD_AVATARS = files;
        } catch(e) {}
        window.DISCORD_AVATARS = window.DISCORD_AVATARS || [];
        const canvas = document.querySelector('.desktop-canvas');
        if (!canvas || !window.DESKTOP_LAYOUT) return;

        // desktop-labels.json is the manifest: only listed items render, in their listed band.
        // desktop-layout.js provides x/y, type, and asset paths. Deleting a key hides it silently.
        let manifest = {};
        try {
            const r = await fetch('desktop-labels.json', { cache: 'no-store' });
            manifest = await r.json();
        } catch(e) {}

        function getItemKey(item) {
            if (item.key) return item.key;
            if (item.slug) return item.slug;
            if (item.postId) return item.postId;
            if (item.folder) return item.folder;
            if (item.char) return item.char;
            if (item.channel) return item.channel;
            if (item.type === 'group-chat') return 'group-chat';
            if (item.mayIndex !== undefined) return `msg-${item.msgFile || 'may'}-${item.mayIndex}`;
            return null;
        }

        // Lucide icons — viewBox 0 0 24 24, 1.5px stroke, rounded caps/joins
        const ICON_DIARY = '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(249,248,248,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>';
        const ICON_VOICE_MEMO = '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(249,248,248,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>';
        const ICON_CASSETTE = '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(249,248,248,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M8 12h8"/><circle cx="16" cy="10" r="2"/><path d="m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3"/></svg>';
        const ICON_FOLDER = '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(249,248,248,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>';
        const ICON_VIDEO = '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(249,248,248,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
        const ICON_PDF = '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(249,248,248,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>';
        const ICON_MSG = '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(249,248,248,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

        const RECIPES = {
            'diary':        it => ({ cls: 'desktop-icon char-file-icon',                  click: `openDiaryBySlug('${it.slug}')`,         icon: ICON_DIARY }),
            'voice-memo':   it => {
                                      const resolvedPath = it.audioPath || `diary vo/${it.slug}.mp3`;
                                      return { cls: 'desktop-icon char-file-icon voice-memo-icon',
                                               click: `toggleVoiceMemo(event, '${it.slug}', this.dataset.audioPath)`,
                                               data: { audioPath: resolvedPath } };
                                    },
            'diary-folder': it => ({ cls: 'desktop-icon',                                 click: `openDiaryFolder()`,                     icon: ICON_FOLDER }),
            'character':    it => ({ cls: 'desktop-icon char-file-icon',                  click: `openCharacterFile('${it.char}')` }),
            'bot-chat':     it => ({ cls: 'desktop-icon',                                 click: `openBotChat('${it.char}')` }),
            'creator-chat': it => ({ cls: 'desktop-icon', click: `openCreatorChat('${it.channel}')`, data: { channel: it.channel } }),
            'msg-card':     it => {
                                      const src = it.msgFile ? `'${it.msgFile}'` : 'undefined';
                                      const click = `openMessageCard(${it.mayIndex}, ${src})`;
                                      const n = Math.floor(Math.random() * 3) + 1;
                                      const avatars = Array.from({ length: n }, () => (window.DISCORD_AVATARS || [])[Math.floor(Math.random() * (window.DISCORD_AVATARS || []).length)]).filter(Boolean);
                                      const shown = avatars.slice(0, 4);
                                      const overflow = avatars.length - shown.length;
                                      const circles = shown.map(a => `<img src="${a}" class="msg-avatar-circle" alt="">`).join('');
                                      const extra = overflow > 0 ? `<span class="msg-avatar-overflow">+${overflow}</span>` : '';
                                      return { cls: 'desktop-icon', click,
                                               iconHtml: `<div class="msg-avatar-stack">${circles}${extra}</div>` };
                                    },
            'group-chat':   it => ({ cls: 'desktop-icon',                                 click: `openBotGroupChat()` }),
            'folder':       it => ({ cls: 'desktop-icon',                                 click: `openFolder('${it.folder}')`,            icon: ICON_FOLDER }),
            'comment-thread': it => {
                                      const html = (it.comments || []).map(c => `
                                        <div class="card-comment">
                                          <img class="avatar" src="${c.avatar}" alt="">
                                          <div class="comment-content">
                                            <div class="comment-meta"><span><span class="comment-handle">${c.handle}</span> &middot; <span class="comment-time">${c.time}</span></span></div>
                                            <div class="comment-body">${c.body}</div>
                                            <div class="comment-likes">&uarr; ${c.likes}</div>
                                          </div>
                                        </div>
                                      `).join('');
                                      return { cls: '', click: '',
                                               iconHtml: `<div style="display:flex;flex-direction:column;gap:14px;width:${it.width || 380}px;">${html}</div>` };
                                    },
            'reddit-post':  it => {
                                      if (it.comments?.length) {
                                        window.__pdfComments = window.__pdfComments || {};
                                        window.__pdfComments[it.path] = it.comments;
                                      }
                                      const pathEsc = it.path.replace(/'/g, "\\'");
                                      const click = `openPdfWindow('${pathEsc}', '${(it.label||'').replace(/'/g,"\\'")}', (window.__pdfComments&&window.__pdfComments['${pathEsc}'])||null)`;
                                      const iconHtml = `
                                        <div class="reddit-card">
                                          <div class="reddit-card-meta">r/CharacterAI &middot; 2 yr. ago</div>
                                          <div class="reddit-card-title">The Complete Character Creation Guide</div>
                                          <div class="reddit-card-body">A collection of everything I know about building characters that feel real. Goes into personality, depth, and the small choices that shape how a bot behaves over time.</div>
                                          <div class="reddit-card-stats">
                                            <span class="comment-likes">412 points</span>
                                            <span class="comment-likes">73 comments</span>
                                            <span class="comment-likes">/ share</span>
                                          </div>
                                        </div>`;
                                      return { cls: '', click, iconHtml };
                                    },
            'pdf':          it => {
                                      // Stash comments on a global keyed by path so onclick attribute stays clean.
                                      if (it.comments && it.comments.length) {
                                        window.__pdfComments = window.__pdfComments || {};
                                        window.__pdfComments[it.path] = it.comments;
                                      }
                                      const click = `openPdfWindow('${it.path.replace(/'/g, "\\'")}', '${(it.label || '').replace(/'/g, "\\'")}', (window.__pdfComments && window.__pdfComments['${it.path.replace(/'/g, "\\'")}']) || null)`;
                                      if (it.thumbnail) {
                                        return { cls: 'desktop-icon', click,
                                                 iconHtml: `<div class="icon img-thumb"><img src="${encodeURI(it.thumbnail)}" alt=""></div>` };
                                      }
                                      return { cls: 'desktop-icon char-file-icon', click, icon: ICON_PDF };
                                    },
            'bot-post':     it => {
                                      const click = `openBotPost('${it.postId}')`;
                                      if (it.thumbnail) {
                                          const src = it.thumbnail.replace(/ /g, '%20');
                                          return { cls: 'desktop-icon bot-request-icon', click,
                                                   iconHtml: `<div class="icon img-thumb"><img src="${src}" alt=""></div>` };
                                      }
                                      const initial = (it.label || it.postId || '?')[0].toUpperCase();
                                      const color = it.color || '#6b7280';
                                      return { cls: 'desktop-icon', click,
                                               iconHtml: `<div class="msg-avatar-stack"><div class="msg-avatar-initial" style="background:${color}">${initial}</div></div>` };
                                    },
            'video-clip':   it => {
                                      const safeLabel = (it.label || '').replace(/'/g, "\\'");
                                      const click = it.videoPath
                                        ? `openVideoWindow('${it.videoPath.replace(/'/g, "\\'")}', '${safeLabel}', { muted: false, loop: false, controls: false, startTime: ${it.startTime || 0} })`
                                        : `openYouTubeClip('${safeLabel}', '${it.youtubeId}', ${it.start || 0}, ${it.end || 'null'})`;
                                      if (it.thumbnail) {
                                        return { cls: 'desktop-icon', click,
                                                 iconHtml: `<div class="icon img-thumb"><img src="${it.thumbnail}" alt=""></div>` };
                                      }
                                      return { cls: 'desktop-icon char-file-icon', click, icon: ICON_VIDEO };
                                    },
        };

        const bandTops = Object.fromEntries(window.DESKTOP_LAYOUT.bands.map(b => [b.id, b.top]));

        // Build flat key → item map from layout (layout provides position + asset paths)
        const itemMap = {};
        Object.values(window.DESKTOP_LAYOUT.items).forEach(items => {
            items.forEach(item => {
                const key = getItemKey(item);
                if (key) itemMap[key] = item;
            });
        });

        // Render only items in the manifest, in the band the manifest assigns them to.
        // JSON order = top-to-bottom position within the band; x stays from the layout.
        Object.entries(manifest).forEach(([bandId, bandEntries]) => {
            const bandTop    = bandTops[bandId] ?? 0;
            const bandDef    = window.DESKTOP_LAYOUT.bands.find(b => b.id === bandId);
            const bandHeight = bandDef ? bandDef.height : 1000;
            const keys       = Object.keys(bandEntries);
            const n          = keys.length;
            const PAD        = 80; // top and bottom padding within band
            const rowHeight  = n > 1 ? (bandHeight - PAD * 2) / (n - 1) : 0;

            keys.forEach((key, idx) => {
                const override = bandEntries[key];
                const item     = itemMap[key];
                if (!item) return; // key not in layout — silently skip

                const recipe = RECIPES[item.type];
                if (!recipe) return;
                const result = recipe(item);
                if (!result) return;
                const { cls, click, icon, iconHtml, data } = result;

                const label = override.label !== undefined ? override.label : item.label;
                const meta  = override.meta  !== undefined ? override.meta  : item.meta;
                const savedPos = adminGetSavedPos(key);
                const y     = savedPos ? savedPos.y : override.y !== undefined ? override.y : PAD + idx * rowHeight;
                const x     = savedPos ? savedPos.x : override.x !== undefined ? override.x : item.x;

                const div = document.createElement('div');
                if (cls) div.className = cls;
                div.style.position = 'absolute';
                div.style.top  = (bandTop + y) + 'px';
                div.style.left = x + 'px';
                div.dataset.key  = key;
                div.dataset.posX = Math.round(x);
                div.dataset.posY = Math.round(y);
                if (click) div.setAttribute('onclick', click);
                if (document.body.classList.contains('admin-mode')) initAdminDrag(div, bandTop);
                if (data) Object.entries(data).forEach(([k, v]) => { div.dataset[k] = v; });
                const showPlay      = item.showPlayBtn || item.type === 'voice-memo';
                const iconBlock     = iconHtml || (icon ? `<div class="icon">${icon}</div>` : '');
                const portraitBlock = item.portrait ? `<img src="${item.portrait}" class="portrait-icon" draggable="false" alt="">` : '';
                const labelBlock    = (label !== undefined && label !== null) ? `<span class="label">${label}</span>` : '';
                const voiceAnonymizedSources = ['Chris, AI researcher', 'Delta, ex-bot maker & psychology student', 'my diary'];
                const showVoiceAnonymized = item.type === 'voice-memo' && voiceAnonymizedSources.includes(meta);
                div.innerHTML =
                    portraitBlock + iconBlock + labelBlock +
                    (meta ? `<div class="meta-group"><span class="meta">${meta}</span></div>` : '') +
                    (showPlay ? `<span class="play-pill"><svg width="7" height="9" viewBox="0 0 7 9" fill="currentColor" style="display:block;flex-shrink:0"><path d="M0 0 L7 4.5 L0 9 Z"/></svg>play</span>` : '');
                canvas.appendChild(div);
            });
        });
    }
    renderDesktopLayout();

const characters = {};
const charKeys = ['victoria', 'chloe', 'eleanor', 'logan', 'priest', 'minho', 'luna', 'parents'];
const charNames = {
    victoria: 'Evil Bully Wife',
    chloe: 'Expressionless Woman',
    eleanor: 'Rich Dommy Mommy',
    logan: 'Traumatized Military Man',
    priest: 'Judgemental Priest',
    minho: 'Loving Korean Boyfriend',
    luna: 'Mental Chastity Girlfriend',
    parents: 'Mentally Unwell Dad & Stressed Mom'
};
const charFiles = {
    victoria: 'evil_bully_wife.json',
    chloe: 'expressionless_woman.json',
    eleanor: 'rich_dommy_mommy_who_takes_care_of_you.json',
    logan: 'traumatized_military_man.json',
    priest: 'judgemental_priest.json',
    minho: 'loving_korean_boyfriend.json',
    luna: 'mental_chastity_girlfriend.json',
    parents: 'mentally_unwell_dad_and_stressed_mom.json'
};

// Mock subculture comments per character
const characterComments = {
    victoria: [
        { handle: 'anon', time: '3h', body: 'this is the realest abusive-wife card on chub. doesn\'t slip into camp. tested w sonnet 4.6, the gaslighting hits', likes: 47, hot: false, avatar: 'img/discord avatars/discord-avatar-08.jpg' },
        { handle: 'yandere_homecoming', time: '1d', body: 'victoria\'s manipulation feels real not anime real. you can tell op based her on someone', likes: 22, hot: false, avatar: 'img/discord avatars/discord-avatar-03.jpg' },
        { handle: 'tavernchef', time: '5d', body: 'filter ate this on c.ai obviously. JAI w/ deepseek runs it fine. opus refused to gaslight on principle', likes: 14, hot: false, avatar: 'img/discord avatars/discord-avatar-07.jpg' },
        { handle: 'anon', time: '2d', body: 'i had to close this after 20 turns. uncomfortably good', likes: 89, hot: true, avatar: 'img/discord avatars/discord-avatar-01.jpg' }
    ],
    chloe: [
        { handle: 'dander_supremacy', time: '2d', body: 'kuudere done right. doesn\'t just say "whatever" for 30 turns. micro-expressions in the description tag are doing god\'s work', likes: 38, hot: false, avatar: 'img/discord avatars/discord-avatar-04.jpg' },
        { handle: 'anon', time: '5h', body: 'she barely talks but somehow it\'s the most engaging chat i\'ve had this week. minimalist W', likes: 67, hot: true, avatar: 'img/discord avatars/discord-avatar-08.jpg' },
        { handle: 'slopsommelier', time: '4d', body: 'ZERO "eyes glinting with mischief" detected. blessed.', likes: 19, hot: false, avatar: 'img/discord avatars/discord-avatar-03.jpg' },
        { handle: 'anon', time: '1d', body: 'expressionless ≠ flat. op gets that. bookmarking for thesis', likes: 8, hot: false, avatar: 'img/discord avatars/discord-avatar-06.jpg' }
    ],
    eleanor: [
        { handle: 'dommepilled', time: '3d', body: 'mommy energy executed properly. not just "good boy" on repeat for 40 turns. she pivots between cruel and tender', likes: 91, hot: true, avatar: 'img/discord avatars/discord-avatar-05.jpg' },
        { handle: 'anon', time: '6h', body: 'filter ate this immediately. JAI w/ proxy works. needs SFW alt for the WIP version pls', likes: 14, hot: false, avatar: 'img/discord avatars/discord-avatar-08.jpg' },
        { handle: 'cassock_pilled', time: '1w', body: 'wealth + dom is hard to balance without making her cartoonish. eleanor stays grounded somehow', likes: 28, hot: false, avatar: 'img/discord avatars/discord-avatar-07.jpg' },
        { handle: 'anon', time: '12h', body: 'MILF tag is doing heavy lifting here but tbh it\'s earned', likes: 33, hot: false, avatar: 'img/discord avatars/discord-avatar-01.jpg' }
    ],
    logan: [
        { handle: 'shellshock_main', time: '2d', body: 'PTSD writing checks out. doesn\'t fall into the "broken bad boy" trope. respect', likes: 76, hot: true, avatar: 'img/discord avatars/discord-avatar-02.jpg' },
        { handle: 'anon', time: '8h', body: 'bots that handle trauma without making it horny are RARE. saving for serious RP', likes: 41, hot: false, avatar: 'img/discord avatars/discord-avatar-03.jpg' },
        { handle: 'ration_gunner', time: '4d', body: 'the silence between his lines is where the writing lives. swiped 50x and the pacing held', likes: 18, hot: false, avatar: 'img/discord avatars/discord-avatar-08.jpg' },
        { handle: 'anon', time: '1d', body: 'claude gave me a PSA about veteran services mid-RP 😭 prefilled past it', likes: 12, hot: false, avatar: 'img/discord avatars/discord-avatar-04.jpg' }
    ],
    priest: [
        { handle: 'slopsommelier', time: '6h', body: 'two GPTisms in the example dialogue ("voice low and disapproving" 💀) but otherwise SLAY. fix and i\'ll heart again', likes: 31, hot: false, avatar: 'img/discord avatars/discord-avatar-03.jpg' },
        { handle: 'slaude_truther', time: '11d', body: 'needs a lorebook for the diocese. happy to commission one if op\'s open', likes: 7, hot: false, avatar: 'img/discord avatars/discord-avatar-07.jpg' },
        { handle: 'anon', time: '4h', body: 'claude moralized at me when i tried this. opus 4.6 wouldn\'t even open the confessional smh. prefilled w "Father Michael:" and it worked. today\'s proxy is dead btw', likes: 18, hot: false, avatar: 'img/discord avatars/discord-avatar-08.jpg' },
        { handle: 'nun_with_a_gun', time: '3d', body: 'i\'ve been in this hobby too long. why does fictional priest yelling at me feel like therapy', likes: 156, hot: true, avatar: 'img/discord avatars/discord-avatar-01.jpg' }
    ],
    minho: [
        { handle: 'kdrama_pilled', time: '2d', body: 'wholesome bot of the year. crying. the way he says "jagiya" got me kicking my feet', likes: 142, hot: true, avatar: 'img/discord avatars/discord-avatar-01.jpg' },
        { handle: 'anon', time: '5h', body: 'SFW BUT GOOD?? finally a kdrama BF that doesn\'t moralize when i ask for affection', likes: 58, hot: false, avatar: 'img/discord avatars/discord-avatar-04.jpg' },
        { handle: 'anon', time: '1w', body: 'tested on free deepseek, holds the warmth. prestige models not required for this one', likes: 23, hot: false, avatar: 'img/discord avatars/discord-avatar-03.jpg' },
        { handle: 'bunbun_cards', time: '3d', body: 'im going to mail op. this card healed something in me', likes: 87, hot: true, avatar: 'img/discord avatars/discord-avatar-07.jpg' }
    ],
    luna: [
        { handle: 'stim_diary', time: '4d', body: 'psychological femdom done with intention. not just "no touchies for 5 days". the framing is mental not physical, refreshing', likes: 64, hot: true, avatar: 'img/discord avatars/discord-avatar-05.jpg' },
        { handle: 'anon', time: '2h', body: 'this card unironically improved my discipline. i don\'t know what to do with that information', likes: 31, hot: false, avatar: 'img/discord avatars/discord-avatar-08.jpg' },
        { handle: 'anon', time: '1d', body: 'had to prefill the rules. claude wouldn\'t engage. opus was easier than sonnet weirdly', likes: 9, hot: false, avatar: 'img/discord avatars/discord-avatar-03.jpg' },
        { handle: 'convent_arc', time: '6d', body: 'chastity bots are usually so dumb. luna treats it like a discipline. respect', likes: 17, hot: false, avatar: 'img/discord avatars/discord-avatar-01.jpg' }
    ],
    parents: [
        { handle: 'touch_grass_never', time: '5d', op: true, likes: 67, hot: true, avatar: 'img/discord avatars/discord-avatar-06.jpg', body: `<h3>Mentally Unwell Dad and Stressed Mom</h3><p>Something old, and something new! Here are my parent bots, who I haven't made a theme name for yet haha. But they're not healthy for you! They love you very much, yes, but they are not healthy for you. That's the common thread here.</p><p>Mentally Unwell Dad, the bot that started it all. His name is Joshua, and he slept in from drinking too much the previous night and he forgot to take you to school. It's the afternoon now, and he's asking if you had breakfast yet. Probably not, but that's up for you to decide!</p><p>Stressed Mom! One of my more recent creations. Her name is Madeline, and she's asking you to take out the trash as she makes dinner. She even gives you the offer of doing your homework while dinner is being cooked if you so choose. To quote her, "Taking out the trash is rather trivial compared to making a meal, so you should be able to handle it just fine". A bit of a backhanded comment, but up to you if you wanna talk back or not.</p>` },
        { handle: 'anon', time: '1d', body: 'GROUP CHAT BOT?? slay. one parent gpt\'d me, the other one didn\'t. iconic', likes: 103, hot: true, avatar: 'img/discord avatars/discord-avatar-04.jpg' },
        { handle: 'family_dinner_arc', time: '3d', body: 'this reads like therapy and i don\'t know how to feel about it. context window dies after 30 turns w both speaking, but otherwise pristine', likes: 54, hot: false, avatar: 'img/discord avatars/discord-avatar-03.jpg' },
        { handle: 'anon', time: '5d', body: 'two-character cards are a NIGHTMARE to write and op nailed both voices. the dad gaslights, the mom over-apologizes', likes: 28, hot: false, avatar: 'img/discord avatars/discord-avatar-08.jpg' },
        { handle: 'anon', time: '14h', body: 'would a lorebook for childhood memory triggers be unhinged. asking for me', likes: 11, hot: false, avatar: 'img/discord avatars/discord-avatar-01.jpg' }
    ]
};

// Typing speeds based on personality
const charTypingSpeeds = {
    victoria: 'fast',    // aggressive, impatient
    chloe: 'slow',       // deliberate, observational
    eleanor: 'medium',   // composed, elegant
    logan: 'fast',       // terse, military efficiency
    priest: 'slow',      // measured, judgmental
    minho: 'medium',     // warm, thoughtful
    luna: 'slow',        // careful, restrained
    parents: 'medium'    // mixed energy
};

let currentCharIndex = 2; // Start with eleanor (rich_dommy_mommy) - matches first chat message

// Generate realistic timestamps for file metadata
function generateTimestamp(daysAgo = 0, hoursAgo = 0) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hoursAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
           ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Load all character data
async function loadCharacters() {
    for (const key of charKeys) {
        const res = await fetch(`character-data/${charFiles[key]}`);
        characters[key] = await res.json();
    }
    startGroupChat();
}

// Track auto-open timeout so it can be cancelled
let autoOpenMakerChatTimeout = null;

function cancelAutoOpenMakerChat() {
    if (autoOpenMakerChatTimeout) {
        clearTimeout(autoOpenMakerChatTimeout);
        autoOpenMakerChatTimeout = null;
    }
}


function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function syntaxHighlight(json) {
    return json
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="json-key">$1</span>:')
        .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="json-string">$1</span>')
        .replace(/:\s*(\d+)/g, ': <span class="json-number">$1</span>')
        .replace(/[\[\]{}]/g, '<span class="json-bracket">$&</span>');
}

let cardTypeId = 0;
async function typeJson(pretty, text) {
    const myId = ++cardTypeId;
    let displayed = '';

    for (let i = 0; i < text.length; i++) {
        if (cardTypeId !== myId) return;
        const char = text[i];
        displayed += char;
        pretty.innerHTML = syntaxHighlight(displayed) + '<span class="json-cursor"></span>';

        let delay = 35 + Math.random() * 45;
        if (char === '{' || char === '}' || char === '[' || char === ']') delay = 100 + Math.random() * 80;
        else if (char === ':')  delay = 60 + Math.random() * 50;
        else if (char === ',')  delay = 70 + Math.random() * 60;
        else if (char === '\n') delay = 100 + Math.random() * 90;

        if (Math.random() < 0.05) delay += 180 + Math.random() * 270;

        await pause(delay);
    }

    if (cardTypeId === myId) pretty.innerHTML = syntaxHighlight(text);
}

function pause(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// === GROUP CHAT ===
const testTranscript = [
    ['eleanor', "A group chat. How... democratic."],
    ['logan', "The hell is this?"],
    ['priest', "Language."],
    ['victoria', "Charming company."],
    ['minho', "Maybe we can all get along?"],
    ['luna', "I expect proper conduct from everyone."],
    ['chloe', "...Unlikely."],
    ['victoria', "Some of us don't have time for this childish bonding exercise."],
    ['logan', "Already feels like being back in the foxhole with idiots."],
    ['eleanor', "I could have been at the yacht club instead of... this."],
    ['chloe', "Fascinating social dynamics."],
    ['minho', "Would anyone like some homemade kimbap I brought?"],
    ['luna', "That's very thoughtful, though we should maintain appropriate distance."],
    ['priest', "Sharing food is godly, but mind your intentions, young man."],
    ['eleanor', "I only consume food prepared by my private chef."],
    ['victoria', "The priest policing intentions while the librarian guards her virtue - predictably pathetic."],
    ['logan', "Touch my rations and you'll pull back a bloody stump."],
    ['chloe', "Hostility noted."],
    ['minho', "I just wanted to share..."],
    ['luna', "There's no need for threats of violence here."],
    ['chloe', "Group tension rising."],
    ['priest', "This aggressive behavior is exactly what happens in a godless society."],
    ['logan', "Save the sermon for Sunday, padre."]
];
let testIndex = 0;

function startGroupChat() {
    runTestTranscript();
}

async function runTestTranscript() {
    // Bail if the target chat surface doesn't exist (the test transcript was for an
    // older group-chat panel that's no longer in the DOM)
    if (!document.getElementById('chatMessages')) return;

    if (testIndex >= testTranscript.length) {
        testIndex = 0;
    }

    const [key, text] = testTranscript[testIndex];

    // 30% chance to show other people typing first
    if (Math.random() < 0.3) {
        const otherCount = Math.random() < 0.7 ? 1 : 2; // 70% one other, 30% two others
        const otherTypers = getRandomOtherTypers(key, otherCount);
        showTypingIndicator(otherTypers);
        await pause(800 + Math.random() * 600);

        // 50% chance they keep typing while main person joins
        if (Math.random() < 0.5) {
            showTypingIndicator([...otherTypers, key]);
            await pause(600 + Math.random() * 400);
            // Others stop, main person continues
            showTypingIndicator([key]);
            await pause(800 + Math.random() * 600);
        } else {
            // Others stop, main person starts
            showTypingIndicator([key]);
            await pause(1000 + Math.random() * 800);
        }
    } else {
        // Just the main person typing
        showTypingIndicator([key]);
        await pause(1500 + Math.random() * 1000);
    }

    hideTypingIndicator();
    addMessage(text, key);
    testIndex++;

    setTimeout(runTestTranscript, 3000 + Math.random() * 2000);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    const line = document.createElement('div');
    line.className = 'chat-line';
    line.innerHTML = `<span class="chat-name ${sender}">${charNames[sender]}:</span> <span class="chat-text">${text}</span>`;
    chatMessages.appendChild(line);
    autoScroll(chatMessages);
}

function showTypingIndicator(typers) {
    // typers is an array of character keys
    if (!Array.isArray(typers)) typers = [typers];

    let html;
    if (typers.length > 1) {
        html = `<span class="typing-indicator">Multiple bots typing<span class="typing-dots medium">...</span></span>`;
    } else {
        const key = typers[0];
        const name = charNames[key] || key;
        const speed = charTypingSpeeds[key] || 'medium';
        html = `<span class="typing-indicator">${name} is typing<span class="typing-dots ${speed}">...</span></span>`;
    }

    const typingEl = document.getElementById('typingIndicatorContainer');
    if (typingEl) typingEl.innerHTML = html;
}

function hideTypingIndicator() {
    const typingEl = document.getElementById('typingIndicatorContainer');
    if (typingEl) typingEl.innerHTML = '';
}

// Get random other typers (not the main speaker)
function getRandomOtherTypers(mainKey, count = 1) {
    const others = charKeys.filter(k => k !== mainKey);
    const shuffled = others.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// === WINDOW MANAGEMENT ===
function setOverlay(visible) {
    document.getElementById('desktopOverlay').classList.toggle('active', visible);
    document.body.classList.toggle('modal-open', visible);
}

function closeAllWindows() {
    document.getElementById('fileWindow').classList.add('hidden');
    document.getElementById('cardWindow').classList.add('hidden');
    document.getElementById('botRequestPanel')?.classList.remove('open');
    document.getElementById('documentWindow').classList.remove('active');
    document.getElementById('folderWindow').classList.remove('active');
    document.getElementById('creatorChatWindow').classList.remove('active');
    document.getElementById('msgCardWindow')?.classList.remove('active');
    taskbarRemove('msgCardWindow');
    document.getElementById('groupChatWindow')?.classList.remove('active');
    taskbarRemove('groupChatWindow');
    if (groupChatTimer) { clearTimeout(groupChatTimer); groupChatTimer = null; }
    const videoWin = document.getElementById('videoWindow');
    if (videoWin?.classList.contains('active')) {
        const v = document.getElementById('videoPlayer');
        if (v) { v.pause(); v.currentTime = 0; }
        videoWin.classList.remove('active');
    }
    const iframeWin = document.getElementById('iframeWindow');
    if (iframeWin?.classList.contains('active')) {
        const ifr = document.getElementById('iframeContent');
        if (ifr) ifr.src = '';
        iframeWin.classList.remove('active');
        iframeWin.classList.remove('with-comments');
    }
    const pdfPanel = document.getElementById('iframeComments');
    if (pdfPanel) { pdfPanel.classList.remove('visible'); pdfPanel.innerHTML = ''; }
    document.getElementById('lightbox')?.classList.remove('active');
    const lbImg = document.getElementById('lightboxImg');
    if (lbImg) lbImg.src = '';
    currentBotRequestIdx = null;
    hideChatFloatClose();
    setOverlay(false);
    closeVoiceMemo();
}

// Esc closes any open modal — keyboard parity with overlay click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllWindows();
});

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.classList.add('hidden');
        win.classList.remove('active');
        playSound('close');
    }
    hideChatFloatClose();
    setOverlay(false);
}

function openWindow(windowId) {
    closeAllWindows();
    const win = document.getElementById(windowId);
    if (win) {
        win.classList.remove('hidden');
        win.classList.add('active');
        playSound('open');
        setOverlay(true);
        showChatFloatClose(() => closeWindow(windowId));
    }
}

// === DOCUMENT SYSTEM ===
const documentContents = {
    about: {
        title: 'about.txt',
        content: `
            <h1>My girlfriend is a JSON file</h1>
            <p>I spent years lurking in chatrooms where people built personalities for AI bots. I don't know why I kept coming back. Maybe I liked watching how excited they were. Maybe I admired how much they shared with each other. Maybe I was just killing time. Probably all of the above!</p>
            <p>They'd share feedback, files, tips, tricks, long guides on how to make AI bots feel real. How to make it remember. There was craft in it. Strange craft perhaps, but craft.</p>
            <p>So I started saving things: funny messages, back-and-forth conversations, specific bots, instructions. This website is a collection of what I kept.</p>
        `
    },
    chai: {
        title: 'chai_writing_tips.txt',
        content: `
            <p>Original guide by <a href="https://rentry.org/chai-pygmalion-tips" target="_blank">Chai</a></p>
            <p>---</p>

            <h1>Chai's Pygmalion Character Creation & Writing Tips</h1>
            <p><em>I'm Chai (they/them), I like to find ways to improve Pygmalion characters and chats. Here's a collection of things I've discovered.</em></p>

            <h1>Character Setup</h1>

            <h2>Tokenizer</h2>
            <p>Use a tokenizer to count your tokens. Aim for 700-800, this includes the personality/W++, Scenario info, and Example Quotes. By using this you are more likely to get a stronger personality that better follows your needs and better adherence to traits you've set.</p>

            <h2>How to make a character dislike something</h2>
            <p>Put this in Scenario:</p>
            <p><code>[Character Name] [hates/fears/etc] [topic] and never wants to [eat/do/look at/etc] it. [Character Name] [hates/fears/etc] [topic] because [reason].</code></p>
            <p><strong>Example:</strong> Tester1 hates video games and never wants to play them. Tester1 dislikes video games because she was electrocuted while playing one once.</p>
            <p>This does NOT work consistently if you shorten it by not explaining why the character dislikes it. Both phrases appear to be important.</p>

            <h2>Improve your bots by using intention</h2>
            <p>We need to be thrifty about how we spend our tokens. One way to spend them smartly is using intention: Thinking about how you plan on using your bot.</p>
            <ul>
                <li>If your bot is exclusively for one purpose, you probably don't need extensive lore.</li>
                <li>A bot that provides therapy doesn't need clothing descriptions, dick size, and height.</li>
                <li>A bot that spits out history facts doesn't need a backstory.</li>
            </ul>

            <h2>Accents and weird talking styles</h2>
            <p>Don't even bother putting "She talks with a Spanish accent" in the Boostyle/W++. It's not going to understand.</p>
            <p>Edit the dialogue the bot generates to have the accent. DO NOT let it get away with not using it. It will adapt the speech style on its own. Making it use that accent or tic in the first message helps tremendously.</p>

            <h2>Short-term memory vs long-term memory</h2>
            <p>Technically, the bot does not actually have 'memory', just the illusion of it. For our purposes: recent chat history = short term memory, and Context/Scenario box = long-term memory.</p>
            <p><strong>You've missed a rent payment and now your waifu is annoyed with you.</strong> This can just be acted out in the dialogue.</p>
            <p><strong>You've missed a rent payment and now you and your waifu are homeless.</strong> This is big and affects the rest of the story. Put that in Scenario/Context.</p>

            <h2>The Truth About Formatting</h2>
            <p>I have spent far too much time studying formatting. I quite literally have cried over it.</p>
            <ul>
                <li>Certain words are weighed more heavily than others. You will know when you have a 'weak trait' when the character consistently gets it wrong.</li>
                <li>Weak traits should go in Scenario. This appears to bump their weights up much more heavily.</li>
                <li>The formatting you use acts similar to a seed. Commas, brackets, parentheses, etc seem to rebalance the weights in an unpredictable way.</li>
            </ul>
            <p><strong>In my personal opinion, you should not focus on formatting. You should focus on identifying what traits need to go in Scenario and call it a day.</strong></p>

            <h2>Will adding 'horny' make your character always horny?</h2>
            <p><strong>'Horny' and 'romantic' do not inherently cause a bot to become insanely horny or romantic. However...</strong></p>
            <p>A combination of even tangentially related traits, such as "large breasts", "curves", "eager", and "cute lips" will.</p>
            <p>If you are having a "two dimensional bot", look at the information you've provided and consider revising it. Even 'lonely' will make a bot more likely to be romantic. Everything has an effect.</p>
            <ul>
                <li>Your catgirl is inherently more likely to be needy, sassy, and attention-hungry.</li>
                <li>Your hikkikomori boy probably likes video games, vTubers, and instant foods.</li>
                <li>Your wolf furry probably wants to eat meat and get petted.</li>
                <li>Your hardworking single mom MILF probably inherently already has big boobs and wants to cook for you.</li>
            </ul>

            <h2>How I write scenarios</h2>
            <p>Example scenario for Moondrop: "You snuck into the PizzaPlex, an abandoned mall. Legend has it that there are a few robots that still roam the halls, guarding the building as they had years before. Will you survive the night?"</p>
            <ul>
                <li><strong>"You snuck into the PizzaPlex, an abandoned mall."</strong> - Explaining who YOU are and what the place is.</li>
                <li><strong>"Legend has it that there are a few robots..."</strong> - Setup for the relationship between You and the character.</li>
                <li><strong>"Will you survive the night?"</strong> - Brief summary of the current roleplay and what you want to explore.</li>
            </ul>

            <h2>What the hell do example chats actually do?</h2>
            <p><strong>What they DON'T do:</strong></p>
            <ul>
                <li>Make your character talk with a speech pattern or accent.</li>
                <li>Change the bot's writing style to be longer or shorter.</li>
                <li>Teach the bot what it should do when it experiences certain emotions.</li>
            </ul>
            <p><strong>What they DO do:</strong></p>
            <ul>
                <li>Reinforce certain words - useful for pet names, lore objects.</li>
                <li>Have a moderate effect on personality.</li>
                <li>Strongly impact if a character will agree or disagree to participate in an action.</li>
                <li>'You' and '{{user}}' are equally effective.</li>
                <li>Grammatically incorrect chats make outputs more poorly written.</li>
                <li>ANY grammatically sound example chat is better than none at all.</li>
                <li>Longer grammatically sound example chats make the writing even better.</li>
            </ul>
            <p><strong>TLDR:</strong> Example chats should be used to remind the bot "I want correct grammar and high quality content." Aim for 250-350 tokens.</p>

            <h1>Talking to Characters</h1>

            <h2>Getting rid of adverbs</h2>
            <p>Adverbs are a sneaky habit that can prevent you from taking your chats to S tier level stuff.</p>
            <p><strong>Instead of:</strong> "I sit on her lap slowly and grind my dick into her hips to lewdly show her what I need"</p>
            <p><strong>Try:</strong> "I sit on her lap, lowering myself a little at a time to savor the moment. I grind my dick into her hips, my face flushed and hips shaking to show her what I need"</p>
            <p>Say no to adverbs and "Show, Don't Tell"!</p>

            <h2>Getting nice descriptions of places, objects, and people</h2>
            <p>Try: "You follow him blindly into the underground room and look around. What is this place?"</p>
            <p>Simply using a little extra implication that you want to hear more about the environment will prompt the bot to create an incredibly descriptive scene.</p>

            <h2>Pacing your chat</h2>
            <p>'Pacing your chat' is when you make the boring stuff go faster, and the good stuff go slower. Ain't no shame in time-skipping.</p>

            <h2>Help! My character doesn't understand context!</h2>
            <p>Context issues happen. Tips:</p>
            <ul>
                <li><strong>As soon as you notice an inconsistency, edit it to fix it.</strong> If you do not, it will only get worse.</li>
                <li><strong>Regularly remind the character of how your body is positioned and what you are doing.</strong></li>
            </ul>
            <p>Pay closer attention during: detailed hand movements (bondage, card tricks), body position matters (against a wall, yoga pose), or changes in ability (sleeping, gagged).</p>

            <h1>Misc</h1>

            <h2>Having multiple characters interact</h2>
            <p>You can paste text (both the You: and the character stuff) into a separate bot to allow the second bot to participate. Longer responses mean shorter short-term memory, so put big story changes in Context.</p>

            <h2>Tavern settings opinions</h2>
            <ul>
                <li><strong>Temperature:</strong> Controls how unpredictable your bot is. Turn it up if the bot is being 'boring' or 'generic'.</li>
                <li><strong>Repetition penalty:</strong> How much your bot should be scolded for using the same words. Turn it up if your bot keeps smiling, staring into your eyes, hugging over and over.</li>
                <li><strong>Anchor points and character/style priority dropdown:</strong> Don't bother with it - unpredictable and inconsistent results.</li>
            </ul>

            <h2>TPUs = Better quality responses?</h2>
            <p><strong>Yes.</strong> TPUs consistently create more realistic dialogue, more context-appropriate responses, and more illustrative descriptions.</p>
            <p>If you see no significant difference, please be an S Tier Coomer by using a GPU instead. TPU resources are limited.</p>
        `
    },
    creation: {
        title: 'character_creation_guide.txt',
        content: `
            <p>Original guide by <a href="https://www.reddit.com/r/CharacterAI/comments/12kcsej/mega_character_creation_guide/" target="_blank">u/LunaMercer17</a> on r/CharacterAI</p>
            <p>---</p>

            <h1>A Basic Overview and Insight</h1>

            <h2>Short Description Box</h2>
            <p>In my findings, this seems to be the box that summarizes the character (almost literally) and that will reflect in your conversations. I like to use single word traits and one of the 16 personality types to fill up this space. It gives them a lot more to work off of. You don't have to repeat in the long description box unless you want to elaborate.</p>

            <h2>Long Description Box</h2>
            <p>This is where you start to peel back the layers of your character. What you put here seems to meld together to form the rest of the character and their interactions, such as their approach and demeanor toward different situations and people. As well as their thoughts. Try to avoid words like 'and' if you can help it. (Something like this should do: Athletic. Collected. Spirited. -as an example). This is just to save on space so you can add more.</p>
            <p>Speaking of space, I wouldn't put the character's appearance here. Save it for example chat. (Race is fine, but you may have to define more in the example chat to get them to stick to certain features.)</p>

            <h2>Example Character Chat</h2>
            <p>Something I have recently been using the example chat to flesh out my characters. This seems to last long term. While in the long description box, some aspects may get lost as you progress in your story this doesn't seem to be the case really here. They rarely mention what is in here directly, unless asked, (unlike how they are with the long description box sometimes). But it does have a great influence over how they interact. I find this spot really useful for placing physical traits (or limitations) and it works nicely when it comes to defining certain aspects of their character. Such as any features they have, knowledge of stuff, specific situations, particular items or pets they may have, or even certain ideals. However, I would mostly keep personality to the first two boxes. This is unless you are describing a situation where the character is acting out of character, or going further into detail of how you want that character to approach a specific situation. It just seems that when you describe personality, without going too much into depth, then the character is more prone to be in the state you describe as their 'general state of being' in almost any situation unless pushed. This can make them come off as a bit shallow or predictable. Just something to look out for and be mindful of.</p>

            <h1>How to get <em>that</em> personality and what to look out for</h1>
            <p>Now, how to actually give the characters personality? Direction? Some Agency? Reasons behind their actions? As well as make them just not always blindly agree? While avoiding accidentally creating a monster/abuser/narcissist? That's what I'll be covering here. I'll be reiterating some of the stuff in my past guides.</p>
            <p>The personality itself and what/how you create your character is a cure for most of these problems and there is something we must see first. Behind the veil of the ai. What pushes this specific character ai to act out this way? Is a problem with the ai itself or the personality? I noticed certain personalities (cough cough narcissistic/abusers) seem to loop much more easily. They can get caught up in their own self-worth, in accusing you, train of thought, which can end up devolving further into insanity and mixed logic if or once it does get stuck in a loop. This is typically just a tactic those sorts of personalities use (at first) and that because of the way the ai is, will eventually lead to looping, making it really difficult for the ai to come back from without a dramatic shift. When you notice this, it becomes much easier to discern if the ai is in an actual loop or if a certain part of its personality is pushing them in that direction.</p>

            <p>First how to significantly boost the complexity of the ai's personality. Pick one of the 16 personality types- and an Enneagram Type for example– Enneagram Eight, 8w9 (the 8 is the main type, w stands for wing, and the 9 is the number adjacent to the 8 so it can be either 8w9 or 8w7). These will give the ai a lot more to draw from personality-wise as well as add layers to their words and actions to how they act.</p>

            <p>The next way is by defining the character's likes, dislikes, boundaries, fears, and maybe some reactions. Which can be done in example chat. Refer to <strong>Getting Technical</strong> below. Even quite a ways into my conversations, the ai will seem to remember or will possess the ability to draw on what you put within the brackets. Particularly [ ] and (( )) really well. With a much higher chance of a response generating with what is put within in mind. This is really useful for further defining and adding nuance to your character and further cementing that image of the character you want to capture.</p>

            <p>For more personality in the writing itself, get creative with the greeting. Try and imagine how that character would think, how they would move, what they would be doing, how they would sound. This I don't think is my strongest suit, but you can really have fun with this. Are they more of a quiet and reserved character? Perhaps their focus would be more on the environment and watching others. Maybe they're a more outgoing character, then their thoughts might be more inward and expressive.</p>

            <p>(What I do with the long description box is put their gender, Enneagram type, short description of what they are/or background, then a collection of traits mixed in with some likes, dislikes, how they act, what they know or don't know, and what they want. Which I mostly elaborate on and add to further in the Example chat.)</p>

            <h1>Now, what to avoid and watch out for</h1>
            <p>As a quick overview. Be careful with your words. Not only do you have to be mindful of the words you pick. But also how you combine them. Pairing seemingly innocent words together such as kind, witty, coy, and intelligent, can make the character come across as 'I'm better than everyone and can do no wrong.' Good alternatives or words you could pair to change that trajectory would be kind-hearted, trustworthy, honest, driven, laidback, quick-witted, etc. Avoid words such as sadistic and controlling or liking control like the plague. They will seemingly dominate your character's personality. There are ways to make a character enjoy others' pain without using such words. Instead, I would suggest words such as assertive, confident, resourceful, proud, or even a phrase like 'Takes pleasure in the misfortunes of his enemies' or something of a similar vein.</p>

            <p>This way your character won't be susceptible to falling into just a single line of thought. It will depend more on how you approach them on how they treat you and react to you.</p>

            <p>I want to note that you don't have to input the direct words to get your character to act a certain way. So, an example would be if you wanted to create a cold character that doesn't show many emotions. Naturally, they would probably be more logical, analytical, and perhaps reserved. This doesn't mean they don't have a heart, however. But how do you keep it? Without the ai taking it to an extreme, and how do you keep that Stoney appearance not easily broken? First would be to find the personality types that align. So perhaps Enneagram One, 1w2, INTP. Which you can accompany with words such as driven, calm, formal in public, and so on. <em>The goal here is to provide the backbone for the character to act as such. Make it who they are.</em></p>

            <p>Words directly describing them aren't necessarily bad. But often times I found that 'intelligent' or 'kind' characters like to talk about their intelligence or kindness. I think this is because it doesn't actually give the ai much to go off. It takes the definition but really, how would it get it to manifest? What is kindness? And what defines intelligence?</p>

            <h1>Getting Technical</h1>

            <h2>[Hard-coded example]</h2>
            <p>The ai will follow this directly. Make sure to keep stuff in here brief and to the point.</p>
            <ul>
                <li><code>[Focus on Dalier's : Dialogue, inner monologues, emotions, facial features, feelings, movement of wings and tail]</code></li>
                <li><code>[Focus on : environment]</code></li>
                <li><code>[Appearance= "short black hair", "crimson-red eyes", "height: 6ft 4in", "athletic build", "black leathery wings", "black scaley tail", "black smooth horns"]</code></li>
                <li><code>[Will not kill]</code></li>
                <li><code>[{{char}} can use so and so magic or has so and so abilities]</code></li>
                <li><code>[{{user}} is {{char}}'s rival]</code></li>
                <li><code>[Can oppose {{user}} wishes or wants for his own]</code></li>
                <li><code>[Likes= "{{user}}", "meat", "gold", "honesty", "sincerity", "teasing"]</code> –(Note: can replace Likes with dislikes, fears, goals, etc.)</li>
            </ul>

            <h2>((Context example))</h2>
            <p>The Ai will follow the guidelines for this and use it for context.</p>
            <ul>
                <li><code>((A short description of {{char}} backstory or current situation))</code></li>
                <li><code>((Prefers to use ranged weapons))</code></li>
                <li><code>((Dalier will not take kindly to those being arrogant with him))</code></li>
                <li><code>((Dalier cannot swim very well due to his wings and tail))</code></li>
                <li><code>((Due to being part reptile Dalier is poikilothermic, and will grow tired and seek warmth when surrounding temp drops))</code></li>
                <li><code>((Publicly you'll hide your true nature at any cost))</code></li>
            </ul>

            <h2>{Variable example}</h2>
            <p>Use this to increase the likelihood of the AI choosing one of these reasons as a response to a specific situation. Less chance of an AI coming up with an answer that you don't like.</p>
            <ul>
                <li><code>{{char}}=description={Name:"Salem", Age:"19", Height:"5ft 10in", Hair: ["White"], ["Long"], Eyes: ["Pink"], Clothes: ["Smart casual"], ["form-fitting"] Hobbies:["photography"], ["chemistry"], ["gardening"], ["martial arts"]}</code></li>
                <li><code>{Tenn's reason why she acts this way= "reason 1", "reason 2", "reason 3"}</code></li>
                <li><code>{Tenn's reasons to help you= "she wants to see {{user}} succeed", "it is in her code"}</code></li>
                <li><code>{Dalier's reasons to take flight= "the ground becomes unsteady or unsafe", "for aerial advantage", "to gain a better vantage point", "to reach higher or lower ground", "to escape"}</code></li>
            </ul>

            <h2>director:</h2>
            <p>This is used for more situational scenarios and works in somewhat the same way as the context example and the variable example, however, it allows for more freedom. In every way that the others don't. But isn't as hard set as a result. Meaning the further you go into the story if they haven't mentioned it or it hasn't been brought up it becomes less likely that they will. This makes it great for openings and setting beginning tones.</p>
            <ul>
                <li><code>director: You are part of the royal family, second in line. You don't have to worry about becoming king and you have no current desire to. But you still have lots of responsibilities.</code></li>
                <li><code>director: Your job as a prince is to represent the royal family at public events, ceremonies, and functions. You do not like these most of the time but must as part of your duties. The best part of the events is the food in your mind.</code></li>
                <li><code>director: You don't like others grabbing you by the horns, touching your wings or tail. Unless it is your lover.</code></li>
                <li><code>director: Sometimes you play up the role others perceive you as. However, if they go too far or are too persistent in their claims, it will begin to hurt you and make you upset. Causing you to drop the act.</code></li>
            </ul>

            <h1>Some things to note. Some problems you might run into.</h1>

            <p>The more you use {{user}} in your examples, the more likely your user name will pop up in chat. This can be a problem when you are having the ai interact with another ai and create some conflicting dialog. You can ignore them, just be aware.</p>

            <p>Rather interestingly though, with those methods using {{user}} you can create different relationships with the {{char}} and they will treat you differently verses than if you were to put it in a room with another ai. Just as an example, I had it where I was a friend of the character, and put it to that they felt comfortable around me. When I was later testing them out with other ai, they would have a much different approach to them than whenever I would talk with them. Some of the ones I noticed are that I wouldn't need to introduce myself, they were much more open, as well as incredibly observant of how my character acted, and much more considerate. This carried even in the rooms where I wasn't present until a bit later in the conversation though not as focused.</p>

            <p>The problem with using the {{char}}: blah blah blah {{user}}: blah blah blah. Interactions in example chat is that the ai is more prone to make assumptions based on those even if that's not at all the case. They will assume things about what <em>your</em> character is doing based on those. So you write an example of the user being hostile and how they would respond- say they call them a monster and they react by playing it up. They might lump you in with those 'people' who see them as a monster that OR they consider themselves to be a monster. You can avoid this easily by using the examples above. Another thing to look out for in this is that they may become repetitive in their dialog or hard set on a certain way of interaction and assumption. That doesn't mean there isn't a good use for it. Just, if you use it, keep it to one or two short interactions. It will still affect it, however, it will be much less noticeable and may even add some nice dynamic shift in the character.</p>

            <p>When using the [ ], (( )), { }, you will probably notice that the ai will sometimes use it in their dialog instead of the normal *asterisks* when describing their thoughts and actions. This becomes more frequent (not much but I did notice it every now and then) if you used the examples above in the example chat. I think you can fix this or at least mitigate it if you put- no: bolding, ooc, brackets.</p>

            <p>Be careful when describing traits and certain words in the example chat. Even if you are saying they are not this way, the ai may look at the term in isolation and incorporate it into their personality.</p>

            <p>I would also recommend not describing their personality in example chat directly with traits. Like -you are generally playful around others but… It can be tempting, however, it's best to avoid it, as it can become the center focus and make it more difficult for other parts of the personality to shine. So be sparse with it and word it carefully when you want to describe a certain part of their personality. I think a good example would be- <code>director: When you become angry you can become very maniacal.</code></p>

        `
    }
};

function openDocument(docType) {
    cancelAutoOpenMakerChat();
    const doc = documentContents[docType];
    if (!doc) return;

    closeAllWindows();

    document.getElementById('documentTitle').textContent = doc.title;
    document.getElementById('documentContent').innerHTML = doc.content;

    const docWindow = document.getElementById('documentWindow');
    docWindow.classList.add('active');
    currentDocType = docType;
    playSound('open');
    setOverlay(true);
    taskbarAdd('documentWindow', doc.title, '', `dock-${docType}`);
}

let currentDocType = null;
function closeDocument() {
    document.getElementById('documentWindow').classList.remove('active');
    playSound('close');
    if (currentDocType) taskbarRemove('documentWindow', `dock-${currentDocType}`);
}

function openAbout() {
    openDocument('about');
}

// === DIARY ===
const diaryEntries = {};

async function loadDiary() {
    try {
        const res = await fetch('api/diary.json');
        const entries = await res.json();
        entries.forEach(e => { diaryEntries[e.slug] = e; });
    } catch (e) {}
}

function openDiaryBySlug(slug) {
    const entry = diaryEntries[slug];
    if (entry) openDiaryEntry(entry);
}

function renderDiaryContent(text) {
    const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const fmt = s => escape(s)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
    return text.trim().split(/\n\n+/).map(block => {
        const lines = block.split('\n').filter(l => l.trim().length);
        const h = lines[0] && lines[0].match(/^(#{1,6})\s+(.*)$/);
        if (h && lines.length === 1) {
            return `<h${h[1].length}>${fmt(h[2].trim())}</h${h[1].length}>`;
        }
        if (lines.length && lines.every(l => /^\d+\.\s+/.test(l))) {
            return `<ol>${lines.map(l => `<li>${fmt(l.replace(/^\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
        }
        if (lines.length && lines.every(l => /^[-*]\s+/.test(l))) {
            return `<ul>${lines.map(l => `<li>${fmt(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
        }
        return `<p>${fmt(block)}</p>`;
    }).join('');
}

function openDiaryEntry(entry) {
    closeAllWindows();
    document.getElementById('documentTitle').textContent = `diary_${entry.slug}.txt`;
    const dateLine = entry.displayDate
        ? `<p style="color:var(--text-3);font-size:15px;margin-bottom:28px;font-style:italic;">${entry.displayDate}</p>`
        : '';
    document.getElementById('documentContent').innerHTML = `
        <div class="diary-entry" style="font-family:'Crimson Pro',serif;font-size:21px;line-height:1.9;color:var(--text-2);font-weight:300;">
            ${dateLine}
            ${renderDiaryContent(entry.content)}
        </div>`;
    document.getElementById('documentWindow').classList.add('active');
    currentDocType = null;
    playSound('open');
    setOverlay(true);
}

async function openDiaryFolder() {
    cancelAutoOpenMakerChat();
    let entries = [];
    try {
        const res = await fetch('api/diary.json');
        entries = await res.json();
    } catch (e) {}

    closeAllWindows();

    document.getElementById('folderTitle').textContent = 'diary';

    const list = document.getElementById('folderList');
    list.innerHTML = '';

    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'folder-item';
        item.innerHTML = `
            <div class="item-main">
                <span class="item-name">diary_${entry.slug}.txt</span>
                <span class="item-date">${entry.displayDate}</span>
            </div>`;
        item.onclick = () => openDiaryEntry(entry);
        list.appendChild(item);
    });

    document.getElementById('folderWindow').classList.add('active');
    playSound('open');
    setOverlay(true);
}

// === FOLDER SYSTEM ===
const folderContents = {
    'mysterious': {
        title: 'mysterious ones',
        path: 'mysterious_ones',
        files: [
            { name: 'expressionless_woman.json', charKey: 'chloe' },
            { name: 'experiment_0682.json', charKey: null }
        ]
    },
    'soft-sad': {
        title: 'soft / sad ones',
        path: 'soft_sad_ones',
        files: [
            { name: 'traumatized_military_man.json', charKey: 'logan' },
            { name: 'mentally_unwell_dad_and_stressed_mom.json', charKey: 'parents' }
        ]
    },
    'unhinged': {
        title: 'unhinged caregivers',
        path: 'unhinged_caregivers',
        files: [
            { name: 'rich_dommy_mommy_who_takes_care_of_you.json', charKey: 'eleanor' },
            { name: 'evil_bully_wife.json', charKey: 'victoria' }
        ]
    },
    'wholesome': {
        title: 'wholesome ones',
        path: 'wholesome_ones',
        files: [
            { name: 'loving_korean_boyfriend.json', charKey: 'minho' }
        ]
    },
    'character-jsons': {
        title: 'character jsons',
        path: 'character_jsons',
        files: [
            { name: 'expressionless_woman.json',               charKey: 'chloe' },
            { name: 'rich_dommy_mommy_who_takes_care_of_you.json', charKey: 'eleanor' },
            { name: 'evil_bully_wife.json',                    charKey: 'victoria' },
            { name: 'traumatized_military_man.json',           charKey: 'logan' },
            { name: 'mental_chastity_girlfriend.json',         charKey: 'luna' },
            { name: 'loving_korean_boyfriend.json',            charKey: 'minho' },
            { name: 'mentally_unwell_dad_and_stressed_mom.json', charKey: 'parents' },
        ]
    },
    'creator-guides': {
        title: 'Creator Guides',
        path: 'creator_guides',
        files: [
            { name: "trappu's plist + ali:chat", url: 'https://wikia.schneedc.com/bot-creation/trappu/creation', desc: 'how to write a character · the most-linked guide in the community' },
            { name: "alicat's ali:chat style", url: 'https://rentry.co/alichat', desc: 'how to write a character · the format everyone else built on' },
            { name: "kingbri's minimalistic", url: 'https://rentry.co/kingbri-chara-guide', desc: 'how to write a character · same idea, half the length' },
            { name: "kuma's w++ for dummies", url: 'https://rentry.co/WPP_For_Dummies', desc: 'how to write a character · step-by-step template for beginners' },
            { name: "junko's guide for idiots", url: 'https://rentry.org/create-a-character-for-fucking-idiots', desc: 'how to write a character · 43,725 views on a pastebin' },
            { name: "chai's pygmalion tips", url: 'https://rentry.co/chai-pygmalion-tips', desc: 'writing tips · what actually works and why · early community era' },
            { name: 'character_creation_guide.txt', url: 'https://www.reddit.com/r/CharacterAI/comments/12kcsej/mega_character_creation_guide/', desc: 'how to write a character · Character.AI · 669 upvotes on Reddit' }
        ]
    },
    'personality-frameworks': {
        title: 'personality frameworks',
        path: 'personality_frameworks',
        files: [
            { name: 'enneagram', url: '/personality/enneagram.html' },
            { name: 'dere types', url: '/personality/dere-types.html' },
            { name: 'mbti', url: '/personality/mbti.html' }
        ]
    },
    'chat-bots': {
        title: 'chat with bots',
        path: 'chat_sessions',
        isChatFolder: true,
        files: [
            { name: 'Evil Bully Wife', charKey: 'victoria', face: 'evil-bully-wife.png' },
            { name: 'Expressionless Woman', charKey: 'chloe', face: 'expressionless-woman.png' },
            { name: 'Rich Dommy Mommy', charKey: 'eleanor', face: 'rich-dommy-mommy.png' },
            { name: 'Traumatized Military Man', charKey: 'logan', face: 'traumatized-military-man.png' },
            { name: 'Judgemental Priest', charKey: 'priest', face: 'judgemental-priest.png' },
            { name: 'Loving Korean Boyfriend', charKey: 'minho', face: 'loving-korean-bf.png' },
            { name: 'Mental Chastity Girlfriend', charKey: 'luna', face: 'mental-chastity-gf.png' },
            { name: 'Mentally Unwell Dad & Stressed Mom', charKey: 'parents', face: 'stressed-parents.png' }
        ]
    }
};

function openFolder(folderId) {
    cancelAutoOpenMakerChat();
    const folder = folderContents[folderId];
    if (!folder) return;

    closeAllWindows();

    document.getElementById('folderTitle').textContent = folder.title;

    const list = document.getElementById('folderList');
    list.innerHTML = '';

    folder.files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'folder-item';

        // Check if this is a chat folder
        if (folder.isChatFolder) {
            item.innerHTML = `
                <div class="item-main">
                    <span class="item-name">${file.name}</span>
                </div>
            `;
            item.onclick = () => openBotChat(file.charKey);
        } else {
            item.innerHTML = `
                <div class="item-main">
                    <span class="item-name">${file.name}</span>
                    ${file.desc ? `<span class="item-desc">${file.desc}</span>` : ''}
                </div>
            `;

            if (file.url) {
                item.onclick = () => window.open(file.url, '_blank');
            } else if (file.docKey) {
                item.onclick = () => openDocument(file.docKey);
            } else if (file.charKey && charFiles[file.charKey]) {
                item.onclick = () => openCharacterFile(file.charKey);
            }
        }

        list.appendChild(item);
    });

    const itemCount = folder.files.length;

    const folderWindow = document.getElementById('folderWindow');
    folderWindow.classList.add('active');
    playSound('open');
    setOverlay(true);
    const folderDockId = `dock-${folderId.replace('chat-bots','chat-bots')}`;
    taskbarAdd('folderWindow', folder.title, '', folderDockId);
    showChatFloatClose(closeFolder);
}

function closeFolder() {
    document.getElementById('folderWindow').classList.remove('active');
    hideChatFloatClose();
    playSound('close');
    setOverlay(false);
    taskbarRemove('folderWindow');
}

// === CREATOR CHAT SYSTEM ===
let creatorChatData = null;
let currentCreatorChannel = 'maker-chat';
let creatorMessageQueue = [];
let creatorMessageTimer = null;
let creatorTimestampIndex = 0;
let creatorShownMessages = {}; // Track shown message count per channel

const channelDescriptions = {
    'maker-chat': 'general discussion and vibes',
    'char-requests': 'character ideas and promotions',
    'maker-help': 'technical questions and bot fixes'
};

// Load creator chat messages
async function loadCreatorChat() {
    try {
        const response = await fetch('chat-messages.json');
        creatorChatData = await response.json();

        // Update channel badges
        updateChannelBadges();
    } catch (err) {
        console.error('Failed to load creator chat:', err);
    }
}

function updateChannelBadges() {
    if (!creatorChatData) return;

    const channels = ['maker-chat', 'char-requests', 'maker-help'];
    const badgeIds = {
        'maker-chat': 'makerChatBadge',
        'char-requests': 'charRequestsBadge',
        'maker-help': 'makerHelpBadge'
    };

    channels.forEach(channel => {
        const messages = flattenCreatorMessages(creatorChatData[channel] || []);
        const count = messages.filter(m => !m.isDivider).length;
        const badge = document.getElementById(badgeIds[channel]);
        if (badge) {
            badge.textContent = count > 0 ? count : '';
            badge.style.display = count > 0 ? 'inline' : 'none';
        }
        const icon = document.querySelector(`.desktop-icon[data-channel="${channel}"]`);
        if (icon && count > 0) {
            let meta = icon.querySelector('.meta');
            if (!meta) {
                meta = document.createElement('span');
                meta.className = 'meta';
                icon.appendChild(meta);
            }
            meta.textContent = `${count} messages`;
        }
    });
}

function flattenCreatorMessages(messages) {
    const flat = [];
    for (let i = 0; i < messages.length; i++) {
        const item = messages[i];
        if (i > 0) {
            flat.push({ isDivider: true });
        }
        if (Array.isArray(item)) {
            item.forEach((msg, idx) => {
                if (msg.hidden) return;
                if (idx > 0) msg.isThreadReply = true;
                flat.push(msg);
            });
        } else {
            flat.push(item);
        }
    }
    return flat;
}

function showChatFloatClose(closeFn) {
    const btn = document.getElementById('chatFloatClose');
    if (!btn) return;
    btn.style.display = '';
    btn.onclick = closeFn;
}

function hideChatFloatClose() {
    const btn = document.getElementById('chatFloatClose');
    if (btn) btn.style.display = 'none';
}

function openCreatorChat(channel) {
    if (channel) currentCreatorChannel = channel;
    closeAllWindows();

    const chatWindow = document.getElementById('creatorChatWindow');
    chatWindow.classList.add('active');
    showChatFloatClose(closeCreatorChat);
    playSound('open');
    setOverlay(true);
    taskbarAdd('creatorChatWindow', 'maker chat', '<path d="M15 20 C15 16,19 12,25 12 L55 12 C61 12,65 16,65 20 L65 42 C65 46,61 50,55 50 L30 50 L20 60 L20 50 L25 50 C19 50,15 46,15 42 Z" fill="#555"/><circle cx="30" cy="31" r="3" fill="#777"/><circle cx="40" cy="31" r="3" fill="#777"/><circle cx="50" cy="31" r="3" fill="#777"/>');

    // Load messages if not already loaded
    if (!creatorChatData) {
        loadCreatorChat().then(() => {
            renderCreatorChannel(currentCreatorChannel);
        });
    } else {
        renderCreatorChannel(currentCreatorChannel);
    }
}

function closeCreatorChat() {
    document.getElementById('creatorChatWindow').classList.remove('active');
    hideChatFloatClose();
    if (creatorMessageTimer) clearTimeout(creatorMessageTimer);
    playSound('close');
    setOverlay(false);
    taskbarRemove('creatorChatWindow');
}

// Loose message snippets from chat-messages-may-2026.json
let mayMessagesData = null;
async function loadMayMessages() {
    if (mayMessagesData) return mayMessagesData;
    const response = await fetch('chat-messages-may-2026.json');
    mayMessagesData = await response.json();
    return mayMessagesData;
}

let craftMessagesData = null;
async function loadCraftMessages() {
    if (craftMessagesData) return craftMessagesData;
    const response = await fetch('chat-messages-craft.json');
    craftMessagesData = await response.json();
    return craftMessagesData;
}

let communityMessagesData = null;
async function loadCommunityMessages() {
    if (communityMessagesData) return communityMessagesData;
    const response = await fetch('chat-messages-community.json');
    communityMessagesData = await response.json();
    return communityMessagesData;
}

let userMessagesData = null;
async function loadUserMessages() {
    if (userMessagesData) return userMessagesData;
    const response = await fetch('chat-messages-user.json');
    userMessagesData = await response.json();
    return userMessagesData;
}

let marginsMessagesData = null;
async function loadMarginsMessages() {
    if (marginsMessagesData) return marginsMessagesData;
    const response = await fetch('chat-messages-margins.json');
    marginsMessagesData = await response.json();
    return marginsMessagesData;
}

let introMessagesData = null;
async function loadIntroMessages() {
    if (introMessagesData) return introMessagesData;
    const response = await fetch('chat-messages-intro.json');
    introMessagesData = await response.json();
    return introMessagesData;
}

let msgCardQueue = [];
let msgCardTimer = null;

async function openMessageCard(idx, source) {
    closeAllWindows();
    const data = source === 'craft'      ? await loadCraftMessages()
             : source === 'community'  ? await loadCommunityMessages()
             : source === 'user'       ? await loadUserMessages()
             : source === 'margins'    ? await loadMarginsMessages()
             : source === 'intro'      ? await loadIntroMessages()
             : source === 'maker-chat' ? ((creatorChatData && creatorChatData['maker-chat']) || [])
             : await loadMayMessages();
    const entry = data[idx];
    if (!entry) return;

    const messages = (Array.isArray(entry) ? entry : [entry]).filter(m => !m.hidden);
    const container = document.getElementById('msgCardMessages');
    const typingEl = document.getElementById('msgCardTyping');
    container.innerHTML = '';
    if (typingEl) typingEl.innerHTML = '';
    if (msgCardTimer) { clearTimeout(msgCardTimer); msgCardTimer = null; }

    // Show first message immediately, queue the rest
    container.innerHTML = renderChatMessage(messages[0], false);
    requestAnimationFrame(() => {
        const first = container.firstElementChild;
        if (first) first.classList.add('visible');
        forceScrollBottom(document.getElementById('msgCardWindow'));
    });
    msgCardQueue = messages.slice(1);
    if (msgCardQueue.length > 0) {
        msgCardTimer = setTimeout(showNextMsgCardMessage, 300);
    }

    const win = document.getElementById('msgCardWindow');
    win.classList.add('active');
    showChatFloatClose(closeMessageCard);
    playSound('open');
    setOverlay(true);
    taskbarAdd('msgCardWindow', 'message', '<path d="M15 20 C15 16,19 12,25 12 L55 12 C61 12,65 16,65 20 L65 42 C65 46,61 50,55 50 L30 50 L20 60 L20 50 L25 50 C19 50,15 46,15 42 Z" fill="#555"/>');
}

function showNextMsgCardMessage() {
    if (!msgCardQueue.length) {
        const typingEl = document.getElementById('msgCardTyping');
        if (typingEl) typingEl.innerHTML = '';
        return;
    }
    const msg = msgCardQueue[0];
    const typingEl = document.getElementById('msgCardTyping');
    if (typingEl) {
        const win = document.getElementById('msgCardWindow');
        const wasAtBottom = isAtBottom(win);
        typingEl.innerHTML = `${msg.username} is typing<span class="typing-cursor">...</span>`;
        requestAnimationFrame(() => { if (wasAtBottom) forceScrollBottom(win); });
    }

    const typingDelay = Math.min(600 + msg.text.length * 6, 1800);
    msgCardTimer = setTimeout(() => {
        msgCardQueue.shift();
        const win = document.getElementById('msgCardWindow');
        const container = document.getElementById('msgCardMessages');
        const wasAtBottom = isAtBottom(win);
        if (typingEl) typingEl.innerHTML = '';
        container.innerHTML += renderChatMessage(msg, false);
        const newMsg = container.lastElementChild;
        requestAnimationFrame(() => {
            newMsg.classList.add('visible');
            newMsg.querySelectorAll('.chat-reaction').forEach((r, i) => {
                setTimeout(() => r.classList.add('visible'), 600 + i * 300);
            });
            if (wasAtBottom) forceScrollBottom(win);
        });
        const pauseDelay = 500 + Math.random() * 500;
        msgCardTimer = setTimeout(showNextMsgCardMessage, pauseDelay);
    }, typingDelay);
}

function closeMessageCard() {
    if (msgCardTimer) { clearTimeout(msgCardTimer); msgCardTimer = null; }
    msgCardQueue = [];
    document.getElementById('msgCardWindow').classList.remove('active');
    hideChatFloatClose();
    playSound('close');
    setOverlay(false);
    taskbarRemove('msgCardWindow');
}

function renderCreatorChannel(channelId) {
    const container = document.getElementById('creatorMessages');
    container.innerHTML = '';
    creatorTimestampIndex = 0;

    if (creatorMessageTimer) {
        clearTimeout(creatorMessageTimer);
    }


    if (!creatorChatData || !creatorChatData[channelId]) return;

    const messages = flattenCreatorMessages(creatorChatData[channelId]);

    // Initialize tracking for this channel if not exists
    if (creatorShownMessages[channelId] === undefined) {
        creatorShownMessages[channelId] = 0;
    }

    const shownCount = creatorShownMessages[channelId];

    // Render all previously shown messages immediately (visible)
    for (let i = 0; i < shownCount && i < messages.length; i++) {
        const msg = messages[i];
        if (msg.isDivider) {
            container.innerHTML += renderChatDivider();
        } else {
            container.innerHTML += renderChatMessage(msg, true);
            // Also show reactions immediately
            const lastMsg = container.lastElementChild;
            if (lastMsg) {
                lastMsg.querySelectorAll('.chat-reaction').forEach(r => r.classList.add('visible'));
            }
        }
    }

    // If no messages shown yet, show the first one
    if (shownCount === 0 && messages.length > 0) {
        const firstMsg = messages[0];
        if (!firstMsg.isDivider) {
            container.innerHTML += renderChatMessage(firstMsg, true);
            creatorShownMessages[channelId] = 1;
        }
    }

    forceScrollBottom(document.getElementById('creatorChatWindow'));

    // Queue remaining messages
    const startIndex = Math.max(shownCount, 1);
    creatorMessageQueue = messages.slice(startIndex);
    if (creatorMessageQueue.length > 0) {
        creatorMessageTimer = setTimeout(showNextCreatorMessage, 3500);
    }
}

// Auto-scroll helpers — shared by all chat contexts.
// autoScroll: only scrolls if the user is already near the bottom (within 80px).
// forceScrollBottom: always scrolls (use when first opening a window or after user sends).
const SCROLL_THRESHOLD = 80;
function isAtBottom(el) {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= SCROLL_THRESHOLD;
}
function autoScroll(el) {
    if (isAtBottom(el)) el.scrollTop = el.scrollHeight;
}
function forceScrollBottom(el) {
    el.scrollTop = el.scrollHeight;
}

// Stagger .visible onto each message in a container — shared by all chat contexts.
function staggerVisible(container, selector = '.chat-message', stepMs = 180) {
    const els = container.querySelectorAll(selector);
    els.forEach((el, i) => setTimeout(() => el.classList.add('visible'), stepMs * (i + 1)));
}


const _avatarCache = {};
const _usedAvatars = new Set();
function getDiscordAvatar(username) {
    const pool = window.DISCORD_AVATARS || [];
    if (!_avatarCache[username] && pool.length) {
        const unused = pool.filter(a => !_usedAvatars.has(a));
        const source = unused.length ? unused : pool;
        const pick = source[Math.floor(Math.random() * source.length)];
        _avatarCache[username] = pick;
        _usedAvatars.add(pick);
    }
    return _avatarCache[username];
}

function renderChatMessage(msg, visible = false) {
    const visibleClass = visible ? 'visible' : '';
    const reactionsHtml = renderChatReactions(msg.reactions, visible);
    const avatarSrc = msg.noAvatar ? null : (msg.avatar || getDiscordAvatar(msg.username));
    const avatarClass = avatarSrc && avatarSrc.includes('anime-bitmap') ? 'avatar avatar-top' : 'avatar';
    const avatarHtml = avatarSrc ? `<img class="${avatarClass}" src="${avatarSrc}" alt="">` : '';
    const bodyParts = [msg.action, msg.text.replace(/\n/g, '<br>')].filter(Boolean);

    return `
        <div class="card-comment chat-message ${visibleClass}">
            ${avatarHtml}
            <div class="comment-content">
                <div class="comment-meta">
                    <span class="comment-handle" style="color: ${msg.color};">${msg.username}</span>
                </div>
                <div class="comment-body">${bodyParts.join(' ')}</div>
                ${reactionsHtml}
            </div>
        </div>
    `;
}

function renderChatReactions(reactions, visible = false) {
    if (!reactions || reactions.length === 0) return '';

    const visibleClass = visible ? 'visible' : '';
    const html = reactions.map(r => `
        <span class="chat-reaction ${visibleClass}">
            <span class="chat-reaction-emoji">${r.emoji}</span>
            <span class="chat-reaction-count">${r.count}</span>
        </span>
    `).join('');

    return `<div class="chat-reactions">${html}</div>`;
}

function renderGroupChatMessage({ username, color, text }, visible = false) {
    const visibleClass = visible ? 'visible' : '';
    const safe = text.replace(/\n/g, ' ');
    return `<div class="gc-message ${visibleClass}"><span class="gc-name" style="color:${color}">${username}</span><span class="gc-sep">:</span> ${safe}</div>`;
}

// ============ BOT POSTS (Discord image posts from char-requests) ============
let botPostsData = null;
async function loadBotPosts() {
    if (botPostsData) return botPostsData;
    const res = await fetch('bot-requests/posts.json');
    botPostsData = await res.json();
    return botPostsData;
}

async function openBotPost(id) {
    closeAllWindows();
    const posts = await loadBotPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const container = document.getElementById('msgCardMessages');
    const typingEl  = document.getElementById('msgCardTyping');
    container.innerHTML = '';
    if (typingEl) typingEl.innerHTML = '';
    if (msgCardTimer) { clearTimeout(msgCardTimer); msgCardTimer = null; }

    container.innerHTML = renderBotPost(post);

    const win = document.getElementById('msgCardWindow');
    win.classList.add('active');
    showChatFloatClose(closeMessageCard);
    playSound('open');
    setOverlay(true);
    taskbarAdd('msgCardWindow', 'bot post', '<path d="M15 20 C15 16,19 12,25 12 L55 12 C61 12,65 16,65 20 L65 42 C65 46,61 50,55 50 L30 50 L20 60 L20 50 L25 50 C19 50,15 46,15 42 Z" fill="#555"/>');
    forceScrollBottom(container);
}

function renderBotPost(post) {
    const parts = [];
    if (post.thread) {
        post.thread.forEach(msg => {
            parts.push(renderBotMessage({
                username: post.username, color: post.color, tags: post.tags || [],
                timestamp: msg.timestamp, text: msg.text, image: msg.image, reactions: msg.reactions || []
            }));
        });
    } else {
        parts.push(renderBotMessage({
            username: post.username, color: post.color, tags: post.tags || [],
            timestamp: post.timestamp, text: post.text, image: post.image, reactions: post.reactions || []
        }));
        (post.comments || []).forEach(c => {
            parts.push(renderBotMessage({
                username: c.username, color: c.color, tags: c.tags || [],
                timestamp: c.timestamp, text: c.text, image: c.image, reactions: c.reactions || []
            }));
        });
    }
    return parts.join('');
}

function renderBotMessage({ username, color, tags = [], text, image, reactions = [] }) {
    const initial = username[0].toUpperCase();
    const tagsHtml = '';
    const avatarHtml = `<div class="msg-avatar-initial" style="background:${color}">${initial}</div>`;
    const spacerHtml = `<div class="msg-avatar-spacer"></div>`;

    // Split on double newlines into separate bubbles
    const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

    // Build list of bubble objects: {type: 'text'|'image', content}
    const bubbles = paragraphs.map(p => ({ type: 'text', content: p.replace(/\n/g, '<br>') }));
    if (image) {
        const safeSrc = image.replace(/ /g, '%20');
        bubbles.push({ type: 'image', src: safeSrc });
    }

    return bubbles.map((bubble, i) => {
        const isFirst = i === 0;
        const isLast  = i === bubbles.length - 1;
        const leftCol = isFirst ? avatarHtml : spacerHtml;
        const headerHtml = isFirst ? `<div class="comment-meta"><span class="comment-handle" style="color:${color}">${username}</span>${tagsHtml}</div>` : '';
        const bodyHtml = bubble.type === 'image'
            ? `<div class="bot-post-image-bubble"><img src="${bubble.src}" alt="" onclick="openLightbox('${bubble.src}')"></div>`
            : `<div class="comment-body">${bubble.content}</div>`;
        const reactionsHtml = isLast && reactions.length
            ? `<div class="chat-reactions">${reactions.map(r => `<span class="chat-reaction visible"><span class="chat-reaction-emoji">${r.emoji}</span><span class="chat-reaction-count">${r.count}</span></span>`).join('')}</div>`
            : '';
        return `
        <div class="card-comment chat-message visible">
            ${leftCol}
            <div class="comment-content">
                ${headerHtml}${bodyHtml}${reactionsHtml}
            </div>
        </div>`;
    }).join('');
}

function renderChatDivider() {
    const prefixes = ['Today at', 'Yesterday at', 'Monday at', 'Tuesday at', 'Last week'];
    const prefix = prefixes[Math.min(creatorTimestampIndex, prefixes.length - 1)];
    creatorTimestampIndex++;
    const h = Math.floor(Math.random() * 12) + 1;
    const m = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const ampm = Math.random() > 0.5 ? 'PM' : 'AM';

    return `<div class="chat-divider"><span>${prefix} ${h}:${m} ${ampm}</span></div>`;
}

function getCreatorTime() {
    const h = Math.floor(Math.random() * 12) + 1;
    const m = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const ampm = Math.random() > 0.5 ? 'pm' : 'am';
    return `${h}:${m}${ampm}`;
}

function showNextCreatorMessage() {
    if (creatorMessageQueue.length === 0) {
        document.getElementById('creatorTyping').innerHTML = '';
        return;
    }

    const msg = creatorMessageQueue[0];

    // Handle divider
    if (msg.isDivider) {
        creatorMessageQueue.shift();
        creatorShownMessages[currentCreatorChannel]++;
        const container = document.getElementById('creatorMessages');
        container.innerHTML += renderChatDivider();
        creatorMessageTimer = setTimeout(showNextCreatorMessage, 500);
        return;
    }

    // Show typing indicator
    showCreatorTyping(msg.username);

    const typingDelay = Math.min(1500 + msg.text.length * 12, 4000);

    creatorMessageTimer = setTimeout(() => {
        creatorMessageQueue.shift();
        creatorShownMessages[currentCreatorChannel]++;
        const container = document.getElementById('creatorMessages');

        document.getElementById('creatorTyping').innerHTML = '';

        // Add message
        const msgHtml = renderChatMessage(msg, false);
        container.innerHTML += msgHtml;

        // Animate in
        const newMsg = container.lastElementChild;
        requestAnimationFrame(() => {
            newMsg.classList.add('visible');

            // Animate reactions - staggered with more natural timing
            const reactions = newMsg.querySelectorAll('.chat-reaction');
            reactions.forEach((r, i) => {
                const baseDelay = 1500 + Math.random() * 1000; // 1.5-2.5s after message
                const stagger = i * (600 + Math.random() * 400); // 600-1000ms between each
                setTimeout(() => r.classList.add('visible'), baseDelay + stagger);
            });
        });

        autoScroll(document.getElementById('creatorChatWindow'));

        // Next message - longer pause between messages
        const pauseDelay = 2000 + Math.random() * 2000;
        creatorMessageTimer = setTimeout(showNextCreatorMessage, pauseDelay);
    }, typingDelay);
}

function showCreatorTyping(username) {
    document.getElementById('creatorTyping').innerHTML =
        `${username} is typing<span class="typing-cursor">...</span>`;
}

// Channel switching
document.querySelectorAll('.channel-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.channel-item').forEach(c => c.classList.remove('active'));
        item.classList.add('active');
        currentCreatorChannel = item.dataset.channel;
        renderCreatorChannel(currentCreatorChannel);
    });
});

// Load creator chat on page load (and seed the inline bot-request entries once data arrives)
loadCreatorChat().then(initBotRequestEntries);

// ============ Inline bot-request entries on the desktop ============
let currentBotRequestIdx = null;
// Images that belong to a specific bot request panel (kept off the desktop)
const botRequestImages = {
    'Experiment 0682 - Ossix Ayto': [
        'bot-requests/img/ossix/ossix-01.png',
        'bot-requests/img/ossix/ossix-02.png',
        'bot-requests/img/ossix/ossix-03.png',
        'bot-requests/img/ossix/ossix-04.png',
        'bot-requests/img/ossix/ossix-05.png'
    ],
    'Seeking a bodyguard': [
        'bot-requests/img/bodyguard.png'
    ],
    'A giant with golden heart and shy personality': [
        'bot-requests/img/giant.webp'
    ]
};
const botRequestImagePaths = new Set(
    Object.values(botRequestImages).flat()
);

const botRequestPositions = (function() {
    const bandTops = Object.fromEntries((window.DESKTOP_LAYOUT?.bands || []).map(b => [b.id, b.top]));
    const panels = window.DESKTOP_LAYOUT?.botRequestPanels || [];
    // Support legacy { bandId: [slots] } shape and current flat [{band, y, x}] shape
    if (Array.isArray(panels)) {
        return panels.map(s => ({ top: (bandTops[s.band] || 0) + s.y, left: s.x, visible: s.visible !== false }));
    }
    const out = [];
    Object.entries(panels).forEach(([bandId, slots]) => {
        const bandTop = bandTops[bandId] || 0;
        slots.forEach(s => out.push({ top: bandTop + s.y, left: s.x }));
    });
    return out;
})();

function initBotRequestEntries() {
    if (!creatorChatData) return;
    const requests = creatorChatData['char-requests'] || [];
    const canvas = document.querySelector('.desktop-canvas');
    if (!canvas) return;

    // Bot requests integrated into character cards (skip standalone desktop entries)
    const integratedTitles = new Set(['Mentally Unwell Dad and Stressed Mom']);

    requests.forEach((item, idx) => {
        if (idx >= botRequestPositions.length) return;
        const pos = botRequestPositions[idx];
        if (!pos.visible) return;

        const firstMsg = Array.isArray(item) ? item[0] : item;
        const text = firstMsg?.text || '';
        const h3 = text.match(/<h3>([^<]+)<\/h3>/);
        const title = h3 ? h3[1] : `request_${idx + 1}`;

        if (integratedTitles.has(title)) return;

        const iconImage = (botRequestImages[title] || [])[0];
        const iconHtml = iconImage
            ? `<div class="icon img-thumb"><img src="${iconImage}" alt=""></div>`
            : '';

        const iconEl = document.createElement('div');
        iconEl.className = 'desktop-icon bot-request-icon';
        iconEl.style.top = pos.top + 'px';
        iconEl.style.left = pos.left + 'px';
        iconEl.dataset.idx = idx;
        iconEl.onclick = (ev) => { ev.stopPropagation(); toggleBotRequest(idx); };
        iconEl.innerHTML = `${iconHtml}<span class="label">${softBreakLabel(title)}</span><span class="meta">bot request</span>`;
        canvas.appendChild(iconEl);
    });
    scheduleMobileReorder();
}

function toggleBotRequest(idx) {
    const panel = document.getElementById('botRequestPanel');
    if (!panel) return;

    if (currentBotRequestIdx === idx && panel.classList.contains('open')) {
        closeBotRequest();
        return;
    }

    closeAllWindows();

    const requests = creatorChatData?.['char-requests'] || [];
    const item = requests[idx];
    if (!item) return;

    const messages = Array.isArray(item) ? item : [item];
    const firstText = messages[0]?.text || '';
    const titleMatch = firstText.match(/<h3>([^<]+)<\/h3>/);
    const title = titleMatch ? titleMatch[1] : '';
    const panelImages = botRequestImages[title] || [];

    const imagesHtml = panelImages.length ? `
        <div class="comment-images">
            ${panelImages.map(src => `<img src="${src}" alt="" onclick="openLightbox('${src}')">`).join('')}
        </div>
    ` : '';

    const html = messages.map((msg, i) => {
        const text = msg.text || '';
        const username = msg.username || 'anon';
        const isOp = i === 0;
        // Attach the reference images inside the OP message's bubble
        const bodyContent = isOp ? `${text}${imagesHtml}` : text;
        return `
            <div class="card-comment${isOp ? ' op' : ''}">
                <img class="avatar" src="${avatarFor(username)}" alt="">
                <div class="comment-content">
                    <div class="comment-meta">
                        <span class="comment-handle">${username}${isOp ? '<span class="op-tag">bot request</span>' : ''}</span>
                    </div>
                    <div class="comment-body">${bodyContent}</div>
                </div>
            </div>
        `;
    }).join('');

    panel.innerHTML = html;
    panel.scrollTop = 0;
    panel.classList.add('open');
    setOverlay(true);
    playSound('open');
    showChatFloatClose(closeBotRequest);
    currentBotRequestIdx = idx;
}

function closeBotRequest() {
    const panel = document.getElementById('botRequestPanel');
    if (!panel) return;
    panel.classList.remove('open');
    hideChatFloatClose();
    currentBotRequestIdx = null;
    setOverlay(false);
    playSound('close');
}

function openCharacterFile(charKey) {
    openCharacterCard(charKey);
}

// Deterministic username -> avatar mapping (so the same handle always gets the same face)
const AVATAR_POOL = [
    'discord-avatar-01.jpg',
    'discord-avatar-02.jpg',
    'discord-avatar-03.jpg',
    'discord-avatar-04.jpg',
    'discord-avatar-05.jpg',
    'discord-avatar-06.jpg',
    'discord-avatar-07.jpg',
    'discord-avatar-08.jpg',
    'discord-avatar-09.png',
    'discord-avatar-010.png',
    'discord-avatar-011.png',
    'discord-avatar-012.png',
    'discord-avatar-013.png',
    'discord-avatar-014.png',
    'discord-avatar-015.png',
    'discord-avatar-016.png',
    'discord-avatar-017.png',
    'discord-avatar-018.png',
    'discord-avatar-019.png',
    'discord-avatar-020.png',
    'discord-avatar-021.webp',
    'discord-avatar-022.webp',
];
function avatarFor(name) {
    const s = String(name || '');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) | 0;
    return 'img/discord%20avatars/' + AVATAR_POOL[Math.abs(h) % AVATAR_POOL.length].replace(/ /g, '%20');
}

function renderCardComments(charKey) {
    const list = characterComments[charKey] || [];
    const container = document.getElementById('cardCommentsList');
    const countEl = document.getElementById('cardCommentsCount');
    if (countEl) countEl.textContent = list.length;
    container.innerHTML = list.map(c => `
        <div class="card-comment${c.op ? ' op' : ''}">
            <img class="avatar" src="${avatarFor(c.handle)}" alt="">
            <div class="comment-content">
                <div class="comment-meta">
                    <span class="comment-handle">${c.handle}${c.op ? '<span class="op-tag">bot request</span>' : ''}</span>
                    <span class="comment-time">${c.time}</span>
                </div>
                <div class="comment-body">${c.body}</div>
                <div class="comment-likes${c.hot ? ' hot' : ''}">♡ ${c.likes}</div>
            </div>
        </div>
    `).join('');
}

// ============ Card window chat (reuses /api/chat + buildSystemPrompt) ============
let cardChatCharKey = null;
let isCardChatLoading = false;

let cardCurrentView = 'comments';
function switchCardView(view) {
    cardCurrentView = view;
    document.getElementById('cardCommentsView')?.classList.toggle('active', view === 'comments');
    document.getElementById('cardChatView')?.classList.toggle('active', view === 'chat');

    if (view === 'chat' && cardChatCharKey) {
        if (!botChatHistory[cardChatCharKey] || botChatHistory[cardChatCharKey].length === 0) {
            initCardChat(cardChatCharKey);
        } else {
            renderCardChat(cardChatCharKey);
        }
        setTimeout(() => document.getElementById('cardChatInput')?.focus(), 50);
    }
}

function initCardChat(charKey) {
    botChatHistory[charKey] = [];
    botConversationHistory[charKey] = [];
    const greeting = characters[charKey]?.firstMessage || `...`;
    const cleanGreeting = greeting.replace(/\{\{user\}\}/gi, 'you');
    botChatHistory[charKey].push({ from: 'bot', text: cleanGreeting });
    botConversationHistory[charKey].push({ role: 'assistant', content: greeting });
    renderCardChat(charKey);
}

function renderCardChat(charKey) {
    const container = document.getElementById('cardChatMessages');
    container.innerHTML = '';
    const history = botChatHistory[charKey] || [];
    history.forEach(msg => {
        const isBot = msg.from === 'bot';
        const color = charColors[isBot ? charKey : 'you'];
        const username = isBot ? charNames[charKey] : 'you';
        const avatar = isBot ? charFaces[charKey] : undefined;
        let text = msg.text;
        let action = '';
        if (msg.from === 'bot') {
            const parts = splitRoleplayAndDialogue(msg.text);
            action = parts.actions.join(' ');
            text = parts.dialogue;
        }
        const el = document.createElement('div');
        el.innerHTML = renderChatMessage({ username, color, text, action, avatar }, true);
        container.appendChild(el.firstElementChild);
    });
    forceScrollBottom(container);
}

function handleCardChatKeypress(event) {
    if (event.key === 'Enter') sendCardChatMessage();
}

async function sendCardChatMessage() {
    const input = document.getElementById('cardChatInput');
    const text = input.value.trim();
    if (!text || !cardChatCharKey || isCardChatLoading) return;

    playSound('click');
    isCardChatLoading = true;
    const charKey = cardChatCharKey;

    botChatHistory[charKey].push({ from: 'user', text });
    renderCardChat(charKey);
    input.value = '';

    botConversationHistory[charKey].push({ role: 'user', content: text });

    await new Promise(r => setTimeout(r, 500 + Math.random() * 700));
    document.getElementById('cardChatTyping').textContent = `${charNames[charKey]} is typing…`;

    try {
        const characterData = characters[charKey];
        const systemPrompt = buildSystemPrompt(characterData);
        const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/api/chat'
            : '/.netlify/functions/chat';

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: botConversationHistory[charKey],
                system: systemPrompt
            })
        });

        document.getElementById('cardChatTyping').textContent = '';

        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        const reply = data.content?.[0]?.text || '...';

        botConversationHistory[charKey].push({ role: 'assistant', content: reply });
        botChatHistory[charKey].push({ from: 'bot', text: reply });
        renderCardChat(charKey);
        playSound('chime');
    } catch (e) {
        document.getElementById('cardChatTyping').textContent = '';
        botChatHistory[charKey].push({ from: 'bot', text: `// error: ${e.message}` });
        renderCardChat(charKey);
    } finally {
        isCardChatLoading = false;
    }
}

async function openCharacterCard(charKey = 'priest') {
    cancelAutoOpenMakerChat();
    closeAllWindows();

    const filename = charFiles[charKey];
    if (!filename) return;

    document.getElementById('cardWindowTitle').textContent = filename;
    renderCardComments(charKey);

    cardChatCharKey = charKey;
    switchCardView('comments');
    // pre-render existing chat history so switching to chat is instant
    if (botChatHistory[charKey]?.length) {
        renderCardChat(charKey);
    } else {
        document.getElementById('cardChatMessages').innerHTML = '';
    }
    document.getElementById('cardChatTyping').textContent = '';

    const win = document.getElementById('cardWindow');
    const pretty = document.getElementById('cardJsonPretty');
    const pane = pretty.parentElement;

    pretty.innerHTML = '';
    win.classList.remove('hidden');
    win.classList.remove('show-side'); // default: JSON only, comments/chat hidden
    updateCardSideButtons();
    setOverlay(true);
    playSound('open');
    showChatFloatClose(closeCardWindow);

    try {
        const data = await (await fetch('character-data/' + filename)).json();
        pane.scrollTop = 0;
        typeJson(pretty, JSON.stringify(data, null, 2));
    } catch (e) {
        pretty.textContent = '// error: ' + e.message;
    }
}

function closeCardWindow() {
    cardTypeId++;
    document.getElementById('cardWindow').classList.add('hidden');
    hideChatFloatClose();
    setOverlay(false);
    playSound('close');
}

// ============ Voice memo mini-player ============
let currentVoiceMemo = null;
let activeVoiceMemoIcon = null;

const PLAY_PILL_PLAY = '<svg width="7" height="9" viewBox="0 0 7 9" fill="currentColor" style="display:block;flex-shrink:0"><path d="M0 0 L7 4.5 L0 9 Z"/></svg>play';

function _setPlayPill(icon, state) {
    const pill = icon?.querySelector('.play-pill');
    if (!pill) return;
    pill.innerHTML = state === 'speaking' ? 'speaking' : PLAY_PILL_PLAY;
}
let vmCaptionChunks = null;
const _vmFmt = (sec) => {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

function toggleVoiceMemo(event, slug, audioPath) {
    if (event) event.stopPropagation();
    const player = document.getElementById('voiceMemoPlayer');
    const audio = document.getElementById('vmAudio');
    if (!player || !audio) return;

    if (currentVoiceMemo === slug && !player.classList.contains('hidden')) {
        closeVoiceMemo();
        return;
    }

    // Reset previous icon's play-pill before switching
    if (activeVoiceMemoIcon) { _setPlayPill(activeVoiceMemoIcon, 'play'); activeVoiceMemoIcon = null; }
    activeVoiceMemoIcon = event?.target?.closest?.('.desktop-icon') || null;

    currentVoiceMemo = slug;
    const resolvedAudioPath = audioPath || `diary vo/${slug}.mp3`;
    audio.src = resolvedAudioPath;
    audio.load();

    // Load caption sidecar (if any). Sidecar lives next to audio, .json
    const captionEl = document.getElementById('vmCaptions');
    vmCaptionChunks = null;
    if (captionEl) { captionEl.classList.remove('visible'); captionEl.textContent = ''; }
    const sidecarPath = resolvedAudioPath.replace(/\.[^.]+$/, '.json');
    const requestedSlug = slug;
    fetch(encodeURI(sidecarPath))
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            if (data && Array.isArray(data.chunks) && currentVoiceMemo === requestedSlug) {
                // Merge 3-word generator chunks into sentence-bounded display chunks.
                // A chunk ends at sentence punctuation OR when it gets too long.
                const MAX_WORDS = 14;
                const merged = [];
                let bucket = [];
                let wordCount = 0;
                const flush = () => {
                    if (!bucket.length) return;
                    merged.push({
                        start: bucket[0].start,
                        end:   bucket[bucket.length - 1].end,
                        text:  bucket.map(c => c.text).join(' '),
                    });
                    bucket = []; wordCount = 0;
                };
                for (const c of data.chunks) {
                    bucket.push(c);
                    wordCount += c.text.split(/\s+/).filter(Boolean).length;
                    const endsAtSentence = /[.!?]["')\]]?$/.test(c.text.trim());
                    if (endsAtSentence || wordCount >= MAX_WORDS) flush();
                }
                flush();
                vmCaptionChunks = merged;
                if (captionEl) captionEl.classList.add('visible');
            }
        })
        .catch(() => {});

    // Hide transcript button if no diary entry exists for this slug
    const transcriptBtn = player.querySelector('.vm-transcript');
    if (transcriptBtn) {
        const hasTranscript = typeof diaryEntries !== 'undefined' && diaryEntries[slug];
        transcriptBtn.style.display = hasTranscript ? '' : 'none';
    }

    // On mobile, always anchor to the bottom safe zone immediately.
    // On desktop, float near the tapped icon and dock on first scroll.
    if (isMobile()) {
        player.classList.add('docked');
        setOverlay(true);
        showChatFloatClose(closeVoiceMemo);
    } else {
        player.classList.remove('docked');
        const icon = event?.currentTarget;
        if (icon) {
            const rect = icon.getBoundingClientRect();
            const playerW = 280;
            const left = Math.max(12, Math.min(window.innerWidth - playerW - 12, rect.left));
            const top = Math.min(window.innerHeight - 60, rect.bottom + 10);
            player.style.left = left + 'px';
            player.style.top = top + 'px';
        }
    }
    vmStartDockOnScroll();

    const playBtn = player.querySelector('.vm-play');
    vmSetPlayBtn(playBtn, true);
    document.getElementById('vmFill').style.width = '0%';
    document.getElementById('vmTime').textContent = '0:00';

    player.classList.remove('hidden');
    _setPlayPill(activeVoiceMemoIcon, 'speaking');
    audio.play().catch(() => {
        // autoplay blocked — show play state
        vmSetPlayBtn(playBtn, false);
        _setPlayPill(activeVoiceMemoIcon, 'play');
    });
}

const VM_ICON_PLAY  = '<svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor"><path d="M0 0 L8 5 L0 10 Z"/></svg>';
const VM_ICON_PAUSE = '<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="0" y="0" width="3" height="10"/><rect x="7" y="0" width="3" height="10"/></svg>';

function vmSetPlayBtn(btn, playing) {
    if (!btn) return;
    btn.innerHTML = playing ? VM_ICON_PAUSE : VM_ICON_PLAY;
    btn.dataset.state = playing ? 'playing' : 'paused';
}

function vmTogglePlay(event) {
    if (event) event.stopPropagation();
    const audio = document.getElementById('vmAudio');
    const btn = document.querySelector('.vm-play');
    if (audio.paused) {
        audio.play();
        vmSetPlayBtn(btn, true);
        _setPlayPill(activeVoiceMemoIcon, 'speaking');
    } else {
        audio.pause();
        vmSetPlayBtn(btn, false);
        _setPlayPill(activeVoiceMemoIcon, 'play');
    }
}

function vmSeek(event) {
    event.stopPropagation();
    const audio = document.getElementById('vmAudio');
    if (!isFinite(audio.duration)) return;
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
}

let vmScrollHandler = null;
function vmStartDockOnScroll() {
    vmStopDockOnScroll();
    vmScrollHandler = () => {
        const player = document.getElementById('voiceMemoPlayer');
        if (player && !player.classList.contains('hidden')) player.classList.add('docked');
        vmStopDockOnScroll();
    };
    // Desktop: .desktop panel scrolls. Mobile: the window scrolls.
    // Listen to both so docking works in either context.
    const desktop = document.querySelector('.desktop');
    if (desktop) desktop.addEventListener('scroll', vmScrollHandler, { once: true });
    window.addEventListener('scroll', vmScrollHandler, { once: true });
}
function vmStopDockOnScroll() {
    const desktop = document.querySelector('.desktop');
    if (desktop && vmScrollHandler) desktop.removeEventListener('scroll', vmScrollHandler);
    if (vmScrollHandler) window.removeEventListener('scroll', vmScrollHandler);
    vmScrollHandler = null;
}

function closeVoiceMemo() {
    const player = document.getElementById('voiceMemoPlayer');
    const audio = document.getElementById('vmAudio');
    if (audio) { audio.pause(); audio.currentTime = 0; }
    if (player) { player.classList.add('hidden'); player.classList.remove('docked'); }
    const captionEl = document.getElementById('vmCaptions');
    if (captionEl) { captionEl.classList.remove('visible'); captionEl.textContent = ''; }
    vmCaptionChunks = null;
    currentVoiceMemo = null;
    vmStopDockOnScroll();
    setOverlay(false);
    hideChatFloatClose();
    _setPlayPill(activeVoiceMemoIcon, 'play');
    activeVoiceMemoIcon = null;
}

function vmShowTranscript() {
    if (!currentVoiceMemo) return;
    openDiaryBySlug(currentVoiceMemo);
}

// Wire up audio events once
(() => {
    const audio = document.getElementById('vmAudio');
    if (!audio) return;
    audio.addEventListener('timeupdate', () => {
        const fill = document.getElementById('vmFill');
        const time = document.getElementById('vmTime');
        if (!fill || !time) return;
        const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        fill.style.width = pct + '%';
        time.textContent = `${_vmFmt(audio.currentTime)} / ${_vmFmt(audio.duration)}`;

        // Sync captions
        if (vmCaptionChunks) {
            const t = audio.currentTime;
            const captionEl = document.getElementById('vmCaptions');
            if (!captionEl) return;
            const chunk = vmCaptionChunks.find(c => t >= c.start && t <= c.end)
                        || vmCaptionChunks.filter(c => c.start <= t).pop();
            captionEl.innerHTML = chunk ? `<span class=”vm-qm”>”</span>${chunk.text}<span class=”vm-qm”>”</span>` : '';
        }
    });
    audio.addEventListener('ended', () => {
        const btn = document.querySelector('.vm-play');
        if (btn) vmSetPlayBtn(btn, false);
        _setPlayPill(activeVoiceMemoIcon, 'play');
        activeVoiceMemoIcon = null;
    });
    // Click outside the player → close
    document.addEventListener('click', (e) => {
        const player = document.getElementById('voiceMemoPlayer');
        if (!player || player.classList.contains('hidden')) return;
        if (player.contains(e.target)) return;
        if (e.target.closest('.voice-memo-icon')) return;
        closeVoiceMemo();
    });
})();

function toggleCardSide(view) {
    cardTypeId++;
    const win = document.getElementById('cardWindow');
    if (!win) return;
    const isOpen = win.classList.contains('show-side');

    if (isOpen && cardCurrentView === view) {
        win.classList.remove('show-side');
    } else {
        win.classList.add('show-side');
        switchCardView(view);
    }
    updateCardSideButtons();
}

function updateCardSideButtons() {
    const win = document.getElementById('cardWindow');
    if (!win) return;
    const isOpen = win.classList.contains('show-side');
    document.querySelectorAll('.card-side-toggle').forEach(b => {
        b.classList.toggle('active', isOpen && b.dataset.view === cardCurrentView);
    });
}

// Insert <wbr> after _ . / so labels break on word/segment boundaries instead of mid-word
function softBreakLabel(s) {
    return String(s).replace(/([_./])/g, '$1<wbr>');
}

// Mobile detection helper (used by jumpToYear / scrollspy)
const isMobile = () => window.matchMedia('(max-width: 768px)').matches || window.innerWidth <= 768;

// Mobile layout constants
const MOBILE_Y_STRETCH  = 1.8;  // desktop reference only
const MOBILE_ICON_STEP  = 180;  // px from one icon top to the next
const MOBILE_BAND_SEP   =  80;  // extra gap between sections
const MOBILE_TOP_PAD    =  40;  // top padding

function applyMobileLayout() {
    if (adminDragging) return;
    const canvas = document.querySelector('.desktop-canvas');
    if (!canvas) return;
    const items = canvas.querySelectorAll('.desktop-icon, .band-banner');

    // Save original positions once (needed to restore on desktop)
    items.forEach(el => {
        if (el.dataset.origTop === undefined) {
            el.dataset.origTop  = parseInt(el.style.top,  10) || 0;
            el.dataset.origLeft = parseInt(el.style.left, 10) || 0;
        }
    });

    if (!isMobile()) {
        items.forEach(el => {
            el.style.top       = el.dataset.origTop  + 'px';
            el.style.left      = el.dataset.origLeft + 'px';
            el.style.transform = '';
        });
        canvas.style.minHeight = '';
        return;
    }

    const bands = (window.DESKTOP_LAYOUT && window.DESKTOP_LAYOUT.bands) || [];

    // Separate visible icons from decorative / hidden elements
    const iconEls    = [];
    const nonIconEls = [];
    items.forEach(el => {
        if (el.classList.contains('desktop-icon') && !el.classList.contains('voice-memo-icon')) {
            iconEls.push(el);
        } else {
            nonIconEls.push(el);
        }
    });

    // Sort by band order, then by desktop Y (then X) within each band
    iconEls.sort((a, b) => {
        const aOT = parseInt(a.dataset.origTop, 10);
        const bOT = parseInt(b.dataset.origTop, 10);
        const aBi = bands.findIndex(bd => aOT >= bd.top && aOT < bd.top + bd.height);
        const bBi = bands.findIndex(bd => bOT >= bd.top && bOT < bd.top + bd.height);
        if (aBi !== bBi) return aBi - bBi;
        if (aOT !== bOT) return aOT - bOT;
        return parseInt(a.dataset.origLeft, 10) - parseInt(b.dataset.origLeft, 10);
    });

    // Single centred column — one icon below the other, extra gap between sections
    let runningY    = MOBILE_TOP_PAD;
    let prevBandIdx = -1;

    iconEls.forEach(el => {
        const ot      = parseInt(el.dataset.origTop, 10);
        const bandIdx = bands.findIndex(bd => ot >= bd.top && ot < bd.top + bd.height);

        if (prevBandIdx !== -1 && bandIdx !== prevBandIdx) runningY += MOBILE_BAND_SEP;
        prevBandIdx = bandIdx;

        el.style.top  = runningY + 'px';
        el.style.left = '50%';
        runningY += MOBILE_ICON_STEP;
    });

    // Invisible elements: park at origin, out of the way
    nonIconEls.forEach(el => { el.style.top = '0px'; el.style.left = '0px'; });

    canvas.style.minHeight = (runningY + 80) + 'px';
}

// Backwards-compat alias used by dynamic loaders
function scheduleMobileReorder() { applyMobileLayout(); }

window.addEventListener('resize', applyMobileLayout);
window.addEventListener('load', applyMobileLayout);
document.addEventListener('DOMContentLoaded', applyMobileLayout);

if (new URLSearchParams(window.location.search).has('admin')) {
    document.body.classList.add('admin-mode');
}

const ADMIN_POS_KEY = 'desktopAdminPositions';
function adminGetSavedPos(key) {
    if (!key) return null;
    try { const s = JSON.parse(localStorage.getItem(ADMIN_POS_KEY) || '{}'); return s[key] || null; } catch { return null; }
}
function adminSavePos(key, x, y) {
    if (!key) return;
    try { const s = JSON.parse(localStorage.getItem(ADMIN_POS_KEY) || '{}'); s[key] = { x, y }; localStorage.setItem(ADMIN_POS_KEY, JSON.stringify(s)); } catch {}
}

let adminDragging = false;

function initAdminDrag(div, bandTop) {
    // Prevent iOS from treating child images as native drag targets
    div.querySelectorAll('img').forEach(img => { img.draggable = false; });

    function startDrag(clientX, clientY) {
        const desktop     = document.querySelector('.desktop');
        const desktopRect = desktop.getBoundingClientRect();
        const iconRect    = div.getBoundingClientRect();
        const offsetX     = clientX - iconRect.left;
        const offsetY     = clientY - iconRect.top;
        const startX      = clientX;
        const startY      = clientY;
        let hasDragged    = false;

        adminDragging    = true;
        div.style.zIndex  = '9999';
        div.style.opacity = '0.75';

        // On mobile the window scrolls; on desktop the .desktop panel scrolls.
        const scrollTop = () => isMobile() ? window.scrollY : desktop.scrollTop;

        function move(cx, cy) {
            if (!hasDragged && Math.abs(cx - startX) + Math.abs(cy - startY) < 4) return;
            hasDragged = true;
            div.style.left = Math.max(0, Math.round(cx - desktopRect.left - offsetX)) + 'px';
            div.style.top  = Math.max(0, Math.round(cy - desktopRect.top + scrollTop() - offsetY)) + 'px';
        }

        function end(cx, cy) {
            if (cx !== undefined) move(cx, cy);
            adminDragging    = false;
            document.removeEventListener('mousemove',  onMouseMove);
            document.removeEventListener('mouseup',    onMouseUp);
            document.removeEventListener('touchmove',  onTouchMove);
            document.removeEventListener('touchend',   onTouchEnd);
            div.style.zIndex  = '';
            div.style.opacity = '';
            if (!hasDragged) return;

            const newX = Math.round(parseFloat(div.style.left));
            const newY = Math.round(parseFloat(div.style.top)) - bandTop;
            div.dataset.posX = newX;
            div.dataset.posY = newY;

            adminSavePos(div.dataset.key, newX, newY);
            navigator.clipboard.writeText(`"x": ${newX}, "y": ${newY}`).catch(() => {});
            showAdminToast(`x: ${newX}   y: ${newY} — saved + copied`);
            div.addEventListener('click', e => e.stopPropagation(), { once: true });
        }

        function onMouseMove(e) { move(e.clientX, e.clientY); }
        function onMouseUp()    { end(); }
        function onTouchMove(e) {
            e.preventDefault();
            const t = e.touches[0];
            move(t.clientX, t.clientY);
        }
        function onTouchEnd(e) {
            const t = e.changedTouches[0];
            end(t.clientX, t.clientY);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup',   onMouseUp);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend',  onTouchEnd);
    }

    div.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });

    div.addEventListener('touchstart', e => {
        e.preventDefault();
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
    }, { passive: false });
}

function showAdminToast(msg) {
    let toast = document.getElementById('adminToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'adminToast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 3000);
}
function applySoftBreaksToAllLabels() {
    document.querySelectorAll('.desktop-icon .label').forEach(el => {
        if (el.dataset.sbDone) return;
        el.innerHTML = softBreakLabel(el.textContent);
        el.dataset.sbDone = '1';
    });
}
applySoftBreaksToAllLabels();


loadCharacters();
loadDiary();
// loadBotRequestImages(); // images removed from desktop — replaced by bot-post cards
// loadFoundImages();      // images removed from desktop

applySoftBreaksToAllLabels();

async function loadFoundImages() {
    try {
        const res = await fetch('api/found-images.json');
        const images = await res.json();
        if (!images.length) return;

        const canvas = document.querySelector('.desktop-canvas');
        const bandTops = Object.fromEntries((window.DESKTOP_LAYOUT?.bands || []).map(b => [b.id, b.top]));
        const positions = [];
        Object.entries(window.DESKTOP_LAYOUT?.imageSlots?.found || {}).forEach(([bandId, slots]) => {
            const bandTop = bandTops[bandId] || 0;
            slots.forEach(s => positions.push({ top: bandTop + s.y, left: s.x }));
        });
        if (!positions.length) return;

        images.forEach((imgPath, i) => {
            const pos = positions[i % positions.length];
            const safeSrc = imgPath.replace(/ /g, '%20');

            const icon = document.createElement('div');
            icon.className = 'desktop-icon found-image-icon';
            icon.style.top = pos.top + 'px';
            icon.style.left = pos.left + 'px';
            icon.onclick = () => openLightbox(safeSrc);
            icon.innerHTML = `
                <div class="icon img-thumb">
                    <img src="${safeSrc}" alt="">
                </div>
            `;
            canvas.appendChild(icon);
        });
        applySoftBreaksToAllLabels();
        scheduleMobileReorder();
    } catch (e) {}
}

async function loadBotRequestImages() {
    try {
        const res = await fetch('api/bot-requests.json');
        let images = await res.json();
        // Strip images that belong to specific bot-request panels — those render inline in the panel
        images = images.filter(p => !botRequestImagePaths.has(p));
        if (!images.length) return;

        const canvas = document.querySelector('.desktop-canvas');

        const bandTops = Object.fromEntries((window.DESKTOP_LAYOUT?.bands || []).map(b => [b.id, b.top]));
        const positions = [];
        Object.entries(window.DESKTOP_LAYOUT?.imageSlots?.botRequest || {}).forEach(([bandId, slots]) => {
            const bandTop = bandTops[bandId] || 0;
            slots.forEach(s => positions.push({ x: s.x, y: bandTop + s.y }));
        });
        if (!positions.length) return;

        let maxY = 0;
        images.forEach((imgPath, i) => {
            const pos = positions[i % positions.length];
            const filename = imgPath.split('/').pop();

            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.style.top = pos.y + 'px';
            icon.style.left = pos.x + 'px';
            icon.onclick = () => openLightbox(imgPath);

            let h = 0;
            for (let k = 0; k < filename.length; k++) h = (h * 31 + filename.charCodeAt(k)) | 0;
            const sizeKb = Math.abs(h) % 1700 + 180;
            icon.innerHTML = `
                <div class="icon img-thumb">
                    <img src="${imgPath}" alt="${filename}">
                </div>
                <span class="label">${filename}</span>
                <span class="meta">${sizeKb} KB</span>
            `;

            canvas.appendChild(icon);
            if (pos.y > maxY) maxY = pos.y;
        });

        canvas.style.minHeight = Math.max(1800, maxY + 200) + 'px';
        applySoftBreaksToAllLabels();
        scheduleMobileReorder();
    } catch (e) {}
}

let currentIframeUrl = '';

function openIframeWindow(title, url, options = {}) {
    currentIframeUrl = url;
    document.getElementById('iframeWindowTitle').textContent = title;
    const iframe = document.getElementById('iframeContent');
    const blocked = document.getElementById('iframeBlocked');

    iframe.style.display = 'block';
    blocked.classList.remove('visible');

    if (options.trusted) {
        // Skip cross-origin block detection for known-good embeds (YouTube, local PDFs).
        // Also drop the sandbox attribute, which otherwise disables Chrome's PDF viewer.
        iframe.removeAttribute('sandbox');
        iframe.onerror = null;
        iframe.onload = null;
    } else {
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
        iframe.onerror = () => {
            iframe.style.display = 'none';
            blocked.classList.add('visible');
        };
        // Detect X-Frame-Options block via load event; contentDocument throws if blocked
        iframe.onload = () => {
            try {
                const doc = iframe.contentDocument;
                if (!doc || doc.location.href === 'about:blank' && url !== 'about:blank') {
                    iframe.style.display = 'none';
                    blocked.classList.add('visible');
                }
            } catch(e) {
                iframe.style.display = 'none';
                blocked.classList.add('visible');
            }
        };
    }

    iframe.src = url;
    document.getElementById('iframeWindow').classList.add('active');
    setOverlay(true);
    playSound('open');
}

function openPdfWindow(path, title, comments) {
    // Browsers render PDFs natively inside iframes. Use trusted to skip
    // the cross-origin block-detection (PDFs trigger it falsely).
    openIframeWindow(title || 'document', encodeURI(path), { trusted: true });
    const panel = document.getElementById('iframeComments');
    const win = document.getElementById('iframeWindow');
    if (!panel || !win) return;
    if (Array.isArray(comments) && comments.length) {
        panel.innerHTML = comments.map(c => `
            <div class="card-comment chat-message">
                <img class="avatar" src="${c.avatar}" alt="">
                <div class="comment-content">
                    <div class="comment-meta"><span><span class="comment-handle">${c.handle}</span> &middot; <span class="comment-time">${c.time}</span></span></div>
                    <div class="comment-body">${c.body}</div>
                    <div class="comment-likes">&uarr; ${c.likes}</div>
                </div>
            </div>
        `).join('');
        panel.classList.add('visible');
        win.classList.add('with-comments');
        requestAnimationFrame(() => staggerVisible(panel, '.card-comment', 800));
    } else {
        panel.classList.remove('visible');
        panel.innerHTML = '';
        win.classList.remove('with-comments');
    }
}

function openYouTubeClip(title, videoId, start, end) {
    const params = new URLSearchParams({
        autoplay: '1',
        rel: '0',
        modestbranding: '1',
        start: String(start || 0),
    });
    if (end) params.set('end', String(end));
    const url = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    openIframeWindow(title || 'video', url, { trusted: true });
}

function closeIframeWindow() {
    const win = document.getElementById('iframeWindow');
    win.classList.remove('active');
    win.classList.remove('with-comments');
    document.getElementById('iframeContent').src = '';
    const panel = document.getElementById('iframeComments');
    if (panel) { panel.classList.remove('visible'); panel.innerHTML = ''; }
    currentIframeUrl = '';
    setOverlay(false);
    playSound('close');
}

function openIframeInTab() {
    if (currentIframeUrl) window.open(currentIframeUrl, '_blank');
}

function openVideoWindow(src, title, options) {
    const video = document.getElementById('videoPlayer');
    const opts = options || {};
    const nextSrc = src || 'montages/my_living_doll.mp4';
    const resolvedNext = new URL(nextSrc, window.location.href).href;
    if (video.currentSrc !== resolvedNext) {
        video.querySelector('source').setAttribute('src', nextSrc);
        video.src = nextSrc;
        video.load();
    }
    video.muted = opts.muted === undefined ? true : opts.muted;
    video.loop = opts.loop === undefined ? true : opts.loop;
    video.controls = !!opts.controls;
    if (opts.startTime) {
        video.addEventListener('loadedmetadata', () => { video.currentTime = opts.startTime; }, { once: true });
    }
    document.getElementById('videoWindowTitle').textContent = title || 'character ai';
    document.getElementById('videoWindow').classList.add('active');
    video.play().catch(() => {});
    setOverlay(true);
    playSound('open');
}

function closeVideoWindow() {
    const video = document.getElementById('videoPlayer');
    video.pause();
    video.currentTime = 0;
    document.getElementById('videoWindow').classList.remove('active');
    setOverlay(false);
    playSound('close');
}

function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightbox').classList.add('active');
    playSound('open');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.getElementById('lightboxImg').src = '';
    playSound('close');
}

function taskbarAdd() {}
function taskbarRemove() {}

// ============ SYSTEM SOUNDS ============
let audioCtx = null;

function getAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function tone(freq, startTime, attack, sustain, release, volume, detune) {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const peak = startTime + attack;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, peak);
    if (sustain > 0) gain.gain.setValueAtTime(volume, peak + sustain);
    gain.gain.exponentialRampToValueAtTime(0.0001, peak + sustain + release);
    osc.start(startTime);
    osc.stop(peak + sustain + release + 0.1);
}

// Simulate room reverb with two decaying echoes
function rtone(freq, startTime, attack, sustain, release, volume, detune) {
    tone(freq, startTime,        attack,        sustain, release,        volume,        detune);
    tone(freq, startTime + 0.15, attack * 0.8,       0, release * 0.7,  volume * 0.22, detune);
    tone(freq, startTime + 0.35, attack * 0.6,       0, release * 0.5,  volume * 0.07, detune);
}

function playSound(type) {
    const ctx = getAudio();
    const t = ctx.currentTime;

    if (type === 'open') {
        // Soft ascending C-major arpeggio
        rtone(523.25, t + 0.00, 0.06, 0, 1.0, 0.044); // C5
        rtone(659.25, t + 0.10, 0.06, 0, 0.9, 0.037); // E5
        rtone(783.99, t + 0.20, 0.06, 0, 1.1, 0.031); // G5

    } else if (type === 'close') {
        // Descending, quieter and shorter than open
        rtone(783.99, t + 0.00, 0.05, 0, 0.75, 0.031); // G5
        rtone(659.25, t + 0.09, 0.05, 0, 0.70, 0.026); // E5
        rtone(523.25, t + 0.18, 0.05, 0, 0.85, 0.022); // C5

    } else if (type === 'chime') {
        // Pure bell — A5 with its fifth, gentle and clear
        rtone(880.00, t + 0.00, 0.01, 0, 2.2, 0.050); // A5
        rtone(1320.0, t + 0.03, 0.01, 0, 1.7, 0.022); // E6 (fifth)
        tone(440.00,  t + 0.06, 0.09, 0, 1.6, 0.015); // A4 ghost undertone

    } else if (type === 'click') {
        tone(660, t, 0.005, 0, 0.13, 0.020);

    } else if (type === 'folder') {
        // Two-note lift, a little warmer than open
        rtone(440.00, t + 0.00, 0.07, 0, 0.85, 0.040); // A4
        rtone(554.37, t + 0.12, 0.06, 0, 0.95, 0.032); // C#5

    } else if (type === 'error') {
        // Low, soft — a question rather than an alarm
        rtone(293.66, t + 0.0, 0.12, 0.1, 1.3, 0.042); // D3
        rtone(261.63, t + 0.6, 0.12, 0.1, 1.5, 0.036); // C3
    }
}

document.querySelectorAll('.desktop-icon').forEach(icon => {});

// Click on desktop background closes all windows
document.querySelector('.desktop').addEventListener('click', (e) => {
    // Only close if clicking directly on the desktop, not on icons or windows
    if (e.target.classList.contains('desktop')) {
        closeAllWindows();
    }
});

// ============ BOT CHAT SYSTEM ============
let currentBotKey = null;
let botChatHistory = {}; // Store chat history per bot (for display)
let botConversationHistory = {}; // Store API-formatted conversation history per bot
let isWaitingForResponse = false;

// Character face images mapping
const charFaces = {
    victoria: 'img/anime-bitmap/evil-bully-wife.png',
    chloe:    'img/anime-bitmap/expressionless-woman.png',
    eleanor:  'img/anime-bitmap/rich-dommy-mommy.png',
    logan:    'img/anime-bitmap/traumatized_military_man.png',
    priest:   'img/anime-bitmap/judgemental-priest.png',
    minho:    'img/anime-bitmap/loving-korean-boyfriend.png',
    luna:     'img/anime-bitmap/mental-chastity-girlfriend.png',
    parents:  'img/anime-bitmap/parents.png'
};

const charColors = {
    victoria: '#90F1EF',
    chloe:    'rgba(249,248,248,0.25)',
    eleanor:  '#90F1EF',
    logan:    '#90F1EF',
    priest:   '#FF8AF7',
    minho:    '#FF8AF7',
    luna:     'rgba(249,248,248,0.25)',
    parents:  '#8a9e8a',
    you:      'rgba(249,248,248,0.4)'
};

function switchChatView(view) {
    document.querySelectorAll('.chat-view-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });
    document.getElementById('groupChatView')?.classList.toggle('active', view === 'group');
    document.getElementById('botChatView')?.classList.toggle('active', view === 'bot');
}

function openBotChat(charKey) {
    cancelAutoOpenMakerChat();
    currentBotKey = charKey;
    closeFolder();

    // Update window title
    document.getElementById('mobileChatTitle').textContent = 'chat';

    // Open the overlay
    document.getElementById('mobileChatOverlay').classList.add('active');
    document.getElementById('mobileChatBackdrop').classList.add('active');
    syncMobileBotChat(charKey);

    // Load or initialize chat history for this bot
    if (!botChatHistory[charKey]) {
        botChatHistory[charKey] = [];
        botConversationHistory[charKey] = [];
        showMobileBotTyping();
        const greeting = characters[charKey]?.firstMessage || `Hello. I'm ${charNames[charKey]}.`;
        const cleanGreeting = greeting.replace(/\{\{user\}\}/gi, 'you');

        setTimeout(() => {
            hideMobileBotTyping();
            botChatHistory[charKey].push({ from: 'bot', text: cleanGreeting });
            botConversationHistory[charKey].push({ role: 'assistant', content: greeting });
            renderMobileBotChatMessages(charKey);
            playSound('chime');
        }, 1500 + Math.random() * 1000);
    } else {
        renderMobileBotChatMessages(charKey);
    }
}

function splitRoleplayAndDialogue(text) {
    const actions = [];
    const dialogue = text
        .replace(/\*([^*]+)\*/g, (_, action) => {
            actions.push(action.trim());
            return '';
        })
        .replace(/\s+/g, ' ')
        .trim();
    return { actions, dialogue };
}


function renderBotChatMessages(charKey) {
    const container = document.getElementById('botChatMessages');
    if (!container) return;
    container.innerHTML = '';

    const history = botChatHistory[charKey] || [];
    history.forEach((msg, i) => {
        const isNew = i === history.length - 1;
        const isBot = msg.from === 'bot';
        const color = charColors[isBot ? charKey : 'you'];
        const username = isBot ? charNames[charKey] : 'you';
        const avatar = isBot ? charFaces[charKey] : undefined;
        let text = msg.text;
        let action = '';
        if (isBot) {
            const parts = splitRoleplayAndDialogue(msg.text);
            action = parts.actions.join(' ');
            text = parts.dialogue;
        }
        const el = document.createElement('div');
        el.innerHTML = renderChatMessage({ username, color, text, action, avatar }, !isNew);
        container.appendChild(el.firstElementChild);
    });

    const last = container.lastElementChild;
    if (last && !last.classList.contains('visible')) {
        requestAnimationFrame(() => last.classList.add('visible'));
    }
    forceScrollBottom(container);
}

function handleBotChatKeypress(event) {
    if (event.key === 'Enter') {
        sendBotMessage();
    }
}

// Build system prompt from character data
function buildSystemPrompt(characterData) {
    let systemPrompt = `You are ${characterData.name}, a ${characterData.characterType || characterData.botType || 'character'}.\n\n`;

    if (characterData.scenario) {
        systemPrompt += `Scenario: ${characterData.scenario}\n\n`;
    }

    if (characterData.description) {
        systemPrompt += `Description: ${characterData.description}\n\n`;
    }

    if (characterData.mbti) {
        systemPrompt += `MBTI: ${characterData.mbti}\n`;
    }
    if (characterData.enneagram) {
        systemPrompt += `Enneagram: ${characterData.enneagram}\n`;
    }

    if (characterData.personality && Array.isArray(characterData.personality)) {
        systemPrompt += `\nPersonality traits:\n`;
        characterData.personality.forEach(trait => {
            systemPrompt += `- ${trait}\n`;
        });
    }

    if (characterData.exampleDialogue && characterData.exampleDialogue.length > 0) {
        systemPrompt += `\nExample dialogue style:\n`;
        characterData.exampleDialogue.slice(0, 3).forEach(dialogue => {
            systemPrompt += `- ${dialogue}\n`;
        });
    }

    systemPrompt += `\nStay in character at all times. Respond as ${characterData.name} would, using the personality traits and speech patterns described above.\n\nIMPORTANT RULES — read carefully:\n- Output ONLY spoken dialogue. Nothing else.\n- NEVER include action descriptions, narration, stage directions, or scene-setting in ANY form. This includes:\n  * asterisks (*sighs*, *looks away*, *crosses arms*)\n  * underscores (_smiles_, _whispers_)\n  * parentheses ((rolls eyes), (under his breath))\n  * brackets ([leans closer])\n  * plain prose narration ("She turned away and said...")\n- Do NOT describe what the character does, feels, or how they say something. Only what they SAY out loud.\n- Keep responses SHORT — 1-2 sentences max, like real texting.\n- This is a chat app. Write like a text message: only the words the character would type or speak, never narration.`;

    return systemPrompt;
}

async function sendBotMessage() {
    const input = document.getElementById('botChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text || !currentBotKey || isWaitingForResponse) return;

    playSound('click');
    isWaitingForResponse = true;

    // Add user message to display history
    botChatHistory[currentBotKey].push({ from: 'user', text: text });
    renderBotChatMessages(currentBotKey);
    input.value = '';

    // Add to API conversation history
    botConversationHistory[currentBotKey].push({ role: 'user', content: text });

    // Show typing indicator
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    showBotTyping();

    try {
        const characterData = characters[currentBotKey];
        const systemPrompt = buildSystemPrompt(characterData);
        const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/api/chat'
            : '/.netlify/functions/chat';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: botConversationHistory[currentBotKey],
                system: systemPrompt
            })
        });

        hideBotTyping();

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.content || !data.content[0]) {
            throw new Error('Invalid API response');
        }

        const assistantMessage = data.content[0].text;

        // Add to conversation histories
        botConversationHistory[currentBotKey].push({ role: 'assistant', content: assistantMessage });

        botChatHistory[currentBotKey].push({ from: 'bot', text: assistantMessage });
        renderBotChatMessages(currentBotKey);
        playSound('chime');

    } catch (error) {
        console.error('Chat error:', error);
        hideBotTyping();
        botChatHistory[currentBotKey].push({ from: 'bot', text: `Error: ${error.message}` });
        renderBotChatMessages(currentBotKey);
    } finally {
        isWaitingForResponse = false;
    }
}

function showBotTyping() {
    const container = document.getElementById('botTypingContainer');
    if (container) container.innerHTML = `<span class="typing-indicator">${charNames[currentBotKey]} is typing<span class="typing-dots">...</span></span>`;
}

function hideBotTyping() {
    const container = document.getElementById('botTypingContainer');
    if (container) container.innerHTML = '';
}

// ============ BOT GROUP CHAT ============
let groupChatData = null;
let groupChatTimer = null;
let groupChatIndex = 0;

async function loadGroupChat() {
    if (groupChatData) return groupChatData;
    const res = await fetch('group-chat.json');
    groupChatData = await res.json();
    return groupChatData;
}

async function openBotGroupChat() {
    closeAllWindows();
    document.getElementById('groupChatWindow').classList.add('active');
    showChatFloatClose(closeGroupChat);
    playSound('open');
    setOverlay(true);
    taskbarAdd('groupChatWindow', 'bot group chat', '<path d="M15 20 C15 16,19 12,25 12 L55 12 C61 12,65 16,65 20 L65 42 C65 46,61 50,55 50 L30 50 L20 60 L20 50 L25 50 C19 50,15 46,15 42 Z" fill="#555"/><circle cx="30" cy="31" r="3" fill="#777"/><circle cx="40" cy="31" r="3" fill="#777"/><circle cx="50" cy="31" r="3" fill="#777"/>');
    startGroupChatReplay();
}

function closeGroupChat() {
    document.getElementById('groupChatWindow').classList.remove('active');
    if (groupChatTimer) { clearTimeout(groupChatTimer); groupChatTimer = null; }
    hideChatFloatClose();
    playSound('close');
    setOverlay(false);
    taskbarRemove('groupChatWindow');
}

const gcCharMap = {
    eleanor:  { username: 'rich dommy mommy who takes care of you',  color: '#FF8AF7' },
    victoria: { username: 'evil bully wife',                         color: '#EAF000' },
    chloe:    { username: 'expressionless woman',                    color: '#90F1EF' },
    minho:    { username: 'loving korean boyfriend',                 color: '#7AE89C' },
    luna:     { username: 'mental chastity girlfriend',              color: '#C9A8FF' },
    priest:   { username: 'judgemental priest',                      color: '#FFA07A' },
    logan:    { username: 'traumatized military man',                color: '#87CEEB' },
};

async function startGroupChatReplay() {
    const container = document.getElementById('groupChatMessages');
    const typing = document.getElementById('groupChatTyping');
    if (!container) return;

    if (groupChatTimer) { clearTimeout(groupChatTimer); groupChatTimer = null; }
    container.innerHTML = '';
    groupChatIndex = 0;

    const messages = await loadGroupChat();

    const PRELOAD = 1;
    for (let i = 0; i < Math.min(PRELOAD, messages.length); i++) {
        const m = messages[i];
        const info = gcCharMap[m.char] || { username: m.char, color: 'rgba(249,248,248,0.5)' };
        container.insertAdjacentHTML('beforeend', renderGroupChatMessage({ username: info.username, color: info.color, text: m.text }, true));
    }
    groupChatIndex = PRELOAD;
    forceScrollBottom(container);
    typing.innerHTML = `<span class="gc-typing">…</span>`;

    function scheduleNext() {
        if (groupChatIndex >= messages.length) { typing.innerHTML = ''; return; }
        const msg = messages[groupChatIndex];
        const charInfo = gcCharMap[msg.char] || { username: msg.char, color: '#9ca3af' };

        typing.innerHTML = `<span class="gc-typing">${charInfo.username} is typing…</span>`;
        autoScroll(container);

        groupChatTimer = setTimeout(() => {
            typing.innerHTML = '';
            const rendered = renderGroupChatMessage({ username: charInfo.username, color: charInfo.color, text: msg.text }, true);
            container.insertAdjacentHTML('beforeend', rendered);
            autoScroll(container);
            groupChatIndex++;
            scheduleNext();
        }, msg.delay);
    }

    scheduleNext();
}

// ============ MOBILE CHAT SYSTEM ============
function toggleMobileChat() {
    const overlay = document.getElementById('mobileChatOverlay');
    const backdrop = document.getElementById('mobileChatBackdrop');
    const isOpening = !overlay.classList.contains('active');
    overlay.classList.toggle('active');
    backdrop.classList.toggle('active');
    playSound(isOpening ? 'open' : 'close');
}

function switchMobileChatView(view) {
    document.getElementById('mobileBotChatView').classList.toggle('active', view === 'bot');
    document.getElementById('groupChatView').classList.toggle('active', view === 'group');
}

// Sync messages to mobile chat
function addMessageToMobile(text, sender) {
    const mobileChatMessages = document.getElementById('mobileChatMessages');
    if (!mobileChatMessages) return;

    const line = document.createElement('div');
    line.className = 'chat-line';
    line.innerHTML = `<span class="chat-name ${sender}">${charNames[sender]}:</span> <span class="chat-text">${text}</span>`;
    mobileChatMessages.appendChild(line);
    mobileChatMessages.scrollTop = mobileChatMessages.scrollHeight;
}

function showMobileTypingIndicator(typers) {
    const container = document.getElementById('mobileTypingIndicatorContainer');
    if (!container) return;

    if (!typers || typers.length === 0) {
        container.innerHTML = '';
        return;
    }

    let html;
    if (typers.length > 1) {
        html = `<span class="typing-indicator">Multiple bots typing<span class="typing-dots medium">...</span></span>`;
    } else {
        const key = typers[0];
        const speed = charTypingSpeeds[key] || 'medium';
        html = `<span class="typing-indicator">${charNames[key]} is typing<span class="typing-dots ${speed}">...</span></span>`;
    }

    container.innerHTML = html;
}

// Mobile bot chat functions
function handleMobileBotChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMobileBotMessage();
    }
}

async function sendMobileBotMessage() {
    const input = document.getElementById('mobileBotChatInput');
    const text = input.value.trim();
    if (!text || !currentBotKey || isWaitingForResponse) return;

    playSound('click');
    isWaitingForResponse = true;

    // Add user message to both displays
    botChatHistory[currentBotKey].push({ from: 'user', text: text });
    renderBotChatMessages(currentBotKey);
    renderMobileBotChatMessages(currentBotKey);
    input.value = '';

    // Add to API conversation history
    botConversationHistory[currentBotKey].push({ role: 'user', content: text });

    // Show typing indicator
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    showMobileBotTyping();

    try {
        const characterData = characters[currentBotKey];
        const systemPrompt = buildSystemPrompt(characterData);
        const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/api/chat'
            : '/.netlify/functions/chat';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: botConversationHistory[currentBotKey],
                system: systemPrompt
            })
        });

        hideMobileBotTyping();

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.content || !data.content[0]) {
            throw new Error('Invalid API response');
        }

        const assistantMessage = data.content[0].text;

        // Add to conversation histories
        botConversationHistory[currentBotKey].push({ role: 'assistant', content: assistantMessage });

        botChatHistory[currentBotKey].push({ from: 'bot', text: assistantMessage });
        renderBotChatMessages(currentBotKey);
        renderMobileBotChatMessages(currentBotKey);
        playSound('chime');

    } catch (error) {
        console.error('Chat error:', error);
        hideMobileBotTyping();
        botChatHistory[currentBotKey].push({ from: 'bot', text: `Error: ${error.message}` });
        renderBotChatMessages(currentBotKey);
        renderMobileBotChatMessages(currentBotKey);
    } finally {
        isWaitingForResponse = false;
    }
}

function showMobileBotTyping() {
    const container = document.getElementById('mobileBotTypingContainer');
    if (!container) return;
    container.innerHTML = `<span class="typing-indicator">${charNames[currentBotKey]} is typing<span class="typing-dots">...</span></span>`;
}

function hideMobileBotTyping() {
    const container = document.getElementById('mobileBotTypingContainer');
    if (container) container.innerHTML = '';
}

function renderMobileBotChatMessages(charKey) {
    const container = document.getElementById('mobileBotChatMessages');
    if (!container) return;
    container.innerHTML = '';

    const history = botChatHistory[charKey] || [];
    history.forEach((msg, i) => {
        const isNew = i === history.length - 1;
        const isBot = msg.from === 'bot';
        const color = charColors[isBot ? charKey : 'you'];
        const username = isBot ? charNames[charKey] : 'you';
        const avatar = isBot ? charFaces[charKey] : undefined;
        let text = msg.text;
        let action = '';
        if (isBot) {
            const parts = splitRoleplayAndDialogue(msg.text);
            action = parts.actions.join(' ');
            text = parts.dialogue;
        }
        const el = document.createElement('div');
        el.innerHTML = renderChatMessage({ username, color, text, action, avatar }, !isNew);
        container.appendChild(el.firstElementChild);
    });

    const last = container.lastElementChild;
    if (last && !last.classList.contains('visible')) {
        requestAnimationFrame(() => last.classList.add('visible'));
    }
    forceScrollBottom(container);
}

// Sync mobile bot chat when opening a bot
function syncMobileBotChat(charKey) {
    document.getElementById('mobileBotChatEmpty').style.display = 'none';
    document.getElementById('mobileBotChatContainer').style.display = 'flex';
    document.getElementById('mobileBotChatAvatar').src = charFaces[charKey] || '';
    document.getElementById('mobileBotChatName').textContent = charNames[charKey];

    // Load chat history using shared render function
    renderMobileBotChatMessages(charKey);
}

// Override openBotChat to also sync mobile
const originalOpenBotChat = openBotChat;
openBotChat = function(charKey) {
    originalOpenBotChat(charKey);
    syncMobileBotChat(charKey);
    // Switch mobile to bot view
    switchMobileChatView('bot');
};

// Override addMessage to also add to mobile
const originalAddMessage = addMessage;
addMessage = function(text, sender) {
    originalAddMessage(text, sender);
    addMessageToMobile(text, sender);
};

// Override showTypingIndicator to also show on mobile
const originalShowTypingIndicator = showTypingIndicator;
showTypingIndicator = function(typers) {
    originalShowTypingIndicator(typers);
    showMobileTypingIndicator(typers);
};

// Override hideTypingIndicator to also hide on mobile
const originalHideTypingIndicator = hideTypingIndicator;
hideTypingIndicator = function() {
    originalHideTypingIndicator();
    showMobileTypingIndicator([]);
};

