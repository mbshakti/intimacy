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

async function initChat() {
  let data;
  try {
    const res = await fetch('chat-messages.json');
    data = await res.json();
  } catch(e) { return; }

  const feed = document.getElementById('chat-feed');
  if (!feed) return;

  const queue = [];
  for (const src of ['maker-chat', 'maker-help']) {
    for (const item of data[src]) {
      if (Array.isArray(item)) queue.push(...item);
      else queue.push(item);
    }
  }

  let idx = 0;

  function nextMsg() {
    const msg = queue[idx % queue.length];
    idx++;

    const text = msg.text.replace(/<[^>]*>/g, '').trim();
    if (!text) { nextMsg(); return; }

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
