/**
 * Kitchen reference set — thumbnails styled as macro photography / high-res surface close-ups.
 * Palette: espresso shaker wood (vertical grain), brushed brass, white quartz, subway tile,
 * travertine floor, glass — matches the Physical AI Kitchen configurator look (no external URLs).
 */

const W = 640;
const H = 400;

/** Warm neutrals + espresso + brass (luxury transitional kitchen) */
const K = {
  woodDark: "#2e1f14",
  woodMid: "#4a3224",
  woodLight: "#6b4c38",
  grainLine: "#1a120c",
  brass: "#c9a24d",
  brassDeep: "#8a6b2a",
  brassHighlight: "#e8d4a8",
  quartz: "#f5f4f1",
  quartzVein: "#d8d4cc",
  subway: "#fafafa",
  grout: "#6a6a6a",
  groutLight: "#9ca3a8",
  marbleFloor: "#e6dfd4",
  marbleVein: "#c4b8a8",
  glassTint: "#e8f2fa",
  steel: "#c5ccd4",
  steelDark: "#8a939c",
  line: "#d4d4d4",
  muted: "#737373",
  shadow: "rgba(0,0,0,0.12)",
};

function svg(inner: string): string {
  const vignette = `<radialGradient id="vig" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#000000" stop-opacity="0.06"/></radialGradient>`;
  const base = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${vignette}<filter id="soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="0.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100%" height="100%" fill="#f8f7f5"/>${inner}<rect width="100%" height="100%" fill="url(#vig)" pointer-events="none"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(base)}`;
}

function matMacro(inner: string): string {
  return svg(inner);
}

function propShot(inner: string): string {
  return svg(inner);
}

/** Fine vertical wood grain strokes */
function woodGrainVertical(cx: number, w: number, y0: number, y1: number): string {
  let s = "";
  for (let i = 0; i < 48; i++) {
    const x = cx - w / 2 + (i / 47) * w + (i % 3) * 0.4;
    const op = 0.08 + (i % 5) * 0.02;
    s += `<path fill="none" stroke="${K.grainLine}" stroke-width="${0.35 + (i % 4) * 0.15}" opacity="${op}" d="M${x.toFixed(1)} ${y0} L${(x + (i % 2 ? 0.8 : -0.4)).toFixed(1)} ${y1}"/>`;
  }
  return s;
}

