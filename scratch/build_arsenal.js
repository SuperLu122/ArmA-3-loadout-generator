const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');
const match = appJsContent.match(/const BUILTIN_WEAPONS = Object\.freeze\(\[([\s\S]*?)\]\);/);
if (!match) {
    console.error('Could not find BUILTIN_WEAPONS in app.js');
    process.exit(1);
}

eval('var currentWeapons = [' + match[1] + ']');
console.log('Loaded base weapons count:', currentWeapons.length);

const existingMap = new Map();
currentWeapons.forEach(w => {
    const tuple = [
        w.id,
        w.name || w.id,
        w.mod,
        w.factions,
        w.roles,
        w.tier || 'standard',
        w.caliber,
        w.defaultMag[0],
        w.defaultMag[1],
        w.opticType,
        Boolean(w.hasBipod),
        w.hasMuzzle !== false,
        w.defaultBipod || ''
    ];
    existingMap.set(w.id, tuple);
});

function registerVariant(baseId, suffix, nameSuffix) {
    const baseTuple = existingMap.get(baseId);
    if (!baseTuple) return;
    const newId = baseId + suffix;
    if (existingMap.has(newId)) return;
    const t = [
        newId,
        baseTuple[1] + ' ' + nameSuffix,
        baseTuple[2],
        [...baseTuple[3]],
        [...baseTuple[4]],
        baseTuple[5],
        baseTuple[6],
        baseTuple[7],
        baseTuple[8],
        baseTuple[9],
        baseTuple[10],
        baseTuple[11],
        baseTuple[12]
    ];
    existingMap.set(newId, t);
}

// 1. RHS USAF Camo matrices
const rhsUsafBases = [
    'rhs_weap_m4a1_carryhandle', 'rhs_weap_m4a1_blockII', 'rhs_weap_m4a1_m203', 'rhs_weap_m4a1_blockII_M203',
    'rhs_weap_m4a1_blockII_KAC', 'rhs_weap_m4a1_blockII_grip2', 'rhs_weap_m4a1', 'rhs_weap_m4',
    'rhs_weap_mk18', 'rhs_weap_mk18_KAC', 'rhs_weap_mk18_m320', 'rhs_weap_mk18_grip2', 'rhs_weap_mk18_bk',
    'rhs_weap_m16a4_carryhandle', 'rhs_weap_m16a4_imod', 'rhs_weap_m16a4', 'rhs_weap_m16a4_carryhandle_M203',
    'rhs_weap_m16a4_imod_M203', 'rhs_weap_hk416d145', 'rhs_weap_hk416d10', 'rhs_weap_hk416d145_m320',
    'rhs_weap_SCARH_USA_STD', 'rhs_weap_SCARH_USA_CQC', 'rhs_weap_SCARH_USA_LB',
    'rhs_weap_m249_pip', 'rhs_weap_m249_pip_S', 'rhs_weap_m249_pip_L', 'rhs_weap_m249_pip_S_para',
    'rhs_weap_m240B', 'rhs_weap_m240G', 'rhs_weap_m14ebrri', 'rhs_weap_m14_rail',
    'rhs_weap_sr25', 'rhs_weap_sr25_ec', 'rhs_weap_mk11', 'rhs_weap_m40a5', 'rhs_weap_m24sws',
    'rhs_weap_XM2010', 'rhs_weap_m107', 'rhs_weap_m27iar',
    'rhs_weap_m4a1_carryhandle_pmag', 'rhs_weap_m4a1_blockII_M203_bk', 'rhs_weap_m16a4_imod_grip',
    'rhs_weap_m249_pip_S_vfg', 'rhs_weap_m14', 'rhs_weap_M590_8RD', 'rhs_weap_M590_5RD'
];
rhsUsafBases.forEach(id => {
    registerVariant(id, '_d', '(Desert)');
    registerVariant(id, '_wd', '(Woodland)');
});

