const DEFAULTS = {
  enabled: true,
  otherLanguage: "zh",
  fonts: {
    zh: "__page_default__",
    ja: "__page_default__",
    ko: "__page_default__",
    latin: "__page_default__",
    arabic: "__page_default__"
  }
};

const FONT_OPTIONS = {
  zh: [
    "Noto Sans SC",
    "Noto Serif SC",
    "Ma Shan Zheng",
    "ZCOOL XiaoWei",
    "ZCOOL QingKe HuangYou",
    "ZCOOL KuaiLe",
    "Long Cang",
    "Liu Jian Mao Cao",
    "Zhi Mang Xing",
    "Noto Sans HK",
    "Noto Serif HK",
    "Noto Sans TC",
    "Noto Serif TC"
  ],
  ja: [
    "Noto Sans JP",
    "Noto Serif JP",
    "M PLUS 1p",
    "M PLUS Rounded 1c",
    "Kosugi",
    "Kosugi Maru",
    "Sawarabi Gothic",
    "Sawarabi Mincho",
    "Zen Kaku Gothic New",
    "Zen Maru Gothic",
    "Shippori Mincho",
    "Yuji Syuku"
  ],
  ko: [
    "Noto Sans KR",
    "Noto Serif KR",
    "Black Han Sans",
    "Do Hyeon",
    "Gothic A1",
    "IBM Plex Sans KR",
    "Nanum Gothic",
    "Nanum Myeongjo",
    "Nanum Pen Script",
    "Nanum Brush Script",
    "Song Myung"
  ],
  latin: [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Nunito",
    "Raleway",
    "Oswald",
    "Ubuntu",
    "Work Sans",
    "DM Sans",
    "Source Sans 3",
    "Merriweather",
    "Playfair Display",
    "Libre Baskerville",
    "Crimson Text",
    "Roboto Slab",
    "Source Code Pro",
    "JetBrains Mono",
    "Fira Code"
  ],
  arabic: [
    "Noto Naskh Arabic",
    "Noto Sans Arabic",
    "Cairo",
    "Amiri",
    "Tajawal",
    "Almarai",
    "Changa",
    "El Messiri",
    "Lateef",
    "Scheherazade New",
    "Markazi Text",
    "Reem Kufi"
  ]
};

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

const DETECTION_TEXT = {
  zh: "字体预览测试永東国語",
  ja: "日本語フォント確認永東国",
  ko: "한국어 글꼴 확인 가나다",
  latin: "mmmmmmmmmiiiiiiiiiWWWWW",
  arabic: "معاينة الخط العربي"
};

const GENERIC_FONTS = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace"
]);

const GENERIC_PATTERN = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-serif|ui-sans-serif|ui-monospace)$/i;
const PAGE_DEFAULT_VALUE = "__page_default__";
const CUSTOM_VALUE = "__custom__";

const ids = {
  zh: "font-zh",
  ja: "font-ja",
  ko: "font-ko",
  latin: "font-latin",
  arabic: "font-arabic"
};

const enabled = document.getElementById("enabled");
const form = document.getElementById("font-form");
const applyCurrent = document.getElementById("apply-current");
const otherLanguage = document.getElementById("other-language");
const reset = document.getElementById("reset");
const status = document.getElementById("status");
const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d");
const GOOGLE_FONT_LINK_ID = "popup-google-fonts";

