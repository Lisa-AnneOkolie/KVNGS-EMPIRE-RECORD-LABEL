# KVNGS EMPIRE — Website

A dark navy & gold website for KVNGS EMPIRE, built as plain HTML/CSS/JS —
no build step, no framework, easy to edit and free to host on GitHub Pages.

## What's inside

```
kvngs-empire/
├── index.html          ← all page content lives here (one page, anchor sections)
├── css/style.css        ← all styling (colors, type, layout, animation)
├── js/script.js          ← all behavior + the content you'll edit most often
├── assets/images/        ← logo, favicons, placeholder album art
├── assets/audio/          ← drop real track files here (see its README)
└── site.webmanifest
```

## 1. Add your WhatsApp number

Open `js/script.js` and find this line near the top:

```js
const WHATSAPP_NUMBER = "[WHATSAPP NUMBER TO BE ADDED]";
```

Replace the placeholder with the studio's number in international format,
digits only — no `+`, spaces, or dashes. Example for a Nigerian number:

```js
const WHATSAPP_NUMBER = "2348012345678";
```

Every "Book a Session" button on the site (header, hero, floating button,
and the Book a Session section) reads from this one constant, so this is
the only place you need to change it.

## 2. Swap in real content

Everything editable lives in two places:

- **`js/script.js`** — the `CONFIG` section at the top has plain arrays for:
  - `TRACKS` (Our Work / audio player)
  - `ARTISTS` (roster)
  - `TESTIMONIALS`
  Edit the text in these arrays and the page updates automatically —
  no HTML editing required.
- **`index.html`** — search for anything in `[brackets]` (address, phone,
  email, pricing) and replace it with real details. Studio photos in the
  "The Studio" section are text placeholders — replace the `.studio__ph`
  divs with `<img>` tags once you have real photography.

Also update the Google Maps embed in the Contact section: replace
`q=Lagos,Nigeria` in the iframe `src` with your real address, e.g.
`q=123+Example+Street,Lagos`.

## 3. Add real audio tracks

Drop mp3 files into `assets/audio/` (see the README in that folder for
exact filenames), or edit the `src` paths in the `TRACKS` array in
`js/script.js`.

## 4. Preview locally

Any static file server works. From this folder, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## 5. Launch it on GitHub Pages

1. Create a new repository on GitHub (e.g. `kvngs-empire-website`).
2. Push this folder's contents to it:
   ```bash
   git init
   git add .
   git commit -m "Launch KVNGS EMPIRE website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub, go to the repository's **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`, then **Save**.
5. GitHub will give you a live URL, typically:
   `https://<your-username>.github.io/<repo-name>/`
   (it can take a minute or two to go live after the first push).

If you'd rather use a custom domain, add a `CNAME` file with your domain
name at the root of the repo and point your domain's DNS at GitHub Pages —
GitHub's Pages settings page will show you the exact records to add.

## Notes

- The "real-time" availability calendar is a front-end mock (see the
  comment above `MOCK_SCHEDULE`/`statusForDate` in `js/script.js`) so the
  site works with zero backend. To make it genuinely live, connect it to
  a real calendar or booking API and replace `statusForDate()`.
- The contact form currently only shows a confirmation message — it isn't
  wired to send email yet. Connect it to a service like Formspree, Netlify
  Forms, or EmailJS by updating the submit handler in `js/script.js`.
