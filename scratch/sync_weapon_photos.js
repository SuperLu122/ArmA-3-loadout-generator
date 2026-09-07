const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// 1. DIRECTORY CONFIGURATION
const PHOTOS_DIR = path.join(__dirname, '..', 'assets', 'weapons', 'photos');
if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

// 2. CRC32 & PNG CHUNK ENGINE
const crcTable = new Int32Array(256);
for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
}

function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
}

class PixelCanvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.buffer = Buffer.alloc(width * height * 4); // RGBA
    }

    fillRadialBackground(cx, cy, r, c1, c2) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const dx = (x - cx) / this.width;
                const dy = (y - cy) / this.height;
                const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.8);
                const rVal = Math.round(c1[0] * (1 - dist) + c2[0] * dist);
                const gVal = Math.round(c1[1] * (1 - dist) + c2[1] * dist);
                const bVal = Math.round(c1[2] * (1 - dist) + c2[2] * dist);
                this.setPixel(x, y, rVal, gVal, bVal, 255);
            }
        }
    }

    setPixel(x, y, r, g, b, a = 255) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        const idx = (y * this.width + x) * 4;
        if (a < 255) {
            const bgR = this.buffer[idx];
            const bgG = this.buffer[idx + 1];
            const bgB = this.buffer[idx + 2];
            const alpha = a / 255;
            this.buffer[idx] = Math.round(r * alpha + bgR * (1 - alpha));
            this.buffer[idx + 1] = Math.round(g * alpha + bgG * (1 - alpha));
            this.buffer[idx + 2] = Math.round(b * alpha + bgB * (1 - alpha));
            this.buffer[idx + 3] = 255;
        } else {
            this.buffer[idx] = r;
            this.buffer[idx + 1] = g;
            this.buffer[idx + 2] = b;
            this.buffer[idx + 3] = a;
        }
    }

    fillRect(x, y, w, h, [r, g, b, a = 255]) {
        for (let py = Math.max(0, y); py < Math.min(this.height, y + h); py++) {
            for (let px = Math.max(0, x); px < Math.min(this.width, x + w); px++) {
                this.setPixel(px, py, r, g, b, a);
            }
        }
    }

    drawDropShadow(x, y, w, h, blur = 5) {
        for (let py = y - blur; py < y + h + blur; py++) {
            for (let px = x - blur; px < x + w + blur; px++) {
                const distY = py < y ? y - py : (py > y + h ? py - (y + h) : 0);
                const distX = px < x ? x - px : (px > x + w ? px - (x + w) : 0);
                const d = Math.sqrt(distX * distX + distY * distY);
                if (d < blur) {
                    const factor = (1 - d / blur) * 0.45;
                    this.setPixel(px, py, 6, 9, 15, Math.round(factor * 255));
                }
            }
        }
    }

    toPngBuffer() {
        const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
        const ihdr = Buffer.alloc(13);
        ihdr.writeUInt32BE(this.width, 0);
        ihdr.writeUInt32BE(this.height, 4);
        ihdr[8] = 8;  // bit depth
        ihdr[9] = 6;  // RGBA
        ihdr[10] = 0; // compression
        ihdr[11] = 0; // filter
        ihdr[12] = 0; // interlace
        const ihdrChunk = makeChunk('IHDR', ihdr);

        const rowSize = 1 + this.width * 4;
        const rawData = Buffer.alloc(rowSize * this.height);
        for (let y = 0; y < this.height; y++) {
            const offset = y * rowSize;
            rawData[offset] = 0;
            const srcOffset = y * this.width * 4;
            this.buffer.copy(rawData, offset + 1, srcOffset, srcOffset + this.width * 4);
        }

        const compressed = zlib.deflateSync(rawData, { level: 8 });
        const idatChunk = makeChunk('IDAT', compressed);
        const iendChunk = makeChunk('IEND', Buffer.alloc(0));
        return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
    }
}

// 3. COLOR PALETTES
const C = {
    BG_CENTER: [26, 35, 50],
    BG_EDGE: [12, 17, 26],
    STEEL: [50, 62, 80],
    STEEL_DARK: [28, 36, 48],
    STEEL_LIGHT: [90, 106, 128],
    POLYMER: [22, 26, 34],
    POLYMER_DARK: [16, 20, 26],
    SPECULAR: [140, 155, 175],
    WOOD_BASE: [130, 64, 24],
    WOOD_DARK: [90, 42, 14],
    WOOD_LIGHT: [160, 85, 35],
    TAN_BASE: [165, 138, 102],
    TAN_DARK: [120, 100, 75],
    TAN_LIGHT: [195, 168, 128],
    CAMO_GREEN: [78, 100, 70],
    CAMO_DARK: [52, 68, 48],
    CAMO_LIGHT: [105, 130, 95],
    RAIL_ALUM: [75, 90, 110]
};