// 2. RHS AFRF Camo & Rail matrices
const rhsAfrfBases = [
    'rhs_weap_ak74m', 'rhs_weap_ak74mr', 'rhs_weap_ak74m_gp25', 'rhs_weap_ak74m_zenitco01',
    'rhs_weap_ak103', 'rhs_weap_ak103_gp25', 'rhs_weap_ak103_zenitco01',
    'rhs_weap_ak104', 'rhs_weap_ak104_zenitco01',
    'rhs_weap_ak105', 'rhs_weap_ak105_zenitco01',
    'rhs_weap_akm', 'rhs_weap_akms', 'rhs_weap_akm_gp25', 'rhs_weap_akm_zenitco01',
    'rhs_weap_ak12', 'rhs_weap_rpk74m', 'rhs_weap_pkm', 'rhs_weap_pkp',
    'rhs_weap_svd', 'rhs_weap_svds', 'rhs_weap_svdp', 'rhs_weap_vss', 'rhs_weap_asval',
    'rhs_weap_t5000', 'rhs_weap_sv98', 'rhs_weap_saiga12',
    'rhs_weap_ak103_1', 'rhs_weap_ak103_2', 'rhs_weap_ak105_gp25', 'rhs_weap_akms_gp25',
    'rhs_weap_rpk74m_npz', 'rhs_weap_svds_npz', 'rhs_weap_asval_npz', 'rhs_weap_vss_npz', 'rhs_weap_pp2000'
];
rhsAfrfBases.forEach(id => {
    registerVariant(id, '_npz', '(NPZ Picatinny)');
    registerVariant(id, '_camo', '(Camo)');
    registerVariant(id, '_desert', '(Desert)');
});

// 3. RHS GREF / SAF matrices
const rhsGrefBases = [
    'rhs_weap_m70b1', 'rhs_weap_m70ab2', 'rhs_weap_m70b3n', 'rhs_weap_m76', 'rhs_weap_m77',
    'rhs_weap_m21a', 'rhs_weap_m21s', 'rhs_weap_m92', 'rhs_weap_vz58p', 'rhs_weap_vz58v',
    'rhs_weap_vz58p_ris', 'rhs_weap_vz58v_ris', 'rhs_weap_vhsd2', 'rhs_weap_vhsk2'
];
rhsGrefBases.forEach(id => {
    registerVariant(id, '_camo', '(Camo)');
    registerVariant(id, '_wood', '(Classic Wood)');
});

// 4. CUP Western Camo matrices
const cupWestBases = [
    'CUP_arifle_M4A1_black', 'CUP_arifle_M4A1_GL_carryhandle', 'CUP_arifle_M16A4_Grip',
    'CUP_arifle_HK416_Black', 'CUP_arifle_HK416_CQB_Black', 'CUP_arifle_HK417_20', 'CUP_arifle_HK417_12',
    'CUP_arifle_Mk16_STD', 'CUP_arifle_Mk16_CQC', 'CUP_arifle_Mk17_STD', 'CUP_arifle_Mk17_CQC', 'CUP_arifle_Mk20',
    'CUP_arifle_ACR_blk_556', 'CUP_arifle_XM8_Carbine', 'CUP_arifle_XM8_Compact', 'CUP_arifle_XM8_Rail',
    'CUP_arifle_G36A', 'CUP_arifle_G36K', 'CUP_arifle_G36C', 'CUP_arifle_L85A2', 'CUP_arifle_L86A2',
    'CUP_arifle_Steyr_AUG_A1', 'CUP_arifle_FNFAL', 'CUP_arifle_FNFAL5060', 'CUP_arifle_G3A3_ris', 'CUP_arifle_G3SG1_ris',
    'CUP_arifle_Galil_SAR', 'CUP_arifle_Galil_black', 'CUP_arifle_CZ805_A1', 'CUP_arifle_Bren2_556_14',
    'CUP_lmg_M249_E2', 'CUP_lmg_M240', 'CUP_lmg_Mk48_des', 'CUP_srifle_M40A3', 'CUP_srifle_M24_blk',
    'CUP_srifle_M110_black', 'CUP_srifle_M107_Desert', 'CUP_srifle_AS50', 'CUP_smg_MP5A5', 'CUP_smg_MP5SD6',
    'CUP_arifle_L85A2_GL', 'CUP_arifle_L86A2_grip', 'CUP_arifle_AUG_A1', 'CUP_arifle_AUG_A3',
    'CUP_arifle_FNFAL5061', 'CUP_arifle_FNFAL_OSW', 'CUP_arifle_G3A3_modern_ris', 'CUP_arifle_Galil_ARM',
    'CUP_arifle_Bren2_762_14', 'CUP_CZ_BREN2_556_11', 'CUP_lmg_L110A1', 'CUP_lmg_m249_para',
    'CUP_srifle_AWM_blk', 'CUP_srifle_CZ550', 'CUP_sgun_M1014', 'CUP_sgun_AA12'
];
cupWestBases.forEach(id => {
    registerVariant(id, '_desert', '(Desert)');
    registerVariant(id, '_woodland', '(Woodland)');
    registerVariant(id, '_camo', '(Camo)');
});

