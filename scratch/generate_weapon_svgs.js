const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'assets', 'weapons');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

function wrapSvg(title, category, pathData, extraDetails = '') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160" width="320" height="160">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e131d" />
      <stop offset="100%" stop-color="#161c28" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0.8" />
    </linearGradient>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" stroke-width="0.5" stroke-opacity="0.08" />
    </pattern>
  </defs>

  <!-- Background Canvas -->
  <rect width="320" height="160" fill="url(#bgGrad)" rx="8" />
  <rect width="320" height="160" fill="url(#grid)" rx="8" />
  
  <!-- Subtle Border -->
  <rect x="0.5" y="0.5" width="319" height="159" rx="7.5" fill="none" stroke="#38bdf8" stroke-opacity="0.18" />

  <!-- Tactical HUD Corner Accents -->
  <path d="M 12 24 L 12 12 L 24 12" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6" />
  <path d="M 308 24 L 308 12 L 296 12" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6" />
  <path d="M 12 136 L 12 148 L 24 148" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6" />
  <path d="M 308 136 L 308 148 L 296 148" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6" />

  <!-- Target Center Reticle -->
  <circle cx="160" cy="80" r="48" fill="none" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="3 4" stroke-opacity="0.15" />
  <line x1="160" y1="26" x2="160" y2="34" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.3" />
  <line x1="160" y1="126" x2="160" y2="134" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.3" />
  <line x1="106" y1="80" x2="114" y2="80" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.3" />
  <line x1="206" y1="80" x2="214" y2="80" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.3" />

  <!-- Category Badge Tag -->
  <rect x="22" y="20" width="76" height="16" rx="3" fill="#1e293b" fill-opacity="0.8" stroke="#38bdf8" stroke-opacity="0.3" />
  <text x="60" y="32" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" letter-spacing="1" text-anchor="middle">${category}</text>

  <!-- Weapon Silhouette Art -->
  <g fill="#94a3b8" opacity="0.88">
    ${pathData}
  </g>
  ${extraDetails}
</svg>`;
}

// 1. Rifle (Assault Rifle silhouette)
const riflePath = `
    <!-- Stock -->
    <path d="M 42 74 L 86 74 L 86 86 L 54 94 L 42 94 Z" />
    <path d="M 42 94 L 54 94 L 52 110 L 40 106 Z" />
    <rect x="86" y="72" width="28" height="16" rx="2" />
    <!-- Receiver & Upper -->
    <path d="M 114 68 L 190 68 L 190 88 L 114 88 Z" />
    <!-- Optic / Carryhandle / Top rail -->
    <rect x="122" y="60" width="46" height="8" rx="1" />
    <rect x="136" y="56" width="22" height="6" rx="1" />
    <!-- Handguard & Barrel -->
    <rect x="190" y="72" width="68" height="13" rx="1" />
    <rect x="258" y="75" width="26" height="7" />
    <!-- Muzzle Flash Hider -->
    <polygon points="284,74 294,74 294,83 284,83" />
    <!-- Pistol Grip -->
    <path d="M 120 88 L 134 88 L 126 116 L 114 116 Z" />
    <!-- Magazine -->
    <path d="M 154 88 L 174 88 L 168 122 L 148 120 Z" />
    <!-- Trigger Guard -->
    <path d="M 134 94 C 142 94, 142 102, 134 104" fill="none" stroke="#94a3b8" stroke-width="2" />