function quoteFont(font) {
  return `"${font.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function isGenericFont(font) {
  return GENERIC_PATTERN.test(font);
}

function isFontLikelyAvailable(font, key) {
  if (!font || font === PAGE_DEFAULT_VALUE || isGenericFont(font) || GOOGLE_FONTS.has(font)) return true;

  const text = DETECTION_TEXT[key] || DETECTION_TEXT.latin;
  const size = "72px";
  const baseWidths = ["monospace", "serif", "sans-serif"].map((generic) => {
    measureContext.font = `${size} ${generic}`;
    return measureContext.measureText(text).width;
  });

  return ["monospace", "serif", "sans-serif"].some((generic, index) => {
    measureContext.font = `${size} ${quoteFont(font)}, ${generic}`;
    return Math.abs(measureContext.measureText(text).width - baseWidths[index]) > 0.1;
  });
}

function fontStack(value) {
  return String(value)
    .split(",")
    .map((font) => font.trim())
    .filter(Boolean)
    .map((font) => {
      if (isGenericFont(font)) {
        return font;
      }

      return quoteFont(font);
    })
    .join(", ");
}

function displayFontName(value) {
  return value === PAGE_DEFAULT_VALUE ? "网页默认字体" : value;
}

function googleFontsUrl(fonts) {
  const families = [...fonts].sort().map((font) => `family=${encodeURIComponent(font).replaceAll("%20", "+")}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

function applyPopupGoogleFonts() {
  document.getElementById(GOOGLE_FONT_LINK_ID)?.remove();

  const selected = visibleLanguageKeys()
    .map((key) => getSelectedFont(key))
    .filter((font) => GOOGLE_FONTS.has(font));

  if (!selected.length) return;

  const link = document.createElement("link");
  link.id = GOOGLE_FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = googleFontsUrl(new Set(selected));
  document.head.append(link);
}

function setStatus(message) {
  status.textContent = message;
  window.setTimeout(() => {
    if (status.textContent === message) status.textContent = "";
  }, 1600);
}

function normalizeSettings(settings) {
  return {
    enabled: settings.enabled ?? DEFAULTS.enabled,
    fonts: { ...DEFAULTS.fonts, ...(settings.fonts || {}) }
  };
}

function visibleLanguageKeys() {
  return ["latin", otherLanguage.value || "zh"];
}

function updateVisibleLanguagePanel() {
  const selected = otherLanguage.value || "zh";

  document.querySelectorAll("[data-language-panel]").forEach((panel) => {
    const key = panel.getAttribute("data-language-panel");
    panel.hidden = key !== "latin" && key !== selected;
  });

  updatePreviews();
}

function populateFontOptions() {
  for (const [key, id] of Object.entries(ids)) {
    const select = document.getElementById(id);
    select.textContent = "";

    const pageDefault = document.createElement("option");
    pageDefault.value = PAGE_DEFAULT_VALUE;
    pageDefault.textContent = "网页默认字体";
    select.append(pageDefault);

    for (const font of FONT_OPTIONS[key]) {
      const option = document.createElement("option");
      option.value = font;
      option.textContent = GOOGLE_FONTS.has(font)
        ? `${font} (Google)`
        : GENERIC_FONTS.has(font)
          ? font
          : `${font}${isFontLikelyAvailable(font, key) ? "" : " (未检测到)"}`;
      option.style.fontFamily = fontStack(font);
      select.append(option);
    }

    const custom = document.createElement("option");
    custom.value = CUSTOM_VALUE;
    custom.textContent = "自定义...";
    select.append(custom);
  }
}

function setFontControl(key, value) {
  const select = document.getElementById(ids[key]);
  const customInput = document.getElementById(`custom-${key}`);
  const normalizedValue = value || DEFAULTS.fonts[key];
  if (normalizedValue === PAGE_DEFAULT_VALUE) {
    select.value = PAGE_DEFAULT_VALUE;
    customInput.value = "";
    customInput.hidden = true;
    return;
  }

  const firstFont = normalizedValue.split(",")[0]?.trim().replace(/^["']|["']$/g, "");
  const selectedValue = FONT_OPTIONS[key].includes(normalizedValue) ? normalizedValue : firstFont;
  const hasOption = FONT_OPTIONS[key].includes(selectedValue);

  select.value = hasOption ? selectedValue : CUSTOM_VALUE;
  customInput.value = hasOption ? "" : normalizedValue;
  customInput.hidden = hasOption;
}

function getSelectedFont(key) {
  const select = document.getElementById(ids[key]);
  const customInput = document.getElementById(`custom-${key}`);

  if (select.value === PAGE_DEFAULT_VALUE) {
    return PAGE_DEFAULT_VALUE;
  }

  if (select.value === CUSTOM_VALUE) {
    return customInput.value.trim() || DEFAULTS.fonts[key];
  }

  return select.value || DEFAULTS.fonts[key];
}

function updateCustomVisibility(key) {
  const select = document.getElementById(ids[key]);
  const customInput = document.getElementById(`custom-${key}`);

  customInput.hidden = select.value !== CUSTOM_VALUE;
  if (!customInput.hidden) customInput.focus();
}

function updatePreview(key) {
  const preview = document.getElementById(`preview-${key}`);
  const availability = document.getElementById(`availability-${key}`);
  const value = getSelectedFont(key);

  if (value === PAGE_DEFAULT_VALUE) {
    preview.style.fontFamily = "";
    preview.title = "网页默认字体";
    availability.className = "availability";
    availability.textContent = "使用网页自己的字体，不覆盖这个语言";
    return;
  }

  const available = isFontLikelyAvailable(value, key);

  preview.style.fontFamily = fontStack(value);
  preview.title = displayFontName(value);
  availability.className = `availability ${available ? "available" : "unavailable"}`;
  availability.textContent = GOOGLE_FONTS.has(value)
    ? `将从 Google Fonts 加载：${displayFontName(value)}`
    : available
    ? `正在预览：${displayFontName(value)}`
    : `未检测到：${displayFontName(value)}，当前看到的是浏览器备用字体`;
}

function updatePreviews() {
  applyPopupGoogleFonts();
  visibleLanguageKeys().forEach(updatePreview);
}

async function loadSettings() {
  const stored = await chrome.storage.sync.get(DEFAULTS);
  const settings = normalizeSettings(stored);
  enabled.checked = settings.enabled;
  otherLanguage.value = stored.otherLanguage || "zh";

  for (const [key, id] of Object.entries(ids)) {
    setFontControl(key, settings.fonts[key]);
  }

  updateVisibleLanguagePanel();
}

async function saveSettings(settings) {
  await chrome.storage.sync.set(settings);
  setStatus("已保存，刷新页面后也会继续生效。");
}

function collectSettings() {
  const fonts = { ...DEFAULTS.fonts };
  for (const key of visibleLanguageKeys()) {
    fonts[key] = getSelectedFont(key);
  }

  return { enabled: enabled.checked, fonts, otherLanguage: otherLanguage.value || "zh" };
}

async function reloadCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url || /^(chrome|edge|about|devtools):/i.test(tab.url)) {
    setStatus("当前页面不支持由插件刷新。");
    return;
  }

  await chrome.tabs.reload(tab.id);
  window.close();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveSettings(collectSettings());
});

enabled.addEventListener("change", async () => {
  const stored = normalizeSettings(await chrome.storage.sync.get(DEFAULTS));
  await saveSettings({ ...stored, enabled: enabled.checked });
});

reset.addEventListener("click", async () => {
  otherLanguage.value = "zh";
  await saveSettings({ ...DEFAULTS, otherLanguage: "zh" });
  await loadSettings();
});

applyCurrent.addEventListener("click", async () => {
  await saveSettings(collectSettings());
  await reloadCurrentTab();
});

otherLanguage.addEventListener("change", updateVisibleLanguagePanel);

for (const [key, id] of Object.entries(ids)) {
  document.getElementById(id).addEventListener("change", () => {
    updateCustomVisibility(key);
    applyPopupGoogleFonts();
    updatePreview(key);
  });
  document.getElementById(`custom-${key}`).addEventListener("input", () => {
    applyPopupGoogleFonts();
    updatePreview(key);
  });
}

populateFontOptions();
loadSettings();