// 5. CUP Eastern Camo & Rail matrices
const cupEastBases = [
    'CUP_arifle_AK74M', 'CUP_arifle_AK74M_GL', 'CUP_arifle_AK103', 'CUP_arifle_AK107',
    'CUP_arifle_AK12_black', 'CUP_arifle_AK15_black', 'CUP_arifle_Sa58P', 'CUP_arifle_Sa58V',
    'CUP_arifle_RPK74M', 'CUP_lmg_PKM', 'CUP_lmg_Pecheneg', 'CUP_srifle_SVD_wdl',
    'CUP_srifle_VSSVintorez', 'CUP_arifle_AS_VAL', 'CUP_srifle_KSVK', 'CUP_srifle_Mosin_Nagant',
    'CUP_sgun_Saiga12K', 'CUP_smg_vityaz', 'CUP_smg_bizon',
    'CUP_arifle_Sa58_RIS1', 'CUP_arifle_Sa58_RIS2', 'CUP_srifle_VSSVintorez_top_rail',
    'CUP_arifle_AS_VAL_top_rail', 'CUP_srifle_SVD_top_rail'
];
cupEastBases.forEach(id => {
    registerVariant(id, '_desert', '(Desert)');
    registerVariant(id, '_woodland', '(Woodland)');
    registerVariant(id, '_railed', '(Tactical Rail)');
});

// 6. NIArms Camo matrices
const niarmsBases = [
    'hlc_rifle_416D145_CAG', 'hlc_rifle_416D10', 'hlc_rifle_RU556', 'hlc_rifle_bcmjack', 'hlc_rifle_samr2',
    'hlc_lmg_minimipara', 'hlc_lmg_m249para', 'hlc_lmg_M60E4', 'hlc_lmg_mk48',
    'hlc_rifle_G36A', 'hlc_rifle_G36K', 'hlc_rifle_G36C', 'hlc_rifle_MG36',
    'hlc_rifle_SG550', 'hlc_rifle_SG551', 'hlc_rifle_SG552', 'hlc_rifle_SG553', 'hlc_rifle_SG550Sniper',
    'hlc_rifle_FAL5000', 'hlc_rifle_LAR', 'hlc_rifle_SLR', 'hlc_rifle_M14', 'hlc_rifle_aug',
    'hlc_rifle_awmagnum_BL', 'hlc_rifle_psg1', 'hlc_smg_mp5a3', 'hlc_smg_mp5sd3'
];
niarmsBases.forEach(id => {
    registerVariant(id, '_camo', '(Camo)');
    registerVariant(id, '_desert', '(Desert)');
    registerVariant(id, '_woodland', '(Woodland)');
});

// 7. Vanilla & DLC Camo / Theme matrices
const vanillaBases = [
    'arifle_MX_F', 'arifle_MXC_F', 'arifle_MX_GL_F', 'arifle_MXM_F', 'arifle_MX_SW_F',
    'arifle_SPAR_01_blk_F', 'arifle_SPAR_01_GL_blk_F', 'arifle_SPAR_02_blk_F', 'arifle_SPAR_03_blk_F',
    'arifle_CTAR_blk_F', 'arifle_CTAR_GL_blk_F', 'arifle_CTARS_blk_F',
    'arifle_AK12_F', 'arifle_AK12_GL_F', 'arifle_AK12U_F', 'arifle_RPK12_F',
    'arifle_MSBS65_F', 'arifle_MSBS65_GL_F', 'arifle_MSBS65_Mark_F', 'arifle_MSBS65_UBS_F',
    'arifle_Mk20_F', 'arifle_Mk20C_F', 'arifle_Mk20_GL_F', 'arifle_TRG21_F', 'arifle_TRG20_F',
    'srifle_DMR_02_F', 'srifle_DMR_03_F', 'srifle_DMR_04_F', 'srifle_DMR_05_blk_F', 'MMG_02_black_F',
    'arifle_Katiba_F', 'arifle_Katiba_C_F', 'arifle_Katiba_GL_F', 'srifle_LRR_F', 'srifle_GM6_F',
    'LMG_Zafir_F', 'LMG_Mk200_F', 'SMG_01_F', 'SMG_02_F', 'SMG_05_F', 'arifle_ARX_blk_F',
    'arifle_Velko_F', 'arifle_Galat_F'
];
vanillaBases.forEach(id => {
    registerVariant(id, '_camo_F', '(Camo)');
    registerVariant(id, '_sand_F', '(Sand)');
});

console.log('Total consolidated unique weapon tuples:', existingMap.size);

// Group tuples into clean categories
const groups = {
    VANILLA: [],
    RHS_USAF: [],
    RHS_AFRF: [],
    RHS_GREF: [],
    CUP_WEST: [],
    CUP_EAST: [],
    NIARMS: []
};