export const PROP_THUMBNAILS: Record<string, string> = {
  "prop-mason-jar": propShot(
    `<defs><linearGradient id="jarG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0f8ff"/><stop offset="1" stop-color="#d0e4f0"/></linearGradient></defs>
    <ellipse cx="320" cy="110" rx="90" ry="14" fill="${K.quartz}" stroke="${K.line}" stroke-width="1.5" opacity="0.9"/>
    <path fill="url(#jarG)" stroke="${K.muted}" stroke-width="2" d="M250 118h140l10 32v140c0 16-14 28-30 28h-90c-16 0-30-12-30-28V150l10-32z"/>
    <ellipse cx="320" cy="150" rx="58" ry="10" fill="${K.glassTint}" opacity="0.5"/>
    <path fill="none" stroke="${K.steelDark}" stroke-width="1" opacity="0.3" d="M270 200 Q320 220 370 200"/>`,
  ),
  "prop-wine-glasses": propShot(
    `<ellipse cx="320" cy="300" rx="200" ry="24" fill="${K.shadow}" opacity="0.15"/>
    <path fill="#ffffff" stroke="${K.line}" stroke-width="1.5" d="M220 260c0-48 24-88 38-120h12c14 32 38 72 38 120H220z"/>
    <path fill="#ffffff" stroke="${K.line}" stroke-width="1.5" d="M340 260c0-48 24-88 38-120h12c14 32 38 72 38 120H340z"/>
    <ellipse cx="258" cy="262" rx="36" ry="8" fill="none" stroke="${K.groutLight}"/>
    <ellipse cx="382" cy="262" rx="36" ry="8" fill="none" stroke="${K.groutLight}"/>
    <path stroke="${K.brass}" stroke-width="2" opacity="0.35" d="M200 300h240"/>`,
  ),
  "prop-oak-board": propShot(
    `<defs><linearGradient id="mb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#faf8f5"/><stop offset="0.5" stop-color="#ebe6df"/><stop offset="1" stop-color="#ddd5c8"/></linearGradient></defs>
    <rect x="80" y="140" width="480" height="140" rx="8" fill="url(#mb)" stroke="${K.marbleVein}" stroke-width="2"/>
    <path fill="none" stroke="${K.quartzVein}" stroke-width="1.2" opacity="0.6" d="M100 200 Q200 180 320 210 T520 195"/>
    <path fill="none" stroke="${K.marbleVein}" stroke-width="0.8" opacity="0.4" d="M120 240 Q280 260 420 230"/>
    <ellipse cx="320" cy="210" rx="180" ry="8" fill="${K.shadow}" opacity="0.08"/>`,
  ),
  "prop-base-cab-600": propShot(
    `<defs><linearGradient id="br" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${K.brassDeep}"/><stop offset="0.5" stop-color="${K.brassHighlight}"/><stop offset="1" stop-color="${K.brass}"/></linearGradient></defs>
    <rect x="120" y="80" width="400" height="260" rx="6" fill="${K.woodDark}" stroke="${K.grainLine}" stroke-width="2"/>
    ${woodGrainVertical(320, 360, 90, 330)}
    <rect x="140" y="100" width="170" height="220" rx="3" fill="${K.woodMid}" stroke="#2a1a10" stroke-width="1"/>
    <rect x="330" y="100" width="170" height="220" rx="3" fill="${K.woodMid}" stroke="#2a1a10" stroke-width="1"/>
    <rect x="248" y="180" width="8" height="64" rx="2" fill="url(#br)" stroke="${K.brassDeep}"/>
    <rect x="368" y="180" width="8" height="64" rx="2" fill="url(#br)" stroke="${K.brassDeep}"/>
    <rect x="120" y="72" width="400" height="12" fill="${K.woodLight}" opacity="0.35"/>`,
  ),
  "prop-wall-cab-800": propShot(
    `<rect x="60" y="100" width="520" height="200" rx="4" fill="${K.woodDark}" stroke="${K.grainLine}" stroke-width="2"/>
    ${woodGrainVertical(320, 500, 110, 290)}
    <line x1="320" y1="100" x2="320" y2="300" stroke="#2a1a10" stroke-width="1"/>
    <rect x="80" y="120" width="220" height="160" fill="${K.woodMid}" stroke="#3d2818"/>
    <rect x="340" y="120" width="220" height="160" fill="${K.woodMid}" stroke="#3d2818"/>
    <rect x="178" y="200" width="6" height="40" rx="1" fill="${K.brass}"/><rect x="456" y="200" width="6" height="40" rx="1" fill="${K.brass}"/>
    <path fill="none" stroke="${K.brass}" stroke-width="2" d="M320 100V60"/>`,
  ),
  "prop-oven-bi": propShot(
    `<rect x="180" y="70" width="280" height="260" rx="8" fill="#1c1c1c" stroke="#0a0a0a" stroke-width="2"/>
    <rect x="200" y="90" width="240" height="160" rx="4" fill="#0d0d0d" stroke="#333"/>
    <rect x="220" y="120" width="200" height="100" rx="3" fill="#080808" stroke="#222"/>
    <circle cx="320" cy="170" r="8" fill="${K.brass}" opacity="0.5"/>
    <rect x="210" y="270" width="220" height="12" rx="2" fill="#333"/>
    <path fill="none" stroke="${K.steel}" stroke-width="1" opacity="0.4" d="M200 85h240"/>`,
  ),
  "prop-pantry-tall": propShot(
    `<rect x="220" y="40" width="200" height="320" rx="4" fill="${K.woodDark}" stroke="${K.grainLine}" stroke-width="2"/>
    ${woodGrainVertical(320, 180, 50, 350)}
    <line x1="320" y1="50" x2="320" y2="350" stroke="#2a1a10"/>
    <rect x="232" y="60" width="76" height="130" fill="${K.woodMid}" stroke="#3d2818"/><rect x="332" y="60" width="76" height="130" fill="${K.woodMid}" stroke="#3d2818"/>
    <rect x="232" y="210" width="76" height="120" fill="${K.woodMid}" stroke="#3d2818"/><rect x="332" y="210" width="76" height="120" fill="${K.woodMid}" stroke="#3d2818"/>
    <rect x="268" y="140" width="6" height="36" rx="1" fill="${K.brass}"/><rect x="368" y="140" width="6" height="36" rx="1" fill="${K.brass}"/>`,
  ),
  "prop-planter-ceramic": propShot(
    `<ellipse cx="320" cy="300" rx="160" ry="20" fill="${K.shadow}" opacity="0.12"/>
    <path fill="#f4f2ef" stroke="${K.muted}" stroke-width="2" d="M220 140c12-28 36-44 100-44s88 16 100 44l16 72c6 28-18 52-50 52H254c-32 0-56-24-50-52l16-72z"/>
    <ellipse cx="320" cy="140" rx="100" ry="16" fill="#fafafa" stroke="${K.line}"/>
    <ellipse cx="280" cy="120" rx="24" ry="8" fill="#4a7c4a" opacity="0.85"/>
    <ellipse cx="320" cy="110" rx="28" ry="10" fill="#3d6b3d" opacity="0.9"/>
    <ellipse cx="360" cy="125" rx="22" ry="7" fill="#5a8f5a" opacity="0.8"/>`,
  ),
  "prop-counter-stool": propShot(
    `<ellipse cx="320" cy="300" rx="120" ry="16" fill="${K.shadow}" opacity="0.14"/>
    <path fill="${K.woodMid}" stroke="${K.grainLine}" d="M220 200h200v24H220z"/>
    ${woodGrainVertical(320, 180, 205, 218)}
    <path fill="${K.woodDark}" stroke="#2a1a10" d="M240 120h160l20 80H220z"/>
    <path fill="none" stroke="${K.line}" stroke-width="2" d="M248 224v64M392 224v64"/>
    <circle cx="252" cy="288" r="6" fill="${K.brass}"/><circle cx="388" cy="288" r="6" fill="${K.brass}"/>`,
  ),
  "prop-pendant": propShot(
    `<defs><radialGradient id="pend" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${K.brassHighlight}"/><stop offset="0.6" stop-color="${K.brass}"/><stop offset="1" stop-color="${K.brassDeep}"/></radialGradient></defs>
    <path stroke="${K.brassDeep}" stroke-width="3" fill="none" d="M320 40v100"/>
    <path fill="url(#pend)" stroke="${K.brassDeep}" stroke-width="2" d="M240 200c0-44 36-80 80-80s80 36 80 80v40H240z"/>
    <ellipse cx="320" cy="200" rx="56" ry="16" fill="${K.brassHighlight}" opacity="0.45"/>
    <path fill="none" stroke="${K.brassHighlight}" stroke-width="1" opacity="0.6" d="M280 210h80"/>`,
  ),
  "prop-blinds": propShot(
    `<rect x="100" y="60" width="440" height="280" rx="4" fill="#e2e2e2" stroke="${K.line}" stroke-width="2"/>
    <path stroke="#ffffff" stroke-width="14" d="M110 80h420M110 110h420M110 140h420M110 170h420M110 200h420M110 230h420M110 260h420"/>
    <rect x="100" y="52" width="440" height="14" rx="2" fill="#c8c8c8"/>`,
  ),
  "prop-kitchen-island": propShot(
    `<defs><linearGradient id="isq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#faf9f7"/><stop offset="1" stop-color="${K.quartzVein}"/></linearGradient></defs>
    <ellipse cx="320" cy="280" rx="220" ry="36" fill="${K.marbleFloor}" stroke="${K.marbleVein}" stroke-width="1"/>
    <path fill="url(#isq)" stroke="${K.quartzVein}" stroke-width="2" d="M120 160h400v100H120z"/>
    <path fill="none" stroke="${K.quartzVein}" stroke-width="1" opacity="0.5" d="M140 200 Q320 170 500 205"/>
    <rect x="130" y="260" width="380" height="32" fill="${K.woodDark}" stroke="${K.grainLine}"/>
    ${woodGrainVertical(320, 360, 268, 288)}`,
  ),
  "prop-gooseneck-kettle": propShot(
    `<ellipse cx="320" cy="300" rx="140" ry="18" fill="${K.shadow}" opacity="0.12"/>
    <defs><linearGradient id="ktl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8ecf0"/><stop offset="0.4" stop-color="${K.steel}"/><stop offset="1" stop-color="${K.steelDark}"/></linearGradient></defs>
    <path fill="url(#ktl)" stroke="${K.steelDark}" stroke-width="2" d="M200 200c0-40 54-72 120-72s120 32 120 72v60H200z"/>
    <path fill="none" stroke="${K.steelDark}" stroke-width="8" stroke-linecap="round" d="M380 188c40-20 80-10 100 20"/>
    <ellipse cx="320" cy="200" rx="100" ry="24" fill="#f0f2f5" opacity="0.4"/>
    <rect x="300" y="130" width="40" height="24" rx="4" fill="${K.steelDark}"/>`,
  ),
  "prop-mixing-bowl": propShot(
    `<defs><linearGradient id="bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0f2f5"/><stop offset="0.5" stop-color="#b8c0c8"/><stop offset="1" stop-color="#7a8490"/></linearGradient></defs>
    <ellipse cx="320" cy="280" rx="160" ry="28" fill="${K.shadow}" opacity="0.1"/>
    <ellipse cx="320" cy="240" rx="140" ry="32" fill="#a8b0b8" stroke="#6a7480" stroke-width="2"/>
    <path fill="url(#bowl)" stroke="#6a7480" stroke-width="2" d="M180 240c0-72 63-130 140-130s140 58 140 130"/>
    <ellipse cx="320" cy="240" rx="110" ry="20" fill="#ffffff" opacity="0.25"/>`,
  ),
  "prop-mortar": propShot(
    `<ellipse cx="320" cy="280" rx="100" ry="22" fill="${K.shadow}" opacity="0.1"/>
    <ellipse cx="320" cy="250" rx="90" ry="24" fill="#e8e4e0" stroke="${K.marbleVein}" stroke-width="2"/>
    <path fill="#ddd8d2" stroke="#b8b0a8" stroke-width="2" d="M230 250c0-36 40-66 90-66s90 30 90 66"/>
    <path fill="#c4bdb4" stroke="#908880" d="M300 150l12 72h16l12-72c-10-12-20-18-30-18s-20 6-30 18z"/>
    <path fill="none" stroke="${K.quartzVein}" stroke-width="0.8" opacity="0.5" d="M250 240 Q320 255 390 235"/>`,
  ),
};

