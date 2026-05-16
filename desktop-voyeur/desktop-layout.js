// Desktop canvas layout, organised by topic band, mapped to script.md PART 1-5.
//
// HOW TO EDIT:
//   - Each band is a horizontal section on the canvas.
//   - To move an item to a different topic: cut its entry, paste it under the
//     target topic's array. Adjust `y` (offset within that band) so it lands
//     where you want.
//   - `y` is relative to the band's top (0 = top of band).
//   - `x` is the absolute horizontal position.
//   - Within a topic, items are CURATED (not chronological); arrange by feel.
//
// Item types:
//   diary          -> openDiaryBySlug(slug)            (text-only)
//   voice-memo     -> toggleVoiceMemo(event, slug)     (audio + transcript link)
//                     Optional: audioPath, showPlayBtn
//   diary-folder   -> openDiaryFolder()
//   character      -> openCharacterFile(char)
//   bot-chat       -> openBotChat(char)
//   creator-chat   -> openCreatorChat(channel)
//   msg-card       -> openMessageCard(mayIndex)        (single msg/thread from chat-messages-may-2026.json)
//   group-chat     -> openBotGroupChat()
//   folder         -> openFolder(folder)

window.DESKTOP_LAYOUT = {
  bands: [
    { id: 'intro',     label: 'intro',     top: 0,    height: 900  }, // PART 1, opening hook
    { id: 'delta',     label: 'delta',     top: 900,  height: 1200 }, // material specifically about Delta
    { id: 'community', label: 'community', top: 2100, height: 4000 }, // PART 2, bot-makers, guides, char-requests
    { id: 'craft',     label: 'craft',     top: 6100, height: 3400 }, // PART 3, characters, dere, constraints, platforms & labour
    { id: 'user',      label: '{{user}}',  top: 9500, height: 1400 }, // PART 4, roleplay, play, addiction
    { id: 'margins',   label: 'margins',   top: 10900, height: 1700 }, // PART 5, why at the margins
  ],

  items: {
    // ============================================================
    // INTRO, PART 1: priest opens the script as the hook,
    // dinner thesis, finding Delta, "characters in head"
    // ============================================================
    intro: [
      { type: 'voice-memo', y: 60,  x: 600, slug: 'chris-waifus',
        audioPath: 'chris/chris, AI waifus.mp3', showPlayBtn: true,
        label: 'guys want AI waifus',               meta: 'Chris, AI researcher', portrait: 'img/anime-bitmap/chris.png' },
      { type: 'video-clip', y: 80,  x: 900, key: '60-minutes',
        videoPath: 'video/60 minutes on AI chatbots.mp4',
        thumbnail: 'video/thumbnail.png',
        startTime: 0.13,
        label: '60 minutes on AI chatbots.mp4',    meta: '0:37' },
      { type: 'character',  y: 100, x: 200, char: 'priest',
        label: 'judgemental_priest.json',           meta: '706 tokens' },
      { type: 'voice-memo', y: 220, x: 580, slug: '2023-07-14',
        audioPath: 'diary vo/theyre everywhere.mp3', showPlayBtn: true,
        label: 'the beginning of a trail',          meta: 'my diary', portrait: 'img/anime-bitmap/shakti.png' },
      { type: 'msg-card', y: 340, x: 800, mayIndex: 0, msgFile: 'maker-chat',
        label: 'any requests for voices?',          meta: '7 messages',
        avatars: ['img/discord%20avatars/discord-avatar-06.jpg', 'img/discord%20avatars/discord-avatar-04.jpg', 'img/discord%20avatars/discord-avatar-07.jpg'] },
      { type: 'msg-card', y: 580, x: 720, mayIndex: 0, msgFile: 'intro',
        label: 'would you be up for a quick chat?',  meta: 'Reddit DM' },
    ],

    // ============================================================
    // DELTA, dedicated space for material about Delta the person
    // ============================================================
    delta: [
      { type: 'voice-memo', y: 80,  x: 200, slug: 'delta-first-interaction',
        audioPath: 'delta-anonymized/delta, first interaction.mp3', showPlayBtn: true,
        label: 'first interaction with chatbots',   meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo', y: 100, x: 750, slug: 'delta-fascination',
        audioPath: "delta's quotes/delta, quote, fascination.wav", showPlayBtn: true,
        label: 'what fascinated Delta?',            meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo', y: 200, x: 500, slug: 'delta-ai-weird',
        audioPath: 'delta-anonymized/delta, AI is weird.mp3', showPlayBtn: true,
        label: 'AI is weird',                       meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo', y: 340, x: 150, slug: 'delta-characters-head',
        audioPath: 'delta-anonymized/delta, characters in head.mp3', showPlayBtn: true,
        label: 'characters in her head',            meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo', y: 480, x: 600, slug: 'delta-fascinated',
        audioPath: 'delta-anonymized/delta, fascinated.mp3', showPlayBtn: true,
        label: 'what fascinated her',               meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo', y: 500, x: 150, slug: 'delta-guide-quote',
        audioPath: "delta's quotes/delta, guide help.mp4", showPlayBtn: true,
        label: 'how Delta wrote her guide',         meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo', y: 620, x: 900, slug: 'delta-psychology',
        audioPath: 'delta-anonymized/delta, psychology.mp3', showPlayBtn: true,
        label: 'the psychology of it',              meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'pdf',        y: 780, x: 450, key: 'delta-guide-pdf', path: "delta's quotes/character-creation-guide-02.pdf",
        thumbnail: "delta's quotes/delta-guide-thumbnail.png",
        label: "Delta's Character Creation Guide", meta: 'PDF',
        comments: [
          { handle: 'anon_4729', time: '3y ago', likes: 19,
            avatar: 'img/discord%20avatars/discord-avatar-08.jpg',
            body: 'THIS SAVED MY FUCKING LIFE THANK YOU MY AI ISNT ALL WATTPAD-Y NOW OH MY GOD THANK YOU' },
          { handle: 'anon_8201', time: '3y ago', likes: 7,
            avatar: 'img/discord%20avatars/discord-avatar-06.jpg',
            body: 'This post deserves some awards, my AIs are noticeably better after following it.' },
          { handle: '[deleted]', time: '3y ago', likes: 1,
            avatar: 'img/discord%20avatars/discord-avatar-012.png',
            body: "Thank you so much! This guide helped me improve my characters a LOT. Now they're way more stable in their behaviour." },
        ] },
    ],

    // ============================================================
    // COMMUNITY, PART 2: Delta's guide, makers' channels, requests
    // ============================================================
    community: [
      { type: 'creator-chat', y: 150,  x: 1050, channel: 'maker-help', visible: false,
        label: 'maker help',                       meta: '' },
      { type: 'msg-card',     y: 200,  x: 400,  mayIndex: 9, visible: true, msgFile: 'community',
        label: 'message exchange', meta: '3 messages',
        avatars: ['img/discord%20avatars/discord-avatar-04.jpg', 'img/discord%20avatars/discord-avatar-05.jpg', 'img/discord%20avatars/discord-avatar-06.jpg'] },
      { type: 'creator-chat', y: 380,  x: 180,  channel: 'maker-chat',  visible: false,
        label: 'maker chat',                       meta: '' },
      { type: 'msg-card',     y: 500,  x: 800,  mayIndex: 10, visible: true, msgFile: 'community',
        label: 'message exchange', meta: '4 messages',
        avatars: ['img/discord%20avatars/discord-avatar-09.png', 'img/discord%20avatars/discord-avatar-08.jpg', 'img/discord%20avatars/discord-avatar-010.png'] },
      { type: 'msg-card',     y: 700,  x: 560,  mayIndex: 11, visible: true, msgFile: 'community',
        label: 'message exchange', meta: '1 message',
        avatars: ['img/discord%20avatars/discord-avatar-011.png'] },
      { type: 'folder',       y: 880,  x: 300,  folder: 'creator-guides',
        label: 'Creator Guides',                   meta: '7 items' },
      // Loose message snippets
      { type: 'msg-card', y: 1220, x: 120,  mayIndex: 0,  msgFile: 'community',
        label: 'message exchange',                 meta: '8 messages' },
      { type: 'msg-card', y: 1220, x: 900,  mayIndex: 1,  msgFile: 'community',
        label: 'message exchange',                 meta: '1 message' },
      { type: 'msg-card', y: 1480, x: 200,  mayIndex: 2,  msgFile: 'community',
        label: 'message exchange',                 meta: '1 message' },
      { type: 'msg-card', y: 1480, x: 1000, mayIndex: 3,  msgFile: 'community',
        label: 'message exchange',                 meta: '1 message' },
      { type: 'msg-card', y: 1740, x: 360,  mayIndex: 4,  msgFile: 'community',
        label: 'message exchange',                 meta: '3 messages' },

      // Bot posts + remaining msg-cards interleaved
      { type: 'bot-post', y: 1980, x: 100,  postId: 'seeking-a-bodyguard',
        label: 'Seeking a bodyguard',              meta: 'Монготи Ковинстоко Дэрре', color: '#7c3aed',
        thumbnail: 'bot-requests/img/bodyguard.png' },
      { type: 'bot-post', y: 2200, x: 500,  postId: 'kimono-furry',
        label: 'pinned to the floor',             meta: 'saladful',                 color: '#f97316',
        thumbnail: 'bot-requests/img/kimono furry.png' },
      { type: 'msg-card', y: 2400, x: 720,  mayIndex: 5,  msgFile: 'community',
        label: 'message exchange',                 meta: '2 messages' },
      { type: 'bot-post', y: 2600, x: 880,  postId: 'milf-muffet',
        label: 'Milf Muffet',                      meta: 'Zilkie Einar',             color: '#ec4899',
        thumbnail: 'bot-requests/img/milf-muffet-01.png' },
      { type: 'msg-card', y: 2800, x: 250,  mayIndex: 6,  msgFile: 'community',
        label: 'message exchange',                 meta: '3 messages' },
      { type: 'msg-card', y: 3050, x: 800,  mayIndex: 7,  msgFile: 'community',
        label: 'message exchange',                 meta: '3 messages' },
      { type: 'bot-post', y: 3250, x: 120,  postId: 'road-96',
        label: 'Road 96 RPG',                      meta: 'Dr.EvilZ',                 color: '#ef4444',
        thumbnail: 'bot-requests/img/road 96.png' },
      { type: 'msg-card', y: 3450, x: 550,  mayIndex: 8,  msgFile: 'community',
        label: 'message exchange',                 meta: '2 messages' },
      { type: 'bot-post', y: 3650, x: 900,  postId: 'saladful-robots',
        label: 'robot werewolf problem',           meta: 'saladful',                 color: '#f97316',
        thumbnail: 'bot-requests/img/robot animal.png' },
    ],

    // ============================================================
    // CRAFT, PART 3: character JSONs, dere types, constraints,
    // mbti/enneagram + yandere Delta quotes, platforms & labour
    // ============================================================
    craft: [
      { type: 'msg-card', y: 300,  x: 750, mayIndex: 0, visible: true, msgFile: 'craft',
        label: 'welcome to bot dementia', meta: '3 messages',
        avatars: ['img/discord%20avatars/discord-avatar-08.jpg', 'img/discord%20avatars/discord-avatar-07.jpg', 'img/discord%20avatars/discord-avatar-011.png'] },
      { type: 'msg-card', y: 640,  x: 1050, mayIndex: 1, visible: true, msgFile: 'craft',
        label: 'how to test your bot', meta: '2 messages',
        avatars: ['img/discord%20avatars/discord-avatar-09.png', 'img/discord%20avatars/discord-avatar-010.png'] },
      { type: 'msg-card', y: 1100, x: 450, mayIndex: 2, visible: true, msgFile: 'craft',
        label: 'be careful not to set so many rules', meta: '1 message',
        avatars: ['img/discord%20avatars/discord-avatar-05.jpg'] },
      { type: 'msg-card', y: 1220, x: 420, mayIndex: 3, visible: true, msgFile: 'craft',
        label: 'json vs plain text', meta: '4 messages',
        avatars: ['img/discord%20avatars/discord-avatar-012.png', 'img/discord%20avatars/discord-avatar-04.jpg', 'img/discord%20avatars/discord-avatar-06.jpg', 'img/discord%20avatars/discord-avatar-08.jpg'] },
      { type: 'msg-card', y: 1560, x: 750, mayIndex: 4, visible: true, msgFile: 'craft',
        label: 'simulating a breakup', meta: '2 messages',
        avatars: ['img/discord%20avatars/discord-avatar-07.jpg', 'img/discord%20avatars/discord-avatar-09.png'] },
      { type: 'msg-card', y: 2200, x: 450, mayIndex: 5, visible: true, msgFile: 'craft',
        label: 'body measurements', meta: '2 messages',
        avatars: ['img/discord%20avatars/discord-avatar-010.png', 'img/discord%20avatars/discord-avatar-05.jpg'] },
      { type: 'msg-card', y: 2500, x: 750, mayIndex: 10, visible: true, msgFile: 'craft',
        label: 'is there a fix for bots stuck in a loop?', meta: '8 messages',
        avatars: ['img/discord avatars/discord-avatar-09.png', 'img/discord avatars/discord-avatar-011.png'] },

      { type: 'folder',       y: 160,  x: 600, folder: 'personality-frameworks',
        label: 'personality frameworks',                        meta: '3 items' },
      { type: 'folder',       y: 220,  x: 950, folder: 'character-jsons',
        label: 'character jsons',                              meta: '7 items' },
      { type: 'voice-memo',   y: 920,  x: 200, slug: 'delta-yandere',
        audioPath: "delta's quotes/delta, yandere.mp4", showPlayBtn: true,
        label: 'the character that horrified her',             meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo',   y: 1050, x: 650, slug: 'delta-yandere-anon',
        audioPath: 'delta-anonymized/delta, yandere.mp3', showPlayBtn: true,
        label: 'lovesick and obsessed',                        meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo',   y: 1600, x: 500, slug: 'nadia',
        label: 'contribute without needing to be told to',     meta: 'my diary', portrait: 'img/anime-bitmap/shakti.png' },
    ],

    // ============================================================
    // {{user}}, PART 4: roleplay, Huizinga's play, addiction,
    // bot chats (the experience of using)
    // ============================================================
    user: [
      { type: 'group-chat', y: 100, x: 400, label: 'bot group chat',     meta: '8 members' },
      { type: 'msg-card', y: 420, x: 600, mayIndex: 0, visible: true, msgFile: 'user',
        label: 'that thing disappeared into thin air', meta: '3 messages',
        avatars: ['img/discord%20avatars/discord-avatar-07.jpg'] },
      { type: 'msg-card', y: 860, x: 900, mayIndex: 2, visible: true, msgFile: 'user',
        label: 'two conflicting theories',              meta: '1 message',
        avatars: ['img/discord%20avatars/discord-avatar-011.png'] },
      { type: 'voice-memo', y: 1100, x: 650, slug: 'delta-regenerate',
        audioPath: 'delta-anonymized/delta, regenerate.mp3', showPlayBtn: true,
        label: 'regenerating responses',               meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
      { type: 'voice-memo', y: 1250, x: 300, slug: 'delta-ghost',
        audioPath: 'delta-anonymized/delta, ghost.mp3', showPlayBtn: true,
        label: 'you can ghost them for days',          meta: 'Ex-bot maker', portrait: 'img/anime-bitmap/delta.png' },
    ],

    // ============================================================
    // MARGINS, PART 5: why this is happening at the margins,
    // Houellebecq, hypermodern content, musings on internet
    // ============================================================
    margins: [
      { type: 'msg-card', y: 400, x: 700, mayIndex: 1, visible: true, msgFile: 'margins',
        label: 'creators here know so much more', meta: '3 messages',
        avatars: ['img/discord%20avatars/discord-avatar-04.jpg', 'img/discord%20avatars/discord-avatar-05.jpg', 'img/discord%20avatars/discord-avatar-06.jpg'] },

      { type: 'voice-memo', y: 520, x: 900, slug: 'the-end',
        audioPath: 'diary vo/the end.mp3', showPlayBtn: true,
        label: 'what worlds we long to enter', meta: 'my diary', portrait: 'img/anime-bitmap/shakti.png' },
      { type: 'voice-memo', y: 700, x: 200, slug: 'chris-black-box',
        audioPath: 'chris/chris black box.mp3', showPlayBtn: true,
        label: 'finding signal in black boxes',  meta: 'Chris, AI researcher', portrait: 'img/anime-bitmap/chris.png' },
      { type: 'msg-card',   y: 900,  x: 750, mayIndex: 0, visible: true, msgFile: 'margins',
        label: 'not designed to grow up this lonely',  meta: '1 message',
        avatars: ['img/discord%20avatars/discord-avatar-07.jpg'] },
      { type: 'msg-card',   y: 1100, x: 350, mayIndex: 7, visible: true, msgFile: 'craft',
        label: 'i just aim to get things out of my head', meta: '1 message',
        avatars: ['img/discord%20avatars/discord-avatar-011.png'] },
      { type: 'msg-card',   y: 1300, x: 700, mayIndex: 8, visible: true, msgFile: 'craft',
        label: 'someone turned it into an eco revolution', meta: '2 messages',
        avatars: ['img/discord%20avatars/discord-avatar-09.png', 'img/discord%20avatars/discord-avatar-05.jpg'] },
      { type: 'msg-card',   y: 1550, x: 300, mayIndex: 9, visible: true, msgFile: 'craft',
        label: 'nowhere else can i say this',              meta: '2 messages',
        avatars: ['img/discord%20avatars/discord-avatar-010.png', 'img/discord%20avatars/discord-avatar-04.jpg'] },
      { type: 'msg-card',   y: 1350, x: 550, mayIndex: 1, visible: true, msgFile: 'user',
        label: 'real women have more than 8k of memory',   meta: '1 message',
        avatars: ['img/discord%20avatars/discord-avatar-09.png'] },
    ],
  },

  // Bot-request panels (named requests like "Experiment 0682"). Iterated in
  // creator-chat order and assigned to slots in band-then-array order.
  // All of these are community artifacts.
  // Flat array, indexed by request order in the chat data. Each slot picks
  // its own `band` so any single request can live in any topic.
  botRequestPanels: [
    { band: 'community', y: 280,  x: 1100 }, // [0] Experiment 0682, Ossix Ayto
    { band: 'craft',     y: 2600, x: 200  }, // [1] Seeking a bodyguard
    { band: 'community', y: 800,  x: 980  }, // [2] Mentally Unwell Dad (integrated, slot unused)
    { band: 'community', y: 1000, x: 380,  visible: false }, // [3] Thanos
    { band: 'community', y: 1200, x: 220,  visible: false }, // [4] Leonardo/Malcom
    { band: 'community', y: 1380, x: 900  }, // [5] giant with golden heart
    { band: 'community', y: 1620, x: 480  }, // [6] Dee Leanne Hopfensperger
    { band: 'community', y: 1800, x: 100  }, // [7] succubus
    { band: 'community', y: 1900, x: 1080 }, // [8] Undercover stressful job
    { band: 'community', y: 2100, x: 400  }, // [9] Haunted Costume Shop
    { band: 'community', y: 2280, x: 220  }, // [10] Road 96 RPG Journey Bot
  ],

  imageSlots: { found: {}, botRequest: {} },
};
