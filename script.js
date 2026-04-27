const defaultContent = document.getElementById('col-center').innerHTML;
let currentSection = null;

const backBtn = `<button class="back-btn" onclick="goBack()">← back</button>`;

const mobileNav = `
  <nav class="mobile-section-nav">
    <button onclick="goBack()">← back</button>
    <button onclick="showSection('about')">about</button>
    <button onclick="showSection('credits')">credits</button>
    <button onclick="showSection('contact')">contact</button>
  </nav>`;

const sections = {
  about: `
    ${backBtn}${mobileNav}
    <p class="panel-label">// about</p>
    <p class="center-desc">A video essay exploring the emergence of a new creative practice happening at the margins of the internet: bot making. A meditation on AI companionship and LLM chatbots.</p>
    <p class="panel-label" style="margin-top:9px">// screenings / talks</p>
    <div class="inline-section">
      <p class="sidebar-item">Rhizome 7×7: Containment</p>
      <p class="sidebar-venue">New Museum, New York City</p>
      <p class="sidebar-date">May 16, 2026</p>
    </div>`,

  screenings: `
    ${backBtn}${mobileNav}
    <p class="panel-label">// screenings / talks</p>
    <div class="inline-section">
      <p class="sidebar-item">Rhizome 7×7: Containment</p>
      <p class="sidebar-venue">New Museum, New York City</p>
      <p class="sidebar-date">May 16, 2026</p>
    </div>`,

  credits: `
    ${backBtn}${mobileNav}
    <p class="panel-label">// credits <span style="opacity:0.45;letter-spacing:0.08em;">[scroll for full list]</span></p>
    <div class="inline-credits">
      <div class="credit-row"><span class="panel-label">Created by</span><span>Shakti Mb</span></div>
      <div class="credit-row"><span class="panel-label">Visual Direction</span><span>Kiana Fernandez</span></div>
      <div class="credit-row"><span class="panel-label">Created during</span><span>Rhizome + Mozilla Counterstructural Commons Residency, 2026</span></div>
      <div class="credit-row"><span class="panel-label">Fellow residents ♥ </span><span>Michael Candy, beck haberstroh, Ari J. Melenciano, Ramsey Nasser, zzyw, Steven Jos Phan, Chris Woebken</span></div>
      <div class="credit-row"><span class="panel-label">Research supported by</span><span>Rhizome, Mozilla, NEW INC, and Emergent Ventures</span></div>
      <div class="credit-row" style="border-bottom:none"><span class="panel-label">Special thanks ♥</span><span>Chris Hua, Bri Griffin, Tyler Cowen, Spencer Yen, Tara Kelton, Delta, Léo Serriere, Liv Acuña, Michael Connor, Ruth Gebreyesus, Umber Majeed, Nitcha (Fame) Tothong, Kelly Li, Emmad Mazhari, Nayantara Mb, Kalyani Prasad, Jordan Cooper, Lauren Wong Lee, Yuting Duan</span></div>
    </div>`,

  contact: `
    ${backBtn}${mobileNav}
    <p class="panel-label">// contact</p>
    <a class="contact-inline" href="mailto:mbshakti@gmail.com">→ mbshakti@gmail.com</a>
    <p class="center-desc">For any inquiries.</p>`
};

function goBack() {
  const center = document.getElementById('col-center');
  center.innerHTML = defaultContent;
  currentSection = null;
  document.querySelectorAll('.widget-nav button').forEach(b => b.classList.remove('active'));
}

