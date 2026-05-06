# Web Font Switcher

[中文](#中文) | [English](#english)

## 中文

一个自用 Chrome 插件：根据网页文本语言自动应用不同字体。

这个插件的灵感来自 Claude 最近把中文字体改成了一个不太常规、观感不佳的字体。它的目标是让网页里的不同语言可以使用更适合阅读的字体，同时保留网站原本的排版结构。

### 安装

1. 下载最新版本：[web-font-switcher-v1.0.1.zip](https://github.com/CUinspace233/web-font-switcher/releases/download/v1.0.1/web-font-switcher-v1.0.1.zip)
2. 解压这个 zip 文件
3. 打开 Chrome 的 `chrome://extensions`
4. 打开右上角“开发者模式”
5. 点击“加载已解压的扩展程序”
6. 选择解压后的 `web-font-switcher` 目录

### 使用

点击浏览器工具栏里的插件图标，可以：

- 开启或关闭字体替换
- 弹窗只显示英语和另一种语言，另一种语言可从下拉菜单选择，默认中文
- 每种语言都可以选择“网页默认字体”，保留网站自己的字体设置
- 字体候选主要使用 Google Fonts，选择后插件会向页面注入对应字体
- 通过预览文字即时查看当前选择的字体效果
- 查看字体是否可能已安装；未安装时 Chrome 会显示备用字体
- 使用“自定义...”输入不在列表里的字体名
- 使用“应用(刷新页面)”直接把设置应用到当前网站
- 重置默认字体

修改设置后，当前页面会尽量即时更新。复杂网页如果没有完全刷新，可手动刷新页面。

### 注意

这个插件会优先使用网页已有的 `lang` 属性；如果网页没有标注语言，会按 Unicode 字符范围识别常见文字并包裹 `span` 来应用字体。

它会避开输入框、代码块、脚本、样式、可编辑区域，降低破坏网站交互的风险。

Google Fonts 需要联网加载，页面会向 `fonts.googleapis.com` 和 `fonts.gstatic.com` 请求字体资源。

## English

A personal Chrome extension that applies custom fonts to page text based on detected language.

This extension was inspired by Claude's recent Chinese font change, which switched to an unusual font that I found visually unpleasant. The goal is to let different languages on the same page use fonts that are more comfortable to read while preserving the site's original layout structure.

### Installation

1. Download the latest version: [web-font-switcher-v1.0.1.zip](https://github.com/CUinspace233/web-font-switcher/releases/download/v1.0.1/web-font-switcher-v1.0.1.zip)
2. Unzip the file
3. Open `chrome://extensions` in Chrome
4. Turn on "Developer mode"
5. Click "Load unpacked"
6. Select the unzipped `web-font-switcher` folder

### Usage

Click the extension icon in the browser toolbar to:

- Enable or disable font replacement
- Show English and one additional language in the popup; the second language can be selected from a dropdown and defaults to Chinese
- Use the page's default font for any language to keep the site's original styling
- Choose from font candidates mainly backed by Google Fonts; selected fonts are injected into the page
- Preview the selected font immediately
- Check whether a font may already be installed; otherwise Chrome will use a fallback font
- Enter a custom font name with the "Custom..." option
- Apply settings to the current site with "Apply (refresh page)"
- Reset to the default font settings

After settings change, the current page is updated as much as possible immediately. Some complex pages may still need a manual refresh.

### Notes

The extension prefers existing `lang` attributes on the page. If a page does not mark its language, it detects common scripts by Unicode ranges and wraps text in `span` elements to apply fonts.

It skips inputs, code blocks, scripts, styles, and editable areas to reduce the chance of breaking page interactions.

Google Fonts requires network access. Pages may request resources from `fonts.googleapis.com` and `fonts.gstatic.com`.
