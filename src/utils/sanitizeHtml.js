// Allows only simple inline formatting in admin-authored text. Everything is escaped first,
// then a few exact, attribute-free tags (and plain http/mailto links) are restored, so the
// output is safe and identical on the server (pre-rendering) and in the browser.
const SIMPLE_TAG = /&lt;(\/?)(b|strong|i|em|u|code|span|br)\s*\/?&gt;/gi;
const LINK_OPEN = /&lt;a\s+href=(?:&quot;|&#39;)((?:https?:\/\/|mailto:)[^"'&<>\s]+)(?:&quot;|&#39;)\s*&gt;/gi;
const LINK_CLOSE = /&lt;\/a&gt;/gi;

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function sanitizeHtml(html) {
  if (typeof html !== "string" || !html) return "";
  return escapeHtml(html)
    .replace(SIMPLE_TAG, (_, slash, tag) => `<${slash}${tag.toLowerCase()}>`)
    .replace(LINK_OPEN, (_, href) => `<a href="${href}" target="_blank" rel="noopener noreferrer">`)
    .replace(LINK_CLOSE, "</a>");
}