export const MATERIAL_THUMBNAILS: Record<string, string> = {
  "mat-oak-wood": matMacro(
    `<defs><linearGradient id="oak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c49a6e"/><stop offset="0.5" stop-color="#a67c52"/><stop offset="1" stop-color="#8b5a3c"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#oak)"/>
    ${woodGrainVertical(320, 620, 0, 400)}
    <path stroke="#5c3d26" stroke-width="0.6" opacity="0.35" d="M0 80h640M0 160h640M0 240h640M0 320h640"/>`,
  ),
  "mat-pine-wood": matMacro(
    `<defs><linearGradient id="pine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe6d8"/><stop offset="1" stop-color="#c9b89a"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#pine)"/>
    ${woodGrainVertical(320, 600, 0, 400)}
    <path stroke="#a69072" stroke-width="0.5" opacity="0.3" d="M0 100h640M0 200h640M0 300h640"/>`,
  ),
  "mat-walnut-wood": matMacro(
    `<defs><linearGradient id="wal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c3d2e"/><stop offset="0.5" stop-color="${K.woodDark}"/><stop offset="1" stop-color="#1f140c"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#wal)"/>
    ${woodGrainVertical(320, 620, 0, 400)}
    <path stroke="#0d0805" stroke-width="0.4" opacity="0.25" d="M0 120h640M0 240h640M0 360h640"/>`,
  ),
  "mat-stainless-steel": matMacro(
    `<defs><linearGradient id="ss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f4f7"/><stop offset="0.45" stop-color="#b8c0cc"/><stop offset="1" stop-color="#7d8694"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#ss)"/>
    <path stroke="${K.line}" stroke-width="16" opacity="0.35" d="M-20 40l200 120M80 0l280 400M300 -20l180 420"/>
    <path fill="#ffffff" fill-opacity="0.4" d="M80 20l180 100-60 40z"/>`,
  ),
  "mat-brushed-brass": matMacro(
    `<defs><linearGradient id="bs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${K.brassDeep}"/><stop offset="0.35" stop-color="${K.brassHighlight}"/><stop offset="0.55" stop-color="${K.brass}"/><stop offset="0.75" stop-color="#a67c2a"/><stop offset="1" stop-color="${K.brassDeep}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bs)"/>
    <path stroke="${K.brassHighlight}" stroke-width="10" opacity="0.25" d="M0 50h640M0 90h640M0 130h640M0 170h640M0 210h640M0 250h640M0 290h640M0 330h640"/>
    <path stroke="#ffffff" stroke-opacity="0.15" stroke-width="24" d="M40 0l120 400M200 -20l160 420M420 0l100 400"/>`,
  ),
  "mat-cast-iron": matMacro(
    `<defs><linearGradient id="iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4a4a"/><stop offset="1" stop-color="#121212"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#iron)"/>
    <circle cx="220" cy="120" r="90" fill="#333" stroke="#555" stroke-width="2" opacity="0.9"/>
    <circle cx="400" cy="260" r="70" fill="#2a2a2a" stroke="#444"/>`,
  ),
  "mat-clear-glass": matMacro(
    `<defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0f8ff"/><stop offset="1" stop-color="#c8dce8"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#gl)"/>
    <path fill="#ffffff" fill-opacity="0.45" d="M100 40l200 160-80 60z"/>
    <path fill="#ffffff" fill-opacity="0.2" d="M380 80l120 200h-80z"/>
    <path stroke="${K.line}" stroke-width="1" opacity="0.5" d="M0 200h640M200 0v400"/>`,
  ),
  "mat-frosted-glass": matMacro(
    `<defs><linearGradient id="fr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f4f4"/><stop offset="1" stop-color="#d0d8e0"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#fr)"/>
    <circle cx="180" cy="140" r="100" fill="#ffffff" fill-opacity="0.35"/>
    <circle cx="420" cy="260" r="140" fill="#ffffff" fill-opacity="0.22"/>`,
  ),
  "mat-carrara-marble": matMacro(
    `<rect width="${W}" height="${H}" fill="#f2f0ed"/>
    <path fill="none" stroke="${K.marbleVein}" stroke-width="2" opacity="0.55" d="M0 80 Q160 40 320 100 T640 60"/>
    <path fill="none" stroke="${K.quartzVein}" stroke-width="1.2" opacity="0.45" d="M0 200 Q200 160 400 220 T640 180"/>
    <path fill="none" stroke="#b8a896" stroke-width="0.8" opacity="0.35" d="M40 400 Q200 280 400 320 T640 360"/>
    <path fill="none" stroke="${K.brass}" stroke-width="0.5" opacity="0.12" d="M100 0 Q180 400 500 0"/>`,
  ),
  "mat-granite": matMacro(
    `<defs><linearGradient id="trav" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${K.marbleFloor}"/><stop offset="1" stop-color="#d4c9b8"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#trav)"/>
    <path fill="none" stroke="${K.marbleVein}" stroke-width="1.5" opacity="0.4" d="M0 100 Q200 60 400 120 T640 90"/>
    <circle cx="120" cy="180" r="3" fill="#a89888" opacity="0.6"/><circle cx="380" cy="240" r="4" fill="#8a7a6a" opacity="0.5"/>
    <circle cx="500" cy="120" r="2.5" fill="#c4b8a8"/><circle cx="280" cy="320" r="3.5" fill="#9a8a78" opacity="0.45"/>
    <path fill="none" stroke="#b8a896" stroke-width="0.6" opacity="0.35" d="M0 300 Q320 260 640 320"/>`,
  ),
  "mat-ceramic-tile": matMacro(
    `<rect width="${W}" height="${H}" fill="${K.subway}"/>
    <path stroke="${K.grout}" stroke-width="4" d="M0 80h640M0 160h640M0 240h640M0 320h640M106 0v400M213 0v400M320 0v400M427 0v400M534 0v400"/>`,
  ),
  "mat-porcelain": matMacro(
    `<defs><linearGradient id="por" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ececec"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#por)"/>
    <ellipse cx="320" cy="200" rx="220" ry="120" fill="#ffffff" stroke="${K.line}" stroke-width="1.5" opacity="0.85"/>
    <path fill="none" stroke="${K.quartzVein}" stroke-width="0.8" opacity="0.25" d="M120 180 Q320 140 520 200"/>`,
  ),
};

function fallbackThumb(label: string): string {
  return svg(
    `<text x="320" y="208" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" fill="${K.muted}">${label}</text>`,
  );
}

export function propThumbnail(id: string): string {
  return PROP_THUMBNAILS[id] ?? fallbackThumb(id);
}

export function propPreviewUrls(id: string): string[] {
  return [propThumbnail(id)];
}

export function materialThumbnail(id: string): string {
  return MATERIAL_THUMBNAILS[id] ?? fallbackThumb(id);
}