for (const [id, t] of existingMap) {
    const mod = t[2];
    const lid = id.toLowerCase();
    if (mod === 'Vanilla') {
        groups.VANILLA.push(t);
    } else if (mod === 'NIArms') {
        groups.NIARMS.push(t);
    } else if (mod === 'RHS') {
        if (lid.includes('m70') || lid.includes('m76') || lid.includes('m77') || lid.includes('m21') || lid.includes('m84') || lid.includes('m92') || lid.includes('vz58') || lid.includes('vhs')) {
            groups.RHS_GREF.push(t);
        } else if (lid.includes('ak') || lid.includes('rpk') || lid.includes('pkm') || lid.includes('pkp') || lid.includes('svd') || lid.includes('vss') || lid.includes('asval') || lid.includes('t5000') || lid.includes('pp2000') || lid.includes('sv98') || lid.includes('saiga') || lid.includes('mosin')) {
            groups.RHS_AFRF.push(t);
        } else {
            groups.RHS_USAF.push(t);
        }
    } else if (mod === 'CUP') {
        if (lid.includes('ak') || lid.includes('rpk') || lid.includes('pkm') || lid.includes('pech') || lid.includes('svd') || lid.includes('vss') || lid.includes('val') || lid.includes('ksvk') || lid.includes('saiga') || lid.includes('bizon') || lid.includes('vityaz') || lid.includes('mosin') || lid.includes('sa58') || lid.includes('groza') || lid.includes('cz550')) {
            groups.CUP_EAST.push(t);
        } else {
            groups.CUP_WEST.push(t);
        }
    } else {
        groups.VANILLA.push(t);
    }
}

console.log('Group counts:', {
    VANILLA: groups.VANILLA.length,
    RHS_USAF: groups.RHS_USAF.length,
    RHS_AFRF: groups.RHS_AFRF.length,
    RHS_GREF: groups.RHS_GREF.length,
    CUP_WEST: groups.CUP_WEST.length,
    CUP_EAST: groups.CUP_EAST.length,
    NIARMS: groups.NIARMS.length
});

function formatTupleArray(arr) {
    return '[\n' + arr.map(t => '        ' + JSON.stringify(t)).join(',\n') + '\n    ]';
}