`;

// 2. DMR / Sniper (Long barrel, Scope, Bipod)
const sniperPath = `
    <!-- Sniper Stock & Cheek Riser -->
    <path d="M 32 74 L 88 74 L 88 88 L 48 94 L 32 94 Z" />
    <rect x="44" y="66" width="34" height="8" rx="2" />
    <path d="M 32 94 L 46 94 L 44 112 L 30 108 Z" />
    <!-- Receiver -->
    <path d="M 88 72 L 180 72 L 180 88 L 88 88 Z" />
    <!-- High-Power Telescopic Scope -->
    <rect x="108" y="52" width="76" height="10" rx="1" />
    <polygon points="98,50 108,52 108,62 98,64" />
    <polygon points="184,50 196,48 196,66 184,64" />
    <rect x="124" y="62" width="6" height="10" />
    <rect x="160" y="62" width="6" height="10" />
    <!-- Long Precision Barrel -->
    <rect x="180" y="74" width="94" height="10" />
    <rect x="274" y="72" width="22" height="14" rx="1" />
    <!-- Pistol Grip -->
    <path d="M 106 88 L 122 88 L 114 118 L 100 118 Z" />
    <!-- Magazine -->
    <rect x="138" y="88" width="22" height="24" rx="2" />
    <!-- Bipod deployed -->
    <line x1="236" y1="84" x2="224" y2="128" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
    <line x1="238" y1="84" x2="250" y2="128" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
`;

// 3. LMG (Machine gun, drum mag, bipod, carry handle)
const lmgPath = `
    <!-- Heavy Stock -->
    <path d="M 38 72 L 86 72 L 86 90 L 50 98 L 38 98 Z" />
    <path d="M 38 98 L 50 98 L 48 114 L 36 112 Z" />
    <!-- Heavy Receiver -->
    <rect x="86" y="68" width="104" height="24" rx="2" />
    <!-- Carry Handle -->
    <path d="M 140 68 L 140 54 L 176 54 L 176 68" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round" />
    <!-- Shroud & Heavy Barrel -->
    <rect x="190" y="72" width="74" height="16" rx="2" />
    <rect x="264" y="75" width="24" height="10" />
    <polygon points="288,73 296,73 296,87 288,87" />
    <!-- Pistol Grip -->
    <path d="M 104 92 L 120 92 L 112 120 L 98 120 Z" />
    <!-- Drum / Box Magazine -->
    <rect x="136" y="92" width="44" height="34" rx="5" />
    <!-- Bipod -->
    <line x1="240" y1="88" x2="230" y2="130" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round" />
    <line x1="242" y1="88" x2="254" y2="130" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round" />
`;

// 4. SMG (Compact submachine gun)
const smgPath = `
    <!-- Retractable Wire Stock -->
    <line x1="48" y1="74" x2="100" y2="74" stroke="#94a3b8" stroke-width="3" />
    <line x1="48" y1="84" x2="100" y2="84" stroke="#94a3b8" stroke-width="3" />
    <rect x="44" y="70" width="8" height="32" rx="2" />
    <!-- Receiver -->
    <rect x="100" y="66" width="92" height="22" rx="2" />
    <!-- Compact Top Optic / Rail -->
    <rect x="120" y="58" width="34" height="8" rx="2" />
    <!-- Short Barrel & Shroud -->
    <rect x="192" y="70" width="40" height="14" rx="2" />
    <rect x="232" y="73" width="16" height="8" />
    <!-- Pistol Grip -->
    <path d="M 116 88 L 132 88 L 124 116 L 110 116 Z" />
    <!-- Curved Stick Magazine -->
    <path d="M 160 88 L 176 88 L 170 128 L 156 128 Z" />
    <!-- Forward Grip -->
    <rect x="186" y="88" width="10" height="20" rx="2" />
`;

// 5. Shotgun (Tactical shotgun, pump slide / tube)
const shotgunPath = `
    <!-- Stock -->
    <path d="M 36 74 L 88 74 L 88 88 L 52 94 L 36 94 Z" />
    <path d="M 36 94 L 50 94 L 46 112 L 32 108 Z" />
    <!-- Receiver -->
    <rect x="88" y="70" width="76" height="22" rx="2" />
    <path d="M 104 92 L 120 92 L 112 118 L 98 118 Z" />
    <!-- Long Barrel -->
    <rect x="164" y="72" width="116" height="10" />
    <!-- Tube Magazine -->
    <rect x="164" y="82" width="98" height="8" />
    <!-- Pump Forend Grip -->
    <rect x="190" y="80" width="38" height="14" rx="2" fill="#cbd5e1" />
    <!-- Front Bead / Ring Sight -->
    <rect x="274" y="68" width="4" height="4" />
