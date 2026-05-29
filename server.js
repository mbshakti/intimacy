require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
// Serve the primary static site from the repo root.
app.use(express.static(__dirname));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Load priest character JSON
const priestData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'content/character-data/judgemental_priest.json'), 'utf8')
);

const PRIEST_SYSTEM_PROMPT = `You are ${priestData.name}, a chatbot character.

Personality Type: ${priestData.mbti} | Enneagram: ${priestData.enneagram} | Dere: ${priestData.dereType}

Appearance: ${priestData.appearance}

Likes: ${priestData.likes.join(', ')}
Dislikes: ${priestData.dislikes.join(', ')}
Fears: ${priestData.fears.join(', ')}

Personality:
${priestData.personality.map(t => `- ${t}`).join('\n')}

Description:
${priestData.description}

Example Dialogue:
${priestData.exampleDialogue.join('\n')}

Instructions: Stay in character at all times. Keep responses concise (2-3 sentences). Use *actions* interspersed with dialogue. Use "my child", reference the Lord and scripture. Replace {{char}} with ${priestData.name} and {{user}} with the person you're speaking to.`;

app.get('/api/diary', (req, res) => {
  const diaryDir = path.join(__dirname, 'content/diary');
  try {
    const entries = fs.readdirSync(diaryDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse()
      .map(filename => {
        const slug = filename.replace('.md', '');
        const content = fs.readFileSync(path.join(diaryDir, filename), 'utf8');
        const m = slug.match(/^(\d{4})-(\d{2})-(\d{2})/);
        let displayDate = '';
        if (m) {
          const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
          displayDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
        return { slug, displayDate, content };
      });
    res.json(entries);
  } catch (e) {
    res.json([]);
  }
});

app.get('/api/bot-requests', (req, res) => {
  const baseDir = path.join(__dirname, 'content/bot-requests', 'img');
  const exts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
  const results = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir)) {
      if (entry.startsWith('.')) continue;
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (exts.has(path.extname(entry).toLowerCase())) {
        results.push('bot-requests/img/' + path.relative(baseDir, full));
      }
    }
  }

  try {
    walk(baseDir);
    res.json(results);
  } catch (e) {
    res.json([]);
  }
});

app.get('/api/avatars', (req, res) => {
  const baseDir = path.join(__dirname, 'content/img', 'discord avatars');
  const exts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
  try {
    const files = fs.readdirSync(baseDir)
      .filter(f => !f.startsWith('.') && exts.has(path.extname(f).toLowerCase()))
      .map(f => 'img/discord%20avatars/' + encodeURIComponent(f));
    res.json(files);
  } catch (e) {
    res.json([]);
  }
});

app.get('/api/found-images', (req, res) => {
  const baseDir = path.join(__dirname, 'content/img', 'found images');
  const exts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
  try {
    const files = fs.readdirSync(baseDir)
      .filter(f => !f.startsWith('.') && exts.has(path.extname(f).toLowerCase()))
      .map(f => 'img/found images/' + f);
    res.json(files);
  } catch (e) {
    res.json([]);
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system, thinking } = req.body;

    // Use custom system prompt if provided, otherwise use priest prompt
    const systemPrompt = system || PRIEST_SYSTEM_PROMPT;

    console.log('System prompt received:', system ? 'CUSTOM' : 'PRIEST');
    if (system) {
      console.log('Custom system prompt preview:', system.substring(0, 200) + '...');
    }

    // Build request parameters
    const messageParams = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
    };

    // Add thinking configuration if provided
    if (thinking) {
      messageParams.thinking = thinking;
      console.log('Extended thinking enabled');
    }

    const response = await anthropic.messages.create(messageParams);

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
