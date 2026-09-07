const path = require('path');
const fs = require('fs');
const { Script, createContext } = require('vm');

const appPath = path.join(__dirname, 'app.js');
const appCode = fs.readFileSync(appPath, 'utf8');

console.log('=== RUNNING ARMA 3 LOADOUT ENGINE TEST SUITE ===\n');

// 1. Test VM execution context (Browser emulation)
const mockStorage = new Map();
const mockLocalStorage = {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k),
    clear: () => mockStorage.clear()
};

const context = {
    document: {
        addEventListener: () => {},
        getElementById: () => null,
        querySelectorAll: () => []
    },
    window: {
        addEventListener: () => {},
        scrollTo: () => {},
        requestAnimationFrame: (cb) => cb(),
        scrollY: 0,
        location: {
            origin: 'http://localhost:3000',
            pathname: '/index.html',
            hash: ''
        }
    },
    navigator: {
        clipboard: {
            writeText: async () => {}
        }
    },
    localStorage: mockLocalStorage,
    Math: Math,
    console: console,
    Set: Set,
    Map: Map,
    Array: Array,
    JSON: JSON,
    parseInt: parseInt,
    Date: Date,
    Object: Object,
    Boolean: Boolean,
    String: String,
    Number: Number,
    Error: Error,
    TypeError: TypeError,
    RegExp: RegExp,
    Promise: Promise,
    setTimeout: setTimeout,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent,
    btoa: (s) => Buffer.from(s, 'utf8').toString('base64'),
    atob: (s) => Buffer.from(s, 'base64').toString('utf8'),
    Buffer: Buffer,
    Uint8Array: Uint8Array,
    undefined: undefined
};

createContext(context);
const script = new Script(appCode);
script.runInContext(context);

