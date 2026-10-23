# SEO checklist: what only you can do

The website itself is now fully optimised (pre-rendered pages, structured data, sitemap,
fast loading). Google ranks people mostly by **how many trusted websites mention and link
to you**, and how clearly it can tell that all your profiles belong to one person. Do these
in order; each step takes 5–20 minutes.

## Week 1: get Google to read the site

1. **Merge pull request #1** so the new version goes live.
2. **Google Search Console**: https://search.google.com/search-console
   - Click *Add property* → choose **URL prefix** → enter `https://aranyakishordas.vercel.app/`
   - Choose the **HTML tag** method. The site already contains your verification tag, so just click *Verify*.
   - Left menu → **Sitemaps** → type `sitemap.xml` → *Submit*.
   - Left menu → **URL Inspection** → paste `https://aranyakishordas.vercel.app/` → *Request indexing*.
3. **Bing Webmaster Tools**: https://www.bing.com/webmasters → *Import from Google Search Console* (one click).
   Bing also powers DuckDuckGo and ChatGPT search.

## Week 1: make your profiles point to each other

Use the **exact same name everywhere**: `Aranya Kishor Das`.

4. **ORCID** (https://orcid.org): fill in your education (United International University),
   your works (the two dataset papers) and under *Websites & social links* add
   `https://aranyakishordas.vercel.app/`.
5. **ResearchGate**: add the website link to your profile, and add both dataset papers.
6. **Google Scholar** (https://scholar.google.com/citations): create a profile, add your
   papers, set your homepage to the website. Scholar profiles rank very well for
   "researcher + country" searches.
7. **LinkedIn**: *Edit intro* → *Website* → add the site. Put "AI & Robotics Researcher,
   Bangladesh" in your headline.
8. **GitHub**: in your profile settings, set *Website* to the site. Also add the link to
   your profile README.
9. Send me your ORCID and ResearchGate links. I'll add them to `seo.config.js` so Google
   connects them to you.

## Month 1: get mentioned on trusted Bangladeshi sites

These links matter most for ranking in Bangladesh searches.

10. Ask **United International University** / your department to list you (lab page, student
    researcher list, or a news post about RoboNeT or your datasets) with a link to your site.
11. Ask **UIU Robotics Club**'s website to link your name (on the committee page) to your site.
12. Make sure each **dataset paper**'s author page/profile includes your website.
13. Post your datasets on **Kaggle** and/or **Papers with Code** with your site linked.

## Ongoing: keep the site active

14. Every few months, add a new project or update in `/admin`. Fresh content helps.
15. Write 2–3 short articles (Medium, Dev.to, or LinkedIn) about RoboNeT, your datasets,
    or robotics in Bangladesh, each linking back to your site.
16. Once a month, check Search Console → *Performance* to see which searches show your site.

## Optional but strongly recommended

17. **Buy your own domain**, e.g. `aranyakishordas.com` (about $10/year), and connect it to
    Vercel. Personal domains rank better and look more credible than `vercel.app`. If you
    do this, tell me and I'll switch `siteUrl` in `seo.config.js` and set up redirects.

## What to expect

- Searches for **your name** should show your site at #1 within 2–6 weeks of steps 1–9.
- Broad searches like **"top researchers in Bangladesh"** are dominated by universities,
  news sites and Google Scholar. Nobody can guarantee #1 there. Steps 10–16 are what move
  you up over months, especially Google Scholar and links from UIU.