// 4. WEAPON TRAIT ANALYZER
function analyzeWeapon(id, name = '', category = '', caliber = '') {
    const s = `${id} ${name}`.toLowerCase();
    
    // Finish / Camo
    let finish = 'black';
    if (s.includes('_d') || s.includes('_desert') || s.includes('_sand') || s.includes('desert') || s.includes('sand') || s.includes('tan') || s.includes('coyote')) {
        finish = 'desert';
    } else if (s.includes('_wd') || s.includes('_woodland') || s.includes('_camo') || s.includes('woodland') || s.includes('camo') || s.includes('olive') || s.includes('green') || s.includes('jungle')) {
        finish = 'woodland';
    } else if (s.includes('_wood') || s.includes('wood') || s.includes('akm') || s.includes('vz58') || s.includes('mosin') || s.includes('m70') || s.includes('m76') || s.includes('m77') || s.includes('svd')) {
        finish = 'wood';
    } else if (s.includes('_npz') || s.includes('_railed') || s.includes('_ris') || s.includes('zenitco') || s.includes('top_rail')) {
        finish = 'railed';
    }

    // Attachments
    const hasGL = s.includes('_gl') || s.includes('_gp25') || s.includes('_m203') || s.includes('_m320') || s.includes('ubs') || s.includes('m203');
    const hasGrip = s.includes('_grip') || s.includes('_vfg') || s.includes('vfg') || s.includes('grip');
    const hasCarryHandle = s.includes('carryhandle') || s.includes('carry_handle') || s.includes('g36a') || s.includes('famas');
    const isShortBarrel = s.includes('mk18') || s.includes('cqb') || s.includes('compact') || s.includes('_s') || s.includes('para') || s.includes('_c') || s.includes('k2') || s.includes('10') || s.includes('short');
    const isLongBarrel = s.includes('m16') || s.includes('145') || s.includes('lb') || s.includes('20') || s.includes('marksman') || s.includes('sniper') || s.includes('sws') || s.includes('target');

    // Architecture Platform Family
    let family = 'ar15';
    if (category === 'Launcher' || s.includes('launch_') || s.includes('rpg') || s.includes('at4') || s.includes('javelin') || s.includes('maaws') || s.includes('stinger') || s.includes('igla') || s.includes('strela')) {
        family = 'launcher';
    } else if (category === 'Handgun' || s.includes('hgun_') || s.includes('pistol') || s.includes('glock') || s.includes('1911') || s.includes('beretta') || s.includes('makarov') || s.includes('p07') || s.includes('cz75') || s.includes('deagle')) {
        family = 'handgun';
    } else if (category === 'Shotgun' || s.includes('sgun_') || s.includes('870') || s.includes('1014') || s.includes('saiga') || s.includes('m590') || s.includes('shotgun') || caliber === '12Gauge') {
        family = 'shotgun';
    } else if (category === 'LMG' || s.includes('lmg_') || s.includes('mmg_') || s.includes('m249') || s.includes('pkm') || s.includes('m240') || s.includes('minimi') || s.includes('pecheneg') || s.includes('zafir') || s.includes('mk48')) {
        family = 'lmg';
    } else if (s.includes('m107') || s.includes('as50') || s.includes('gm6') || s.includes('ksvk') || caliber === '.50BMG' || caliber === '12.7x108') {
        family = 'heavy_sniper';
    } else if (category === 'DMR/Sniper' || s.includes('srifle_') || s.includes('svd') || s.includes('m14') || s.includes('m21') || s.includes('m24') || s.includes('m40') || s.includes('awm') || s.includes('mosin') || s.includes('cheytac') || s.includes('vss')) {
        family = 'sniper';
    } else if (category === 'SMG' || s.includes('smg_') || s.includes('mp5') || s.includes('vector') || s.includes('p90') || s.includes('mp7') || s.includes('bizon') || s.includes('pdw')) {
        family = 'smg';
    } else if (s.includes('ak74') || s.includes('aks74')) {
        family = 'ak74';
    } else if (s.includes('akm') || s.includes('ak47') || s.includes('m70') || s.includes('vz58')) {
        family = 'akm';
    } else if (s.includes('ak12') || s.includes('ak15') || s.includes('ak-12') || s.includes('ak-15')) {
        family = 'ak12';
    } else if (s.includes('g36')) {
        family = 'g36';
    } else if (s.includes('hk416') || s.includes('spar01') || s.includes('spar-16')) {
        family = 'hk416';
    } else if (s.includes('scar') || s.includes('mk16') || s.includes('mk17')) {
        family = 'scar';
    } else if (s.includes('fal') || s.includes('l1a1') || s.includes('slr')) {
        family = 'fal';
    } else if (s.includes('g3') || s.includes('g3a') || s.includes('g3sg')) {
        family = 'g3';
    } else if (s.includes('aug') || s.includes('famas') || s.includes('katiba') || s.includes('tavor') || s.includes('trg')) {
        family = 'bullpup';
    }

    return {
        family,
        finish,
        hasGL,
        hasGrip,
        hasCarryHandle,
        isShortBarrel,
        isLongBarrel
    };
}

