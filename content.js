const STYLE_ID = "language-font-switcher-style";
const GOOGLE_FONT_LINK_ID = "language-font-switcher-google-fonts";
const PROCESSED_ATTR = "data-lfs-processed";
const LANG_ATTR = "data-lfs-lang";

const DEFAULTS = {
  enabled: true,
  fonts: {
    zh: "__page_default__",
    ja: "__page_default__",
    ko: "__page_default__",
    latin: "__page_default__",
    arabic: "__page_default__"
  }
};

const PAGE_DEFAULT_VALUE = "__page_default__";
const LANGUAGE_KEYS = Object.keys(DEFAULTS.fonts);
const PROTECTED_ELEMENT_SELECTOR = [
  "script",
  "style",
  "noscript",
  "textarea",
  "input",
  "select",
  "option",
  "code",
  "pre",
  "kbd",
  "samp",
  "var",
  "[role='code']",
  "[contenteditable='true']",
  `[${PROCESSED_ATTR}]`
].join(",");
const MONOSPACE_PATTERN = /\b(?:monospace|ui-monospace|Menlo|Monaco|Consolas|Courier|Mono|Fira Code|Source Code Pro)\b/i;
const PRESERVED_SPACE_PATTERN = /^(?:pre|pre-wrap|pre-line|break-spaces)$/;
const CODE_CLASS_PATTERN =
  /(?:^|[-_\s])(?:code|command|terminal|shell|cli|copyable|font-mono|whitespace-pre|whitespace-nowrap)(?:$|[-_\s])/i;

const GOOGLE_FONTS = new Set([
  "Almarai",
  "Amiri",
  "Black Han Sans",
  "Cairo",
  "Changa",
  "Crimson Text",
  "DM Sans",
  "Do Hyeon",
  "El Messiri",
  "Fira Code",
  "Gothic A1",
  "IBM Plex Sans KR",
  "Inter",
  "JetBrains Mono",
  "Kosugi",
  "Kosugi Maru",
  "Lato",
  "Lateef",
  "Libre Baskerville",
  "Liu Jian Mao Cao",
  "Long Cang",
  "M PLUS 1p",
  "M PLUS Rounded 1c",
  "Ma Shan Zheng",
  "Markazi Text",
  "Merriweather",
  "Montserrat",
  "Nanum Brush Script",
  "Nanum Gothic",
  "Nanum Myeongjo",
  "Nanum Pen Script",
  "Noto Naskh Arabic",
  "Noto Sans Arabic",
  "Noto Sans HK",
  "Noto Sans JP",
  "Noto Sans KR",
  "Noto Sans SC",
  "Noto Sans TC",
  "Noto Serif HK",
  "Noto Serif JP",
  "Noto Serif KR",
  "Noto Serif SC",
  "Noto Serif TC",
  "Nunito",
  "Open Sans",
  "Oswald",
  "Playfair Display",
  "Poppins",
  "Raleway",
  "Reem Kufi",
  "Roboto",
  "Roboto Slab",
  "Sawarabi Gothic",
  "Sawarabi Mincho",
  "Scheherazade New",
  "Shippori Mincho",
  "Song Myung",
  "Source Code Pro",
  "Source Sans 3",
  "Tajawal",
  "Ubuntu",
  "Work Sans",
  "Yuji Syuku",
  "ZCOOL KuaiLe",
  "ZCOOL QingKe HuangYou",
  "ZCOOL XiaoWei",
  "Zen Kaku Gothic New",
  "Zen Maru Gothic",
  "Zhi Mang Xing"
]);

const SCRIPT_RULES = [
  { lang: "ja", pattern: /[\u3040-\u30ff]/ },
  { lang: "ko", pattern: /[\uac00-\ud7af]/ },
  { lang: "zh", pattern: /[\u3400-\u4dbf\u4e00-\u9fff]/ },
  { lang: "arabic", pattern: /[\u0600-\u06ff]/ },
  { lang: "latin", pattern: /[A-Za-z]/ }
];

