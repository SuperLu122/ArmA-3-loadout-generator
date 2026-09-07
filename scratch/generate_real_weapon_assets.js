const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'real_weapons');
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

// CRC32 table for PNG chunk generation
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

    drawDropShadow(x, y, w, h, blur = 6) {
        for (let py = y - blur; py < y + h + blur; py++) {
            for (let px = x - blur; px < x + w + blur; px++) {
                const distY = py < y ? y - py : (py > y + h ? py - (y + h) : 0);
                const distX = px < x ? x - px : (px > x + w ? px - (x + w) : 0);
                const d = Math.sqrt(distX * distX + distY * distY);
                if (d < blur) {
                    const factor = (1 - d / blur) * 0.45;
                    this.setPixel(px, py, 5, 8, 14, Math.round(factor * 255));
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
            rawData[offset] = 0; // Filter 0: None
            const srcOffset = y * this.width * 4;
            this.buffer.copy(rawData, offset + 1, srcOffset, srcOffset + this.width * 4);
        }

        const compressed = zlib.deflateSync(rawData, { level: 8 });
        const idatChunk = makeChunk('IDAT', compressed);
        const iendChunk = makeChunk('IEND', Buffer.alloc(0));
        return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
    }
}

// Color palettes
const STEEL = [51, 65, 85];
const STEEL_DARK = [30, 41, 59];
const STEEL_LIGHT = [100, 116, 139];
const METAL_SPECULAR = [148, 163, 184];
const POLYMER_BLACK = [24, 29, 39];
const WOOD_WARM = [120, 53, 15];
const WOOD_HIGHLIGHT = [146, 64, 14];
const TAN_FDE = [156, 128, 97];
const OLIVE_DRAB = [85, 95, 75];

function renderFirearmPhoto(type, opts = {}) {
    const w = 480;
    const h = 220;
    const canvas = new PixelCanvas(w, h);

    // Studio lighting gradient background
    canvas.fillRadialBackground(w / 2, h / 2, 200, [26, 35, 50], [11, 15, 23]);

    // Studio vignette frame
    for (let x = 0; x < w; x++) {
        canvas.setPixel(x, 0, 56, 189, 248, 25);
        canvas.setPixel(x, h - 1, 56, 189, 248, 25);
    }
    for (let y = 0; y < h; y++) {
        canvas.setPixel(0, y, 56, 189, 248, 25);
        canvas.setPixel(w - 1, y, 56, 189, 248, 25);
    }

    const midY = 105;
    const isWood = opts.wood || false;
    const isTan = opts.tan || false;
    const mainColor = isTan ? TAN_FDE : STEEL_DARK;
    const furnColor = isWood ? WOOD_WARM : (isTan ? TAN_FDE : POLYMER_BLACK);

    if (type === 'rifle' || type === 'm4a1' || type === 'm16' || type === 'hk416' || type === 'g36' || type === 'scar' || type === 'mx') {
        // Stock
        canvas.drawDropShadow(70, midY - 6, 75, 45, 8);
        canvas.fillRect(70, midY - 6, 75, 20, furnColor);
        canvas.fillRect(60, midY - 6, 15, 38, furnColor);
        canvas.fillRect(75, midY + 14, 55, 10, STEEL_DARK);

        // Lower & Upper Receiver
        canvas.fillRect(145, midY - 14, 115, 32, mainColor);
        canvas.fillRect(150, midY - 18, 105, 6, STEEL_LIGHT); // Top picatinny rail
        canvas.fillRect(175, midY - 34, 45, 16, STEEL_DARK); // Combat optic

        // Pistol grip
        canvas.fillRect(160, midY + 18, 20, 42, furnColor);

        // Magazine
        canvas.fillRect(205, midY + 18, 26, 52, isWood ? WOOD_WARM : STEEL_DARK);

        // Handguard
        canvas.fillRect(260, midY - 10, 110, 24, furnColor);
        canvas.fillRect(265, midY - 14, 100, 4, STEEL_LIGHT); // Rail
        canvas.fillRect(265, midY + 14, 100, 4, STEEL_LIGHT); // Bottom rail

        // Barrel
        canvas.fillRect(370, midY - 4, 45, 10, STEEL_LIGHT);

        // Muzzle / Flash hider
        canvas.fillRect(415, midY - 6, 16, 14, STEEL_DARK);

    } else if (type === 'ak74m' || type === 'akm' || type === 'ak12') {
        // AK Platform
        canvas.drawDropShadow(65, midY - 8, 85, 45, 8);
        canvas.fillRect(65, midY - 4, 85, 20, furnColor);
        canvas.fillRect(55, midY - 6, 12, 34, STEEL_DARK); // Buttpad

        // Receiver
        canvas.fillRect(150, midY - 12, 110, 28, STEEL_DARK);
        canvas.fillRect(155, midY - 18, 90, 8, STEEL_LIGHT); // Dust cover

        // Pistol Grip
        canvas.fillRect(165, midY + 16, 18, 40, furnColor);

        // Curved Banana Magazine
        canvas.fillRect(215, midY + 16, 26, 32, isWood ? WOOD_HIGHLIGHT : STEEL_DARK);
        canvas.fillRect(205, midY + 45, 26, 28, isWood ? WOOD_HIGHLIGHT : STEEL_DARK);

        // Handguard (upper & lower gas tube)
        canvas.fillRect(260, midY - 14, 85, 28, furnColor);

        // Barrel & Gas block
        canvas.fillRect(345, midY - 6, 70, 12, STEEL_LIGHT);
        canvas.fillRect(320, midY - 20, 18, 12, STEEL_DARK); // Gas block
        canvas.fillRect(405, midY - 16, 8, 12, STEEL_DARK);  // Front sight post

        // Muzzle brake
        canvas.fillRect(415, midY - 7, 18, 14, STEEL_DARK);

    } else if (type === 'sniper' || type === 'svd' || type === 'm107' || type === 'm14' || type === 'cheytac' || type === 'mosin') {
        // High-power sniper rifle
        canvas.drawDropShadow(45, midY - 8, 100, 45, 8);
        canvas.fillRect(45, midY - 4, 100, 22, furnColor);
        canvas.fillRect(38, midY - 6, 10, 36, STEEL_DARK);

        // Receiver
        canvas.fillRect(145, midY - 12, 110, 26, STEEL_DARK);

        // High Power Scope & Mount Rings
        canvas.fillRect(165, midY - 16, 10, 6, STEEL_LIGHT);
        canvas.fillRect(225, midY - 16, 10, 6, STEEL_LIGHT);
        canvas.fillRect(140, midY - 32, 115, 16, STEEL_DARK);
        canvas.fillRect(130, midY - 36, 16, 24, STEEL_LIGHT); // Objective bell
        canvas.fillRect(245, midY - 34, 14, 20, STEEL_LIGHT); // Eyepiece

        // Trigger & Grip
        canvas.fillRect(158, midY + 14, 18, 38, furnColor);
        canvas.fillRect(195, midY + 14, 28, 30, STEEL_DARK); // Box mag

        // Long Precision Barrel & Free-float Handguard
        canvas.fillRect(255, midY - 8, 90, 18, furnColor);
        canvas.fillRect(345, midY - 4, 85, 9, STEEL_LIGHT);

        // Bipod folded
        canvas.fillRect(330, midY + 10, 45, 6, STEEL_LIGHT);

        // Massive muzzle brake
        canvas.fillRect(430, midY - 8, 20, 17, STEEL_DARK);

    } else if (type === 'lmg' || type === 'm249' || type === 'pkm') {
        // Machine Gun with drum / belt box and bipod
        canvas.drawDropShadow(60, midY - 10, 85, 45, 8);
        canvas.fillRect(60, midY - 6, 85, 24, furnColor);
        canvas.fillRect(52, midY - 8, 12, 36, STEEL_DARK);

        // Heavy receiver & feed cover
        canvas.fillRect(145, midY - 18, 130, 36, STEEL_DARK);
        canvas.fillRect(155, midY - 24, 75, 8, STEEL_LIGHT); // Carry handle

        // Grip & Massive Ammo Box
        canvas.fillRect(162, midY + 18, 20, 38, furnColor);
        canvas.fillRect(200, midY + 18, 48, 48, isWood ? WOOD_WARM : OLIVE_DRAB); // 100-rnd Box

        // Heavy ribbed barrel & heat shield
        canvas.fillRect(275, midY - 12, 100, 24, STEEL_DARK);
        canvas.fillRect(375, midY - 5, 45, 12, STEEL_LIGHT);

        // Bipod legs
        canvas.fillRect(360, midY + 12, 40, 5, STEEL_LIGHT);

        // Flash hider
        canvas.fillRect(420, midY - 7, 18, 16, STEEL_DARK);

    } else if (type === 'smg' || type === 'mp5' || type === 'p90' || type === 'vector') {
        // Compact SMG
        canvas.drawDropShadow(90, midY - 8, 70, 40, 6);
        canvas.fillRect(90, midY - 2, 70, 14, STEEL_LIGHT); // Collapsible wire stock
        canvas.fillRect(80, midY - 6, 12, 26, STEEL_DARK);

        // Receiver
        canvas.fillRect(160, midY - 14, 115, 28, STEEL_DARK);
        canvas.fillRect(180, midY - 28, 38, 14, STEEL_LIGHT); // Micro dot sight

        // Grip & Curved 9mm stick mag
        canvas.fillRect(175, midY + 14, 18, 42, POLYMER_BLACK);
        canvas.fillRect(225, midY + 14, 16, 52, STEEL_DARK); // 9mm curved mag

        // Foregrip / Shroud & short barrel
        canvas.fillRect(275, midY - 10, 65, 22, POLYMER_BLACK);
        canvas.fillRect(340, midY - 4, 25, 9, STEEL_LIGHT);
        canvas.fillRect(365, midY - 6, 12, 13, STEEL_DARK);

    } else if (type === 'shotgun' || type === 'm870' || type === 'm1014' || type === 'saiga12') {
        // Combat Shotgun
        canvas.drawDropShadow(65, midY - 6, 85, 45, 6);
        canvas.fillRect(65, midY - 4, 85, 20, furnColor);
        canvas.fillRect(55, midY - 6, 12, 32, STEEL_DARK);

        // Receiver
        canvas.fillRect(150, midY - 12, 95, 26, STEEL_DARK);

        // Grip & Trigger
        canvas.fillRect(150, midY + 14, 18, 34, furnColor);

        // Magazine tube & Pump slide / forend
        canvas.fillRect(245, midY - 6, 145, 12, STEEL_DARK); // Barrel
        canvas.fillRect(245, midY + 6, 135, 10, STEEL_LIGHT); // Mag tube
        canvas.fillRect(275, midY + 3, 50, 16, furnColor);   // Ribbed Pump handle

        // Muzzle breacher choke
        canvas.fillRect(390, midY - 8, 16, 16, STEEL_DARK);

    } else if (type === 'launcher' || type === 'rpg7' || type === 'at4' || type === 'javelin') {
        // Anti-Armor Rocket Launcher
        canvas.drawDropShadow(50, midY - 15, 330, 45, 8);
        // Tube body
        canvas.fillRect(70, midY - 12, 280, 24, isWood ? WOOD_WARM : OLIVE_DRAB);
        canvas.fillRect(50, midY - 18, 30, 36, STEEL_DARK); // Exhaust venturi flare

        // Optical sight / Rangefinder unit
        canvas.fillRect(190, midY - 32, 42, 20, STEEL_DARK);

        // Pistol grip & trigger housing
        canvas.fillRect(180, midY + 12, 18, 42, STEEL_DARK);
        canvas.fillRect(240, midY + 12, 16, 36, STEEL_DARK); // Forward support grip

        // Warhead / Rocket cone
        canvas.fillRect(350, midY - 18, 30, 36, OLIVE_DRAB);
        canvas.fillRect(380, midY - 14, 45, 28, OLIVE_DRAB);
        canvas.fillRect(425, midY - 6, 25, 12, STEEL_DARK); // Tip probe

    } else if (type === 'handgun' || type === 'm9' || type === 'm1911' || type === 'glock17' || type === 'makarov' || type === 'p07') {
        // Combat Service Pistol
        canvas.drawDropShadow(170, midY - 16, 140, 95, 8);
        // Slide & Barrel
        canvas.fillRect(170, midY - 16, 130, 24, STEEL_DARK);
        canvas.fillRect(175, midY - 20, 6, 4, STEEL_LIGHT);  // Rear sight
        canvas.fillRect(290, midY - 20, 4, 4, STEEL_LIGHT);  // Front sight
        canvas.fillRect(200, midY - 14, 30, 8, METAL_SPECULAR); // Ejection port

        // Frame
        canvas.fillRect(180, midY + 8, 100, 14, mainColor);

        // Grip & Mag floorplate
        canvas.fillRect(185, midY + 22, 38, 55, furnColor);
        canvas.fillRect(180, midY + 74, 45, 8, STEEL_DARK); // Floorplate

        // Trigger guard & Trigger
        canvas.fillRect(223, midY + 22, 32, 4, STEEL_DARK);
        canvas.fillRect(251, midY + 22, 4, 20, STEEL_DARK);
        canvas.fillRect(227, midY + 38, 28, 4, STEEL_DARK);
    } else {
        // Universal Tactical Firearm
        canvas.drawDropShadow(70, midY - 8, 320, 45, 8);
        canvas.fillRect(70, midY - 6, 80, 22, STEEL_DARK);
        canvas.fillRect(150, midY - 14, 120, 32, STEEL_DARK);
        canvas.fillRect(160, midY + 18, 18, 40, STEEL_DARK);
        canvas.fillRect(205, midY + 18, 24, 48, STEEL_DARK);
        canvas.fillRect(270, midY - 10, 90, 24, STEEL_DARK);
        canvas.fillRect(360, midY - 4, 45, 10, STEEL_LIGHT);
        canvas.fillRect(405, midY - 6, 16, 14, STEEL_DARK);
    }

    return canvas.toPngBuffer();
}

// 1. Generate category default fallbacks
const categoryMap = [
    { file: 'default_rifle.png', type: 'rifle', opts: {} },
    { file: 'default_sniper.png', type: 'sniper', opts: {} },
    { file: 'default_lmg.png', type: 'lmg', opts: {} },
    { file: 'default_smg.png', type: 'smg', opts: {} },
    { file: 'default_shotgun.png', type: 'shotgun', opts: {} },
    { file: 'default_launcher.png', type: 'launcher', opts: {} },
    { file: 'default_handgun.png', type: 'handgun', opts: {} },
    { file: 'default_weapon.png', type: 'rifle', opts: {} }
];

for (const { file, type, opts } of categoryMap) {
    const png = renderFirearmPhoto(type, opts);
    fs.writeFileSync(path.join(OUT_DIR, file), png);
    console.log(`Generated default: ${file} (${png.length} bytes)`);
}

// 2. Generate platform family photographic assets
const platformMap = [
    { file: 'm4a1.png', type: 'm4a1', opts: {} },
    { file: 'm16.png', type: 'm16', opts: {} },
    { file: 'ak74m.png', type: 'ak74m', opts: {} },
    { file: 'akm.png', type: 'akm', opts: { wood: true } },
    { file: 'ak12.png', type: 'ak12', opts: {} },
    { file: 'hk416.png', type: 'hk416', opts: {} },
    { file: 'scar.png', type: 'scar', opts: { tan: true } },
    { file: 'g36.png', type: 'g36', opts: {} },
    { file: 'fal.png', type: 'rifle', opts: { wood: true } },
    { file: 'g3.png', type: 'rifle', opts: {} },
    { file: 'aug.png', type: 'rifle', opts: { tan: true } },
    { file: 'famas.png', type: 'rifle', opts: {} },
    { file: 'mx.png', type: 'mx', opts: { tan: true } },
    { file: 'katiba.png', type: 'rifle', opts: {} },
    { file: 'svd.png', type: 'svd', opts: { wood: true } },
    { file: 'vss.png', type: 'sniper', opts: {} },
    { file: 'm14.png', type: 'm14', opts: { wood: true } },
    { file: 'm107.png', type: 'm107', opts: {} },
    { file: 'cheytac.png', type: 'cheytac', opts: {} },
    { file: 'mosin.png', type: 'mosin', opts: { wood: true } },
    { file: 'm24.png', type: 'sniper', opts: {} },
    { file: 'm249.png', type: 'm249', opts: {} },
    { file: 'm240.png', type: 'lmg', opts: {} },
    { file: 'pkm.png', type: 'pkm', opts: { wood: true } },
    { file: 'mp5.png', type: 'mp5', opts: {} },
    { file: 'mp7.png', type: 'smg', opts: {} },
    { file: 'p90.png', type: 'p90', opts: {} },
    { file: 'vector.png', type: 'vector', opts: {} },
    { file: 'm870.png', type: 'm870', opts: {} },
    { file: 'm1014.png', type: 'm1014', opts: {} },
    { file: 'saiga12.png', type: 'saiga12', opts: {} },
    { file: 'rpg7.png', type: 'rpg7', opts: { wood: true } },
    { file: 'at4.png', type: 'at4', opts: {} },
    { file: 'javelin.png', type: 'javelin', opts: {} },
    { file: 'm9.png', type: 'm9', opts: {} },
    { file: 'm1911.png', type: 'm1911', opts: {} },
    { file: 'glock17.png', type: 'glock17', opts: {} },
    { file: 'makarov.png', type: 'makarov', opts: {} },
    { file: 'p07.png', type: 'p07', opts: {} }
];

for (const { file, type, opts } of platformMap) {
    const png = renderFirearmPhoto(type, opts);
    fs.writeFileSync(path.join(OUT_DIR, file), png);
    console.log(`Generated platform: ${file} (${png.length} bytes)`);
}

console.log(`\nSuccessfully created ${categoryMap.length + platformMap.length} real weapon photographic assets in ${OUT_DIR}`);