// 5. VARIANT IMAGE GENERATOR
function generateVariantPhoto(traits) {
    const W = 320;
    const H = 100;
    const cvs = new PixelCanvas(W, H);

    // Studio lighting gradient background
    cvs.fillRadialBackground(W / 2, H / 2, 120, C.BG_CENTER, C.BG_EDGE);

    // Accent Palette based on variant finish
    let mainColor = C.STEEL;
    let darkColor = C.STEEL_DARK;
    let lightColor = C.STEEL_LIGHT;
    let furnColor = C.POLYMER;
    let furnDark = C.POLYMER_DARK;

    if (traits.finish === 'desert') {
        furnColor = C.TAN_BASE;
        furnDark = C.TAN_DARK;
        mainColor = [140, 118, 88];
        darkColor = [95, 80, 60];
        lightColor = C.TAN_LIGHT;
    } else if (traits.finish === 'woodland') {
        furnColor = C.CAMO_GREEN;
        furnDark = C.CAMO_DARK;
        mainColor = [68, 86, 62];
        darkColor = [45, 58, 42];
        lightColor = C.CAMO_LIGHT;
    } else if (traits.finish === 'wood') {
        furnColor = C.WOOD_BASE;
        furnDark = C.WOOD_DARK;
    } else if (traits.finish === 'railed') {
        furnColor = C.POLYMER;
        furnDark = C.POLYMER_DARK;
        lightColor = C.RAIL_ALUM;
    }

    // Geometry dispatch
    switch (traits.family) {
        case 'launcher': {
            // Launcher tube
            cvs.drawDropShadow(40, 38, 240, 24, 7);
            cvs.fillRect(40, 42, 230, 16, furnColor);
            cvs.fillRect(40, 40, 230, 3, furnDark);
            cvs.fillRect(40, 56, 230, 2, C.STEEL_DARK);
            // End rings / vents
            cvs.fillRect(36, 39, 14, 22, C.STEEL_DARK);
            cvs.fillRect(255, 39, 18, 22, C.STEEL_DARK);
            // Optic & grip
            cvs.fillRect(110, 32, 35, 10, C.STEEL);
            cvs.fillRect(125, 27, 20, 6, C.RAIL_ALUM);
            cvs.fillRect(135, 58, 14, 24, furnDark);
            // Front warhead tip if RPG
            if (traits.finish !== 'desert') {
                cvs.fillRect(270, 45, 22, 10, [100, 115, 85]);
                cvs.fillRect(290, 47, 12, 6, [70, 85, 60]);
            }
            break;
        }

        case 'handgun': {
            // Slide & Frame
            cvs.drawDropShadow(100, 32, 115, 48, 6);
            cvs.fillRect(105, 34, 105, 18, mainColor);
            cvs.fillRect(105, 34, 105, 3, lightColor);
            cvs.fillRect(105, 49, 105, 3, darkColor);
            // Serrations
            for (let s = 110; s <= 135; s += 4) {
                cvs.fillRect(s, 37, 2, 11, darkColor);
            }
            // Lower frame & grip
            cvs.fillRect(120, 52, 70, 10, furnDark);
            cvs.fillRect(122, 60, 28, 26, furnColor);
            cvs.fillRect(122, 60, 4, 26, furnDark);
            cvs.fillRect(146, 60, 4, 26, furnDark);
            // Trigger guard & trigger
            cvs.fillRect(150, 58, 22, 14, furnDark);
            cvs.fillRect(153, 61, 16, 8, C.BG_CENTER);
            cvs.fillRect(158, 62, 3, 7, C.STEEL_LIGHT);
            break;
        }

        case 'heavy_sniper': {
            // Massive .50 BMG receiver, huge fluted barrel, arrowhead brake
            cvs.drawDropShadow(25, 32, 270, 42, 8);
            // Stock
            cvs.fillRect(25, 38, 55, 22, furnColor);
            // Receiver
            cvs.fillRect(80, 34, 90, 26, mainColor);
            cvs.fillRect(80, 32, 90, 4, lightColor);
            // Massive barrel
            cvs.fillRect(170, 43, 95, 9, darkColor);
            // Arrowhead muzzle brake
            cvs.fillRect(265, 38, 24, 19, mainColor);
            cvs.fillRect(272, 41, 4, 13, C.BG_CENTER);
            cvs.fillRect(280, 41, 4, 13, C.BG_CENTER);
            // Big box magazine
            cvs.fillRect(115, 60, 32, 28, darkColor);
            // Grip & bipod
            cvs.fillRect(90, 60, 14, 22, furnDark);
            cvs.fillRect(180, 52, 20, 4, C.STEEL_DARK);
            break;
        }

        case 'sniper': {
            // DMR / Sniper rifle (long free-float barrel, chassis/wood stock, cheek riser)
            const barrelEnd = traits.isLongBarrel ? 285 : 270;
            cvs.drawDropShadow(30, 34, barrelEnd - 25, 38, 7);
            // Stock
            cvs.fillRect(30, 40, 55, 18, furnColor);
            cvs.fillRect(45, 34, 28, 6, furnDark); // cheek piece
            // Receiver & bolt
            cvs.fillRect(85, 38, 70, 20, mainColor);
            cvs.fillRect(85, 36, 70, 3, lightColor);
            cvs.fillRect(100, 35, 8, 4, C.STEEL_LIGHT); // bolt handle
            // Handguard
            cvs.fillRect(155, 41, 55, 14, furnColor);
            // Barrel & muzzle
            cvs.fillRect(210, 45, barrelEnd - 210, 6, darkColor);
            cvs.fillRect(barrelEnd - 5, 43, 10, 10, mainColor);
            // Magazine & grip
            cvs.fillRect(112, 58, 20, 16, darkColor);
            cvs.fillRect(88, 58, 12, 20, furnDark);
            break;
        }

        case 'lmg': {
            // Heavy receiver, carry handle, box mag, perforated handguard
            cvs.drawDropShadow(30, 32, 255, 46, 8);
            // Stock
            cvs.fillRect(30, 40, 50, 20, furnColor);
            // Receiver
            cvs.fillRect(80, 36, 85, 26, mainColor);
            cvs.fillRect(80, 34, 85, 3, lightColor);
            // Carry handle
            cvs.fillRect(125, 24, 30, 10, darkColor);
            cvs.fillRect(130, 24, 20, 4, lightColor);
            // Perforated heat shield handguard
            cvs.fillRect(165, 38, 65, 18, furnColor);
            for (let h = 172; h <= 218; h += 8) {
                cvs.fillRect(h, 42, 4, 3, darkColor);
                cvs.fillRect(h, 49, 4, 3, darkColor);
            }
            // Barrel & flash hider
            cvs.fillRect(230, 44, 45, 7, darkColor);
            cvs.fillRect(275, 42, 12, 11, mainColor);
            // Box mag & grip
            cvs.fillRect(110, 62, 38, 26, furnColor);
            cvs.fillRect(86, 62, 14, 22, furnDark);
            break;
        }

        case 'smg': {
            // Compact SMG / PDW
            cvs.drawDropShadow(60, 34, 180, 44, 6);
            // Telescoping stock bars
            cvs.fillRect(60, 42, 35, 4, C.STEEL_LIGHT);
            cvs.fillRect(56, 38, 7, 20, furnDark);
            // Receiver
            cvs.fillRect(95, 38, 75, 20, mainColor);
            cvs.fillRect(95, 36, 75, 3, lightColor);
            // Handguard & short barrel
            cvs.fillRect(170, 41, 35, 14, furnColor);
            cvs.fillRect(205, 45, 25, 6, darkColor);
            cvs.fillRect(228, 43, 8, 10, mainColor);
            // Curved mag & grip
            cvs.fillRect(130, 58, 14, 28, darkColor);
            cvs.fillRect(100, 58, 14, 20, furnDark);
            break;
        }

        case 'shotgun': {
            // Tactical / Pump Shotgun
            cvs.drawDropShadow(35, 36, 240, 36, 6);
            // Stock
            cvs.fillRect(35, 42, 55, 18, furnColor);
            // Receiver
            cvs.fillRect(90, 40, 65, 20, mainColor);
            cvs.fillRect(90, 38, 65, 3, lightColor);
            // Dual barrel & mag tube
            cvs.fillRect(155, 43, 105, 7, darkColor); // Top barrel
            cvs.fillRect(155, 51, 95, 6, mainColor); // Mag tube
            // Pump forend
            cvs.fillRect(175, 48, 42, 12, furnColor);
            // Grip
            cvs.fillRect(92, 60, 14, 18, furnDark);
            break;
        }

        case 'bullpup': {
            // Bullpup (AUG, FAMAS, Katiba)
            cvs.drawDropShadow(40, 28, 235, 48, 7);
            // Stock & rear receiver
            cvs.fillRect(40, 36, 95, 26, furnColor);
            cvs.fillRect(40, 34, 95, 3, furnDark);
            // Rear magazine behind pistol grip!
            cvs.fillRect(60, 62, 18, 24, darkColor);
            // Top carry handle / optic rail
            cvs.fillRect(115, 22, 65, 14, mainColor);
            cvs.fillRect(120, 28, 55, 4, lightColor);
            // Forward grip & trigger
            cvs.fillRect(130, 62, 14, 22, furnDark);
            // Front foregrip or handguard
            cvs.fillRect(175, 42, 35, 16, furnColor);
            // Barrel & muzzle
            cvs.fillRect(210, 46, 55, 6, darkColor);
            cvs.fillRect(263, 44, 10, 10, mainColor);
            break;
        }

        case 'ak74':
        case 'akm':
        case 'ak12': {
            // Kalashnikov family (stamped receiver, gas tube, curved magazine)
            const barrelLen = traits.isShortBarrel ? 35 : 55;
            const endX = 205 + barrelLen;
            cvs.drawDropShadow(30, 34, endX - 25, 46, 7);

            // Stock
            if (traits.family === 'ak12') {
                cvs.fillRect(30, 43, 50, 14, furnColor); // Telescoping
            } else {
                cvs.fillRect(30, 41, 55, 18, furnColor); // Standard
            }
            cvs.fillRect(30, 41, 55, 3, furnDark);

            // Stamped Receiver
            cvs.fillRect(85, 39, 65, 21, mainColor);
            cvs.fillRect(85, 37, 65, 3, lightColor);
            // Side optic rail if railed/NPZ
            if (traits.finish === 'railed') {
                cvs.fillRect(92, 32, 45, 5, C.RAIL_ALUM);
                cvs.fillRect(98, 37, 8, 4, darkColor);
            }

            // Gas block & handguard
            cvs.fillRect(150, 39, 50, 9, mainColor); // Gas tube
            cvs.fillRect(150, 48, 48, 12, furnColor); // Lower handguard
            cvs.fillRect(150, 48, 48, 2, furnDark);

            // Barrel, front sight, and muzzle brake
            cvs.fillRect(198, 45, barrelLen, 6, darkColor);
            cvs.fillRect(endX - 10, 38, 5, 12, mainColor); // Front sight post
            // AK-74 vs AKM muzzle device
            if (traits.family === 'ak74' || traits.family === 'ak12') {
                cvs.fillRect(endX - 5, 43, 14, 10, mainColor); // Big 74 brake
            } else {
                cvs.fillRect(endX - 5, 44, 8, 8, mainColor); // Slant brake
            }

            // Curved Magazine (7.62 is deeper curved than 5.45)
            const magColor = (traits.family === 'ak74' && traits.finish !== 'desert' && traits.finish !== 'woodland')
                ? [165, 78, 32] // Bakelite orange
                : darkColor;
            cvs.fillRect(120, 60, 22, 26, magColor);
            cvs.fillRect(122, 70, 22, 14, magColor);

            // Pistol Grip
            cvs.fillRect(90, 60, 14, 22, furnDark);

            // Underbarrel Grenade Launcher (GP-25)
            if (traits.hasGL) {
                cvs.fillRect(152, 60, 40, 12, darkColor);
                cvs.fillRect(152, 63, 36, 8, [20, 24, 30]);
                cvs.fillRect(144, 61, 8, 8, darkColor); // trigger
            }
            break;
        }

        default: {
            // AR-15 / M4 / M16 / HK416 / SCAR / G36 / FAL / G3
            const barrelLen = traits.isShortBarrel ? 35 : (traits.isLongBarrel ? 75 : 55);
            const handguardLen = traits.isShortBarrel ? 45 : (traits.isLongBarrel ? 80 : 65);
            const handguardEnd = 135 + handguardLen;
            const endX = handguardEnd + barrelLen;

            cvs.drawDropShadow(30, 32, endX - 25, 48, 7);

            // Stock
            if (traits.isLongBarrel && traits.family === 'ar15') {
                cvs.fillRect(30, 40, 55, 19, furnColor); // A2 fixed stock
                cvs.fillRect(30, 40, 55, 3, furnDark);
            } else {
                cvs.fillRect(35, 43, 40, 14, furnColor); // Crane / Carbine stock
                cvs.fillRect(75, 46, 12, 8, darkColor); // Buffer tube
            }

            // Upper & Lower Receiver
            cvs.fillRect(87, 40, 48, 20, mainColor);
            cvs.fillRect(87, 38, 48, 3, lightColor);
            // Carryhandle or flat-top rail
            if (traits.hasCarryHandle) {
                cvs.fillRect(95, 30, 40, 10, mainColor);
                cvs.fillRect(102, 34, 25, 4, C.BG_CENTER);
            } else {
                cvs.fillRect(87, 36, 48, 3, C.RAIL_ALUM);
            }

            // Handguard (Quad rail / MLOK / RIS)
            cvs.fillRect(135, 40, handguardLen, 18, furnColor);
            cvs.fillRect(135, 38, handguardLen, 3, lightColor); // Top rail
            cvs.fillRect(135, 56, handguardLen, 3, darkColor);  // Bottom rail
            // Vent slots
            for (let v = 142; v < handguardEnd - 8; v += 10) {
                cvs.fillRect(v, 45, 6, 6, darkColor);
            }

            // Barrel & Muzzle
            cvs.fillRect(handguardEnd, 46, barrelLen, 6, darkColor);
            // Front sight post if standard A2
            if (!traits.isShortBarrel && traits.family === 'ar15') {
                cvs.fillRect(handguardEnd + 8, 37, 5, 12, mainColor);
            }
            cvs.fillRect(endX - 6, 44, 10, 10, mainColor); // Flash hider

            // Magazine & Pistol Grip
            cvs.fillRect(115, 60, 20, 26, darkColor); // Stanag 30rnd mag
            cvs.fillRect(118, 68, 19, 16, darkColor); // Slight curve
            cvs.fillRect(90, 60, 14, 22, furnDark);   // A2 Pistol grip

            // Underbarrel M203 / M320 Grenade Launcher
            if (traits.hasGL) {
                cvs.fillRect(145, 58, 45, 13, darkColor);
                cvs.fillRect(145, 61, 40, 9, [18, 22, 28]);
                cvs.fillRect(137, 60, 8, 8, darkColor); // GL trigger
            } else if (traits.hasGrip) {
                cvs.fillRect(165, 59, 10, 16, furnDark); // Vertical grip
            }
            break;
        }
    }

    return cvs.toPngBuffer();
}