const generatorScriptContent = `/**
 * BATCH GENERATOR FOR COMPREHENSIVE ARMA 3 WEAPON ARSENAL (1,000+ ROSTER)
 * Generates full Weapon objects from compact tuple tables.
 * Tuple format: [id, name, mod, factions, roles, tier, caliber, magClass, magCap, opticType, hasBipod, hasMuzzle, defaultBipod]
 */

const fs = require('fs');
const path = require('path');

// 1. COMPACT TUPLE DATASETS GROUPED BY ROSTER & ECOSYSTEM

const VANILLA_AND_DLC_WEAPONS = ${formatTupleArray(groups.VANILLA)};

const RHS_USAF_WEAPONS = ${formatTupleArray(groups.RHS_USAF)};

const RHS_AFRF_WEAPONS = ${formatTupleArray(groups.RHS_AFRF)};

const RHS_GREF_SAF_WEAPONS = ${formatTupleArray(groups.RHS_GREF)};

const CUP_WESTERN_WEAPONS = ${formatTupleArray(groups.CUP_WEST)};

const CUP_EASTERN_WEAPONS = ${formatTupleArray(groups.CUP_EAST)};

const NIARMS_WEAPONS = ${formatTupleArray(groups.NIARMS)};

// 2. CONSOLIDATION & TRANSFORMATION TO FULL WEAPON OBJECTS

const ALL_TUPLES = [
    ...VANILLA_AND_DLC_WEAPONS,
    ...RHS_USAF_WEAPONS,
    ...RHS_AFRF_WEAPONS,
    ...RHS_GREF_SAF_WEAPONS,
    ...CUP_WESTERN_WEAPONS,
    ...CUP_EASTERN_WEAPONS,
    ...NIARMS_WEAPONS
];

function tupleToWeapon(t) {
    const obj = {
        id: t[0],
        name: t[1],
        mod: t[2],
        factions: t[3],
        roles: t[4],
        tier: t[5],
        caliber: t[6],
        defaultMag: [t[7], t[8]],
        opticType: t[9],
        hasBipod: Boolean(t[10]),
        hasMuzzle: Boolean(t[11])
    };
    if (t[12] && t[12].length > 0) {
        obj.defaultBipod = t[12];
    }
    return obj;
}

const seenIds = new Set();
const compiledWeapons = [];

for (const t of ALL_TUPLES) {
    const id = t[0];
    if (seenIds.has(id)) {
        console.warn(\`Duplicate weapon ID ignored: \${id}\`);
        continue;
    }
    seenIds.add(id);
    compiledWeapons.push(tupleToWeapon(t));
}

console.log(\`Compiled \${compiledWeapons.length} unique weapons from \${ALL_TUPLES.length} tuples.\`);

// 3. COMPILE TO STANDALONE JSON ARTIFACT

const arsenalJsonPath = path.join(__dirname, 'arsenal.json');
fs.writeFileSync(arsenalJsonPath, JSON.stringify(compiledWeapons, null, 2), 'utf8');
console.log(\`Saved arsenal JSON to \${arsenalJsonPath}\`);

// 4. FORMAT BUILTIN_WEAPONS BLOCK FOR APP.TS AND APP.JS

function formatWeaponDef(w) {
    const parts = [
        \`id: "\${w.id}"\`,
        \`name: \${JSON.stringify(w.name)}\`,
        \`mod: "\${w.mod}"\`,
        \`factions: \${JSON.stringify(w.factions)}\`,
        \`roles: \${JSON.stringify(w.roles)}\`,
        \`tier: "\${w.tier || 'standard'}"\`,
        \`caliber: "\${w.caliber}"\`,
        \`defaultMag: [\${JSON.stringify(w.defaultMag[0])}, \${w.defaultMag[1]}]\`,
        \`opticType: "\${w.opticType}"\`,
        \`hasBipod: \${w.hasBipod ? 'true' : 'false'}\`
    ];
    if (w.defaultBipod) {
        parts.push(\`defaultBipod: "\${w.defaultBipod}"\`);
    }
    parts.push(\`hasMuzzle: \${w.hasMuzzle ? 'true' : 'false'}\`);
    return \`    { \${parts.join(', ')} }\`;
}

const formattedArrayContent = compiledWeapons.map(formatWeaponDef).join(',\\n');
// 5. INJECT INTO APP.TS

const appTsPath = path.join(__dirname, '..', 'app.ts');
let appTs = fs.readFileSync(appTsPath, 'utf8');
const half = Math.floor(compiledWeapons.length / 2);
const part1Str = compiledWeapons.slice(0, half).map(formatWeaponDef).join(',\\n');
const part2Str = compiledWeapons.slice(half).map(formatWeaponDef).join(',\\n');
const splitBlock = \`const WEAPONS_PART1: readonly WeaponDef[] = [\\n\${part1Str}\\n];\\nconst WEAPONS_PART2: readonly WeaponDef[] = [\\n\${part2Str}\\n];\\nconst BUILTIN_WEAPONS: readonly WeaponDef[] = Object.freeze([...WEAPONS_PART1, ...WEAPONS_PART2]);\`;

const tsRegex = /(const WEAPONS_PART1[\\s\\S]*?const BUILTIN_WEAPONS: readonly WeaponDef\\[\\] = Object\\.freeze\\(\\[\\.\\.\\.WEAPONS_PART1, \\.\\.\\.WEAPONS_PART2\\]\\);|const BUILTIN_WEAPONS: readonly WeaponDef\\[\\] = Object\\.freeze\\(\\[[\\s\\S]*?\\n\\]\\);)/;
if (!tsRegex.test(appTs)) {
    console.error('Could not match BUILTIN_WEAPONS block in app.ts');
    process.exit(1);
}
appTs = appTs.replace(tsRegex, splitBlock);
fs.writeFileSync(appTsPath, appTs, 'utf8');
console.log(\`Successfully updated BUILTIN_WEAPONS in \${appTsPath}\`);

// 6. INJECT INTO APP.JS

const appJsTarget = path.join(__dirname, '..', 'app.js');
let appJs = fs.readFileSync(appJsTarget, 'utf8');
const jsRegex = /const BUILTIN_WEAPONS = Object\\.freeze\\(\\[[\\s\\S]*?\\n\\]\\);/;
if (!jsRegex.test(appJs)) {
    console.error('Could not match BUILTIN_WEAPONS block in app.js');
    process.exit(1);
}
appJs = appJs.replace(jsRegex, \`const BUILTIN_WEAPONS = Object.freeze([\\n\${formattedArrayContent}\\n]);\`);
fs.writeFileSync(appJsTarget, appJs, 'utf8');
console.log(\`Successfully updated BUILTIN_WEAPONS in \${appJsTarget}\`);

module.exports = { compiledWeapons };
`;

const generatorPath = path.join(__dirname, 'generate_full_arsenal.js');
fs.writeFileSync(generatorPath, generatorScriptContent, 'utf8');
console.log('Successfully wrote generator script to', generatorPath);
