// Allows only simple inline formatting in admin-authored text; everything else is dropped.
const ALLOWED_TAGS = new Set(["B", "STRONG", "I", "EM", "U", "BR", "A", "CODE", "SPAN"]);

export function sanitizeHtml(html) {
  if (typeof html !== "string" || !html) return "";
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstChild;

  const clean = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (child.nodeType !== Node.ELEMENT_NODE || !ALLOWED_TAGS.has(child.tagName)) {
        // Keep the text of disallowed elements, drop the markup (scripts/styles are dropped entirely)
        if (child.nodeType === Node.ELEMENT_NODE && !["SCRIPT", "STYLE", "IFRAME", "OBJECT"].includes(child.tagName)) {
          child.replaceWith(doc.createTextNode(child.textContent));
        } else {
          child.remove();
        }
        return;
      }
      const href = child.tagName === "A" ? child.getAttribute("href") : null;
      [...child.attributes].forEach((attr) => child.removeAttribute(attr.name));
      if (href && /^(https?:|mailto:|#)/i.test(href.trim())) {
        child.setAttribute("href", href.trim());
        child.setAttribute("target", "_blank");
        child.setAttribute("rel", "noopener noreferrer");
      }
      clean(child);
    });
  };

  clean(root);
  return root.innerHTML;
}