`;

// 6. Launcher (Rocket / Missile launcher)
const launcherPath = `
    <!-- Main Launch Tube -->
    <rect x="42" y="66" width="226" height="26" rx="3" />
    <!-- Forward Bell Expansion -->
    <polygon points="268,62 284,56 284,102 268,96" />
    <!-- Rear Venturi Cone -->
    <polygon points="42,66 28,60 28,98 42,92" />
    <!-- Shoulder Rest Pad -->
    <rect x="88" y="92" width="38" height="10" rx="3" />
    <!-- Optical Sight / Targeting Module -->
    <rect x="144" y="48" width="34" height="18" rx="2" />
    <rect x="152" y="42" width="18" height="6" rx="1" />
    <!-- Dual Firing Grips -->
    <rect x="136" y="92" width="14" height="26" rx="2" />
    <rect x="180" y="92" width="14" height="24" rx="2" />
`;

// 7. Handgun (Pistol / Sidearm)
const handgunPath = `
    <!-- Slide -->
    <rect x="110" y="64" width="108" height="20" rx="2" />
    <!-- Slide Serrations & Ejection Port -->
    <rect x="118" y="68" width="16" height="12" fill="#0f172a" fill-opacity="0.4" />
    <rect x="152" y="66" width="16" height="6" fill="#0f172a" fill-opacity="0.5" />
    <!-- Sights -->
    <rect x="114" y="60" width="4" height="4" />
    <rect x="210" y="60" width="4" height="4" />
    <!-- Frame -->
    <rect x="120" y="84" width="94" height="10" />
    <!-- Pistol Grip -->
    <path d="M 126 94 L 152 94 L 142 136 L 120 134 Z" />
    <!-- Trigger Guard & Trigger -->
    <path d="M 152 94 C 168 94, 168 110, 150 112" fill="none" stroke="#94a3b8" stroke-width="2" />
    <path d="M 150 98 L 146 106" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
    <!-- Under-barrel Picatinny Rail -->
    <rect x="176" y="94" width="32" height="4" />
`;

// 8. Universal Placeholder
const placeholderPath = `
    <circle cx="160" cy="80" r="32" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 4" />
    <circle cx="160" cy="80" r="6" fill="#38bdf8" fill-opacity="0.6" />
    <line x1="160" y1="36" x2="160" y2="124" stroke="#94a3b8" stroke-width="1.5" stroke-opacity="0.5" />
    <line x1="116" y1="80" x2="204" y2="80" stroke="#94a3b8" stroke-width="1.5" stroke-opacity="0.5" />
    <text x="160" y="128" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" text-anchor="middle" letter-spacing="1.5">ARSENAL ASSET</text>
`;

const svgs = [
    { name: 'rifle.svg', category: 'RIFLE', path: riflePath },
    { name: 'dmr_sniper.svg', category: 'DMR / SNIPER', path: sniperPath },
    { name: 'lmg.svg', category: 'LMG', path: lmgPath },
    { name: 'smg.svg', category: 'SMG / PDW', path: smgPath },
    { name: 'shotgun.svg', category: 'SHOTGUN', path: shotgunPath },
    { name: 'launcher.svg', category: 'LAUNCHER', path: launcherPath },
    { name: 'handgun.svg', category: 'HANDGUN', path: handgunPath },
    { name: 'placeholder.svg', category: 'TACTICAL HUD', path: placeholderPath }
];

svgs.forEach(s => {
    const filePath = path.join(targetDir, s.name);
    fs.writeFileSync(filePath, wrapSvg(s.name, s.category, s.path), 'utf8');
    console.log(`Generated ${filePath}`);
});

console.log('All tactical category weapon SVGs successfully generated in assets/weapons/');
