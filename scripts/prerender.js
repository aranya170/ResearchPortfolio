// Runs after `vite build`. Renders the homepage to static HTML (so crawlers see the real
// content without JavaScript) and writes SEO metadata, JSON-LD, sitemap.xml and robots.txt
// from seo.config.js and the bundled portfolio data.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import seo from "../seo.config.js";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "build");
const ssrDir = path.join(root, "build-ssr");
const portfolio = JSON.parse(fs.readFileSync(path.join(root, "src/data/defaultPortfolio.json"), "utf8"));

const site = seo.siteUrl.replace(/\/+$/, "");
const abs = (p) => (/^https?:/.test(p) ? p : `${site}${encodeURI(p.startsWith("/") ? p : `/${p}`)}`);
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const today = new Date().toISOString().slice(0, 10);

const allProjects = Object.entries(portfolio.projects || {}).flatMap(([category, list]) =>
  (list || []).map((p) => ({ ...p, category: p.category || category }))
);
const projectSummary = (p) => {
  const info = (p.files || []).find((f) => f.type === "info");
  return info ? info.content.replace(/\s+/g, " ").trim().slice(0, 300) : "";
};

// ── Structured data (JSON-LD) ──
const personId = `${site}/#person`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: seo.name,
      url: `${site}/`,
      image: abs(portfolio.about?.profile_image || seo.shareImage),
      description: seo.description,
      jobTitle: seo.jobTitles,
      knowsAbout: seo.knowsAbout,
      homeLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: seo.location.locality,
          addressCountry: seo.location.countryCode,
        },
      },
      nationality: { "@type": "Country", name: seo.location.country },
      affiliation: { "@type": "CollegeOrUniversity", name: seo.university.name, url: seo.university.url },
      alumniOf: { "@type": "CollegeOrUniversity", name: seo.university.name, url: seo.university.url },
      memberOf: seo.memberOf.map((m) => ({
        "@type": "OrganizationRole",
        roleName: m.role,
        memberOf: { "@type": "Organization", name: m.name },
      })),
      sameAs: seo.sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      url: `${site}/`,
      name: `${seo.name} | Portfolio`,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${site}/#webpage`,
      url: `${site}/`,
      name: seo.title,
      description: seo.description,
      isPartOf: { "@id": `${site}/#website` },
      mainEntity: { "@id": personId },
      dateModified: today,
      inLanguage: "en",
    },
    {
      "@type": "ItemList",
      "@id": `${site}/#projects`,
      name: `Research and engineering projects by ${seo.name}`,
      itemListElement: allProjects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": p.category === "Research" ? "ScholarlyArticle" : "CreativeWork",
          name: p.name,
          description: projectSummary(p),
          ...(p.image ? { image: abs(p.image) } : {}),
          ...(p.github || p.website ? { url: p.website || p.github } : {}),
          keywords: (p.tags || []).join(", "),
          author: { "@id": personId },
        },
      })),
    },
  ],
};

// ── <head> tags ──
const shareImage = abs(seo.shareImage);
const head = `
  <title>${esc(seo.title)}</title>
  <meta name="description" content="${esc(seo.description)}" />
  <meta name="author" content="${esc(seo.name)}" />
  <link rel="canonical" href="${site}/" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="google-site-verification" content="${esc(seo.googleSiteVerification)}" />

  <meta property="og:type" content="profile" />
  <meta property="og:url" content="${site}/" />
  <meta property="og:site_name" content="${esc(seo.name)}" />
  <meta property="og:title" content="${esc(seo.title)}" />
  <meta property="og:description" content="${esc(seo.description)}" />
  <meta property="og:image" content="${shareImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(seo.shareImageAlt)}" />
  <meta property="og:locale" content="en_US" />
  <meta property="profile:first_name" content="Aranya Kishor" />
  <meta property="profile:last_name" content="Das" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(seo.title)}" />
  <meta name="twitter:description" content="${esc(seo.description)}" />
  <meta name="twitter:image" content="${shareImage}" />
  <meta name="twitter:image:alt" content="${esc(seo.shareImageAlt)}" />

  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
`;

// ── Render the homepage ──
await build({
  root,
  logLevel: "warn",
  build: { ssr: "src/entry-server.jsx", outDir: ssrDir, emptyOutDir: true },
});
const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const appHtml = render("/");

// Preload the two main (Latin) web fonts so text paints in its final font sooner
const fontFiles = fs
  .readdirSync(path.join(outDir, "assets"))
  .filter((f) => /^(inter|plus-jakarta-sans)-latin-wght-normal-.*\.woff2$/.test(f));
const fontPreloads = fontFiles
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n  ");

const indexPath = path.join(outDir, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
if (!html.includes("<!-- SEO:HEAD -->") || !html.includes('<div id="root"></div>')) {
  throw new Error("index.html is missing the <!-- SEO:HEAD --> marker or an empty #root");
}
html = html
  .replace("<!-- SEO:HEAD -->", `${head.trim()}\n  ${fontPreloads}`)
  .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
fs.writeFileSync(indexPath, html);

// ── sitemap.xml (with images, so project photos can appear in image search) ──
const images = [portfolio.about?.profile_image, ...allProjects.map((p) => p.image)].filter(Boolean);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
${[...new Set(images)].map((img) => `    <image:image><image:loc>${esc(abs(img))}</image:loc></image:image>`).join("\n")}
  </url>
</urlset>
`;
fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);

fs.writeFileSync(
  path.join(outDir, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`
);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered / (${Math.round(appHtml.length / 1024)} KB of HTML) and wrote sitemap.xml + robots.txt for ${site}`);
