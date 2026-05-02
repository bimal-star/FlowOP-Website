# Deploying FlowOP (Astro static site)

The site builds to **`dist/`** as plain HTML, CSS, and JS. You can go live **without a custom domain** using the free URL your host provides, then attach a domain later.

## Prerequisite: Formspree

Contact submissions use [Formspree](https://formspree.io/). Either:

- Set **`PUBLIC_FORMSPREE_ID`** in your host’s environment variables to your form ID (the segment after `/f/` in the Formspree endpoint), or  
- Edit the fallback in [`src/pages/contact.astro`](src/pages/contact.astro).

Until the placeholder is replaced, the script in `public/js/main.js` blocks submit and prompts you to configure the endpoint.

## Build locally

```bash
npm install
npm run build
npm run preview
```

Open the URL shown (usually `http://localhost:4321` for dev, or the preview URL) and click through all pages.

**Tip:** Prefer cloning and building on a **local disk** (not only Google Drive) for faster, more reliable `npm install` / `npm run build`.

If `npm install` on a Google Drive folder fails with **TAR_ENTRY_ERROR** / **EBADF**, use either: (1) a clone of the repo on `C:` and run `npm install` / `npm run build` there, (2) a **directory junction** so `node_modules` lives on `C:` while the rest of the project stays on Drive, or (3) rely on **CI** (Netlify/Vercel/Cloudflare) to install and build in the cloud—no local `node_modules` on Drive required.

If legacy **`contact.html`**, **`css/`**, **`js/`**, or **`assets/`** still appear at the project root next to **`public/`**, close any app using them and delete those paths manually so only **`public/`** holds shipped static assets (avoids confusion with the Astro site).

Commit **`package-lock.json`** so Netlify/Vercel/Cloudflare install the same dependency tree as your local machine.

## Netlify

1. Push this repo to GitHub/GitLab/Bitbucket (or use Netlify Drop with a zipped `dist/` after `npm run build`).
2. New site → import repo → build command **`npm run build`**, publish directory **`dist`**.
3. Netlify reads [`netlify.toml`](netlify.toml) for redirects from old `*.html` URLs to the new routes.
4. You get a URL like **`https://<site-name>.netlify.app`** immediately.
5. **Custom domain later:** Site settings → Domain management → add domain; at your registrar, set the DNS records Netlify shows (often **CNAME** to `*.netlify.app` or **A/ALIAS** per their docs). HTTPS is provisioned automatically.

## Vercel

1. Import the repo; Vercel auto-detects Astro, or set **Build Command** `npm run build` and **Output Directory** `dist` if needed.
2. [`vercel.json`](vercel.json) includes redirects from legacy `*.html` paths.
3. Free URL: **`https://<project>.vercel.app`**.

## Cloudflare Pages

1. Connect repo → framework preset **Astro** (or build `npm run build`, output **`dist`**).
2. Add **Bulk redirects** or **Single redirects** in the dashboard to mirror the rules in `netlify.toml` if you need old `*.html` links to resolve (Pages also supports `_redirects` in `public/` if you prefer that format later).

## Environment variables (hosts)

| Variable | Purpose |
|----------|---------|
| `PUBLIC_FORMSPREE_ID` | Formspree form id (optional; avoids editing `contact.astro` per environment). |

In Astro, only variables prefixed with **`PUBLIC_`** are exposed to the browser in the built site.