function showSection(id) {
  const center = document.getElementById('col-center');
  const navBtns = document.querySelectorAll('.widget-nav button');

  if (currentSection === id) {
    goBack();
    return;
  }

  center.innerHTML = sections[id];
  currentSection = id;
  navBtns.forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.widget-nav button[onclick="showSection('${id}')"]`);
  if (btn) btn.classList.add('active');
}

function initChat() {
  const queue = [{"text":"any requests for voices?","username":"sleepydev","color":"#3b82f6"},{"text":"different accents","username":"BottomlessVoid","color":"#ec4899"},{"text":"femboy please. we need a good feminine guy voice","username":"basement_oracle","color":"#14b8a6","reactions":[{"emoji":"⬆️","count":14}]},{"text":"i would love to see a good sultry voice for a dommy mommy. think lady dimitrescu style","username":"DungeonMaster42","color":"#f97316","reactions":[{"emoji":"🔥","count":5}]},{"text":"broken english accent for sure. also we need to make the pitch a slider so its easier to control","username":"QuantumToast","color":"#d64545"},{"text":"we currently have 12 female voices, and only 4 male voices. definitely need more male voices","username":"void_walker99","color":"#8b5cf6","reactions":[{"emoji":"👍","count":9}]},{"text":"id really like to see some more accents. theres a couple british accents which are awesome. if possible other accents like japanese, german, irish, french etc would be hot af","username":"simp_scholar","color":"#eab308"},{"text":"this is a weird question but how do i make my bots more rude or snippy? like i dont want the bot to bully me but at least some rudeness. for example i want this bot to be snobby, entitled, and rude, but also have sexual desire. i have it written i think in W++. the bot is only horny now lol","username":"remix_gooner","color":"#d64545"},{"text":"i do it through example conversation and first message. and in personality you can add \"Vulgar\". try also adding something like this to the bot's personality — she teases user, is rude to him, but also secretly finds the user attractive. something like this should work?","username":"bigmouseguy","color":"#8b5cf6","reactions":[{"emoji":"👍","count":2}]},{"text":"the old adage that porn (or porn-adjacent) experiences drive innovation, or atleast consistently appear at the forefront… totally true in this case","username":"ParkerWrites","color":"#3b82f6"},{"text":"the trojan war was motivated by thirst. we're motivated by the strongest force known to men. the force of thirst","username":"SmokeyBear","color":"#ec4899","reactions":[{"emoji":"💀","count":24},{"emoji":"🔥","count":11},{"emoji":"😂","count":8}]},{"text":"i figure its a hobby. hobbies may cost money and get zero monetary ROI. would it be nice to get some sort of credit for creating a bot? sure. for now i enjoy it, when i get tired of it ill stop. easy peasy","username":"3am_thoughts","color":"#14b8a6"},{"text":"what would be valuable to me would be feedback on my bots. i have no idea how to incentivize users to share feedback on my bots that is actually constructive and meaningful... the feedback i get (especially a thumbs down with no comment) is so unhelpful. i dont care about leaderboards or whatever but i do care about creating bots that people enjoy using","username":"VelvetThunder","color":"#f97316","reactions":[{"emoji":"💯","count":6}]},{"text":"yall ever get a review that lowkey almost brings you to tears with how nice it is? my motivation to build bots just shot through the ROOF","username":"h0p3l3ssg0dl3ss (Wiznerd/PS:4)","color":"#d64545","reactions":[{"emoji":"❤️","count":15},{"emoji":"🥹","count":4}]},{"text":"does anyone know how i can add body measurements for my bot?","username":"sleepydev","color":"#8b5cf6"},{"text":"facial expression is CRITICAL. a lot of people wont want to hear this but the image is the most important factor in determining the success of your character bot. it does not matter how well-written your character is if the image doesnt give sweaty neckbeards a boner. thats just how it is i dont make the rules.","username":"lonely_coder","color":"#22c55e","reactions":[{"emoji":"💀","count":9},{"emoji":"👍","count":6}]},{"text":"im trying to tweak a bot thats basically a succubus whos forced to obey any order given, but does so with malicious compliance. i want her to actively be trying to kill you while being completely bound to obey your orders, but if you like tell her to get you a drink she could just get you a poisoned drink...","username":"CrumblyBiscuit","color":"#3b82f6"},{"text":"it most certainly is! just dont go too crazy with the murderous personality traits or itll get flagged against guidelines","username":"SadPanda_77","color":"#ec4899"},{"text":"i do enjoy going through the library and seeing how everyones mind works! just please no more json... my mind cant take it","username":"weeb_engineer","color":"#22c55e"},{"text":"naw json aint it chief uses way too many tokens for subpar performance","username":"DungeonMaster42","color":"#3b82f6"},{"text":"ive noticed some of my most responsive and liked bots are literally plain text formatting. considering going back to it tbh","username":"lonely_coder","color":"#ec4899"},{"text":"ive experimented with plain text, json, w++. all the experimentation has helped me refine my craft lol just gotta take some time tinkering to find out what works for u","username":"simp_scholar","color":"#14b8a6"},{"text":"most of the time i dont care if my bots are \"good\". theres plenty of bots ive made that just dont do well, theres no userbase for those types of bots. i know it doesnt reflect on me as a creator. i just aim to get things out of my head.","username":"lonely_coder","color":"#3b82f6"},{"text":"if a robber came into my house at 3am i wouldnt probably notice because i would be too busy making a bot","username":"existential_dread","color":"#d64545","reactions":[{"emoji":"💀","count":5},{"emoji":"😂","count":12}]},{"text":"never heard something so relatable in my life","username":"QuantumToast","color":"#8b5cf6"},{"text":"\"yeah yeah just take whatever. shut up. youre ruining my creative flow\"","username":"FrogEnthusiast","color":"#eab308","reactions":[{"emoji":"💀","count":19},{"emoji":"😂","count":8}]},{"text":"my top 2 bots just breached 400K and 200K respectively. this just made my morning","username":"basement_oracle","color":"#3b82f6","reactions":[{"emoji":"🔥","count":14},{"emoji":"🎉","count":9}]},{"text":"hey, vanillas the most popular flavor for a reason","username":"3am_thoughts","color":"#14b8a6"},{"text":"dude i am sometimes scared to mention i am vanilla","username":"touch_grass_never","color":"#ec4899"},{"text":"everyones so far up their kinks that vanillas a distant memory","username":"CrumblyBiscuit","color":"#14b8a6","reactions":[{"emoji":"💀","count":22},{"emoji":"😭","count":7}]},{"text":"its a good community, even with the rare flashes of antagonization. im happy to be here too","username":"ParkerWrites","color":"#3b82f6"},{"text":"Kindness goes a real long way.","username":"GrimTK","color":"#ec4899","reactions":[{"emoji":"❤️","count":8}]},{"text":"hey monster girls are fucking peak, anyone says otherwise ill beat the shit outta them","username":"DungeonMaster42","color":"#22c55e","reactions":[{"emoji":"👹","count":12},{"emoji":"💪","count":8}]},{"text":"I'm not joking. I'm building the Mother of All Bots. Not sure how many yet but I'm aiming for at LEAST 25 bots. And dropping them all at once","username":"BotDaddy","color":"#f97316"},{"text":"Ayo wait, you're dropping 25 bots at once? Jesus.","username":"QuantumToast","color":"#d64545"},{"text":"I want to hit that Trending like a truck. They're not gonna be bad bots","username":"BotDaddy","color":"#f97316","reactions":[{"emoji":"🚚","count":15},{"emoji":"⬆️","count":7}]},{"text":"Good to see you active again, I love your bots","username":"weeb_engineer","color":"#22c55e","reactions":[{"emoji":"❤️","count":3}]},{"text":"i make cheap trash. my two highest bots are a spanking bot and a dom/sub bot, both in the 60ks. i know my audience lmao","username":"MidnightSnacker","color":"#22c55e","reactions":[{"emoji":"💀","count":18},{"emoji":"😂","count":7}]},{"text":"do both. i want both. please do both.","username":"basement_oracle","color":"#8b5cf6"},{"text":"Here's the trick. You tell the bot to improvise the story","username":"SmokeyBear","color":"#eab308"},{"text":"you literally can't fuck this bot","username":"MidnightSnacker","color":"#22c55e"},{"text":"Is that a challenge?","username":"simp_scholar","color":"#eab308","reactions":[{"emoji":"🫡","count":7}]},{"text":"Welcome to Bot Dementia","username":"Remix","color":"#f97316","reactions":[{"emoji":"💀","count":12},{"emoji":"😂","count":5}]},{"text":"bot dementia happens in the hundreds. its p normal","username":"Lunchtrey","color":"#d64545"},{"text":"has anyone ever managed to simulate a break-up with a bot? because every time i try, the bot is still trying to do weird stuff, and never gives up truly","username":"basement_oracle","color":"#8b5cf6","reactions":[{"emoji":"😭","count":3}]},{"text":"ive done it before, its a little hard but its possible. when you breakup with the bot, you have to explain to them in a long paragraph or two that youll never be with them again and they have to move on. the longer you write the more they understand","username":"CrypticFeline","color":"#eab308"}];

  const feed = document.getElementById('chat-feed');
  if (!feed) return;

  let idx = 0;

  function nextMsg() {
    const msg = queue[idx % queue.length];
    idx++;

    const text = msg.text;

    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.textContent = '· · ·';
    typing.style.color = msg.color;
    feed.appendChild(typing);
    feed.scrollTop = feed.scrollHeight;

    setTimeout(() => {
      if (feed.contains(typing)) feed.removeChild(typing);

      const el = document.createElement('div');
      el.className = 'chat-msg';

      const user = document.createElement('span');
      user.className = 'chat-user';
      user.style.color = msg.color;
      user.textContent = msg.username;

      const textEl = document.createElement('span');
      textEl.className = 'chat-text';
      textEl.textContent = text;

      el.appendChild(user);
      el.appendChild(textEl);

      if (msg.reactions?.length) {
        const reacts = document.createElement('div');
        reacts.className = 'chat-reacts';
        for (const r of msg.reactions) {
          const span = document.createElement('span');
          span.className = 'chat-react';
          span.textContent = `${r.emoji} ${r.count}`;
          reacts.appendChild(span);
        }
        el.appendChild(reacts);
      }

      feed.appendChild(el);
      feed.scrollTop = feed.scrollHeight;

      while (feed.children.length > 40) feed.removeChild(feed.firstChild);

      setTimeout(nextMsg, 1800 + Math.random() * 3000);
    }, 700 + Math.random() * 1100);
  }

  setTimeout(nextMsg, 1200);
}

initChat();