const SEGMENT_PATTERN =
  /([\u3040-\u30ff]+|[\uac00-\ud7af]+|[\u3400-\u4dbf\u4e00-\u9fff]+|[\u0600-\u06ff]+|[A-Za-z][A-Za-z0-9'’-]*)/g;

let settings = DEFAULTS;
let observer = null;

function fontStack(value) {
  return String(value)
    .split(",")
    .map((font) => font.trim())
    .filter(Boolean)
    .map((font) => {
      if (/^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-serif|ui-sans-serif|ui-monospace)$/i.test(font)) {
        return font;
      }

      return `"${font.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
    })
    .join(", ");
}

function normalizeSettings(raw) {
  return {
    enabled: raw.enabled ?? DEFAULTS.enabled,
    fonts: { ...DEFAULTS.fonts, ...(raw.fonts || {}) }
  };
}

function shouldApplyLanguage(lang) {
  const value = settings.fonts[lang];
  return Boolean(settings.enabled && value && value !== PAGE_DEFAULT_VALUE);
}

function hasActiveFontOverride() {
  return LANGUAGE_KEYS.some((lang) => shouldApplyLanguage(lang));
}

function fontRule(selector, value) {
  if (!value || value === PAGE_DEFAULT_VALUE) return "";

  return `
    ${selector} {
      font-family: ${fontStack(value)} !important;
    }
  `;
}

function googleFontsUrl(fonts) {
  const families = [...fonts].sort().map((font) => `family=${encodeURIComponent(font).replaceAll("%20", "+")}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

function applyGoogleFonts() {
  document.getElementById(GOOGLE_FONT_LINK_ID)?.remove();
  if (!settings.enabled || !hasActiveFontOverride()) return;

  const selected = Object.values(settings.fonts).filter((font) => GOOGLE_FONTS.has(font));
  if (!selected.length) return;

  const link = document.createElement("link");
  link.id = GOOGLE_FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = googleFontsUrl(new Set(selected));
  (document.head || document.documentElement).append(link);
}

function detectLanguage(text) {
  for (const rule of SCRIPT_RULES) {
    if (rule.pattern.test(text)) return rule.lang;
  }
  return null;
}

function applyStyle() {
  document.getElementById(STYLE_ID)?.remove();
  if (!settings.enabled || !hasActiveFontOverride()) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = [
    fontRule(`:lang(zh), :lang(zh-CN), :lang(zh-Hans), [${LANG_ATTR}="zh"]`, settings.fonts.zh),
    fontRule(`:lang(ja), [${LANG_ATTR}="ja"]`, settings.fonts.ja),
    fontRule(`:lang(ko), [${LANG_ATTR}="ko"]`, settings.fonts.ko),
    fontRule(`:lang(ar), [${LANG_ATTR}="arabic"]`, settings.fonts.arabic),
    fontRule(`[${LANG_ATTR}="latin"]`, settings.fonts.latin)
  ].join("\n");

  if (style.textContent.trim()) {
    document.documentElement.append(style);
  }
}

function shouldSkipElement(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;

  return Boolean(element.closest(PROTECTED_ELEMENT_SELECTOR) || hasCodeLikeAncestor(element));
}

function hasCodeLikeAncestor(element) {
  for (let current = element; current && current !== document.body; current = current.parentElement) {
    if (hasCodeLikeStyle(current)) return true;
  }

  return false;
}

function hasCodeLikeStyle(element) {
  if (!element || element === document.body || element === document.documentElement) return false;

  const style = window.getComputedStyle(element);
  return (
    CODE_CLASS_PATTERN.test(element.className || "") ||
    PRESERVED_SPACE_PATTERN.test(style.whiteSpace) ||
    MONOSPACE_PATTERN.test(style.fontFamily)
  );
}

function splitTextNode(textNode) {
  const text = textNode.nodeValue;
  SEGMENT_PATTERN.lastIndex = 0;
  if (!text || !SEGMENT_PATTERN.test(text)) return;
  SEGMENT_PATTERN.lastIndex = 0;

  const fragment = document.createDocumentFragment();
  let index = 0;
  let changed = false;

  for (const match of text.matchAll(SEGMENT_PATTERN)) {
    const value = match[0];
    const start = match.index;
    const lang = detectLanguage(value);

    if (start > index) {
      fragment.append(document.createTextNode(text.slice(index, start)));
    }

    if (lang && shouldApplyLanguage(lang)) {
      const span = document.createElement("span");
      span.setAttribute(LANG_ATTR, lang);
      span.setAttribute(PROCESSED_ATTR, "true");
      span.textContent = value;
      fragment.append(span);
      changed = true;
    } else {
      fragment.append(document.createTextNode(value));
    }

    index = start + value.length;
  }

  if (index < text.length) {
    fragment.append(document.createTextNode(text.slice(index)));
  }

  if (changed) {
    textNode.parentNode.replaceChild(fragment, textNode);
  }
}

function processRoot(root) {
  if (!settings.enabled || !hasActiveFontOverride() || shouldSkipElement(root)) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (shouldSkipElement(node.parentElement)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(splitTextNode);
}

function startObserver() {
  observer?.disconnect();
  if (!settings.enabled || !hasActiveFontOverride()) return;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) processRoot(node);
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}

function unwrapProcessedSpans() {
  const processedSpans = document.querySelectorAll(`span[${PROCESSED_ATTR}][${LANG_ATTR}]`);

  processedSpans.forEach((span) => {
    const lang = span.getAttribute(LANG_ATTR);
    if (shouldApplyLanguage(lang) && !hasCodeLikeAncestor(span.parentElement)) return;

    span.replaceWith(document.createTextNode(span.textContent || ""));
  });
}

async function loadAndApply() {
  settings = normalizeSettings(await chrome.storage.sync.get(DEFAULTS));
  applyGoogleFonts();
  applyStyle();
  unwrapProcessedSpans();
  processRoot(document.body);
  startObserver();
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;

  settings = normalizeSettings({
    enabled: changes.enabled?.newValue ?? settings.enabled,
    fonts: changes.fonts?.newValue ?? settings.fonts
  });
  applyGoogleFonts();
  applyStyle();
  unwrapProcessedSpans();
  processRoot(document.body);
  startObserver();
});

loadAndApply();
