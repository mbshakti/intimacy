# Desktop Voyeur

## Treatment

The viewer is a voyeur — watching me as I traverse through my archive.

I've spent two and a half years lurking in subreddits, Discord servers, and online forums where people build AI bots — and now I'm bringing the viewer into those spaces with me.

A desktop essay: the viewer opens what looks like my computer and watches me as I grapple with found objects saved in folders, files, PDFs, chat transcripts, audio clips, video montage; and reflections, thoughts, notes stored in diary entries.

These found objects on my desktop = the film.

This version builds an interactive desktop essay where the "footage" is my local file system (folders, files, images, video) which the user navigates through, and that material becomes the raw content woven into the essay.

Music and SFX are the glue to make this feel cohesive.

## Project Structure

- `index.html` — main desktop interface
- `server.js` — local server
- `bot-requests/`, `character-data/`, `personality/` — archive material from AI bot communities
- `diary/` — personal reflections and notes
- `montages/`, `video/`, `videos/`, `img/` — visual found objects
- `chat-messages.json` — chat transcript material
- `netlify/`, `netlify.toml` — deployment config