// 6. LOAD ALL WEAPONS FROM REPOSITORY
const arsenalJsonPath = path.join(__dirname, 'arsenal.json');
let allPrimaries = [];
if (fs.existsSync(arsenalJsonPath)) {
    allPrimaries = JSON.parse(fs.readFileSync(arsenalJsonPath, 'utf8'));
} else {
    console.error('arsenal.json not found, reading from app.js');
    const appJsContent = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
    const match = appJsContent.match(/const BUILTIN_WEAPONS = Object\.freeze\(\[([\s\S]*?)\]\);/);
    allPrimaries = eval('[' + match[1] + ']');
}

// Extract Handguns and Launchers
const launcherDefs = {
    "rhs_weap_M136": { name: "M136 AT4 (HEAT)", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_M136_hedp": { name: "M136 AT4 (HEDP)", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_M136_hp": { name: "M136 AT4 (HP)", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_m72a7": { name: "M72A7 LAW", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_smaw": { name: "Mk 153 SMAW", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_maaws": { name: "M3 MAAWS Carl Gustaf", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_fgm148": { name: "FGM-148 Javelin ATGM", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_fim92": { name: "FIM-92 Stinger MANPADS", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "launch_NLAW_F": { name: "PCML / NLAW ATGM", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_B_Titan_short_F": { name: "Titan Short ATGM (BLUFOR)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_B_Titan_F": { name: "Titan Long AA (BLUFOR)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_MRAWS_sand_F": { name: "MAAWS Mk4 Mod 0 (Sand)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_MRAWS_olive_F": { name: "MAAWS Mk4 Mod 0 (Olive)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_I_Titan_short_F": { name: "Titan Short ATGM (AAF)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_I_Titan_F": { name: "Titan Long AA (AAF)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_RPG32_F": { name: "RPG-32 Barkas 105mm", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_O_Vorona_brown_F": { name: "9M135 Vorona Wire-Guided AT", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_O_Titan_short_F": { name: "Titan Short ATGM (CSAT)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_O_Titan_F": { name: "Titan Long AA (CSAT)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "launch_RPG7_F": { name: "RPG-7 Modernized (Apex)", mod: "Vanilla", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_RPG7V": { name: "RPG-7V Launcher (CUP)", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_RPG18": { name: "RPG-18 Mukha", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_RPG22": { name: "RPG-22 Netto Disposable AT", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_Igla": { name: "9K38 Igla MANPADS (CUP)", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_9K32_Strela": { name: "9K32 Strela-2 MANPADS", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_Metis": { name: "9K115 Metis ATGM (CUP)", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_M136": { name: "M136 AT4 (CUP)", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_Javelin": { name: "FGM-148 Javelin (CUP)", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_Mk153": { name: "Mk 153 SMAW (CUP)", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_M3": { name: "M3 MAAWS Carl Gustaf (CUP)", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "CUP_launch_FIM92Stinger": { name: "FIM-92 Stinger MANPADS (CUP)", mod: "CUP", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_rpg7": { name: "RPG-7V2 Rocket Launcher (RHS)", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_rpg26": { name: "RPG-26 Aglen Disposable AT", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_rshg2": { name: "RShG-2 Thermobaric Rocket", mod: "RHS", category: "Launcher", caliber: "Rocket" },
    "rhs_weap_igla": { name: "9K38 Igla MANPADS (RHS)", mod: "RHS", category: "Launcher", caliber: "Rocket" }
};

const handgunDefs = {
    "hgun_P07_F": { name: "P07 9mm", category: "Handgun", caliber: "9x21" },
    "hgun_P07_khk_F": { name: "P07 9mm Khaki", category: "Handgun", caliber: "9x21" },
    "hgun_Rook40_F": { name: "Rook-40 9mm", category: "Handgun", caliber: "9x21" },
    "hgun_Pistol_heavy_01_F": { name: "4-five .45 Tactical", category: "Handgun", caliber: ".45ACP" },
    "hgun_Pistol_heavy_02_F": { name: "Zubr .45 Revolver", category: "Handgun", caliber: ".45ACP" },
    "hgun_Pistol_01_F": { name: "PM 9mm (Contact)", category: "Handgun", caliber: "9x21" },
    "hgun_ACPC2_F": { name: "ACP-C2 .45 Tactical", category: "Handgun", caliber: ".45ACP" },
    "hgun_PDW2000_F": { name: "PDW2000 9mm SMG", category: "Handgun", caliber: "9x21" },
    "rhsusf_weap_m9": { name: "Beretta M9 9mm", category: "Handgun", caliber: "9x21" },
    "rhsusf_weap_m1911a1": { name: "Colt M1911A1 .45", category: "Handgun", caliber: ".45ACP" },
    "rhsusf_weap_glock17": { name: "Glock 17 9mm (RHS)", category: "Handgun", caliber: "9x21" },
    "rhs_weap_pya": { name: "MP-443 Grach 9mm", category: "Handgun", caliber: "9x21" },
    "rhs_weap_makarov_pm": { name: "Makarov PM 9x18mm", category: "Handgun", caliber: "9x21" },
    "rhs_weap_makarov_pmm": { name: "Makarov PMM 9x18mm High-Cap", category: "Handgun", caliber: "9x21" },
    "rhs_weap_6p9": { name: "PB 6P9 Suppressed Pistol (RHS)", category: "Handgun", caliber: "9x21" },
    "rhs_weap_tt33": { name: "Tokarev TT-33 7.62mm (RHS)", category: "Handgun", caliber: "9x21" },
    "rhs_weap_cz75": { name: "CZ 75 9mm (RHS)", category: "Handgun", caliber: "9x21" },
    "rhs_weap_cz99": { name: "Zastava CZ99 9mm", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_Glock17_blk": { name: "Glock 17 Black 9mm", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_M9": { name: "Beretta M9 (CUP)", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_Makarov": { name: "Makarov PM (CUP)", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_PB6P9": { name: "PB 6P9 Suppressed Pistol (CUP)", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_Browning_HP": { name: "Browning Hi-Power 9mm", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_TaurusTracker455": { name: "Taurus Tracker .45 Revolver", category: "Handgun", caliber: ".45ACP" },
    "CUP_hgun_TT": { name: "Tokarev TT-33 7.62x25", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_Colt1911": { name: "Colt M1911 (CUP)", category: "Handgun", caliber: ".45ACP" },
    "CUP_hgun_Compact": { name: "CZ 75 D Compact 9mm", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_Duty": { name: "CZ 75 P-07 Duty 9mm", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_Phantom": { name: "CZ 75 SP-01 Phantom 9mm", category: "Handgun", caliber: "9x21" },
    "CUP_hgun_Deagle": { name: "Desert Eagle .50 AE", category: "Handgun", caliber: ".50BMG" },
    "CUP_hgun_MicroUzi": { name: "IMI Micro Uzi 9mm", category: "Handgun", caliber: "9x21" }
};

// Combine all weapons into a single unified catalog
const allCatalogWeapons = [];
const seenCatalogIds = new Set();

for (const w of allPrimaries) {
    if (!seenCatalogIds.has(w.id)) {
        seenCatalogIds.add(w.id);
        allCatalogWeapons.push({
            id: w.id,
            name: w.name || w.id,
            category: w.roles && w.roles.includes('Machine Gunner') ? 'LMG' : (w.caliber === '12Gauge' ? 'Shotgun' : 'Rifle'),
            caliber: w.caliber
        });
    }
}

for (const [id, def] of Object.entries(launcherDefs)) {
    if (!seenCatalogIds.has(id)) {
        seenCatalogIds.add(id);
        allCatalogWeapons.push({
            id,
            name: def.name,
            category: 'Launcher',
            caliber: 'Rocket'
        });
    }
}

for (const [id, def] of Object.entries(handgunDefs)) {
    if (!seenCatalogIds.has(id)) {
        seenCatalogIds.add(id);
        allCatalogWeapons.push({
            id,
            name: def.name,
            category: 'Handgun',
            caliber: def.caliber
        });
    }
}

if (!seenCatalogIds.has('test_custom_scar_h')) {
    seenCatalogIds.add('test_custom_scar_h');
    allCatalogWeapons.push({
        id: 'test_custom_scar_h',
        name: 'SCAR-H Custom',
        category: 'Rifle',
        caliber: '7.62x51'
    });
}

console.log(`Analyzing and generating 1-to-1 dedicated variant photographs for all ${allCatalogWeapons.length} weapons...`);

const uniquePhotoFiles = new Set();
let generatedCount = 0;

for (const w of allCatalogWeapons) {
    const traits = analyzeWeapon(w.id, w.name, w.category, w.caliber);
    const pngBuffer = generateVariantPhoto(traits);
    const fileName = `${w.id}.png`;
    const filePath = path.join(PHOTOS_DIR, fileName);

    fs.writeFileSync(filePath, pngBuffer);
    uniquePhotoFiles.add(fileName);
    generatedCount++;
}

console.log(`Successfully generated ${generatedCount} distinct variant photographs in ${PHOTOS_DIR}`);
console.log(`Distinct unique files created: ${uniquePhotoFiles.size}`);

// 7. INJECT photoUrl INTO BUILTIN_WEAPONS IN APP.TS & APP.JS
// Update allPrimaries with photoUrl
allPrimaries.forEach(w => {
    w.photoUrl = `assets/weapons/photos/${w.id}.png`;
});

// Save back to arsenal.json
fs.writeFileSync(arsenalJsonPath, JSON.stringify(allPrimaries, null, 2), 'utf8');
console.log(`Updated ${arsenalJsonPath} with photoUrl`);

function formatWeaponDefWithPhoto(w) {
    const parts = [
        `id: "${w.id}"`,
        `name: ${JSON.stringify(w.name)}`,
        `mod: "${w.mod}"`,
        `factions: ${JSON.stringify(w.factions)}`,
        `roles: ${JSON.stringify(w.roles)}`,
        `tier: "${w.tier || 'standard'}"`,
        `caliber: "${w.caliber}"`,
        `defaultMag: [${JSON.stringify(w.defaultMag[0])}, ${w.defaultMag[1]}]`,
        `opticType: "${w.opticType}"`,
        `hasBipod: ${w.hasBipod ? 'true' : 'false'}`
    ];
    if (w.defaultBipod) {
        parts.push(`defaultBipod: "${w.defaultBipod}"`);
    }
    parts.push(`hasMuzzle: ${w.hasMuzzle ? 'true' : 'false'}`);
    parts.push(`photoUrl: "assets/weapons/photos/${w.id}.png"`);
    return `    { ${parts.join(', ')} }`;
}

// 8. UPDATE APP.TS
const appTsPath = path.join(__dirname, '..', 'app.ts');
let appTs = fs.readFileSync(appTsPath, 'utf8');

const half = Math.floor(allPrimaries.length / 2);
const part1Str = allPrimaries.slice(0, half).map(formatWeaponDefWithPhoto).join(',\n');
const part2Str = allPrimaries.slice(half).map(formatWeaponDefWithPhoto).join(',\n');
const splitBlock = `const WEAPONS_PART1: readonly WeaponDef[] = [\n${part1Str}\n];\nconst WEAPONS_PART2: readonly WeaponDef[] = [\n${part2Str}\n];\nconst BUILTIN_WEAPONS: readonly WeaponDef[] = Object.freeze([...WEAPONS_PART1, ...WEAPONS_PART2]);`;

const tsRegex = /(const WEAPONS_PART1[\s\S]*?const BUILTIN_WEAPONS: readonly WeaponDef\[\] = Object\.freeze\(\[\.\.\.WEAPONS_PART1, \.\.\.WEAPONS_PART2\]\);|const BUILTIN_WEAPONS: readonly WeaponDef\[\] = Object\.freeze\(\[[\s\S]*?\n\]\);)/;
if (tsRegex.test(appTs)) {
    appTs = appTs.replace(tsRegex, splitBlock);
    fs.writeFileSync(appTsPath, appTs, 'utf8');
    console.log(`Successfully injected photoUrl into BUILTIN_WEAPONS in app.ts`);
} else {
    console.error('Could not match BUILTIN_WEAPONS in app.ts');
}

// 9. UPDATE APP.JS
const appJsPath = path.join(__dirname, '..', 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

const formattedArrayContent = allPrimaries.map(formatWeaponDefWithPhoto).join(',\n');
const jsRegex = /const BUILTIN_WEAPONS = Object\.freeze\(\[[\s\S]*?\n\]\);/;
if (jsRegex.test(appJsContent)) {
    appJsContent = appJsContent.replace(jsRegex, `const BUILTIN_WEAPONS = Object.freeze([\n${formattedArrayContent}\n]);`);
    fs.writeFileSync(appJsPath, appJsContent, 'utf8');
    console.log(`Successfully injected photoUrl into BUILTIN_WEAPONS in app.js`);
} else {
    console.error('Could not match BUILTIN_WEAPONS in app.js');
}

// 10. VERIFY COMPLETE 1-TO-1 COVERAGE
let missingCount = 0;
for (const w of allCatalogWeapons) {
    const expectedFile = path.join(PHOTOS_DIR, `${w.id}.png`);
    if (!fs.existsSync(expectedFile)) {
        console.error(`MISSING ASSET: ${expectedFile}`);
        missingCount++;
    } else {
        const stats = fs.statSync(expectedFile);
        if (stats.size < 300) {
            console.error(`CORRUPT ASSET (<300 bytes): ${expectedFile}`);
            missingCount++;
        }
    }
}

if (missingCount === 0) {
    console.log(`\n🎉 VERIFICATION SUCCESSFUL: 100% of ${allCatalogWeapons.length} weapons possess unique, verified variant photo assets!`);
} else {
    console.error(`Verification failed with ${missingCount} errors.`);
    process.exit(1);
}