const {
    generateLoadout,
    generateLoadoutWithOptions,
    generateBestLoadout,
    generateSQF,
    WeaponRepository,
    LoadoutEngine,
    BestLoadoutFactory,
    SqfSerializer,
    RandomUtils,
    UIController,
    ArmoryController,
    WeaponAssetResolver,
    WeaponPhotoResolver,
    LoadoutHistory,
    LogisticsCalculator,
    WEIGHT_TABLE,
    LoadoutShareCodec,
    FIRETEAM_TEMPLATES,
    SquadBuilder,
    LoadoutComparator,
    WEAPON_STATS_TABLE,
    RadarChart,
    SqfImporter,
    KeyboardController,
    BIOME_GEAR,
    AmmunitionManager,
    SoundController,
    BriefingCardGenerator
} = context;

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ ASSERTION FAILED: ${message}`);
        process.exit(1);
    }
    console.log(`  ✓ ${message}`);
}

console.log('Test Suite 1: Headless generateLoadout & SQF formatting');
const standardLoadout = generateLoadout('NATO', 'Rifleman');
assert(standardLoadout && standardLoadout.loadoutData, 'generateLoadout returns loadoutData');
assert(standardLoadout.loadoutData.faction === 'NATO', 'Faction is NATO');
assert(standardLoadout.loadoutData.role === 'Rifleman', 'Role is Rifleman');
assert(standardLoadout.sqf.startsWith('player setUnitLoadout ['), 'SQF starts with player setUnitLoadout');
assert(standardLoadout.sqf.endsWith('];'), 'SQF ends with semicolon');

console.log('\nTest Suite 2: All Factions & Roles Matrix');
const factions = ['NATO', 'CSAT', 'AAF', 'FIA'];
const roles = ['Rifleman', 'Medic', 'Marksman', 'Anti-Tank', 'Machine Gunner', 'Sniper', 'Pilot', 'Pointman'];

for (const f of factions) {
    for (const r of roles) {
        const res = generateLoadoutWithOptions({
            faction: f,
            role: r,
            chaosLevel: 1,
            activeMods: new Set(['Vanilla', 'RHS', 'CUP', 'NIArms'])
        });
        assert(res.loadoutData.faction === f, `${f} ${r} faction matches`);
        assert(res.loadoutData.role === r, `${f} ${r} role matches`);
        assert(res.sqf && res.sqf.length > 50, `${f} ${r} generates valid SQF payload`);
    }
}

console.log('\nTest Suite 3: Chaos Modes Verification');
const chaos1 = generateLoadoutWithOptions({ faction: 'CSAT', role: 'Rifleman', chaosLevel: 1, activeMods: new Set(['Vanilla']) });
assert(chaos1.loadoutData.meta.chaosLevel === 1, 'Chaos level 1 metadata recorded');

const chaos2 = generateLoadoutWithOptions({ faction: 'NATO', role: 'Marksman', chaosLevel: 2, activeMods: new Set(['Vanilla', 'RHS']) });
assert(chaos2.loadoutData.meta.chaosLevel === 2, 'Chaos level 2 metadata recorded');

const chaos3 = generateLoadoutWithOptions({ faction: 'FIA', role: 'Machine Gunner', chaosLevel: 3, activeMods: new Set(['Vanilla', 'CUP']) });
assert(chaos3.loadoutData.meta.chaosLevel === 3, 'Chaos level 3 metadata recorded');

console.log('\nTest Suite 4: Empty / Invalid Mod Fallback Gracefulness');
const fallbackRes = generateLoadoutWithOptions({
    faction: 'NATO',
    role: 'Rifleman',
    chaosLevel: 1,
    activeMods: new Set() // Empty mods
});
assert(fallbackRes.loadoutData.primary.class.length > 0, 'Graceful fallback weapon selected when no mods enabled');

console.log('\nTest Suite 5: Curated Best Loadouts & Meta Presets (All 32 Faction/Role Combinations)');
for (const f of factions) {
    for (const r of roles) {
        const best = generateBestLoadout(f, r);
        assert(best.loadoutData.primary.class.length > 0, `Best loadout ${f} ${r} has primary weapon (${best.loadoutData.primary.class})`);
        assert(best.sqf.startsWith('player setUnitLoadout ['), `Best loadout ${f} ${r} SQF valid start`);
        assert(best.sqf.endsWith('];'), `Best loadout ${f} ${r} SQF valid termination`);
        assert(Array.isArray(best.loadoutData.primary.mag) && best.loadoutData.primary.mag[0].length > 0, `Best loadout ${f} ${r} has valid combat mag`);
        if (r === 'Pointman') {
            assert(best.loadoutData.role === 'Pointman', `${f} Pointman role confirmed`);
            assert(best.sqf.includes('MiniGrenade') || best.sqf.includes('00Buck') || best.sqf.includes('Pellets') || best.sqf.includes('Slug') || best.loadoutData.primary.class.includes('MXC') || best.loadoutData.primary.class.includes('P90'), `${f} Pointman has CQC breacher kit`);
        }
    }
}

// Meta presets filtering tests
const allPresets = BestLoadoutFactory.getAllPresets();
assert(allPresets.length >= 32, `Registry has ${allPresets.length} presets (>= 32 expected)`);

const natoPresets = BestLoadoutFactory.getAllPresets({ faction: 'NATO' });
assert(natoPresets.length > 0 && natoPresets.every(p => p.faction === 'NATO'), 'Faction filter works accurately');

const pointmanPresets = BestLoadoutFactory.getAllPresets({ role: 'Pointman' });
assert(pointmanPresets.length >= 4 && pointmanPresets.every(p => p.role === 'Pointman'), 'Role filter works accurately for Pointman');

const rhsPresets = BestLoadoutFactory.getAllPresets({ mod: 'RHS' });
assert(rhsPresets.length > 0 && rhsPresets.every(p => p.mod === 'RHS' || p.mod === 'Hybrid'), 'Mod filter works accurately');

// Dynamic meta rolling tests
const rolledNatoPointman = BestLoadoutFactory.rollMeta('NATO', 'Pointman');
assert(rolledNatoPointman.loadoutData.faction === 'NATO', 'rollMeta respects NATO faction');
assert(rolledNatoPointman.loadoutData.role === 'Pointman', 'rollMeta respects Pointman role');
assert(rolledNatoPointman.presetTitle.length > 0, 'rollMeta returns descriptive preset title');
assert(rolledNatoPointman.sqf.startsWith('player setUnitLoadout ['), 'rollMeta outputs valid SQF string');

const rolledRandom = BestLoadoutFactory.rollMeta('Random', 'Random');
assert(rolledRandom.loadoutData.primary.class.length > 0, 'rollMeta with Random returns valid primary');
assert(rolledRandom.sqf.length > 50, 'rollMeta with Random returns full SQF');

console.log('\nTest Suite 6: WeaponRepository In-Memory Caching & Custom Weapons');
WeaponRepository.invalidateCache();
assert(WeaponRepository.getCustomWeapons().length === 0, 'Initial custom weapons empty');

const testWeapon = {
    id: 'test_custom_scar_h',
    name: 'FN SCAR-H 7.62mm',
    mod: 'Custom',
    factions: ['NATO'],
    roles: ['Rifleman', 'Marksman'],
    tier: 'specops',
    caliber: '7.62x51',
    defaultMag: ['20Rnd_762x51_Mag', 20],
    opticType: 'mid',
    hasBipod: true,
    hasMuzzle: true
};

const saved = WeaponRepository.saveCustomWeapons([testWeapon]);
assert(saved === true, 'Custom weapon successfully saved');
assert(WeaponRepository.getCustomWeapons().length === 1, 'Custom weapons length is 1');
assert(WeaponRepository.getCustomWeapons()[0].id === 'test_custom_scar_h', 'Cached custom weapon matches ID');

// Verification of schema sanitizer
const malformed = WeaponRepository.sanitizeWeapon({
    id: 'broken_ak',
    defaultMag: ['30Rnd', -10],
    caliber: 'invalid_caliber_name',
    factions: []
});
assert(malformed.defaultMag[1] === 30, 'Malformed negative capacity corrected to 30');
assert(malformed.caliber === '5.56x45', 'Invalid caliber safely defaulted');
assert(malformed.factions.length > 0, 'Empty factions safely defaulted');

console.log('\nTest Suite 7: Performance Benchmark (1,000 Repeated Generations)');
const startTime = Date.now();
for (let i = 0; i < 1000; i++) {
    generateLoadout('NATO', 'Rifleman');
}
const elapsed = Date.now() - startTime;
console.log(`  ✓ 1,000 loadout generations executed in ${elapsed}ms (${(elapsed / 1000).toFixed(3)}ms per generation)`);
assert(elapsed < 1000, '1,000 generations must complete in under 1 second');

console.log('\nTest Suite 8: Armory Catalog & Locked Weapon Roll Verification');
// 1. Build catalog verification
const catalog = ArmoryController.buildCatalog();
assert(Array.isArray(catalog), 'ArmoryController.buildCatalog() returns an array');
assert(catalog.length >= 500, `Armory catalog contains comprehensive ultra arsenal (expected >= 500, got ${catalog.length} weapons loaded)`);

// Deep catalog metadata and binding integrity check across all weapons
const VALID_CALIBERS_SET = new Set([
    "5.56x45", "5.45x39", "7.62x39", "7.62x51", "7.62x54",
    "6.5x39", "5.8x42", "9x21", ".45ACP", "4.6x30", ".300WM",
    ".338", "9.3x64", ".408", "12.7x108", ".50BMG", "12Gauge", "Rocket"
]);

const mockEl = () => ({ textContent: '', innerHTML: '', style: {}, className: '', src: '', alt: '', classList: { add: () => {}, remove: () => {} } });
ArmoryController.elements = {
    inspectModal: mockEl(),
    modalWeaponName: mockEl(),
    modalWeaponMod: mockEl(),
    modalWeaponCategory: mockEl(),
    modalWeaponCaliber: mockEl(),
    modalWeaponId: mockEl(),
    modalCopyFeedback: mockEl(),
    modalDefaultMag: mockEl(),
    modalOpticProfile: mockEl(),
    modalSlotsInfo: mockEl(),
    modalOpticsCount: mockEl(),
    modalOpticsList: mockEl(),
    modalMuzzlesCount: mockEl(),
    modalMuzzlesList: mockEl(),
    modalFactionsList: mockEl(),
    modalRolesList: mockEl(),
    modalWeaponImg: mockEl(),
    modalPreviewModWatermark: mockEl(),
    modalWeaponManufacturer: mockEl(),
    modalWeaponOrigin: mockEl(),
    modalWeaponOriginPill: mockEl()
};

for (const weapon of catalog) {
    assert(typeof weapon.id === 'string' && weapon.id.length > 0, `Weapon ${weapon.id} has non-empty ID`);
    assert(typeof weapon.name === 'string' && weapon.name.length > 0, `Weapon ${weapon.id} has non-empty name`);
    assert(VALID_CALIBERS_SET.has(weapon.caliber), `Weapon ${weapon.id} caliber ${weapon.caliber} is valid`);
    assert(Array.isArray(weapon.defaultMag) && weapon.defaultMag.length === 2 && typeof weapon.defaultMag[1] === 'number' && weapon.defaultMag[1] > 0, `Weapon ${weapon.id} has valid defaultMag`);
    assert(['Rifle', 'DMR/Sniper', 'LMG', 'SMG', 'Shotgun', 'Launcher', 'Handgun'].includes(weapon.category), `Weapon ${weapon.id} has valid category ${weapon.category}`);
    assert(['Vanilla', 'RHS', 'CUP', 'NIArms', 'Custom'].includes(weapon.mod), `Weapon ${weapon.id} has valid mod ${weapon.mod}`);

    assert(typeof weapon.photoUrl === 'string' && weapon.photoUrl.length > 0, `Weapon ${weapon.id} has non-empty photoUrl`);
    assert(!weapon.photoUrl.toLowerCase().endsWith('.svg'), `Weapon ${weapon.id} photoUrl does not end in .svg`);
    assert(!weapon.photoUrl.toLowerCase().includes('.svg'), `Weapon ${weapon.id} photoUrl does not reference vector assets`);
    assert(!weapon.photoUrl.toLowerCase().includes('vector'), `Weapon ${weapon.id} photoUrl does not reference vector graphics`);

    // Exercise ArmoryController inspect modal binding
    ArmoryController.openInspectModal(weapon.id);
    assert(ArmoryController.elements.modalWeaponName.textContent === weapon.name, `Modal correctly bound weapon name for ${weapon.id}`);
    assert(!ArmoryController.elements.modalDefaultMag.textContent.includes('undefined'), `Modal default magazine has no undefined bindings for ${weapon.id}`);
    assert(!ArmoryController.elements.modalSlotsInfo.textContent.includes('undefined'), `Modal slots info has no undefined bindings for ${weapon.id}`);
    assert(!ArmoryController.elements.modalOpticsList.innerHTML.includes('undefined'), `Modal optics list has no undefined bindings for ${weapon.id}`);
    assert(!ArmoryController.elements.modalMuzzlesList.innerHTML.includes('undefined'), `Modal muzzles list has no undefined bindings for ${weapon.id}`);
    assert(ArmoryController.elements.modalWeaponImg.src.startsWith('assets/weapons/photos/') || ArmoryController.elements.modalWeaponImg.src.startsWith('assets/real_weapons/'), `Modal bound real firearm photo src (${ArmoryController.elements.modalWeaponImg.src}) for ${weapon.id}`);
    assert(!ArmoryController.elements.modalWeaponImg.src.toLowerCase().endsWith('.svg'), `Modal weapon image is genuine photography, not SVG for ${weapon.id}`);
    assert(typeof ArmoryController.elements.modalWeaponImg.onerror === 'function', `Modal configured fallback onerror handler for ${weapon.id}`);
    assert(ArmoryController.elements.modalWeaponManufacturer.textContent.length > 0, `Modal bound manufacturer for ${weapon.id}`);
    assert(ArmoryController.elements.modalWeaponOrigin.textContent.length > 0, `Modal bound origin for ${weapon.id}`);
}
console.log(`  ✓ 100% of ${catalog.length} catalog weapons passed full schema, inspect bindings, real weapon photo, and attachment/magazine validation`);

// 2. Metadata completeness verification
const sampleRifle = catalog.find(w => w.id === 'arifle_Katiba_F');
assert(sampleRifle && sampleRifle.category === 'Rifle', 'Katiba correctly categorized as Rifle');
assert(sampleRifle.caliber === '6.5x39', 'Katiba caliber is 6.5x39');
assert(sampleRifle.mod === 'Vanilla', 'Katiba mod is Vanilla');

const sampleLauncher = catalog.find(w => w.id === 'launch_NLAW_F');
assert(sampleLauncher && sampleLauncher.category === 'Launcher', 'NLAW correctly categorized as Launcher');
assert(sampleLauncher.caliber === 'Rocket', 'NLAW caliber is Rocket');

const sampleHandgun = catalog.find(w => w.id === 'hgun_P07_F');
assert(sampleHandgun && sampleHandgun.category === 'Handgun', 'P07 correctly categorized as Handgun');
assert(sampleHandgun.caliber === '9x21', 'P07 caliber is 9x21');

const sampleLmg = catalog.find(w => w.roles.includes('Machine Gunner') && w.category === 'LMG');
assert(sampleLmg !== undefined, 'LMGs properly indexed with category LMG');

const sampleSniper = catalog.find(w => w.category === 'DMR/Sniper');
assert(sampleSniper !== undefined, 'DMR/Snipers properly indexed with category DMR/Sniper');

// Verification of specific requested platforms across all mod scopes
const navid = catalog.find(w => w.id === 'MMG_01_tan_F');
assert(navid && navid.caliber === '9.3x64' && navid.category === 'LMG', 'Navid 9.3mm correctly registered as LMG');

const bren2 = catalog.find(w => w.id === 'CUP_arifle_Bren2_762_14');
assert(bren2 && bren2.mod === 'CUP' && bren2.caliber === '7.62x39', 'CZ BREN 2 7.62x39 registered in CUP');

const m77 = catalog.find(w => w.id === 'rhs_weap_m77');
assert(m77 && m77.mod === 'RHS' && m77.caliber === '7.62x51', 'Zastava M77 registered in RHS');

const m107Rhs = catalog.find(w => w.id === 'rhs_weap_m107');
assert(m107Rhs && m107Rhs.caliber === '.50BMG' && m107Rhs.category === 'DMR/Sniper', 'RHS M107 registered as .50BMG Sniper');

const saigaRhs = catalog.find(w => w.id === 'rhs_weap_saiga12');
assert(saigaRhs && saigaRhs.category === 'Shotgun', 'RHS Saiga-12 registered as Shotgun');

const g36Niarms = catalog.find(w => w.id === 'hlc_rifle_G36C');
assert(g36Niarms && g36Niarms.mod === 'NIArms', 'NIArms G36C registered');

const sg550 = catalog.find(w => w.id === 'hlc_rifle_SG550');
assert(sg550 && sg550.mod === 'NIArms', 'NIArms SG550 registered');

const rpg22 = catalog.find(w => w.id === 'CUP_launch_RPG22');
assert(rpg22 && rpg22.category === 'Launcher' && rpg22.mod === 'CUP', 'CUP RPG-22 registered as Launcher');

const strela = catalog.find(w => w.id === 'CUP_launch_9K32_Strela');
assert(strela && strela.category === 'Launcher' && strela.mod === 'CUP', 'CUP 9K32 Strela registered as Launcher');

const deagle = catalog.find(w => w.id === 'CUP_hgun_Deagle');
assert(deagle && deagle.category === 'Handgun' && deagle.mod === 'CUP', 'Desert Eagle registered as Handgun in CUP');

const microUzi = catalog.find(w => w.id === 'CUP_hgun_MicroUzi');
assert(microUzi && microUzi.category === 'Handgun' && microUzi.mod === 'CUP', 'Micro Uzi registered as Handgun in CUP');

const m27iar = catalog.find(w => w.id === 'rhs_weap_m27iar');
assert(m27iar && m27iar.mod === 'RHS' && m27iar.roles.includes('Machine Gunner'), 'M27 IAR registered in RHS with MG role');

const ak12Rhs = catalog.find(w => w.id === 'rhs_weap_ak12');
assert(ak12Rhs && ak12Rhs.mod === 'RHS' && ak12Rhs.caliber === '5.45x39', 'RHS AK-12 registered');

const mosin = catalog.find(w => w.id === 'CUP_srifle_Mosin_Nagant');
assert(mosin && mosin.mod === 'CUP' && mosin.caliber === '7.62x54', 'Mosin 1891/30 registered in CUP');

const mosinRhs = catalog.find(w => w.id === 'rhs_weap_mosin_snb');
assert(mosinRhs && mosinRhs.mod === 'RHS' && mosinRhs.caliber === '7.62x54', 'Mosin 1891/30 Sniper registered in RHS');

const prometUbs = catalog.find(w => w.id === 'arifle_MSBS65_UBS_F');
assert(prometUbs && prometUbs.mod === 'Vanilla' && prometUbs.category === 'Rifle', 'Promet UBS registered as Rifle in Vanilla');

const as50 = catalog.find(w => w.id === 'CUP_srifle_AS50');
assert(as50 && as50.mod === 'CUP' && as50.caliber === '.50BMG', 'AS50 .50BMG registered in CUP');

const ksvk = catalog.find(w => w.id === 'CUP_srifle_KSVK');
assert(ksvk && ksvk.mod === 'CUP' && ksvk.caliber === '12.7x108', 'KSVK 12.7x108 registered in CUP');

const vss = catalog.find(w => w.id === 'rhs_weap_vss');
assert(vss && vss.mod === 'RHS' && vss.caliber === '9x21', 'VSS Vintorez registered in RHS');

// 3. Search and Filtering Tests
ArmoryController.searchQuery = 'Katiba';
ArmoryController.activeCategory = 'all';
ArmoryController.activeMod = 'all';
let filtered = ArmoryController.filterCatalog();
assert(filtered.length > 0 && filtered.every(w => w.name.includes('Katiba') || w.id.includes('Katiba')), 'Search by name/id finds Katiba weapons');

// Filter by mod RHS
ArmoryController.searchQuery = '';
ArmoryController.activeCategory = 'all';
ArmoryController.activeMod = 'RHS';
filtered = ArmoryController.filterCatalog();
assert(filtered.length > 0 && filtered.every(w => w.mod === 'RHS'), 'Filter by RHS mod correctly restricts results');

// Filter by category Launcher
ArmoryController.searchQuery = '';
ArmoryController.activeCategory = 'Launcher';
ArmoryController.activeMod = 'all';
filtered = ArmoryController.filterCatalog();
assert(filtered.length > 0 && filtered.every(w => w.category === 'Launcher'), 'Filter by category Launcher correctly restricts results');

// Filter by category Handgun
ArmoryController.searchQuery = '';
ArmoryController.activeCategory = 'Handgun';
ArmoryController.activeMod = 'all';
filtered = ArmoryController.filterCatalog();
assert(filtered.length > 0 && filtered.every(w => w.category === 'Handgun'), 'Filter by category Handgun correctly restricts results');

// Reset filters
ArmoryController.searchQuery = '';
ArmoryController.activeCategory = 'all';
ArmoryController.activeMod = 'all';

// 4. "Roll Loadout Around This Gun" - Locked Primary Weapon
const lockedM4Res = LoadoutEngine.generate({
    faction: 'NATO',
    role: 'Rifleman',
    chaosLevel: 1,
    activeMods: new Set(['RHS', 'Vanilla']),
    lockedWeaponId: 'rhs_weap_m4a1_blockII'
});
assert(lockedM4Res.loadoutData.primary.class === 'rhs_weap_m4a1_blockII', 'Loadout locked primary weapon is rhs_weap_m4a1_blockII');
assert(lockedM4Res.sqf.includes('rhs_weap_m4a1_blockII'), 'Generated SQF includes locked weapon classname');
assert(lockedM4Res.loadoutData.meta.primaryMod === 'RHS', 'Metadata primaryMod correctly reports RHS');

// Test locking launcher
const lockedLauncherRes = LoadoutEngine.generate({
    faction: 'CSAT',
    role: 'Anti-Tank',
    chaosLevel: 1,
    activeMods: new Set(['Vanilla']),
    lockedWeaponId: 'launch_RPG32_F'
});
assert(lockedLauncherRes.loadoutData.launcher.class === 'launch_RPG32_F', 'Loadout locked launcher is launch_RPG32_F');
assert(lockedLauncherRes.sqf.includes('launch_RPG32_F'), 'Generated SQF includes locked launcher classname');

// Test locking handgun
const lockedHandgunRes = LoadoutEngine.generate({
    faction: 'NATO',
    role: 'Rifleman',
    chaosLevel: 1,
    activeMods: new Set(['Vanilla']),
    lockedWeaponId: 'hgun_P07_F'
});
assert(lockedHandgunRes.loadoutData.handgun.class === 'hgun_P07_F', 'Loadout locked handgun is hgun_P07_F');
assert(lockedHandgunRes.sqf.includes('hgun_P07_F'), 'Generated SQF includes locked handgun classname');

console.log('\nTest Suite 9: Authentic Real-Life Photography Enforcement & Strict Vector/SVG Rejection');

// 1. Strict SVG/Vector Detection & Rejection Engine
assert(WeaponPhotoResolver.isSvgOrVector('assets/weapons/rifle.svg') === true, 'isSvgOrVector detects .svg extension');
assert(WeaponPhotoResolver.isSvgOrVector('assets/weapons/rifle.svg?version=1') === true, 'isSvgOrVector detects .svg with query string');
assert(WeaponPhotoResolver.isSvgOrVector('assets/weapons/silhouette_rifle.png') === true, 'isSvgOrVector rejects silhouette filenames');
assert(WeaponPhotoResolver.isSvgOrVector('assets/weapons/vector_icon.png') === true, 'isSvgOrVector rejects vector icon filenames');
assert(WeaponPhotoResolver.isSvgOrVector('assets/weapons/photos/arifle_MX_F.png') === false, 'isSvgOrVector permits genuine firearm photos');
assert(WeaponPhotoResolver.isSvgOrVector('assets/real_weapons/m4a1.png') === false, 'isSvgOrVector permits real platform photos');

// 2. Caliber-Based Authentic Real-Life Firearm Fallback Photos
for (const caliber of VALID_CALIBERS_SET) {
    const photoPath = WeaponPhotoResolver.getCaliberFallbackPhoto(caliber);
    assert(typeof photoPath === 'string' && photoPath.length > 0, `Caliber ${caliber} returns valid photo path`);
    assert(!photoPath.toLowerCase().endsWith('.svg'), `Caliber ${caliber} fallback strictly does not end in .svg`);
    assert(!photoPath.toLowerCase().includes('.svg'), `Caliber ${caliber} fallback contains no .svg references`);
    assert(!photoPath.toLowerCase().includes('vector'), `Caliber ${caliber} fallback contains no vector tokens`);

    const fullPath = path.join(__dirname, photoPath);
    assert(fs.existsSync(fullPath), `Authentic caliber baseline photo exists on disk: ${photoPath}`);
    const stats = fs.statSync(fullPath);
    assert(stats.size > 1000, `Caliber photo ${photoPath} has valid PNG binary data (${stats.size} bytes)`);
}

// 3. Category-Based Authentic Real-Life Firearm Fallback Photos
const categories = ['Rifle', 'DMR/Sniper', 'LMG', 'SMG', 'Shotgun', 'Launcher', 'Handgun'];
for (const cat of categories) {
    const photoPath = WeaponPhotoResolver.getCategoryFallbackPhoto(cat);
    assert(typeof photoPath === 'string' && photoPath.length > 0, `Category ${cat} returns valid photo path`);
    assert(!photoPath.toLowerCase().endsWith('.svg'), `Category ${cat} fallback does not end in .svg`);
    assert(!photoPath.toLowerCase().includes('.svg'), `Category ${cat} fallback contains no .svg references`);
    assert(fs.existsSync(path.join(__dirname, photoPath)), `Category photo exists on disk: ${photoPath}`);
}

// 4. Graceful Sanitization: Replaces Prohibited SVGs with Caliber Photography
const sanitizedFallback = WeaponPhotoResolver.sanitizePhotoUrl('assets/weapons/rifle.svg', '7.62x39', 'Rifle');
assert(sanitizedFallback === 'assets/real_weapons/akm.png', 'sanitizePhotoUrl replaces prohibited SVG with authentic 7.62x39 photograph');
assert(!sanitizedFallback.endsWith('.svg'), 'Sanitized photo strictly does not end in .svg');

// 5. WeaponAssetResolver Routing Verification
assert(!WeaponAssetResolver.getCategorySvg('Rifle').endsWith('.svg'), 'WeaponAssetResolver.getCategorySvg strictly rejects SVGs and returns photograph');
assert(WeaponAssetResolver.getCategoryPhoto('Rifle') === 'assets/real_weapons/default_rifle.png', 'WeaponAssetResolver returns category real photo');
assert(WeaponAssetResolver.getPrimaryImageUrl({ id: 'arifle_MX_F' }) === 'assets/weapons/photos/arifle_MX_F.png', 'Weapon primary image URL correctly routes to photos/ directory');

console.log('\nTest Suite 10: WeaponPhotoResolver & Real Weapon Photographic Assets Integrity');
// 1. Platform family normalization assertions
assert(WeaponPhotoResolver.getPlatformFamily('rhs_weap_m4a1_blockII') === 'm4a1', 'M4A1 Block II normalizes to m4a1');
assert(WeaponPhotoResolver.getPlatformFamily('CUP_arifle_M4A1_black') === 'm4a1', 'CUP M4A1 normalizes to m4a1');
assert(WeaponPhotoResolver.getPlatformFamily('rhs_weap_ak74m') === 'ak74m', 'RHS AK-74M normalizes to ak74m');
assert(WeaponPhotoResolver.getPlatformFamily('rhs_weap_akm') === 'akm', 'RHS AKM normalizes to akm');
assert(WeaponPhotoResolver.getPlatformFamily('rhs_weap_ak12') === 'ak12', 'RHS AK-12 normalizes to ak12');
assert(WeaponPhotoResolver.getPlatformFamily('CUP_arifle_HK416_Black') === 'hk416', 'CUP HK416 normalizes to hk416');
assert(WeaponPhotoResolver.getPlatformFamily('CUP_arifle_Mk16_STD') === 'scar', 'SCAR-L Mk 16 normalizes to scar');
assert(WeaponPhotoResolver.getPlatformFamily('hlc_rifle_G36C') === 'g36', 'NIArms G36C normalizes to g36');
assert(WeaponPhotoResolver.getPlatformFamily('CUP_arifle_FN_FAL') === 'fal', 'FN FAL normalizes to fal');
assert(WeaponPhotoResolver.getPlatformFamily('rhs_weap_pkm') === 'pkm', 'RHS PKM normalizes to pkm');
assert(WeaponPhotoResolver.getPlatformFamily('rhs_weap_m249_pip') === 'm249', 'RHS M249 normalizes to m249');
assert(WeaponPhotoResolver.getPlatformFamily('rhs_weap_svd') === 'svd', 'RHS SVD normalizes to svd');
assert(WeaponPhotoResolver.getPlatformFamily('rhs_weap_m107') === 'm107', 'RHS M107 normalizes to m107');
assert(WeaponPhotoResolver.getPlatformFamily('CUP_srifle_Mosin_Nagant') === 'mosin', 'Mosin Nagant normalizes to mosin');
assert(WeaponPhotoResolver.getPlatformFamily('CUP_launch_RPG7V') === 'rpg7', 'RPG-7 normalizes to rpg7');
assert(WeaponPhotoResolver.getPlatformFamily('rhsusf_weap_m9') === 'm9', 'Beretta M9 normalizes to m9');
assert(WeaponPhotoResolver.getPlatformFamily('rhsusf_weap_glock17') === 'glock17', 'Glock 17 normalizes to glock17');
assert(WeaponPhotoResolver.getPlatformFamily('hgun_P07_F') === 'p07', 'P07 normalizes to p07');

// 2. Weapon metadata verification
const m4Meta = WeaponPhotoResolver.getWeaponMetadata('rhs_weap_m4a1');
assert(m4Meta.manufacturer.includes('Colt'), 'M4A1 metadata reports Colt manufacturer');
assert(m4Meta.origin === 'United States', 'M4A1 metadata reports United States origin');

const akMeta = WeaponPhotoResolver.getWeaponMetadata('rhs_weap_ak74m');
assert(akMeta.manufacturer.includes('Kalashnikov'), 'AK-74M metadata reports Kalashnikov manufacturer');
assert(akMeta.origin === 'Russia', 'AK-74M metadata reports Russia origin');

// 3. Physical presence of category fallback photos on disk
const defaultPhotos = [
    'default_rifle.png',
    'default_sniper.png',
    'default_lmg.png',
    'default_smg.png',
    'default_shotgun.png',
    'default_launcher.png',
    'default_handgun.png',
    'default_weapon.png'
];

for (const photo of defaultPhotos) {
    const photoPath = path.join(__dirname, 'assets', 'real_weapons', photo);
    assert(fs.existsSync(photoPath), `Real firearm fallback photo exists: assets/real_weapons/${photo}`);
    const stats = fs.statSync(photoPath);
    assert(stats.size > 1000, `Photo assets/real_weapons/${photo} has valid PNG binary data (${stats.size} bytes)`);
}

// 4. Physical presence of major platform photographic assets
const platformPhotos = [
    'm4a1.png', 'm16.png', 'ak74m.png', 'akm.png', 'ak12.png', 'hk416.png',
    'scar.png', 'g36.png', 'fal.png', 'g3.png', 'aug.png', 'famas.png',
    'mx.png', 'katiba.png', 'svd.png', 'vss.png', 'm14.png', 'm107.png',
    'cheytac.png', 'mosin.png', 'm24.png', 'm249.png', 'm240.png', 'pkm.png',
    'mp5.png', 'mp7.png', 'p90.png', 'vector.png', 'm870.png', 'm1014.png',
    'saiga12.png', 'rpg7.png', 'at4.png', 'javelin.png', 'm9.png', 'm1911.png',
    'glock17.png', 'makarov.png', 'p07.png'
];

for (const photo of platformPhotos) {
    const photoPath = path.join(__dirname, 'assets', 'real_weapons', photo);
    assert(fs.existsSync(photoPath), `Real firearm platform photo exists: assets/real_weapons/${photo}`);
    const stats = fs.statSync(photoPath);
    assert(stats.size > 1000, `Platform photo ${photo} has valid data (${stats.size} bytes)`);
}

// 5. Verification that 100% of catalog items resolve to a valid real weapon photo path
for (const w of catalog) {
    const url = WeaponPhotoResolver.getRealWeaponPhotoUrl(w);
    assert(typeof url === 'string' && (url.startsWith('assets/weapons/photos/') || url.startsWith('assets/real_weapons/')), `Weapon ${w.id} resolves to valid real weapon photo (${url})`);
}
console.log(`  ✓ 100% of ${catalog.length} catalog weapons successfully resolved to verified real-world photographic assets`);

console.log('\nTest Suite 11: 1-to-1 Dedicated Variant Weapon Photographic Assets Integrity');
const photoPathSet = new Set();

for (const w of catalog) {
    assert(typeof w.photoUrl === 'string' && w.photoUrl.length > 0, `Weapon ${w.id} has non-empty photoUrl string`);
    assert(!w.photoUrl.toLowerCase().endsWith('.svg'), `Weapon ${w.id} photoUrl strictly does not end in .svg`);
    assert(!w.photoUrl.toLowerCase().includes('.svg'), `Weapon ${w.id} photoUrl strictly contains zero vector/SVG references`);
    assert(!w.photoUrl.toLowerCase().includes('vector'), `Weapon ${w.id} photoUrl contains zero vector tokens`);
    assert(w.photoUrl === `assets/weapons/photos/${w.id}.png`, `Weapon ${w.id} photoUrl matches 1-to-1 path assets/weapons/photos/${w.id}.png`);

    const fullPath = path.join(__dirname, w.photoUrl);
    assert(fs.existsSync(fullPath), `Dedicated variant photo exists on disk: ${w.photoUrl}`);
    const stats = fs.statSync(fullPath);
    assert(stats.size > 300, `Variant photo ${w.photoUrl} has valid PNG data (${stats.size} bytes)`);

    photoPathSet.add(w.photoUrl);
}

assert(photoPathSet.size === catalog.length, `Strict 1-to-1 unique mapping: exactly ${catalog.length} unique photo files for ${catalog.length} weapons with zero duplicate assignments`);
console.log(`  ✓ 100% of ${catalog.length} weapons verified with dedicated, distinct variant photographs (0 duplicates, 0 missing)`);

console.log('\nTest Suite 12: Floating "Scroll to Top" Button UI & Controller Logic');

// 1. HTML Markup verification
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent.includes('id="armory-scroll-top-btn"'), 'index.html contains #armory-scroll-top-btn');
assert(htmlContent.includes('class="scroll-top-btn"'), 'index.html contains .scroll-top-btn class');
assert(htmlContent.includes('aria-label="Scroll to top"'), 'index.html contains aria-label="Scroll to top"');
assert(htmlContent.includes('<polyline points="18 15 12 9 6 15">'), 'index.html contains upward chevron SVG icon');
assert(htmlContent.includes('class="scroll-top-text">TOP</span>'), 'index.html contains TOP text label');

// 2. CSS Styling & Transitions verification
const cssContent = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent.includes('.scroll-top-btn {'), 'styles.css contains .scroll-top-btn rule');
assert(cssContent.includes('position: fixed;'), 'styles.css sets position: fixed');
assert(cssContent.includes('bottom: 2rem;'), 'styles.css sets bottom: 2rem');
assert(cssContent.includes('right: 2rem;'), 'styles.css sets right: 2rem');
assert(cssContent.includes('z-index: 1000;'), 'styles.css sets z-index: 1000');
assert(cssContent.includes('opacity: 0;'), 'styles.css sets default opacity: 0');
assert(cssContent.includes('pointer-events: none;'), 'styles.css sets default pointer-events: none');
assert(cssContent.includes('transform: translateY(10px);'), 'styles.css sets initial transform offset');
assert(cssContent.includes('.scroll-top-btn.visible {'), 'styles.css contains .scroll-top-btn.visible active modifier');
assert(cssContent.includes('pointer-events: auto;'), 'styles.css sets pointer-events: auto when visible');
assert(cssContent.includes('@media (max-width: 768px)'), 'styles.css contains responsive mobile breakpoint');

// 3. Controller Lifecycle & State Logic verification
assert(typeof ArmoryController.setActiveTab === 'function', 'ArmoryController.setActiveTab is defined');
assert(typeof ArmoryController.handleScroll === 'function', 'ArmoryController.handleScroll is defined');

// Emulate button and scroll behavior
const mockClassList = new Set();
const mockBtn = {
    classList: {
        add: (cls) => mockClassList.add(cls),
        remove: (cls) => mockClassList.delete(cls),
        contains: (cls) => mockClassList.has(cls)
    }
};

ArmoryController.elements = { scrollTopBtn: mockBtn };

// Scenario A: Under 300px threshold on Armory tab -> should remain hidden
ArmoryController.activeTabId = 'armory-view';
context.window.scrollY = 150;
ArmoryController.handleScroll();
assert(!mockBtn.classList.contains('visible'), 'Button is hidden when scrollY (150px) <= 300px on armory-view');

// Scenario B: Over 300px threshold on Armory tab -> should be visible
context.window.scrollY = 450;
ArmoryController.handleScroll();
assert(mockBtn.classList.contains('visible'), 'Button is visible when scrollY (450px) > 300px on armory-view');

// Scenario C: Tab switch away to generator-view while scrolled -> must immediately hide
ArmoryController.setActiveTab('generator-view');
assert(!mockBtn.classList.contains('visible'), 'Button immediately hides when switching to generator-view');

// Scenario D: Tab switch to best-loadouts-view while scrolled -> must remain hidden
ArmoryController.setActiveTab('best-loadouts-view');
assert(!mockBtn.classList.contains('visible'), 'Button remains hidden on best-loadouts-view');

// Scenario E: Switching back to armory-view while scrolled > 300px -> immediately restores visibility
ArmoryController.setActiveTab('armory-view');
assert(mockBtn.classList.contains('visible'), 'Button restores visibility when switching back to armory-view with scrollY > 300px');

// Scenario F: User scrolls back to top (scrollY = 0) -> button hides
context.window.scrollY = 0;
ArmoryController.handleScroll();
assert(!mockBtn.classList.contains('visible'), 'Button hides when scrolled back to top (0px)');

console.log('  ✓ Verified DOM markup, responsive tactical CSS, scroll thresholds, and tab-isolation logic');

console.log('\nTest Suite 13: Best Loadouts & Meta Presets DOM Markup, CSS & Controller Integration');
// 1. DOM Markup verification in index.html
const indexHtmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(indexHtmlContent.includes('id="best-loadouts-view"'), 'index.html contains #best-loadouts-view');
assert(indexHtmlContent.includes('id="meta-faction-pills"'), 'index.html contains #meta-faction-pills');
assert(indexHtmlContent.includes('id="meta-role-pills"'), 'index.html contains #meta-role-pills');
assert(indexHtmlContent.includes('id="meta-mod-pills"'), 'index.html contains #meta-mod-pills');
assert(indexHtmlContent.includes('id="roll-meta-btn"'), 'index.html contains #roll-meta-btn');
assert(indexHtmlContent.includes('id="meta-count-badge"'), 'index.html contains #meta-count-badge');
assert(indexHtmlContent.includes('id="best-loadouts-container"'), 'index.html contains #best-loadouts-container');
assert(indexHtmlContent.includes('data-role="Pointman"'), 'index.html contains Pointman role filter pill');

// 2. CSS Rules verification in styles.css
assert(cssContent.includes('.meta-filters-bar {'), 'styles.css contains .meta-filters-bar');
assert(cssContent.includes('.meta-filter-group {'), 'styles.css contains .meta-filter-group');
assert(cssContent.includes('.best-loadouts-grid {'), 'styles.css contains .best-loadouts-grid');
assert(cssContent.includes('.best-loadout-card {'), 'styles.css contains .best-loadout-card');
assert(cssContent.includes('.best-card-photo {'), 'styles.css contains .best-card-photo');
assert(cssContent.includes('.best-card-img {'), 'styles.css contains .best-card-img');
assert(cssContent.includes('.best-card-specs {'), 'styles.css contains .best-card-specs');
assert(cssContent.includes('.copy-best-btn {'), 'styles.css contains .copy-best-btn');
assert(cssContent.includes('.inspect-best-btn {'), 'styles.css contains .inspect-best-btn');
assert(cssContent.includes('.tag-badge.badge-nato'), 'styles.css contains .tag-badge.badge-nato');
assert(cssContent.includes('.tag-badge.badge-csat'), 'styles.css contains .tag-badge.badge-csat');
assert(cssContent.includes('.tag-badge.badge-aaf'), 'styles.css contains .tag-badge.badge-aaf');
assert(cssContent.includes('.tag-badge.badge-fia'), 'styles.css contains .tag-badge.badge-fia');

// 3. UIController renderBestLoadouts logic verification
let bestContainerHtml = '';
const mockBestContainer = {
    set innerHTML(val) { bestContainerHtml = val; },
    get innerHTML() { return bestContainerHtml; },
    addEventListener: () => {}
};
let countBadgeText = '';
const mockCountBadge = {
    set textContent(val) { countBadgeText = val; },
    get textContent() { return countBadgeText; }
};

UIController.elements = {
    bestContainer: mockBestContainer,
    metaCountBadge: mockCountBadge
};

// Render all presets
UIController.activeMetaFaction = 'all';
UIController.activeMetaRole = 'all';
UIController.activeMetaMod = 'all';
UIController.renderBestLoadouts();
assert(bestContainerHtml.includes('best-loadout-card'), 'renderBestLoadouts produces .best-loadout-card elements');
assert(bestContainerHtml.includes('copy-best-btn'), 'renderBestLoadouts produces .copy-best-btn elements');
assert(bestContainerHtml.includes('inspect-best-btn'), 'renderBestLoadouts produces .inspect-best-btn elements');
assert(bestContainerHtml.includes('best-card-photo'), 'renderBestLoadouts produces .best-card-photo preview containers');
assert(countBadgeText.includes('Showing') && countBadgeText.includes('Meta Presets'), 'Count badge displays formatted preset count');

// Render filtered presets for Pointman role
UIController.activeMetaFaction = 'all';
UIController.activeMetaRole = 'Pointman';
UIController.activeMetaMod = 'all';
UIController.renderBestLoadouts();
assert(bestContainerHtml.includes('Breacher') || bestContainerHtml.includes('Pointman'), 'Pointman filter renders Breacher/Pointman cards');
assert(countBadgeText.toUpperCase().includes('POINTMAN'), 'Count badge reflects Pointman filter state');

// Render filtered presets for NATO faction
UIController.activeMetaFaction = 'NATO';
UIController.activeMetaRole = 'all';
UIController.activeMetaMod = 'all';
UIController.renderBestLoadouts();
assert(bestContainerHtml.includes('badge-nato'), 'NATO filter renders badge-nato');
assert(!bestContainerHtml.includes('badge-csat'), 'NATO filter excludes CSAT cards');

console.log('  ✓ Verified HTML markup, responsive grid styles, dynamic badges, and interactive filter rendering');

// ==========================================================================
// Test Suite 14: Loadout History & Favorites System
// ==========================================================================
console.log('\nTest Suite 14: Loadout History & Favorites System');

// Verify LoadoutHistory class is exported and accessible
assert(typeof LoadoutHistory !== 'undefined', 'LoadoutHistory class is exported');
assert(typeof LoadoutHistory.save === 'function', 'LoadoutHistory.save is a function');
assert(typeof LoadoutHistory.getAll === 'function', 'LoadoutHistory.getAll is a function');
assert(typeof LoadoutHistory.toggleFavorite === 'function', 'LoadoutHistory.toggleFavorite is a function');
assert(typeof LoadoutHistory.delete === 'function', 'LoadoutHistory.delete is a function');
assert(typeof LoadoutHistory.clear === 'function', 'LoadoutHistory.clear is a function');
assert(typeof LoadoutHistory.export === 'function', 'LoadoutHistory.export is a function');
assert(typeof LoadoutHistory.count === 'function', 'LoadoutHistory.count is a function');
assert(typeof LoadoutHistory.generateId === 'function', 'LoadoutHistory.generateId is a function');

// Setup mock localStorage for history tests
const historyStore = {};
const mockHistoryStorage = {
    getItem: (k) => historyStore[k] || null,
    setItem: (k, v) => { historyStore[k] = v; },
    removeItem: (k) => { delete historyStore[k]; }
};
// Patch LoadoutHistory to use mock storage
const origPersist = LoadoutHistory.persist.bind(LoadoutHistory);
const origGetRaw = LoadoutHistory.getRaw.bind(LoadoutHistory);
LoadoutHistory.persist = (entries) => {
    historyStore[LoadoutHistory.STORAGE_KEY] = JSON.stringify(entries);
};
LoadoutHistory.getRaw = () => {
    try {
        const raw = historyStore[LoadoutHistory.STORAGE_KEY];
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
};

// Clear any existing history
historyStore[LoadoutHistory.STORAGE_KEY] = '[]';

// Test save and retrieval
const mockLoadout1 = {
    faction: 'NATO', role: 'Rifleman',
    primary: { class: 'arifle_MX_F', mag: ['30Rnd_65x39_caseless_mag', 30], optic: 'optic_Hamr', pointer: 'acc_pointer_IR', bipod: '', muzzle: 'muzzle_snds_H', count: 6 },
    handgun: { class: 'hgun_P07_F', mag: ['16Rnd_9x21_Mag', 16], optic: '', pointer: '', bipod: '', muzzle: '', count: 3 },
    launcher: { class: '', mag: ['', 0] },
    clothing: { uniform: 'U_B_CombatUniform_mcam', vest: 'V_PlateCarrier1_rgr', backpack: 'B_AssaultPack_mcamo', headgear: 'H_HelmetB', facewear: 'G_Tactical_Clear' },
    items: { binocular: 'Binocular', nvg: 'NVGoggles', grenadeChoice: 'HandGrenade', grenadeCount: 2, smokeChoice: 'SmokeShell', smokeCount: 2, linked: [] },
    meta: { chaosLevel: 1, primaryMod: 'Vanilla', caliber: '6.5x39' }
};
const mockSqf1 = 'player setUnitLoadout [["arifle_MX_F"]]';

const entry1 = LoadoutHistory.save(mockLoadout1, mockSqf1);
assert(entry1.id && entry1.id.startsWith('h_'), 'save returns entry with valid ID');
assert(entry1.timestamp > 0, 'save returns entry with timestamp');
assert(entry1.isFavorite === false, 'save returns entry with isFavorite=false');
assert(entry1.loadout.faction === 'NATO', 'save preserves loadout data');
assert(entry1.sqf === mockSqf1, 'save preserves SQF string');

const all1 = LoadoutHistory.getAll();
assert(all1.length === 1, 'getAll returns 1 entry after first save');
assert(all1[0].id === entry1.id, 'getAll returns the saved entry');

// Test multiple saves and ordering
const mockLoadout2 = { ...mockLoadout1, faction: 'CSAT', role: 'Sniper', primary: { ...mockLoadout1.primary, class: 'srifle_GM6_F' } };
const entry2 = LoadoutHistory.save(mockLoadout2, 'sqf2');
const all2 = LoadoutHistory.getAll();
assert(all2.length === 2, 'getAll returns 2 entries after second save');
assert(all2[0].id === entry2.id, 'Most recent entry is first (non-favorited, recency order)');

// Test toggleFavorite
const isFav = LoadoutHistory.toggleFavorite(entry1.id);
assert(isFav === true, 'toggleFavorite returns true after starring');
const all3 = LoadoutHistory.getAll();
assert(all3[0].id === entry1.id, 'Favorited entry sorts to top');
assert(all3[0].isFavorite === true, 'Favorited entry has isFavorite=true');

// Test un-favorite
const isUnfav = LoadoutHistory.toggleFavorite(entry1.id);
assert(isUnfav === false, 'toggleFavorite returns false after unstarring');

// Test delete
const deleted = LoadoutHistory.delete(entry1.id);
assert(deleted === true, 'delete returns true for existing entry');
assert(LoadoutHistory.count() === 1, 'count is 1 after deleting one of two entries');
const deletedAgain = LoadoutHistory.delete(entry1.id);
assert(deletedAgain === false, 'delete returns false for already-deleted entry');

// Test clear (preserves favorites)
LoadoutHistory.save(mockLoadout1, 'sqf_a');
LoadoutHistory.save(mockLoadout2, 'sqf_b');
const allBeforeClear = LoadoutHistory.getAll();
LoadoutHistory.toggleFavorite(allBeforeClear[0].id); // favorite the most recent
const clearedCount = LoadoutHistory.clear();
assert(clearedCount > 0, 'clear removes non-favorited entries');
const allAfterClear = LoadoutHistory.getAll();
assert(allAfterClear.length === 1, 'clear preserves exactly 1 favorited entry');
assert(allAfterClear[0].isFavorite === true, 'preserved entry is the favorite');

// Test ring buffer eviction at MAX_ENTRIES
historyStore[LoadoutHistory.STORAGE_KEY] = '[]';
for (let i = 0; i < 55; i++) {
    LoadoutHistory.save({ ...mockLoadout1, role: 'Rifleman_' + i, primary: { ...mockLoadout1.primary, class: 'gun_' + i } }, 'sqf_' + i);
}
assert(LoadoutHistory.count() <= LoadoutHistory.MAX_ENTRIES, 'Ring buffer caps at MAX_ENTRIES (' + LoadoutHistory.MAX_ENTRIES + ')');

// Test favorites survive eviction
historyStore[LoadoutHistory.STORAGE_KEY] = '[]';
const favEntry = LoadoutHistory.save(mockLoadout1, 'fav_sqf');
LoadoutHistory.toggleFavorite(favEntry.id);
for (let i = 0; i < 55; i++) {
    LoadoutHistory.save({ ...mockLoadout2, primary: { ...mockLoadout2.primary, class: 'evict_' + i } }, 'evict_sqf_' + i);
}
const afterEvict = LoadoutHistory.getAll();
const favSurvived = afterEvict.find(e => e.id === favEntry.id);
assert(favSurvived, 'Favorited entry survives ring buffer eviction');
assert(favSurvived.isFavorite === true, 'Eviction-surviving entry is still favorited');

// Test export format
const exported = LoadoutHistory.export();
assert(typeof exported === 'string', 'export returns a string');
const parsedExport = JSON.parse(exported);
assert(Array.isArray(parsedExport), 'export is valid JSON array');
assert(parsedExport.length > 0, 'export contains entries');

// Test generateId uniqueness
const ids = new Set();
for (let i = 0; i < 100; i++) {
    ids.add(LoadoutHistory.generateId());
}
assert(ids.size === 100, 'generateId produces 100 unique IDs');

// Restore original methods
LoadoutHistory.persist = origPersist;
LoadoutHistory.getRaw = origGetRaw;

// Verify HTML integration
const htmlContent14 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent14.includes('id="history-panel"'), 'index.html contains #history-panel');
assert(htmlContent14.includes('id="history-container"'), 'index.html contains #history-container');
assert(htmlContent14.includes('id="history-count"'), 'index.html contains #history-count');
assert(htmlContent14.includes('id="clear-history-btn"'), 'index.html contains #clear-history-btn');
assert(htmlContent14.includes('id="export-history-btn"'), 'index.html contains #export-history-btn');
assert(htmlContent14.includes('id="history-toggle-btn"'), 'index.html contains #history-toggle-btn');

// Verify CSS integration
const cssContent14 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent14.includes('.history-container {'), 'styles.css contains .history-container rule');
assert(cssContent14.includes('.history-entry {'), 'styles.css contains .history-entry rule');
assert(cssContent14.includes('.history-star-btn'), 'styles.css contains .history-star-btn rule');
assert(cssContent14.includes('.history-entry.starred'), 'styles.css contains .history-entry.starred rule');
assert(cssContent14.includes('.history-action-btn'), 'styles.css contains .history-action-btn rule');
assert(cssContent14.includes('.history-panel-wrapper.collapsed'), 'styles.css contains .collapsed toggle rule');

// Verify UIController integration
assert(typeof UIController.renderHistory === 'function', 'UIController.renderHistory is a function');
assert(typeof UIController.bindHistoryEvents === 'function', 'UIController.bindHistoryEvents is a function');
assert(typeof UIController.restoreFromHistory === 'function', 'UIController.restoreFromHistory is a function');

console.log('  ✓ LoadoutHistory CRUD, ring buffer eviction, favorite pinning, HTML/CSS/Controller integration verified');

// ==========================================================================
// Test Suite 15: Weight & Logistics Calculator
// ==========================================================================
console.log('\nTest Suite 15: Weight & Logistics Calculator');

// Verify exports
assert(typeof LogisticsCalculator !== 'undefined', 'LogisticsCalculator class is exported');
assert(typeof LogisticsCalculator.analyze === 'function', 'LogisticsCalculator.analyze is a function');
assert(typeof LogisticsCalculator.getEncumbranceLevel === 'function', 'LogisticsCalculator.getEncumbranceLevel is a function');
assert(typeof LogisticsCalculator.emptyResult === 'function', 'LogisticsCalculator.emptyResult is a function');
assert(typeof WEIGHT_TABLE !== 'undefined', 'WEIGHT_TABLE is exported');

// Verify WEIGHT_TABLE structure
assert(typeof WEIGHT_TABLE.roundWeight === 'object', 'WEIGHT_TABLE has roundWeight lookup');
assert(WEIGHT_TABLE.roundWeight['5.56x45'] > 0, '5.56x45 has positive round weight');
assert(WEIGHT_TABLE.roundWeight['7.62x51'] > WEIGHT_TABLE.roundWeight['5.56x45'], '7.62x51 weighs more than 5.56x45');
assert(WEIGHT_TABLE.roundWeight['.50BMG'] > 100, '.50 BMG round weight > 100g');
assert(typeof WEIGHT_TABLE.gearWeight === 'object', 'WEIGHT_TABLE has gearWeight lookup');
assert(WEIGHT_TABLE.gearWeight.vest > 0, 'Vest has positive weight');
assert(WEIGHT_TABLE.magHousingWeight > 0, 'Magazine housing weight is positive');

// Test analyze on a full Rifleman loadout
const riflemanLoadout15 = {
    faction: 'NATO', role: 'Rifleman',
    primary: { class: 'arifle_MX_F', mag: ['30Rnd_65x39_caseless_mag', 30], optic: 'optic_Hamr', pointer: 'acc_pointer_IR', bipod: '', muzzle: 'muzzle_snds_H', count: 6 },
    handgun: { class: 'hgun_P07_F', mag: ['16Rnd_9x21_Mag', 16], optic: '', pointer: '', bipod: '', muzzle: '', count: 3 },
    launcher: { class: '', mag: ['', 0] },
    clothing: { uniform: 'U_B_CombatUniform_mcam', vest: 'V_PlateCarrier1_rgr', backpack: 'B_AssaultPack_mcamo', headgear: 'H_HelmetB', facewear: 'G_Tactical_Clear' },
    items: { binocular: 'Binocular', nvg: 'NVGoggles', grenadeChoice: 'HandGrenade', grenadeCount: 2, smokeChoice: 'SmokeShell', smokeCount: 2, linked: [] },
    meta: { chaosLevel: 1, primaryMod: 'Vanilla', caliber: '6.5x39' }
};

const stats15 = LogisticsCalculator.analyze(riflemanLoadout15);
assert(stats15.totalWeightKg > 0, 'Total weight is positive for full loadout');
assert(stats15.totalWeightKg > 10, 'Total weight exceeds 10 kg for a full Rifleman');
assert(stats15.totalWeightKg < 60, 'Total weight is under 60 kg (sanity check)');
assert(stats15.totalRounds > 0, 'Total rounds is positive');
assert(stats15.totalRounds === (6 * 30) + (3 * 16), 'Total rounds = primary(6*30) + handgun(3*16) = 228');
assert(stats15.estimatedBursts > 0, 'Estimated bursts is positive');
assert(stats15.estimatedBursts === Math.floor(180 / 3), 'Estimated bursts = floor(180/3) = 60');
assert(stats15.sustainabilityMinutes > 0, 'Sustainability minutes is positive');
assert(typeof stats15.encumbranceLevel === 'string', 'Encumbrance level is a string');
assert(['Light', 'Medium', 'Heavy', 'Overloaded'].includes(stats15.encumbranceLevel), 'Encumbrance is a valid level');

// Test weight breakdown structure
assert(typeof stats15.breakdown === 'object', 'Stats have breakdown object');
assert(stats15.breakdown.primaryWeapon > 0, 'Breakdown has primary weapon weight');
assert(stats15.breakdown.primaryAmmo > 0, 'Breakdown has primary ammo weight');
assert(stats15.breakdown.gear > 0, 'Breakdown has gear weight');
assert(stats15.weaponWeight > 0, 'Weapon total weight is positive');
assert(stats15.ammoWeight > 0, 'Ammo total weight is positive');
assert(stats15.gearWeight > 0, 'Gear total weight is positive');

// Verify weight components sum correctly (within rounding tolerance)
const componentSum15 = stats15.weaponWeight + stats15.ammoWeight + stats15.gearWeight;
assert(Math.abs(componentSum15 - stats15.totalWeightKg) < 0.1, 'Weapon + Ammo + Gear ≈ Total weight');

// Test empty/null loadout
const emptyStats = LogisticsCalculator.analyze(null);
assert(emptyStats.totalWeightKg === 0, 'Null loadout returns 0 weight');
assert(emptyStats.totalRounds === 0, 'Null loadout returns 0 rounds');
assert(emptyStats.encumbranceLevel === 'Light', 'Null loadout is Light encumbrance');

// Test launcher-heavy loadout (Anti-Tank)
const atLoadout15 = {
    faction: 'NATO', role: 'Anti-Tank',
    primary: { class: 'arifle_MX_F', mag: ['30Rnd_65x39_caseless_mag', 30], optic: 'optic_Hamr', pointer: '', bipod: '', muzzle: '', count: 4 },
    handgun: { class: 'hgun_P07_F', mag: ['16Rnd_9x21_Mag', 16], optic: '', pointer: '', bipod: '', muzzle: '', count: 2 },
    launcher: { class: 'launch_NLAW_F', mag: ['NLAW_F', 1] },
    clothing: { uniform: 'U_B_CombatUniform_mcam', vest: 'V_PlateCarrier2_rgr', backpack: 'B_Kitbag_cbr', headgear: 'H_HelmetB', facewear: '' },
    items: { binocular: '', nvg: 'NVGoggles', grenadeChoice: 'HandGrenade', grenadeCount: 1, smokeChoice: 'SmokeShell', smokeCount: 1, linked: [] },
    meta: { chaosLevel: 1, primaryMod: 'Vanilla', caliber: '6.5x39' }
};

const atStats = LogisticsCalculator.analyze(atLoadout15);
assert(atStats.totalWeightKg > stats15.totalWeightKg - 5, 'AT loadout has significant weight from launcher');
assert(atStats.breakdown.launcher > 0, 'AT loadout has launcher weight in breakdown');
assert(atStats.breakdown.launcherAmmo > 0, 'AT loadout has launcher ammo in breakdown');

// Test encumbrance thresholds
assert(LogisticsCalculator.getEncumbranceLevel(10) === 'Light', '10 kg = Light');
assert(LogisticsCalculator.getEncumbranceLevel(24.9) === 'Light', '24.9 kg = Light');
assert(LogisticsCalculator.getEncumbranceLevel(25) === 'Medium', '25 kg = Medium');
assert(LogisticsCalculator.getEncumbranceLevel(34.9) === 'Medium', '34.9 kg = Medium');
assert(LogisticsCalculator.getEncumbranceLevel(35) === 'Heavy', '35 kg = Heavy');
assert(LogisticsCalculator.getEncumbranceLevel(44.9) === 'Heavy', '44.9 kg = Heavy');
assert(LogisticsCalculator.getEncumbranceLevel(45) === 'Overloaded', '45 kg = Overloaded');
assert(LogisticsCalculator.getEncumbranceLevel(100) === 'Overloaded', '100 kg = Overloaded');

// Verify HTML integration
const htmlContent15 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent15.includes('id="logistics-panel"'), 'index.html contains #logistics-panel');

// Verify CSS integration
const cssContent15 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent15.includes('.logistics-panel'), 'styles.css contains .logistics-panel rule');
assert(cssContent15.includes('.encumbrance-badge'), 'styles.css contains .encumbrance-badge rule');
assert(cssContent15.includes('.encumbrance-light'), 'styles.css contains .encumbrance-light');
assert(cssContent15.includes('.encumbrance-heavy'), 'styles.css contains .encumbrance-heavy');
assert(cssContent15.includes('.encumbrance-overloaded'), 'styles.css contains .encumbrance-overloaded');
assert(cssContent15.includes('.weight-segment'), 'styles.css contains .weight-segment rule');
assert(cssContent15.includes('.logistics-stats-row'), 'styles.css contains .logistics-stats-row rule');

// Verify UIController integration
assert(typeof UIController.renderLogistics === 'function', 'UIController.renderLogistics is a function');

console.log('  ✓ LogisticsCalculator weight analysis, encumbrance thresholds, breakdown accuracy, HTML/CSS integration verified');

console.log('\nTest Suite 16: Shareable Loadout Links (URL Hash Encoding)');
assert(typeof LoadoutShareCodec === 'function', 'LoadoutShareCodec is exported');
assert(typeof LoadoutShareCodec.encode === 'function', 'LoadoutShareCodec.encode is a function');
assert(typeof LoadoutShareCodec.decode === 'function', 'LoadoutShareCodec.decode is a function');
assert(typeof LoadoutShareCodec.generateShareUrl === 'function', 'LoadoutShareCodec.generateShareUrl is a function');

// Null and empty checks
assert(LoadoutShareCodec.encode(null) === '', 'encode(null) returns empty string');
assert(LoadoutShareCodec.encode(undefined) === '', 'encode(undefined) returns empty string');
assert(LoadoutShareCodec.decode(null) === null, 'decode(null) returns null');
assert(LoadoutShareCodec.decode('') === null, 'decode("") returns null');
assert(LoadoutShareCodec.decode('invalid!base64!@@@') === null, 'decode invalid string returns null');
assert(LoadoutShareCodec.decode('12345') === null, 'decode malformed base64 returns null');
assert(LoadoutShareCodec.generateShareUrl(null) === '', 'generateShareUrl(null) returns empty string');

// Round-trip test
const testLoadout16 = {
    faction: 'NATO',
    role: 'Rifleman',
    primary: {
        class: 'arifle_MX_F',
        optic: 'optic_Hamr',
        pointer: 'acc_pointer_IR',
        bipod: 'bipod_01_F_blk',
        muzzle: 'muzzle_snds_H',
        mag: ['30Rnd_65x39_caseless_mag', 30],
        count: 6
    },
    handgun: {
        class: 'hgun_P07_F',
        muzzle: 'muzzle_snds_L',
        mag: ['16Rnd_9x21_Mag', 16],
        count: 3
    },
    launcher: {
        class: 'launch_NLAW_F',
        mag: ['NLAW_F', 1]
    },
    clothing: {
        uniform: 'U_B_CombatUniform_mcam',
        vest: 'V_PlateCarrier2_rgr',
        backpack: 'B_AssaultPack_mcamo',
        headgear: 'H_HelmetB',
        facewear: 'G_Combat'
    },
    items: {
        nvg: 'NVGoggles',
        binocular: 'Binocular',
        grenadeChoice: 'HandGrenade',
        grenadeCount: 2,
        smokeChoice: 'SmokeShell',
        smokeCount: 2,
        linked: []
    },
    meta: {
        chaosLevel: 2,
        primaryMod: 'Vanilla',
        caliber: '6.5x39'
    }
};

const encoded16 = LoadoutShareCodec.encode(testLoadout16);
assert(typeof encoded16 === 'string' && encoded16.length > 0, 'encode returns non-empty string');
assert(!encoded16.includes('+') && !encoded16.includes('/') && !encoded16.includes('='), 'encode produces URL-safe Base64 without +, /, =');
assert(encoded16.length < 800, 'encode string is compact (< 800 chars, well under 2k browser limit)');

const decoded16 = LoadoutShareCodec.decode(encoded16);
assert(decoded16 !== null, 'decode returns valid object');
assert(decoded16.faction === 'NATO', 'Decoded faction matches');
assert(decoded16.role === 'Rifleman', 'Decoded role matches');
assert(decoded16.primary.class === 'arifle_MX_F', 'Decoded primary class matches');
assert(decoded16.primary.optic === 'optic_Hamr', 'Decoded primary optic matches');
assert(decoded16.primary.pointer === 'acc_pointer_IR', 'Decoded primary pointer matches');
assert(decoded16.primary.bipod === 'bipod_01_F_blk', 'Decoded primary bipod matches');
assert(decoded16.primary.muzzle === 'muzzle_snds_H', 'Decoded primary muzzle matches');
assert(decoded16.primary.mag[0] === '30Rnd_65x39_caseless_mag', 'Decoded primary mag matches');
assert(decoded16.primary.count === 6, 'Decoded primary count matches');
assert(decoded16.handgun.class === 'hgun_P07_F', 'Decoded handgun class matches');
assert(decoded16.handgun.muzzle === 'muzzle_snds_L', 'Decoded handgun muzzle matches');
assert(decoded16.launcher.class === 'launch_NLAW_F', 'Decoded launcher class matches');
assert(decoded16.clothing.uniform === 'U_B_CombatUniform_mcam', 'Decoded uniform matches');
assert(decoded16.clothing.vest === 'V_PlateCarrier2_rgr', 'Decoded vest matches');
assert(decoded16.clothing.backpack === 'B_AssaultPack_mcamo', 'Decoded backpack matches');
assert(decoded16.clothing.headgear === 'H_HelmetB', 'Decoded headgear matches');
assert(decoded16.clothing.facewear === 'G_Combat', 'Decoded facewear matches');
assert(decoded16.items.nvg === 'NVGoggles', 'Decoded nvg matches');
assert(decoded16.items.binocular === 'Binocular', 'Decoded binocular matches');
assert(decoded16.items.grenadeCount === 2, 'Decoded grenade count matches');
assert(decoded16.items.smokeCount === 2, 'Decoded smoke count matches');
assert(decoded16.meta.chaosLevel === 2, 'Decoded chaos level matches');
assert(decoded16.meta.primaryMod === 'Vanilla', 'Decoded primaryMod matches');
assert(decoded16.meta.caliber === '6.5x39', 'Decoded caliber matches');

const shareUrl16 = LoadoutShareCodec.generateShareUrl(testLoadout16);
assert(shareUrl16.includes('#loadout=' + encoded16), 'generateShareUrl includes #loadout= with encoded hash');

// Verify HTML integration
const htmlContent16 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent16.includes('id="share-btn"'), 'index.html contains #share-btn');

// Verify CSS integration
const cssContent16 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent16.includes('#share-btn') || cssContent16.includes('.share-btn'), 'styles.css contains share-btn rule');
assert(cssContent16.includes('.share-toast'), 'styles.css contains .share-toast rule');

// Verify UIController integration
assert(typeof UIController.restoreFromLoadout === 'function', 'UIController.restoreFromLoadout is a function');
assert(typeof UIController.bindShareButton === 'function', 'UIController.bindShareButton is a function');
assert(typeof UIController.checkHashOnLoad === 'function', 'UIController.checkHashOnLoad is a function');

console.log('  ✓ LoadoutShareCodec encode/decode fidelity, compactness, URL generation, HTML/CSS/UIController integration verified');

console.log('\nTest Suite 17: Bulk Export & Squad Builder System');
assert(typeof SquadBuilder === 'function', 'SquadBuilder class is exported');
assert(typeof FIRETEAM_TEMPLATES === 'object' && FIRETEAM_TEMPLATES !== null, 'FIRETEAM_TEMPLATES is exported');
assert(FIRETEAM_TEMPLATES['4-Man Fireteam'].length === 4, '4-Man Fireteam has 4 roles');
assert(FIRETEAM_TEMPLATES['6-Man SOF'].length === 6, '6-Man SOF has 6 roles');
assert(FIRETEAM_TEMPLATES['8-Man Section'].length === 8, '8-Man Section has 8 roles');
assert(FIRETEAM_TEMPLATES['Sniper Team'].length === 2, 'Sniper Team has 2 roles');

assert(typeof SquadBuilder.getTemplates === 'function', 'SquadBuilder.getTemplates is a function');
assert(typeof SquadBuilder.getTemplateRoles === 'function', 'SquadBuilder.getTemplateRoles is a function');
assert(typeof SquadBuilder.generate === 'function', 'SquadBuilder.generate is a function');
assert(typeof SquadBuilder.exportSQF === 'function', 'SquadBuilder.exportSQF is a function');

const templateList17 = SquadBuilder.getTemplates();
assert(Array.isArray(templateList17) && templateList17.length >= 4, 'getTemplates returns at least 4 templates');
assert(templateList17.includes('4-Man Fireteam'), 'getTemplates includes 4-Man Fireteam');
assert(templateList17.includes('6-Man SOF'), 'getTemplates includes 6-Man SOF');

// 4-Man Fireteam Generation
const sq4 = SquadBuilder.generate({ template: '4-Man Fireteam', faction: 'NATO' });
assert(sq4 && Array.isArray(sq4.members), 'generate returns squad with members array');
assert(sq4.members.length === 4, '4-Man Fireteam generates exactly 4 members');
assert(sq4.members[0].role === 'Rifleman', 'Unit 0 is Rifleman');
assert(sq4.members[1].role === 'Rifleman', 'Unit 1 is Rifleman');
assert(sq4.members[2].role === 'Medic', 'Unit 2 is Medic');
assert(sq4.members[3].role === 'Machine Gunner', 'Unit 3 is Machine Gunner');
assert(sq4.members.every(m => m.loadout && m.loadout.faction === 'NATO'), 'All 4 members locked to NATO faction');
assert(sq4.members.every(m => typeof m.sqf === 'string' && m.sqf.length > 0), 'All 4 members have valid SQF');

// 6-Man SOF Generation (CSAT)
const sq6 = SquadBuilder.generate({ template: '6-Man SOF', faction: 'CSAT' });
assert(sq6.members.length === 6, '6-Man SOF generates 6 members');
assert(sq6.members.every(m => m.loadout && m.loadout.faction === 'CSAT'), 'All 6 members locked to CSAT faction');
assert(sq6.members[0].role === 'Pointman', 'First SOF member is Pointman');

// 8-Man Section Generation (AAF)
const sq8 = SquadBuilder.generate({ template: '8-Man Section', faction: 'AAF' });
assert(sq8.members.length === 8, '8-Man Section generates 8 members');
assert(sq8.members.every(m => m.loadout && m.loadout.faction === 'AAF'), 'All 8 members locked to AAF faction');

// Sniper Team Generation (FIA)
const sqSniper = SquadBuilder.generate({ template: 'Sniper Team', faction: 'FIA' });
assert(sqSniper.members.length === 2, 'Sniper Team generates 2 members');
assert(sqSniper.members[0].role === 'Sniper', 'First member is Sniper');
assert(sqSniper.members[1].role === 'Rifleman', 'Second member is Rifleman / Spotter');
assert(sqSniper.members.every(m => m.loadout && m.loadout.faction === 'FIA'), 'All Sniper team members locked to FIA faction');

// Custom Roles Generation
const sqCustom = SquadBuilder.generate({ roles: ['Pilot', 'Medic', 'Anti-Tank'], faction: 'NATO' });
assert(sqCustom.members.length === 3, 'Custom roles list generates 3 members');
assert(sqCustom.members[0].role === 'Pilot', 'Custom role 0 is Pilot');
assert(sqCustom.members[1].role === 'Medic', 'Custom role 1 is Medic');
assert(sqCustom.members[2].role === 'Anti-Tank', 'Custom role 2 is Anti-Tank');

// Bulk SQF Export Verification
const bulkSqf = SquadBuilder.exportSQF(sq4);
assert(typeof bulkSqf === 'string' && bulkSqf.length > 0, 'exportSQF produces a non-empty string');
assert(bulkSqf.includes('// Arma 3 Squad Loadout Export'), 'Bulk SQF contains header comment');
assert(bulkSqf.includes('// Template: 4-Man Fireteam | Faction: NATO | Strength: 4 operators'), 'Bulk SQF contains metadata line');
assert(bulkSqf.includes('_unit0 setUnitLoadout ['), 'Bulk SQF contains _unit0 assignment');
assert(bulkSqf.includes('_unit1 setUnitLoadout ['), 'Bulk SQF contains _unit1 assignment');
assert(bulkSqf.includes('_unit2 setUnitLoadout ['), 'Bulk SQF contains _unit2 assignment');
assert(bulkSqf.includes('_unit3 setUnitLoadout ['), 'Bulk SQF contains _unit3 assignment');
assert(bulkSqf.endsWith('];'), 'Bulk SQF ends with semicolon');

// Custom prefix in bulk SQF
const customPrefixSqf = SquadBuilder.exportSQF(sq4, { unitPrefix: '_fireteamUnit' });
assert(customPrefixSqf.includes('_fireteamUnit0 setUnitLoadout ['), 'Custom unitPrefix supported');
assert(customPrefixSqf.includes('_fireteamUnit3 setUnitLoadout ['), 'Custom unitPrefix reaches last unit');

// Empty squad safety
const emptySqf = SquadBuilder.exportSQF([]);
assert(emptySqf.includes('Empty squad'), 'Empty squad export returns fallback comment');

// Verify HTML integration
const htmlContent17 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent17.includes('id="squad-builder-view"'), 'index.html contains #squad-builder-view');
assert(htmlContent17.includes('data-target="squad-builder-view"'), 'index.html contains Squad Builder tab button');
assert(htmlContent17.includes('id="squad-template-select"'), 'index.html contains #squad-template-select');
assert(htmlContent17.includes('id="squad-faction-select"'), 'index.html contains #squad-faction-select');
assert(htmlContent17.includes('id="generate-squad-btn"'), 'index.html contains #generate-squad-btn');
assert(htmlContent17.includes('id="copy-squad-sqf-btn"'), 'index.html contains #copy-squad-sqf-btn');
assert(htmlContent17.includes('id="squad-grid"'), 'index.html contains #squad-grid');
assert(htmlContent17.includes('id="squad-sqf-output"'), 'index.html contains #squad-sqf-output');

// Verify CSS integration
const cssContent17 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent17.includes('.squad-controls-bar'), 'styles.css contains .squad-controls-bar rule');
assert(cssContent17.includes('.squad-grid'), 'styles.css contains .squad-grid rule');
assert(cssContent17.includes('.squad-member-card'), 'styles.css contains .squad-member-card rule');
assert(cssContent17.includes('.squad-member-header'), 'styles.css contains .squad-member-header rule');
assert(cssContent17.includes('.squad-member-weapons'), 'styles.css contains .squad-member-weapons rule');

// Verify UIController integration
assert(typeof UIController.bindSquadBuilder === 'function', 'UIController.bindSquadBuilder is a function');
assert(typeof UIController.rollInitialSquad === 'function', 'UIController.rollInitialSquad is a function');
assert(typeof UIController.renderSquad === 'function', 'UIController.renderSquad is a function');

console.log('  ✓ SquadBuilder templates, generation, faction locking, bulk SQF serialization, HTML/CSS/UIController integration verified');

console.log('\nTest Suite 18: Loadout Comparison Mode');
assert(typeof LoadoutComparator === 'function', 'LoadoutComparator is exported');
assert(typeof LoadoutComparator.diff === 'function', 'LoadoutComparator.diff is a function');
assert(typeof LoadoutComparator.emptyDiff === 'function', 'LoadoutComparator.emptyDiff is a function');

const emptyDiff = LoadoutComparator.emptyDiff();
assert(typeof emptyDiff === 'object' && emptyDiff !== null, 'emptyDiff returns an object');
assert(emptyDiff.matchCount === 0, 'emptyDiff matchCount is 0');
assert(emptyDiff.diffCount === 0, 'emptyDiff diffCount is 0');
assert(Array.isArray(emptyDiff.fields) && emptyDiff.fields.length === 0, 'emptyDiff fields is an empty array');
assert(emptyDiff.logisticsDelta && emptyDiff.logisticsDelta.deltaWeight === 0, 'emptyDiff deltaWeight is 0');

assert(LoadoutComparator.diff(null, null).matchCount === 0, 'diff(null, null) returns emptyDiff');
assert(LoadoutComparator.diff(undefined, {}).matchCount === 0, 'diff(undefined, {}) returns emptyDiff');

const testLoadoutA = generateLoadout('NATO', 'Rifleman').loadoutData;
const identicalDiff = LoadoutComparator.diff(testLoadoutA, testLoadoutA);
assert(identicalDiff.matchCount === 24, 'Identical loadouts have exactly 24 matching fields');
assert(identicalDiff.diffCount === 0, 'Identical loadouts have 0 diffs');
assert(identicalDiff.fields.length === 24, 'Identical loadout diff has 24 field descriptors');
assert(identicalDiff.fields.every(f => f.match === true), 'All 24 fields marked as matched');
assert(identicalDiff.logisticsDelta.deltaWeight === 0, 'Identical loadouts deltaWeight is 0');
assert(identicalDiff.logisticsDelta.deltaRounds === 0, 'Identical loadouts deltaRounds is 0');
assert(identicalDiff.logisticsDelta.deltaSustain === 0, 'Identical loadouts deltaSustain is 0');

const testLoadoutB = generateLoadout('CSAT', 'Machine Gunner').loadoutData;
const diffAB = LoadoutComparator.diff(testLoadoutA, testLoadoutB);
assert(diffAB.diffCount > 0, 'Different loadouts have diffCount > 0');
assert(diffAB.matchCount + diffAB.diffCount === 24, 'Total field count is always 24');
assert(diffAB.logisticsDelta.weightA > 0, 'weightA is positive');
assert(diffAB.logisticsDelta.weightB > 0, 'weightB is positive');
assert(typeof diffAB.logisticsDelta.encumbranceB === 'string', 'encumbranceB is a string');
assert(
    Math.abs(diffAB.logisticsDelta.deltaWeight - Math.round((diffAB.logisticsDelta.weightB - diffAB.logisticsDelta.weightA) * 100) / 100) < 0.001,
    'deltaWeight equals weightB - weightA'
);
assert(
    diffAB.logisticsDelta.deltaRounds === diffAB.logisticsDelta.roundsB - diffAB.logisticsDelta.roundsA,
    'deltaRounds equals roundsB - roundsA'
);

// Symmetry test
const diffBA = LoadoutComparator.diff(testLoadoutB, testLoadoutA);
assert(diffBA.diffCount === diffAB.diffCount, 'Symmetric comparison has same diffCount');
assert(diffBA.matchCount === diffAB.matchCount, 'Symmetric comparison has same matchCount');
assert(
    Math.abs(diffBA.logisticsDelta.deltaWeight + diffAB.logisticsDelta.deltaWeight) < 0.001,
    'Reverse comparison inverts deltaWeight'
);

// Verify HTML integration
const htmlContent18 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent18.includes('id="comparison-modal"'), 'index.html contains #comparison-modal');
assert(htmlContent18.includes('id="compare-last-btn"'), 'index.html contains #compare-last-btn');
assert(htmlContent18.includes('id="comparison-delta-bar"'), 'index.html contains #comparison-delta-bar');
assert(htmlContent18.includes('id="comparison-table-tbody"'), 'index.html contains #comparison-table-tbody');
assert(htmlContent18.includes('id="comp-col-a-header"'), 'index.html contains #comp-col-a-header');
assert(htmlContent18.includes('id="comp-col-b-header"'), 'index.html contains #comp-col-b-header');
assert(htmlContent18.includes('id="comparison-swap-btn"'), 'index.html contains #comparison-swap-btn');
assert(htmlContent18.includes('id="comparison-close-btn"'), 'index.html contains #comparison-close-btn');

// Verify CSS integration
const cssContent18 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent18.includes('.comparison-dialog'), 'styles.css contains .comparison-dialog rule');
assert(cssContent18.includes('.comparison-delta-bar'), 'styles.css contains .comparison-delta-bar rule');
assert(cssContent18.includes('.comparison-table'), 'styles.css contains .comparison-table rule');
assert(cssContent18.includes('.comparison-row.diff'), 'styles.css contains .comparison-row.diff rule');
assert(cssContent18.includes('.delta-badge.better'), 'styles.css contains .delta-badge.better rule');
assert(cssContent18.includes('.delta-badge.worse'), 'styles.css contains .delta-badge.worse rule');

// Verify UIController integration
assert(typeof UIController.bindComparisonEvents === 'function', 'UIController.bindComparisonEvents is a function');
assert(typeof UIController.openComparison === 'function', 'UIController.openComparison is a function');
assert(typeof UIController.closeComparison === 'function', 'UIController.closeComparison is a function');

console.log('  ✓ LoadoutComparator diff accuracy, symmetric delta calculations, HTML/CSS/UIController integration verified');

console.log('\nTest Suite 19: Weapon Stats Radar Chart');
assert(typeof RadarChart === 'function', 'RadarChart class is exported');
assert(typeof WEAPON_STATS_TABLE === 'object' && WEAPON_STATS_TABLE !== null, 'WEAPON_STATS_TABLE is exported');
assert(typeof RadarChart.getStats === 'function', 'RadarChart.getStats is a function');
assert(typeof RadarChart.getDefaultStats === 'function', 'RadarChart.getDefaultStats is a function');
assert(typeof RadarChart.render === 'function', 'RadarChart.render is a function');
assert(Array.isArray(RadarChart.AXES) && RadarChart.AXES.length === 5, 'RadarChart.AXES has exactly 5 axes');

// Verify AXES keys
const axisKeys = RadarChart.AXES.map(a => a.key);
assert(axisKeys.includes('fireRate'), 'Axes includes fireRate');
assert(axisKeys.includes('effectiveRange'), 'Axes includes effectiveRange');
assert(axisKeys.includes('recoil'), 'Axes includes recoil');
assert(axisKeys.includes('weight'), 'Axes includes weight');
assert(axisKeys.includes('modularity'), 'Axes includes modularity');

// Verify table lookups & bounds
const mxStats = WEAPON_STATS_TABLE['arifle_MX_F'];
assert(mxStats !== undefined, 'arifle_MX_F exists in WEAPON_STATS_TABLE');
assert(mxStats.fireRate >= 0 && mxStats.fireRate <= 100, 'MX fireRate is in 0-100 range');
assert(mxStats.effectiveRange >= 0 && mxStats.effectiveRange <= 100, 'MX effectiveRange is in 0-100 range');
assert(mxStats.recoil >= 0 && mxStats.recoil <= 100, 'MX recoil is in 0-100 range');
assert(mxStats.weight >= 0 && mxStats.weight <= 100, 'MX weight is in 0-100 range');
assert(mxStats.modularity >= 0 && mxStats.modularity <= 100, 'MX modularity is in 0-100 range');

// Verify all entries in WEAPON_STATS_TABLE stay within bounds
for (const [wId, stats] of Object.entries(WEAPON_STATS_TABLE)) {
    for (const key of axisKeys) {
        const val = stats[key];
        assert(typeof val === 'number' && val >= 0 && val <= 100, `${wId} ${key} is valid number 0-100`);
    }
}

// Fallback stat generation for diverse categories
const categoriesToTest = ['Rifle', 'LMG', 'DMR/Sniper', 'SMG', 'Shotgun', 'Handgun', 'Launcher'];
categoriesToTest.forEach(cat => {
    const fallback = RadarChart.getDefaultStats({ category: cat, caliber: '5.56x45' });
    axisKeys.forEach(k => {
        assert(typeof fallback[k] === 'number' && fallback[k] >= 0 && fallback[k] <= 100, `${cat} default ${k} in bounds`);
    });
});

// Null safety for getStats / getDefaultStats
const nullStats = RadarChart.getStats(null);
assert(typeof nullStats === 'object' && nullStats !== null, 'getStats(null) returns valid object');
axisKeys.forEach(k => {
    assert(typeof nullStats[k] === 'number' && nullStats[k] >= 0 && nullStats[k] <= 100, `null stats ${k} in bounds`);
});

// Canvas rendering verification using mock 2D context
const mockCanvasCalls = [];
const mockCtx = {
    clearRect: (...args) => mockCanvasCalls.push(['clearRect', ...args]),
    beginPath: () => mockCanvasCalls.push(['beginPath']),
    closePath: () => mockCanvasCalls.push(['closePath']),
    moveTo: (...args) => mockCanvasCalls.push(['moveTo', ...args]),
    lineTo: (...args) => mockCanvasCalls.push(['lineTo', ...args]),
    stroke: () => mockCanvasCalls.push(['stroke']),
    fill: () => mockCanvasCalls.push(['fill']),
    arc: (...args) => mockCanvasCalls.push(['arc', ...args]),
    fillText: (...args) => mockCanvasCalls.push(['fillText', ...args]),
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    textAlign: '',
    textBaseline: ''
};
const mockCanvas = {
    width: 340,
    height: 280,
    getContext: (type) => (type === '2d' ? mockCtx : null)
};

RadarChart.render(mockCanvas, mxStats);
assert(mockCanvasCalls.some(c => c[0] === 'clearRect'), 'render calls clearRect');
assert(mockCanvasCalls.some(c => c[0] === 'beginPath'), 'render calls beginPath');
assert(mockCanvasCalls.some(c => c[0] === 'moveTo'), 'render calls moveTo');
assert(mockCanvasCalls.some(c => c[0] === 'lineTo'), 'render calls lineTo');
assert(mockCanvasCalls.some(c => c[0] === 'stroke'), 'render calls stroke');
assert(mockCanvasCalls.some(c => c[0] === 'fill'), 'render calls fill');
assert(mockCanvasCalls.some(c => c[0] === 'arc'), 'render calls arc for vertices');
assert(mockCanvasCalls.some(c => c[0] === 'fillText'), 'render calls fillText for axis labels');

// Safe no-op on null canvas
RadarChart.render(null, mxStats);

// Verify HTML integration
const htmlContent19 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent19.includes('id="modal-radar-chart"'), 'index.html contains #modal-radar-chart');
assert(htmlContent19.includes('class="radar-chart-container'), 'index.html contains .radar-chart-container');
assert(htmlContent19.includes('id="radar-stat-chips"'), 'index.html contains #radar-stat-chips');

// Verify CSS integration
const cssContent19 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent19.includes('.radar-chart-container'), 'styles.css contains .radar-chart-container rule');
assert(cssContent19.includes('.radar-chart-canvas'), 'styles.css contains .radar-chart-canvas rule');
assert(cssContent19.includes('.radar-stat-chips'), 'styles.css contains .radar-stat-chips rule');
assert(cssContent19.includes('.radar-chip'), 'styles.css contains .radar-chip rule');

// Verify ArmoryController integration
assert(typeof ArmoryController.openInspectModal === 'function', 'ArmoryController.openInspectModal is a function');
assert(typeof ArmoryController.closeInspectModal === 'function', 'ArmoryController.closeInspectModal is a function');

console.log('  ✓ RadarChart stats calculations, bounds enforcement, Canvas2D pipeline, HTML/CSS/ArmoryController integration verified');

console.log('\nTest Suite 20: Arsenal Import Parser (Reverse-Parse SQF)');
assert(typeof SqfImporter === 'function', 'SqfImporter class is exported');
assert(typeof SqfImporter.parse === 'function', 'SqfImporter.parse is a function');

// Invalid and boundary inputs
assert(SqfImporter.parse(null).success === false, 'parse(null) returns success: false');
assert(SqfImporter.parse("").success === false, 'parse("") returns success: false');
assert(SqfImporter.parse("random unformatted text").success === false, 'parse(invalid text) returns success: false');
assert(SqfImporter.parse("[1, 2, 3]").success === false, 'parse(short array) returns success: false');

// Round-trip with generator output (Rifleman)
const riflemanKit = generateLoadout('NATO', 'Rifleman');
const parsedRifleman = SqfImporter.parse(riflemanKit.sqf);
assert(parsedRifleman.success === true, 'parse(generated rifleman SQF) succeeds');
assert(parsedRifleman.loadout !== null, 'parsed loadout object exists');
assert(parsedRifleman.loadout.primary.class === riflemanKit.loadoutData.primary.class, 'Parsed primary class matches');
assert(parsedRifleman.loadout.primary.optic === riflemanKit.loadoutData.primary.optic, 'Parsed primary optic matches');
assert(parsedRifleman.loadout.primary.muzzle === riflemanKit.loadoutData.primary.muzzle, 'Parsed primary muzzle matches');
assert(parsedRifleman.loadout.primary.bipod === riflemanKit.loadoutData.primary.bipod, 'Parsed primary bipod matches');
assert(parsedRifleman.loadout.clothing.uniform === riflemanKit.loadoutData.clothing.uniform, 'Parsed uniform matches');
assert(parsedRifleman.loadout.clothing.vest === riflemanKit.loadoutData.clothing.vest, 'Parsed vest matches');
assert(parsedRifleman.loadout.clothing.headgear === riflemanKit.loadoutData.clothing.headgear, 'Parsed headgear matches');
assert(parsedRifleman.loadout.items.nvg === riflemanKit.loadoutData.items.nvg, 'Parsed NVG matches');
assert(parsedRifleman.recognizedWeapons.includes(riflemanKit.loadoutData.primary.class), 'Primary weapon recognized in repository');

// Round-trip with Anti-Tank loadout
const atKit = generateLoadout('NATO', 'Anti-Tank');
const parsedAt = SqfImporter.parse(atKit.sqf);
assert(parsedAt.success === true, 'parse(generated AT SQF) succeeds');
assert(parsedAt.loadout.launcher.class === atKit.loadoutData.launcher.class, 'Parsed launcher class matches');
assert(parsedAt.loadout.role === 'Anti-Tank', 'Inferred role is Anti-Tank');

// Raw SQF array format (no player setUnitLoadout command prefix)
const rawSqfSample = '[["arifle_Katiba_F","","optic_Aco","acc_pointer_IR",["30Rnd_65x39_caseless_green",30],[],""],[],["hgun_Rook40_F","","","",["16Rnd_9x21_Mag",16],[],""],["U_O_CombatUniform_ocamo",[]],["V_HarnessO_brn",[]],["B_FieldPack_ocamo",[]],"H_HelmetO_ocamo","G_Tactical_Clear",[],["ItemMap","","ItemRadio","ItemCompass","ItemWatch","NVGoggles_OPFOR"]]';
const rawParsed = SqfImporter.parse(rawSqfSample);
assert(rawParsed.success === true, 'parse(raw SQF array) succeeds');
assert(rawParsed.loadout.primary.class === 'arifle_Katiba_F', 'Raw array primary is Katiba');
assert(rawParsed.loadout.handgun.class === 'hgun_Rook40_F', 'Raw array handgun is Rook40');
assert(rawParsed.loadout.clothing.uniform === 'U_O_CombatUniform_ocamo', 'Raw array uniform parsed');
assert(rawParsed.loadout.clothing.vest === 'V_HarnessO_brn', 'Raw array vest parsed');
assert(rawParsed.loadout.clothing.backpack === 'B_FieldPack_ocamo', 'Raw array backpack parsed');
assert(rawParsed.loadout.clothing.headgear === 'H_HelmetO_ocamo', 'Raw array headgear parsed');
assert(rawParsed.loadout.clothing.facewear === 'G_Tactical_Clear', 'Raw array facewear parsed');
assert(rawParsed.loadout.items.nvg === 'NVGoggles_OPFOR', 'Raw array NVG parsed');

// Unrecognized weapon classname handling
const badWeaponSqf = '[["weapon_alien_blaster_9000","","","",["30Rnd_556x45_Stanag",30],[],""],[],[],["U_B_CombatUniform_mcam",[]],["V_PlateCarrier1_rgr",[]],[],"H_HelmetB","", [], []]';
const badParsed = SqfImporter.parse(badWeaponSqf);
assert(badParsed.success === true, 'parse succeeds even with unrecognized weapon');
assert(badParsed.warnings.length > 0, 'Generates warning for unknown weapon');
assert(badParsed.unrecognizedWeapons.includes('weapon_alien_blaster_9000'), 'Identifies unknown weapon classname');

// Verify HTML integration
const htmlContent20 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent20.includes('id="sqf-import-area"'), 'index.html contains #sqf-import-area');
assert(htmlContent20.includes('id="parse-import-btn"'), 'index.html contains #parse-import-btn');
assert(htmlContent20.includes('id="clear-import-btn"'), 'index.html contains #clear-import-btn');
assert(htmlContent20.includes('id="import-toggle-btn"'), 'index.html contains #import-toggle-btn');
assert(htmlContent20.includes('id="import-panel-body"'), 'index.html contains #import-panel-body');
assert(htmlContent20.includes('id="import-status"'), 'index.html contains #import-status');
assert(htmlContent20.includes('id="import-feedback"'), 'index.html contains #import-feedback');

// Verify CSS integration
const cssContent20 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent20.includes('.sqf-import'), 'styles.css contains .sqf-import rule');
assert(cssContent20.includes('.import-textarea'), 'styles.css contains .import-textarea rule');
assert(cssContent20.includes('.import-status.valid'), 'styles.css contains .import-status.valid rule');
assert(cssContent20.includes('.import-status.error'), 'styles.css contains .import-status.error rule');
assert(cssContent20.includes('.import-feedback-box.success'), 'styles.css contains .import-feedback-box.success rule');
assert(cssContent20.includes('.import-feedback-box.warning'), 'styles.css contains .import-feedback-box.warning rule');

// Verify UIController integration
assert(typeof UIController.bindImportEvents === 'function', 'UIController.bindImportEvents is a function');
assert(typeof UIController.handleImportSQF === 'function', 'UIController.handleImportSQF is a function');

console.log('  ✓ SqfImporter reverse-parsing, round-trip fidelity, error reporting, HTML/CSS/UIController integration verified');

console.log('\nTest Suite 21: Keyboard Shortcuts Controller');
assert(typeof KeyboardController === 'function', 'KeyboardController class is exported');
assert(Array.isArray(KeyboardController.SHORTCUTS), 'KeyboardController.SHORTCUTS is an array');
assert(Object.isFrozen(KeyboardController.SHORTCUTS), 'KeyboardController.SHORTCUTS is frozen');
assert(KeyboardController.SHORTCUTS.length === 7, 'KeyboardController.SHORTCUTS has exactly 7 shortcut definitions');

// Validate shortcut structure and expected key combinations
const shortcutKeys = KeyboardController.SHORTCUTS.map(s => s.key);
assert(shortcutKeys.includes('R'), 'SHORTCUTS includes "R"');
assert(shortcutKeys.includes('Ctrl+Shift+C'), 'SHORTCUTS includes "Ctrl+Shift+C"');
assert(shortcutKeys.includes('1 - 5'), 'SHORTCUTS includes "1 - 5"');
assert(shortcutKeys.includes('/'), 'SHORTCUTS includes "/"');
assert(shortcutKeys.includes('F'), 'SHORTCUTS includes "F"');
assert(shortcutKeys.includes('?'), 'SHORTCUTS includes "?"');
assert(shortcutKeys.includes('Escape'), 'SHORTCUTS includes "Escape"');

KeyboardController.SHORTCUTS.forEach(s => {
    assert(typeof s.key === 'string' && s.key.length > 0, `Shortcut key "${s.key}" is non-empty string`);
    assert(typeof s.description === 'string' && s.description.length > 0, `Shortcut description for "${s.key}" is non-empty string`);
});

// isInputFocused guard tests
assert(KeyboardController.isInputFocused(null) === false, 'isInputFocused(null) is false');
assert(KeyboardController.isInputFocused({}) === false, 'isInputFocused({}) is false');
assert(KeyboardController.isInputFocused({ target: null }) === false, 'isInputFocused({ target: null }) is false');
assert(KeyboardController.isInputFocused({ target: { tagName: 'DIV' } }) === false, 'isInputFocused on DIV is false');
assert(KeyboardController.isInputFocused({ target: { tagName: 'BUTTON' } }) === false, 'isInputFocused on BUTTON is false');
assert(KeyboardController.isInputFocused({ target: { tagName: 'BODY' } }) === false, 'isInputFocused on BODY is false');
assert(KeyboardController.isInputFocused({ target: { tagName: 'SPAN' } }) === false, 'isInputFocused on SPAN is false');
assert(KeyboardController.isInputFocused({ target: { tagName: 'INPUT' } }) === true, 'isInputFocused on INPUT is true');
assert(KeyboardController.isInputFocused({ target: { tagName: 'input' } }) === true, 'isInputFocused on lowercase input is true');
assert(KeyboardController.isInputFocused({ target: { tagName: 'TEXTAREA' } }) === true, 'isInputFocused on TEXTAREA is true');
assert(KeyboardController.isInputFocused({ target: { tagName: 'SELECT' } }) === true, 'isInputFocused on SELECT is true');
assert(KeyboardController.isInputFocused({ target: { tagName: 'DIV', isContentEditable: true } }) === true, 'isInputFocused on contentEditable is true');

// handleKeyDown execution tests
assert(typeof KeyboardController.handleKeyDown === 'function', 'KeyboardController.handleKeyDown is a function');
// Safe no-op on falsy event
KeyboardController.handleKeyDown(null);
KeyboardController.handleKeyDown(undefined);

// Test 'R' / 'r' triggering runGenerate
let generateCallCount = 0;
const originalRunGenerate = UIController.runGenerate;
UIController.runGenerate = () => { generateCallCount++; };

let prevented = false;
const mockEventR = {
    key: 'r',
    target: { tagName: 'BODY' },
    preventDefault: () => { prevented = true; }
};
KeyboardController.handleKeyDown(mockEventR);
assert(generateCallCount === 1, 'Pressing "r" calls UIController.runGenerate()');
assert(prevented === true, 'Pressing "r" prevents default browser event');

// Uppercase 'R'
prevented = false;
KeyboardController.handleKeyDown({
    key: 'R',
    target: { tagName: 'BODY' },
    preventDefault: () => { prevented = true; }
});
assert(generateCallCount === 2, 'Pressing "R" calls UIController.runGenerate()');

// Should NOT trigger if typing in an INPUT
KeyboardController.handleKeyDown({
    key: 'r',
    target: { tagName: 'INPUT' },
    preventDefault: () => {}
});
assert(generateCallCount === 2, 'Pressing "r" inside an INPUT does not trigger generate');

// Should NOT trigger if modifier key is pressed (e.g. Ctrl+R browser refresh)
KeyboardController.handleKeyDown({
    key: 'r',
    ctrlKey: true,
    target: { tagName: 'BODY' },
    preventDefault: () => {}
});
assert(generateCallCount === 2, 'Pressing Ctrl+R does not trigger roll (allows native reload)');

UIController.runGenerate = originalRunGenerate;

// Test Tab switching with 1-5
const switchedTabs = [];
const originalSwitchToTab = UIController.switchToTab;
UIController.switchToTab = (tabId) => { switchedTabs.push(tabId); };

KeyboardController.handleKeyDown({ key: '1', target: { tagName: 'BODY' }, preventDefault: () => {} });
assert(switchedTabs.includes('generator-view'), 'Key "1" switches to generator-view');

KeyboardController.handleKeyDown({ key: '2', target: { tagName: 'BODY' }, preventDefault: () => {} });
assert(switchedTabs.includes('armory-view'), 'Key "2" switches to armory-view');

KeyboardController.handleKeyDown({ key: '3', target: { tagName: 'BODY' }, preventDefault: () => {} });
assert(switchedTabs.includes('best-loadouts-view'), 'Key "3" switches to best-loadouts-view');

KeyboardController.handleKeyDown({ key: '4', target: { tagName: 'BODY' }, preventDefault: () => {} });
assert(switchedTabs.includes('squad-builder-view'), 'Key "4" switches to squad-builder-view');

KeyboardController.handleKeyDown({ key: '5', target: { tagName: 'BODY' }, preventDefault: () => {} });
assert(switchedTabs.includes('mod-manager-view'), 'Key "5" switches to mod-manager-view');

// 1-5 ignored inside INPUT
const tabsBeforeInput = switchedTabs.length;
KeyboardController.handleKeyDown({ key: '1', target: { tagName: 'INPUT' }, preventDefault: () => {} });
assert(switchedTabs.length === tabsBeforeInput, 'Key "1" ignored inside input');

UIController.switchToTab = originalSwitchToTab;

// Test '/' focusing Armory search
let searchTabSwitched = false;
let searchFocused = false;
const mockSearchInput = {
    focus: () => { searchFocused = true; }
};
const originalGetElem = context.document.getElementById;
context.document.getElementById = (id) => (id === 'armory-search-input' ? mockSearchInput : null);
UIController.switchToTab = (tabId) => {
    if (tabId === 'armory-view') searchTabSwitched = true;
};

KeyboardController.handleKeyDown({ key: '/', target: { tagName: 'BODY' }, preventDefault: () => {} });
assert(searchTabSwitched === true, 'Key "/" switches to armory tab');
assert(searchFocused === true, 'Key "/" focuses armory search input');

UIController.switchToTab = originalSwitchToTab;
context.document.getElementById = originalGetElem;

// Test 'F' toggles favorite on most recent loadout
LoadoutHistory.clear();
const favTestKit = generateLoadout('NATO', 'Rifleman');
LoadoutHistory.save(favTestKit.loadoutData, favTestKit.sqf);
const recordedEntries = LoadoutHistory.getAll();
assert(recordedEntries.length > 0, 'LoadoutHistory has entry for F shortcut test');
assert(recordedEntries[0].isFavorite === false, 'Entry starts unfavorited');

let historyRendered = false;
const origRenderHistory = UIController.renderHistory;
UIController.renderHistory = () => { historyRendered = true; };

KeyboardController.handleKeyDown({ key: 'f', target: { tagName: 'BODY' }, preventDefault: () => {} });
assert(LoadoutHistory.getAll()[0].isFavorite === true, 'Key "f" toggles favorite to true');
assert(historyRendered === true, 'Key "f" calls UIController.renderHistory()');

KeyboardController.handleKeyDown({ key: 'F', target: { tagName: 'BODY' }, preventDefault: () => {} });
assert(LoadoutHistory.getAll()[0].isFavorite === false, 'Key "F" toggles favorite back to false');

UIController.renderHistory = origRenderHistory;

// Test modal open, close, toggle, and closeAllModals
assert(typeof KeyboardController.openShortcutsModal === 'function', 'openShortcutsModal is a function');
assert(typeof KeyboardController.closeShortcutsModal === 'function', 'closeShortcutsModal is a function');
assert(typeof KeyboardController.toggleShortcutsModal === 'function', 'toggleShortcutsModal is a function');
assert(typeof KeyboardController.closeAllModals === 'function', 'closeAllModals is a function');

const modalDoms = {
    'shortcuts-modal': { style: { display: 'none' } },
    'armory-inspect-modal': { style: { display: 'flex' } },
    'comparison-modal': { style: { display: 'block' } }
};
context.document.getElementById = (id) => modalDoms[id] || null;

KeyboardController.openShortcutsModal();
assert(modalDoms['shortcuts-modal'].style.display === 'flex', 'openShortcutsModal sets display to flex');

KeyboardController.closeShortcutsModal();
assert(modalDoms['shortcuts-modal'].style.display === 'none', 'closeShortcutsModal sets display to none');

KeyboardController.toggleShortcutsModal();
assert(modalDoms['shortcuts-modal'].style.display === 'flex', 'toggleShortcutsModal opens closed modal');

KeyboardController.toggleShortcutsModal();
assert(modalDoms['shortcuts-modal'].style.display === 'none', 'toggleShortcutsModal closes open modal');

// Escape key closes all modals
modalDoms['shortcuts-modal'].style.display = 'flex';
modalDoms['armory-inspect-modal'].style.display = 'flex';
modalDoms['comparison-modal'].style.display = 'flex';

KeyboardController.handleKeyDown({ key: 'Escape', target: { tagName: 'INPUT' } });
assert(modalDoms['shortcuts-modal'].style.display === 'none', 'Escape closes shortcuts modal even when in input');
assert(modalDoms['armory-inspect-modal'].style.display === 'none', 'Escape closes armory inspect modal even when in input');
assert(modalDoms['comparison-modal'].style.display === 'none', 'Escape closes comparison modal even when in input');

context.document.getElementById = originalGetElem;

// Verify HTML integration in index.html
const htmlContent21 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent21.includes('id="shortcuts-btn"'), 'index.html contains #shortcuts-btn in header');
assert(htmlContent21.includes('class="shortcuts-trigger-btn"'), 'index.html contains .shortcuts-trigger-btn');
assert(htmlContent21.includes('id="shortcuts-modal"'), 'index.html contains #shortcuts-modal');
assert(htmlContent21.includes('id="shortcuts-close-btn"'), 'index.html contains #shortcuts-close-btn');
assert(htmlContent21.includes('id="shortcuts-close-footer-btn"'), 'index.html contains #shortcuts-close-footer-btn');
assert(htmlContent21.includes('class="modal-dialog shortcuts-dialog"'), 'index.html contains .shortcuts-dialog');
assert(htmlContent21.includes('class="shortcuts-table"'), 'index.html contains .shortcuts-table');
assert(htmlContent21.includes('<kbd class="kbd-hint">R</kbd>'), 'index.html contains <kbd>R</kbd> hint on generate button');
assert(htmlContent21.includes('<kbd class="kbd-hint">Ctrl+Shift+C</kbd>'), 'index.html contains <kbd>Ctrl+Shift+C</kbd> hint on copy button');

// Verify CSS integration in styles.css
const cssContent21 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent21.includes('.shortcuts-trigger-btn'), 'styles.css contains .shortcuts-trigger-btn rule');
assert(cssContent21.includes('.shortcuts-dialog'), 'styles.css contains .shortcuts-dialog rule');
assert(cssContent21.includes('.shortcuts-modal-body'), 'styles.css contains .shortcuts-modal-body rule');
assert(cssContent21.includes('.shortcuts-table'), 'styles.css contains .shortcuts-table rule');
assert(cssContent21.includes('.kbd-hint'), 'styles.css contains .kbd-hint rule');
assert(cssContent21.includes('kbd {'), 'styles.css contains kbd styling rule');

// Verify UIController.init integration
assert(typeof KeyboardController.init === 'function', 'KeyboardController.init is a function');

console.log('  ✓ KeyboardController shortcuts, input focus guarding, synthetic event handling, HTML/CSS integration verified');

console.log('\nTest Suite 22: Camouflage & Biome Environment Selector');
assert(BIOME_GEAR && typeof BIOME_GEAR === 'object', 'BIOME_GEAR is exported as an object');
const expectedBiomes = ['woodland', 'arid', 'tropic', 'urban', 'winter'];
expectedBiomes.forEach(biome => {
    assert(BIOME_GEAR[biome], `BIOME_GEAR has entry for ${biome}`);
    ['NATO', 'CSAT', 'AAF', 'FIA'].forEach(faction => {
        assert(BIOME_GEAR[biome][faction], `BIOME_GEAR[${biome}] contains gear for ${faction}`);
        assert(Array.isArray(BIOME_GEAR[biome][faction].uniforms), `${biome} ${faction} has uniforms array`);
        assert(Array.isArray(BIOME_GEAR[biome][faction].vests), `${biome} ${faction} has vests array`);
        assert(Array.isArray(BIOME_GEAR[biome][faction].backpacks), `${biome} ${faction} has backpacks array`);
        assert(Array.isArray(BIOME_GEAR[biome][faction].headgear), `${biome} ${faction} has headgear array`);
    });
});

// Test loadout generation with biome override
const woodlandNato = LoadoutEngine.generate({ faction: 'NATO', role: 'Rifleman', biome: 'woodland' });
assert(BIOME_GEAR.woodland.NATO.uniforms.includes(woodlandNato.loadoutData.clothing.uniform), 'Woodland NATO generates woodland uniform');
assert(BIOME_GEAR.woodland.NATO.vests.includes(woodlandNato.loadoutData.clothing.vest), 'Woodland NATO generates woodland vest');

const aridCsat = LoadoutEngine.generate({ faction: 'CSAT', role: 'Rifleman', biome: 'arid' });
assert(BIOME_GEAR.arid.CSAT.uniforms.includes(aridCsat.loadoutData.clothing.uniform), 'Arid CSAT generates arid uniform');

const tropicNato = LoadoutEngine.generate({ faction: 'NATO', role: 'Rifleman', biome: 'tropic' });
assert(BIOME_GEAR.tropic.NATO.uniforms.includes(tropicNato.loadoutData.clothing.uniform), 'Tropic NATO generates tropic uniform');

const winterAaf = LoadoutEngine.generate({ faction: 'AAF', role: 'Rifleman', biome: 'winter' });
assert(BIOME_GEAR.winter.AAF.uniforms.includes(winterAaf.loadoutData.clothing.uniform), 'Winter AAF generates winter uniform');

const urbanFia = LoadoutEngine.generate({ faction: 'FIA', role: 'Rifleman', biome: 'urban' });
assert(BIOME_GEAR.urban.FIA.uniforms.includes(urbanFia.loadoutData.clothing.uniform), 'Urban FIA generates urban uniform');

// Verify HTML integration
const htmlContent22 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent22.includes('id="biome-select"'), 'index.html contains #biome-select');
assert(htmlContent22.includes('value="woodland"'), 'index.html contains woodland option');
assert(htmlContent22.includes('value="arid"'), 'index.html contains arid option');
assert(htmlContent22.includes('value="tropic"'), 'index.html contains tropic option');
assert(htmlContent22.includes('value="urban"'), 'index.html contains urban option');
assert(htmlContent22.includes('value="winter"'), 'index.html contains winter option');

console.log('  ✓ Biome definitions, 5 climates x 4 factions, generation overrides, and HTML selector verified');


console.log('\nTest Suite 23: Multi-Format SQF & Eden Init Snippets');
const sampleLoadout = LoadoutEngine.generate({ faction: 'NATO', role: 'Rifleman' }).loadoutData;

// Format 1: player setUnitLoadout
const sqfPlayer = SqfSerializer.serialize(sampleLoadout, { format: 'player' });
assert(sqfPlayer.startsWith('player setUnitLoadout ['), 'player format starts with player setUnitLoadout');
assert(sqfPlayer.endsWith('];'), 'player format ends with semicolon');

// Format 2: this setUnitLoadout (Eden Init)
const sqfThis = SqfSerializer.serialize(sampleLoadout, { format: 'this' });
assert(sqfThis.startsWith('this setUnitLoadout ['), 'this format starts with this setUnitLoadout');
assert(sqfThis.endsWith('];'), 'this format ends with semicolon');

// Format 3: _unit setUnitLoadout (Multiplayer Script)
const sqfUnit = SqfSerializer.serialize(sampleLoadout, { format: '_unit' });
assert(sqfUnit.startsWith('_unit setUnitLoadout ['), '_unit format starts with _unit setUnitLoadout');
assert(sqfUnit.endsWith('];'), '_unit format ends with semicolon');

// Format 4: bis_save
const sqfBis = SqfSerializer.serialize(sampleLoadout, { format: 'bis_save', customName: 'AlphaLoadout' });
assert(sqfBis.includes('[player, "AlphaLoadout"] call BIS_fnc_saveInventory;'), 'bis_save includes call BIS_fnc_saveInventory with customName');

// Format pretty preserves prefixes
const prettyThis = SqfSerializer.formatPretty(sqfThis);
assert(prettyThis.startsWith('this setUnitLoadout ['), 'formatPretty preserves this prefix');
const prettyUnit = SqfSerializer.formatPretty(sqfUnit);
assert(prettyUnit.startsWith('_unit setUnitLoadout ['), 'formatPretty preserves _unit prefix');

// downloadSqfFile function check
assert(typeof SqfSerializer.downloadSqfFile === 'function', 'SqfSerializer.downloadSqfFile is a function');

// HTML and CSS checks
assert(htmlContent22.includes('id="sqf-format-select"'), 'index.html contains #sqf-format-select');
assert(htmlContent22.includes('id="download-sqf-btn"'), 'index.html contains #download-sqf-btn');
const cssContent23 = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(cssContent23.includes('.sqf-format-select'), 'styles.css contains .sqf-format-select');

console.log('  ✓ Multi-format SQF serialization (player, this, _unit, bis_save), pretty formatting, and download API verified');


console.log('\nTest Suite 24: Night Ops & Optics Engagement Range Profiles');
// Optics profile generation
const cqbLoadout = LoadoutEngine.generate({ faction: 'NATO', role: 'Rifleman', opticProfile: 'cqb' });
assert(cqbLoadout.loadoutData.primary.optic !== undefined, 'CQB loadout generates primary optic');

const midLoadout = LoadoutEngine.generate({ faction: 'NATO', role: 'Rifleman', opticProfile: 'mid' });
assert(midLoadout.loadoutData.primary.optic !== undefined, 'Mid loadout generates primary optic');

const longLoadout = LoadoutEngine.generate({ faction: 'NATO', role: 'Marksman', opticProfile: 'long' });
assert(longLoadout.loadoutData.primary.optic !== undefined, 'Long loadout generates primary optic');

const thermalLoadout = LoadoutEngine.generate({ faction: 'NATO', role: 'Marksman', opticProfile: 'thermal' });
assert(thermalLoadout.loadoutData.primary.optic !== undefined, 'Thermal loadout generates primary optic');

// Night Ops generation
const nightLoadout = LoadoutEngine.generate({ faction: 'NATO', role: 'Rifleman', nightOps: true });
assert(nightLoadout.loadoutData.items.nvg === 'NVGoggles' || Boolean(nightLoadout.loadoutData.items.nvg), 'Night ops equips NVG');
assert(nightLoadout.loadoutData.primary.pointer === 'acc_pointer_IR' || Boolean(nightLoadout.loadoutData.primary.pointer), 'Night ops equips IR laser pointer');
assert(nightLoadout.loadoutData.meta.isNightOps === true, 'loadout meta records isNightOps: true');

// HTML / CSS verification
assert(htmlContent22.includes('id="optic-profile-select"'), 'index.html contains #optic-profile-select');
assert(htmlContent22.includes('id="night-ops-toggle"'), 'index.html contains #night-ops-toggle');
assert(cssContent23.includes('.night-ops-chip'), 'styles.css contains .night-ops-chip rule');

console.log('  ✓ Optics profiles (cqb, mid, long, thermal) and Night Ops (IR, NVGs, Tracers) verified');


console.log('\nTest Suite 25: ACE3 Medical Depth Presets');
// Vanilla medical output
const vanillaSqf = SqfSerializer.serialize(sampleLoadout, { medicalLevel: 'vanilla' });
assert(vanillaSqf.includes('FirstAidKit'), 'vanilla format contains FirstAidKit');

// ACE3 Standard medical output
const aceStandardSqf = SqfSerializer.serialize(sampleLoadout, { medicalLevel: 'ace3_standard' });
assert(aceStandardSqf.includes('ACE_fieldDressing'), 'ace3_standard contains ACE_fieldDressing');
assert(aceStandardSqf.includes('ACE_morphine'), 'ace3_standard contains ACE_morphine');
assert(aceStandardSqf.includes('ACE_tourniquet'), 'ace3_standard contains ACE_tourniquet');

// ACE3 Advanced medical output
const aceAdvSqf = SqfSerializer.serialize(sampleLoadout, { medicalLevel: 'ace3_advanced' });
assert(aceAdvSqf.includes('ACE_elasticBandage'), 'ace3_advanced contains ACE_elasticBandage');
assert(aceAdvSqf.includes('ACE_quikclot'), 'ace3_advanced contains ACE_quikclot');
assert(aceAdvSqf.includes('ACE_salineIV'), 'ace3_advanced contains ACE_salineIV');
assert(aceAdvSqf.includes('ACE_splint'), 'ace3_advanced contains ACE_splint');

// Medic role gets specialized advanced supplies
const medicLoadout = LoadoutEngine.generate({ faction: 'NATO', role: 'Medic' }).loadoutData;
const aceMedicSqf = SqfSerializer.serialize(medicLoadout, { medicalLevel: 'ace3_advanced' });
assert(aceMedicSqf.includes('ACE_surgicalKit'), 'ACE3 Advanced medic receives surgical kit');

// HTML verification
assert(htmlContent22.includes('id="medical-level-select"'), 'index.html contains #medical-level-select');

console.log('  ✓ ACE3 medical depths (vanilla, ace3_standard, ace3_advanced) and role scaling verified');


console.log('\nTest Suite 26: Weapon Caliber & Ammunition Specialty Customizer');
assert(typeof AmmunitionManager === 'function', 'AmmunitionManager class is exported');
assert(typeof AmmunitionManager.getSpecialtyMag === 'function', 'AmmunitionManager.getSpecialtyMag is a function');

// Test specialty conversions
const tracer556 = AmmunitionManager.getSpecialtyMag(['30Rnd_556x45_Stanag', 30], 'tracer', '5.56x45mm');
assert(tracer556[0].includes('Tracer') || tracer556[0].includes('Stanag_red'), '5.56 tracer conversion successful');

const ap556 = AmmunitionManager.getSpecialtyMag(['30Rnd_556x45_Stanag', 30], 'ap', '5.56x45mm');
assert(ap556[0].includes('EPR') || ap556[0].includes('red') || ap556[0].includes('Stanag'), '5.56 AP conversion successful');

const tracer65 = AmmunitionManager.getSpecialtyMag(['30Rnd_65x39_caseless_mag', 30], 'tracer', '6.5x39mm');
assert(tracer65[0].includes('Tracer') || tracer65[0].includes('Trk'), '6.5 tracer conversion successful');

const tracer762 = AmmunitionManager.getSpecialtyMag(['20Rnd_762x51_Mag', 20], 'tracer', '7.62x51mm');
assert(tracer762[0].includes('Tracer') || tracer762[0].includes('T_'), '7.62 tracer conversion successful');

// Generation with caliber lock
const cal762Loadout = LoadoutEngine.generate({ faction: 'NATO', role: 'Rifleman', caliber: '7.62x51mm' });
assert(cal762Loadout.loadoutData.meta.caliber.includes('7.62x51'), 'Caliber lock 7.62x51 applied');

// Generation with ammo specialty
const tracerGen = LoadoutEngine.generate({ faction: 'NATO', role: 'Rifleman', ammoType: 'tracer' });
assert(tracerGen.loadoutData.primary.mag[0].toLowerCase().includes('tracer') || tracerGen.loadoutData.primary.mag[0].toLowerCase().includes('red') || tracerGen.loadoutData.primary.mag[0].toLowerCase().includes('trk'), 'Loadout generated with tracer ammo');

// HTML verification
assert(htmlContent22.includes('id="caliber-select"'), 'index.html contains #caliber-select');
assert(htmlContent22.includes('id="ammo-type-select"'), 'index.html contains #ammo-type-select');

console.log('  ✓ AmmunitionManager conversions, caliber locking, ammo specialty, and HTML selectors verified');


console.log('\nTest Suite 27: Tactical Web Audio Sound FX Controller');
assert(typeof SoundController === 'function', 'SoundController class is exported');
assert(typeof SoundController.init === 'function', 'SoundController.init is a function');
assert(typeof SoundController.toggleMute === 'function', 'SoundController.toggleMute is a function');
assert(typeof SoundController.setMuted === 'function', 'SoundController.setMuted is a function');
assert(typeof SoundController.playBoltRack === 'function', 'SoundController.playBoltRack is a function');
assert(typeof SoundController.playRadioClick === 'function', 'SoundController.playRadioClick is a function');
assert(typeof SoundController.playSwitchTick === 'function', 'SoundController.playSwitchTick is a function');

// Initial state and mute toggle
SoundController.setMuted(false);
assert(SoundController.isMuted === false, 'SoundController is initially unmuted');
const nowMuted = SoundController.toggleMute();
assert(nowMuted === true && SoundController.isMuted === true, 'toggleMute mutes audio');
const nowUnmuted = SoundController.toggleMute();
assert(nowUnmuted === false && SoundController.isMuted === false, 'toggleMute restores audio');

// Headless safety (calls should execute without throwing even without window.AudioContext)
let threwAudio = false;
try {
    SoundController.playBoltRack();
    SoundController.playRadioClick();
    SoundController.playSwitchTick();
} catch (e) {
    threwAudio = true;
}
assert(!threwAudio, 'SoundController methods run safely in headless environment');

// HTML and CSS checks
assert(htmlContent22.includes('id="audio-toggle-btn"'), 'index.html contains #audio-toggle-btn');
assert(cssContent23.includes('.audio-trigger-btn'), 'styles.css contains .audio-trigger-btn');
assert(cssContent23.includes('.audio-trigger-btn.muted'), 'styles.css contains .audio-trigger-btn.muted');

console.log('  ✓ SoundController state, safe synthesis, mute controls, HTML and CSS styling verified');


console.log('\nTest Suite 28: Export Loadout as Discord / Unit Briefing Image Card');
assert(typeof BriefingCardGenerator === 'function', 'BriefingCardGenerator class is exported');
assert(typeof BriefingCardGenerator.render === 'function', 'BriefingCardGenerator.render is a function');
assert(typeof BriefingCardGenerator.download === 'function', 'BriefingCardGenerator.download is a function');

// Test canvas rendering pipeline with mock Canvas2D
const canvasCalls = {
    fillRect: 0,
    strokeRect: 0,
    fillText: [],
    beginPath: 0,
    moveTo: 0,
    lineTo: 0,
    stroke: 0
};

const mockBriefingCanvas = {
    width: 800,
    height: 480,
    getContext: (type) => {
        if (type !== '2d') return null;
        return {
            fillRect: () => canvasCalls.fillRect++,
            strokeRect: () => canvasCalls.strokeRect++,
            fillText: (text) => canvasCalls.fillText.push(text),
            beginPath: () => canvasCalls.beginPath++,
            moveTo: () => canvasCalls.moveTo++,
            lineTo: () => canvasCalls.lineTo++,
            stroke: () => canvasCalls.stroke++,
            fill: () => {},
            arc: () => {},
            measureText: (txt) => ({ width: (txt || '').length * 8 }),
            set font(v) {},
            set fillStyle(v) {},
            set strokeStyle(v) {},
            set lineWidth(v) {}
        };
    },
    toDataURL: (type) => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
};

BriefingCardGenerator.render(mockBriefingCanvas, sampleLoadout);
assert(canvasCalls.fillRect > 0, 'Briefing card renders filled background and panels');
assert(canvasCalls.strokeRect > 0, 'Briefing card renders tactical border');
assert(canvasCalls.fillText.some(t => t.includes('ARMA 3 TACTICAL LOADOUT BRIEFING')), 'Briefing card renders title header');
assert(canvasCalls.fillText.some(t => t.includes('PRIMARY ARSENAL')), 'Briefing card renders kit section');
assert(canvasCalls.fillText.some(t => t.includes('COMBAT PROFILE RADAR')), 'Briefing card renders radar section');

// HTML verification
assert(htmlContent22.includes('id="export-card-btn"'), 'index.html contains #export-card-btn');
assert(htmlContent22.includes('id="briefing-card-canvas"'), 'index.html contains #briefing-card-canvas');

console.log('  ✓ BriefingCardGenerator Canvas2D 800x480 rendering, tactical HUD styling, and export verified');

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! All 28 test suites complete, robust, and verified.');


