"use strict";
// ============================================================================
// ARMA 3 SMART LOADOUT GENERATOR & MOD REGISTRY ENGINE
// Clean Architecture, High-Performance Indexing & Safe Serialization
// ============================================================================
const VALID_FACTIONS = ["NATO", "CSAT", "AAF", "FIA"];
const VALID_ROLES = ["Rifleman", "Medic", "Marksman", "Anti-Tank", "Machine Gunner", "Sniper", "Pilot", "Pointman"];
const VALID_MODS = ["Vanilla", "RHS", "CUP", "NIArms", "Custom"];
const VALID_CALIBERS = [
    "5.56x45", "5.45x39", "7.62x39", "7.62x51", "7.62x54",
    "6.5x39", "5.8x42", "9x21", ".45ACP", "4.6x30", ".300WM",
    ".338", "9.3x64", ".408", "12.7x108", ".50BMG", "12Gauge", "Rocket"
];
const VALID_OPTIC_PROFILES = ["cqb", "mid", "long"];
function isValidCaliber(cal) {
    return VALID_CALIBERS.includes(cal);
}
function isValidOpticProfile(opt) {
    return VALID_OPTIC_PROFILES.includes(opt);
}
function isValidFaction(faction) {
    return VALID_FACTIONS.includes(faction);
}
function isValidRole(role) {
    return VALID_ROLES.includes(role);
}
// ----------------------------------------------------------------------------
// 2. Static Equipment Registries
// ----------------------------------------------------------------------------
const BUILTIN_WEAPONS = Object.freeze([
    { id: "arifle_MX_F", name: "MX 6.5mm", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_F.png" },
    { id: "arifle_MXC_F", name: "MXC 6.5mm Carbine", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXC_F.png" },
    { id: "arifle_MX_Black_F", name: "MX Black 6.5mm", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_Black_F.png" },
    { id: "arifle_MX_GL_F", name: "MX 3GL 6.5mm", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_GL_F.png" },
    { id: "arifle_SPAR_01_blk_F", name: "SPAR-16 5.56mm", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_01_blk_F.png" },
    { id: "arifle_SPAR_01_GL_blk_F", name: "SPAR-16 GL 5.56mm", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_01_GL_blk_F.png" },
    { id: "arifle_SDAR_F", name: "SDAR 5.56mm Dual-Env", mod: "Vanilla", factions: ["NATO","CSAT","AAF","FIA"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/arifle_SDAR_F.png" },
    { id: "arifle_MXM_F", name: "MXM 6.5mm", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXM_F.png" },
    { id: "arifle_MXM_Black_F", name: "MXM Black 6.5mm", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXM_Black_F.png" },
    { id: "arifle_SPAR_03_blk_F", name: "SPAR-17 7.62mm DMR", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_03_blk_F.png" },
    { id: "srifle_DMR_03_F", name: "Mk-I EMR 7.62mm", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_03_F.png" },
    { id: "srifle_DMR_02_F", name: "MAR-10 .338 Magnum", mod: "Vanilla", factions: ["NATO"], roles: ["Sniper","Marksman"], tier: "specops", caliber: ".338", defaultMag: ["10Rnd_338_Mag", 10], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_02_F.png" },
    { id: "srifle_LRR_F", name: "M200 Intervention (.408)", mod: "Vanilla", factions: ["NATO","FIA"], roles: ["Sniper"], tier: "standard", caliber: ".408", defaultMag: ["7Rnd_408_Mag", 7], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_LRR_F.png" },
    { id: "srifle_LRR_camo_F", name: "M200 Intervention Camo", mod: "Vanilla", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".408", defaultMag: ["7Rnd_408_Mag", 7], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_LRR_camo_F.png" },
    { id: "arifle_MX_SW_F", name: "MX SW 6.5mm", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "6.5x39", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_SW_F.png" },
    { id: "arifle_MX_SW_Black_F", name: "MX SW Black 6.5mm", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "6.5x39", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_SW_Black_F.png" },
    { id: "arifle_SPAR_02_blk_F", name: "SPAR-16S 5.56mm LMG", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["150Rnd_556x45_Drum_Mag_F", 150], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_02_blk_F.png" },
    { id: "MMG_02_black_F", name: "SPMG .338 Heavy MMG", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: ".338", defaultMag: ["130Rnd_338_Mag", 130], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/MMG_02_black_F.png" },
    { id: "SMG_01_F", name: "Vermin .45 ACP (Vector)", mod: "Vanilla", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "standard", caliber: ".45ACP", defaultMag: ["30Rnd_45ACP_Mag_SMG_01", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_01_F.png" },
    { id: "SMG_03_black", name: "ADR-97 5.7mm (P90)", mod: "Vanilla", factions: ["NATO"], roles: ["Pilot"], tier: "specops", caliber: "9x21", defaultMag: ["50Rnd_570x28_SMG_03", 50], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_03_black.png" },
    { id: "SMG_05_F", name: "Protector 9mm (MP5)", mod: "Vanilla", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_05_F.png" },
    { id: "arifle_Katiba_F", name: "Katiba 6.5mm", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_F.png" },
    { id: "arifle_Katiba_C_F", name: "Katiba Carbine 6.5mm", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_C_F.png" },
    { id: "arifle_Katiba_GL_F", name: "Katiba GL 6.5mm", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_GL_F.png" },
    { id: "arifle_CTAR_blk_F", name: "CAR-95 5.8mm Bullpup", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_580x42_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTAR_blk_F.png" },
    { id: "arifle_CTAR_GL_blk_F", name: "CAR-95 GL 5.8mm", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_580x42_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTAR_GL_blk_F.png" },
    { id: "arifle_AK12_F", name: "AK-12 7.62mm Modern", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12_F.png" },
    { id: "arifle_AK12_lush_F", name: "AK-12 Lush Camo (Contact)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12_lush_F.png" },
    { id: "arifle_AK12_arid_F", name: "AK-12 Arid Camo (Contact)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12_arid_F.png" },
    { id: "arifle_AK12_GL_F", name: "AK-12 GP-25 GL", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12_GL_F.png" },
    { id: "arifle_AK12U_F", name: "AK-12U 7.62mm Carbine", mod: "Vanilla", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12U_F.png" },
    { id: "arifle_ARX_blk_F", name: "Type 115 6.5mm / .50 Cal", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_ARX_blk_F.png" },
    { id: "srifle_DMR_01_F", name: "Rahim 7.62mm", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["10Rnd_762x54_Mag", 10], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_01_F.png" },
    { id: "srifle_DMR_01_tan_F", name: "Rahim 7.62mm Tan", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["10Rnd_762x54_Mag", 10], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_01_tan_F.png" },
    { id: "srifle_DMR_07_blk_F", name: "CMR-76 6.5mm DMR", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "6.5x39", defaultMag: ["20Rnd_650x39_CBR_mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_07_blk_F.png" },
    { id: "srifle_DMR_05_blk_F", name: "Cyrus 9.3mm Heavy DMR", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x54", defaultMag: ["10Rnd_93x64_DMR_05_Mag", 10], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_05_blk_F.png" },
    { id: "srifle_DMR_04_F", name: "ASP-1 Kir 12.7mm Suppressed", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["10Rnd_127x54_Mag", 10], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_DMR_04_F.png" },
    { id: "srifle_DMR_04_Tan_F", name: "ASP-1 Kir 12.7mm Tan", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["10Rnd_127x54_Mag", 10], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_DMR_04_Tan_F.png" },
    { id: "srifle_GM6_F", name: "GM6 Lynx 12.7mm", mod: "Vanilla", factions: ["CSAT"], roles: ["Sniper"], tier: "standard", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_GM6_F.png" },
    { id: "LMG_Zafir_F", name: "Zafir 7.62mm", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["150Rnd_762x54_Box", 150], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_Zafir_F.png" },
    { id: "arifle_CTARS_blk_F", name: "CAR-95-1 5.8mm LMG", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["100Rnd_580x42_Mag_F", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTARS_blk_F.png" },
    { id: "MMG_01_hex_F", name: "Navid 9.3mm Heavy MMG", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["150Rnd_93x64_Mag", 150], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/MMG_01_hex_F.png" },
    { id: "SMG_02_F", name: "Sting 9mm", mod: "Vanilla", factions: ["CSAT","AAF"], roles: ["Pilot"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_02_F.png" },
    { id: "arifle_Mk20_F", name: "Mk20 5.56mm", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20_F.png" },
    { id: "arifle_Mk20C_F", name: "Mk20C Carbine", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20C_F.png" },
    { id: "arifle_Mk20_GL_F", name: "Mk20 EGLM 5.56mm", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20_GL_F.png" },
    { id: "arifle_MSBS65_F", name: "Promet 6.5mm Modular", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_F.png" },
    { id: "arifle_MSBS65_GL_F", name: "Promet GL 6.5mm", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_GL_F.png" },
    { id: "arifle_MSBS65_UBS_F", name: "Promet UBS (Shotgun)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_UBS_F.png" },
    { id: "arifle_MSBS65_UBS_black_F", name: "Promet UBS Black", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_UBS_black_F.png" },
    { id: "srifle_EBR_F", name: "Mk14 EBR 7.62mm", mod: "Vanilla", factions: ["AAF"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_EBR_F.png" },
    { id: "srifle_DMR_06_olive_F", name: "Mk14 Olive 7.62mm", mod: "Vanilla", factions: ["AAF"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_06_olive_F.png" },
    { id: "arifle_MSBS65_Mark_F", name: "Promet DMR 6.5mm", mod: "Vanilla", factions: ["AAF"], roles: ["Marksman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_Mark_F.png" },
    { id: "srifle_GM6_ghex_F", name: "GM6 Lynx GHEX", mod: "Vanilla", factions: ["AAF"], roles: ["Sniper"], tier: "standard", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_GM6_ghex_F.png" },
    { id: "LMG_Mk200_F", name: "Mk200 6.5mm", mod: "Vanilla", factions: ["AAF","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "6.5x39", defaultMag: ["200Rnd_65x39_cased_Box", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_Mk200_F.png" },
    { id: "LMG_Mk200_black_F", name: "Mk200 Black 6.5mm", mod: "Vanilla", factions: ["AAF"], roles: ["Machine Gunner"], tier: "specops", caliber: "6.5x39", defaultMag: ["200Rnd_65x39_cased_Box", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_Mk200_black_F.png" },
    { id: "LMG_03_F", name: "LIM-85 5.56mm SAW", mod: "Vanilla", factions: ["AAF","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["200Rnd_556x45_Box_F", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_03_F.png" },
    { id: "arifle_TRG21_F", name: "TRG-21 5.56mm", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_TRG21_F.png" },
    { id: "arifle_TRG20_F", name: "TRG-20 Carbine", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_TRG20_F.png" },
    { id: "arifle_TRG21_GL_F", name: "TRG-21 EGLM 5.56mm", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_TRG21_GL_F.png" },
    { id: "arifle_AKM_F", name: "AKM 7.62x39mm Classic", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AKM_F.png" },
    { id: "arifle_AKS_F", name: "AKS-74U Guerilla", mod: "Vanilla", factions: ["FIA"], roles: ["Medic","Pilot","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AKS_F.png" },
    { id: "sgun_HunterShotgun_01_F", name: "Kozlice 12G Shotgun", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Medic"], tier: "militia", caliber: "12Gauge", defaultMag: ["2Rnd_12Gauge_Pellets", 2], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/sgun_HunterShotgun_01_F.png" },
    { id: "sgun_HunterShotgun_01_sawedoff_F", name: "Sawed-Off Kozlice 12G", mod: "Vanilla", factions: ["FIA"], roles: ["Medic","Pilot"], tier: "militia", caliber: "12Gauge", defaultMag: ["2Rnd_12Gauge_Pellets", 2], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/sgun_HunterShotgun_01_sawedoff_F.png" },
    { id: "srifle_DMR_06_camo_F", name: "Mk14 Classic Camo", mod: "Vanilla", factions: ["FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_06_camo_F.png" },
    { id: "srifle_DMR_06_hunter_F", name: "Mk14 Hunting Camo", mod: "Vanilla", factions: ["FIA"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_06_hunter_F.png" },
    { id: "srifle_DMR_06_F", name: "Mk14 EBR Classic Wood", mod: "Vanilla", factions: ["FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_06_F.png" },
    { id: "MMG_01_tan_F", name: "Navid 9.3mm Heavy MMG", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "9.3x64", defaultMag: ["150Rnd_93x64_Mag", 150], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/MMG_01_tan_F.png" },
    { id: "arifle_RPK12_F", name: "RPK-12 7.62mm LMG", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x39", defaultMag: ["75Rnd_762x39_Mag_F", 75], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_RPK12_F.png" },
    { id: "arifle_AK15_F", name: "AK-15 7.62mm Russian", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK15_F.png" },
    { id: "arifle_AK15_GL_F", name: "AK-15 7.62mm GL", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK15_GL_F.png" },
    { id: "arifle_Velko_F", name: "Velko R4 5.56mm", mod: "Vanilla", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Velko_F.png" },
    { id: "arifle_SLR_F", name: "SLR 7.62mm Battle Rifle", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SLR_F.png" },
    { id: "arifle_MX_GL_Black_F", name: "MX 3GL Black 6.5mm", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_GL_Black_F.png" },
    { id: "arifle_Mk20_plain_F", name: "Mk20 5.56mm Plain", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20_plain_F.png" },
    { id: "arifle_Mk20C_plain_F", name: "Mk20C 5.56mm Carbine Plain", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20C_plain_F.png" },
    { id: "arifle_Mk20_GL_plain_F", name: "Mk20 EGLM 5.56mm Plain", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20_GL_plain_F.png" },
    { id: "arifle_VelkoR5_F", name: "Velko R5 Carbine 5.56mm", mod: "Vanilla", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_VelkoR5_F.png" },
    { id: "arifle_VelkoR5_GL_F", name: "Velko R5 GL 5.56mm", mod: "Vanilla", factions: ["FIA","AAF"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_VelkoR5_GL_F.png" },
    { id: "arifle_SLR_GL_F", name: "SLR GL 7.62mm Battle Rifle", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SLR_GL_F.png" },
    { id: "arifle_SLR_DMR_F", name: "SLR Marksman 7.62mm", mod: "Vanilla", factions: ["FIA"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SLR_DMR_F.png" },
    { id: "arifle_XMS_Base_F", name: "XMS 5.56mm Assault Rifle", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_XMS_Base_F.png" },
    { id: "arifle_XMS_GL_Base_F", name: "XMS GL 5.56mm Rifle", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_XMS_GL_Base_F.png" },
    { id: "arifle_XMS_M_Base_F", name: "XMS Marksman 5.56mm", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_XMS_M_Base_F.png" },
    { id: "arifle_XMS_SG_Base_F", name: "XMS SG Masterkey Shotgun", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_XMS_SG_Base_F.png" },
    { id: "LMG_S77_Desert_F", name: "SA-77 7.62mm GPMG Desert", mod: "Vanilla", factions: ["FIA","AAF"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_S77_Desert_F.png" },
    { id: "LMG_S77_Compact_Desert_F", name: "SA-77 Compact 7.62mm SAW", mod: "Vanilla", factions: ["FIA","AAF"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_S77_Compact_Desert_F.png" },
    { id: "SMG_03C_black", name: "ADR-97C Compact 5.7mm", mod: "Vanilla", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["50Rnd_570x28_SMG_03", 50], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_03C_black.png" },
    { id: "srifle_GM6_camo_F", name: "GM6 Lynx 12.7mm Camo", mod: "Vanilla", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_GM6_camo_F.png" },
    { id: "arifle_MX_khk_F", name: "MX 6.5mm Khaki", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_khk_F.png" },
    { id: "arifle_MXC_khk_F", name: "MXC 6.5mm Carbine Khaki", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXC_khk_F.png" },
    { id: "arifle_MXM_khk_F", name: "MXM 6.5mm DMR Khaki", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXM_khk_F.png" },
    { id: "arifle_MX_F_camo_F", name: "MX 6.5mm (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_F_camo_F.png" },
    { id: "arifle_MX_F_sand_F", name: "MX 6.5mm (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_F_sand_F.png" },
    { id: "arifle_MXC_F_camo_F", name: "MXC 6.5mm Carbine (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXC_F_camo_F.png" },
    { id: "arifle_MXC_F_sand_F", name: "MXC 6.5mm Carbine (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXC_F_sand_F.png" },
    { id: "arifle_MX_GL_F_camo_F", name: "MX 3GL 6.5mm (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_GL_F_camo_F.png" },
    { id: "arifle_MX_GL_F_sand_F", name: "MX 3GL 6.5mm (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_GL_F_sand_F.png" },
    { id: "arifle_MXM_F_camo_F", name: "MXM 6.5mm (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXM_F_camo_F.png" },
    { id: "arifle_MXM_F_sand_F", name: "MXM 6.5mm (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MXM_F_sand_F.png" },
    { id: "arifle_MX_SW_F_camo_F", name: "MX SW 6.5mm (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "6.5x39", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_SW_F_camo_F.png" },
    { id: "arifle_MX_SW_F_sand_F", name: "MX SW 6.5mm (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "6.5x39", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MX_SW_F_sand_F.png" },
    { id: "arifle_SPAR_01_blk_F_camo_F", name: "SPAR-16 5.56mm (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_01_blk_F_camo_F.png" },
    { id: "arifle_SPAR_01_blk_F_sand_F", name: "SPAR-16 5.56mm (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_01_blk_F_sand_F.png" },
    { id: "arifle_SPAR_01_GL_blk_F_camo_F", name: "SPAR-16 GL 5.56mm (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_01_GL_blk_F_camo_F.png" },
    { id: "arifle_SPAR_01_GL_blk_F_sand_F", name: "SPAR-16 GL 5.56mm (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_01_GL_blk_F_sand_F.png" },
    { id: "arifle_SPAR_02_blk_F_camo_F", name: "SPAR-16S 5.56mm LMG (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["150Rnd_556x45_Drum_Mag_F", 150], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_02_blk_F_camo_F.png" },
    { id: "arifle_SPAR_02_blk_F_sand_F", name: "SPAR-16S 5.56mm LMG (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["150Rnd_556x45_Drum_Mag_F", 150], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_02_blk_F_sand_F.png" },
    { id: "arifle_SPAR_03_blk_F_camo_F", name: "SPAR-17 7.62mm DMR (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_03_blk_F_camo_F.png" },
    { id: "arifle_SPAR_03_blk_F_sand_F", name: "SPAR-17 7.62mm DMR (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_SPAR_03_blk_F_sand_F.png" },
    { id: "arifle_CTAR_blk_F_camo_F", name: "CAR-95 5.8mm Bullpup (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_580x42_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTAR_blk_F_camo_F.png" },
    { id: "arifle_CTAR_blk_F_sand_F", name: "CAR-95 5.8mm Bullpup (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_580x42_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTAR_blk_F_sand_F.png" },
    { id: "arifle_CTAR_GL_blk_F_camo_F", name: "CAR-95 GL 5.8mm (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_580x42_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTAR_GL_blk_F_camo_F.png" },
    { id: "arifle_CTAR_GL_blk_F_sand_F", name: "CAR-95 GL 5.8mm (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_580x42_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTAR_GL_blk_F_sand_F.png" },
    { id: "arifle_CTARS_blk_F_camo_F", name: "CAR-95-1 5.8mm LMG (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["100Rnd_580x42_Mag_F", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTARS_blk_F_camo_F.png" },
    { id: "arifle_CTARS_blk_F_sand_F", name: "CAR-95-1 5.8mm LMG (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["100Rnd_580x42_Mag_F", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_CTARS_blk_F_sand_F.png" },
    { id: "arifle_AK12_F_camo_F", name: "AK-12 7.62mm Modern (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12_F_camo_F.png" },
    { id: "arifle_AK12_F_sand_F", name: "AK-12 7.62mm Modern (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12_F_sand_F.png" },
    { id: "arifle_AK12_GL_F_camo_F", name: "AK-12 GP-25 GL (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12_GL_F_camo_F.png" },
    { id: "arifle_AK12_GL_F_sand_F", name: "AK-12 GP-25 GL (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12_GL_F_sand_F.png" },
    { id: "arifle_AK12U_F_camo_F", name: "AK-12U 7.62mm Carbine (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12U_F_camo_F.png" },
    { id: "arifle_AK12U_F_sand_F", name: "AK-12U 7.62mm Carbine (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["30Rnd_762x39_AK12_Mag_F", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_AK12U_F_sand_F.png" },
    { id: "arifle_RPK12_F_camo_F", name: "RPK-12 7.62mm LMG (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x39", defaultMag: ["75Rnd_762x39_Mag_F", 75], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_RPK12_F_camo_F.png" },
    { id: "arifle_RPK12_F_sand_F", name: "RPK-12 7.62mm LMG (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x39", defaultMag: ["75Rnd_762x39_Mag_F", 75], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_RPK12_F_sand_F.png" },
    { id: "arifle_MSBS65_F_camo_F", name: "Promet 6.5mm Modular (Camo)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_F_camo_F.png" },
    { id: "arifle_MSBS65_F_sand_F", name: "Promet 6.5mm Modular (Sand)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_F_sand_F.png" },
    { id: "arifle_MSBS65_GL_F_camo_F", name: "Promet GL 6.5mm (Camo)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_GL_F_camo_F.png" },
    { id: "arifle_MSBS65_GL_F_sand_F", name: "Promet GL 6.5mm (Sand)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_GL_F_sand_F.png" },
    { id: "arifle_MSBS65_Mark_F_camo_F", name: "Promet DMR 6.5mm (Camo)", mod: "Vanilla", factions: ["AAF"], roles: ["Marksman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_Mark_F_camo_F.png" },
    { id: "arifle_MSBS65_Mark_F_sand_F", name: "Promet DMR 6.5mm (Sand)", mod: "Vanilla", factions: ["AAF"], roles: ["Marksman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_Mark_F_sand_F.png" },
    { id: "arifle_MSBS65_UBS_F_camo_F", name: "Promet UBS (Shotgun) (Camo)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_UBS_F_camo_F.png" },
    { id: "arifle_MSBS65_UBS_F_sand_F", name: "Promet UBS (Shotgun) (Sand)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_mag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_MSBS65_UBS_F_sand_F.png" },
    { id: "arifle_Mk20_F_camo_F", name: "Mk20 5.56mm (Camo)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20_F_camo_F.png" },
    { id: "arifle_Mk20_F_sand_F", name: "Mk20 5.56mm (Sand)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20_F_sand_F.png" },
    { id: "arifle_Mk20C_F_camo_F", name: "Mk20C Carbine (Camo)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20C_F_camo_F.png" },
    { id: "arifle_Mk20C_F_sand_F", name: "Mk20C Carbine (Sand)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20C_F_sand_F.png" },
    { id: "arifle_Mk20_GL_F_camo_F", name: "Mk20 EGLM 5.56mm (Camo)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20_GL_F_camo_F.png" },
    { id: "arifle_Mk20_GL_F_sand_F", name: "Mk20 EGLM 5.56mm (Sand)", mod: "Vanilla", factions: ["AAF"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Mk20_GL_F_sand_F.png" },
    { id: "arifle_TRG21_F_camo_F", name: "TRG-21 5.56mm (Camo)", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_TRG21_F_camo_F.png" },
    { id: "arifle_TRG21_F_sand_F", name: "TRG-21 5.56mm (Sand)", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_TRG21_F_sand_F.png" },
    { id: "arifle_TRG20_F_camo_F", name: "TRG-20 Carbine (Camo)", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_TRG20_F_camo_F.png" },
    { id: "arifle_TRG20_F_sand_F", name: "TRG-20 Carbine (Sand)", mod: "Vanilla", factions: ["FIA"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_TRG20_F_sand_F.png" },
    { id: "srifle_DMR_02_F_camo_F", name: "MAR-10 .338 Magnum (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Sniper","Marksman"], tier: "specops", caliber: ".338", defaultMag: ["10Rnd_338_Mag", 10], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_02_F_camo_F.png" },
    { id: "srifle_DMR_02_F_sand_F", name: "MAR-10 .338 Magnum (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Sniper","Marksman"], tier: "specops", caliber: ".338", defaultMag: ["10Rnd_338_Mag", 10], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_02_F_sand_F.png" },
    { id: "srifle_DMR_03_F_camo_F", name: "Mk-I EMR 7.62mm (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_03_F_camo_F.png" },
    { id: "srifle_DMR_03_F_sand_F", name: "Mk-I EMR 7.62mm (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_03_F_sand_F.png" },
    { id: "srifle_DMR_04_F_camo_F", name: "ASP-1 Kir 12.7mm Suppressed (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["10Rnd_127x54_Mag", 10], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_DMR_04_F_camo_F.png" },
    { id: "srifle_DMR_04_F_sand_F", name: "ASP-1 Kir 12.7mm Suppressed (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["10Rnd_127x54_Mag", 10], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_DMR_04_F_sand_F.png" },
    { id: "srifle_DMR_05_blk_F_camo_F", name: "Cyrus 9.3mm Heavy DMR (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x54", defaultMag: ["10Rnd_93x64_DMR_05_Mag", 10], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_05_blk_F_camo_F.png" },
    { id: "srifle_DMR_05_blk_F_sand_F", name: "Cyrus 9.3mm Heavy DMR (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x54", defaultMag: ["10Rnd_93x64_DMR_05_Mag", 10], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_DMR_05_blk_F_sand_F.png" },
    { id: "MMG_02_black_F_camo_F", name: "SPMG .338 Heavy MMG (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: ".338", defaultMag: ["130Rnd_338_Mag", 130], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/MMG_02_black_F_camo_F.png" },
    { id: "MMG_02_black_F_sand_F", name: "SPMG .338 Heavy MMG (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: ".338", defaultMag: ["130Rnd_338_Mag", 130], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/MMG_02_black_F_sand_F.png" },
    { id: "arifle_Katiba_F_camo_F", name: "Katiba 6.5mm (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_F_camo_F.png" },
    { id: "arifle_Katiba_F_sand_F", name: "Katiba 6.5mm (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_F_sand_F.png" },
    { id: "arifle_Katiba_C_F_camo_F", name: "Katiba Carbine 6.5mm (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_C_F_camo_F.png" },
    { id: "arifle_Katiba_C_F_sand_F", name: "Katiba Carbine 6.5mm (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_C_F_sand_F.png" },
    { id: "arifle_Katiba_GL_F_camo_F", name: "Katiba GL 6.5mm (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_GL_F_camo_F.png" },
    { id: "arifle_Katiba_GL_F_sand_F", name: "Katiba GL 6.5mm (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Katiba_GL_F_sand_F.png" },
    { id: "srifle_LRR_F_camo_F", name: "M200 Intervention (.408) (Camo)", mod: "Vanilla", factions: ["NATO","FIA"], roles: ["Sniper"], tier: "standard", caliber: ".408", defaultMag: ["7Rnd_408_Mag", 7], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_LRR_F_camo_F.png" },
    { id: "srifle_LRR_F_sand_F", name: "M200 Intervention (.408) (Sand)", mod: "Vanilla", factions: ["NATO","FIA"], roles: ["Sniper"], tier: "standard", caliber: ".408", defaultMag: ["7Rnd_408_Mag", 7], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/srifle_LRR_F_sand_F.png" },
    { id: "srifle_GM6_F_camo_F", name: "GM6 Lynx 12.7mm (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Sniper"], tier: "standard", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_GM6_F_camo_F.png" },
    { id: "srifle_GM6_F_sand_F", name: "GM6 Lynx 12.7mm (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Sniper"], tier: "standard", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/srifle_GM6_F_sand_F.png" },
    { id: "LMG_Zafir_F_camo_F", name: "Zafir 7.62mm (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["150Rnd_762x54_Box", 150], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_Zafir_F_camo_F.png" },
    { id: "LMG_Zafir_F_sand_F", name: "Zafir 7.62mm (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["150Rnd_762x54_Box", 150], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_Zafir_F_sand_F.png" },
    { id: "LMG_Mk200_F_camo_F", name: "Mk200 6.5mm (Camo)", mod: "Vanilla", factions: ["AAF","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "6.5x39", defaultMag: ["200Rnd_65x39_cased_Box", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_Mk200_F_camo_F.png" },
    { id: "LMG_Mk200_F_sand_F", name: "Mk200 6.5mm (Sand)", mod: "Vanilla", factions: ["AAF","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "6.5x39", defaultMag: ["200Rnd_65x39_cased_Box", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: false, photoUrl: "assets/weapons/photos/LMG_Mk200_F_sand_F.png" },
    { id: "SMG_01_F_camo_F", name: "Vermin .45 ACP (Vector) (Camo)", mod: "Vanilla", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "standard", caliber: ".45ACP", defaultMag: ["30Rnd_45ACP_Mag_SMG_01", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_01_F_camo_F.png" },
    { id: "SMG_01_F_sand_F", name: "Vermin .45 ACP (Vector) (Sand)", mod: "Vanilla", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "standard", caliber: ".45ACP", defaultMag: ["30Rnd_45ACP_Mag_SMG_01", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_01_F_sand_F.png" },
    { id: "SMG_02_F_camo_F", name: "Sting 9mm (Camo)", mod: "Vanilla", factions: ["CSAT","AAF"], roles: ["Pilot"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_02_F_camo_F.png" },
    { id: "SMG_02_F_sand_F", name: "Sting 9mm (Sand)", mod: "Vanilla", factions: ["CSAT","AAF"], roles: ["Pilot"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_02_F_sand_F.png" },
    { id: "SMG_05_F_camo_F", name: "Protector 9mm (MP5) (Camo)", mod: "Vanilla", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_05_F_camo_F.png" },
    { id: "SMG_05_F_sand_F", name: "Protector 9mm (MP5) (Sand)", mod: "Vanilla", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/SMG_05_F_sand_F.png" },
    { id: "arifle_ARX_blk_F_camo_F", name: "Type 115 6.5mm / .50 Cal (Camo)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_ARX_blk_F_camo_F.png" },
    { id: "arifle_ARX_blk_F_sand_F", name: "Type 115 6.5mm / .50 Cal (Sand)", mod: "Vanilla", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "6.5x39", defaultMag: ["30Rnd_65x39_caseless_green", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_ARX_blk_F_sand_F.png" },
    { id: "arifle_Velko_F_camo_F", name: "Velko R4 5.56mm (Camo)", mod: "Vanilla", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Velko_F_camo_F.png" },
    { id: "arifle_Velko_F_sand_F", name: "Velko R4 5.56mm (Sand)", mod: "Vanilla", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/arifle_Velko_F_sand_F.png" },
    { id: "rhs_weap_m4a1_carryhandle", name: "M4A1 Carryhandle", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_carryhandle.png" },
    { id: "rhs_weap_m4a1_blockII", name: "M4A1 Block II", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII.png" },
    { id: "rhs_weap_m4a1_m203", name: "M4A1 M203 5.56mm", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_m203.png" },
    { id: "rhs_weap_m4a1_carryhandle_m203", name: "M4A1 Carryhandle M203", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_carryhandle_m203.png" },
    { id: "rhs_weap_m4a1", name: "M4A1 Flattop (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1.png" },
    { id: "rhs_weap_m4", name: "M4 Carbine 5.56mm", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4.png" },
    { id: "rhs_weap_mk18", name: "Mk18 Mod 1 5.56mm", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18.png" },
    { id: "rhs_weap_mk18_KAC", name: "Mk18 Mod 1 KAC", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_KAC.png" },
    { id: "rhs_weap_mk18_m320", name: "Mk18 Mod 1 M320", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_m320.png" },
    { id: "rhs_weap_m16a4_carryhandle", name: "M16A4 Carryhandle", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_carryhandle.png" },
    { id: "rhs_weap_m16a4_imod", name: "M16A4 IMOD", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod.png" },
    { id: "rhs_weap_m16a4", name: "M16A4 Flattop", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4.png" },
    { id: "rhs_weap_m16a2", name: "M16A2 Classic (RHS)", mod: "RHS", factions: ["NATO","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a2.png" },
    { id: "rhs_weap_hk416d145", name: "HK416 D14.5 (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d145.png" },
    { id: "rhs_weap_hk416d10", name: "HK416 D10 CQB (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d10.png" },
    { id: "rhs_weap_hk416d145_m320", name: "HK416 D14.5 M320", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d145_m320.png" },
    { id: "rhs_weap_SCARH_USA_STD", name: "FN SCAR-H 7.62mm (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_STD.png" },
    { id: "rhs_weap_SCARH_USA_CQC", name: "FN SCAR-H CQC (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_CQC.png" },
    { id: "rhs_weap_SCARH_USA_LB", name: "FN SCAR-H Long Barrel", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Rifleman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_LB.png" },
    { id: "rhs_weap_M590_8RD", name: "Mossberg 590 8-Shot 12G", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_M590_8RD.png" },
    { id: "rhs_weap_M590_5RD", name: "Mossberg 590 Short 12G", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_5Rnd_00Buck", 5], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_M590_5RD.png" },
    { id: "rhs_weap_sr25_ec", name: "KAC SR-25 EC", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sr25_ec.png" },
    { id: "rhs_weap_sr25", name: "KAC SR-25 Match", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sr25.png" },
    { id: "rhs_weap_m14ebrri", name: "M14 EBR-RI (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14ebrri.png" },
    { id: "rhs_weap_m14ebrri_leu", name: "M14 EBR-RI Leupold", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14ebrri_leu.png" },
    { id: "rhs_weap_m14", name: "M14 Classic Battle Rifle (RHS)", mod: "RHS", factions: ["NATO","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14.png" },
    { id: "rhs_weap_m24sws", name: "M24 SWS 7.62mm", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m24sws.png" },
    { id: "rhs_weap_m40a5", name: "M40A5 7.62mm Sniper", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_10Rnd_762x51_m118_special_Mag", 10], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m40a5.png" },
    { id: "rhs_weap_m2010", name: "M2010 ESR (.300WM)", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".300WM", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m2010.png" },
    { id: "rhs_weap_M107", name: "Barrett M107 (.50 BMG) RHS", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["rhsusf_mag_10Rnd_STD_50BMG_M33", 10], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_M107.png" },
    { id: "rhs_weap_m249_pip", name: "M249 PIP SAW (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip.png" },
    { id: "rhs_weap_m249_pip_S", name: "M249 Para Short SAW", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S.png" },
    { id: "rhs_weap_m249_pip_L", name: "M249 Long Barrel SAW", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_L.png" },
    { id: "rhs_weap_m240G", name: "M240G 7.62mm (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m240G.png" },
    { id: "rhs_weap_m240B", name: "M240B 7.62mm GPMG", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m240B.png" },
    { id: "rhs_weap_minimi_para_railed", name: "Minimi Para Railed (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_minimi_para_railed.png" },
    { id: "rhsusf_weap_MP7A2", name: "MP7A2 4.6mm (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Pilot"], tier: "specops", caliber: "4.6x30", defaultMag: ["rhsusf_40Rnd_46x30_mp7", 40], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhsusf_weap_MP7A2.png" },
    { id: "rhs_weap_kar98k", name: "Kar98k Bolt-Action Rifle", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x54", defaultMag: ["rhsgref_5Rnd_792x57_kar98k", 5], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_kar98k.png" },
    { id: "rhs_weap_Izh18", name: "Izh-18 Break-Action 12G", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Medic"], tier: "militia", caliber: "12Gauge", defaultMag: ["rhsusf_5Rnd_00Buck", 5], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_Izh18.png" },
    { id: "rhs_weap_m4a1_blockII_M203", name: "M4A1 Block II M203 5.56mm", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_M203.png" },
    { id: "rhs_weap_m4a1_blockII_KAC", name: "M4A1 Block II KAC", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_KAC.png" },
    { id: "rhs_weap_m4_m203", name: "M4 Carbine M203", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4_m203.png" },
    { id: "rhs_weap_m4_m320", name: "M4 Carbine M320", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4_m320.png" },
    { id: "rhs_weap_m16a4_carryhandle_M203", name: "M16A4 Carryhandle M203", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_carryhandle_M203.png" },
    { id: "rhs_weap_m16a4_imod_M203", name: "M16A4 IMOD M203", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod_M203.png" },
    { id: "rhs_weap_m16a2_m203", name: "M16A2 M203 Classic (RHS)", mod: "RHS", factions: ["NATO","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a2_m203.png" },
    { id: "rhs_weap_hk416d10_m320", name: "HK416 D10 M320 (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d10_m320.png" },
    { id: "rhs_weap_m38", name: "Mosin-Nagant M38 Carbine", mod: "RHS", factions: ["FIA"], roles: ["Marksman","Rifleman"], tier: "militia", caliber: "7.62x54", defaultMag: ["rhsgref_5Rnd_762x54_m38", 5], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m38.png" },
    { id: "rhs_weap_m107", name: "Barrett M107 .50 BMG (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["rhsusf_mag_10Rnd_STD_50BMG_M33", 10], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m107.png" },
    { id: "rhs_weap_m110", name: "KAC M110 SASS 7.62mm", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m110.png" },
    { id: "rhs_weap_m249_pip_S_para", name: "M249 Para Short Collapsible SAW", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S_para.png" },
    { id: "rhs_weap_mk48", name: "Mk48 Mod 1 7.62mm LMG", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_mk48.png" },
    { id: "rhs_weap_M590A1_9rd", name: "Mossberg 590A1 Tactical 12G", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_M590A1_9rd.png" },
    { id: "rhs_weap_m4a1_carryhandle_pmag", name: "M4A1 Carryhandle (PMAG)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_carryhandle_pmag.png" },
    { id: "rhs_weap_m4a1_blockII_grip2", name: "M4A1 Block II Foregrip", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_grip2.png" },
    { id: "rhs_weap_m4a1_blockII_M203_bk", name: "M4A1 Block II M203 Black", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_M203_bk.png" },
    { id: "rhs_weap_m16a4_imod_grip", name: "M16A4 IMOD Grip", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod_grip.png" },
    { id: "rhs_weap_m27iar", name: "M27 IAR 5.56mm", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m27iar.png" },
    { id: "rhs_weap_m27iar_Grip", name: "M27 IAR Foregrip", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m27iar_Grip.png" },
    { id: "rhs_weap_m14_rail", name: "M14 Classic Railed", mod: "RHS", factions: ["NATO","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14_rail.png" },
    { id: "rhs_weap_mk11", name: "KAC Mk11 Mod 0 7.62mm", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk11.png" },
    { id: "rhs_weap_m249_pip_S_vfg", name: "M249 Para Short VFG", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S_vfg.png" },
    { id: "rhsusf_weap_MP7A1", name: "HK MP7A1 4.6mm (RHS)", mod: "RHS", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "4.6x30", defaultMag: ["rhsusf_40Rnd_46x30_mp7", 40], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhsusf_weap_MP7A1.png" },
    { id: "rhs_weap_vityaz", name: "PP-19-01 Vityaz 9mm (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vityaz.png" },
    { id: "rhs_weap_ks23", name: "KS-23 23mm Combat Shotgun", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_ks23.png" },
    { id: "rhs_weap_m72", name: "Zastava M72 7.62mm LMG", mod: "RHS", factions: ["FIA","CSAT"], roles: ["Machine Gunner"], tier: "militia", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m72.png" },
    { id: "rhs_weap_m4a1_m320", name: "M4A1 M320 5.56mm", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_m320.png" },
    { id: "rhs_weap_mk18_grip2", name: "Mk18 Mod 1 AFG", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_grip2.png" },
    { id: "rhs_weap_mk18_bk", name: "Mk18 Mod 1 Black", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_bk.png" },
    { id: "rhs_weap_m249_pip_L_para", name: "M249 PIP Long Para", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_L_para.png" },
    { id: "rhs_weap_m249_pip_L_vfg", name: "M249 PIP Long VFG", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_L_vfg.png" },
    { id: "rhs_weap_m24sws_d", name: "M24 SWS Desert 7.62mm", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m24sws_d.png" },
    { id: "rhs_weap_m40a5_d", name: "M40A5 Sniper Desert", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m40a5_d.png" },
    { id: "rhs_weap_m40a5_wd", name: "M40A5 Sniper Woodland", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m40a5_wd.png" },
    { id: "rhs_weap_m107_d", name: "M107 .50BMG Desert", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["rhsusf_mag_10Rnd_STD_50BMG_M33", 10], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m107_d.png" },
    { id: "rhs_weap_XM2010", name: "XM2010 ESR .300WM", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".300WM", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_XM2010.png" },
    { id: "rhs_weap_XM2010_d", name: "XM2010 ESR Desert", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".300WM", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_XM2010_d.png" },
    { id: "rhs_weap_XM2010_wd", name: "XM2010 ESR Woodland", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".300WM", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_XM2010_wd.png" },
    { id: "rhs_weap_m4_carryhandle", name: "M4 Carbine Carryhandle", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4_carryhandle.png" },
    { id: "rhs_weap_m4a1_carryhandle_d", name: "M4A1 Carryhandle (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_carryhandle_d.png" },
    { id: "rhs_weap_m4a1_carryhandle_wd", name: "M4A1 Carryhandle (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_carryhandle_wd.png" },
    { id: "rhs_weap_m4a1_blockII_d", name: "M4A1 Block II (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_d.png" },
    { id: "rhs_weap_m4a1_blockII_wd", name: "M4A1 Block II (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_wd.png" },
    { id: "rhs_weap_m4a1_m203_d", name: "M4A1 M203 5.56mm (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_m203_d.png" },
    { id: "rhs_weap_m4a1_m203_wd", name: "M4A1 M203 5.56mm (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_m203_wd.png" },
    { id: "rhs_weap_m4a1_blockII_M203_d", name: "M4A1 Block II M203 5.56mm (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_M203_d.png" },
    { id: "rhs_weap_m4a1_blockII_M203_wd", name: "M4A1 Block II M203 5.56mm (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_M203_wd.png" },
    { id: "rhs_weap_m4a1_blockII_KAC_d", name: "M4A1 Block II KAC (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_KAC_d.png" },
    { id: "rhs_weap_m4a1_blockII_KAC_wd", name: "M4A1 Block II KAC (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_KAC_wd.png" },
    { id: "rhs_weap_m4a1_blockII_grip2_d", name: "M4A1 Block II Foregrip (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_grip2_d.png" },
    { id: "rhs_weap_m4a1_blockII_grip2_wd", name: "M4A1 Block II Foregrip (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_grip2_wd.png" },
    { id: "rhs_weap_m4a1_d", name: "M4A1 Flattop (RHS) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_d.png" },
    { id: "rhs_weap_m4a1_wd", name: "M4A1 Flattop (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_wd.png" },
    { id: "rhs_weap_m4_d", name: "M4 Carbine 5.56mm (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4_d.png" },
    { id: "rhs_weap_m4_wd", name: "M4 Carbine 5.56mm (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4_wd.png" },
    { id: "rhs_weap_mk18_d", name: "Mk18 Mod 1 5.56mm (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_d.png" },
    { id: "rhs_weap_mk18_wd", name: "Mk18 Mod 1 5.56mm (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_wd.png" },
    { id: "rhs_weap_mk18_KAC_d", name: "Mk18 Mod 1 KAC (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_KAC_d.png" },
    { id: "rhs_weap_mk18_KAC_wd", name: "Mk18 Mod 1 KAC (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_KAC_wd.png" },
    { id: "rhs_weap_mk18_m320_d", name: "Mk18 Mod 1 M320 (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_m320_d.png" },
    { id: "rhs_weap_mk18_m320_wd", name: "Mk18 Mod 1 M320 (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_m320_wd.png" },
    { id: "rhs_weap_mk18_grip2_d", name: "Mk18 Mod 1 AFG (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_grip2_d.png" },
    { id: "rhs_weap_mk18_grip2_wd", name: "Mk18 Mod 1 AFG (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_grip2_wd.png" },
    { id: "rhs_weap_mk18_bk_d", name: "Mk18 Mod 1 Black (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_bk_d.png" },
    { id: "rhs_weap_mk18_bk_wd", name: "Mk18 Mod 1 Black (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk18_bk_wd.png" },
    { id: "rhs_weap_m16a4_carryhandle_d", name: "M16A4 Carryhandle (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_carryhandle_d.png" },
    { id: "rhs_weap_m16a4_carryhandle_wd", name: "M16A4 Carryhandle (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_carryhandle_wd.png" },
    { id: "rhs_weap_m16a4_imod_d", name: "M16A4 IMOD (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod_d.png" },
    { id: "rhs_weap_m16a4_imod_wd", name: "M16A4 IMOD (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod_wd.png" },
    { id: "rhs_weap_m16a4_d", name: "M16A4 Flattop (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_d.png" },
    { id: "rhs_weap_m16a4_wd", name: "M16A4 Flattop (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_wd.png" },
    { id: "rhs_weap_m16a4_carryhandle_M203_d", name: "M16A4 Carryhandle M203 (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_carryhandle_M203_d.png" },
    { id: "rhs_weap_m16a4_carryhandle_M203_wd", name: "M16A4 Carryhandle M203 (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_carryhandle_M203_wd.png" },
    { id: "rhs_weap_m16a4_imod_M203_d", name: "M16A4 IMOD M203 (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod_M203_d.png" },
    { id: "rhs_weap_m16a4_imod_M203_wd", name: "M16A4 IMOD M203 (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod_M203_wd.png" },
    { id: "rhs_weap_hk416d145_d", name: "HK416 D14.5 (RHS) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d145_d.png" },
    { id: "rhs_weap_hk416d145_wd", name: "HK416 D14.5 (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d145_wd.png" },
    { id: "rhs_weap_hk416d10_d", name: "HK416 D10 CQB (RHS) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d10_d.png" },
    { id: "rhs_weap_hk416d10_wd", name: "HK416 D10 CQB (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d10_wd.png" },
    { id: "rhs_weap_hk416d145_m320_d", name: "HK416 D14.5 M320 (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d145_m320_d.png" },
    { id: "rhs_weap_hk416d145_m320_wd", name: "HK416 D14.5 M320 (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_hk416d145_m320_wd.png" },
    { id: "rhs_weap_SCARH_USA_STD_d", name: "FN SCAR-H 7.62mm (RHS) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_STD_d.png" },
    { id: "rhs_weap_SCARH_USA_STD_wd", name: "FN SCAR-H 7.62mm (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_STD_wd.png" },
    { id: "rhs_weap_SCARH_USA_CQC_d", name: "FN SCAR-H CQC (RHS) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_CQC_d.png" },
    { id: "rhs_weap_SCARH_USA_CQC_wd", name: "FN SCAR-H CQC (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_CQC_wd.png" },
    { id: "rhs_weap_SCARH_USA_LB_d", name: "FN SCAR-H Long Barrel (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Rifleman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_LB_d.png" },
    { id: "rhs_weap_SCARH_USA_LB_wd", name: "FN SCAR-H Long Barrel (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Rifleman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_SCARH_USA_LB_wd.png" },
    { id: "rhs_weap_m249_pip_d", name: "M249 PIP SAW (RHS) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_d.png" },
    { id: "rhs_weap_m249_pip_wd", name: "M249 PIP SAW (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_wd.png" },
    { id: "rhs_weap_m249_pip_S_d", name: "M249 Para Short SAW (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S_d.png" },
    { id: "rhs_weap_m249_pip_S_wd", name: "M249 Para Short SAW (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S_wd.png" },
    { id: "rhs_weap_m249_pip_L_d", name: "M249 Long Barrel SAW (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_L_d.png" },
    { id: "rhs_weap_m249_pip_L_wd", name: "M249 Long Barrel SAW (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_L_wd.png" },
    { id: "rhs_weap_m249_pip_S_para_d", name: "M249 Para Short Collapsible SAW (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S_para_d.png" },
    { id: "rhs_weap_m249_pip_S_para_wd", name: "M249 Para Short Collapsible SAW (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S_para_wd.png" },
    { id: "rhs_weap_m240B_d", name: "M240B 7.62mm GPMG (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m240B_d.png" },
    { id: "rhs_weap_m240B_wd", name: "M240B 7.62mm GPMG (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m240B_wd.png" },
    { id: "rhs_weap_m240G_d", name: "M240G 7.62mm (RHS) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m240G_d.png" },
    { id: "rhs_weap_m240G_wd", name: "M240G 7.62mm (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m240G_wd.png" },
    { id: "rhs_weap_m14ebrri_d", name: "M14 EBR-RI (RHS) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14ebrri_d.png" },
    { id: "rhs_weap_m14ebrri_wd", name: "M14 EBR-RI (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14ebrri_wd.png" },
    { id: "rhs_weap_m14_rail_d", name: "M14 Classic Railed (Desert)", mod: "RHS", factions: ["NATO","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14_rail_d.png" },
    { id: "rhs_weap_m14_rail_wd", name: "M14 Classic Railed (Woodland)", mod: "RHS", factions: ["NATO","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14_rail_wd.png" },
    { id: "rhs_weap_sr25_d", name: "KAC SR-25 Match (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sr25_d.png" },
    { id: "rhs_weap_sr25_wd", name: "KAC SR-25 Match (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sr25_wd.png" },
    { id: "rhs_weap_sr25_ec_d", name: "KAC SR-25 EC (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sr25_ec_d.png" },
    { id: "rhs_weap_sr25_ec_wd", name: "KAC SR-25 EC (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sr25_ec_wd.png" },
    { id: "rhs_weap_mk11_d", name: "KAC Mk11 Mod 0 7.62mm (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk11_d.png" },
    { id: "rhs_weap_mk11_wd", name: "KAC Mk11 Mod 0 7.62mm (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_mk11_wd.png" },
    { id: "rhs_weap_m24sws_wd", name: "M24 SWS 7.62mm (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m24sws_wd.png" },
    { id: "rhs_weap_m107_wd", name: "Barrett M107 .50 BMG (RHS) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["rhsusf_mag_10Rnd_STD_50BMG_M33", 10], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m107_wd.png" },
    { id: "rhs_weap_m27iar_d", name: "M27 IAR 5.56mm (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m27iar_d.png" },
    { id: "rhs_weap_m27iar_wd", name: "M27 IAR 5.56mm (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m27iar_wd.png" },
    { id: "rhs_weap_m4a1_carryhandle_pmag_d", name: "M4A1 Carryhandle (PMAG) (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_carryhandle_pmag_d.png" },
    { id: "rhs_weap_m4a1_carryhandle_pmag_wd", name: "M4A1 Carryhandle (PMAG) (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_carryhandle_pmag_wd.png" },
    { id: "rhs_weap_m4a1_blockII_M203_bk_d", name: "M4A1 Block II M203 Black (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_M203_bk_d.png" },
    { id: "rhs_weap_m4a1_blockII_M203_bk_wd", name: "M4A1 Block II M203 Black (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m4a1_blockII_M203_bk_wd.png" },
    { id: "rhs_weap_m16a4_imod_grip_d", name: "M16A4 IMOD Grip (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod_grip_d.png" },
    { id: "rhs_weap_m16a4_imod_grip_wd", name: "M16A4 IMOD Grip (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m16a4_imod_grip_wd.png" },
    { id: "rhs_weap_m249_pip_S_vfg_d", name: "M249 Para Short VFG (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S_vfg_d.png" },
    { id: "rhs_weap_m249_pip_S_vfg_wd", name: "M249 Para Short VFG (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m249_pip_S_vfg_wd.png" },
    { id: "rhs_weap_m14_d", name: "M14 Classic Battle Rifle (RHS) (Desert)", mod: "RHS", factions: ["NATO","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14_d.png" },
    { id: "rhs_weap_m14_wd", name: "M14 Classic Battle Rifle (RHS) (Woodland)", mod: "RHS", factions: ["NATO","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m14_wd.png" },
    { id: "rhs_weap_M590_8RD_d", name: "Mossberg 590 8-Shot 12G (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_M590_8RD_d.png" },
    { id: "rhs_weap_M590_8RD_wd", name: "Mossberg 590 8-Shot 12G (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_M590_8RD_wd.png" },
    { id: "rhs_weap_M590_5RD_d", name: "Mossberg 590 Short 12G (Desert)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_5Rnd_00Buck", 5], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_M590_5RD_d.png" },
    { id: "rhs_weap_M590_5RD_wd", name: "Mossberg 590 Short 12G (Woodland)", mod: "RHS", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_5Rnd_00Buck", 5], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_M590_5RD_wd.png" },
    { id: "rhs_weap_ak74m", name: "AK-74M 5.45mm (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m.png" },
    { id: "rhs_weap_ak74m_gp25", name: "AK-74M GP-25 (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_gp25.png" },
    { id: "rhs_weap_ak74", name: "AK-74 Classic Wood (RHS)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74.png" },
    { id: "rhs_weap_aks74", name: "AKS-74 Sidefolder (RHS)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_aks74.png" },
    { id: "rhs_weap_aks74u", name: "AKS-74U Krinkov (RHS)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Medic","Pilot","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_aks74u.png" },
    { id: "rhs_weap_ak74mr", name: "AK-74MR Zenitco Modern", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74mr.png" },
    { id: "rhs_weap_akm", name: "AKM Classic 7.62mm", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akm.png" },
    { id: "rhs_weap_akms", name: "AKMS Underfolder", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akms.png" },
    { id: "rhs_weap_akms_gp25", name: "AKMS GP-25 Underfolder", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akms_gp25.png" },
    { id: "rhs_weap_ak101", name: "AK-101 5.56mm NATO (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak101.png" },
    { id: "rhs_weap_ak102", name: "AK-102 5.56mm Carbine", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak102.png" },
    { id: "rhs_weap_ak103", name: "AK-103 7.62mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103.png" },
    { id: "rhs_weap_ak103_zenitco01", name: "AK-103 Zenitco Tactical", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_zenitco01.png" },
    { id: "rhs_weap_ak104", name: "AK-104 7.62mm Carbine", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak104.png" },
    { id: "rhs_weap_ak104_zenitco01", name: "AK-104 Zenitco Tactical", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak104_zenitco01.png" },
    { id: "rhs_weap_ak105", name: "AK-105 5.45mm Carbine", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105.png" },
    { id: "rhs_weap_ak105_zenitco01", name: "AK-105 Zenitco Tactical", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_zenitco01.png" },
    { id: "rhs_weap_ak105_gp25", name: "AK-105 GP-25 Carbine", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_gp25.png" },
    { id: "rhs_weap_asval", name: "AS Val 9x39mm Spetsnaz", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_asval.png" },
    { id: "rhs_weap_vss", name: "VSS Vintorez 9x39mm (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_10rnd_9x39mm_SP5", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vss.png" },
    { id: "rhs_weap_svd", name: "SVD Dragunov Wood (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svd.png" },
    { id: "rhs_weap_svds", name: "SVD-S Paratrooper (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svds.png" },
    { id: "rhs_weap_svdp_wd", name: "SVD Dragunov Woodland", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svdp_wd.png" },
    { id: "rhs_weap_t5000", name: "Orsis T-5000 .338 (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_t5000.png" },
    { id: "rhs_weap_pkm", name: "PKM Machine Gun (RHS)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkm.png" },
    { id: "rhs_weap_pkp", name: "PKP Pecheneg 7.62mm (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkp.png" },
    { id: "rhs_weap_rpk74m", name: "RPK-74M 5.45mm SAW", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_45Rnd_TE4_LRT4_Green_Tracer_545x39_RPK_M", 45], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_rpk74m.png" },
    { id: "rhs_weap_pp2000", name: "PP-2000 9mm SMG", mod: "RHS", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["rhs_mag_9x19mm_7n31_44", 44], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_pp2000.png" },
    { id: "rhs_weap_akm_gp25", name: "AKM GP-25 7.62mm (RHS)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akm_gp25.png" },
    { id: "rhs_weap_ak74_gp25", name: "AK-74 GP-25 5.45mm (RHS)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74_gp25.png" },
    { id: "rhs_weap_aks74_gp25", name: "AKS-74 GP-25 5.45mm (RHS)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_aks74_gp25.png" },
    { id: "rhs_weap_ak103_gp25", name: "AK-103 GP-25 7.62mm (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_gp25.png" },
    { id: "rhs_weap_ak103_1", name: "AK-103-1 Semi 7.62mm (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_1.png" },
    { id: "rhs_weap_ak103_2", name: "AK-103-2 Burst 7.62mm (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_2.png" },
    { id: "rhs_weap_mosin_snb", name: "Mosin-Nagant 1891/30 Sniper", mod: "RHS", factions: ["FIA"], roles: ["Sniper","Marksman"], tier: "militia", caliber: "7.62x54", defaultMag: ["rhsgref_5Rnd_762x54_m38", 5], opticType: "long", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_mosin_snb.png" },
    { id: "rhs_weap_svdp", name: "SVDP Polymer 7.62mm", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svdp.png" },
    { id: "rhs_weap_sv98", name: "Izhmash SV-98 7.62mm Sniper", mod: "RHS", factions: ["CSAT"], roles: ["Sniper","Marksman"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, defaultBipod: "rhs_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sv98.png" },
    { id: "rhs_weap_vss_grip", name: "VSS Vintorez Foregrip 9x39mm", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Rifleman"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_vss_grip.png" },
    { id: "rhs_weap_saiga12", name: "Saiga-12 Semi-Auto 12G (RHS)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_saiga12.png" },
    { id: "rhs_weap_ak74_2", name: "AK-74 Early Pattern 5.45mm", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74_2.png" },
    { id: "rhs_weap_ak74_3", name: "AK-74 Late Pattern 5.45mm", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74_3.png" },
    { id: "rhs_weap_aks74u_gp25", name: "AKS-74U GP-25 5.45mm", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Pilot"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_aks74u_gp25.png" },
    { id: "rhs_weap_ak74m_zenitco01", name: "AK-74M Zenitco Tactical 5.45mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_zenitco01.png" },
    { id: "rhs_weap_ak12", name: "AK-12 5.45mm Russian (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak12.png" },
    { id: "rhs_weap_ak12_gp25", name: "AK-12 GP-25 5.45mm (RHS)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak12_gp25.png" },
    { id: "rhs_weap_svds_npz", name: "SVDS NPZ Railed 7.62mm", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svds_npz.png" },
    { id: "rhs_weap_vss_npz", name: "VSS Vintorez NPZ Railed", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_vss_npz.png" },
    { id: "rhs_weap_asval_npz", name: "AS Val NPZ Railed 9x39mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_asval_npz.png" },
    { id: "rhs_weap_pkp_bullpup", name: "PKP Pecheneg Bullpup 7.62mm", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkp_bullpup.png" },
    { id: "rhs_weap_rpk74m_npz", name: "RPK-74M NPZ Railed 5.45mm", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_45Rnd_545X39_7N10_AK", 45], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_rpk74m_npz.png" },
    { id: "rhs_weap_ak74m_camo", name: "AK-74M Camo 5.45mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_camo.png" },
    { id: "rhs_weap_ak74m_desert", name: "AK-74M Desert 5.45mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_desert.png" },
    { id: "rhs_weap_ak74m_plummag", name: "AK-74M Plum 5.45mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_plum_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_plummag.png" },
    { id: "rhs_weap_ak104_npz", name: "AK-104 NPZ Railed 7.62mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_89", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak104_npz.png" },
    { id: "rhs_weap_ak105_npz", name: "AK-105 NPZ Railed 5.45mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_npz.png" },
    { id: "rhs_weap_ak103_npz", name: "AK-103 NPZ Railed 7.62mm", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_89", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_npz.png" },
    { id: "rhs_weap_pkp_rail", name: "PKP Pecheneg Rail 7.62mm", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkp_rail.png" },
    { id: "rhs_weap_asval_grip", name: "AS Val Tactical Foregrip", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP6", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_asval_grip.png" },
    { id: "rhs_weap_sv98_npz", name: "SV-98 NPZ Railed Sniper", mod: "RHS", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sv98_npz.png" },
    { id: "rhs_weap_t5000_wd", name: "T-5000 Woodland .338", mod: "RHS", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["rhs_5Rnd_338lapua_t5000", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_t5000_wd.png" },
    { id: "rhs_weap_pp2000_folded", name: "PP-2000 Folded PDW", mod: "RHS", factions: ["CSAT"], roles: ["Pilot"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_mag_9x19mm_7n21_20", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pp2000_folded.png" },
    { id: "rhs_weap_ak74m_npz", name: "AK-74M 5.45mm (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_npz.png" },
    { id: "rhs_weap_ak74mr_npz", name: "AK-74MR Zenitco Modern (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74mr_npz.png" },
    { id: "rhs_weap_ak74mr_camo", name: "AK-74MR Zenitco Modern (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74mr_camo.png" },
    { id: "rhs_weap_ak74mr_desert", name: "AK-74MR Zenitco Modern (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74mr_desert.png" },
    { id: "rhs_weap_ak74m_gp25_npz", name: "AK-74M GP-25 (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_gp25_npz.png" },
    { id: "rhs_weap_ak74m_gp25_camo", name: "AK-74M GP-25 (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_gp25_camo.png" },
    { id: "rhs_weap_ak74m_gp25_desert", name: "AK-74M GP-25 (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_gp25_desert.png" },
    { id: "rhs_weap_ak74m_zenitco01_npz", name: "AK-74M Zenitco Tactical 5.45mm (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_zenitco01_npz.png" },
    { id: "rhs_weap_ak74m_zenitco01_camo", name: "AK-74M Zenitco Tactical 5.45mm (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_zenitco01_camo.png" },
    { id: "rhs_weap_ak74m_zenitco01_desert", name: "AK-74M Zenitco Tactical 5.45mm (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak74m_zenitco01_desert.png" },
    { id: "rhs_weap_ak103_camo", name: "AK-103 7.62mm (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_camo.png" },
    { id: "rhs_weap_ak103_desert", name: "AK-103 7.62mm (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_desert.png" },
    { id: "rhs_weap_ak103_gp25_npz", name: "AK-103 GP-25 7.62mm (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_gp25_npz.png" },
    { id: "rhs_weap_ak103_gp25_camo", name: "AK-103 GP-25 7.62mm (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_gp25_camo.png" },
    { id: "rhs_weap_ak103_gp25_desert", name: "AK-103 GP-25 7.62mm (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_gp25_desert.png" },
    { id: "rhs_weap_ak103_zenitco01_npz", name: "AK-103 Zenitco Tactical (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_zenitco01_npz.png" },
    { id: "rhs_weap_ak103_zenitco01_camo", name: "AK-103 Zenitco Tactical (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_zenitco01_camo.png" },
    { id: "rhs_weap_ak103_zenitco01_desert", name: "AK-103 Zenitco Tactical (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_zenitco01_desert.png" },
    { id: "rhs_weap_ak104_camo", name: "AK-104 7.62mm Carbine (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak104_camo.png" },
    { id: "rhs_weap_ak104_desert", name: "AK-104 7.62mm Carbine (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak104_desert.png" },
    { id: "rhs_weap_ak104_zenitco01_npz", name: "AK-104 Zenitco Tactical (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak104_zenitco01_npz.png" },
    { id: "rhs_weap_ak104_zenitco01_camo", name: "AK-104 Zenitco Tactical (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak104_zenitco01_camo.png" },
    { id: "rhs_weap_ak104_zenitco01_desert", name: "AK-104 Zenitco Tactical (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak104_zenitco01_desert.png" },
    { id: "rhs_weap_ak105_camo", name: "AK-105 5.45mm Carbine (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_camo.png" },
    { id: "rhs_weap_ak105_desert", name: "AK-105 5.45mm Carbine (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank","Pilot"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_desert.png" },
    { id: "rhs_weap_ak105_zenitco01_npz", name: "AK-105 Zenitco Tactical (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_zenitco01_npz.png" },
    { id: "rhs_weap_ak105_zenitco01_camo", name: "AK-105 Zenitco Tactical (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_zenitco01_camo.png" },
    { id: "rhs_weap_ak105_zenitco01_desert", name: "AK-105 Zenitco Tactical (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Medic","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_zenitco01_desert.png" },
    { id: "rhs_weap_akm_npz", name: "AKM Classic 7.62mm (NPZ Picatinny)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akm_npz.png" },
    { id: "rhs_weap_akm_camo", name: "AKM Classic 7.62mm (Camo)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akm_camo.png" },
    { id: "rhs_weap_akm_desert", name: "AKM Classic 7.62mm (Desert)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akm_desert.png" },
    { id: "rhs_weap_akms_npz", name: "AKMS Underfolder (NPZ Picatinny)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akms_npz.png" },
    { id: "rhs_weap_akms_camo", name: "AKMS Underfolder (Camo)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akms_camo.png" },
    { id: "rhs_weap_akms_desert", name: "AKMS Underfolder (Desert)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akms_desert.png" },
    { id: "rhs_weap_akm_gp25_npz", name: "AKM GP-25 7.62mm (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akm_gp25_npz.png" },
    { id: "rhs_weap_akm_gp25_camo", name: "AKM GP-25 7.62mm (RHS) (Camo)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akm_gp25_camo.png" },
    { id: "rhs_weap_akm_gp25_desert", name: "AKM GP-25 7.62mm (RHS) (Desert)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akm_gp25_desert.png" },
    { id: "rhs_weap_ak12_npz", name: "AK-12 5.45mm Russian (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak12_npz.png" },
    { id: "rhs_weap_ak12_camo", name: "AK-12 5.45mm Russian (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak12_camo.png" },
    { id: "rhs_weap_ak12_desert", name: "AK-12 5.45mm Russian (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_30Rnd_545x39_7N10_AK", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak12_desert.png" },
    { id: "rhs_weap_rpk74m_camo", name: "RPK-74M 5.45mm SAW (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_45Rnd_TE4_LRT4_Green_Tracer_545x39_RPK_M", 45], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_rpk74m_camo.png" },
    { id: "rhs_weap_rpk74m_desert", name: "RPK-74M 5.45mm SAW (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_45Rnd_TE4_LRT4_Green_Tracer_545x39_RPK_M", 45], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_rpk74m_desert.png" },
    { id: "rhs_weap_pkm_npz", name: "PKM Machine Gun (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkm_npz.png" },
    { id: "rhs_weap_pkm_camo", name: "PKM Machine Gun (RHS) (Camo)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkm_camo.png" },
    { id: "rhs_weap_pkm_desert", name: "PKM Machine Gun (RHS) (Desert)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkm_desert.png" },
    { id: "rhs_weap_pkp_npz", name: "PKP Pecheneg 7.62mm (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkp_npz.png" },
    { id: "rhs_weap_pkp_camo", name: "PKP Pecheneg 7.62mm (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkp_camo.png" },
    { id: "rhs_weap_pkp_desert", name: "PKP Pecheneg 7.62mm (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_pkp_desert.png" },
    { id: "rhs_weap_svd_npz", name: "SVD Dragunov Wood (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svd_npz.png" },
    { id: "rhs_weap_svd_camo", name: "SVD Dragunov Wood (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svd_camo.png" },
    { id: "rhs_weap_svd_desert", name: "SVD Dragunov Wood (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svd_desert.png" },
    { id: "rhs_weap_svds_camo", name: "SVD-S Paratrooper (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svds_camo.png" },
    { id: "rhs_weap_svds_desert", name: "SVD-S Paratrooper (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svds_desert.png" },
    { id: "rhs_weap_svdp_npz", name: "SVDP Polymer 7.62mm (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svdp_npz.png" },
    { id: "rhs_weap_svdp_camo", name: "SVDP Polymer 7.62mm (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svdp_camo.png" },
    { id: "rhs_weap_svdp_desert", name: "SVDP Polymer 7.62mm (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svdp_desert.png" },
    { id: "rhs_weap_vss_camo", name: "VSS Vintorez 9x39mm (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_10rnd_9x39mm_SP5", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vss_camo.png" },
    { id: "rhs_weap_vss_desert", name: "VSS Vintorez 9x39mm (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_10rnd_9x39mm_SP5", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vss_desert.png" },
    { id: "rhs_weap_asval_camo", name: "AS Val 9x39mm Spetsnaz (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_asval_camo.png" },
    { id: "rhs_weap_asval_desert", name: "AS Val 9x39mm Spetsnaz (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_asval_desert.png" },
    { id: "rhs_weap_t5000_npz", name: "Orsis T-5000 .338 (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_t5000_npz.png" },
    { id: "rhs_weap_t5000_camo", name: "Orsis T-5000 .338 (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_t5000_camo.png" },
    { id: "rhs_weap_t5000_desert", name: "Orsis T-5000 .338 (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_t5000_desert.png" },
    { id: "rhs_weap_sv98_camo", name: "Izhmash SV-98 7.62mm Sniper (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Sniper","Marksman"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, defaultBipod: "rhs_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sv98_camo.png" },
    { id: "rhs_weap_sv98_desert", name: "Izhmash SV-98 7.62mm Sniper (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Sniper","Marksman"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: true, defaultBipod: "rhs_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_sv98_desert.png" },
    { id: "rhs_weap_saiga12_npz", name: "Saiga-12 Semi-Auto 12G (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_saiga12_npz.png" },
    { id: "rhs_weap_saiga12_camo", name: "Saiga-12 Semi-Auto 12G (RHS) (Camo)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_saiga12_camo.png" },
    { id: "rhs_weap_saiga12_desert", name: "Saiga-12 Semi-Auto 12G (RHS) (Desert)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["rhsusf_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_saiga12_desert.png" },
    { id: "rhs_weap_ak103_1_npz", name: "AK-103-1 Semi 7.62mm (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_1_npz.png" },
    { id: "rhs_weap_ak103_1_camo", name: "AK-103-1 Semi 7.62mm (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_1_camo.png" },
    { id: "rhs_weap_ak103_1_desert", name: "AK-103-1 Semi 7.62mm (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_1_desert.png" },
    { id: "rhs_weap_ak103_2_npz", name: "AK-103-2 Burst 7.62mm (RHS) (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_2_npz.png" },
    { id: "rhs_weap_ak103_2_camo", name: "AK-103-2 Burst 7.62mm (RHS) (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_2_camo.png" },
    { id: "rhs_weap_ak103_2_desert", name: "AK-103-2 Burst 7.62mm (RHS) (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak103_2_desert.png" },
    { id: "rhs_weap_ak105_gp25_npz", name: "AK-105 GP-25 Carbine (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_gp25_npz.png" },
    { id: "rhs_weap_ak105_gp25_camo", name: "AK-105 GP-25 Carbine (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_gp25_camo.png" },
    { id: "rhs_weap_ak105_gp25_desert", name: "AK-105 GP-25 Carbine (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_ak105_gp25_desert.png" },
    { id: "rhs_weap_akms_gp25_npz", name: "AKMS GP-25 Underfolder (NPZ Picatinny)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akms_gp25_npz.png" },
    { id: "rhs_weap_akms_gp25_camo", name: "AKMS GP-25 Underfolder (Camo)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akms_gp25_camo.png" },
    { id: "rhs_weap_akms_gp25_desert", name: "AKMS GP-25 Underfolder (Desert)", mod: "RHS", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_akms_gp25_desert.png" },
    { id: "rhs_weap_rpk74m_npz_npz", name: "RPK-74M NPZ Railed 5.45mm (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_45Rnd_545X39_7N10_AK", 45], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_rpk74m_npz_npz.png" },
    { id: "rhs_weap_rpk74m_npz_camo", name: "RPK-74M NPZ Railed 5.45mm (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_45Rnd_545X39_7N10_AK", 45], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_rpk74m_npz_camo.png" },
    { id: "rhs_weap_rpk74m_npz_desert", name: "RPK-74M NPZ Railed 5.45mm (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.45x39", defaultMag: ["rhs_45Rnd_545X39_7N10_AK", 45], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_rpk74m_npz_desert.png" },
    { id: "rhs_weap_svds_npz_npz", name: "SVDS NPZ Railed 7.62mm (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svds_npz_npz.png" },
    { id: "rhs_weap_svds_npz_camo", name: "SVDS NPZ Railed 7.62mm (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svds_npz_camo.png" },
    { id: "rhs_weap_svds_npz_desert", name: "SVDS NPZ Railed 7.62mm (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman"], tier: "specops", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_svds_npz_desert.png" },
    { id: "rhs_weap_asval_npz_npz", name: "AS Val NPZ Railed 9x39mm (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_asval_npz_npz.png" },
    { id: "rhs_weap_asval_npz_camo", name: "AS Val NPZ Railed 9x39mm (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_asval_npz_camo.png" },
    { id: "rhs_weap_asval_npz_desert", name: "AS Val NPZ Railed 9x39mm (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_asval_npz_desert.png" },
    { id: "rhs_weap_vss_npz_npz", name: "VSS Vintorez NPZ Railed (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_vss_npz_npz.png" },
    { id: "rhs_weap_vss_npz_camo", name: "VSS Vintorez NPZ Railed (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_vss_npz_camo.png" },
    { id: "rhs_weap_vss_npz_desert", name: "VSS Vintorez NPZ Railed (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_vss_npz_desert.png" },
    { id: "rhs_weap_pp2000_npz", name: "PP-2000 9mm SMG (NPZ Picatinny)", mod: "RHS", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["rhs_mag_9x19mm_7n31_44", 44], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_pp2000_npz.png" },
    { id: "rhs_weap_pp2000_camo", name: "PP-2000 9mm SMG (Camo)", mod: "RHS", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["rhs_mag_9x19mm_7n31_44", 44], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_pp2000_camo.png" },
    { id: "rhs_weap_pp2000_desert", name: "PP-2000 9mm SMG (Desert)", mod: "RHS", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["rhs_mag_9x19mm_7n31_44", 44], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_pp2000_desert.png" },
    { id: "rhs_weap_m21a", name: "Zastava M21A 5.56mm", mod: "RHS", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m21a.png" },
    { id: "rhs_weap_m21s", name: "Zastava M21S Carbine", mod: "RHS", factions: ["AAF"], roles: ["Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m21s.png" },
    { id: "rhs_weap_vhs2", name: "VHS-2 Bullpup 5.56mm", mod: "RHS", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhs2.png" },
    { id: "rhs_weap_vhs2_ct", name: "VHS-2 CT Compact", mod: "RHS", factions: ["AAF"], roles: ["Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhs2_ct.png" },
    { id: "rhs_weap_vhs2_gl", name: "VHS-2 BG Grenadier", mod: "RHS", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhs2_gl.png" },
    { id: "rhs_weap_m70b1", name: "Zastava M70B1 7.62mm", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70b1.png" },
    { id: "rhs_weap_m70ab2", name: "Zastava M70AB2 Underfolder", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70ab2.png" },
    { id: "rhs_weap_m92", name: "Zastava M92 Carbine", mod: "RHS", factions: ["FIA"], roles: ["Medic","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m92.png" },
    { id: "rhs_weap_m76", name: "Zastava M76 7.92mm Sniper", mod: "RHS", factions: ["FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhsgref_10Rnd_792x57_m76", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m76.png" },
    { id: "rhs_weap_m84", name: "Zastava M84 7.62mm GPMG", mod: "RHS", factions: ["FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/rhs_weap_m84.png" },
    { id: "rhs_weap_m70b3n", name: "Zastava M70B3N 7.62mm Railed", mod: "RHS", factions: ["FIA","CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70b3n.png" },
    { id: "rhs_weap_m70b3n_pbg40", name: "Zastava M70B3N PBG-40 GL", mod: "RHS", factions: ["FIA","CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70b3n_pbg40.png" },
    { id: "rhs_weap_m77", name: "Zastava M77 Battle Rifle .308", mod: "RHS", factions: ["FIA","AAF"], roles: ["Marksman","Rifleman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsgref_20rnd_762x51_m77", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m77.png" },
    { id: "rhs_weap_m21a_pr", name: "Zastava M21A Picatinny 5.56mm", mod: "RHS", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhssaf_30Rnd_556x45_EPR_G36", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m21a_pr.png" },
    { id: "rhs_weap_m21s_pr", name: "Zastava M21S Picatinny Carbine", mod: "RHS", factions: ["AAF","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhssaf_30Rnd_556x45_EPR_G36", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m21s_pr.png" },
    { id: "rhs_weap_vhsd2", name: "VHS-2D 5.56mm Bullpup", mod: "RHS", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhsd2.png" },
    { id: "rhs_weap_vhsk2", name: "VHS-2K 5.56mm Carbine", mod: "RHS", factions: ["NATO","AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhsk2.png" },
    { id: "rhs_weap_vhsd2_bg", name: "VHS-2D BG Underbarrel GL", mod: "RHS", factions: ["NATO","AAF"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhsd2_bg.png" },
    { id: "rhs_weap_m70b1n", name: "Zastava M70B1N Optics Mount", mod: "RHS", factions: ["FIA","CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70b1n.png" },
    { id: "rhs_weap_m70ab2n", name: "Zastava M70AB2N Folding Optics", mod: "RHS", factions: ["FIA","CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70ab2n.png" },
    { id: "rhs_weap_vz58p_ris", name: "vz. 58P Tactical RIS 7.62mm", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58p_ris.png" },
    { id: "rhs_weap_vz58p", name: "Sa vz. 58P Fixed Stock", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58p.png" },
    { id: "rhs_weap_vz58v", name: "Sa vz. 58V Folding Stock", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "militia", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58v.png" },
    { id: "rhs_weap_vz58v_ris", name: "Sa vz. 58V RIS Tactical", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58v_ris.png" },
    { id: "rhs_weap_m92_fold", name: "Zastava M92 Folded Stock", mod: "RHS", factions: ["FIA","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m92_fold.png" },
    { id: "rhs_weap_m70b1_camo", name: "Zastava M70B1 7.62mm (Camo)", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70b1_camo.png" },
    { id: "rhs_weap_m70b1_wood", name: "Zastava M70B1 7.62mm (Classic Wood)", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70b1_wood.png" },
    { id: "rhs_weap_m70ab2_camo", name: "Zastava M70AB2 Underfolder (Camo)", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70ab2_camo.png" },
    { id: "rhs_weap_m70ab2_wood", name: "Zastava M70AB2 Underfolder (Classic Wood)", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70ab2_wood.png" },
    { id: "rhs_weap_m70b3n_camo", name: "Zastava M70B3N 7.62mm Railed (Camo)", mod: "RHS", factions: ["FIA","CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70b3n_camo.png" },
    { id: "rhs_weap_m70b3n_wood", name: "Zastava M70B3N 7.62mm Railed (Classic Wood)", mod: "RHS", factions: ["FIA","CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m70b3n_wood.png" },
    { id: "rhs_weap_m76_camo", name: "Zastava M76 7.92mm Sniper (Camo)", mod: "RHS", factions: ["FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhsgref_10Rnd_792x57_m76", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m76_camo.png" },
    { id: "rhs_weap_m76_wood", name: "Zastava M76 7.92mm Sniper (Classic Wood)", mod: "RHS", factions: ["FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhsgref_10Rnd_792x57_m76", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m76_wood.png" },
    { id: "rhs_weap_m77_camo", name: "Zastava M77 Battle Rifle .308 (Camo)", mod: "RHS", factions: ["FIA","AAF"], roles: ["Marksman","Rifleman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsgref_20rnd_762x51_m77", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m77_camo.png" },
    { id: "rhs_weap_m77_wood", name: "Zastava M77 Battle Rifle .308 (Classic Wood)", mod: "RHS", factions: ["FIA","AAF"], roles: ["Marksman","Rifleman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsgref_20rnd_762x51_m77", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m77_wood.png" },
    { id: "rhs_weap_m21a_camo", name: "Zastava M21A 5.56mm (Camo)", mod: "RHS", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m21a_camo.png" },
    { id: "rhs_weap_m21a_wood", name: "Zastava M21A 5.56mm (Classic Wood)", mod: "RHS", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m21a_wood.png" },
    { id: "rhs_weap_m21s_camo", name: "Zastava M21S Carbine (Camo)", mod: "RHS", factions: ["AAF"], roles: ["Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m21s_camo.png" },
    { id: "rhs_weap_m21s_wood", name: "Zastava M21S Carbine (Classic Wood)", mod: "RHS", factions: ["AAF"], roles: ["Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m21s_wood.png" },
    { id: "rhs_weap_m92_camo", name: "Zastava M92 Carbine (Camo)", mod: "RHS", factions: ["FIA"], roles: ["Medic","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m92_camo.png" },
    { id: "rhs_weap_m92_wood", name: "Zastava M92 Carbine (Classic Wood)", mod: "RHS", factions: ["FIA"], roles: ["Medic","Pilot"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_m92_wood.png" },
    { id: "rhs_weap_vz58p_camo", name: "Sa vz. 58P Fixed Stock (Camo)", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58p_camo.png" },
    { id: "rhs_weap_vz58p_wood", name: "Sa vz. 58P Fixed Stock (Classic Wood)", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58p_wood.png" },
    { id: "rhs_weap_vz58v_camo", name: "Sa vz. 58V Folding Stock (Camo)", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "militia", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58v_camo.png" },
    { id: "rhs_weap_vz58v_wood", name: "Sa vz. 58V Folding Stock (Classic Wood)", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "militia", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58v_wood.png" },
    { id: "rhs_weap_vz58p_ris_camo", name: "vz. 58P Tactical RIS 7.62mm (Camo)", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58p_ris_camo.png" },
    { id: "rhs_weap_vz58p_ris_wood", name: "vz. 58P Tactical RIS 7.62mm (Classic Wood)", mod: "RHS", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58p_ris_wood.png" },
    { id: "rhs_weap_vz58v_ris_camo", name: "Sa vz. 58V RIS Tactical (Camo)", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58v_ris_camo.png" },
    { id: "rhs_weap_vz58v_ris_wood", name: "Sa vz. 58V RIS Tactical (Classic Wood)", mod: "RHS", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vz58v_ris_wood.png" },
    { id: "rhs_weap_vhsd2_camo", name: "VHS-2D 5.56mm Bullpup (Camo)", mod: "RHS", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhsd2_camo.png" },
    { id: "rhs_weap_vhsd2_wood", name: "VHS-2D 5.56mm Bullpup (Classic Wood)", mod: "RHS", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhsd2_wood.png" },
    { id: "rhs_weap_vhsk2_camo", name: "VHS-2K 5.56mm Carbine (Camo)", mod: "RHS", factions: ["NATO","AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhsk2_camo.png" },
    { id: "rhs_weap_vhsk2_wood", name: "VHS-2K 5.56mm Carbine (Classic Wood)", mod: "RHS", factions: ["NATO","AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/rhs_weap_vhsk2_wood.png" },
    { id: "CUP_arifle_L85A2", name: "L85A2 5.56mm Bullpup", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2.png" },
    { id: "CUP_arifle_L85A2_GL", name: "L85A2 UGL 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2_GL.png" },
    { id: "CUP_arifle_L86A2", name: "L86A2 LSW 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner","Marksman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L86A2.png" },
    { id: "CUP_arifle_Mk16_STD", name: "FN SCAR-L 5.56mm STD", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_STD.png" },
    { id: "CUP_arifle_Mk16_CQC", name: "FN SCAR-L CQC 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_CQC.png" },
    { id: "CUP_arifle_Mk17_STD", name: "FN SCAR-H 7.62mm STD", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_STD.png" },
    { id: "CUP_arifle_Mk17_CQC", name: "FN SCAR-H CQC 7.62mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_CQC.png" },
    { id: "CUP_arifle_M4A1_black", name: "M4A1 Railed Black", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_black.png" },
    { id: "CUP_arifle_M4A1_GL_carryhandle", name: "M4A1 M203 Carryhandle", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_GL_carryhandle.png" },
    { id: "CUP_arifle_M16A2", name: "M16A2 Classic (CUP)", mod: "CUP", factions: ["NATO","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A2.png" },
    { id: "CUP_arifle_M16A1", name: "M16A1 Vietnam Classic", mod: "CUP", factions: ["NATO","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A1.png" },
    { id: "CUP_arifle_M16A4_Grip", name: "M16A4 Quad-Rail Grip", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A4_Grip.png" },
    { id: "CUP_arifle_Colt727", name: "Colt Model 727 Carbine", mod: "CUP", factions: ["NATO","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Colt727.png" },
    { id: "CUP_arifle_HK416_Black", name: "HK416 Standard Black", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_Black.png" },
    { id: "CUP_arifle_HK416_CQB_Black", name: "HK416 CQB 10-inch", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_CQB_Black.png" },
    { id: "CUP_arifle_FNF2000", name: "FN F2000 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNF2000.png" },
    { id: "CUP_arifle_FNF2000_GL", name: "FN F2000 EGLM GL", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNF2000_GL.png" },
    { id: "CUP_arifle_XM8_Carbine", name: "XM8 Carbine 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Carbine.png" },
    { id: "CUP_arifle_XM8_Compact", name: "XM8 Compact PDW", mod: "CUP", factions: ["NATO"], roles: ["Medic","Pilot"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Compact.png" },
    { id: "CUP_arifle_XM8_Rail", name: "XM8 Tactical Rail", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Rail.png" },
    { id: "CUP_arifle_ACR_blk_556", name: "Remington ACR 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_ACR_blk_556.png" },
    { id: "CUP_arifle_Steyr_AUG_A1", name: "Steyr AUG A1 5.56mm", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Steyr_AUG_A1.png" },
    { id: "CUP_sgun_M1014", name: "Benelli M1014 Semi-Auto 12G", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_12G_Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_M1014.png" },
    { id: "CUP_sgun_M1014_Entry", name: "Benelli M1014 Entry Short", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_12G_Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_M1014_Entry.png" },
    { id: "CUP_sgun_AA12", name: "AA-12 Auto Shotgun 12G", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "12Gauge", defaultMag: ["CUP_20Rnd_B_AA12_Pellets", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_AA12.png" },
    { id: "CUP_srifle_Mk12SPR", name: "Mk12 Mod 1 SPR 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_Mk12SPR.png" },
    { id: "CUP_srifle_M110", name: "KAC M110 SASS 7.62mm", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M110.png" },
    { id: "CUP_arifle_HK417_20", name: "HK417 20-inch 7.62mm", mod: "CUP", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_20.png" },
    { id: "CUP_srifle_M24_blk", name: "M24 SWS Black (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M24_blk.png" },
    { id: "CUP_srifle_Remington700", name: "Remington 700 Tactical", mod: "CUP", factions: ["NATO"], roles: ["Sniper","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_Remington700.png" },
    { id: "CUP_srifle_G22_des", name: "AWM G22 .300WM Desert", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".300WM", defaultMag: ["CUP_5Rnd_762x67_G22", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_G22_des.png" },
    { id: "CUP_srifle_M107_Base", name: "Barrett M107 (.50 BMG) CUP", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["CUP_10Rnd_127x99_M107", 10], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_M107_Base.png" },
    { id: "CUP_srifle_AS50", name: "Accuracy Int. AS50 .50 BMG", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["CUP_5Rnd_127x99_as50_M", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_AS50.png" },
    { id: "CUP_lmg_M60E4", name: "M60E4 7.62mm", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_M60E4.png" },
    { id: "CUP_lmg_L110A1", name: "L110A1 Para Minimi", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_200Rnd_TE4_Red_Tracer_556x45_M249", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_L110A1.png" },
    { id: "CUP_lmg_Mk48", name: "Mk48 Mod 0 7.62mm SAW", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_Mk48.png" },
    { id: "CUP_lmg_M240", name: "M240 7.62mm Standard", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_M240.png" },
    { id: "CUP_smg_MP5A5", name: "MP5A5 9mm (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5A5.png" },
    { id: "CUP_smg_MP5SD6", name: "MP5SD6 Suppressed (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_MP5SD6.png" },
    { id: "CUP_smg_MP5K", name: "MP5K Compact 9mm", mod: "CUP", factions: ["NATO"], roles: ["Pilot"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5K.png" },
    { id: "CUP_srifle_ASVK", name: "ASVK 12.7mm Modern", mod: "CUP", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_ASVK.png" },
    { id: "CUP_arifle_G36K_camo", name: "G36K AAF Camo", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36K_camo.png" },
    { id: "CUP_arifle_G36A", name: "G36A Full Rifle", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36A.png" },
    { id: "CUP_arifle_G36C", name: "G36C Compact", mod: "CUP", factions: ["AAF"], roles: ["Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36C.png" },
    { id: "CUP_arifle_FNFAL", name: "FN FAL 7.62mm", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL.png" },
    { id: "CUP_arifle_FNFAL5060", name: "FN FAL 50.60 Standard", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5060.png" },
    { id: "CUP_arifle_FNFAL_OSW", name: "DSA SA58 OSW Tactical", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL_OSW.png" },
    { id: "CUP_arifle_G3A3_ris", name: "G3A3 RIS Battle Rifle", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_ris.png" },
    { id: "CUP_arifle_G3A3_modern_ris", name: "G3A3 Modern Tactical", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_modern_ris.png" },
    { id: "CUP_arifle_CZ805_A1", name: "CZ 805 BREN A1 5.56mm", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_CZ805_A1.png" },
    { id: "CUP_arifle_CZ805_GL", name: "CZ 805 BREN GL", mod: "CUP", factions: ["AAF"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_CZ805_GL.png" },
    { id: "CUP_arifle_CZ805_B", name: "CZ 805 BREN 7.62mm", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_CZ805_B.png" },
    { id: "CUP_CZ_BREN2_556_11", name: "CZ BREN 2 5.56mm 11in", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_CZ_BREN2_556_11.png" },
    { id: "CUP_CZ_BREN2_762_14", name: "CZ BREN 2 7.62mm 14in", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_CZ_BREN2_762_14.png" },
    { id: "CUP_srifle_M14_DMR", name: "M14 DMR 7.62mm", mod: "CUP", factions: ["AAF"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M14_DMR.png" },
    { id: "CUP_srifle_CZ750", name: "CZ 750 .308", mod: "CUP", factions: ["AAF"], roles: ["Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_CZ750.png" },
    { id: "CUP_srifle_AWM_des", name: "AWM .338 Desert (CUP)", mod: "CUP", factions: ["AAF"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_AWM_des.png" },
    { id: "CUP_lmg_minimi_railed", name: "M249 Minimi Railed (CUP)", mod: "CUP", factions: ["AAF"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["CUP_200Rnd_TE4_Red_Tracer_556x45_M249", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_minimi_railed.png" },
    { id: "CUP_lmg_MG3", name: "MG3 7.62mm High-Rate", mod: "CUP", factions: ["AAF"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_MG3.png" },
    { id: "CUP_lmg_MG3_rail", name: "MG3 Railed High-Rate", mod: "CUP", factions: ["AAF"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_03_F_oli", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_MG3_rail.png" },
    { id: "CUP_lmg_UK59", name: "UK-59 7.62x54mm Czech LMG", mod: "CUP", factions: ["AAF","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["150Rnd_762x54_Box", 150], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_UK59.png" },
    { id: "CUP_smg_EVO", name: "CZ Scorpion EVO 3 9mm", mod: "CUP", factions: ["AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_EVO.png" },
    { id: "CUP_arifle_CZ805_A2", name: "CZ 805 BREN A2", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_CZ805_A2.png" },
    { id: "CUP_arifle_Galil_SAR", name: "IMI Galil SAR 5.56mm", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_SAR.png" },
    { id: "CUP_arifle_Galil_black", name: "IMI Galil Tactical Black", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_black.png" },
    { id: "CUP_sgun_SPAS12", name: "Franchi SPAS-12 Shotgun", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_12G_Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_SPAS12.png" },
    { id: "CUP_srifle_LeeEnfield", name: "Lee-Enfield No.4 (.303)", mod: "CUP", factions: ["FIA"], roles: ["Marksman"], tier: "militia", caliber: "7.62x54", defaultMag: ["CUP_10x_303_M", 10], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_LeeEnfield.png" },
    { id: "CUP_srifle_FNFAL5061", name: "FN FAL 50.61 Paratrooper", mod: "CUP", factions: ["FIA"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_FNFAL5061.png" },
    { id: "CUP_srifle_M14", name: "M14 Classic Battle Rifle", mod: "CUP", factions: ["FIA"], roles: ["Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M14.png" },
    { id: "CUP_srifle_AWM_wdl", name: "AWM .338 Woodland", mod: "CUP", factions: ["FIA"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_AWM_wdl.png" },
    { id: "CUP_arifle_Galil_ARM", name: "IMI Galil ARM LMG", mod: "CUP", factions: ["FIA","AAF"], roles: ["Machine Gunner"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_ARM.png" },
    { id: "CUP_smg_SA61", name: "Skorpion SA-61 .32 ACP", mod: "CUP", factions: ["FIA"], roles: ["Pilot"], tier: "militia", caliber: "9x21", defaultMag: ["CUP_20Rnd_B_765x17_Ball_M", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_SA61.png" },
    { id: "CUP_smg_Mac10", name: "Ingram MAC-10 .45 ACP", mod: "CUP", factions: ["FIA"], roles: ["Pilot","Medic"], tier: "militia", caliber: ".45ACP", defaultMag: ["30Rnd_45ACP_Mag_SMG_01", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_Mac10.png" },
    { id: "CUP_arifle_FNFAL5062", name: "FN FAL 50.62 Carbine", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5062.png" },
    { id: "CUP_arifle_L1A1_wood", name: "L1A1 SLR Wood Furniture", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L1A1_wood.png" },
    { id: "CUP_arifle_Bren2_556_14", name: "CZ BREN 2 5.56mm 14-inch", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_556_14.png" },
    { id: "CUP_arifle_Bren2_556_11", name: "CZ BREN 2 5.56mm 11-inch CQB", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_556_11.png" },
    { id: "CUP_arifle_Bren2_762_14", name: "CZ BREN 2 7.62x39mm 14-inch", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_762_14.png" },
    { id: "CUP_arifle_Bren2_762_11", name: "CZ BREN 2 7.62x39mm 11-inch CQB", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_762_11.png" },
    { id: "CUP_arifle_Bren2_762_GL", name: "CZ BREN 2 7.62mm GL", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_762_GL.png" },
    { id: "CUP_arifle_HK416_M203_Black", name: "HK416 M203 Black (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_M203_Black.png" },
    { id: "CUP_arifle_HK417_12", name: "HK417 12-inch CQB 7.62mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_12.png" },
    { id: "CUP_arifle_Mk16_SV", name: "FN SCAR-L SV Marksman 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_SV.png" },
    { id: "CUP_arifle_Mk16_STD_EGLM", name: "FN SCAR-L EGLM 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_STD_EGLM.png" },
    { id: "CUP_arifle_Mk20", name: "FN SCAR Mk20 SSR 7.62mm", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk20.png" },
    { id: "CUP_arifle_AUG_A1", name: "Steyr AUG A1 Military 5.56mm", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A1.png" },
    { id: "CUP_arifle_AUG_A3", name: "Steyr AUG A3 Railed 5.56mm", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A3.png" },
    { id: "CUP_arifle_AUG_A3_GL", name: "Steyr AUG A3 GL 5.56mm", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A3_GL.png" },
    { id: "CUP_arifle_G36A_AG36", name: "HK G36A AG36 GL 5.56mm", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36A_AG36.png" },
    { id: "CUP_arifle_XM8_Railed", name: "XM8 Railed Standard 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Railed.png" },
    { id: "CUP_smg_MP5A2", name: "HK MP5A2 Fixed Stock 9mm", mod: "CUP", factions: ["NATO","FIA"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5A2.png" },
    { id: "CUP_smg_MP5A3", name: "HK MP5A3 Collapsible 9mm", mod: "CUP", factions: ["NATO","FIA"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5A3.png" },
    { id: "CUP_arifle_SR3M_Vikhr", name: "SR-3M Vikhr 9x39mm Compact", mod: "CUP", factions: ["CSAT"], roles: ["Pilot","Medic","Rifleman"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_SR3M_Vikhr.png" },
    { id: "CUP_arifle_M4A1_SOMMOD_black", name: "M4A1 SOPMOD Block I (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_SOMMOD_black.png" },
    { id: "CUP_arifle_M4A3_black", name: "M4A3 Match Railed (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A3_black.png" },
    { id: "CUP_arifle_M16A2_GL", name: "M16A2 M203 Classic (CUP)", mod: "CUP", factions: ["NATO","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A2_GL.png" },
    { id: "CUP_arifle_M16A4_Base", name: "M16A4 Quad-Rail (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A4_Base.png" },
    { id: "CUP_arifle_M16A4_GL", name: "M16A4 M203 GL (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A4_GL.png" },
    { id: "CUP_arifle_Mk16_CQC_EGLM", name: "FN SCAR-L CQC EGLM 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_CQC_EGLM.png" },
    { id: "CUP_arifle_Mk17_STD_EGLM", name: "FN SCAR-H EGLM 7.62mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_STD_EGLM.png" },
    { id: "CUP_arifle_G36K_AG36", name: "HK G36K AG36 GL 5.56mm", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36K_AG36.png" },
    { id: "CUP_arifle_MG36", name: "HK MG36 5.56mm SAW (CUP)", mod: "CUP", factions: ["AAF","NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_MG36.png" },
    { id: "CUP_arifle_xm8_sharpshooter", name: "XM8 Sharpshooter DMR 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_xm8_sharpshooter.png" },
    { id: "CUP_arifle_xm8_SAW", name: "XM8 Automatic Rifle 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_xm8_SAW.png" },
    { id: "CUP_arifle_Fort221", name: "Fort-221 (TAR-21) 5.45mm", mod: "CUP", factions: ["CSAT","AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Fort221.png" },
    { id: "CUP_arifle_Fort222", name: "Fort-222 (STAR-21) 5.45mm Marksman", mod: "CUP", factions: ["CSAT","AAF"], roles: ["Marksman"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Fort222.png" },
    { id: "CUP_arifle_X95", name: "IWI X95 Micro-Tavor 5.56mm", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_X95.png" },
    { id: "CUP_arifle_ACR_EGLM_blk_556", name: "Remington ACR EGLM 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_ACR_EGLM_blk_556.png" },
    { id: "CUP_arifle_FAMAS_F1", name: "FAMAS F1 5.56mm Bullpup", mod: "CUP", factions: ["NATO","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FAMAS_F1.png" },
    { id: "CUP_arifle_FAMAS_G2", name: "FAMAS G2 Modern 5.56mm", mod: "CUP", factions: ["NATO","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FAMAS_G2.png" },
    { id: "CUP_srifle_M21", name: "M21 SWS 7.62mm (CUP)", mod: "CUP", factions: ["NATO","FIA"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M21.png" },
    { id: "CUP_srifle_M40A3", name: "M40A3 Marine Sniper 7.62mm", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M40A3.png" },
    { id: "CUP_srifle_M110_black", name: "KAC M110 SASS Black (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M110_black.png" },
    { id: "CUP_srifle_AWM_blk", name: "AWM .338 Black (CUP)", mod: "CUP", factions: ["NATO","FIA"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_AWM_blk.png" },
    { id: "CUP_lmg_M249", name: "M249 SAW Classic (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_200Rnd_TE4_Red_Tracer_556x45_M249", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_M249.png" },
    { id: "CUP_lmg_M249_para", name: "M249 Para SAW (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_200Rnd_TE4_Red_Tracer_556x45_M249", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_M249_para.png" },
    { id: "CUP_lmg_mk48", name: "Mk48 Mod 0 7.62mm (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_mk48.png" },
    { id: "CUP_lmg_L7A2", name: "L7A2 GPMG 7.62mm (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_L7A2.png" },
    { id: "CUP_smg_MP5K_PDW", name: "HK MP5K-PDW 9mm", mod: "CUP", factions: ["NATO","FIA"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5K_PDW.png" },
    { id: "CUP_arifle_L85A2_Grip", name: "L85A2 Foregrip 5.56mm", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2_Grip.png" },
    { id: "CUP_arifle_L86A2_grip", name: "L86A2 LSW Foregrip", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner","Marksman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L86A2_grip.png" },
    { id: "CUP_arifle_HK416_CQB_Wood", name: "HK416 CQB Woodland", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_CQB_Wood.png" },
    { id: "CUP_arifle_HK416_Wood", name: "HK416 Woodland Standard", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_Wood.png" },
    { id: "CUP_arifle_HK417_20_Wood", name: "HK417 20-inch DMR Woodland", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_20_Wood.png" },
    { id: "CUP_arifle_FNFAL5061", name: "FN FAL 50.61 Paratrooper", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5061.png" },
    { id: "CUP_arifle_FNFAL_OSW_railed", name: "DSA-58 FAL OSW Quad-Rail", mod: "CUP", factions: ["NATO","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL_OSW_railed.png" },
    { id: "CUP_arifle_L1A1_rail", name: "L1A1 SLR Tactical Rail", mod: "CUP", factions: ["FIA"], roles: ["Marksman","Rifleman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L1A1_rail.png" },
    { id: "CUP_arifle_G3A3_ris_black", name: "H&K G3A3 RIS Black", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_ris_black.png" },
    { id: "CUP_arifle_Galil_SAR_black", name: "IMI Galil SAR Tactical Black", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_SAR_black.png" },
    { id: "CUP_CZ_BREN2_556_14", name: "CZ BREN 2 5.56mm 14-inch Carbine", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_CZ_BREN2_556_14.png" },
    { id: "CUP_CZ_BREN2_762_11", name: "CZ BREN 2 7.62mm 11-inch CQB", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_89", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_CZ_BREN2_762_11.png" },
    { id: "CUP_smg_MP5A4", name: "H&K MP5A4 Burst", mod: "CUP", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5A4.png" },
    { id: "CUP_smg_MP5SD5", name: "H&K MP5SD5 Integrated Suppressed", mod: "CUP", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_MP5SD5.png" },
    { id: "CUP_lmg_m249_para", name: "M249 Para SAW (CUP)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_lmg_m249_para.png" },
    { id: "CUP_arifle_M4A1_black_desert", name: "M4A1 Railed Black (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_black_desert.png" },
    { id: "CUP_arifle_M4A1_black_woodland", name: "M4A1 Railed Black (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_black_woodland.png" },
    { id: "CUP_arifle_M4A1_black_camo", name: "M4A1 Railed Black (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_black_camo.png" },
    { id: "CUP_arifle_M4A1_GL_carryhandle_desert", name: "M4A1 M203 Carryhandle (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_GL_carryhandle_desert.png" },
    { id: "CUP_arifle_M4A1_GL_carryhandle_woodland", name: "M4A1 M203 Carryhandle (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_GL_carryhandle_woodland.png" },
    { id: "CUP_arifle_M4A1_GL_carryhandle_camo", name: "M4A1 M203 Carryhandle (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M4A1_GL_carryhandle_camo.png" },
    { id: "CUP_arifle_M16A4_Grip_desert", name: "M16A4 Quad-Rail Grip (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A4_Grip_desert.png" },
    { id: "CUP_arifle_M16A4_Grip_woodland", name: "M16A4 Quad-Rail Grip (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A4_Grip_woodland.png" },
    { id: "CUP_arifle_M16A4_Grip_camo", name: "M16A4 Quad-Rail Grip (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_M16A4_Grip_camo.png" },
    { id: "CUP_arifle_HK416_Black_desert", name: "HK416 Standard Black (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_Black_desert.png" },
    { id: "CUP_arifle_HK416_Black_woodland", name: "HK416 Standard Black (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_Black_woodland.png" },
    { id: "CUP_arifle_HK416_Black_camo", name: "HK416 Standard Black (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_Black_camo.png" },
    { id: "CUP_arifle_HK416_CQB_Black_desert", name: "HK416 CQB 10-inch (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_CQB_Black_desert.png" },
    { id: "CUP_arifle_HK416_CQB_Black_woodland", name: "HK416 CQB 10-inch (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_CQB_Black_woodland.png" },
    { id: "CUP_arifle_HK416_CQB_Black_camo", name: "HK416 CQB 10-inch (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK416_CQB_Black_camo.png" },
    { id: "CUP_arifle_HK417_20_desert", name: "HK417 20-inch 7.62mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_20_desert.png" },
    { id: "CUP_arifle_HK417_20_woodland", name: "HK417 20-inch 7.62mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_20_woodland.png" },
    { id: "CUP_arifle_HK417_20_camo", name: "HK417 20-inch 7.62mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_20_camo.png" },
    { id: "CUP_arifle_HK417_12_desert", name: "HK417 12-inch CQB 7.62mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_12_desert.png" },
    { id: "CUP_arifle_HK417_12_woodland", name: "HK417 12-inch CQB 7.62mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_12_woodland.png" },
    { id: "CUP_arifle_HK417_12_camo", name: "HK417 12-inch CQB 7.62mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_HK417_12_camo.png" },
    { id: "CUP_arifle_Mk16_STD_desert", name: "FN SCAR-L 5.56mm STD (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_STD_desert.png" },
    { id: "CUP_arifle_Mk16_STD_woodland", name: "FN SCAR-L 5.56mm STD (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_STD_woodland.png" },
    { id: "CUP_arifle_Mk16_STD_camo", name: "FN SCAR-L 5.56mm STD (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_STD_camo.png" },
    { id: "CUP_arifle_Mk16_CQC_desert", name: "FN SCAR-L CQC 5.56mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_CQC_desert.png" },
    { id: "CUP_arifle_Mk16_CQC_woodland", name: "FN SCAR-L CQC 5.56mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_CQC_woodland.png" },
    { id: "CUP_arifle_Mk16_CQC_camo", name: "FN SCAR-L CQC 5.56mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk16_CQC_camo.png" },
    { id: "CUP_arifle_Mk17_STD_desert", name: "FN SCAR-H 7.62mm STD (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_STD_desert.png" },
    { id: "CUP_arifle_Mk17_STD_woodland", name: "FN SCAR-H 7.62mm STD (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_STD_woodland.png" },
    { id: "CUP_arifle_Mk17_STD_camo", name: "FN SCAR-H 7.62mm STD (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_STD_camo.png" },
    { id: "CUP_arifle_Mk17_CQC_desert", name: "FN SCAR-H CQC 7.62mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_CQC_desert.png" },
    { id: "CUP_arifle_Mk17_CQC_woodland", name: "FN SCAR-H CQC 7.62mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_CQC_woodland.png" },
    { id: "CUP_arifle_Mk17_CQC_camo", name: "FN SCAR-H CQC 7.62mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "cqb", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk17_CQC_camo.png" },
    { id: "CUP_arifle_Mk20_desert", name: "FN SCAR Mk20 SSR 7.62mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk20_desert.png" },
    { id: "CUP_arifle_Mk20_woodland", name: "FN SCAR Mk20 SSR 7.62mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk20_woodland.png" },
    { id: "CUP_arifle_Mk20_camo", name: "FN SCAR Mk20 SSR 7.62mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Mk20_camo.png" },
    { id: "CUP_arifle_ACR_blk_556_desert", name: "Remington ACR 5.56mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_ACR_blk_556_desert.png" },
    { id: "CUP_arifle_ACR_blk_556_woodland", name: "Remington ACR 5.56mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_ACR_blk_556_woodland.png" },
    { id: "CUP_arifle_ACR_blk_556_camo", name: "Remington ACR 5.56mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_ACR_blk_556_camo.png" },
    { id: "CUP_arifle_XM8_Carbine_desert", name: "XM8 Carbine 5.56mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Carbine_desert.png" },
    { id: "CUP_arifle_XM8_Carbine_woodland", name: "XM8 Carbine 5.56mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Carbine_woodland.png" },
    { id: "CUP_arifle_XM8_Carbine_camo", name: "XM8 Carbine 5.56mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Carbine_camo.png" },
    { id: "CUP_arifle_XM8_Compact_desert", name: "XM8 Compact PDW (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Medic","Pilot"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Compact_desert.png" },
    { id: "CUP_arifle_XM8_Compact_woodland", name: "XM8 Compact PDW (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Medic","Pilot"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Compact_woodland.png" },
    { id: "CUP_arifle_XM8_Compact_camo", name: "XM8 Compact PDW (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Medic","Pilot"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Compact_camo.png" },
    { id: "CUP_arifle_XM8_Rail_desert", name: "XM8 Tactical Rail (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Rail_desert.png" },
    { id: "CUP_arifle_XM8_Rail_woodland", name: "XM8 Tactical Rail (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Rail_woodland.png" },
    { id: "CUP_arifle_XM8_Rail_camo", name: "XM8 Tactical Rail (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_XM8_Rail_camo.png" },
    { id: "CUP_arifle_G36A_desert", name: "G36A Full Rifle (Desert)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36A_desert.png" },
    { id: "CUP_arifle_G36A_woodland", name: "G36A Full Rifle (Woodland)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36A_woodland.png" },
    { id: "CUP_arifle_G36A_camo", name: "G36A Full Rifle (Camo)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36A_camo.png" },
    { id: "CUP_arifle_G36C_desert", name: "G36C Compact (Desert)", mod: "CUP", factions: ["AAF"], roles: ["Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36C_desert.png" },
    { id: "CUP_arifle_G36C_woodland", name: "G36C Compact (Woodland)", mod: "CUP", factions: ["AAF"], roles: ["Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36C_woodland.png" },
    { id: "CUP_arifle_G36C_camo", name: "G36C Compact (Camo)", mod: "CUP", factions: ["AAF"], roles: ["Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_556x45_G36", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G36C_camo.png" },
    { id: "CUP_arifle_L85A2_desert", name: "L85A2 5.56mm Bullpup (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2_desert.png" },
    { id: "CUP_arifle_L85A2_woodland", name: "L85A2 5.56mm Bullpup (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2_woodland.png" },
    { id: "CUP_arifle_L85A2_camo", name: "L85A2 5.56mm Bullpup (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2_camo.png" },
    { id: "CUP_arifle_L86A2_desert", name: "L86A2 LSW 5.56mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner","Marksman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L86A2_desert.png" },
    { id: "CUP_arifle_L86A2_woodland", name: "L86A2 LSW 5.56mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner","Marksman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L86A2_woodland.png" },
    { id: "CUP_arifle_L86A2_camo", name: "L86A2 LSW 5.56mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner","Marksman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L86A2_camo.png" },
    { id: "CUP_arifle_Steyr_AUG_A1_desert", name: "Steyr AUG A1 5.56mm (Desert)", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Steyr_AUG_A1_desert.png" },
    { id: "CUP_arifle_Steyr_AUG_A1_woodland", name: "Steyr AUG A1 5.56mm (Woodland)", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Steyr_AUG_A1_woodland.png" },
    { id: "CUP_arifle_Steyr_AUG_A1_camo", name: "Steyr AUG A1 5.56mm (Camo)", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Steyr_AUG_A1_camo.png" },
    { id: "CUP_arifle_FNFAL_desert", name: "FN FAL 7.62mm (Desert)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL_desert.png" },
    { id: "CUP_arifle_FNFAL_woodland", name: "FN FAL 7.62mm (Woodland)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL_woodland.png" },
    { id: "CUP_arifle_FNFAL_camo", name: "FN FAL 7.62mm (Camo)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL_camo.png" },
    { id: "CUP_arifle_FNFAL5060_desert", name: "FN FAL 50.60 Standard (Desert)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5060_desert.png" },
    { id: "CUP_arifle_FNFAL5060_woodland", name: "FN FAL 50.60 Standard (Woodland)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5060_woodland.png" },
    { id: "CUP_arifle_FNFAL5060_camo", name: "FN FAL 50.60 Standard (Camo)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5060_camo.png" },
    { id: "CUP_arifle_G3A3_ris_desert", name: "G3A3 RIS Battle Rifle (Desert)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_ris_desert.png" },
    { id: "CUP_arifle_G3A3_ris_woodland", name: "G3A3 RIS Battle Rifle (Woodland)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_ris_woodland.png" },
    { id: "CUP_arifle_G3A3_ris_camo", name: "G3A3 RIS Battle Rifle (Camo)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_ris_camo.png" },
    { id: "CUP_arifle_Galil_SAR_desert", name: "IMI Galil SAR 5.56mm (Desert)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_SAR_desert.png" },
    { id: "CUP_arifle_Galil_SAR_woodland", name: "IMI Galil SAR 5.56mm (Woodland)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_SAR_woodland.png" },
    { id: "CUP_arifle_Galil_SAR_camo", name: "IMI Galil SAR 5.56mm (Camo)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_SAR_camo.png" },
    { id: "CUP_arifle_Galil_black_desert", name: "IMI Galil Tactical Black (Desert)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_black_desert.png" },
    { id: "CUP_arifle_Galil_black_woodland", name: "IMI Galil Tactical Black (Woodland)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_black_woodland.png" },
    { id: "CUP_arifle_Galil_black_camo", name: "IMI Galil Tactical Black (Camo)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_black_camo.png" },
    { id: "CUP_arifle_CZ805_A1_desert", name: "CZ 805 BREN A1 5.56mm (Desert)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_CZ805_A1_desert.png" },
    { id: "CUP_arifle_CZ805_A1_woodland", name: "CZ 805 BREN A1 5.56mm (Woodland)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_CZ805_A1_woodland.png" },
    { id: "CUP_arifle_CZ805_A1_camo", name: "CZ 805 BREN A1 5.56mm (Camo)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_CZ805_A1_camo.png" },
    { id: "CUP_arifle_Bren2_556_14_desert", name: "CZ BREN 2 5.56mm 14-inch (Desert)", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_556_14_desert.png" },
    { id: "CUP_arifle_Bren2_556_14_woodland", name: "CZ BREN 2 5.56mm 14-inch (Woodland)", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_556_14_woodland.png" },
    { id: "CUP_arifle_Bren2_556_14_camo", name: "CZ BREN 2 5.56mm 14-inch (Camo)", mod: "CUP", factions: ["NATO","AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_556_14_camo.png" },
    { id: "CUP_lmg_M240_desert", name: "M240 7.62mm Standard (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_M240_desert.png" },
    { id: "CUP_lmg_M240_woodland", name: "M240 7.62mm Standard (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_M240_woodland.png" },
    { id: "CUP_lmg_M240_camo", name: "M240 7.62mm Standard (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_M240_camo.png" },
    { id: "CUP_srifle_M40A3_desert", name: "M40A3 Marine Sniper 7.62mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M40A3_desert.png" },
    { id: "CUP_srifle_M40A3_woodland", name: "M40A3 Marine Sniper 7.62mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M40A3_woodland.png" },
    { id: "CUP_srifle_M40A3_camo", name: "M40A3 Marine Sniper 7.62mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M40A3_camo.png" },
    { id: "CUP_srifle_M24_blk_desert", name: "M24 SWS Black (CUP) (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M24_blk_desert.png" },
    { id: "CUP_srifle_M24_blk_woodland", name: "M24 SWS Black (CUP) (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M24_blk_woodland.png" },
    { id: "CUP_srifle_M24_blk_camo", name: "M24 SWS Black (CUP) (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M24_blk_camo.png" },
    { id: "CUP_srifle_M110_black_desert", name: "KAC M110 SASS Black (CUP) (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M110_black_desert.png" },
    { id: "CUP_srifle_M110_black_woodland", name: "KAC M110 SASS Black (CUP) (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M110_black_woodland.png" },
    { id: "CUP_srifle_M110_black_camo", name: "KAC M110 SASS Black (CUP) (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_M110_black_camo.png" },
    { id: "CUP_srifle_AS50_desert", name: "Accuracy Int. AS50 .50 BMG (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["CUP_5Rnd_127x99_as50_M", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_AS50_desert.png" },
    { id: "CUP_srifle_AS50_woodland", name: "Accuracy Int. AS50 .50 BMG (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["CUP_5Rnd_127x99_as50_M", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_AS50_woodland.png" },
    { id: "CUP_srifle_AS50_camo", name: "Accuracy Int. AS50 .50 BMG (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".50BMG", defaultMag: ["CUP_5Rnd_127x99_as50_M", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_AS50_camo.png" },
    { id: "CUP_smg_MP5A5_desert", name: "MP5A5 9mm (CUP) (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5A5_desert.png" },
    { id: "CUP_smg_MP5A5_woodland", name: "MP5A5 9mm (CUP) (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5A5_woodland.png" },
    { id: "CUP_smg_MP5A5_camo", name: "MP5A5 9mm (CUP) (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_MP5A5_camo.png" },
    { id: "CUP_smg_MP5SD6_desert", name: "MP5SD6 Suppressed (CUP) (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_MP5SD6_desert.png" },
    { id: "CUP_smg_MP5SD6_woodland", name: "MP5SD6 Suppressed (CUP) (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_MP5SD6_woodland.png" },
    { id: "CUP_smg_MP5SD6_camo", name: "MP5SD6 Suppressed (CUP) (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_MP5SD6_camo.png" },
    { id: "CUP_arifle_L85A2_GL_desert", name: "L85A2 UGL 5.56mm (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2_GL_desert.png" },
    { id: "CUP_arifle_L85A2_GL_woodland", name: "L85A2 UGL 5.56mm (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2_GL_woodland.png" },
    { id: "CUP_arifle_L85A2_GL_camo", name: "L85A2 UGL 5.56mm (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L85A2_GL_camo.png" },
    { id: "CUP_arifle_L86A2_grip_desert", name: "L86A2 LSW Foregrip (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner","Marksman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L86A2_grip_desert.png" },
    { id: "CUP_arifle_L86A2_grip_woodland", name: "L86A2 LSW Foregrip (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner","Marksman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L86A2_grip_woodland.png" },
    { id: "CUP_arifle_L86A2_grip_camo", name: "L86A2 LSW Foregrip (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner","Marksman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_L86A2_grip_camo.png" },
    { id: "CUP_arifle_AUG_A1_desert", name: "Steyr AUG A1 Military 5.56mm (Desert)", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A1_desert.png" },
    { id: "CUP_arifle_AUG_A1_woodland", name: "Steyr AUG A1 Military 5.56mm (Woodland)", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A1_woodland.png" },
    { id: "CUP_arifle_AUG_A1_camo", name: "Steyr AUG A1 Military 5.56mm (Camo)", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A1_camo.png" },
    { id: "CUP_arifle_AUG_A3_desert", name: "Steyr AUG A3 Railed 5.56mm (Desert)", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A3_desert.png" },
    { id: "CUP_arifle_AUG_A3_woodland", name: "Steyr AUG A3 Railed 5.56mm (Woodland)", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A3_woodland.png" },
    { id: "CUP_arifle_AUG_A3_camo", name: "Steyr AUG A3 Railed 5.56mm (Camo)", mod: "CUP", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AUG_A3_camo.png" },
    { id: "CUP_arifle_FNFAL5061_desert", name: "FN FAL 50.61 Paratrooper (Desert)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5061_desert.png" },
    { id: "CUP_arifle_FNFAL5061_woodland", name: "FN FAL 50.61 Paratrooper (Woodland)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5061_woodland.png" },
    { id: "CUP_arifle_FNFAL5061_camo", name: "FN FAL 50.61 Paratrooper (Camo)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL5061_camo.png" },
    { id: "CUP_arifle_FNFAL_OSW_desert", name: "DSA SA58 OSW Tactical (Desert)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL_OSW_desert.png" },
    { id: "CUP_arifle_FNFAL_OSW_woodland", name: "DSA SA58 OSW Tactical (Woodland)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL_OSW_woodland.png" },
    { id: "CUP_arifle_FNFAL_OSW_camo", name: "DSA SA58 OSW Tactical (Camo)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_FNFAL_OSW_camo.png" },
    { id: "CUP_arifle_G3A3_modern_ris_desert", name: "G3A3 Modern Tactical (Desert)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_modern_ris_desert.png" },
    { id: "CUP_arifle_G3A3_modern_ris_woodland", name: "G3A3 Modern Tactical (Woodland)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_modern_ris_woodland.png" },
    { id: "CUP_arifle_G3A3_modern_ris_camo", name: "G3A3 Modern Tactical (Camo)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_G3A3_modern_ris_camo.png" },
    { id: "CUP_arifle_Galil_ARM_desert", name: "IMI Galil ARM LMG (Desert)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Machine Gunner"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_ARM_desert.png" },
    { id: "CUP_arifle_Galil_ARM_woodland", name: "IMI Galil ARM LMG (Woodland)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Machine Gunner"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_ARM_woodland.png" },
    { id: "CUP_arifle_Galil_ARM_camo", name: "IMI Galil ARM LMG (Camo)", mod: "CUP", factions: ["FIA","AAF"], roles: ["Machine Gunner"], tier: "militia", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Galil_ARM_camo.png" },
    { id: "CUP_arifle_Bren2_762_14_desert", name: "CZ BREN 2 7.62x39mm 14-inch (Desert)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_762_14_desert.png" },
    { id: "CUP_arifle_Bren2_762_14_woodland", name: "CZ BREN 2 7.62x39mm 14-inch (Woodland)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_762_14_woodland.png" },
    { id: "CUP_arifle_Bren2_762_14_camo", name: "CZ BREN 2 7.62x39mm 14-inch (Camo)", mod: "CUP", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bren2_762_14_camo.png" },
    { id: "CUP_CZ_BREN2_556_11_desert", name: "CZ BREN 2 5.56mm 11in (Desert)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_CZ_BREN2_556_11_desert.png" },
    { id: "CUP_CZ_BREN2_556_11_woodland", name: "CZ BREN 2 5.56mm 11in (Woodland)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_CZ_BREN2_556_11_woodland.png" },
    { id: "CUP_CZ_BREN2_556_11_camo", name: "CZ BREN 2 5.56mm 11in (Camo)", mod: "CUP", factions: ["AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_CZ_BREN2_556_11_camo.png" },
    { id: "CUP_lmg_L110A1_desert", name: "L110A1 Para Minimi (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_200Rnd_TE4_Red_Tracer_556x45_M249", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_L110A1_desert.png" },
    { id: "CUP_lmg_L110A1_woodland", name: "L110A1 Para Minimi (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_200Rnd_TE4_Red_Tracer_556x45_M249", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_L110A1_woodland.png" },
    { id: "CUP_lmg_L110A1_camo", name: "L110A1 Para Minimi (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_200Rnd_TE4_Red_Tracer_556x45_M249", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_L110A1_camo.png" },
    { id: "CUP_lmg_m249_para_desert", name: "M249 Para SAW (CUP) (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_lmg_m249_para_desert.png" },
    { id: "CUP_lmg_m249_para_woodland", name: "M249 Para SAW (CUP) (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_lmg_m249_para_woodland.png" },
    { id: "CUP_lmg_m249_para_camo", name: "M249 Para SAW (CUP) (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_lmg_m249_para_camo.png" },
    { id: "CUP_srifle_AWM_blk_desert", name: "AWM .338 Black (CUP) (Desert)", mod: "CUP", factions: ["NATO","FIA"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_AWM_blk_desert.png" },
    { id: "CUP_srifle_AWM_blk_woodland", name: "AWM .338 Black (CUP) (Woodland)", mod: "CUP", factions: ["NATO","FIA"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_AWM_blk_woodland.png" },
    { id: "CUP_srifle_AWM_blk_camo", name: "AWM .338 Black (CUP) (Camo)", mod: "CUP", factions: ["NATO","FIA"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_AWM_blk_camo.png" },
    { id: "CUP_sgun_M1014_desert", name: "Benelli M1014 Semi-Auto 12G (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_12G_Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_M1014_desert.png" },
    { id: "CUP_sgun_M1014_woodland", name: "Benelli M1014 Semi-Auto 12G (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_12G_Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_M1014_woodland.png" },
    { id: "CUP_sgun_M1014_camo", name: "Benelli M1014 Semi-Auto 12G (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_12G_Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_M1014_camo.png" },
    { id: "CUP_sgun_AA12_desert", name: "AA-12 Auto Shotgun 12G (Desert)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "12Gauge", defaultMag: ["CUP_20Rnd_B_AA12_Pellets", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_AA12_desert.png" },
    { id: "CUP_sgun_AA12_woodland", name: "AA-12 Auto Shotgun 12G (Woodland)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "12Gauge", defaultMag: ["CUP_20Rnd_B_AA12_Pellets", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_AA12_woodland.png" },
    { id: "CUP_sgun_AA12_camo", name: "AA-12 Auto Shotgun 12G (Camo)", mod: "CUP", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "12Gauge", defaultMag: ["CUP_20Rnd_B_AA12_Pellets", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_AA12_camo.png" },
    { id: "CUP_arifle_AK74M", name: "AK-74M 5.45mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74M.png" },
    { id: "CUP_arifle_AK101", name: "AK-101 5.56mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK101.png" },
    { id: "CUP_arifle_AK103", name: "AK-103 7.62mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK103.png" },
    { id: "CUP_arifle_AK107", name: "AK-107 Balanced 5.45mm", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK107.png" },
    { id: "CUP_arifle_AK109", name: "AK-109 Balanced 7.62mm", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK109.png" },
    { id: "CUP_arifle_AK12_black", name: "AK-12 5.45mm Black (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK12_black.png" },
    { id: "CUP_arifle_AK15_black", name: "AK-15 7.62mm Black (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK15_black.png" },
    { id: "CUP_arifle_AKS74U", name: "AKS-74U Krinkov (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Medic","Pilot","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AKS74U.png" },
    { id: "CUP_arifle_Groza", name: "OTs-14 Groza 9x39mm", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Groza.png" },
    { id: "CUP_sgun_Saiga12K", name: "Saiga-12K Combat Shotgun", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_B_Saiga12_74Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_Saiga12K.png" },
    { id: "CUP_srifle_SVD_wdl", name: "SVD Dragunov 7.62mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["CUP_10Rnd_762x54_SVD_M", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_wdl.png" },
    { id: "CUP_srifle_VSSVintorez", name: "VSS Vintorez (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_10rnd_9x39mm_SP5", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez.png" },
    { id: "CUP_srifle_KSVK", name: "KSVK 12.7mm Bullpup", mod: "CUP", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_KSVK.png" },
    { id: "CUP_lmg_PKM", name: "PKM 7.62mm (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["CUP_100Rnd_TE4_LRT4_762x54_PK_Tracer_Green_M", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_PKM.png" },
    { id: "CUP_lmg_Pecheneg", name: "PKP Pecheneg 7.62mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["150Rnd_762x54_Box", 150], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_Pecheneg.png" },
    { id: "CUP_arifle_RPK74M", name: "RPK-74M 5.45mm LMG (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_45Rnd_TE4_LRT4_Green_Tracer_545x39_RPK_M", 45], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_RPK74M.png" },
    { id: "CUP_arifle_RPK74", name: "RPK-74 Classic Wood LMG", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_45Rnd_TE4_LRT4_Green_Tracer_545x39_RPK_M", 45], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_RPK74.png" },
    { id: "CUP_arifle_Bizon", name: "PP-19 Bizon 64-round", mod: "CUP", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["CUP_64Rnd_9x19_Bizon_M", 64], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Bizon.png" },
    { id: "CUP_smg_bizon", name: "PP-19 Bizon SD", mod: "CUP", factions: ["CSAT"], roles: ["Pilot"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_64Rnd_9x19_Bizon_M", 64], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_bizon.png" },
    { id: "CUP_smg_vityaz", name: "PP-19-01 Vityaz 9mm", mod: "CUP", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_vityaz.png" },
    { id: "CUP_arifle_AKM", name: "AKM 7.62x39mm (CUP)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AKM.png" },
    { id: "CUP_arifle_AK47", name: "AK-47 Type 3 (CUP)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_AK47.png" },
    { id: "CUP_arifle_Sa58P", name: "Vz.58 Fixed Stock 7.62mm", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58P.png" },
    { id: "CUP_arifle_Sa58V", name: "Vz.58 Folding Stock", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58V.png" },
    { id: "CUP_arifle_Sa58_RIS1", name: "Vz.58 Tactical RIS", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58_RIS1.png" },
    { id: "CUP_srifle_Mosin_Nagant", name: "Mosin-Nagant 1891/30", mod: "CUP", factions: ["FIA"], roles: ["Marksman","Sniper"], tier: "militia", caliber: "7.62x54", defaultMag: ["CUP_5Rnd_762x54_Mosin_M", 5], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_Mosin_Nagant.png" },
    { id: "CUP_srifle_CZ550", name: "CZ 550 Hunting Rifle", mod: "CUP", factions: ["FIA"], roles: ["Sniper"], tier: "militia", caliber: "7.62x51", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_CZ550.png" },
    { id: "CUP_arifle_AK47_GL", name: "AK-47 Type 3 GP-25", mod: "CUP", factions: ["FIA"], roles: ["Rifleman"], tier: "militia", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_AK47_GL.png" },
    { id: "CUP_arifle_AK47_top_rail", name: "AK-47 Type 3 Railed", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "militia", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_AK47_top_rail.png" },
    { id: "CUP_arifle_AKM_GL", name: "AKM GP-25 7.62mm (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AKM_GL.png" },
    { id: "CUP_arifle_AKM_top_rail", name: "AKM Railed 7.62mm (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AKM_top_rail.png" },
    { id: "CUP_arifle_AKMS_GL", name: "AKMS GP-25 7.62mm (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AKMS_GL.png" },
    { id: "CUP_arifle_AK74_GL", name: "AK-74 GP-25 5.45mm (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74_GL.png" },
    { id: "CUP_arifle_AK74_top_rail", name: "AK-74 Railed 5.45mm (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74_top_rail.png" },
    { id: "CUP_arifle_AKS74_GL", name: "AKS-74 GP-25 5.45mm (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AKS74_GL.png" },
    { id: "CUP_arifle_AKS74U_top_rail", name: "AKS-74U Railed 5.45mm", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Pilot","Medic"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AKS74U_top_rail.png" },
    { id: "CUP_arifle_AK74M_GL", name: "AK-74M GP-25 5.45mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74M_GL.png" },
    { id: "CUP_arifle_AK74M_railed", name: "AK-74M Tactical Railed (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74M_railed.png" },
    { id: "CUP_arifle_AK101_GL", name: "AK-101 GP-25 5.56mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK101_GL.png" },
    { id: "CUP_arifle_AK101_railed", name: "AK-101 Tactical Railed 5.56mm", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK101_railed.png" },
    { id: "CUP_arifle_AK103_GL", name: "AK-103 GP-25 7.62mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK103_GL.png" },
    { id: "CUP_arifle_AK103_railed", name: "AK-103 Tactical Railed 7.62mm", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK103_railed.png" },
    { id: "CUP_arifle_AK107_GL", name: "AK-107 GP-25 5.45mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK107_GL.png" },
    { id: "CUP_arifle_AK107_railed", name: "AK-107 Tactical Railed 5.45mm", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK107_railed.png" },
    { id: "CUP_arifle_AK108_GL", name: "AK-108 GP-25 5.56mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK108_GL.png" },
    { id: "CUP_arifle_AK109_GL", name: "AK-109 GP-25 7.62mm (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK109_GL.png" },
    { id: "CUP_srifle_SVD_top_rail", name: "SVD Dragunov Railed (CUP)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_top_rail.png" },
    { id: "CUP_srifle_VSSVintorez_top_rail", name: "VSS Vintorez Railed (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez_top_rail.png" },
    { id: "CUP_srifle_ASVAL", name: "AS Val Suppressed Rifle (CUP)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_ASVAL.png" },
    { id: "CUP_smg_vityaz_vfg", name: "PP-19-01 Vityaz Grip 9mm", mod: "CUP", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_vityaz_vfg.png" },
    { id: "CUP_srifle_CZ550_rail", name: "CZ 550 Hunting Railed .300WM", mod: "CUP", factions: ["FIA"], roles: ["Sniper","Marksman"], tier: "militia", caliber: ".300WM", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_CZ550_rail.png" },
    { id: "CUP_arifle_Sa58_RIS2", name: "Sa vz. 58 Tactical RIS 2", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58_RIS2.png" },
    { id: "CUP_srifle_SVD_des", name: "SVD Dragunov Desert Camo", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "long", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_des.png" },
    { id: "CUP_srifle_VSSVintorez_flash", name: "VSS Vintorez Tactical Flash", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP6", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez_flash.png" },
    { id: "CUP_arifle_AS_VAL_flash", name: "AS Val Tactical Flash", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP6", 20], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_AS_VAL_flash.png" },
    { id: "CUP_sgun_Saiga12K_top_rail", name: "Saiga-12K Top Rail 12G", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "12Gauge", defaultMag: ["rhs_8Rnd_00Buck", 8], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_sgun_Saiga12K_top_rail.png" },
    { id: "CUP_srifle_CZ550_desert", name: "CZ 550 Hunting Rifle (Desert)", mod: "CUP", factions: ["FIA"], roles: ["Sniper"], tier: "militia", caliber: "7.62x51", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_CZ550_desert.png" },
    { id: "CUP_srifle_CZ550_woodland", name: "CZ 550 Hunting Rifle (Woodland)", mod: "CUP", factions: ["FIA"], roles: ["Sniper"], tier: "militia", caliber: "7.62x51", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_CZ550_woodland.png" },
    { id: "CUP_srifle_CZ550_camo", name: "CZ 550 Hunting Rifle (Camo)", mod: "CUP", factions: ["FIA"], roles: ["Sniper"], tier: "militia", caliber: "7.62x51", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_CZ550_camo.png" },
    { id: "CUP_arifle_AK74M_desert", name: "AK-74M 5.45mm (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74M_desert.png" },
    { id: "CUP_arifle_AK74M_woodland", name: "AK-74M 5.45mm (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74M_woodland.png" },
    { id: "CUP_arifle_AK74M_GL_desert", name: "AK-74M GP-25 5.45mm (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74M_GL_desert.png" },
    { id: "CUP_arifle_AK74M_GL_woodland", name: "AK-74M GP-25 5.45mm (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74M_GL_woodland.png" },
    { id: "CUP_arifle_AK74M_GL_railed", name: "AK-74M GP-25 5.45mm (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK74_plum_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK74M_GL_railed.png" },
    { id: "CUP_arifle_AK103_desert", name: "AK-103 7.62mm (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK103_desert.png" },
    { id: "CUP_arifle_AK103_woodland", name: "AK-103 7.62mm (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK103_woodland.png" },
    { id: "CUP_arifle_AK107_desert", name: "AK-107 Balanced 5.45mm (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK107_desert.png" },
    { id: "CUP_arifle_AK107_woodland", name: "AK-107 Balanced 5.45mm (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK107_woodland.png" },
    { id: "CUP_arifle_AK12_black_desert", name: "AK-12 5.45mm Black (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK12_black_desert.png" },
    { id: "CUP_arifle_AK12_black_woodland", name: "AK-12 5.45mm Black (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK12_black_woodland.png" },
    { id: "CUP_arifle_AK12_black_railed", name: "AK-12 5.45mm Black (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK12_black_railed.png" },
    { id: "CUP_arifle_AK15_black_desert", name: "AK-15 7.62mm Black (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK15_black_desert.png" },
    { id: "CUP_arifle_AK15_black_woodland", name: "AK-15 7.62mm Black (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK15_black_woodland.png" },
    { id: "CUP_arifle_AK15_black_railed", name: "AK-15 7.62mm Black (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_AK15_black_railed.png" },
    { id: "CUP_arifle_Sa58P_desert", name: "Vz.58 Fixed Stock 7.62mm (Desert)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58P_desert.png" },
    { id: "CUP_arifle_Sa58P_woodland", name: "Vz.58 Fixed Stock 7.62mm (Woodland)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58P_woodland.png" },
    { id: "CUP_arifle_Sa58P_railed", name: "Vz.58 Fixed Stock 7.62mm (Tactical Rail)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58P_railed.png" },
    { id: "CUP_arifle_Sa58V_desert", name: "Vz.58 Folding Stock (Desert)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58V_desert.png" },
    { id: "CUP_arifle_Sa58V_woodland", name: "Vz.58 Folding Stock (Woodland)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58V_woodland.png" },
    { id: "CUP_arifle_Sa58V_railed", name: "Vz.58 Folding Stock (Tactical Rail)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58V_railed.png" },
    { id: "CUP_arifle_RPK74M_desert", name: "RPK-74M 5.45mm LMG (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_45Rnd_TE4_LRT4_Green_Tracer_545x39_RPK_M", 45], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_RPK74M_desert.png" },
    { id: "CUP_arifle_RPK74M_woodland", name: "RPK-74M 5.45mm LMG (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_45Rnd_TE4_LRT4_Green_Tracer_545x39_RPK_M", 45], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_RPK74M_woodland.png" },
    { id: "CUP_arifle_RPK74M_railed", name: "RPK-74M 5.45mm LMG (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_45Rnd_TE4_LRT4_Green_Tracer_545x39_RPK_M", 45], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_arifle_RPK74M_railed.png" },
    { id: "CUP_lmg_PKM_desert", name: "PKM 7.62mm (CUP) (Desert)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["CUP_100Rnd_TE4_LRT4_762x54_PK_Tracer_Green_M", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_PKM_desert.png" },
    { id: "CUP_lmg_PKM_woodland", name: "PKM 7.62mm (CUP) (Woodland)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["CUP_100Rnd_TE4_LRT4_762x54_PK_Tracer_Green_M", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_PKM_woodland.png" },
    { id: "CUP_lmg_PKM_railed", name: "PKM 7.62mm (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["CUP_100Rnd_TE4_LRT4_762x54_PK_Tracer_Green_M", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_PKM_railed.png" },
    { id: "CUP_lmg_Pecheneg_desert", name: "PKP Pecheneg 7.62mm (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["150Rnd_762x54_Box", 150], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_Pecheneg_desert.png" },
    { id: "CUP_lmg_Pecheneg_woodland", name: "PKP Pecheneg 7.62mm (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["150Rnd_762x54_Box", 150], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_Pecheneg_woodland.png" },
    { id: "CUP_lmg_Pecheneg_railed", name: "PKP Pecheneg 7.62mm (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x54", defaultMag: ["150Rnd_762x54_Box", 150], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_lmg_Pecheneg_railed.png" },
    { id: "CUP_srifle_SVD_wdl_desert", name: "SVD Dragunov 7.62mm (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["CUP_10Rnd_762x54_SVD_M", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_wdl_desert.png" },
    { id: "CUP_srifle_SVD_wdl_woodland", name: "SVD Dragunov 7.62mm (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["CUP_10Rnd_762x54_SVD_M", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_wdl_woodland.png" },
    { id: "CUP_srifle_SVD_wdl_railed", name: "SVD Dragunov 7.62mm (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["CUP_10Rnd_762x54_SVD_M", 10], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_wdl_railed.png" },
    { id: "CUP_srifle_VSSVintorez_desert", name: "VSS Vintorez (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_10rnd_9x39mm_SP5", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez_desert.png" },
    { id: "CUP_srifle_VSSVintorez_woodland", name: "VSS Vintorez (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_10rnd_9x39mm_SP5", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez_woodland.png" },
    { id: "CUP_srifle_VSSVintorez_railed", name: "VSS Vintorez (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_10rnd_9x39mm_SP5", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez_railed.png" },
    { id: "CUP_srifle_KSVK_desert", name: "KSVK 12.7mm Bullpup (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_KSVK_desert.png" },
    { id: "CUP_srifle_KSVK_woodland", name: "KSVK 12.7mm Bullpup (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_KSVK_woodland.png" },
    { id: "CUP_srifle_KSVK_railed", name: "KSVK 12.7mm Bullpup (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Sniper"], tier: "specops", caliber: "12.7x108", defaultMag: ["5Rnd_127x108_Mag", 5], opticType: "long", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_KSVK_railed.png" },
    { id: "CUP_srifle_Mosin_Nagant_desert", name: "Mosin-Nagant 1891/30 (Desert)", mod: "CUP", factions: ["FIA"], roles: ["Marksman","Sniper"], tier: "militia", caliber: "7.62x54", defaultMag: ["CUP_5Rnd_762x54_Mosin_M", 5], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_Mosin_Nagant_desert.png" },
    { id: "CUP_srifle_Mosin_Nagant_woodland", name: "Mosin-Nagant 1891/30 (Woodland)", mod: "CUP", factions: ["FIA"], roles: ["Marksman","Sniper"], tier: "militia", caliber: "7.62x54", defaultMag: ["CUP_5Rnd_762x54_Mosin_M", 5], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_Mosin_Nagant_woodland.png" },
    { id: "CUP_srifle_Mosin_Nagant_railed", name: "Mosin-Nagant 1891/30 (Tactical Rail)", mod: "CUP", factions: ["FIA"], roles: ["Marksman","Sniper"], tier: "militia", caliber: "7.62x54", defaultMag: ["CUP_5Rnd_762x54_Mosin_M", 5], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_Mosin_Nagant_railed.png" },
    { id: "CUP_sgun_Saiga12K_desert", name: "Saiga-12K Combat Shotgun (Desert)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_B_Saiga12_74Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_Saiga12K_desert.png" },
    { id: "CUP_sgun_Saiga12K_woodland", name: "Saiga-12K Combat Shotgun (Woodland)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_B_Saiga12_74Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_Saiga12K_woodland.png" },
    { id: "CUP_sgun_Saiga12K_railed", name: "Saiga-12K Combat Shotgun (Tactical Rail)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "12Gauge", defaultMag: ["CUP_8Rnd_B_Saiga12_74Slug", 8], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_sgun_Saiga12K_railed.png" },
    { id: "CUP_smg_vityaz_desert", name: "PP-19-01 Vityaz 9mm (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_vityaz_desert.png" },
    { id: "CUP_smg_vityaz_woodland", name: "PP-19-01 Vityaz 9mm (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_vityaz_woodland.png" },
    { id: "CUP_smg_vityaz_railed", name: "PP-19-01 Vityaz 9mm (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_smg_vityaz_railed.png" },
    { id: "CUP_smg_bizon_desert", name: "PP-19 Bizon SD (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Pilot"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_64Rnd_9x19_Bizon_M", 64], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_bizon_desert.png" },
    { id: "CUP_smg_bizon_woodland", name: "PP-19 Bizon SD (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Pilot"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_64Rnd_9x19_Bizon_M", 64], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_bizon_woodland.png" },
    { id: "CUP_smg_bizon_railed", name: "PP-19 Bizon SD (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Pilot"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_64Rnd_9x19_Bizon_M", 64], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_smg_bizon_railed.png" },
    { id: "CUP_arifle_Sa58_RIS1_desert", name: "Vz.58 Tactical RIS (Desert)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58_RIS1_desert.png" },
    { id: "CUP_arifle_Sa58_RIS1_woodland", name: "Vz.58 Tactical RIS (Woodland)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58_RIS1_woodland.png" },
    { id: "CUP_arifle_Sa58_RIS1_railed", name: "Vz.58 Tactical RIS (Tactical Rail)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_Sa58_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58_RIS1_railed.png" },
    { id: "CUP_arifle_Sa58_RIS2_desert", name: "Sa vz. 58 Tactical RIS 2 (Desert)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58_RIS2_desert.png" },
    { id: "CUP_arifle_Sa58_RIS2_woodland", name: "Sa vz. 58 Tactical RIS 2 (Woodland)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58_RIS2_woodland.png" },
    { id: "CUP_arifle_Sa58_RIS2_railed", name: "Sa vz. 58 Tactical RIS 2 (Tactical Rail)", mod: "CUP", factions: ["FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm_Savz58", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_arifle_Sa58_RIS2_railed.png" },
    { id: "CUP_srifle_VSSVintorez_top_rail_desert", name: "VSS Vintorez Railed (CUP) (Desert)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez_top_rail_desert.png" },
    { id: "CUP_srifle_VSSVintorez_top_rail_woodland", name: "VSS Vintorez Railed (CUP) (Woodland)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez_top_rail_woodland.png" },
    { id: "CUP_srifle_VSSVintorez_top_rail_railed", name: "VSS Vintorez Railed (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "9x21", defaultMag: ["rhs_20rnd_9x39mm_SP5", 20], opticType: "mid", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/CUP_srifle_VSSVintorez_top_rail_railed.png" },
    { id: "CUP_srifle_SVD_top_rail_desert", name: "SVD Dragunov Railed (CUP) (Desert)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_top_rail_desert.png" },
    { id: "CUP_srifle_SVD_top_rail_woodland", name: "SVD Dragunov Railed (CUP) (Woodland)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_top_rail_woodland.png" },
    { id: "CUP_srifle_SVD_top_rail_railed", name: "SVD Dragunov Railed (CUP) (Tactical Rail)", mod: "CUP", factions: ["CSAT","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_10Rnd_762x54mmR_7N1", 10], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/CUP_srifle_SVD_top_rail_railed.png" },
    { id: "hlc_rifle_416D145_CAG", name: "HK416D14.5 CAG", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D145_CAG.png" },
    { id: "hlc_rifle_416D10", name: "HK416D10 CQB", mod: "NIArms", factions: ["NATO"], roles: ["Medic","Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D10.png" },
    { id: "hlc_rifle_CQBR", name: "Mk18 Mod 0 CQBR", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_CQBR.png" },
    { id: "hlc_rifle_m4m203", name: "M4 M203 5.56mm (HLC)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_m4m203.png" },
    { id: "hlc_rifle_RU556", name: "AAC Honey Badger / RU556", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_RU556.png" },
    { id: "hlc_rifle_416D165", name: "HK416D16.5 Recon", mod: "NIArms", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D165.png" },
    { id: "hlc_rifle_SAMR", name: "West River SAM-R Match", mod: "NIArms", factions: ["NATO"], roles: ["Marksman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "long", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SAMR.png" },
    { id: "hlc_rifle_awmagnum_BL", name: "AI AWM .338 Black", mod: "NIArms", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_awmagnum_BL.png" },
    { id: "hlc_rifle_awcovert_BL", name: "AI AWS Suppressed .308", mod: "NIArms", factions: ["NATO"], roles: ["Sniper","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_5Rnd_762x51_m118_special_Mag", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_rifle_awcovert_BL.png" },
    { id: "hlc_lmg_m60e4", name: "M60E4 / Mk43 Mod 1", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_m60e4.png" },
    { id: "hlc_lmg_M60", name: "M60 Vietnam Classic", mod: "NIArms", factions: ["NATO","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_M60.png" },
    { id: "hlc_smg_mp5k_PDW", name: "MP5K PDW Folding Stock", mod: "NIArms", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_mp5k_PDW.png" },
    { id: "hlc_smg_mp5sd5", name: "MP5SD5 Fixed Stock", mod: "NIArms", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_smg_mp5sd5.png" },
    { id: "hlc_rifle_ak47", name: "AK-47 Type 2 (HLC)", mod: "NIArms", factions: ["CSAT","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "7.62x39", defaultMag: ["CUP_30Rnd_762x39_AK47_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_ak47.png" },
    { id: "hlc_rifle_ak74m", name: "AK-74M Modern (HLC)", mod: "NIArms", factions: ["CSAT"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_ak74m.png" },
    { id: "hlc_rifle_ak12", name: "AK-12 Prototype (HLC)", mod: "NIArms", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_ak12.png" },
    { id: "hlc_rifle_aek971", name: "AEK-971 5.45mm Balanced", mod: "NIArms", factions: ["CSAT"], roles: ["Rifleman"], tier: "specops", caliber: "5.45x39", defaultMag: ["CUP_30Rnd_545x39_AK_M", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_aek971.png" },
    { id: "hlc_rifle_G3A3", name: "H&K G3A3 7.62mm (HLC)", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G3A3.png" },
    { id: "hlc_rifle_g3ka4", name: "H&K G3KA4 Carbine", mod: "NIArms", factions: ["AAF"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_g3ka4.png" },
    { id: "hlc_rifle_aug", name: "Steyr AUG A1 Olive (HLC)", mod: "NIArms", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_aug.png" },
    { id: "hlc_rifle_auga3", name: "Steyr AUG A3 Modern Rail", mod: "NIArms", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_auga3.png" },
    { id: "hlc_rifle_sg550", name: "SIG SG 550 5.56mm Swiss", mod: "NIArms", factions: ["AAF"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_sg550.png" },
    { id: "hlc_rifle_sg553", name: "SIG SG 553 Commando", mod: "NIArms", factions: ["AAF"], roles: ["Medic","Pilot"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_sg553.png" },
    { id: "hlc_rifle_FAL5000", name: "FN FAL 50.00 Battle Rifle", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_FAL5000.png" },
    { id: "hlc_rifle_FALPara", name: "FN FAL 50.63 Paratrooper", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_FALPara.png" },
    { id: "hlc_rifle_SLR", name: "L1A1 SLR Inch-Pattern", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SLR.png" },
    { id: "hlc_rifle_falosw", name: "DS Arms SA58 OSW (HLC)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_falosw.png" },
    { id: "hlc_rifle_g3sg1", name: "H&K G3/SG1 Sniper", mod: "NIArms", factions: ["FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_g3sg1.png" },
    { id: "hlc_rifle_psg1", name: "H&K PSG1 Precision 7.62mm", mod: "NIArms", factions: ["FIA"], roles: ["Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_rifle_psg1.png" },
    { id: "hlc_rifle_M4", name: "NIArms M4 Carbine 5.56mm", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_M4.png" },
    { id: "hlc_rifle_M16A2", name: "NIArms M16A2 5.56mm", mod: "NIArms", factions: ["NATO","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_M16A2.png" },
    { id: "hlc_rifle_M16A4", name: "NIArms M16A4 5.56mm", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_M16A4.png" },
    { id: "hlc_rifle_bcmjack", name: "BCM The Jack Carbine 5.56mm", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_bcmjack.png" },
    { id: "hlc_rifle_RU5562", name: "NIArms AR-15 Recon 5.56mm", mod: "NIArms", factions: ["NATO"], roles: ["Marksman","Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_RU5562.png" },
    { id: "hlc_rifle_honeybadger", name: "AAC Honey Badger SBR .300 BLK", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "7.62x39", defaultMag: ["rhs_30Rnd_762x39mm", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_rifle_honeybadger.png" },
    { id: "hlc_rifle_G36A", name: "HK G36A Full-Length (NIArms)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36A.png" },
    { id: "hlc_rifle_G36A1", name: "HK G36A1 Export Model (NIArms)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36A1.png" },
    { id: "hlc_rifle_G36A1AG36", name: "HK G36A1 AG36 GL (NIArms)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36A1AG36.png" },
    { id: "hlc_rifle_G36K", name: "HK G36K Carbine (NIArms)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36K.png" },
    { id: "hlc_rifle_G36C", name: "HK G36C Compact (NIArms)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36C.png" },
    { id: "hlc_rifle_G36MLIC", name: "HK G36 MLIC Modern Railed", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36MLIC.png" },
    { id: "hlc_rifle_MG36", name: "HK MG36 5.56mm SAW", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_MG36.png" },
    { id: "hlc_rifle_SG550", name: "SIG SG 550 5.56mm Rifle", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG550.png" },
    { id: "hlc_rifle_SG551LB", name: "SIG SG 551 LB Long Barrel", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG551LB.png" },
    { id: "hlc_rifle_SG551SB", name: "SIG SG 551 SB Short Barrel", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Medic"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG551SB.png" },
    { id: "hlc_rifle_SG553SB", name: "SIG SG 553 SB Commando", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG553SB.png" },
    { id: "hlc_rifle_SG550Sniper", name: "SIG SG 550 Sniper Precision", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG550Sniper.png" },
    { id: "hlc_rifle_M249PARA", name: "M249 Para Short SAW (NIArms)", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_rifle_M249PARA.png" },
    { id: "hlc_lmg_minimi", name: "FN Minimi Full-Length SAW", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_minimi.png" },
    { id: "hlc_lmg_MG3", name: "Rheinmetall MG3 7.62mm 1200RPM", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_MG3.png" },
    { id: "hlc_rifle_M14DMR", name: "M14 Designated Marksman Rifle", mod: "NIArms", factions: ["NATO","FIA"], roles: ["Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_harris_bipod", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_M14DMR.png" },
    { id: "hlc_rifle_LAR", name: "L1A1 SLR Australian Pattern", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_LAR.png" },
    { id: "hlc_rifle_Colt727", name: "Colt Model 727 Abu Dhabi Carbine", mod: "NIArms", factions: ["NATO","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_Colt727.png" },
    { id: "hlc_rifle_G36E1", name: "HK G36E1 Export Rifle", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36E1.png" },
    { id: "hlc_rifle_G36KE1", name: "HK G36KE1 Export Carbine", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36KE1.png" },
    { id: "hlc_rifle_G36V", name: "HK G36V Standard Export", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36V.png" },
    { id: "hlc_rifle_SG553LB", name: "SIG SG 553 LB Long Barrel", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG553LB.png" },
    { id: "hlc_rifle_SG553RLB", name: "SIG SG 553 RLB Railed Carbine", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG553RLB.png" },
    { id: "hlc_rifle_g3a3ris", name: "HK G3A3 Railed (NIArms)", mod: "NIArms", factions: ["FIA","AAF"], roles: ["Rifleman","Marksman"], tier: "standard", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_g3a3ris.png" },
    { id: "hlc_smg_mp5a4", name: "HK MP5A4 3-Round Burst", mod: "NIArms", factions: ["NATO","FIA"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_mp5a4.png" },
    { id: "hlc_smg_mp5n", name: "HK MP5N Navy 9mm", mod: "NIArms", factions: ["NATO"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_MP5", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_mp5n.png" },
    { id: "hlc_smg_9mmar", name: "Colt 9mm SMG RO635", mod: "NIArms", factions: ["NATO","FIA"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_9mmar.png" },
    { id: "hlc_rifle_auga2", name: "Steyr AUG A2 (NIArms)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_auga2.png" },
    { id: "hlc_rifle_aughbar", name: "Steyr AUG HBAR Heavy Barrel SAW", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_aughbar.png" },
    { id: "hlc_rifle_augpara", name: "Steyr AUG 9mm Para SMG", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag_SMG_02", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_augpara.png" },
    { id: "hlc_lmg_minimi_railed", name: "FN Minimi Railed Special Purpose", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhsusf_200Rnd_556x45_box", 200], opticType: "mid", hasBipod: true, defaultBipod: "rhsusf_acc_saw_bipod", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_minimi_railed.png" },
    { id: "hlc_lmg_MG42", name: "Maschinengewehr 42 7.92mm (NIArms)", mod: "NIArms", factions: ["FIA"], roles: ["Machine Gunner"], tier: "militia", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_MG42.png" },
    { id: "hlc_lmg_PKM", name: "PKM Machine Gun (NIArms)", mod: "NIArms", factions: ["CSAT","FIA"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x54", defaultMag: ["rhs_100Rnd_762x54mmR", 100], opticType: "mid", hasBipod: true, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_PKM.png" },
    { id: "hlc_lmg_M60E4", name: "M60E4 / Mk43 Mod 0 GPMG", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_M60E4.png" },
    { id: "hlc_lmg_mk48", name: "Mk48 Mod 0 7.62mm SAW", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_lmg_mk48.png" },
    { id: "hlc_rifle_augsr", name: "Steyr AUG Special Receiver", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_augsr.png" },
    { id: "hlc_rifle_awmagnum_OD", name: "Accuracy International AWM .300 OD", mod: "NIArms", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".300WM", defaultMag: ["rhsusf_5Rnd_300winmag_xm2010", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_awmagnum_OD.png" },
    { id: "hlc_smg_mp5a2", name: "H&K MP5A2 Fixed Stock", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_mp5a2.png" },
    { id: "hlc_smg_mp5a3", name: "H&K MP5A3 Retractable Stock", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_mp5a3.png" },
    { id: "hlc_smg_mp5sd3", name: "H&K MP5SD3 Suppressed", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_smg_mp5sd3.png" },
    { id: "hlc_rifle_416D145_CAG_camo", name: "HK416D14.5 CAG (Camo)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D145_CAG_camo.png" },
    { id: "hlc_rifle_416D145_CAG_desert", name: "HK416D14.5 CAG (Desert)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D145_CAG_desert.png" },
    { id: "hlc_rifle_416D145_CAG_woodland", name: "HK416D14.5 CAG (Woodland)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D145_CAG_woodland.png" },
    { id: "hlc_rifle_416D10_camo", name: "HK416D10 CQB (Camo)", mod: "NIArms", factions: ["NATO"], roles: ["Medic","Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D10_camo.png" },
    { id: "hlc_rifle_416D10_desert", name: "HK416D10 CQB (Desert)", mod: "NIArms", factions: ["NATO"], roles: ["Medic","Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D10_desert.png" },
    { id: "hlc_rifle_416D10_woodland", name: "HK416D10 CQB (Woodland)", mod: "NIArms", factions: ["NATO"], roles: ["Medic","Rifleman","Anti-Tank"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_416D10_woodland.png" },
    { id: "hlc_rifle_RU556_camo", name: "AAC Honey Badger / RU556 (Camo)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_RU556_camo.png" },
    { id: "hlc_rifle_RU556_desert", name: "AAC Honey Badger / RU556 (Desert)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_RU556_desert.png" },
    { id: "hlc_rifle_RU556_woodland", name: "AAC Honey Badger / RU556 (Woodland)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_RU556_woodland.png" },
    { id: "hlc_rifle_bcmjack_camo", name: "BCM The Jack Carbine 5.56mm (Camo)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_bcmjack_camo.png" },
    { id: "hlc_rifle_bcmjack_desert", name: "BCM The Jack Carbine 5.56mm (Desert)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_bcmjack_desert.png" },
    { id: "hlc_rifle_bcmjack_woodland", name: "BCM The Jack Carbine 5.56mm (Woodland)", mod: "NIArms", factions: ["NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_bcmjack_woodland.png" },
    { id: "hlc_lmg_M60E4_camo", name: "M60E4 / Mk43 Mod 0 GPMG (Camo)", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_M60E4_camo.png" },
    { id: "hlc_lmg_M60E4_desert", name: "M60E4 / Mk43 Mod 0 GPMG (Desert)", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_M60E4_desert.png" },
    { id: "hlc_lmg_M60E4_woodland", name: "M60E4 / Mk43 Mod 0 GPMG (Woodland)", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_lmg_M60E4_woodland.png" },
    { id: "hlc_lmg_mk48_camo", name: "Mk48 Mod 0 7.62mm SAW (Camo)", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_lmg_mk48_camo.png" },
    { id: "hlc_lmg_mk48_desert", name: "Mk48 Mod 0 7.62mm SAW (Desert)", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_lmg_mk48_desert.png" },
    { id: "hlc_lmg_mk48_woodland", name: "Mk48 Mod 0 7.62mm SAW (Woodland)", mod: "NIArms", factions: ["NATO"], roles: ["Machine Gunner"], tier: "specops", caliber: "7.62x51", defaultMag: ["rhsusf_100Rnd_762x51", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_lmg_mk48_woodland.png" },
    { id: "hlc_rifle_G36A_camo", name: "HK G36A Full-Length (NIArms) (Camo)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36A_camo.png" },
    { id: "hlc_rifle_G36A_desert", name: "HK G36A Full-Length (NIArms) (Desert)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36A_desert.png" },
    { id: "hlc_rifle_G36A_woodland", name: "HK G36A Full-Length (NIArms) (Woodland)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36A_woodland.png" },
    { id: "hlc_rifle_G36K_camo", name: "HK G36K Carbine (NIArms) (Camo)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36K_camo.png" },
    { id: "hlc_rifle_G36K_desert", name: "HK G36K Carbine (NIArms) (Desert)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36K_desert.png" },
    { id: "hlc_rifle_G36K_woodland", name: "HK G36K Carbine (NIArms) (Woodland)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36K_woodland.png" },
    { id: "hlc_rifle_G36C_camo", name: "HK G36C Compact (NIArms) (Camo)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36C_camo.png" },
    { id: "hlc_rifle_G36C_desert", name: "HK G36C Compact (NIArms) (Desert)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36C_desert.png" },
    { id: "hlc_rifle_G36C_woodland", name: "HK G36C Compact (NIArms) (Woodland)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Rifleman","Medic"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_G36C_woodland.png" },
    { id: "hlc_rifle_MG36_camo", name: "HK MG36 5.56mm SAW (Camo)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_MG36_camo.png" },
    { id: "hlc_rifle_MG36_desert", name: "HK MG36 5.56mm SAW (Desert)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_MG36_desert.png" },
    { id: "hlc_rifle_MG36_woodland", name: "HK MG36 5.56mm SAW (Woodland)", mod: "NIArms", factions: ["AAF","NATO"], roles: ["Machine Gunner"], tier: "standard", caliber: "5.56x45", defaultMag: ["100Rnd_65x39_caseless_mag", 100], opticType: "mid", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_MG36_woodland.png" },
    { id: "hlc_rifle_SG550_camo", name: "SIG SG 550 5.56mm Rifle (Camo)", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG550_camo.png" },
    { id: "hlc_rifle_SG550_desert", name: "SIG SG 550 5.56mm Rifle (Desert)", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG550_desert.png" },
    { id: "hlc_rifle_SG550_woodland", name: "SIG SG 550 5.56mm Rifle (Woodland)", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: true, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG550_woodland.png" },
    { id: "hlc_rifle_SG550Sniper_camo", name: "SIG SG 550 Sniper Precision (Camo)", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG550Sniper_camo.png" },
    { id: "hlc_rifle_SG550Sniper_desert", name: "SIG SG 550 Sniper Precision (Desert)", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG550Sniper_desert.png" },
    { id: "hlc_rifle_SG550Sniper_woodland", name: "SIG SG 550 Sniper Precision (Woodland)", mod: "NIArms", factions: ["AAF","FIA"], roles: ["Marksman","Sniper"], tier: "specops", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SG550Sniper_woodland.png" },
    { id: "hlc_rifle_FAL5000_camo", name: "FN FAL 50.00 Battle Rifle (Camo)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_FAL5000_camo.png" },
    { id: "hlc_rifle_FAL5000_desert", name: "FN FAL 50.00 Battle Rifle (Desert)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_FAL5000_desert.png" },
    { id: "hlc_rifle_FAL5000_woodland", name: "FN FAL 50.00 Battle Rifle (Woodland)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_FAL5000_woodland.png" },
    { id: "hlc_rifle_LAR_camo", name: "L1A1 SLR Australian Pattern (Camo)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_LAR_camo.png" },
    { id: "hlc_rifle_LAR_desert", name: "L1A1 SLR Australian Pattern (Desert)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_LAR_desert.png" },
    { id: "hlc_rifle_LAR_woodland", name: "L1A1 SLR Australian Pattern (Woodland)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_LAR_woodland.png" },
    { id: "hlc_rifle_SLR_camo", name: "L1A1 SLR Inch-Pattern (Camo)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SLR_camo.png" },
    { id: "hlc_rifle_SLR_desert", name: "L1A1 SLR Inch-Pattern (Desert)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SLR_desert.png" },
    { id: "hlc_rifle_SLR_woodland", name: "L1A1 SLR Inch-Pattern (Woodland)", mod: "NIArms", factions: ["FIA"], roles: ["Rifleman","Marksman"], tier: "militia", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_SLR_woodland.png" },
    { id: "hlc_rifle_aug_camo", name: "Steyr AUG A1 Olive (HLC) (Camo)", mod: "NIArms", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_aug_camo.png" },
    { id: "hlc_rifle_aug_desert", name: "Steyr AUG A1 Olive (HLC) (Desert)", mod: "NIArms", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_aug_desert.png" },
    { id: "hlc_rifle_aug_woodland", name: "Steyr AUG A1 Olive (HLC) (Woodland)", mod: "NIArms", factions: ["AAF"], roles: ["Rifleman","Anti-Tank"], tier: "standard", caliber: "5.56x45", defaultMag: ["30Rnd_556x45_Stanag", 30], opticType: "mid", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_aug_woodland.png" },
    { id: "hlc_rifle_awmagnum_BL_camo", name: "AI AWM .338 Black (Camo)", mod: "NIArms", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_awmagnum_BL_camo.png" },
    { id: "hlc_rifle_awmagnum_BL_desert", name: "AI AWM .338 Black (Desert)", mod: "NIArms", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_awmagnum_BL_desert.png" },
    { id: "hlc_rifle_awmagnum_BL_woodland", name: "AI AWM .338 Black (Woodland)", mod: "NIArms", factions: ["NATO"], roles: ["Sniper"], tier: "specops", caliber: ".338", defaultMag: ["CUP_5Rnd_86x70_L115A1", 5], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_rifle_awmagnum_BL_woodland.png" },
    { id: "hlc_rifle_psg1_camo", name: "H&K PSG1 Precision 7.62mm (Camo)", mod: "NIArms", factions: ["FIA"], roles: ["Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_rifle_psg1_camo.png" },
    { id: "hlc_rifle_psg1_desert", name: "H&K PSG1 Precision 7.62mm (Desert)", mod: "NIArms", factions: ["FIA"], roles: ["Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_rifle_psg1_desert.png" },
    { id: "hlc_rifle_psg1_woodland", name: "H&K PSG1 Precision 7.62mm (Woodland)", mod: "NIArms", factions: ["FIA"], roles: ["Sniper"], tier: "specops", caliber: "7.62x51", defaultMag: ["20Rnd_762x51_Mag", 20], opticType: "long", hasBipod: true, defaultBipod: "bipod_01_F_blk", hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_rifle_psg1_woodland.png" },
    { id: "hlc_smg_mp5a3_camo", name: "H&K MP5A3 Retractable Stock (Camo)", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_mp5a3_camo.png" },
    { id: "hlc_smg_mp5a3_desert", name: "H&K MP5A3 Retractable Stock (Desert)", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_mp5a3_desert.png" },
    { id: "hlc_smg_mp5a3_woodland", name: "H&K MP5A3 Retractable Stock (Woodland)", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "standard", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: true, photoUrl: "assets/weapons/photos/hlc_smg_mp5a3_woodland.png" },
    { id: "hlc_smg_mp5sd3_camo", name: "H&K MP5SD3 Suppressed (Camo)", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_smg_mp5sd3_camo.png" },
    { id: "hlc_smg_mp5sd3_desert", name: "H&K MP5SD3 Suppressed (Desert)", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_smg_mp5sd3_desert.png" },
    { id: "hlc_smg_mp5sd3_woodland", name: "H&K MP5SD3 Suppressed (Woodland)", mod: "NIArms", factions: ["NATO","AAF"], roles: ["Pilot","Medic"], tier: "specops", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], opticType: "cqb", hasBipod: false, hasMuzzle: false, photoUrl: "assets/weapons/photos/hlc_smg_mp5sd3_woodland.png" }
]);
const LAUNCHERS = {
    NATO: [
        { id: "rhs_weap_M136", mod: "RHS", defaultMag: ["rhs_m136_mag", 1] },
        { id: "rhs_weap_M136_hedp", mod: "RHS", defaultMag: ["rhs_m136_hedp_mag", 1] },
        { id: "rhs_weap_M136_hp", mod: "RHS", defaultMag: ["rhs_m136_hp_mag", 1] },
        { id: "rhs_weap_m72a7", mod: "RHS", defaultMag: ["rhs_m72a7_mag", 1] },
        { id: "rhs_weap_smaw", mod: "RHS", defaultMag: ["rhs_mag_smaw_HEAA", 1] },
        { id: "rhs_weap_maaws", mod: "RHS", defaultMag: ["rhs_mag_maaws_HEAT", 1] },
        { id: "rhs_weap_fgm148", mod: "RHS", defaultMag: ["rhs_fgm148_magazine_AT", 1] },
        { id: "rhs_weap_fim92", mod: "RHS", defaultMag: ["rhs_fim92_mag", 1] },
        { id: "launch_NLAW_F", mod: "Vanilla", defaultMag: ["NLAW_F", 1] },
        { id: "launch_B_Titan_short_F", mod: "Vanilla", defaultMag: ["Titan_AT", 1] },
        { id: "launch_B_Titan_F", mod: "Vanilla", defaultMag: ["Titan_AA", 1] },
        { id: "launch_MRAWS_sand_F", mod: "Vanilla", defaultMag: ["MRAWS_HEAT_F", 1] },
        { id: "CUP_launch_M136", mod: "CUP", defaultMag: ["CUP_M136_M", 1] },
        { id: "CUP_launch_Javelin", mod: "CUP", defaultMag: ["CUP_Javelin_M", 1] },
        { id: "CUP_launch_Mk153", mod: "CUP", defaultMag: ["CUP_SMAW_HEAA_M", 1] },
        { id: "CUP_launch_M3", mod: "CUP", defaultMag: ["CUP_MAAWS_HEAT_M", 1] },
        { id: "CUP_launch_FIM92Stinger", mod: "CUP", defaultMag: ["CUP_Stinger_M", 1] }
    ],
    CSAT: [
        { id: "CUP_launch_RPG7V", mod: "CUP", defaultMag: ["CUP_PG7V_M", 1] },
        { id: "CUP_launch_RPG18", mod: "CUP", defaultMag: ["CUP_RPG18_M", 1] },
        { id: "CUP_launch_RPG22", mod: "CUP", defaultMag: ["CUP_RPG22_M", 1] },
        { id: "CUP_launch_Igla", mod: "CUP", defaultMag: ["CUP_Igla_M", 1] },
        { id: "CUP_launch_9K32_Strela", mod: "CUP", defaultMag: ["CUP_Strela_2_M", 1] },
        { id: "CUP_launch_Metis", mod: "CUP", defaultMag: ["CUP_AT13_M", 1] },
        { id: "rhs_weap_rpg7", mod: "RHS", defaultMag: ["rhs_rpg7_PG7VL_mag", 1] },
        { id: "rhs_weap_rpg26", mod: "RHS", defaultMag: ["rhs_rpg26_mag", 1] },
        { id: "rhs_weap_rshg2", mod: "RHS", defaultMag: ["rhs_rshg2_mag", 1] },
        { id: "rhs_weap_igla", mod: "RHS", defaultMag: ["rhs_mag_9k38_rocket", 1] },
        { id: "launch_RPG32_F", mod: "Vanilla", defaultMag: ["RPG32_F", 1] },
        { id: "launch_O_Vorona_brown_F", mod: "Vanilla", defaultMag: ["Vorona_HEAT", 1] },
        { id: "launch_O_Titan_short_F", mod: "Vanilla", defaultMag: ["Titan_AT", 1] },
        { id: "launch_O_Titan_F", mod: "Vanilla", defaultMag: ["Titan_AA", 1] },
        { id: "launch_RPG7_F", mod: "Vanilla", defaultMag: ["RPG7_F", 1] }
    ],
    AAF: [
        { id: "launch_NLAW_F", mod: "Vanilla", defaultMag: ["NLAW_F", 1] },
        { id: "launch_MRAWS_olive_F", mod: "Vanilla", defaultMag: ["MRAWS_HEAT_F", 1] },
        { id: "launch_I_Titan_short_F", mod: "Vanilla", defaultMag: ["Titan_AT", 1] },
        { id: "launch_I_Titan_F", mod: "Vanilla", defaultMag: ["Titan_AA", 1] },
        { id: "rhs_weap_maaws", mod: "RHS", defaultMag: ["rhs_mag_maaws_HEAT", 1] },
        { id: "rhs_weap_m72a7", mod: "RHS", defaultMag: ["rhs_m72a7_mag", 1] },
        { id: "CUP_launch_M3", mod: "CUP", defaultMag: ["CUP_MAAWS_HEAT_M", 1] }
    ],
    FIA: [
        { id: "CUP_launch_RPG7V", mod: "CUP", defaultMag: ["CUP_PG7V_M", 1] },
        { id: "CUP_launch_RPG18", mod: "CUP", defaultMag: ["CUP_RPG18_M", 1] },
        { id: "CUP_launch_RPG22", mod: "CUP", defaultMag: ["CUP_RPG22_M", 1] },
        { id: "CUP_launch_9K32_Strela", mod: "CUP", defaultMag: ["CUP_Strela_2_M", 1] },
        { id: "rhs_weap_rpg7", mod: "RHS", defaultMag: ["rhs_rpg7_PG7VL_mag", 1] },
        { id: "rhs_weap_rpg26", mod: "RHS", defaultMag: ["rhs_rpg26_mag", 1] },
        { id: "launch_RPG32_F", mod: "Vanilla", defaultMag: ["RPG32_F", 1] },
        { id: "launch_RPG7_F", mod: "Vanilla", defaultMag: ["RPG7_F", 1] }
    ]
};
const OPTICS_POOL = {
    cqb: [
        { id: "optic_Aco", mod: "Vanilla" },
        { id: "optic_ACO_grn", mod: "Vanilla" },
        { id: "optic_Holosight", mod: "Vanilla" },
        { id: "optic_Holosight_blk_F", mod: "Vanilla" },
        { id: "optic_Holosight_smg", mod: "Vanilla" },
        { id: "rhsusf_acc_eotech_552", mod: "RHS" },
        { id: "rhsusf_acc_compm4", mod: "RHS" },
        { id: "rhsusf_acc_T1_high", mod: "RHS" },
        { id: "CUP_optic_Kobra", mod: "CUP" },
        { id: "CUP_optic_MicroT1", mod: "CUP" },
        { id: "CUP_optic_CompM2_Black", mod: "CUP" }
    ],
    mid: [
        { id: "optic_Hamr", mod: "Vanilla" },
        { id: "optic_MRCO", mod: "Vanilla" },
        { id: "optic_Arco", mod: "Vanilla" },
        { id: "rhsusf_acc_ACOG", mod: "RHS" },
        { id: "rhsusf_acc_ACOG_RMR", mod: "RHS" },
        { id: "rhsusf_acc_SpecterDR", mod: "RHS" },
        { id: "rhsusf_acc_ELCAN", mod: "RHS" },
        { id: "CUP_optic_PSO_1", mod: "CUP" },
        { id: "CUP_optic_ElcanM145", mod: "CUP" }
    ],
    long: [
        { id: "optic_SOS", mod: "Vanilla" },
        { id: "optic_DMS", mod: "Vanilla" },
        { id: "optic_LRPS", mod: "Vanilla" },
        { id: "optic_AMS", mod: "Vanilla" },
        { id: "optic_KHS_blk", mod: "Vanilla" },
        { id: "optic_KHS_hex", mod: "Vanilla" },
        { id: "optic_KHS_old", mod: "Vanilla" },
        { id: "rhsusf_acc_LEUPOLDMK4", mod: "RHS" },
        { id: "rhsusf_acc_M8541", mod: "RHS" },
        { id: "CUP_optic_LeupoldMk4", mod: "CUP" },
        { id: "CUP_optic_PSO_3", mod: "CUP" }
    ],
    thermal: [
        { id: "optic_tws", mod: "Vanilla" },
        { id: "optic_tws_mg", mod: "Vanilla" },
        { id: "optic_Nightstalker", mod: "Vanilla" },
        { id: "rhsusf_acc_anpas13gv1", mod: "RHS" },
        { id: "CUP_optic_GOSHAWK", mod: "CUP" }
    ]
};
const MUZZLES_BY_CALIBER = {
    "5.56x45": [
        { id: "muzzle_snds_M", mod: "Vanilla" },
        { id: "rhsusf_acc_nt4_black", mod: "RHS" }
    ],
    "5.45x39": [
        { id: "CUP_muzzle_PBS4", mod: "CUP" }
    ],
    "7.62x39": [
        { id: "CUP_muzzle_PBS4", mod: "CUP" }
    ],
    "7.62x51": [
        { id: "muzzle_snds_B", mod: "Vanilla" },
        { id: "rhsusf_acc_SR25S", mod: "RHS" }
    ],
    "7.62x54": [
        { id: "muzzle_snds_B", mod: "Vanilla" },
        { id: "CUP_muzzle_PBS4", mod: "CUP" }
    ],
    "6.5x39": [
        { id: "muzzle_snds_H", mod: "Vanilla" }
    ],
    "5.8x42": [
        { id: "muzzle_snds_58_blk_F", mod: "Vanilla" }
    ],
    "9x21": [
        { id: "muzzle_snds_L", mod: "Vanilla" }
    ],
    ".45ACP": [
        { id: "muzzle_snds_acp", mod: "Vanilla" }
    ],
    "4.6x30": [
        { id: "muzzle_snds_L", mod: "Vanilla" }
    ],
    ".300WM": [
        { id: "rhsusf_acc_M2010S", mod: "RHS" }
    ],
    ".338": [
        { id: "muzzle_snds_338_black", mod: "Vanilla" }
    ],
    "9.3x64": [
        { id: "muzzle_snds_93mmg", mod: "Vanilla" },
        { id: "muzzle_snds_93mmg_tan", mod: "Vanilla" }
    ],
    ".408": [
        { id: "muzzle_snds_B", mod: "Vanilla" }
    ],
    "12.7x108": [
        { id: "muzzle_snds_93mmg_tan", mod: "Vanilla" }
    ],
    ".50BMG": [
        { id: "rhsusf_acc_M2010S", mod: "RHS" }
    ],
    "12Gauge": [],
    "Rocket": []
};
const FACTION_GEAR = {
    NATO: {
        uniforms: ["U_B_CombatUniform_mcam", "U_B_CombatUniform_mcam_tshirt", "U_B_CombatUniform_mcam_vest", "U_B_SpecopsUniform_sgg"],
        vests: ["V_PlateCarrier1_rgr", "V_PlateCarrier2_rgr", "V_PlateCarrierGL_rgr", "V_Chestrig_rgr"],
        backpacks: ["B_AssaultPack_mcamo", "B_Kitbag_mcamo", "B_TacticalPack_mcamo", "B_AssaultPack_rgr"],
        headgear: ["H_HelmetB", "H_HelmetB_light", "H_HelmetB_desert", "H_HelmetB_grass", "H_HelmetB_snakeskin", "H_HelmetB_light_black", "H_Booniehat_mcamo"],
        handguns: [
            "hgun_P07_F", "hgun_P07_khk_F", "hgun_Pistol_heavy_01_F",
            "rhsusf_weap_m9", "rhsusf_weap_m1911a1", "rhsusf_weap_glock17",
            "CUP_hgun_Glock17_blk", "CUP_hgun_M9", "CUP_hgun_Colt1911", "CUP_hgun_Deagle"
        ],
        handgunMag: ["16Rnd_9x21_Mag", 16],
        handgunMuzzles: ["muzzle_snds_L"]
    },
    CSAT: {
        uniforms: ["U_O_CombatUniform_ocamo", "U_O_CombatUniform_oucamo", "U_O_SpecopsUniform_ocamo"],
        vests: ["V_HarnessO_brn", "V_HarnessOSpec_brn", "V_BandollierB_cbr", "V_TacVest_khk"],
        backpacks: ["B_FieldPack_ocamo", "B_Carryall_ocamo", "B_TacticalPack_ocamo", "B_FieldPack_cbr"],
        headgear: ["H_HelmetO_ocamo", "H_HelmetLeaderO_ocamo", "H_HelmetO_oucamo", "H_MilCap_ocamo"],
        handguns: [
            "hgun_Rook40_F", "hgun_Pistol_heavy_02_F", "hgun_Pistol_01_F",
            "rhs_weap_pya", "rhs_weap_makarov_pm", "rhs_weap_makarov_pmm", "rhs_weap_6p9",
            "CUP_hgun_Makarov", "CUP_hgun_PB6P9"
        ],
        handgunMag: ["16Rnd_9x21_Mag", 16],
        handgunMuzzles: ["muzzle_snds_L"]
    },
    AAF: {
        uniforms: ["U_I_CombatUniform", "U_I_CombatUniform_shortsleeve", "U_I_OfficerUniform"],
        vests: ["V_PlateCarrierIA1_dgtl", "V_PlateCarrierIA2_dgtl", "V_Chestrig_oli", "V_TacVest_oli"],
        backpacks: ["B_AssaultPack_dgtl", "B_Carryall_oli", "B_FieldPack_oli"],
        headgear: ["H_HelmetIA", "H_HelmetIA_net", "H_HelmetIA_camo", "H_Booniehat_dgtl", "H_MilCap_dgtl"],
        handguns: [
            "hgun_ACPC2_F", "hgun_P07_F",
            "rhs_weap_cz75", "rhs_weap_cz99",
            "CUP_hgun_Browning_HP", "CUP_hgun_TaurusTracker455",
            "CUP_hgun_Compact", "CUP_hgun_Duty", "CUP_hgun_Phantom"
        ],
        handgunMag: ["9Rnd_45ACP_Mag", 9],
        handgunMuzzles: ["muzzle_snds_acp"]
    },
    FIA: {
        uniforms: ["U_BG_Guerilla1_1", "U_BG_Guerilla2_2", "U_BG_Guerilla3_1", "U_BG_leader", "U_BG_Guerilla2_1", "U_BG_Guerilla2_3"],
        vests: ["V_Chestrig_khk", "V_BandollierB_cbr", "V_TacVest_blk", "V_TacVest_oli"],
        backpacks: ["B_AssaultPack_cbr", "B_FieldPack_khk", "B_AssaultPack_blk"],
        headgear: ["H_Bandanna_camo", "H_Cap_blk", "H_Shemag_olive", "H_Watchcap_blk", "H_Booniehat_khk", "H_Bandanna_khk"],
        handguns: [
            "hgun_P07_F", "hgun_Rook40_F", "hgun_PDW2000_F",
            "rhs_weap_makarov_pm", "rhs_weap_tt33",
            "CUP_hgun_TT", "CUP_hgun_MicroUzi"
        ],
        handgunMag: ["16Rnd_9x21_Mag", 16],
        handgunMuzzles: ["muzzle_snds_L"]
    }
};

const BIOME_GEAR = {
    woodland: {
        NATO: {
            uniforms: ["U_B_CombatUniform_mcam_wdl", "U_B_CombatUniform_mcam_wdl_vest", "U_B_CombatUniform_mcam_wdl_tshirt", "U_B_SpecopsUniform_sgg"],
            vests: ["V_PlateCarrier1_wdl", "V_PlateCarrier2_wdl", "V_Chestrig_oli", "V_PlateCarrier1_rgr"],
            backpacks: ["B_AssaultPack_wdl", "B_AssaultPack_rgr", "B_Kitbag_rgr"],
            headgear: ["H_HelmetB_plain_wdl", "H_HelmetB_light_wdl", "H_Booniehat_wdl", "H_HelmetB_grass"]
        },
        CSAT: {
            uniforms: ["U_O_T_Soldier_F", "U_O_CombatUniform_oucamo"],
            vests: ["V_HarnessO_ghex_F", "V_TacVest_oli"],
            backpacks: ["B_FieldPack_ghex_F", "B_Carryall_ghex_F"],
            headgear: ["H_HelmetO_ghex_F", "H_MilCap_ghex_F", "H_Booniehat_ghex_F"]
        },
        AAF: {
            uniforms: ["U_I_CombatUniform", "U_I_CombatUniform_shortsleeve"],
            vests: ["V_PlateCarrierIA1_dgtl", "V_PlateCarrierIA2_dgtl", "V_Chestrig_oli"],
            backpacks: ["B_AssaultPack_dgtl", "B_FieldPack_oli"],
            headgear: ["H_HelmetIA", "H_HelmetIA_net", "H_Booniehat_dgtl"]
        },
        FIA: {
            uniforms: ["U_BG_Guerilla1_1", "U_BG_Guerilla2_1", "U_BG_Guerilla3_1"],
            vests: ["V_Chestrig_oli", "V_TacVest_oli"],
            backpacks: ["B_FieldPack_khk", "B_AssaultPack_rgr"],
            headgear: ["H_Booniehat_khk", "H_Shemag_olive", "H_Bandanna_camo"]
        }
    },
    arid: {
        NATO: {
            uniforms: ["U_B_CombatUniform_mcam", "U_B_CombatUniform_mcam_vest", "U_B_CombatUniform_mcam_tshirt"],
            vests: ["V_PlateCarrier1_rgr", "V_PlateCarrier2_rgr", "V_PlateCarrierGL_rgr", "V_Chestrig_rgr"],
            backpacks: ["B_AssaultPack_mcamo", "B_Kitbag_mcamo", "B_TacticalPack_mcamo"],
            headgear: ["H_HelmetB", "H_HelmetB_desert", "H_HelmetB_snakeskin", "H_Booniehat_mcamo"]
        },
        CSAT: {
            uniforms: ["U_O_CombatUniform_ocamo", "U_O_SpecopsUniform_ocamo"],
            vests: ["V_HarnessO_brn", "V_HarnessOSpec_brn", "V_BandollierB_cbr"],
            backpacks: ["B_FieldPack_ocamo", "B_Carryall_ocamo"],
            headgear: ["H_HelmetO_ocamo", "H_HelmetLeaderO_ocamo", "H_MilCap_ocamo"]
        },
        AAF: {
            uniforms: ["U_I_CombatUniform", "U_I_OfficerUniform"],
            vests: ["V_PlateCarrierIA1_dgtl", "V_TacVest_khk"],
            backpacks: ["B_AssaultPack_cbr", "B_FieldPack_oli"],
            headgear: ["H_HelmetIA_camo", "H_MilCap_dgtl"]
        },
        FIA: {
            uniforms: ["U_BG_Guerilla2_2", "U_BG_Guerilla2_3", "U_BG_leader"],
            vests: ["V_Chestrig_khk", "V_BandollierB_cbr"],
            backpacks: ["B_AssaultPack_cbr", "B_FieldPack_khk"],
            headgear: ["H_Bandanna_khk", "H_ShemagOpen_tan", "H_Cap_tan"]
        }
    },
    tropic: {
        NATO: {
            uniforms: ["U_B_T_Soldier_F", "U_B_T_Soldier_AR_F", "U_B_T_Soldier_SL_F"],
            vests: ["V_PlateCarrier1_tna_F", "V_PlateCarrier2_tna_F", "V_Chestrig_oli"],
            backpacks: ["B_AssaultPack_tna_F", "B_FieldPack_oli", "B_Kitbag_rgr"],
            headgear: ["H_HelmetB_tna_F", "H_HelmetB_Light_tna_F", "H_Booniehat_tna_F"]
        },
        CSAT: {
            uniforms: ["U_O_T_Soldier_F", "U_O_T_Officer_F"],
            vests: ["V_HarnessO_ghex_F", "V_HarnessOGL_ghex_F"],
            backpacks: ["B_FieldPack_ghex_F", "B_ViperHarness_ghex_F"],
            headgear: ["H_HelmetO_ghex_F", "H_HelmetLeaderO_ghex_F", "H_Booniehat_ghex_F"]
        },
        AAF: {
            uniforms: ["U_I_CombatUniform_shortsleeve", "U_I_CombatUniform"],
            vests: ["V_PlateCarrierIA1_dgtl", "V_Chestrig_oli"],
            backpacks: ["B_AssaultPack_dgtl", "B_Carryall_oli"],
            headgear: ["H_Booniehat_dgtl", "H_HelmetIA"]
        },
        FIA: {
            uniforms: ["U_BG_Guerilla1_1", "U_BG_Guerilla2_1"],
            vests: ["V_Chestrig_oli", "V_TacVest_oli"],
            backpacks: ["B_FieldPack_oli", "B_AssaultPack_rgr"],
            headgear: ["H_Booniehat_oli", "H_Bandanna_camo"]
        }
    },
    urban: {
        NATO: {
            uniforms: ["U_B_CTRG_1", "U_B_CTRG_2", "U_B_CTRG_3", "U_B_SpecopsUniform_sgg"],
            vests: ["V_PlateCarrier1_blk", "V_PlateCarrierSpec_blk", "V_TacVest_blk"],
            backpacks: ["B_AssaultPack_blk", "B_FieldPack_blk", "B_TacticalPack_blk"],
            headgear: ["H_HelmetB_light_black", "H_HelmetB_black", "H_Cap_blk", "H_Watchcap_blk"]
        },
        CSAT: {
            uniforms: ["U_O_CombatUniform_oucamo", "U_O_SpecopsUniform_ocamo"],
            vests: ["V_HarnessOSpec_brn", "V_TacVest_blk"],
            backpacks: ["B_FieldPack_blk", "B_TacticalPack_blk"],
            headgear: ["H_HelmetO_oucamo", "H_MilCap_oucamo"]
        },
        AAF: {
            uniforms: ["U_I_CombatUniform", "U_I_OfficerUniform"],
            vests: ["V_TacVest_blk", "V_PlateCarrierIA1_dgtl"],
            backpacks: ["B_AssaultPack_blk", "B_FieldPack_blk"],
            headgear: ["H_HelmetIA", "H_MilCap_dgtl"]
        },
        FIA: {
            uniforms: ["U_BG_Guerilla3_1", "U_BG_leader"],
            vests: ["V_TacVest_blk", "V_BandollierB_blk"],
            backpacks: ["B_AssaultPack_blk", "B_FieldPack_blk"],
            headgear: ["H_Watchcap_blk", "H_Cap_blk"]
        }
    },
    winter: {
        NATO: {
            uniforms: ["U_B_CombatUniform_mcam", "U_B_SpecopsUniform_sgg"],
            vests: ["V_PlateCarrier1_rgr", "V_Chestrig_khk"],
            backpacks: ["B_AssaultPack_cbr", "B_FieldPack_cbr"],
            headgear: ["H_Watchcap_blk", "H_Booniehat_khk", "H_Cap_blk"]
        },
        CSAT: {
            uniforms: ["U_O_CombatUniform_oucamo"],
            vests: ["V_TacVest_khk", "V_HarnessO_brn"],
            backpacks: ["B_FieldPack_cbr"],
            headgear: ["H_HelmetO_oucamo", "H_Cap_blk"]
        },
        AAF: {
            uniforms: ["U_I_CombatUniform"],
            vests: ["V_PlateCarrierIA1_dgtl", "V_TacVest_oli"],
            backpacks: ["B_FieldPack_oli"],
            headgear: ["H_HelmetIA", "H_Watchcap_blk"]
        },
        FIA: {
            uniforms: ["U_BG_Guerilla2_3", "U_BG_Guerilla3_1"],
            vests: ["V_TacVest_khk", "V_Chestrig_khk"],
            backpacks: ["B_FieldPack_khk"],
            headgear: ["H_Watchcap_blk", "H_Shemag_olive"]
        }
    }
};

class AmmunitionManager {
    static getSpecialtyMag(defaultMag, ammoType, caliber) {
        if (!defaultMag || !defaultMag[0] || ammoType === "ball" || !ammoType) {
            return defaultMag;
        }
        const origClass = defaultMag[0];
        const capacity = defaultMag[1];

        if (ammoType === "tracer") {
            if (origClass.includes("30Rnd_65x39_caseless_mag")) return ["30Rnd_65x39_caseless_mag_Tracer_Red", capacity];
            if (origClass.includes("30Rnd_65x39_caseless_green")) return ["30Rnd_65x39_caseless_green_mag_Tracer", capacity];
            if (origClass.includes("30Rnd_556x45_Stanag")) return ["30Rnd_556x45_Stanag_Tracer_Red", capacity];
            if (origClass.includes("rhs_mag_30Rnd_556x45")) return ["rhs_mag_30Rnd_556x45_M855A1_Stanag_Tracer_Red", capacity];
            if (origClass.includes("rhs_30Rnd_545x39")) return ["rhs_30Rnd_545x39_7N10_tracer_AK", capacity];
            if (origClass.includes("rhs_30Rnd_762x39")) return ["rhs_30Rnd_762x39mm_tracer", capacity];
            if (origClass.includes("CUP_30Rnd_556x45")) return ["CUP_30Rnd_556x45_Stanag_Tracer_Red", capacity];
            if (origClass.includes("CUP_30Rnd_762x39")) return ["CUP_30Rnd_TE4_LRT4_Green_Tracer_762x39_AK47_M", capacity];
            if (origClass.includes("20Rnd_762x51_Mag")) return ["20Rnd_762x51_Mag_Tracer", capacity];
            return [`${origClass}_Tracer`, capacity];
        }

        if (ammoType === "ap") {
            if (origClass.includes("30Rnd_556x45")) return ["30Rnd_556x45_Stanag_red", capacity];
            if (origClass.includes("rhs_mag_30Rnd_556x45")) return ["rhs_mag_30Rnd_556x45_M995_Stanag", capacity];
            if (origClass.includes("rhs_30Rnd_545x39")) return ["rhs_30Rnd_545x39_7N22_AK", capacity];
            if (origClass.includes("rhs_30Rnd_762x39")) return ["rhs_30Rnd_762x39mm_89", capacity];
            if (origClass.includes("rhsusf_20Rnd_762x51")) return ["rhsusf_20Rnd_762x51_m993_Mag", capacity];
            return [`${origClass}_AP`, capacity];
        }

        if (ammoType === "subsonic") {
            if (origClass.includes("rhs_30Rnd_545x39")) return ["rhs_30Rnd_545x39_7U1_AK", capacity];
            if (origClass.includes("rhs_30Rnd_762x39")) return ["rhs_30Rnd_762x39mm_U_89", capacity];
            if (origClass.includes("30Rnd_556x45")) return ["30Rnd_556x45_Stanag", capacity];
            return [`${origClass}_Subsonic`, capacity];
        }

        return defaultMag;
    }
}

const COMMON_ITEMS = Object.freeze({
    facewear: ["", "G_Tactical_Clear", "G_Combat", "G_Bandanna_oli", "G_Balaclava_blk", "G_Aviator", "G_Spectacles_Tinted", "G_Lowprofile"],
    pointers: ["acc_pointer_IR", "acc_flashlight"],
    linkedItems: ["ItemMap", "ItemCompass", "ItemWatch", "ItemRadio"],
    nvg: { NATO: "NVGoggles", CSAT: "NVGoggles_OPFOR", AAF: "NVGoggles_INDEP", FIA: "NVGoggles" },
    binoculars: ["Binocular", "Rangefinder"],
    grenades: ["HandGrenade", "MiniGrenade"],
    smokes: ["SmokeShell", "SmokeShellGreen", "SmokeShellRed", "SmokeShellBlue"]
});
// Fallback weapon if all active mod filters produce 0 matches
const FALLBACK_WEAPON = BUILTIN_WEAPONS[0];
// ----------------------------------------------------------------------------
// 3. Randomization & Utility Helpers
// ----------------------------------------------------------------------------
class RandomUtils {
    /**
     * Safely selects a random element from an array.
     * Returns fallbackValue if the array is empty or undefined.
     */
    static choice(arr, fallbackValue) {
        if (!arr || arr.length === 0) {
            if (fallbackValue !== undefined)
                return fallbackValue;
            throw new Error("RandomUtils.choice called on empty array with no fallback");
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }
    /** Returns true based on given probability [0, 1] */
    static bool(chance = 0.5) {
        return Math.random() < chance;
    }
    /** Returns integer in [min, max] inclusive */
    static int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
// ----------------------------------------------------------------------------
// 4. Weapon Repository & In-Memory Index Cache
// ----------------------------------------------------------------------------
class WeaponRepository {
    /**
     * Invalidates all in-memory weapon caches.
     * Must be called whenever custom weapons are added, removed, or imported.
     */
    static invalidateCache() {
        this.customWeaponsCache = null;
        this.allWeaponsCache = null;
        this.weaponsByModCache = null;
    }
    /**
     * Retrieves custom weapons with in-memory caching.
     */
    static getCustomWeapons(forceRefresh = false) {
        if (!forceRefresh && this.customWeaponsCache !== null) {
            return this.customWeaponsCache;
        }
        try {
            if (typeof localStorage !== "undefined") {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        this.customWeaponsCache = parsed.filter(w => this.isValidWeaponDef(w));
                        return this.customWeaponsCache;
                    }
                }
            }
        }
        catch (err) {
            console.warn("[WeaponRepository] Failed to read custom weapons from localStorage:", err);
        }
        this.customWeaponsCache = [];
        return this.customWeaponsCache;
    }
    /**
     * Saves custom weapons to localStorage and updates in-memory caches.
     */
    static saveCustomWeapons(weapons) {
        try {
            const sanitized = weapons.filter(w => this.isValidWeaponDef(w));
            if (typeof localStorage !== "undefined") {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sanitized));
            }
            this.customWeaponsCache = sanitized;
            this.invalidateCache();
            this.customWeaponsCache = sanitized;
            return true;
        }
        catch (err) {
            console.warn("[WeaponRepository] Failed to save custom weapons to localStorage:", err);
            return false;
        }
    }
    /**
     * Returns combined list of built-in and custom weapons.
     */
    static getAllWeapons() {
        if (this.allWeaponsCache !== null) {
            return this.allWeaponsCache;
        }
        this.allWeaponsCache = [...BUILTIN_WEAPONS, ...this.getCustomWeapons()];
        return this.allWeaponsCache;
    }
    /**
     * Returns weapons grouped by ModSource using an indexed Map.
     */
    static getWeaponsByMod() {
        if (this.weaponsByModCache !== null) {
            return this.weaponsByModCache;
        }
        const map = new Map();
        const all = this.getAllWeapons();
        for (const w of all) {
            const list = map.get(w.mod);
            if (list) {
                list.push(w);
            }
            else {
                map.set(w.mod, [w]);
            }
        }
        this.weaponsByModCache = map;
        return this.weaponsByModCache;
    }
    /**
     * Strict runtime validation guard for WeaponDef structures.
     */
    static isValidWeaponDef(obj) {
        if (!obj || typeof obj !== "object")
            return false;
        const candidate = obj;
        if (typeof candidate.id !== "string" || candidate.id.trim() === "")
            return false;
        if (!Array.isArray(candidate.factions) || candidate.factions.length === 0)
            return false;
        if (!Array.isArray(candidate.roles) || candidate.roles.length === 0)
            return false;
        if (!Array.isArray(candidate.defaultMag) || candidate.defaultMag.length < 2)
            return false;
        if (typeof candidate.defaultMag[0] !== "string" || candidate.defaultMag[0].trim() === "")
            return false;
        if (typeof candidate.defaultMag[1] !== "number" || candidate.defaultMag[1] <= 0)
            return false;
        return true;
    }
    /**
     * Normalizes partial or imported weapon objects with default attributes.
     */
    static sanitizeWeapon(input) {
        var _a;
        const id = (input.id || "").trim();
        const magId = (input.defaultMag && input.defaultMag[0]) ? input.defaultMag[0].trim() : "30Rnd_556x45_Stanag";
        const magCap = (input.defaultMag && typeof input.defaultMag[1] === "number" && input.defaultMag[1] > 0)
            ? input.defaultMag[1]
            : 30;
        const factions = Array.isArray(input.factions) && input.factions.length > 0
            ? input.factions.filter(f => isValidFaction(f))
            : ["NATO"];
        const roles = Array.isArray(input.roles) && input.roles.length > 0
            ? input.roles.filter(r => isValidRole(r))
            : ["Rifleman"];
        const caliber = (input.caliber && isValidCaliber(input.caliber))
            ? input.caliber
            : "5.56x45";
        const opticType = (input.opticType && isValidOpticProfile(input.opticType))
            ? input.opticType
            : "mid";
        return {
            id,
            name: ((_a = input.name) === null || _a === void 0 ? void 0 : _a.trim()) || id,
            mod: input.mod || "Custom",
            factions: factions.length > 0 ? factions : ["NATO"],
            roles: roles.length > 0 ? roles : ["Rifleman"],
            tier: input.tier || "standard",
            caliber,
            defaultMag: [magId, magCap],
            opticType,
            hasBipod: Boolean(input.hasBipod),
            hasMuzzle: Boolean(input.hasMuzzle),
            photoUrl: input.photoUrl || `assets/weapons/photos/${id}.png`
        };
    }
    /**
     * Retrieves a single weapon definition by its classname ID.
     * Returns undefined if no weapon with the given ID exists.
     */
    static getById(id) {
        if (!id || typeof id !== "string") return undefined;
        return this.getAllWeapons().find(w => w.id === id);
    }
}
WeaponRepository.STORAGE_KEY = "arma3_custom_weapons";
WeaponRepository.customWeaponsCache = null;
// Fast-lookup index caches
WeaponRepository.allWeaponsCache = null;
WeaponRepository.weaponsByModCache = null;
// ----------------------------------------------------------------------------
// 5. Core Loadout Generation Engine
// ----------------------------------------------------------------------------
class LoadoutEngine {
    /**
     * Primary loadout generator. Operates without any direct DOM dependencies.
     */
    static generate(options) {
        const factionsList = VALID_FACTIONS;
        const rolesList = ["Rifleman", "Medic", "Marksman", "Anti-Tank", "Machine Gunner", "Sniper"];

        let faction;
        let role;
        let weapon;

        const allWeapons = WeaponRepository.getAllWeapons();
        const lockedPrimary = options.lockedWeaponId ? allWeapons.find(w => w.id === options.lockedWeaponId) : undefined;

        let lockedLauncherDef;
        let lockedHandgunClass;

        if (options.lockedWeaponId && !lockedPrimary) {
            for (const f of VALID_FACTIONS) {
                const l = LAUNCHERS[f]?.find(ld => ld.id === options.lockedWeaponId);
                if (l) {
                    lockedLauncherDef = l;
                    if (options.faction === "Random") options.faction = f;
                    if (options.role === "Random") options.role = "Anti-Tank";
                    break;
                }
            }
            if (!lockedLauncherDef) {
                for (const f of VALID_FACTIONS) {
                    if (FACTION_GEAR[f]?.handguns.includes(options.lockedWeaponId)) {
                        lockedHandgunClass = options.lockedWeaponId;
                        if (options.faction === "Random") options.faction = f;
                        break;
                    }
                }
            }
        }

        const chaos = Math.min(Math.max(options.chaosLevel || 1, 1), 3);
        const activeMods = (options.activeMods && options.activeMods.size > 0)
            ? options.activeMods
            : new Set(["Vanilla"]);

        if (lockedPrimary) {
            weapon = lockedPrimary;
            faction = (options.faction !== "Random" && weapon.factions.includes(options.faction))
                ? options.faction
                : (weapon.factions[0] || "NATO");
            role = (options.role !== "Random" && weapon.roles.includes(options.role))
                ? options.role
                : (weapon.roles[0] || "Rifleman");
            LoadoutEngine.lastWeaponId = weapon.id;
        } else {
            faction = options.faction === "Random"
                ? RandomUtils.choice(factionsList, "NATO")
                : options.faction;

            role = options.role === "Random"
                ? RandomUtils.choice(rolesList, "Rifleman")
                : options.role;

            // 1. Gather candidate weapons using indexed map
            const weaponsByMod = WeaponRepository.getWeaponsByMod();
            const candidateWeapons = [];
            for (const mod of activeMods) {
                const list = weaponsByMod.get(mod);
                if (list) {
                    for (let i = 0; i < list.length; i++) {
                        candidateWeapons.push(list[i]);
                    }
                }
            }

            // Guaranteed fallback if active mods yielded 0 weapons
            let availablePool = candidateWeapons.length > 0
                ? candidateWeapons
                : WeaponRepository.getAllWeapons();

            // Caliber filter lock (if specified and not 'all' / 'any')
            if (options.caliber && options.caliber !== "all" && options.caliber !== "any") {
                const cleanOptCal = options.caliber.replace(/mm$/i, "").trim().toLowerCase();
                const caliberMatches = availablePool.filter(w => {
                    if (!w.caliber) return false;
                    const cleanWCal = w.caliber.replace(/mm$/i, "").trim().toLowerCase();
                    return cleanWCal === cleanOptCal || cleanWCal.startsWith(cleanOptCal) || cleanOptCal.startsWith(cleanWCal);
                });
                if (caliberMatches.length > 0) {
                    availablePool = caliberMatches;
                }
            }

            // 2. Filter weapons based on Chaos Level
            let roleFiltered = [];

            if (chaos === 1) {
                // Strict Military: Weapon must match both faction doctrine and role
                roleFiltered = availablePool.filter(w => w.factions.includes(faction) && w.roles.includes(role));
            } else if (chaos === 2) {
                // SpecOps / Contractor: 70% preference for faction match, 30% allied cross-faction
                const factionMatches = availablePool.filter(w => w.factions.includes(faction) && w.roles.includes(role));
                const alliedMatches = availablePool.filter(w => w.roles.includes(role));
                roleFiltered = (RandomUtils.bool(0.7) && factionMatches.length > 0)
                    ? factionMatches
                    : (alliedMatches.length > 0 ? alliedMatches : factionMatches);
            } else {
                // Cursed / Pure Chaos: 80% role-compatible, 20% completely unrestricted cross-role wildcard
                roleFiltered = RandomUtils.bool(0.8)
                    ? availablePool.filter(w => w.roles.includes(role))
                    : availablePool;
            }

            // Defensive fallback progression
            if (roleFiltered.length === 0) {
                roleFiltered = availablePool.filter(w => w.roles.includes(role));
                if (roleFiltered.length === 0) {
                    roleFiltered = availablePool;
                }
            }

            let finalCandidates = roleFiltered;
            if (LoadoutEngine.lastWeaponId && roleFiltered.length > 1) {
                const withoutLast = roleFiltered.filter(w => w.id !== LoadoutEngine.lastWeaponId);
                if (withoutLast.length > 0) {
                    finalCandidates = withoutLast;
                }
            }

            weapon = finalCandidates.length > 0
                ? RandomUtils.choice(finalCandidates, FALLBACK_WEAPON)
                : FALLBACK_WEAPON;
            LoadoutEngine.lastWeaponId = weapon.id;
        }

        // 3. Optic Selection based on Profile, Role & Chaos
        let opticProfile = weapon.opticType;
        if (options.opticProfile && options.opticProfile !== "auto") {
            opticProfile = options.opticProfile;
        } else if (role === "Sniper") {
            opticProfile = "long";
        } else if (role === "Medic" || role === "Pilot") {
            opticProfile = "cqb";
        } else if (role === "Marksman") {
            opticProfile = RandomUtils.bool(0.7) ? "long" : "mid";
        } else if (role === "Machine Gunner") {
            opticProfile = RandomUtils.bool(0.6) ? "mid" : "cqb";
        }

        if (chaos === 3 && RandomUtils.bool(0.4) && !lockedPrimary && (!options.opticProfile || options.opticProfile === "auto")) {
            opticProfile = RandomUtils.choice(VALID_OPTIC_PROFILES, "mid");
        }
        if (options.nightOps && (!options.opticProfile || options.opticProfile === "auto") && RandomUtils.bool(0.35)) {
            opticProfile = "thermal";
        }

        const opticPool = OPTICS_POOL[opticProfile] || OPTICS_POOL.mid;
        const validOptics = opticPool.filter(o => activeMods.has(o.mod) || o.mod === "Vanilla" || (lockedPrimary && o.mod === weapon.mod));
        const hasOptic = lockedPrimary ? true : (options.nightOps || RandomUtils.bool(0.55));
        const optic = (hasOptic && validOptics.length > 0) ? RandomUtils.choice(validOptics).id : "";

        // 4. Caliber-Accurate Muzzle Suppressor
        let muzzle = "";
        const suppressorChance = lockedPrimary ? 0.7 : (options.nightOps ? 0.85 : (chaos === 1 ? 0.2 : (chaos === 2 ? 0.75 : 0.5)));
        if (weapon.hasMuzzle && RandomUtils.bool(suppressorChance)) {
            const caliberMuzzles = MUZZLES_BY_CALIBER[weapon.caliber] || [];
            const validMuzzles = caliberMuzzles.filter(m => activeMods.has(m.mod) || m.mod === "Vanilla" || (lockedPrimary && m.mod === weapon.mod));
            if (validMuzzles.length > 0) {
                muzzle = RandomUtils.choice(validMuzzles).id;
            }
        }

        // 5. Bipod Assignment
        let bipod = "";
        if (weapon.hasBipod) {
            if (weapon.defaultBipod) {
                bipod = weapon.defaultBipod;
            } else {
                const bipods = ["bipod_01_F_blk", "bipod_01_F_snd", "bipod_02_F_blk", "bipod_03_F_oli"];
                bipod = RandomUtils.choice(bipods, "bipod_01_F_blk");
            }
        }

        // 6. Rail Pointer (IR laser / tactical flashlight)
        let pointer = "";
        if (options.nightOps) {
            pointer = "acc_pointer_IR";
        } else {
            const pointerChance = chaos >= 2 ? 0.85 : 0.5;
            pointer = RandomUtils.bool(pointerChance)
                ? RandomUtils.choice(COMMON_ITEMS.pointers, "")
                : "";
        }

        // 7. Secondary Launcher (Anti-Tank role or locked launcher)
        let launcher = "";
        let launcherMag = ["", 0];
        if (role === "Anti-Tank" || lockedLauncherDef) {
            if (lockedLauncherDef) {
                launcher = lockedLauncherDef.id;
                launcherMag = [...lockedLauncherDef.defaultMag];
            } else {
                const factionLaunchers = LAUNCHERS[faction] || LAUNCHERS.NATO;
                const validLaunchers = factionLaunchers.filter(l => activeMods.has(l.mod) || l.mod === "Vanilla");
                const chosenLauncher = validLaunchers.length > 0
                    ? RandomUtils.choice(validLaunchers, factionLaunchers[0])
                    : factionLaunchers[0];
                launcher = chosenLauncher.id;
                launcherMag = [...chosenLauncher.defaultMag];
            }
        }

        // 8. Handgun & Sidearm Suppressor
        const factionGear = FACTION_GEAR[faction] || FACTION_GEAR.NATO;
        const handgun = lockedHandgunClass || RandomUtils.choice(factionGear.handguns, "hgun_P07_F");
        const handgunMag = [...factionGear.handgunMag];
        const hMuzzleChance = chaos >= 2 ? 0.6 : 0.2;
        const hMuzzle = (factionGear.handgunMuzzles && RandomUtils.bool(hMuzzleChance))
            ? RandomUtils.choice(factionGear.handgunMuzzles, "")
            : "";
        // 9. Uniform, Vest & Tactical Backpack
        let clothingFaction = faction;
        if (chaos === 3 && RandomUtils.bool(0.6)) {
            clothingFaction = RandomUtils.choice(factionsList, faction);
        }
        let cGear = FACTION_GEAR[clothingFaction] || FACTION_GEAR.NATO;
        if (options.biome && options.biome !== "auto" && BIOME_GEAR[options.biome] && BIOME_GEAR[options.biome][clothingFaction]) {
            cGear = BIOME_GEAR[options.biome][clothingFaction];
        }
        const uniform = RandomUtils.choice(cGear.uniforms, "U_B_CombatUniform_mcam");
        const vest = RandomUtils.choice(cGear.vests, "V_PlateCarrier1_rgr");
        let backpack = "";
        if (role === "Medic" || role === "Anti-Tank" || role === "Machine Gunner" || (chaos >= 2 && RandomUtils.bool(0.6))) {
            backpack = RandomUtils.choice(cGear.backpacks, "");
        }
        if (role === "Pilot") {
            backpack = ""; // Aviators do not wear backpacks in cockpits
        }
        const headgear = RandomUtils.choice(cGear.headgear, "H_HelmetB");
        const facewear = RandomUtils.choice(COMMON_ITEMS.facewear, "");
        // 10. Electronics, Optics & Binoculars
        const needsOptics = role === "Marksman" || role === "Sniper" || RandomUtils.bool(0.35);
        const binocular = needsOptics
            ? (role === "Sniper" ? "Rangefinder" : RandomUtils.choice(COMMON_ITEMS.binoculars, "Binocular"))
            : "";
        let nvg = "";
        if (options.nightOps) {
            nvg = COMMON_ITEMS.nvg[faction] || "NVGoggles";
        } else {
            const nvgChance = chaos === 1 ? 0.75 : 0.95;
            nvg = RandomUtils.bool(nvgChance) ? (COMMON_ITEMS.nvg[faction] || "NVGoggles") : "";
        }
        // 11. Realistic Ammo Count Scaled to Role & Magazine Capacity
        let primaryMagCount = 7;
        if (role === "Machine Gunner") {
            primaryMagCount = weapon.defaultMag[1] >= 150 ? 3 : 4;
        }
        else if (role === "Sniper") {
            primaryMagCount = 7;
        }
        else if (role === "Medic") {
            primaryMagCount = 5;
        }
        else if (role === "Pilot") {
            primaryMagCount = 4;
        }
        const handgunMagCount = role === "Pilot" ? 3 : 2;

        const effectiveAmmoType = options.nightOps && (!options.ammoType || options.ammoType === "ball")
            ? "tracer"
            : (options.ammoType || "ball");
        const primaryMag = AmmunitionManager.getSpecialtyMag(weapon.defaultMag, effectiveAmmoType, weapon.caliber);

        const loadoutData = {
            faction,
            role,
            primary: {
                class: weapon.id,
                mag: [...primaryMag],
                optic,
                pointer,
                bipod,
                muzzle,
                count: primaryMagCount
            },
            handgun: {
                class: handgun,
                mag: handgunMag,
                muzzle: hMuzzle,
                pointer: "",
                optic: "",
                bipod: "",
                count: handgunMagCount
            },
            launcher: {
                class: launcher,
                mag: launcherMag
            },
            clothing: { uniform, vest, backpack, headgear, facewear },
            items: {
                binocular,
                nvg,
                grenadeChoice: RandomUtils.choice(COMMON_ITEMS.grenades, "HandGrenade"),
                grenadeCount: role === "Pilot" ? 0 : RandomUtils.int(1, 2),
                smokeChoice: role === "Pilot" ? "SmokeShellGreen" : RandomUtils.choice(COMMON_ITEMS.smokes, "SmokeShell"),
                smokeCount: role === "Pilot" ? 4 : RandomUtils.int(2, 3),
                linked: [...COMMON_ITEMS.linkedItems]
            },
            meta: {
                chaosLevel: chaos,
                primaryMod: weapon.mod,
                caliber: weapon.caliber,
                biome: options.biome || "auto",
                opticProfile: options.opticProfile || "auto",
                nightOps: Boolean(options.nightOps),
                isNightOps: Boolean(options.nightOps),
                medicalLevel: options.medicalLevel || "ace3_standard",
                ammoType: effectiveAmmoType,
                sqfFormat: options.sqfFormat || "player"
            }
        };
        return { loadoutData, sqf: SqfSerializer.serialize(loadoutData, options.sqfFormat || "player", options.customName) };
    }
}
LoadoutEngine.lastWeaponId = null;
// ----------------------------------------------------------------------------
// 6. Curated Best Loadout Factory (High-Performance SOF Presets & Meta Engine)
// ----------------------------------------------------------------------------
const META_PRESETS = [
    // =========================================================================
    // 1. BLUFOR / NATO / Western SOF Presets
    // =========================================================================
    {
        id: "nato_pointman_hybrid",
        faction: "NATO",
        role: "Pointman",
        mod: "Hybrid",
        title: "Tier-1 Breacher (M590A1 Tactical 12G)",
        description: "Close-quarters tactical shotgun breaching kit with high-density 00 buckshot, EOTech CQB holographic sight, and suppressed sidearm.",
        primaryClass: "rhs_weap_M590A1_9rd",
        primaryMag: ["rhsusf_8Rnd_00Buck", 8],
        optic: "rhsusf_acc_eotech_552",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 9,
        handgunClass: "rhsusf_weap_glock17",
        handgunMag: ["rhsusf_mag_17Rnd_9x19_JHP", 17],
        handgunMuzzle: "muzzle_snds_L",
        uniform: "U_B_SpecopsUniform_sgg",
        vest: "V_PlateCarrier2_rgr",
        backpack: "B_AssaultPack_rgr",
        headgear: "H_HelmetB_light_black",
        facewear: "G_Balaclava_blk",
        nvg: "NVGoggles",
        binocular: "Binocular"
    },
    {
        id: "nato_pointman_vanilla",
        faction: "NATO",
        role: "Pointman",
        mod: "Vanilla",
        title: "NATO CQC Breacher (MXC Black 6.5mm)",
        description: "Compact high-velocity 6.5mm bullpup carbine with reflex optic and sound suppressor for room clearance.",
        primaryClass: "arifle_MXC_Black_F",
        primaryMag: ["30Rnd_65x39_caseless_mag", 30],
        optic: "optic_Holosight",
        muzzle: "muzzle_snds_H",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "hgun_P07_F",
        handgunMag: ["16Rnd_9x21_Mag", 16],
        handgunMuzzle: "muzzle_snds_L"
    },
    {
        id: "nato_pointman_cup",
        faction: "NATO",
        role: "Pointman",
        mod: "CUP",
        title: "USMC Breacher (Benelli M1014 Combat 12G)",
        description: "Semi-automatic 12-gauge tactical shotgun platform equipped with reflex sight and breaching charges.",
        primaryClass: "CUP_sgun_M1014",
        primaryMag: ["CUP_8Rnd_B_Beneli_74Pellets", 8],
        optic: "optic_Holosight",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 9,
        handgunClass: "CUP_hgun_M9",
        handgunMag: ["CUP_15Rnd_9x19_M9", 15],
        handgunMuzzle: "muzzle_snds_L"
    },
    {
        id: "nato_pointman_niarms",
        faction: "NATO",
        role: "Pointman",
        mod: "NIArms",
        title: "DEVGRU CQBR Operator (Mk 18 CQBR)",
        description: "Compact 10.3-inch barrel AR platform with fast handling, suppressor, and close-quarters optic.",
        primaryClass: "hlc_rifle_CQBR",
        primaryMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30],
        optic: "rhsusf_acc_eotech_552",
        muzzle: "rhsusf_acc_nt4_black",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "rhsusf_weap_glock17",
        handgunMag: ["rhsusf_mag_17Rnd_9x19_JHP", 17]
    },
    {
        id: "nato_rifleman_hybrid",
        faction: "NATO",
        role: "Rifleman",
        mod: "Hybrid",
        title: "CAG Operator (HK416 D14.5 CAG 5.56mm)",
        description: "Geissele SMR railed HK416 with Hamr combat optic, NT4 quick-detach suppressor, and high-velocity M855A1 EPR loads.",
        primaryClass: "hlc_rifle_416D145_CAG",
        primaryMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30],
        optic: "optic_Hamr",
        muzzle: "rhsusf_acc_nt4_black",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "rhsusf_weap_m9",
        handgunMag: ["rhsusf_mag_15Rnd_9x19_JHP", 15],
        handgunMuzzle: "muzzle_snds_L"
    },
    {
        id: "nato_rifleman_rhs",
        faction: "NATO",
        role: "Rifleman",
        mod: "RHS",
        title: "US Army SOF (M4A1 Block II KAC 5.56mm)",
        description: "SOPMOD Block II M4A1 with Daniel Defense RIS II, SpecterDR 1-4x dual-role optic, and KAC QD sound suppressor.",
        primaryClass: "rhs_weap_m4a1_blockII_KAC",
        primaryMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30],
        optic: "optic_Hamr",
        muzzle: "rhsusf_acc_nt4_black",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "rhsusf_weap_m1911a1",
        handgunMag: ["rhsusf_mag_7x45acp_MHP", 7]
    },
    {
        id: "nato_rifleman_vanilla",
        faction: "NATO",
        role: "Rifleman",
        mod: "Vanilla",
        title: "NATO Strike Rifleman (SPAR-16 Black 5.56mm)",
        description: "Modern German gas-piston modular service rifle equipped with Hamr optic and sound suppressor.",
        primaryClass: "arifle_SPAR_01_blk_F",
        primaryMag: ["30Rnd_556x45_Stanag", 30],
        optic: "optic_Hamr",
        muzzle: "muzzle_snds_M",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "hgun_P07_F",
        handgunMag: ["16Rnd_9x21_Mag", 16]
    },
    {
        id: "nato_medic_hybrid",
        faction: "NATO",
        role: "Medic",
        mod: "Hybrid",
        title: "Combat Medic Special Operations (Mk 18 Mod 1 KAC)",
        description: "High-mobility CQB carbine paired with an extensive ACE3 trauma surgical backpack, IVs, and multi-spectral smoke concealment.",
        primaryClass: "rhs_weap_mk18_KAC",
        primaryMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30],
        optic: "rhsusf_acc_eotech_552",
        muzzle: "rhsusf_acc_nt4_black",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 5,
        handgunClass: "hgun_P07_F",
        handgunMag: ["16Rnd_9x21_Mag", 16],
        uniform: "U_B_CombatUniform_mcam_vest",
        vest: "V_PlateCarrier2_rgr",
        backpack: "B_Carryall_mcamo",
        headgear: "H_HelmetB_light",
        facewear: "G_Tactical_Clear"
    },
    {
        id: "nato_lmg_hybrid",
        faction: "NATO",
        role: "Machine Gunner",
        mod: "Hybrid",
        title: "Automatic Rifleman (M249 PIP SAW 5.56mm)",
        description: "Sustained high-volume suppressive fire with 200-round continuous belts, Hamr combat optic, and integrated saw bipod.",
        primaryClass: "rhs_weap_m249_pip",
        primaryMag: ["rhsusf_200Rnd_556x45_box", 200],
        optic: "optic_Hamr",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "rhsusf_acc_saw_bipod",
        primaryCount: 4,
        handgunClass: "rhsusf_weap_m9",
        handgunMag: ["rhsusf_mag_15Rnd_9x19_JHP", 15]
    },
    {
        id: "nato_lmg_rhs",
        faction: "NATO",
        role: "Machine Gunner",
        mod: "RHS",
        title: "Heavy Gunner (M240B 7.62mm GPMG)",
        description: "Hard-hitting 7.62x51mm general purpose machine gun with 100-round linked disintegrating belts and mid-range combat glass.",
        primaryClass: "rhs_weap_m240B",
        primaryMag: ["rhsusf_100Rnd_762x51", 100],
        optic: "optic_Hamr",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "bipod_01_F_blk",
        primaryCount: 4,
        handgunClass: "rhsusf_weap_m9",
        handgunMag: ["rhsusf_mag_15Rnd_9x19_JHP", 15]
    },
    {
        id: "nato_marksman_hybrid",
        faction: "NATO",
        role: "Marksman",
        mod: "Hybrid",
        title: "Squad Designated Marksman (KAC SR-25 EC 7.62mm)",
        description: "Semi-automatic precision match rifle with Leupold Mk4 ER/T optic, Harris bipod, SR-25S suppressor, and M118LR match grade ammunition.",
        primaryClass: "rhs_weap_sr25_ec",
        primaryMag: ["rhsusf_20Rnd_762x51_m118_special_Mag", 20],
        optic: "rhsusf_acc_LEUPOLDMK4",
        muzzle: "rhsusf_acc_SR25S",
        pointer: "acc_pointer_IR",
        bipod: "rhsusf_acc_harris_bipod",
        primaryCount: 7,
        handgunClass: "rhsusf_weap_m1911a1",
        handgunMag: ["rhsusf_mag_7x45acp_MHP", 7]
    },
    {
        id: "nato_sniper_hybrid",
        faction: "NATO",
        role: "Sniper",
        mod: "Hybrid",
        title: "Anti-Materiel Sniper (Barrett M107 .50 BMG)",
        description: "Extreme long-range anti-armor sniper platform with LRPS high-magnification scope, heavy folding bipod, and laser rangefinder.",
        primaryClass: "rhs_weap_M107",
        primaryMag: ["rhsusf_mag_10Rnd_STD_50BMG_M33", 10],
        optic: "optic_LRPS",
        muzzle: "",
        pointer: "",
        bipod: "rhsusf_acc_harris_bipod",
        primaryCount: 6,
        handgunClass: "rhsusf_weap_m9",
        handgunMag: ["rhsusf_mag_15Rnd_9x19_JHP", 15],
        handgunMuzzle: "muzzle_snds_L",
        binocular: "Rangefinder"
    },
    {
        id: "nato_at_hybrid",
        faction: "NATO",
        role: "Anti-Tank",
        mod: "Hybrid",
        title: "Heavy Anti-Tank Specialist (Javelin FGM-148 & M4A1)",
        description: "Fire-and-forget top-attack anti-tank guided missile system combined with a compact suppressed M4A1 Block II carbine.",
        primaryClass: "rhs_weap_m4a1_blockII_KAC",
        primaryMag: ["rhs_mag_30Rnd_556x45_M855A1_Stanag", 30],
        optic: "rhsusf_acc_eotech_552",
        muzzle: "rhsusf_acc_nt4_black",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 6,
        launcherClass: "rhs_weap_fgm148",
        launcherMag: ["rhs_fgm148_magazine_AT", 1],
        handgunClass: "rhsusf_weap_glock17",
        handgunMag: ["rhsusf_mag_17Rnd_9x19_JHP", 17]
    },
    {
        id: "nato_pilot_hybrid",
        faction: "NATO",
        role: "Pilot",
        mod: "Hybrid",
        title: "Rotary Wing Pilot (MP7A2 4.6mm Submachine Gun)",
        description: "Compact survival loadout for aircraft cockpits with 40-round high-velocity 4.6x30mm PDW and aviation flight gear.",
        primaryClass: "rhsusf_weap_MP7A2",
        primaryMag: ["rhsusf_40Rnd_46x30_mp7", 40],
        optic: "optic_Holosight_smg",
        muzzle: "muzzle_snds_L",
        pointer: "",
        bipod: "",
        primaryCount: 4,
        handgunClass: "hgun_P07_F",
        handgunMag: ["16Rnd_9x21_Mag", 16],
        uniform: "U_B_HeliPilotCoveralls",
        vest: "V_TacVest_blk",
        headgear: "H_PilotHelmetHeli_B",
        facewear: "G_Aviator"
    },

    // =========================================================================
    // 2. OPFOR / CSAT / Eastern Spetsnaz Presets
    // =========================================================================
    {
        id: "csat_pointman_hybrid",
        faction: "CSAT",
        role: "Pointman",
        mod: "Hybrid",
        title: "Spetsnaz Breacher (Saiga-12K Combat Shotgun)",
        description: "Devastating close-quarters 12-gauge magazine-fed shotgun with tactical rail and heavy slug payloads.",
        primaryClass: "CUP_sgun_Saiga12K",
        primaryMag: ["CUP_8Rnd_B_Saiga12_74Slug", 8],
        optic: "CUP_optic_Kobra",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 9,
        handgunClass: "rhs_weap_6p9",
        handgunMag: ["rhs_mag_9x18_8_57N181S", 8],
        uniform: "U_O_SpecopsUniform_ocamo",
        vest: "V_HarnessOSpec_brn",
        headgear: "H_HelmetLeaderO_ocamo",
        facewear: "G_Balaclava_blk"
    },
    {
        id: "csat_pointman_rhs",
        faction: "CSAT",
        role: "Pointman",
        mod: "RHS",
        title: "Alpha Group Infiltrator (AS Val Modular 9x39mm)",
        description: "Integrally suppressed subsonic armor-piercing 9x39mm carbine specialized for covert interior clearance.",
        primaryClass: "rhs_weap_asval_modular",
        primaryMag: ["rhs_20rnd_9x39mm_SP6", 20],
        optic: "CUP_optic_Kobra",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "rhs_weap_pya",
        handgunMag: ["rhs_mag_9x19_17", 17]
    },
    {
        id: "csat_rifleman_hybrid",
        faction: "CSAT",
        role: "Rifleman",
        mod: "Hybrid",
        title: "Viper Elite Operator (AK-12 7.62x39mm Modernized)",
        description: "Modernized Russian assault rifle with Arco multi-optic, PBS-4 sound suppressor, and 7.62mm armor-piercing loads.",
        primaryClass: "arifle_AK12_F",
        primaryMag: ["30Rnd_762x39_AK12_Mag_F", 30],
        optic: "optic_Arco",
        muzzle: "CUP_muzzle_PBS4",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "rhs_weap_pya",
        handgunMag: ["rhs_mag_9x19_17", 17]
    },
    {
        id: "csat_rifleman_rhs",
        faction: "CSAT",
        role: "Rifleman",
        mod: "RHS",
        title: "VDV Spetsnaz (AK-74M Zenitco 5.45mm)",
        description: "Full Zenitco aluminum rail package with Kobra red dot, PBS suppressor, and 7N22 armor-piercing ammunition.",
        primaryClass: "rhs_weap_ak74m_zenitco01",
        primaryMag: ["rhs_30Rnd_545x39_7N22_AK", 30],
        optic: "optic_Arco",
        muzzle: "CUP_muzzle_PBS4",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "rhs_weap_pya",
        handgunMag: ["rhs_mag_9x19_17", 17]
    },
    {
        id: "csat_medic_hybrid",
        faction: "CSAT",
        role: "Medic",
        mod: "Hybrid",
        title: "CSAT Field Surgeon (AK-12U Carbine 7.62mm)",
        description: "Compact 7.62mm carbine paired with complete battlefield triage kits, tourniquets, and tactical smoke screens.",
        primaryClass: "arifle_AK12U_F",
        primaryMag: ["30Rnd_762x39_AK12_Mag_F", 30],
        optic: "CUP_optic_Kobra",
        muzzle: "CUP_muzzle_PBS4",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 5,
        handgunClass: "hgun_Rook40_F",
        handgunMag: ["16Rnd_9x21_Mag", 16],
        backpack: "B_Carryall_ocamo"
    },
    {
        id: "csat_lmg_hybrid",
        faction: "CSAT",
        role: "Machine Gunner",
        mod: "Hybrid",
        title: "Heavy Suppression Gunner (PKP Pecheneg 7.62mm)",
        description: "Forced-air-cooled heavy machine gun with 100-round 7.62x54mmR belts, Arco optic, and integral bipod.",
        primaryClass: "rhs_weap_pkp",
        primaryMag: ["rhs_100Rnd_762x54mmR", 100],
        optic: "optic_Arco",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "bipod_01_F_blk",
        primaryCount: 4,
        handgunClass: "hgun_Rook40_F",
        handgunMag: ["16Rnd_9x21_Mag", 16]
    },
    {
        id: "csat_lmg_vanilla",
        faction: "CSAT",
        role: "Machine Gunner",
        mod: "Vanilla",
        title: "Viper Fire Support (Navid 9.3mm Heavy MMG)",
        description: "Massive 9.3x64mm armor-piercing machine gun delivering catastrophic barrier penetration and area denial.",
        primaryClass: "MMG_01_hex_F",
        primaryMag: ["150Rnd_93x64_Mag", 150],
        optic: "optic_Arco",
        muzzle: "muzzle_snds_93mmg",
        pointer: "acc_pointer_IR",
        bipod: "bipod_01_F_blk",
        primaryCount: 3,
        handgunClass: "hgun_Rook40_F",
        handgunMag: ["16Rnd_9x21_Mag", 16]
    },
    {
        id: "csat_marksman_hybrid",
        faction: "CSAT",
        role: "Marksman",
        mod: "Hybrid",
        title: "Heavy Marksman (Cyrus 9.3mm Suppressed DMR)",
        description: "High-caliber 9.3mm bullpup precision rifle capable of penetrating vehicle glass and body armor at medium range.",
        primaryClass: "srifle_DMR_05_blk_F",
        primaryMag: ["10Rnd_93x64_DMR_05_Mag", 10],
        optic: "optic_SOS",
        muzzle: "muzzle_snds_93mmg",
        pointer: "acc_pointer_IR",
        bipod: "bipod_01_F_blk",
        primaryCount: 7,
        handgunClass: "rhs_weap_pya",
        handgunMag: ["rhs_mag_9x19_17", 17]
    },
    {
        id: "csat_sniper_hybrid",
        faction: "CSAT",
        role: "Sniper",
        mod: "Hybrid",
        title: "Extreme Distance Sniper (GM6 Lynx 12.7mm APDS)",
        description: "Bullpup 12.7x108mm anti-materiel cannon with recoiling barrel, LRPS long scope, and rangefinder integration.",
        primaryClass: "srifle_GM6_F",
        primaryMag: ["5Rnd_127x108_Mag", 5],
        optic: "optic_LRPS",
        muzzle: "",
        pointer: "",
        bipod: "bipod_01_F_blk",
        primaryCount: 7,
        handgunClass: "rhs_weap_pya",
        handgunMag: ["rhs_mag_9x19_17", 17],
        binocular: "Rangefinder"
    },
    {
        id: "csat_at_hybrid",
        faction: "CSAT",
        role: "Anti-Tank",
        mod: "Hybrid",
        title: "Heavy Armor Hunter (Vorona 9M135 Wire-Guided AT)",
        description: "Heavy laser/wire-guided anti-tank missile platform capable of defeating modern active protection systems.",
        primaryClass: "arifle_AK12U_F",
        primaryMag: ["30Rnd_762x39_AK12_Mag_F", 30],
        optic: "CUP_optic_Kobra",
        muzzle: "CUP_muzzle_PBS4",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 6,
        launcherClass: "launch_O_Vorona_brown_F",
        launcherMag: ["Vorona_HEAT", 1],
        handgunClass: "hgun_Rook40_F",
        handgunMag: ["16Rnd_9x21_Mag", 16]
    },
    {
        id: "csat_pilot_hybrid",
        faction: "CSAT",
        role: "Pilot",
        mod: "Hybrid",
        title: "Spetsnaz Aviator (AKS-74U Krinkov 5.45mm)",
        description: "Aviation coveralls and high-velocity compact personal defense firearm for downed pilot evasion.",
        primaryClass: "CUP_arifle_AKS74U",
        primaryMag: ["CUP_30Rnd_545x39_AK_M", 30],
        optic: "CUP_optic_Kobra",
        muzzle: "",
        pointer: "",
        bipod: "",
        primaryCount: 4,
        handgunClass: "hgun_Rook40_F",
        handgunMag: ["16Rnd_9x21_Mag", 16],
        uniform: "U_O_PilotCoveralls",
        vest: "V_TacVest_khk",
        headgear: "H_PilotHelmetHeli_O",
        facewear: "G_Aviator"
    },

    // =========================================================================
    // 3. INDEPENDENT / AAF / European Defense Presets
    // =========================================================================
    {
        id: "aaf_pointman_hybrid",
        faction: "AAF",
        role: "Pointman",
        mod: "Hybrid",
        title: "Infiltration Breacher (Promet UBS Shotgun 6.5mm)",
        description: "Modular FB Radom MSBS rifle equipped with masterkey underbarrel shotgun, suppressor, and holographic glass.",
        primaryClass: "arifle_MSBS65_UBS_F",
        primaryMag: ["30Rnd_65x39_caseless_mag", 30],
        optic: "optic_Holosight",
        muzzle: "muzzle_snds_H",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "CUP_hgun_Duty",
        handgunMag: ["CUP_16Rnd_9x19_cz75", 16],
        handgunMuzzle: "muzzle_snds_L"
    },
    {
        id: "aaf_rifleman_hybrid",
        faction: "AAF",
        role: "Rifleman",
        mod: "Hybrid",
        title: "European SOF (Promet Modular 6.5mm MSBS)",
        description: "High-accuracy modular bullpup/standard platform with MRCO combat optic, suppressor, and caseless 6.5mm loads.",
        primaryClass: "arifle_MSBS65_F",
        primaryMag: ["30Rnd_65x39_caseless_mag", 30],
        optic: "optic_MRCO",
        muzzle: "muzzle_snds_H",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "hgun_ACPC2_F",
        handgunMag: ["9Rnd_45ACP_Mag", 9],
        handgunMuzzle: "muzzle_snds_acp"
    },
    {
        id: "aaf_medic_hybrid",
        faction: "AAF",
        role: "Medic",
        mod: "Hybrid",
        title: "Frontline Combat Paramedic (Mk20C 5.56mm Carbine)",
        description: "Compact FN F2000 bullpup carbine paired with complete field trauma kits and smoke screening ordnance.",
        primaryClass: "arifle_Mk20C_F",
        primaryMag: ["30Rnd_556x45_Stanag", 30],
        optic: "optic_Holosight",
        muzzle: "muzzle_snds_M",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 5,
        handgunClass: "hgun_ACPC2_F",
        handgunMag: ["9Rnd_45ACP_Mag", 9],
        backpack: "B_Carryall_oli"
    },
    {
        id: "aaf_lmg_hybrid",
        faction: "AAF",
        role: "Machine Gunner",
        mod: "Hybrid",
        title: "Fire Support Specialist (Mk200 Black 6.5mm SAW)",
        description: "High-capacity 200-round belt-fed 6.5mm light machine gun with MRCO optic and folding tactical bipod.",
        primaryClass: "LMG_Mk200_black_F",
        primaryMag: ["200Rnd_65x39_cased_Box", 200],
        optic: "optic_MRCO",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "bipod_03_F_oli",
        primaryCount: 4,
        handgunClass: "hgun_ACPC2_F",
        handgunMag: ["9Rnd_45ACP_Mag", 9]
    },
    {
        id: "aaf_marksman_hybrid",
        faction: "AAF",
        role: "Marksman",
        mod: "Hybrid",
        title: "Designated Precision Marksman (Mk14 EBR 7.62mm)",
        description: "Modernized M14 Enhanced Battle Rifle in olive digital camo with SOS precision scope, sound suppressor, and bipod.",
        primaryClass: "srifle_EBR_F",
        primaryMag: ["20Rnd_762x51_Mag", 20],
        optic: "optic_SOS",
        muzzle: "muzzle_snds_B",
        pointer: "acc_pointer_IR",
        bipod: "bipod_03_F_oli",
        primaryCount: 7,
        handgunClass: "CUP_hgun_Phantom",
        handgunMag: ["CUP_18Rnd_9x19_Phantom", 18]
    },
    {
        id: "aaf_sniper_hybrid",
        faction: "AAF",
        role: "Sniper",
        mod: "Hybrid",
        title: "Precision Recon Sniper (AWM .338 Lapua Magnum)",
        description: "British Arctic Warfare Magnum delivering sub-MOA precision at 1,500+ meters with LRPS optics and rangefinder.",
        primaryClass: "CUP_srifle_AWM_des",
        primaryMag: ["CUP_5Rnd_86x70_L115A1", 5],
        optic: "optic_LRPS",
        muzzle: "",
        pointer: "",
        bipod: "bipod_03_F_oli",
        primaryCount: 8,
        handgunClass: "hgun_ACPC2_F",
        handgunMag: ["9Rnd_45ACP_Mag", 9],
        binocular: "Rangefinder"
    },
    {
        id: "aaf_at_hybrid",
        faction: "AAF",
        role: "Anti-Tank",
        mod: "Hybrid",
        title: "Armor Breaker (Carl Gustaf M4 MAAWS & Promet)",
        description: "Multi-role 84mm recoilless rifle firing tandem HEAT munitions paired with a suppressed 6.5mm primary rifle.",
        primaryClass: "arifle_MSBS65_F",
        primaryMag: ["30Rnd_65x39_caseless_mag", 30],
        optic: "optic_Holosight",
        muzzle: "muzzle_snds_H",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 6,
        launcherClass: "launch_MRAWS_olive_F",
        launcherMag: ["MRAWS_HEAT_F", 1],
        handgunClass: "hgun_ACPC2_F",
        handgunMag: ["9Rnd_45ACP_Mag", 9]
    },
    {
        id: "aaf_pilot_hybrid",
        faction: "AAF",
        role: "Pilot",
        mod: "Hybrid",
        title: "Tactical Aviator (Sting 9mm SMG)",
        description: "CZ Scorpion EVO 3 compact submachine gun with green reflex sight and high-mobility flight harness.",
        primaryClass: "SMG_02_F",
        primaryMag: ["30Rnd_9x21_Mag_SMG_02", 30],
        optic: "optic_ACO_grn_smg",
        muzzle: "muzzle_snds_L",
        pointer: "",
        bipod: "",
        primaryCount: 4,
        handgunClass: "hgun_ACPC2_F",
        handgunMag: ["9Rnd_45ACP_Mag", 9],
        uniform: "U_I_HeliPilotCoveralls",
        vest: "V_TacVest_oli",
        headgear: "H_PilotHelmetHeli_I",
        facewear: "G_Aviator"
    },

    // =========================================================================
    // 4. GUERILLA / FIA / Irregular & PMC Contractor Presets
    // =========================================================================
    {
        id: "fia_pointman_hybrid",
        faction: "FIA",
        role: "Pointman",
        mod: "Hybrid",
        title: "Syndicate Breacher (Saiga-12K Drum & Micro Uzi)",
        description: "Aggressive close-range assault loadout with semi-auto 12-gauge slug drum and machine pistol sidearm.",
        primaryClass: "CUP_sgun_Saiga12K",
        primaryMag: ["CUP_8Rnd_B_Saiga12_74Slug", 8],
        optic: "optic_Holosight",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 9,
        handgunClass: "CUP_hgun_MicroUzi",
        handgunMag: ["CUP_30Rnd_9x19_UZI", 30],
        uniform: "U_BG_Guerilla1_1",
        vest: "V_TacVest_blk",
        headgear: "H_Watchcap_blk",
        facewear: "G_Bandanna_oli"
    },
    {
        id: "fia_rifleman_hybrid",
        faction: "FIA",
        role: "Rifleman",
        mod: "Hybrid",
        title: "Contractor Operator (CZ 805 BREN A1 5.56mm)",
        description: "Modular Czech service rifle equipped with Hamr optic, sound suppressor, and armor-piercing combat loads.",
        primaryClass: "CUP_arifle_CZ805_A1",
        primaryMag: ["30Rnd_556x45_Stanag", 30],
        optic: "optic_Hamr",
        muzzle: "muzzle_snds_M",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 7,
        handgunClass: "hgun_P07_F",
        handgunMag: ["16Rnd_9x21_Mag", 16]
    },
    {
        id: "fia_medic_hybrid",
        faction: "FIA",
        role: "Medic",
        mod: "Hybrid",
        title: "Guerilla Medic (TRG-20 Tavor Carbine)",
        description: "Lightweight 5.56mm bullpup carbine with reflex sight, sound suppressor, and rapid casualty stabilization gear.",
        primaryClass: "arifle_TRG20_F",
        primaryMag: ["30Rnd_556x45_Stanag", 30],
        optic: "optic_Holosight",
        muzzle: "muzzle_snds_M",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 5,
        handgunClass: "hgun_P07_F",
        handgunMag: ["16Rnd_9x21_Mag", 16],
        backpack: "B_AssaultPack_cbr"
    },
    {
        id: "fia_lmg_hybrid",
        faction: "FIA",
        role: "Machine Gunner",
        mod: "Hybrid",
        title: "Guerilla Support Gunner (PKM 7.62x54mm Heavy)",
        description: "Battlefield-proven Kalashnikov heavy machine gun firing 100-round green tracer belts with combat optic.",
        primaryClass: "CUP_lmg_PKM",
        primaryMag: ["CUP_100Rnd_TE4_LRT4_762x54_PK_Tracer_Green_M", 100],
        optic: "optic_MRCO",
        muzzle: "",
        pointer: "acc_pointer_IR",
        bipod: "bipod_01_F_blk",
        primaryCount: 4,
        handgunClass: "rhs_weap_makarov_pm",
        handgunMag: ["rhs_mag_9x18_8_57N181S", 8]
    },
    {
        id: "fia_marksman_hybrid",
        faction: "FIA",
        role: "Marksman",
        mod: "Hybrid",
        title: "Insurgent Marksman (FN FAL 50.61 Paratrooper)",
        description: "Classic 7.62x51mm battle rifle with modern rail conversion, MRCO optic, suppressor, and folding bipod.",
        primaryClass: "CUP_srifle_FNFAL5061",
        primaryMag: ["20Rnd_762x51_Mag", 20],
        optic: "optic_MRCO",
        muzzle: "muzzle_snds_B",
        pointer: "acc_pointer_IR",
        bipod: "bipod_01_F_blk",
        primaryCount: 7,
        handgunClass: "rhs_weap_tt33",
        handgunMag: ["rhs_mag_762x25_8", 8]
    },
    {
        id: "fia_sniper_hybrid",
        faction: "FIA",
        role: "Sniper",
        mod: "Hybrid",
        title: "Covert Hunter (AWM Woodland .338 LM)",
        description: "Match-grade long-range bolt-action rifle equipped with LRPS scope and rangefinder for mountain interdiction.",
        primaryClass: "CUP_srifle_AWM_wdl",
        primaryMag: ["CUP_5Rnd_86x70_L115A1", 5],
        optic: "optic_LRPS",
        muzzle: "",
        pointer: "",
        bipod: "bipod_01_F_blk",
        primaryCount: 8,
        handgunClass: "rhs_weap_tt33",
        handgunMag: ["rhs_mag_762x25_8", 8],
        binocular: "Rangefinder"
    },
    {
        id: "fia_at_hybrid",
        faction: "FIA",
        role: "Anti-Tank",
        mod: "Hybrid",
        title: "Armor Ambush Specialist (RPG-7V2 Tandem & BREN)",
        description: "Heavy tandem-charge anti-tank rocket capable of defeating reactive armor, paired with a modern BREN carbine.",
        primaryClass: "CUP_arifle_CZ805_A2",
        primaryMag: ["30Rnd_556x45_Stanag", 30],
        optic: "optic_Holosight",
        muzzle: "muzzle_snds_M",
        pointer: "acc_pointer_IR",
        bipod: "",
        primaryCount: 6,
        launcherClass: "CUP_launch_RPG7V",
        launcherMag: ["CUP_PG7V_M", 1],
        handgunClass: "hgun_P07_F",
        handgunMag: ["16Rnd_9x21_Mag", 16]
    },
    {
        id: "fia_pilot_hybrid",
        faction: "FIA",
        role: "Pilot",
        mod: "Hybrid",
        title: "Rebel Aviator (Skorpion SA61 Submachine Gun)",
        description: "Ultra-compact Czech machine pistol for helicopter crew survival in contested territory.",
        primaryClass: "CUP_smg_SA61",
        primaryMag: ["CUP_20Rnd_B_765x17_Ball_M", 20],
        optic: "",
        muzzle: "",
        pointer: "",
        bipod: "",
        primaryCount: 4,
        handgunClass: "hgun_P07_F",
        handgunMag: ["16Rnd_9x21_Mag", 16],
        uniform: "U_BG_Guerilla2_1",
        vest: "V_BandollierB_oli",
        headgear: "H_Cap_headphones",
        facewear: "G_Aviator"
    }
];

class BestLoadoutFactory {
    /**
     * Builds curated Special Operations / Tier-1 loadouts with full attachment synergies.
     */
    static create(faction, role, modSuite) {
        // Find matching preset
        let match = META_PRESETS.find(p => p.faction === faction && p.role === role && (modSuite === "Hybrid" || p.mod === modSuite));
        if (!match) {
            match = META_PRESETS.find(p => p.faction === faction && p.role === role);
        }
        if (!match) {
            match = META_PRESETS.find(p => p.role === role) || META_PRESETS[0];
        }

        const gear = FACTION_GEAR[faction] || FACTION_GEAR.NATO;
        const uniform = match.uniform || gear.uniforms[0] || "U_B_CombatUniform_mcam";
        const vest = match.vest || gear.vests[0] || "V_PlateCarrier1_rgr";
        const backpack = match.backpack !== undefined ? match.backpack : (role === "Pilot" ? "" : gear.backpacks[0] || "B_AssaultPack_rgr");
        const headgear = match.headgear || gear.headgear[0] || "H_HelmetB";
        const facewear = match.facewear || (role === "Pilot" ? "G_Aviator" : "G_Tactical_Clear");
        const nvg = match.nvg || COMMON_ITEMS.nvg[faction] || "NVGoggles";
        const binocular = match.binocular || (role === "Sniper" ? "Rangefinder" : "Binocular");

        const handgunClass = match.handgunClass || gear.handguns[0] || "hgun_P07_F";
        const handgunMag = match.handgunMag || [...gear.handgunMag];
        const handgunMuzzle = match.handgunMuzzle !== undefined ? match.handgunMuzzle : (gear.handgunMuzzles ? gear.handgunMuzzles[0] : "");

        const weaponDef = WeaponRepository.getAllWeapons().find(w => w.id === match.primaryClass);
        const primaryMod = weaponDef?.mod || (match.mod === "Hybrid" ? "RHS" : match.mod);
        const caliber = weaponDef?.caliber || "5.56x45";

        const loadoutData = {
            faction,
            role,
            primary: {
                class: match.primaryClass,
                mag: [...match.primaryMag],
                optic: match.optic,
                pointer: match.pointer,
                bipod: match.bipod,
                muzzle: match.muzzle,
                count: match.primaryCount
            },
            handgun: {
                class: handgunClass,
                mag: handgunMag,
                optic: "",
                pointer: "",
                bipod: "",
                muzzle: handgunMuzzle,
                count: role === "Pilot" ? 3 : 2
            },
            launcher: {
                class: match.launcherClass || "",
                mag: match.launcherMag ? [...match.launcherMag] : ["", 0]
            },
            clothing: {
                uniform,
                vest,
                backpack,
                headgear,
                facewear
            },
            items: {
                binocular,
                nvg,
                grenadeChoice: "HandGrenade",
                grenadeCount: role === "Pilot" ? 0 : 2,
                smokeChoice: role === "Pilot" ? "SmokeShellGreen" : "SmokeShell",
                smokeCount: role === "Pilot" ? 4 : 3,
                linked: [...COMMON_ITEMS.linkedItems]
            },
            meta: {
                chaosLevel: 2,
                primaryMod,
                caliber
            }
        };

        return { loadoutData, sqf: SqfSerializer.serialize(loadoutData) };
    }

    /**
     * Returns curated presets optionally filtered by Faction, Role, and Modpack.
     */
    static getAllPresets(filter) {
        return META_PRESETS.filter(p => {
            if (filter?.faction && filter.faction !== "all" && p.faction !== filter.faction) return false;
            if (filter?.role && filter.role !== "all" && p.role !== filter.role) return false;
            if (filter?.mod && filter.mod !== "all" && p.mod !== filter.mod && p.mod !== "Hybrid") return false;
            return true;
        });
    }

    /**
     * Executes biased / weighted rolling among top-tier meta weapons with synergistic accessories.
     */
    static rollMeta(factionInput = "Random", roleInput = "Random", activeMods) {
        const faction = (factionInput === "Random" || !isValidFaction(factionInput))
            ? RandomUtils.choice(VALID_FACTIONS, "NATO")
            : factionInput;

        const roleCandidates = ["Pointman", "Rifleman", "Medic", "Marksman", "Machine Gunner", "Sniper", "Anti-Tank"];
        const role = (roleInput === "Random" || !isValidRole(roleInput))
            ? RandomUtils.choice(roleCandidates, "Rifleman")
            : roleInput;

        // Filter presets matching target faction and role
        const pool = META_PRESETS.filter(p => p.faction === faction && p.role === role);
        const chosen = pool.length > 0 ? RandomUtils.choice(pool, pool[0]) : META_PRESETS[0];

        const res = this.create(chosen.faction, chosen.role, chosen.mod);
        return {
            loadoutData: res.loadoutData,
            sqf: res.sqf,
            presetTitle: chosen.title
        };
    }
}

// ----------------------------------------------------------------------------
// 7. SQF Code Serialization (ACE3 Realistic Medical & Ammo Packing)
// ----------------------------------------------------------------------------

class SqfSerializer {
    /**
     * Serializes LoadoutData into an authentic Arma 3 command.
     * Supports formats: 'player', 'this', '_unit', 'bis_save'.
     */
    static serialize(data, formatOrOptions = "player", customNameArg = "CustomLoadout") {
        let format = "player";
        let customName = "CustomLoadout";
        let medicalLevelOverride = null;

        if (typeof formatOrOptions === "object" && formatOrOptions !== null) {
            format = formatOrOptions.format || "player";
            customName = formatOrOptions.customName || "CustomLoadout";
            medicalLevelOverride = formatOrOptions.medicalLevel || null;
        } else if (typeof formatOrOptions === "string") {
            format = formatOrOptions;
            customName = customNameArg || "CustomLoadout";
        }

        const p = data.primary;
        const pMag = Array.isArray(p.mag) && p.mag.length >= 2 ? p.mag : ["", 0];
        const primaryArr = `["${p.class}","${p.muzzle}","${p.pointer}","${p.optic}",["${pMag[0]}",${pMag[1]}],[],"${p.bipod}"]`;

        const s = data.launcher;
        const sMag = Array.isArray(s.mag) && s.mag.length >= 2 ? s.mag : ["", 0];
        const secondaryArr = s.class ? `["${s.class}","","","",["${sMag[0]}",${sMag[1]}],[],""]` : `[]`;

        const h = data.handgun;
        const hMag = Array.isArray(h.mag) && h.mag.length >= 2 ? h.mag : ["", 0];
        const handgunArr = `["${h.class}","${h.muzzle}","","",["${hMag[0]}",${hMag[1]}],[],""]`;

        // Distribute ammunition realistically between uniform (emergency) and vest (tactical)
        const uniMags = Math.min(2, Math.max(0, p.count));
        const vestMags = Math.max(0, p.count - uniMags);

        const medicalLevel = medicalLevelOverride || data.meta?.medicalLevel || "ace3_standard";
        let uniformItems = "";
        let vestItems = "";
        let backpackItems = "[]";

        if (medicalLevel === "vanilla") {
            uniformItems = `[["FirstAidKit",2],["${pMag[0]}",${uniMags},${pMag[1]}],["${hMag[0]}",${h.count},${hMag[1]}]]`;
            vestItems = `[["FirstAidKit",1],["${pMag[0]}",${vestMags},${pMag[1]}]`;
            if (data.clothing.backpack) {
                if (data.role === "Medic") {
                    backpackItems = `[["Medikit",1],["FirstAidKit",10],["${data.items.smokeChoice}",4,1]]`;
                } else if (data.role === "Anti-Tank") {
                    backpackItems = `[["${sMag[0]}",2,${sMag[1]}],["FirstAidKit",2]]`;
                } else if (data.role === "Machine Gunner") {
                    backpackItems = `[["${pMag[0]}",2,${pMag[1]}],["FirstAidKit",2]]`;
                } else {
                    backpackItems = `[["${pMag[0]}",2,${pMag[1]}],["${data.items.smokeChoice}",2,1]]`;
                }
            }
        } else if (medicalLevel === "ace3_advanced") {
            uniformItems = `[["ACE_EarPlugs",1],["ACE_tourniquet",2],["ACE_morphine",2],["ACE_epinephrine",2],["ACE_splint",2],["${pMag[0]}",${uniMags},${pMag[1]}],["${hMag[0]}",${h.count},${hMag[1]}]]`;
            vestItems = `[["ACE_elasticBandage",10],["ACE_packingBandage",10],["ACE_quikclot",6],["ACE_tourniquet",2],["ACE_splint",2],["ACE_salineIV_500",1],["${pMag[0]}",${vestMags},${pMag[1]}]`;
            if (data.clothing.backpack) {
                if (data.role === "Medic") {
                    backpackItems = `[["ACE_elasticBandage",30],["ACE_packingBandage",30],["ACE_quikclot",20],["ACE_morphine",15],["ACE_epinephrine",15],["ACE_adenosine",10],["ACE_tourniquet",8],["ACE_splint",6],["ACE_salineIV_500",6],["ACE_salineIV",2],["ACE_surgicalKit",1],["ACE_personalAidKit",2],["${data.items.smokeChoice}",4,1]]`;
                } else if (data.role === "Anti-Tank") {
                    backpackItems = `[["${sMag[0]}",2,${sMag[1]}],["ACE_elasticBandage",5],["ACE_packingBandage",5],["ACE_salineIV_500",1]]`;
                } else if (data.role === "Machine Gunner") {
                    backpackItems = `[["${pMag[0]}",2,${pMag[1]}],["ACE_elasticBandage",5],["ACE_packingBandage",5],["ACE_salineIV_500",1]]`;
                } else {
                    backpackItems = `[["${pMag[0]}",2,${pMag[1]}],["${data.items.smokeChoice}",2,1],["ACE_salineIV_500",1]]`;
                }
            }
        } else {
            // Default: ace3_standard
            uniformItems = `[["ACE_EarPlugs",1],["ACE_tourniquet",2],["ACE_morphine",2],["ACE_epinephrine",2],["${pMag[0]}",${uniMags},${pMag[1]}],["${hMag[0]}",${h.count},${hMag[1]}]]`;
            vestItems = `[["ACE_fieldDressing",8],["ACE_elasticBandage",6],["ACE_packingBandage",6],["ACE_splint",1],["${pMag[0]}",${vestMags},${pMag[1]}]`;
            if (data.clothing.backpack) {
                if (data.role === "Medic") {
                    backpackItems = `[["ACE_elasticBandage",25],["ACE_packingBandage",25],["ACE_morphine",15],["ACE_epinephrine",15],["ACE_tourniquet",6],["ACE_splint",4],["ACE_salineIV_500",4],["ACE_personalAidKit",1],["ACE_surgicalKit",1],["${data.items.smokeChoice}",4,1]]`;
                } else if (data.role === "Anti-Tank") {
                    backpackItems = `[["${sMag[0]}",2,${sMag[1]}],["ACE_elasticBandage",5],["ACE_packingBandage",5]]`;
                } else if (data.role === "Machine Gunner") {
                    backpackItems = `[["${pMag[0]}",2,${pMag[1]}],["ACE_elasticBandage",5],["ACE_packingBandage",5]]`;
                } else if (data.role === "Pointman") {
                    backpackItems = `[["${pMag[0]}",4,${pMag[1]}],["MiniGrenade",2,1],["${data.items.smokeChoice}",2,1],["ACE_elasticBandage",5],["ACE_packingBandage",5]]`;
                } else {
                    backpackItems = `[["${pMag[0]}",2,${pMag[1]}],["${data.items.smokeChoice}",2,1]]`;
                }
            }
        }

        if (data.items.grenadeCount > 0) {
            vestItems += `,["${data.items.grenadeChoice}",${data.items.grenadeCount},1]`;
        }
        if (data.items.smokeCount > 0) {
            vestItems += `,["${data.items.smokeChoice}",${data.items.smokeCount},1]`;
        }
        vestItems += `]`;

        const uniformArr = `["${data.clothing.uniform}",${uniformItems}]`;
        const vestArr = `["${data.clothing.vest}",${vestItems}]`;
        const backpackArr = data.clothing.backpack ? `["${data.clothing.backpack}",${backpackItems}]` : `[]`;

        const headgearStr = `"${data.clothing.headgear}"`;
        const facewearStr = `"${data.clothing.facewear}"`;
        const binocArr = data.items.binocular ? `["${data.items.binocular}","","","",["",0],[],""]` : `[]`;
        const linkedArr = `["ItemMap","","ItemRadio","ItemCompass","ItemWatch","${data.items.nvg}"]`;

        const sqfArray = `[${primaryArr},${secondaryArr},${handgunArr},${uniformArr},${vestArr},${backpackArr},${headgearStr},${facewearStr},${binocArr},${linkedArr}]`;

        if (format === "this") {
            return `this setUnitLoadout ${sqfArray};`;
        } else if (format === "_unit") {
            return `_unit setUnitLoadout ${sqfArray};`;
        } else if (format === "bis_save") {
            return `[player, "${customName || 'CustomLoadout'}"] call BIS_fnc_saveInventory;\nplayer setUnitLoadout ${sqfArray};`;
        }
        return `player setUnitLoadout ${sqfArray};`;
    }

    /**
     * Formats raw SQF output into a beautifully indented multiline view.
     */
    static formatPretty(sqf) {
        if (!sqf) return "";
        const bracketIndex = sqf.indexOf("[");
        if (bracketIndex === -1) return sqf;

        const prefix = sqf.substring(0, bracketIndex);
        const arrayStr = sqf.substring(bracketIndex);
        return prefix + arrayStr
            .replace(/],\[/g, "],\n  [")
            .replace(/^\[/, "[\n  ")
            .replace(/\];$/, "\n];");
    }

    /**
     * Downloads an SQF file in browser environments.
     */
    static downloadSqfFile(filename, content) {
        if (typeof document === 'undefined') return;
        try {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'loadout.sqf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) {
            console.error('Failed to download SQF file:', e);
        }
    }
}

// ----------------------------------------------------------------------------
// 8. Public Top-Level API Facades (Backward Compatibility & Testing)
// ----------------------------------------------------------------------------
function generateLoadoutWithOptions(options) {
    return LoadoutEngine.generate(options);
}
function generateBestLoadout(faction, role) {
    return BestLoadoutFactory.create(faction, role);
}
function generateSQF(data) {
    return SqfSerializer.serialize(data);
}
/**
 * Legacy facade function. Defensively inspects DOM if present, but safely defaults
 * without crashing if invoked in headless Node / test environments.
 */
function generateLoadout(factionInput = "NATO", roleInput = "Rifleman") {
    let chaos = 1;
    const activeMods = new Set();
    // Defensive DOM checks: safe in Node, workers, and headless tests
    if (typeof document !== "undefined" && typeof document.getElementById === "function") {
        const chaosSlider = document.getElementById("chaos-slider");
        if (chaosSlider) {
            chaos = parseInt(chaosSlider.value, 10) || 1;
        }
        const checkMod = (id, mod) => {
            const el = document.getElementById(id);
            if (el && el.checked)
                activeMods.add(mod);
        };
        checkMod("mod-vanilla", "Vanilla");
        checkMod("mod-rhs", "RHS");
        checkMod("mod-cup", "CUP");
        checkMod("mod-niarms", "NIArms");
        checkMod("mod-custom", "Custom");
    }
    if (activeMods.size === 0) {
        activeMods.add("Vanilla");
    }
    const faction = (factionInput === "Random" || isValidFaction(factionInput))
        ? factionInput
        : "Random";
    const role = (roleInput === "Random" || isValidRole(roleInput))
        ? roleInput
        : "Random";
    return LoadoutEngine.generate({
        faction,
        role,
        chaosLevel: chaos,
        activeMods
    });
}
// ----------------------------------------------------------------------------
// 9. Armory Asset & Weapon Preview Resolvers
// ----------------------------------------------------------------------------

const REAL_FIREARM_PLATFORMS = {
    "m4a1": { platform: "Colt M4A1 Carbine", manufacturer: "Colt Defense", origin: "United States", imageFile: "assets/real_weapons/m4a1.png" },
    "mk18": { platform: "Mk 18 Mod 1 CQBR", manufacturer: "Daniel Defense / Crane NSWC", origin: "United States", imageFile: "assets/real_weapons/mk18.png" },
    "m16": { platform: "Colt M16A4 Rifle", manufacturer: "Colt's Manufacturing", origin: "United States", imageFile: "assets/real_weapons/m16a4.png" },
    "ak74m": { platform: "Kalashnikov AK-74M", manufacturer: "Kalashnikov Concern", origin: "Russia", imageFile: "assets/real_weapons/ak74m.png" },
    "aks74u": { platform: "Kalashnikov AKS-74U Krinkov", manufacturer: "Tula Arms Plant", origin: "Soviet Union", imageFile: "assets/real_weapons/aks74u.jpg" },
    "akm": { platform: "Kalashnikov AKM", manufacturer: "Izhevsk / Tula Arms Plant", origin: "Soviet Union", imageFile: "assets/real_weapons/akm.png" },
    "ak12": { platform: "Kalashnikov AK-12", manufacturer: "Kalashnikov Concern", origin: "Russia", imageFile: "assets/real_weapons/ak12.png" },
    "hk416": { platform: "Heckler & Koch HK416", manufacturer: "Heckler & Koch", origin: "Germany", imageFile: "assets/real_weapons/hk416.png" },
    "scar": { platform: "FN SCAR (Mk 16 / Mk 17)", manufacturer: "FN Herstal", origin: "Belgium / USA", imageFile: "assets/real_weapons/scar.jpg" },
    "g36": { platform: "Heckler & Koch G36", manufacturer: "Heckler & Koch", origin: "Germany", imageFile: "assets/real_weapons/g36.png" },
    "fal": { platform: "FN FAL / L1A1 SLR", manufacturer: "FN Herstal", origin: "Belgium", imageFile: "assets/real_weapons/fal.jpg" },
    "g3": { platform: "Heckler & Koch G3A3", manufacturer: "Heckler & Koch", origin: "Germany", imageFile: "assets/real_weapons/g3.png" },
    "aug": { platform: "Steyr AUG A1/A3", manufacturer: "Steyr Arms", origin: "Austria", imageFile: "assets/real_weapons/aug.webp" },
    "famas": { platform: "FAMAS F1 Felin", manufacturer: "GIAT Industries", origin: "France", imageFile: "assets/real_weapons/famas.jpg" },
    "mx": { platform: "Bushmaster / Remington ACR (MX 6.5mm)", manufacturer: "Bushmaster / Remington", origin: "United States", imageFile: "assets/real_weapons/mx.jpg" },
    "mk20": { platform: "FN F2000 (Mk20 5.56mm)", manufacturer: "FN Herstal", origin: "Belgium", imageFile: "assets/real_weapons/mk20.png" },
    "promet": { platform: "FB Radom MSBS Grot (Promet 6.5mm)", manufacturer: "FB Radom", origin: "Poland", imageFile: "assets/real_weapons/promet.jpg" },
    "trg21": { platform: "IWI TAR-21 Tavor (TRG-21)", manufacturer: "Israel Weapon Industries", origin: "Israel", imageFile: "assets/real_weapons/trg21.jpg" },
    "katiba": { platform: "KH-2002 Khaybar (Katiba 6.5mm)", manufacturer: "DIO (Defense Industries)", origin: "Iran", imageFile: "assets/real_weapons/trg21.jpg" },
    "car95": { platform: "Norinco QBZ-95 (CAR-95)", manufacturer: "Norinco", origin: "China", imageFile: "assets/real_weapons/car95.jpg" },
    "arx160": { platform: "Beretta ARX-160 (Type 115)", manufacturer: "Beretta", origin: "Italy", imageFile: "assets/real_weapons/arx160.png" },
    "zafir": { platform: "IWI Negev NG7 (Zafir 7.62mm)", manufacturer: "Israel Weapon Industries", origin: "Israel", imageFile: "assets/real_weapons/zafir.jpg" },
    "sting": { platform: "CZ Scorpion EVO 3 (Sting 9mm)", manufacturer: "Česká zbrojovka", origin: "Czech Republic", imageFile: "assets/real_weapons/sting.jpg" },
    "svd": { platform: "SVD Dragunov", manufacturer: "Kalashnikov Concern", origin: "Soviet Union / Russia", imageFile: "assets/real_weapons/svd.png" },
    "svu": { platform: "OTs-03 SVU Bullpup (Rahim)", manufacturer: "KBP Instrument Design Bureau", origin: "Russia", imageFile: "assets/real_weapons/svu.jpg" },
    "vss": { platform: "VSS Vintorez / AS Val", manufacturer: "TsNIITochMash", origin: "Soviet Union / Russia", imageFile: "assets/real_weapons/vss.png" },
    "ebr": { platform: "M14 / Mk 14 Mod 0 EBR", manufacturer: "Springfield Armory / Smith Ent.", origin: "United States", imageFile: "assets/real_weapons/ebr.jpg" },
    "m107": { platform: "Barrett M82A1 / M107", manufacturer: "Barrett Firearms", origin: "United States", imageFile: "assets/real_weapons/m107.jpg" },
    "gm6": { platform: "Gepard GM6 Lynx 12.7mm", manufacturer: "Sero International", origin: "Hungary", imageFile: "assets/real_weapons/gm6.png" },
    "cheytac": { platform: "CheyTac M200 Intervention", manufacturer: "CheyTac USA", origin: "United States", imageFile: "assets/real_weapons/cheytac.jpg" },
    "mosin": { platform: "Mosin-Nagant 1891/30", manufacturer: "Tula / Izhevsk Arms Plant", origin: "Soviet Union", imageFile: "assets/real_weapons/mosin.png" },
    "m24": { platform: "Remington M24 SWS / M40A5", manufacturer: "Remington Arms", origin: "United States", imageFile: "assets/real_weapons/m24.jpg" },
    "m249": { platform: "M249 SAW / FN Minimi", manufacturer: "FN Herstal", origin: "Belgium / USA", imageFile: "assets/real_weapons/m249.jpg" },
    "m240": { platform: "M240 GPMG / FN MAG", manufacturer: "FN Herstal", origin: "Belgium / USA", imageFile: "assets/real_weapons/m240.jpg" },
    "pkm": { platform: "PKM / PKP Pecheneg", manufacturer: "Degtyaryov Plant", origin: "Soviet Union / Russia", imageFile: "assets/real_weapons/pkm.jpg" },
    "mp5": { platform: "Heckler & Koch MP5", manufacturer: "Heckler & Koch", origin: "Germany", imageFile: "assets/real_weapons/mp5.jpg" },
    "mp7": { platform: "Heckler & Koch MP7A1", manufacturer: "Heckler & Koch", origin: "Germany", imageFile: "assets/real_weapons/mp7.jpg" },
    "p90": { platform: "FN P90 / ADR-97", manufacturer: "FN Herstal", origin: "Belgium", imageFile: "assets/real_weapons/p90.png" },
    "vector": { platform: "KRISS Vector (.45 ACP / 9mm)", manufacturer: "KRISS USA", origin: "United States", imageFile: "assets/real_weapons/vector.png" },
    "m870": { platform: "Remington Model 870", manufacturer: "Remington Arms", origin: "United States", imageFile: "assets/real_weapons/m870.jpg" },
    "m1014": { platform: "Benelli M4 Super 90 (M1014)", manufacturer: "Benelli Armi SpA", origin: "Italy", imageFile: "assets/real_weapons/m1014.jpg" },
    "saiga12": { platform: "Saiga-12K Combat Shotgun", manufacturer: "Kalashnikov Concern", origin: "Russia", imageFile: "assets/real_weapons/saiga12.jpg" },
    "rpg7": { platform: "RPG-7V2 Anti-Tank", manufacturer: "Bazalt", origin: "Soviet Union / Russia", imageFile: "assets/real_weapons/rpg7.jpg" },
    "at4": { platform: "M136 AT4 Disposable AT", manufacturer: "Saab Bofors Dynamics", origin: "Sweden / USA", imageFile: "assets/real_weapons/at4.jpg" },
    "javelin": { platform: "FGM-148 Javelin ATGM", manufacturer: "Raytheon / Lockheed Martin", origin: "United States", imageFile: "assets/real_weapons/javelin.jpg" },
    "maaws": { platform: "Carl Gustaf M3 MAAWS", manufacturer: "Saab Bofors Dynamics", origin: "Sweden", imageFile: "assets/real_weapons/maaws.png" },
    "m9": { platform: "Beretta 92FS / M9", manufacturer: "Fabbrica d'Armi Pietro Beretta", origin: "Italy / USA", imageFile: "assets/real_weapons/m9.jpg" },
    "m1911": { platform: "Colt M1911A1 .45", manufacturer: "Colt's Manufacturing", origin: "United States", imageFile: "assets/real_weapons/m1911.jpg" },
    "glock17": { platform: "Glock 17 9mm", manufacturer: "Glock Ges.m.b.H.", origin: "Austria", imageFile: "assets/real_weapons/glock17.jpg" },
    "makarov": { platform: "Makarov PM / PB 9mm", manufacturer: "Izhevsk Mechanical Plant", origin: "Soviet Union", imageFile: "assets/real_weapons/makarov.png" },
    "p07": { platform: "CZ 75 / P-07 Duty", manufacturer: "Česká zbrojovka (CZ)", origin: "Czech Republic", imageFile: "assets/real_weapons/p07.png" }
};

class WeaponPhotoResolver {
    static getPlatformFamily(weaponId, weaponName = "", category = "") {
        const str = `${weaponId} ${weaponName}`.toLowerCase();
        
        // Anti-armor & Launchers
        if (str.includes("rpg7") || str.includes("rpg-7") || str.includes("rpg_7")) return "rpg7";
        if (str.includes("at4") || str.includes("m136") || str.includes("nlaw") || str.includes("pcml") || str.includes("rpg18") || str.includes("rpg22") || str.includes("rpg26") || str.includes("m72")) return "at4";
        if (str.includes("javelin") || str.includes("fgm148") || str.includes("titan") || str.includes("stinger") || str.includes("igla") || str.includes("strela") || str.includes("metis")) return "javelin";
        if (str.includes("maaws") || str.includes("mraws") || str.includes("gustaf") || str.includes("rpg32") || str.includes("smaw") || str.includes("vorona")) return "maaws";

        // Shotguns
        if (str.includes("saiga") || str.includes("saiga12")) return "saiga12";
        if (str.includes("1014") || str.includes("m4 super") || str.includes("spas")) return "m1014";
        if (str.includes("870") || str.includes("m590") || str.includes("ithaca") || str.includes("shotgun")) return "m870";

        // Machine Guns
        if (str.includes("zafir") || str.includes("negev")) return "zafir";
        if (str.includes("pkm") || str.includes("pkp") || str.includes("pecheneg") || str.includes("navid") || str.includes("mmg_01")) return "pkm";
        if (str.includes("m240") || str.includes("mag58") || str.includes("mg3") || str.includes("spmg") || str.includes("mmg_02")) return "m240";
        if (str.includes("m249") || str.includes("minimi") || str.includes("mk200") || str.includes("m27iar") || str.includes("stoner")) return "m249";

        // Snipers & DMRs
        if (str.includes("gm6") || str.includes("lynx")) return "gm6";
        if (str.includes("m107") || str.includes("m82") || str.includes("barrett") || str.includes("as50") || str.includes("ksvk")) return "m107";
        if (str.includes("cheytac") || str.includes("m200") || str.includes("lrr") || str.includes("intervention")) return "cheytac";
        if (str.includes("rahim") || str.includes("dmr_01") || str.includes("svu")) return "svu";
        if (str.includes("svd") || str.includes("dragunov") || str.includes("psl")) return "svd";
        if (str.includes("vss") || str.includes("asval") || str.includes("as_val") || str.includes("vintorez") || str.includes("dmr_04")) return "vss";
        if (str.includes("ebr") || str.includes("dmr_03") || str.includes("mk-i") || str.includes("m14") || str.includes("m21") || str.includes("dmr_06")) return "ebr";
        if (str.includes("mosin")) return "mosin";
        if ((str.includes("m24") && !str.includes("m249") && !str.includes("m240")) || str.includes("m40") || str.includes("t5000") || str.includes("awm") || str.includes("l115") || str.includes("dmr_02") || str.includes("dmr_05")) return "m24";

        // SMGs & PDWs
        if (str.includes("sting") || str.includes("smg_02") || str.includes("scorpion")) return "sting";
        if (str.includes("mp5") || str.includes("protector") || str.includes("smg_05")) return "mp5";
        if (str.includes("mp7")) return "mp7";
        if (str.includes("p90") || str.includes("adr97") || str.includes("smg_03") || str.includes("pdw2000")) return "p90";
        if (str.includes("vector") || str.includes("vermin") || str.includes("smg_01") || str.includes("bizon") || str.includes("microuzi") || str.includes("uzi")) return "vector";

        // Handguns
        if (str.includes("m9") || str.includes("92fs") || str.includes("beretta")) return "m9";
        if (str.includes("1911") || str.includes("acpc2") || str.includes("heavy_01") || str.includes("heavy_02")) return "m1911";
        if (str.includes("glock")) return "glock17";
        if (str.includes("makarov") || str.includes("pm") || str.includes("pb")) return "makarov";
        if (str.includes("p07") || str.includes("cz75") || str.includes("duty") || str.includes("rook") || str.includes("pya") || str.includes("deagle") || str.includes("tt33") || str.includes("hgun_tt") || str.includes("_tt") || str.includes("tokarev") || str.includes("phantom")) return "p07";

        // Assault Rifles & Carbines
        if (str.includes("mk18") || str.includes("cqbr")) return "mk18";
        if (str.includes("m4a1") || str.includes("m4_") || str.includes("m4 carbine") || str.includes("c8")) return "m4a1";
        if (str.includes("m16a") || str.includes("m16_") || str.includes("m16 rifle")) return "m16";
        if (str.includes("aks74u") || str.includes("aks_74u") || str.includes("ak74u") || str.includes("ak-74u") || str.includes("ak12u")) return "aks74u";
        if (str.includes("ak74") || str.includes("ak-74")) return "ak74m";
        if (str.includes("akm") || str.includes("ak47") || str.includes("ak-47") || str.includes("pm md") || str.includes("m70") || str.includes("vz58")) return "akm";
        if (str.includes("ak12") || str.includes("ak-12") || str.includes("ak15") || str.includes("ak-15") || str.includes("rpk16")) return "ak12";
        if (str.includes("hk416") || str.includes("spar01") || str.includes("spar-16") || str.includes("spar02")) return "hk416";
        if (str.includes("scar") || str.includes("mk16") || str.includes("mk17") || str.includes("mk 16") || str.includes("mk 17")) return "scar";
        if (str.includes("g36")) return "g36";
        if (str.includes("fal") || str.includes("l1a1") || str.includes("slr") || str.includes("m77")) return "fal";
        if (str.includes("g3a") || str.includes("g3sg") || str.includes("g3_") || str.includes("g3 rifle")) return "g3";
        if (str.includes("aug")) return "aug";
        if (str.includes("famas")) return "famas";
        if (str.includes("katiba") || str.includes("kh2002")) return "katiba";
        if (str.includes("trg21") || str.includes("trg20") || str.includes("trg_") || str.includes("tavor") || str.includes("tar21")) return "trg21";
        if (str.includes("promet") || str.includes("msbs")) return "promet";
        if (str.includes("mk20") || str.includes("f2000")) return "mk20";
        if (str.includes("ctar") || str.includes("car-95") || str.includes("car95") || str.includes("qbz")) return "car95";
        if (str.includes("arx") || str.includes("type 115") || str.includes("type115")) return "arx160";
        if (str.includes("mx") || str.includes("acr")) return "mx";

        // Category-aware fallback
        if (category === "Handgun" || str.includes("hgun_")) return "p07";
        if (category === "Launcher" || str.includes("launch_")) return "rpg7";
        if (category === "Shotgun" || str.includes("sgun_")) return "m870";
        if (category === "LMG" || str.includes("lmg_") || str.includes("mmg_")) return "m249";
        if (category === "DMR/Sniper" || str.includes("srifle_") || str.includes("dmr_")) return "svd";
        if (category === "SMG" || str.includes("smg_")) return "mp5";

        return "m4a1";
    }

    static isSvgOrVector(url) {
        if (!url || typeof url !== "string") return false;
        const lower = url.toLowerCase().split('?')[0];
        return lower.endsWith(".svg") || lower.includes("/svgs/") || lower.includes("vector_icon") || lower.includes("vector_art") || lower.includes("silhouette") || lower.includes("placeholder.svg");
    }

    static getCaliberFallbackPhoto(caliber) {
        switch (caliber) {
            case "5.56x45": return "assets/real_weapons/m4a1.png";
            case "5.45x39": return "assets/real_weapons/ak74m.png";
            case "7.62x39": return "assets/real_weapons/akm.png";
            case "7.62x51": return "assets/real_weapons/fal.jpg";
            case "7.62x54": return "assets/real_weapons/svd.png";
            case "6.5x39": return "assets/real_weapons/mx.jpg";
            case "5.8x42": return "assets/real_weapons/car95.jpg";
            case "9x21": return "assets/real_weapons/mp5.jpg";
            case ".45ACP": return "assets/real_weapons/m1911.jpg";
            case "4.6x30": return "assets/real_weapons/mp7.jpg";
            case ".300WM": return "assets/real_weapons/m24.jpg";
            case ".338": return "assets/real_weapons/m24.jpg";
            case ".408": return "assets/real_weapons/cheytac.jpg";
            case ".50BMG": return "assets/real_weapons/m107.jpg";
            case "12.7x108": return "assets/real_weapons/m107.jpg";
            case "12Gauge": return "assets/real_weapons/saiga12.jpg";
            case "Rocket": return "assets/real_weapons/rpg7.jpg";
            default: return "assets/real_weapons/m4a1.png";
        }
    }

    static sanitizePhotoUrl(url, caliber = "5.56x45", category = "Rifle") {
        if (!url || this.isSvgOrVector(url)) {
            return this.getCaliberFallbackPhoto(caliber) || this.getCategoryFallbackPhoto(category);
        }
        return url;
    }

    static getRealWeaponPhotoUrl(weapon) {
        if (weapon.photoUrl && !this.isSvgOrVector(weapon.photoUrl)) {
            return weapon.photoUrl;
        }
        const family = this.getPlatformFamily(weapon.id, weapon.name || "", weapon.category || "");
        const meta = REAL_FIREARM_PLATFORMS[family];
        if (meta && meta.imageFile && !this.isSvgOrVector(meta.imageFile)) {
            return meta.imageFile;
        }
        if (weapon.caliber) {
            return this.getCaliberFallbackPhoto(weapon.caliber);
        }
        return this.getCategoryFallbackPhoto(weapon.category || "Rifle");
    }

    static getCategoryFallbackPhoto(category) {
        switch (category) {
            case "Rifle": return "assets/real_weapons/default_rifle.png";
            case "DMR/Sniper": return "assets/real_weapons/default_sniper.png";
            case "LMG": return "assets/real_weapons/default_lmg.png";
            case "SMG": return "assets/real_weapons/default_smg.png";
            case "Shotgun": return "assets/real_weapons/default_shotgun.png";
            case "Launcher": return "assets/real_weapons/default_launcher.png";
            case "Handgun": return "assets/real_weapons/default_handgun.png";
            default: return "assets/real_weapons/default_weapon.png";
        }
    }

    static getWeaponMetadata(weaponId, weaponName = "", category = "") {
        const family = this.getPlatformFamily(weaponId, weaponName, category);
        const meta = REAL_FIREARM_PLATFORMS[family];
        if (meta) {
            return {
                platform: meta.platform,
                manufacturer: meta.manufacturer,
                origin: meta.origin
            };
        }
        return {
            platform: weaponName || weaponId,
            manufacturer: "Military Issue / Standard Ordnance",
            origin: "International"
        };
    }
}

class WeaponAssetResolver {
    static isSvgOrVector(url) {
        return WeaponPhotoResolver.isSvgOrVector(url);
    }

    static getCategoryPhoto(category) {
        return WeaponPhotoResolver.getCategoryFallbackPhoto(category);
    }

    static getCaliberPhoto(caliber) {
        return WeaponPhotoResolver.getCaliberFallbackPhoto(caliber);
    }

    // Strictly rejects SVGs/vectors and returns authentic baseline real firearm photography
    static getCategorySvg(category) {
        return WeaponPhotoResolver.getCategoryFallbackPhoto(category);
    }

    static getPrimaryImageUrl(item) {
        return `assets/weapons/photos/${item.id}.png`;
    }
}

// ----------------------------------------------------------------------------
// 9.5 Weapon Performance Profiles & Radar Chart Engine
// ----------------------------------------------------------------------------

const WEAPON_STATS_TABLE = Object.freeze({
    // Vanilla Rifles
    "arifle_MX_F": { fireRate: 70, effectiveRange: 65, recoil: 75, weight: 65, modularity: 85 },
    "arifle_MX_GL_F": { fireRate: 70, effectiveRange: 65, recoil: 70, weight: 55, modularity: 85 },
    "arifle_MXC_F": { fireRate: 72, effectiveRange: 55, recoil: 80, weight: 75, modularity: 80 },
    "arifle_MXM_F": { fireRate: 65, effectiveRange: 80, recoil: 65, weight: 55, modularity: 90 },
    "arifle_Katiba_F": { fireRate: 75, effectiveRange: 65, recoil: 70, weight: 65, modularity: 75 },
    "arifle_Katiba_GL_F": { fireRate: 75, effectiveRange: 65, recoil: 65, weight: 55, modularity: 75 },
    "arifle_Katiba_C_F": { fireRate: 78, effectiveRange: 55, recoil: 75, weight: 75, modularity: 70 },
    "arifle_MK20_F": { fireRate: 70, effectiveRange: 60, recoil: 80, weight: 70, modularity: 80 },
    "arifle_MK20_GL_F": { fireRate: 70, effectiveRange: 60, recoil: 75, weight: 60, modularity: 80 },
    "arifle_MK20C_F": { fireRate: 75, effectiveRange: 50, recoil: 85, weight: 80, modularity: 75 },
    "arifle_TRG21_F": { fireRate: 75, effectiveRange: 60, recoil: 75, weight: 70, modularity: 75 },
    "arifle_ARX_blk_F": { fireRate: 75, effectiveRange: 75, recoil: 60, weight: 55, modularity: 85 },
    "arifle_MSBS65_F": { fireRate: 75, effectiveRange: 70, recoil: 75, weight: 65, modularity: 90 },
    "arifle_AK12_F": { fireRate: 70, effectiveRange: 70, recoil: 65, weight: 60, modularity: 80 },

    // Vanilla Machine Guns
    "LMG_Mk200_F": { fireRate: 85, effectiveRange: 75, recoil: 45, weight: 35, modularity: 70 },
    "LMG_Zafir_F": { fireRate: 85, effectiveRange: 80, recoil: 35, weight: 30, modularity: 65 },
    "MMG_01_tan_F": { fireRate: 80, effectiveRange: 90, recoil: 25, weight: 20, modularity: 75 },
    "MMG_02_sand_F": { fireRate: 80, effectiveRange: 85, recoil: 30, weight: 25, modularity: 75 },

    // Vanilla Marksman & Snipers
    "srifle_EBR_F": { fireRate: 55, effectiveRange: 85, recoil: 50, weight: 50, modularity: 85 },
    "srifle_DMR_01_F": { fireRate: 50, effectiveRange: 85, recoil: 50, weight: 50, modularity: 80 },
    "srifle_DMR_02_F": { fireRate: 45, effectiveRange: 92, recoil: 35, weight: 35, modularity: 85 },
    "srifle_DMR_03_F": { fireRate: 55, effectiveRange: 85, recoil: 45, weight: 45, modularity: 85 },
    "srifle_DMR_04_F": { fireRate: 40, effectiveRange: 88, recoil: 40, weight: 40, modularity: 75 },
    "srifle_DMR_05_blk_F": { fireRate: 40, effectiveRange: 92, recoil: 30, weight: 35, modularity: 85 },
    "srifle_DMR_06_camo_F": { fireRate: 50, effectiveRange: 85, recoil: 50, weight: 55, modularity: 75 },
    "srifle_GM6_F": { fireRate: 20, effectiveRange: 98, recoil: 25, weight: 20, modularity: 60 },
    "srifle_LRR_F": { fireRate: 15, effectiveRange: 100, recoil: 20, weight: 20, modularity: 60 },

    // Vanilla SMGs
    "SMG_01_F": { fireRate: 85, effectiveRange: 40, recoil: 85, weight: 85, modularity: 75 },
    "SMG_02_F": { fireRate: 90, effectiveRange: 35, recoil: 85, weight: 85, modularity: 75 },
    "SMG_03_black": { fireRate: 95, effectiveRange: 40, recoil: 80, weight: 80, modularity: 70 },
    "SMG_05_F": { fireRate: 85, effectiveRange: 35, recoil: 85, weight: 85, modularity: 75 },

    // Vanilla Handguns
    "hgun_P07_F": { fireRate: 50, effectiveRange: 30, recoil: 85, weight: 95, modularity: 45 },
    "hgun_Rook40_F": { fireRate: 55, effectiveRange: 30, recoil: 85, weight: 95, modularity: 45 },
    "hgun_ACPC2_F": { fireRate: 45, effectiveRange: 30, recoil: 75, weight: 90, modularity: 40 },
    "hgun_Pistol_heavy_01_F": { fireRate: 45, effectiveRange: 35, recoil: 75, weight: 90, modularity: 60 },

    // Vanilla Launchers
    "launch_NLAW_F": { fireRate: 10, effectiveRange: 85, recoil: 30, weight: 30, modularity: 30 },
    "launch_RPG32_F": { fireRate: 15, effectiveRange: 75, recoil: 25, weight: 35, modularity: 30 },
    "launch_B_Titan_short_F": { fireRate: 10, effectiveRange: 95, recoil: 20, weight: 20, modularity: 40 },
    "launch_B_Titan_F": { fireRate: 10, effectiveRange: 98, recoil: 15, weight: 15, modularity: 40 },

    // RHS Weapons
    "rhs_weap_m4a1_carryhandle": { fireRate: 80, effectiveRange: 65, recoil: 75, weight: 70, modularity: 85 },
    "rhs_weap_m4a1_blockII": { fireRate: 80, effectiveRange: 68, recoil: 75, weight: 68, modularity: 95 },
    "rhs_weap_ak74m": { fireRate: 70, effectiveRange: 65, recoil: 70, weight: 65, modularity: 75 },
    "rhs_weap_ak103": { fireRate: 68, effectiveRange: 68, recoil: 60, weight: 65, modularity: 75 },
    "rhs_weap_m249_pip": { fireRate: 85, effectiveRange: 75, recoil: 45, weight: 35, modularity: 70 },
    "rhs_weap_pkp": { fireRate: 80, effectiveRange: 85, recoil: 35, weight: 30, modularity: 65 },
    "rhs_weap_m24sws": { fireRate: 25, effectiveRange: 90, recoil: 45, weight: 45, modularity: 70 },
    "rhs_weap_svdp": { fireRate: 45, effectiveRange: 85, recoil: 50, weight: 55, modularity: 70 },
    "rhs_weap_M136": { fireRate: 10, effectiveRange: 70, recoil: 30, weight: 45, modularity: 20 },
    "rhs_weap_fgm148": { fireRate: 8, effectiveRange: 98, recoil: 15, weight: 15, modularity: 40 },

    // CUP Weapons
    "CUP_arifle_M4A1_black": { fireRate: 80, effectiveRange: 65, recoil: 75, weight: 70, modularity: 85 },
    "CUP_arifle_AK74M": { fireRate: 70, effectiveRange: 65, recoil: 70, weight: 65, modularity: 75 },
    "CUP_arifle_FNFAL": { fireRate: 65, effectiveRange: 80, recoil: 50, weight: 55, modularity: 65 },
    "CUP_lmg_m249_pip1": { fireRate: 85, effectiveRange: 75, recoil: 45, weight: 35, modularity: 70 },
    "CUP_srifle_M107_Base": { fireRate: 20, effectiveRange: 98, recoil: 25, weight: 20, modularity: 60 },
    "CUP_launch_RPG7V": { fireRate: 15, effectiveRange: 75, recoil: 25, weight: 35, modularity: 30 }
});

class RadarChart {
    static AXES = [
        { key: 'fireRate', label: 'Fire Rate' },
        { key: 'effectiveRange', label: 'Range' },
        { key: 'recoil', label: 'Control' },
        { key: 'weight', label: 'Mobility' },
        { key: 'modularity', label: 'Modularity' }
    ];

    /**
     * Looks up or generates normalized (0-100) performance stats for a weapon.
     */
    static getStats(weaponOrId) {
        if (!weaponOrId) return this.getDefaultStats(null);
        const id = typeof weaponOrId === 'string' ? weaponOrId : weaponOrId.id;
        if (id && WEAPON_STATS_TABLE[id]) {
            return { ...WEAPON_STATS_TABLE[id] };
        }
        return this.getDefaultStats(weaponOrId);
    }

    /**
     * Derives realistic baseline stats from weapon metadata profile.
     */
    static getDefaultStats(itemOrId) {
        let item = null;
        if (typeof itemOrId === 'string') {
            item = (typeof WeaponRepository !== 'undefined' && WeaponRepository.getById) ? WeaponRepository.getById(itemOrId) : null;
        } else if (itemOrId && typeof itemOrId === 'object') {
            item = itemOrId;
        }

        const category = item?.category || 'Rifle';
        const caliber = item?.caliber || '5.56x45';
        const hasBipod = Boolean(item?.hasBipod);
        const hasMuzzle = Boolean(item?.hasMuzzle);
        const opticType = item?.opticType || 'mid';

        let base = { fireRate: 65, effectiveRange: 60, recoil: 65, weight: 65, modularity: 70 };
        if (category === 'LMG') {
            base = { fireRate: 85, effectiveRange: 75, recoil: 40, weight: 35, modularity: 65 };
        } else if (category === 'DMR/Sniper' || category === 'Sniper') {
            base = { fireRate: 35, effectiveRange: 90, recoil: 45, weight: 45, modularity: 75 };
        } else if (category === 'SMG') {
            base = { fireRate: 85, effectiveRange: 40, recoil: 80, weight: 85, modularity: 65 };
        } else if (category === 'Shotgun') {
            base = { fireRate: 30, effectiveRange: 30, recoil: 40, weight: 60, modularity: 50 };
        } else if (category === 'Handgun') {
            base = { fireRate: 45, effectiveRange: 30, recoil: 85, weight: 95, modularity: 40 };
        } else if (category === 'Launcher') {
            base = { fireRate: 15, effectiveRange: 80, recoil: 25, weight: 25, modularity: 25 };
        }

        if (hasBipod) {
            base.recoil += 10;
            base.modularity += 10;
        }
        if (hasMuzzle) {
            base.modularity += 10;
        }
        if (opticType === 'long') {
            base.effectiveRange += 10;
        }
        if (caliber === '.50BMG' || caliber === '12.7x108') {
            base.effectiveRange = Math.min(100, base.effectiveRange + 15);
            base.recoil = Math.max(10, base.recoil - 25);
            base.weight = Math.max(10, base.weight - 20);
        }

        const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
        return {
            fireRate: clamp(base.fireRate),
            effectiveRange: clamp(base.effectiveRange),
            recoil: clamp(base.recoil),
            weight: clamp(base.weight),
            modularity: clamp(base.modularity)
        };
    }

    /**
     * Directly draws the radar chart onto any 2D canvas context at specified coordinates.
     */
    static drawOnContext(ctx, stats, centerX, centerY, radius, options = {}) {
        if (!ctx) return;

        const axes = this.AXES;
        const count = axes.length;
        const angleStep = (Math.PI * 2) / count;
        const startAngle = -Math.PI / 2;

        // Draw concentric polygon grid webs (levels 0.2, 0.4, 0.6, 0.8, 1.0)
        const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
        ctx.strokeStyle = options.gridColor || 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;

        levels.forEach(level => {
            ctx.beginPath();
            for (let i = 0; i < count; i++) {
                const angle = startAngle + i * angleStep;
                const r = radius * level;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        });

        // Draw radial spokes & axis labels
        axes.forEach((axis, i) => {
            const angle = startAngle + i * angleStep;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            // Spoke line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = options.spokeColor || 'rgba(255, 255, 255, 0.15)';
            ctx.stroke();

            // Label text
            const labelDist = radius + 20;
            const lx = centerX + labelDist * Math.cos(angle);
            const ly = centerY + labelDist * Math.sin(angle);

            ctx.font = options.font || '11px "JetBrains Mono", monospace';
            ctx.fillStyle = options.labelColor || 'rgba(255, 255, 255, 0.75)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(axis.label, lx, ly);
        });

        // Draw data polygon
        const resolvedStats = stats || this.getDefaultStats(null);
        const dataPoints = axes.map((axis, i) => {
            const val = Math.max(0, Math.min(100, Number(resolvedStats[axis.key]) || 0));
            const r = (val / 100) * radius;
            const angle = startAngle + i * angleStep;
            return {
                x: centerX + r * Math.cos(angle),
                y: centerY + r * Math.sin(angle)
            };
        });

        // Fill area
        ctx.beginPath();
        dataPoints.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fillStyle = options.fillColor || 'rgba(59, 130, 246, 0.35)';
        ctx.fill();

        // Stroke outline
        ctx.strokeStyle = options.strokeColor || '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw point dots
        ctx.fillStyle = options.pointColor || '#60a5fa';
        dataPoints.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Renders a 5-axis radar chart onto a 2D HTML5 canvas.
     * @param {HTMLCanvasElement} canvas
     * @param {object} stats
     * @param {object} [options]
     */
    static render(canvas, stats, options = {}) {
        if (!canvas || typeof canvas.getContext !== 'function') return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width || 340;
        const height = canvas.height || 280;
        const centerX = width / 2;
        const centerY = (height / 2) + 6;
        const radius = Math.min(centerX, centerY) - 40;

        ctx.clearRect(0, 0, width, height);
        this.drawOnContext(ctx, stats, centerX, centerY, radius, options);
    }
}

// ----------------------------------------------------------------------------
// 10. Armory & Catalog Controller
// ----------------------------------------------------------------------------

class ArmoryController {
    static activeTabId = "generator-view";
    static isScrollBound = false;

    static init() {
        if (typeof document === "undefined") return;

        const getEl = (id) => document.getElementById(id);

        this.elements = {
            grid: getEl("armory-grid"),
            searchInput: getEl("armory-search-input"),
            searchClearBtn: getEl("armory-search-clear"),
            countBadge: getEl("armory-count-badge"),
            categoryPills: getEl("category-filter-pills"),
            modPills: getEl("mod-filter-pills"),
            emptyState: getEl("armory-empty-state"),
            resetFiltersBtn: getEl("armory-reset-filters-btn"),
            inspectModal: getEl("armory-inspect-modal"),
            modalWeaponName: getEl("modal-weapon-name"),
            modalWeaponMod: getEl("modal-weapon-mod"),
            modalWeaponCategory: getEl("modal-weapon-category"),
            modalWeaponCaliber: getEl("modal-weapon-caliber"),
            modalWeaponId: getEl("modal-weapon-id"),
            modalCopyIdBtn: getEl("modal-copy-id-btn"),
            modalCopyFeedback: getEl("modal-copy-feedback"),
            modalDefaultMag: getEl("modal-default-mag"),
            modalOpticProfile: getEl("modal-optic-profile"),
            modalSlotsInfo: getEl("modal-slots-info"),
            modalOpticsCount: getEl("modal-optics-count"),
            modalOpticsList: getEl("modal-optics-list"),
            modalMuzzlesCount: getEl("modal-muzzles-count"),
            modalMuzzlesList: getEl("modal-muzzles-list"),
            modalFactionsList: getEl("modal-factions-list"),
            modalRolesList: getEl("modal-roles-list"),
            modalCloseBtn: getEl("modal-close-btn"),
            modalCancelBtn: getEl("modal-cancel-btn"),
            modalRollBtn: getEl("modal-roll-btn"),
            modalWeaponImg: getEl("modal-weapon-img"),
            modalPreviewModWatermark: getEl("modal-preview-mod-watermark"),
            modalWeaponManufacturer: getEl("modal-weapon-manufacturer"),
            modalWeaponOrigin: getEl("modal-weapon-origin"),
            modalWeaponOriginPill: getEl("modal-weapon-origin-pill"),
            modalRadarChart: getEl("modal-radar-chart"),
            radarStatChips: getEl("radar-stat-chips"),
            scrollTopBtn: getEl("armory-scroll-top-btn")
        };

        this.buildCatalog();
        this.bindEvents();
        this.renderCatalog();
        this.handleScroll();
        this.isInitialized = true;
    }

    static setActiveTab(tabId) {
        this.activeTabId = tabId;
        this.handleScroll();
    }

    static handleScroll() {
        if (!this.elements || !this.elements.scrollTopBtn) return;
        const isArmory = this.activeTabId === "armory-view";
        const scrollY = (typeof window !== "undefined" ? window.scrollY : 0) || 
                        (typeof document !== "undefined" && document.documentElement ? document.documentElement.scrollTop : 0) || 0;
        if (isArmory && scrollY > 300) {
            this.elements.scrollTopBtn.classList.add("visible");
        } else {
            this.elements.scrollTopBtn.classList.remove("visible");
        }
    }

    static refresh() {
        this.buildCatalog();
        this.renderCatalog();
    }

    static buildCatalog() {
        const items = [];
        const seenIds = new Set();

        // 1. Primaries from WeaponRepository
        const primaries = WeaponRepository.getAllWeapons();
        for (const w of primaries) {
            if (seenIds.has(w.id)) continue;
            seenIds.add(w.id);

            let category;
            if (w.caliber === "12Gauge") {
                category = "Shotgun";
            } else if (w.roles.includes("Machine Gunner")) {
                category = "LMG";
            } else if (w.roles.includes("Sniper") || w.roles.includes("Marksman")) {
                category = "DMR/Sniper";
            } else if (w.roles.includes("Pilot") && !w.roles.includes("Rifleman")) {
                category = "SMG";
            } else if (w.caliber === "9x21" || w.caliber === ".45ACP" || w.caliber === "4.6x30") {
                category = "SMG";
            } else {
                category = "Rifle";
            }

            items.push({
                id: w.id,
                name: w.name || w.id,
                mod: w.mod,
                category,
                caliber: w.caliber,
                defaultMag: w.defaultMag,
                opticType: w.opticType,
                hasBipod: Boolean(w.hasBipod),
                defaultBipod: w.defaultBipod,
                hasMuzzle: Boolean(w.hasMuzzle),
                factions: [...w.factions],
                roles: [...w.roles],
                tier: w.tier,
                isPrimary: true,
                photoUrl: w.photoUrl || `assets/weapons/photos/${w.id}.png`
            });
        }

                                // 2. Launchers from LAUNCHERS
        const launcherDefs = {
            "rhs_weap_M136": { name: "M136 AT4 (HEAT)", mod: "RHS" },
            "rhs_weap_M136_hedp": { name: "M136 AT4 (HEDP)", mod: "RHS" },
            "rhs_weap_M136_hp": { name: "M136 AT4 (HP)", mod: "RHS" },
            "rhs_weap_m72a7": { name: "M72A7 LAW", mod: "RHS" },
            "rhs_weap_smaw": { name: "Mk 153 SMAW", mod: "RHS" },
            "rhs_weap_maaws": { name: "M3 MAAWS Carl Gustaf", mod: "RHS" },
            "rhs_weap_fgm148": { name: "FGM-148 Javelin ATGM", mod: "RHS" },
            "rhs_weap_fim92": { name: "FIM-92 Stinger MANPADS", mod: "RHS" },
            "launch_NLAW_F": { name: "PCML / NLAW ATGM", mod: "Vanilla" },
            "launch_B_Titan_short_F": { name: "Titan Short ATGM (BLUFOR)", mod: "Vanilla" },
            "launch_B_Titan_F": { name: "Titan Long AA (BLUFOR)", mod: "Vanilla" },
            "launch_MRAWS_sand_F": { name: "MAAWS Mk4 Mod 0 (Sand)", mod: "Vanilla" },
            "launch_MRAWS_olive_F": { name: "MAAWS Mk4 Mod 0 (Olive)", mod: "Vanilla" },
            "launch_I_Titan_short_F": { name: "Titan Short ATGM (AAF)", mod: "Vanilla" },
            "launch_I_Titan_F": { name: "Titan Long AA (AAF)", mod: "Vanilla" },
            "launch_RPG32_F": { name: "RPG-32 Barkas 105mm", mod: "Vanilla" },
            "launch_O_Vorona_brown_F": { name: "9M135 Vorona Wire-Guided AT", mod: "Vanilla" },
            "launch_O_Titan_short_F": { name: "Titan Short ATGM (CSAT)", mod: "Vanilla" },
            "launch_O_Titan_F": { name: "Titan Long AA (CSAT)", mod: "Vanilla" },
            "launch_RPG7_F": { name: "RPG-7 Modernized (Apex)", mod: "Vanilla" },
            "CUP_launch_RPG7V": { name: "RPG-7V Launcher (CUP)", mod: "CUP" },
            "CUP_launch_RPG18": { name: "RPG-18 Mukha", mod: "CUP" },
            "CUP_launch_RPG22": { name: "RPG-22 Netto Disposable AT", mod: "CUP" },
            "CUP_launch_Igla": { name: "9K38 Igla MANPADS (CUP)", mod: "CUP" },
            "CUP_launch_9K32_Strela": { name: "9K32 Strela-2 MANPADS", mod: "CUP" },
            "CUP_launch_Metis": { name: "9K115 Metis ATGM (CUP)", mod: "CUP" },
            "CUP_launch_M136": { name: "M136 AT4 (CUP)", mod: "CUP" },
            "CUP_launch_Javelin": { name: "FGM-148 Javelin (CUP)", mod: "CUP" },
            "CUP_launch_Mk153": { name: "Mk 153 SMAW (CUP)", mod: "CUP" },
            "CUP_launch_M3": { name: "M3 MAAWS Carl Gustaf (CUP)", mod: "CUP" },
            "CUP_launch_FIM92Stinger": { name: "FIM-92 Stinger MANPADS (CUP)", mod: "CUP" },
            "rhs_weap_rpg7": { name: "RPG-7V2 Rocket Launcher (RHS)", mod: "RHS" },
            "rhs_weap_rpg26": { name: "RPG-26 Aglen Disposable AT", mod: "RHS" },
            "rhs_weap_rshg2": { name: "RShG-2 Thermobaric Rocket", mod: "RHS" },
            "rhs_weap_igla": { name: "9K38 Igla MANPADS (RHS)", mod: "RHS" }
        };

        for (const faction of VALID_FACTIONS) {
            const list = LAUNCHERS[faction] || [];
            for (const l of list) {
                if (seenIds.has(l.id)) {
                    const existing = items.find(it => it.id === l.id);
                    if (existing && !existing.factions.includes(faction)) {
                        existing.factions.push(faction);
                    }
                    continue;
                }
                seenIds.add(l.id);
                const meta = launcherDefs[l.id];
                items.push({
                    id: l.id,
                    name: meta?.name || l.id,
                    mod: meta?.mod || l.mod,
                    category: "Launcher",
                    caliber: "Rocket",
                    defaultMag: l.defaultMag,
                    opticType: "cqb",
                    hasBipod: false,
                    hasMuzzle: false,
                    factions: [faction],
                    roles: ["Anti-Tank"],
                    tier: "standard",
                    isPrimary: false,
                    photoUrl: `assets/weapons/photos/${l.id}.png`
                });
            }
        }

                // 3. Handguns from FACTION_GEAR
        const handgunDefs = {
            "hgun_P07_F": { name: "P07 9mm", mod: "Vanilla", caliber: "9x21", defaultMag: ["16Rnd_9x21_Mag", 16], hasMuzzle: true },
            "hgun_P07_khk_F": { name: "P07 9mm Khaki", mod: "Vanilla", caliber: "9x21", defaultMag: ["16Rnd_9x21_Mag", 16], hasMuzzle: true },
            "hgun_Rook40_F": { name: "Rook-40 9mm", mod: "Vanilla", caliber: "9x21", defaultMag: ["16Rnd_9x21_Mag", 16], hasMuzzle: true },
            "hgun_Pistol_heavy_01_F": { name: "4-five .45 Tactical", mod: "Vanilla", caliber: ".45ACP", defaultMag: ["11Rnd_45ACP_Mag", 11], hasMuzzle: true },
            "hgun_Pistol_heavy_02_F": { name: "Zubr .45 Revolver", mod: "Vanilla", caliber: ".45ACP", defaultMag: ["6Rnd_45ACP_Cylinder", 6], hasMuzzle: false },
            "hgun_Pistol_01_F": { name: "PM 9mm (Contact)", mod: "Vanilla", caliber: "9x21", defaultMag: ["10Rnd_9x21_Mag", 10], hasMuzzle: true },
            "hgun_ACPC2_F": { name: "ACP-C2 .45 Tactical", mod: "Vanilla", caliber: ".45ACP", defaultMag: ["9Rnd_45ACP_Mag", 9], hasMuzzle: true },
            "hgun_PDW2000_F": { name: "PDW2000 9mm SMG", mod: "Vanilla", caliber: "9x21", defaultMag: ["30Rnd_9x21_Mag", 30], hasMuzzle: true },
            "rhsusf_weap_m9": { name: "Beretta M9 9mm", mod: "RHS", caliber: "9x21", defaultMag: ["rhsusf_mag_15Rnd_9x19_JHP", 15], hasMuzzle: true },
            "rhsusf_weap_m1911a1": { name: "Colt M1911A1 .45", mod: "RHS", caliber: ".45ACP", defaultMag: ["rhsusf_mag_7x45acp_MHP", 7], hasMuzzle: false },
            "rhsusf_weap_glock17": { name: "Glock 17 9mm (RHS)", mod: "RHS", caliber: "9x21", defaultMag: ["rhsusf_mag_17Rnd_9x19_JHP", 17], hasMuzzle: true },
            "rhs_weap_pya": { name: "MP-443 Grach 9mm", mod: "RHS", caliber: "9x21", defaultMag: ["rhs_mag_9x19_17", 17], hasMuzzle: true },
            "rhs_weap_makarov_pm": { name: "Makarov PM 9x18mm", mod: "RHS", caliber: "9x21", defaultMag: ["rhs_mag_9x18_8_57N181S", 8], hasMuzzle: true },
            "rhs_weap_makarov_pmm": { name: "Makarov PMM 9x18mm High-Cap", mod: "RHS", caliber: "9x21", defaultMag: ["rhs_mag_9x18_12_57N181S", 12], hasMuzzle: true },
            "rhs_weap_6p9": { name: "PB 6P9 Suppressed Pistol (RHS)", mod: "RHS", caliber: "9x21", defaultMag: ["rhs_mag_9x18_8_57N181S", 8], hasMuzzle: false },
            "rhs_weap_tt33": { name: "Tokarev TT-33 7.62mm (RHS)", mod: "RHS", caliber: "9x21", defaultMag: ["rhs_mag_762x25_8", 8], hasMuzzle: false },
            "rhs_weap_cz75": { name: "CZ 75 9mm (RHS)", mod: "RHS", caliber: "9x21", defaultMag: ["rhssaf_mag_15Rnd_9x19_FMJ", 15], hasMuzzle: true },
            "rhs_weap_cz99": { name: "Zastava CZ99 9mm", mod: "RHS", caliber: "9x21", defaultMag: ["rhssaf_mag_15Rnd_9x19_FMJ", 15], hasMuzzle: true },
            "CUP_hgun_Glock17_blk": { name: "Glock 17 Black 9mm", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_17Rnd_9x19_glock17", 17], hasMuzzle: true },
            "CUP_hgun_M9": { name: "Beretta M9 (CUP)", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_15Rnd_9x19_M9", 15], hasMuzzle: true },
            "CUP_hgun_Makarov": { name: "Makarov PM (CUP)", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_8Rnd_9x18_Makarov_M", 8], hasMuzzle: true },
            "CUP_hgun_PB6P9": { name: "PB 6P9 Suppressed Pistol (CUP)", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_8Rnd_9x18_Makarov_M", 8], hasMuzzle: false },
            "CUP_hgun_Browning_HP": { name: "Browning Hi-Power 9mm", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_13Rnd_9x19_Browning_HP", 13], hasMuzzle: false },
            "CUP_hgun_TaurusTracker455": { name: "Taurus Tracker .45 Revolver", mod: "CUP", caliber: ".45ACP", defaultMag: ["CUP_6Rnd_45ACP_M", 6], hasMuzzle: false },
            "CUP_hgun_TT": { name: "Tokarev TT-33 7.62x25", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_8Rnd_762x25_TT", 8], hasMuzzle: false },
            "CUP_hgun_Colt1911": { name: "Colt M1911 (CUP)", mod: "CUP", caliber: ".45ACP", defaultMag: ["CUP_7Rnd_45ACP_1911", 7], hasMuzzle: false },
            "CUP_hgun_Compact": { name: "CZ 75 D Compact 9mm", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_10Rnd_9x19_Compact", 10], hasMuzzle: true },
            "CUP_hgun_Duty": { name: "CZ 75 P-07 Duty 9mm", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_16Rnd_9x19_cz75", 16], hasMuzzle: true },
            "CUP_hgun_Phantom": { name: "CZ 75 SP-01 Phantom 9mm", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_18Rnd_9x19_Phantom", 18], hasMuzzle: true },
            "CUP_hgun_Deagle": { name: "Desert Eagle .50 AE", mod: "CUP", caliber: ".50BMG", defaultMag: ["CUP_7Rnd_50AE_Deagle", 7], hasMuzzle: false },
            "CUP_hgun_MicroUzi": { name: "IMI Micro Uzi 9mm", mod: "CUP", caliber: "9x21", defaultMag: ["CUP_30Rnd_9x19_UZI", 30], hasMuzzle: true }
        };

        for (const faction of VALID_FACTIONS) {
            const gear = FACTION_GEAR[faction];
            if (!gear) continue;
            for (const hId of gear.handguns) {
                if (seenIds.has(hId)) {
                    const existing = items.find(it => it.id === hId);
                    if (existing && !existing.factions.includes(faction)) {
                        existing.factions.push(faction);
                    }
                    continue;
                }
                seenIds.add(hId);
                const def = handgunDefs[hId];
                const is45 = hId.includes("ACPC2") || hId.includes("heavy_02") || hId.includes("1911") || hId.includes("Tracker");
                items.push({
                    id: hId,
                    name: def?.name || hId,
                    mod: def?.mod || "Vanilla",
                    category: "Handgun",
                    caliber: def?.caliber || (is45 ? ".45ACP" : "9x21"),
                    defaultMag: def?.defaultMag || gear.handgunMag,
                    opticType: "cqb",
                    hasBipod: false,
                    hasMuzzle: def?.hasMuzzle ?? Boolean(gear.handgunMuzzles && gear.handgunMuzzles.length > 0),
                    factions: [faction],
                    roles: ["Rifleman", "Medic", "Marksman", "Anti-Tank", "Machine Gunner", "Sniper", "Pilot"],
                    tier: "standard",
                    isPrimary: false,
                    photoUrl: `assets/weapons/photos/${hId}.png`
                });
            }
        }

        this.catalog = items;
        return items;
    }

    static getCatalog() {
        if (this.catalog.length === 0) {
            this.buildCatalog();
        }
        return this.catalog;
    }

    static filterCatalog() {
        const q = this.searchQuery.trim().toLowerCase();
        return this.catalog.filter(item => {
            if (this.activeCategory !== "all" && item.category !== this.activeCategory) {
                return false;
            }
            if (this.activeMod !== "all" && item.mod !== this.activeMod) {
                return false;
            }
            if (q) {
                const matchName = item.name.toLowerCase().includes(q);
                const matchId = item.id.toLowerCase().includes(q);
                const matchCal = item.caliber.toLowerCase().includes(q);
                if (!matchName && !matchId && !matchCal) return false;
            }
            return true;
        });
    }

    static bindEvents() {
        if (!this.elements) return;
        const {
            searchInput,
            searchClearBtn,
            categoryPills,
            modPills,
            grid,
            resetFiltersBtn,
            inspectModal,
            modalCloseBtn,
            modalCancelBtn,
            modalRollBtn,
            modalCopyIdBtn
        } = this.elements;

        // Instant search
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                this.searchQuery = searchInput.value;
                if (searchClearBtn) {
                    searchClearBtn.style.display = this.searchQuery.length > 0 ? "block" : "none";
                }
                this.renderCatalog();
            });
        }

        // Clear search
        if (searchClearBtn) {
            searchClearBtn.addEventListener("click", () => {
                this.searchQuery = "";
                if (searchInput) searchInput.value = "";
                searchClearBtn.style.display = "none";
                this.renderCatalog();
            });
        }

        // Category Pills
        if (categoryPills) {
            categoryPills.addEventListener("click", (e) => {
                const target = e.target.closest(".filter-pill");
                if (!target) return;
                const cat = target.getAttribute("data-category");
                if (!cat) return;

                categoryPills.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
                target.classList.add("active");
                this.activeCategory = cat;
                this.renderCatalog();
            });
        }

        // Mod Source Pills
        if (modPills) {
            modPills.addEventListener("click", (e) => {
                const target = e.target.closest(".filter-pill");
                if (!target) return;
                const mod = target.getAttribute("data-mod");
                if (!mod) return;

                modPills.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
                target.classList.add("active");
                this.activeMod = mod;
                this.renderCatalog();
            });
        }

        // Reset Filters Button
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener("click", () => {
                this.searchQuery = "";
                this.activeCategory = "all";
                this.activeMod = "all";
                if (searchInput) searchInput.value = "";
                if (searchClearBtn) searchClearBtn.style.display = "none";

                if (categoryPills) {
                    categoryPills.querySelectorAll(".filter-pill").forEach(p => {
                        p.classList.toggle("active", p.getAttribute("data-category") === "all");
                    });
                }
                if (modPills) {
                    modPills.querySelectorAll(".filter-pill").forEach(p => {
                        p.classList.toggle("active", p.getAttribute("data-mod") === "all");
                    });
                }
                this.renderCatalog();
            });
        }

        // Grid delegation for card clicks
        if (grid) {
            grid.addEventListener("click", (e) => {
                const card = e.target.closest(".weapon-card");
                if (!card) return;
                const weaponId = card.getAttribute("data-weapon-id");
                if (weaponId) {
                    this.openInspectModal(weaponId);
                }
            });
        }

        // Modal close buttons
        const closeModal = () => this.closeInspectModal();
        if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
        if (modalCancelBtn) modalCancelBtn.addEventListener("click", closeModal);

        // Click on backdrop to close
        if (inspectModal) {
            inspectModal.addEventListener("click", (e) => {
                if (e.target === inspectModal) {
                    closeModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && inspectModal && inspectModal.style.display !== "none") {
                closeModal();
            }
        });

        // Copy classname inside modal
        if (modalCopyIdBtn) {
            modalCopyIdBtn.addEventListener("click", () => {
                if (!this.currentlyInspectedWeapon) return;
                const text = this.currentlyInspectedWeapon.id;
                if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        if (this.elements?.modalCopyFeedback) {
                            this.elements.modalCopyFeedback.textContent = "Copied!";
                            setTimeout(() => {
                                if (this.elements?.modalCopyFeedback) {
                                    this.elements.modalCopyFeedback.textContent = "Copy";
                                }
                            }, 1500);
                        }
                    });
                }
            });
        }

        // Roll Loadout Around This Gun
        if (modalRollBtn) {
            modalRollBtn.addEventListener("click", () => {
                if (!this.currentlyInspectedWeapon) return;
                this.rollAroundWeapon(this.currentlyInspectedWeapon.id);
            });
        }

        // Floating Scroll to Top Action Button
        const { scrollTopBtn } = this.elements;
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener("click", () => {
                if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
                if (typeof document !== "undefined" && document.documentElement) {
                    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
        }

        // Window Scroll Listener for Floating Button
        if (!this.isScrollBound && typeof window !== "undefined" && typeof window.addEventListener === "function") {
            let ticking = false;
            window.addEventListener("scroll", () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
            this.isScrollBound = true;
        }
    }

    static renderCatalog() {
        if (!this.elements || !this.elements.grid) return;
        const { grid, countBadge, emptyState } = this.elements;

        const filtered = this.filterCatalog();

        if (countBadge) {
            countBadge.textContent = `Showing ${filtered.length} of ${this.catalog.length} weapons`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = "";
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        if (emptyState) emptyState.style.display = "none";

        grid.innerHTML = filtered.map(item => `
            <div class="weapon-card" data-weapon-id="${this.escapeHtml(item.id)}">
                <div class="weapon-photo-frame">
                    <img src="${item.photoUrl}?v=3" 
                         alt="${this.escapeHtml(item.name)}" 
                         loading="lazy" 
                         class="weapon-real-photo" 
                         onerror="this.onerror=null; this.src='${WeaponPhotoResolver.getCaliberFallbackPhoto(item.caliber) || WeaponPhotoResolver.getCategoryFallbackPhoto(item.category)}?v=3';" />
                </div>
                <div class="weapon-card-header">
                    <span class="weapon-card-title">${this.escapeHtml(item.name)}</span>
                    <span class="tag-badge badge-${item.mod.toLowerCase()}">${this.escapeHtml(item.mod)}</span>
                </div>
                <div class="weapon-card-id">${this.escapeHtml(item.id)}</div>
                <div class="weapon-card-specs">
                    <span class="spec-chip chip-category">${this.escapeHtml(item.category)}</span>
                    <span class="spec-chip chip-caliber">${this.escapeHtml(item.caliber)}</span>
                    ${item.hasBipod ? `<span class="spec-chip chip-feature">Bipod</span>` : ""}
                    ${item.hasMuzzle ? `<span class="spec-chip chip-feature">Suppressor</span>` : ""}
                </div>
                <div class="weapon-card-footer">
                    <span>Inspect & Roll</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </div>
            </div>
        `).join("");
    }

    static openInspectModal(weaponId) {
        const item = this.catalog.find(it => it.id === weaponId);
        if (!item || !this.elements) return;

        this.currentlyInspectedWeapon = item;
        const {
            inspectModal,
            modalWeaponName,
            modalWeaponMod,
            modalWeaponCategory,
            modalWeaponCaliber,
            modalWeaponId,
            modalCopyFeedback,
            modalDefaultMag,
            modalOpticProfile,
            modalSlotsInfo,
            modalOpticsCount,
            modalOpticsList,
            modalMuzzlesCount,
            modalMuzzlesList,
            modalFactionsList,
            modalRolesList,
            modalWeaponImg,
            modalPreviewModWatermark,
            modalWeaponManufacturer,
            modalWeaponOrigin
        } = this.elements;

        if (modalWeaponName) modalWeaponName.textContent = item.name;
        if (modalWeaponMod) {
            modalWeaponMod.textContent = item.mod;
            modalWeaponMod.className = `tag-badge badge-${item.mod.toLowerCase()}`;
        }
        if (modalWeaponCategory) modalWeaponCategory.textContent = item.category;
        if (modalWeaponCaliber) modalWeaponCaliber.textContent = item.caliber;
        if (modalWeaponId) modalWeaponId.textContent = item.id;
        if (modalCopyFeedback) modalCopyFeedback.textContent = "Copy";
        if (modalDefaultMag) modalDefaultMag.textContent = `${item.defaultMag[0]} (${item.defaultMag[1]} rounds)`;

        // Real firearm photo & origin binding
        const photoUrl = WeaponPhotoResolver.sanitizePhotoUrl(item.photoUrl || WeaponPhotoResolver.getRealWeaponPhotoUrl(item), item.caliber, item.category);
        const fallbackPhoto = WeaponPhotoResolver.getCaliberFallbackPhoto(item.caliber) || WeaponPhotoResolver.getCategoryFallbackPhoto(item.category);
        const meta = WeaponPhotoResolver.getWeaponMetadata(item.id, item.name, item.category);

        if (modalWeaponImg) {
            modalWeaponImg.onerror = () => {
                modalWeaponImg.onerror = null;
                modalWeaponImg.src = `${fallbackPhoto}?v=3`;
            };
            modalWeaponImg.src = `${photoUrl}?v=3`;
            modalWeaponImg.alt = `${item.name} Real Photo`;
        }
        if (modalPreviewModWatermark) {
            modalPreviewModWatermark.textContent = `${item.mod.toUpperCase()} // ${item.caliber} // ${item.category.toUpperCase()}`;
        }
        if (modalWeaponManufacturer) {
            modalWeaponManufacturer.textContent = meta.manufacturer;
        }
        if (modalWeaponOrigin) {
            modalWeaponOrigin.textContent = meta.origin;
        }

        let opticProfileDesc = "None";
        if (item.category === "Launcher") {
            opticProfileDesc = "Integrated Rangefinder / Iron Sights";
        } else if (item.opticType === "long") {
            opticProfileDesc = "Long-Range Sniper Scope (SOS / LRPS / AMS / Leupold)";
        } else if (item.opticType === "mid") {
            opticProfileDesc = "Mid-Range Combat Optic (1-4x / ACOG / MRCO / ELCAN / PSO)";
        } else {
            opticProfileDesc = "CQB / Holographic / Reflex (EOTech / Micro T1 / ACO / Kobra)";
        }
        if (modalOpticProfile) modalOpticProfile.textContent = opticProfileDesc;

        const bipodDesc = item.hasBipod
            ? (item.defaultBipod ? `Yes (${item.defaultBipod})` : "Yes (Universal Rail)")
            : "None";
        const muzzleDesc = item.hasMuzzle ? "Supported" : "None";
        if (modalSlotsInfo) modalSlotsInfo.textContent = `Bipod: ${bipodDesc} • Suppressor: ${muzzleDesc}`;

        // Compatible Optics
        if (modalOpticsList && modalOpticsCount) {
            if (item.category === "Launcher") {
                modalOpticsCount.textContent = "0";
                modalOpticsList.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.85rem;">Iron sights and rocket targeting apertures are built directly onto this platform.</span>`;
            } else {
                const pool = OPTICS_POOL[item.opticType] || [];
                modalOpticsCount.textContent = String(pool.length);
                if (pool.length === 0) {
                    modalOpticsList.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.85rem;">No designated optics in this profile.</span>`;
                } else {
                    modalOpticsList.innerHTML = pool.map(o => `
                        <div class="attachment-chip">
                            <span>${this.escapeHtml(o.id)}</span>
                            <span class="chip-mod tag-badge badge-${o.mod.toLowerCase()}">${this.escapeHtml(o.mod)}</span>
                        </div>
                    `).join("");
                }
            }
        }

        // Compatible Muzzles / Suppressors
        if (modalMuzzlesList && modalMuzzlesCount) {
            if (!item.hasMuzzle) {
                modalMuzzlesCount.textContent = "0";
                modalMuzzlesList.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.85rem;">No muzzle attachment slot supported on this weapon frame.</span>`;
            } else {
                const muzzles = MUZZLES_BY_CALIBER[item.caliber] || [];
                modalMuzzlesCount.textContent = String(muzzles.length);
                if (muzzles.length === 0) {
                    modalMuzzlesList.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.85rem;">Standard flash hider / No dedicated suppressor profile found for caliber ${this.escapeHtml(item.caliber)}.</span>`;
                } else {
                    modalMuzzlesList.innerHTML = muzzles.map(m => `
                        <div class="attachment-chip">
                            <span>${this.escapeHtml(m.id)}</span>
                            <span class="chip-mod tag-badge badge-${m.mod.toLowerCase()}">${this.escapeHtml(m.mod)}</span>
                        </div>
                    `).join("");
                }
            }
        }

        if (modalFactionsList) {
            modalFactionsList.innerHTML = item.factions.map(f => `<span class="tag-badge">${this.escapeHtml(f)}</span>`).join("");
        }
        if (modalRolesList) {
            modalRolesList.innerHTML = item.roles.map(r => `<span class="tag-badge">${this.escapeHtml(r)}</span>`).join("");
        }

        // Render Weapon Combat Performance Radar Chart
        const { modalRadarChart, radarStatChips } = this.elements || {};
        if (modalRadarChart) {
            const stats = RadarChart.getStats(item);
            RadarChart.render(modalRadarChart, stats);
            if (radarStatChips) {
                radarStatChips.innerHTML = `
                    <span class="radar-chip">RPM: <strong>${stats.fireRate}</strong></span>
                    <span class="radar-chip">Range: <strong>${stats.effectiveRange}</strong></span>
                    <span class="radar-chip">Control: <strong>${stats.recoil}</strong></span>
                    <span class="radar-chip">Mobility: <strong>${stats.weight}</strong></span>
                    <span class="radar-chip">Modularity: <strong>${stats.modularity}</strong></span>
                `;
            }
        }

        if (inspectModal) {
            inspectModal.style.display = "flex";
        }
    }

    static closeInspectModal() {
        if (this.elements?.inspectModal) {
            this.elements.inspectModal.style.display = "none";
        }
        this.currentlyInspectedWeapon = null;
    }

    static rollAroundWeapon(weaponId) {
        const item = this.catalog.find(it => it.id === weaponId);
        if (!item) return;

        this.closeInspectModal();
        UIController.runGenerateWithWeapon(item.id, item.factions[0], item.roles[0], item.mod);
    }

    static escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
ArmoryController.catalog = [];
ArmoryController.activeCategory = "all";
ArmoryController.activeMod = "all";
ArmoryController.searchQuery = "";
ArmoryController.isInitialized = false;
ArmoryController.currentlyInspectedWeapon = null;
ArmoryController.elements = null;

// ----------------------------------------------------------------------------
// 10. UI Controller & DOM Event Delegation
// ----------------------------------------------------------------------------
class UIController {
    /**
     * Initializes UI event handlers and bindings.
     */
    static init() {
        if (typeof document === "undefined" || typeof window === "undefined") {
            return;
        }
        this.cacheElements();
        this.bindTabNavigation();
        this.bindChaosSlider();
        this.bindGeneratorControls();
        this.bindCustomWeaponsManager();
        this.bindMetaFilterEvents();
        this.bindHistoryEvents();
        this.bindShareButton();
        this.bindSquadBuilder();
        this.bindComparisonEvents();
        this.bindImportEvents();
        this.bindAdvancedTacticalControls();
        if (typeof SoundController !== 'undefined') {
            SoundController.init();
        }
        this.renderCustomWeaponsTable();
        this.renderHistory();
        this.checkHashOnLoad();
        ArmoryController.init();
        KeyboardController.init();
    }
    static cacheElements() {
        const getEl = (id) => document.getElementById(id);
        this.elements = {
            tabBtns: document.querySelectorAll(".tab-btn"),
            chaosSlider: getEl("chaos-slider"),
            chaosLabel: getEl("chaos-label"),
            chaosHint: getEl("chaos-hint"),
            generateBtn: getEl("generate-btn"),
            copyBtn: getEl("copy-btn"),
            shareBtn: getEl("share-btn"),
            compareLastBtn: getEl("compare-last-btn"),
            loadoutGrid: getEl("loadout-grid"),
            sqfOutput: getEl("sqf-output"),
            factionSelect: getEl("faction-select"),
            roleSelect: getEl("role-select"),
            metaBadge: getEl("loadout-meta-badge"),
            bestContainer: getEl("best-loadouts-container"),
            customTbody: getEl("custom-weapons-tbody"),
            customCount: getEl("custom-count"),
            addWeaponForm: getEl("add-weapon-form"),
            jsonArea: getEl("custom-json-area"),
            importJsonBtn: getEl("import-json-btn"),
            exportJsonBtn: getEl("export-json-btn"),
            resetCustomBtn: getEl("reset-custom-mods-btn"),
            modVanilla: getEl("mod-vanilla"),
            modRhs: getEl("mod-rhs"),
            modCup: getEl("mod-cup"),
            modNiarms: getEl("mod-niarms"),
            modCustom: getEl("mod-custom"),
            metaFactionPills: document.querySelectorAll("#meta-faction-pills .pill"),
            metaRolePills: document.querySelectorAll("#meta-role-pills .pill"),
            metaModPills: document.querySelectorAll("#meta-mod-pills .pill"),
            metaCountBadge: getEl("meta-count-badge"),
            rollMetaBtn: getEl("roll-meta-btn"),
            historyContainer: getEl("history-container"),
            historyCount: getEl("history-count"),
            clearHistoryBtn: getEl("clear-history-btn"),
            exportHistoryBtn: getEl("export-history-btn"),
            historyPanel: getEl("history-panel"),
            historyToggle: getEl("history-toggle-btn"),
            logisticsPanel: getEl("logistics-panel"),
            squadTemplateSelect: getEl("squad-template-select"),
            squadFactionSelect: getEl("squad-faction-select"),
            generateSquadBtn: getEl("generate-squad-btn"),
            copySquadSqfBtn: getEl("copy-squad-sqf-btn"),
            copySquadSqfBtn2: getEl("copy-squad-sqf-btn2"),
            squadGrid: getEl("squad-grid"),
            squadSqfOutput: getEl("squad-sqf-output"),
            squadCountBadge: getEl("squad-count-badge"),
            comparisonModal: getEl("comparison-modal"),
            comparisonCloseBtn: getEl("comparison-close-btn"),
            comparisonCloseFooterBtn: getEl("comparison-close-footer-btn"),
            comparisonSwapBtn: getEl("comparison-swap-btn"),
            comparisonDeltaBar: getEl("comparison-delta-bar"),
            comparisonTableTbody: getEl("comparison-table-tbody"),
            comparisonMatchBadge: getEl("comparison-match-badge"),
            comparisonDiffBadge: getEl("comparison-diff-badge"),
            compColAHeader: getEl("comp-col-a-header"),
            compColBHeader: getEl("comp-col-b-header"),
            importToggleBtn: getEl("import-toggle-btn"),
            importPanelBody: getEl("import-panel-body"),
            sqfImportArea: getEl("sqf-import-area"),
            parseImportBtn: getEl("parse-import-btn"),
            clearImportBtn: getEl("clear-import-btn"),
            importStatus: getEl("import-status"),
            importFeedback: getEl("import-feedback"),
            // Feature 1-7 additions
            biomeSelect: getEl("biome-select"),
            opticProfileSelect: getEl("optic-profile-select"),
            nightOpsToggle: getEl("night-ops-toggle"),
            medicalLevelSelect: getEl("medical-level-select"),
            caliberSelect: getEl("caliber-select"),
            ammoTypeSelect: getEl("ammo-type-select"),
            sqfFormatSelect: getEl("sqf-format-select"),
            downloadSqfBtn: getEl("download-sqf-btn"),
            exportCardBtn: getEl("export-card-btn"),
            briefingCanvas: getEl("briefing-card-canvas"),
            audioToggleBtn: getEl("audio-toggle-btn")
        };
    }
    static bindTabNavigation() {
        const { tabBtns } = this.elements;
        if (!tabBtns)
            return;
        tabBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const currentBtn = e.currentTarget;
                const targetId = currentBtn.getAttribute("data-target");
                if (!targetId)
                    return;
                this.switchToTab(targetId);
            });
        });
    }
    static switchToTab(targetId) {
        if (typeof SoundController !== 'undefined') {
            SoundController.playSwitchTick();
        }
        const { tabBtns } = this.elements || {};
        if (tabBtns) {
            tabBtns.forEach(b => {
                if (b.getAttribute("data-target") === targetId) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });
        }
        const views = ["generator-view", "armory-view", "best-loadouts-view", "mod-manager-view", "squad-builder-view"];
        views.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
        const activeView = document.getElementById(targetId);
        if (activeView) {
            activeView.style.display = targetId === "generator-view" ? "grid" : "block";
        }
        ArmoryController.setActiveTab(targetId);
        if (targetId === "armory-view") {
            ArmoryController.init();
            ArmoryController.refresh();
        }
        if (targetId === "best-loadouts-view" && !this.isBestLoadoutsRendered) {
            this.renderBestLoadouts();
            this.isBestLoadoutsRendered = true;
        }
        if (targetId === "squad-builder-view" && !this.isSquadBuilderRendered) {
            this.rollInitialSquad();
            this.isSquadBuilderRendered = true;
        }
    }
    static runGenerateWithWeapon(weaponId, preferredFaction, preferredRole, requiredMod) {
        this.switchToTab("generator-view");
        const {
            chaosSlider,
            factionSelect,
            roleSelect,
            loadoutGrid,
            sqfOutput,
            copyBtn,
            metaBadge,
            modVanilla,
            modRhs,
            modCup,
            modNiarms,
            modCustom
        } = this.elements;
        if (!loadoutGrid || !sqfOutput) return;

        if (requiredMod) {
            if (requiredMod === "Vanilla" && modVanilla) modVanilla.checked = true;
            if (requiredMod === "RHS" && modRhs) modRhs.checked = true;
            if (requiredMod === "CUP" && modCup) modCup.checked = true;
            if (requiredMod === "NIArms" && modNiarms) modNiarms.checked = true;
            if (requiredMod === "Custom" && modCustom) modCustom.checked = true;
        }

        if (preferredFaction && factionSelect) {
            factionSelect.value = preferredFaction;
        }
        if (preferredRole && roleSelect) {
            roleSelect.value = preferredRole;
        }

        const activeMods = this.getActiveMods();
        const chaos = chaosSlider ? (parseInt(chaosSlider.value, 10) || 1) : 1;
        const faction = (factionSelect === null || factionSelect === void 0 ? void 0 : factionSelect.value) || "Random";
        const role = (roleSelect === null || roleSelect === void 0 ? void 0 : roleSelect.value) || "Random";

        const { loadoutData, sqf } = LoadoutEngine.generate({
            faction,
            role,
            chaosLevel: chaos,
            activeMods,
            lockedWeaponId: weaponId
        });

        this.currentSQF = sqf;

        if (metaBadge && loadoutData.meta) {
            metaBadge.style.display = "inline-block";
            metaBadge.textContent = `${loadoutData.faction} • ${loadoutData.role} • [${loadoutData.meta.primaryMod}] ${loadoutData.meta.caliber} (Tailored Kit)`;
        }

        loadoutGrid.innerHTML = `
            ${this.renderCard("Primary Weapon", loadoutData.primary.class, [loadoutData.primary.optic, loadoutData.primary.pointer, loadoutData.primary.bipod, loadoutData.primary.muzzle])}
            ${this.renderCard("Secondary (Launcher)", loadoutData.launcher.class)}
            ${this.renderCard("Handgun", loadoutData.handgun.class, [loadoutData.handgun.muzzle])}
            ${this.renderCard("Uniform", loadoutData.clothing.uniform)}
            ${this.renderCard("Vest", loadoutData.clothing.vest)}
            ${this.renderCard("Backpack", loadoutData.clothing.backpack)}
            ${this.renderCard("Headgear", loadoutData.clothing.headgear)}
            ${this.renderCard("Facewear", loadoutData.clothing.facewear)}
            ${this.renderCard("Special Equipment", loadoutData.items.nvg, [loadoutData.items.binocular])}
        `;

        sqfOutput.textContent = SqfSerializer.formatPretty(sqf);
        this.currentLoadoutData = loadoutData;
        const { shareBtn } = this.elements || {};
        if (copyBtn) copyBtn.disabled = false;
        if (shareBtn) shareBtn.disabled = false;
        this.renderLogistics(loadoutData);

        const panelEl = document.querySelector(".loadout-display");
        if (panelEl) {
            panelEl.scrollIntoView({ behavior: "smooth" });
        }
    }
    static bindChaosSlider() {
        const { chaosSlider, chaosLabel, chaosHint } = this.elements;
        if (!chaosSlider || !chaosLabel || !chaosHint)
            return;
        const updateChaosUI = (val) => {
            chaosLabel.className = `chaos-badge level-${val}`;
            if (val === 1) {
                chaosLabel.textContent = "1: Military Authenticity";
                chaosHint.textContent = "Strict faction-matching weapons, authentic camo, and standard military doctrine.";
            }
            else if (val === 2) {
                chaosLabel.textContent = "2: SpecOps / Contractor";
                chaosHint.textContent = "Modern tactical gear, high-tier accessories (suppressors, LPVOs, PEQ-15s), and cross-faction weapon availability.";
            }
            else {
                chaosLabel.textContent = "3: Cursed / Pure Chaos";
                chaosHint.textContent = "Complete faction cross-pollination, wildcard weapon assignments, and mismatched exotic gear.";
            }
        };
        chaosSlider.addEventListener("input", () => {
            updateChaosUI(parseInt(chaosSlider.value, 10) || 1);
        });
    }
    static bindGeneratorControls() {
        const { generateBtn, copyBtn } = this.elements;
        if (generateBtn) {
            generateBtn.addEventListener("click", () => this.runGenerate());
        }
        if (copyBtn) {
            copyBtn.addEventListener("click", () => {
                if (!this.currentSQF)
                    return;
                this.copyToClipboard(this.currentSQF, copyBtn, "Copied!");
            });
        }
    }
    static getActiveMods() {
        const mods = new Set();
        const { modVanilla, modRhs, modCup, modNiarms, modCustom } = this.elements;
        if (modVanilla === null || modVanilla === void 0 ? void 0 : modVanilla.checked)
            mods.add("Vanilla");
        if (modRhs === null || modRhs === void 0 ? void 0 : modRhs.checked)
            mods.add("RHS");
        if (modCup === null || modCup === void 0 ? void 0 : modCup.checked)
            mods.add("CUP");
        if (modNiarms === null || modNiarms === void 0 ? void 0 : modNiarms.checked)
            mods.add("NIArms");
        if (modCustom === null || modCustom === void 0 ? void 0 : modCustom.checked)
            mods.add("Custom");
        if (mods.size === 0) {
            mods.add("Vanilla");
            if (modVanilla)
                modVanilla.checked = true;
        }
        return mods;
    }
    static runGenerate() {
        const {
            chaosSlider, factionSelect, roleSelect, loadoutGrid, sqfOutput, copyBtn, metaBadge,
            biomeSelect, opticProfileSelect, nightOpsToggle, medicalLevelSelect, caliberSelect, ammoTypeSelect,
            sqfFormatSelect, downloadSqfBtn, exportCardBtn
        } = this.elements || {};
        if (!loadoutGrid || !sqfOutput)
            return;
        const activeMods = this.getActiveMods();
        const chaos = chaosSlider ? (parseInt(chaosSlider.value, 10) || 1) : 1;
        const faction = ((factionSelect === null || factionSelect === void 0 ? void 0 : factionSelect.value) || "Random");
        const role = ((roleSelect === null || roleSelect === void 0 ? void 0 : roleSelect.value) || "Random");

        const biome = (biomeSelect && biomeSelect.value) || 'auto';
        const opticProfile = (opticProfileSelect && opticProfileSelect.value) || 'any';
        const nightOps = Boolean(nightOpsToggle && nightOpsToggle.checked);
        const medicalLevel = (medicalLevelSelect && medicalLevelSelect.value) || 'vanilla';
        const caliber = (caliberSelect && caliberSelect.value) || 'any';
        const ammoType = (ammoTypeSelect && ammoTypeSelect.value) || 'ball';
        const sqfFormat = (sqfFormatSelect && sqfFormatSelect.value) || 'player';

        const { loadoutData, sqf } = LoadoutEngine.generate({
            faction,
            role,
            chaosLevel: chaos,
            activeMods,
            biome,
            opticProfile,
            nightOps,
            medicalLevel,
            caliber,
            ammoType,
            sqfFormat
        });
        this.currentSQF = sqf;
        this.previousLoadoutData = this.currentLoadoutData;
        this.currentLoadoutData = loadoutData;

        // Tactical sound FX
        if (typeof SoundController !== 'undefined') {
            SoundController.playBoltRack();
        }

        const { compareLastBtn } = this.elements || {};
        if (this.previousLoadoutData && compareLastBtn) {
            compareLastBtn.style.display = "inline-flex";
        }
        // Auto-save to history
        LoadoutHistory.save(loadoutData, sqf);
        this.renderHistory();
        // Render Meta Badge
        if (metaBadge && loadoutData.meta) {
            metaBadge.style.display = "inline-block";
            metaBadge.textContent = `${loadoutData.faction} • ${loadoutData.role} • [${loadoutData.meta.primaryMod}] ${loadoutData.meta.caliber}`;
        }
        // Render Loadout Cards
        loadoutGrid.innerHTML = `
            ${this.renderCard("Primary Weapon", loadoutData.primary.class, [loadoutData.primary.optic, loadoutData.primary.pointer, loadoutData.primary.bipod, loadoutData.primary.muzzle])}
            ${this.renderCard("Secondary (Launcher)", loadoutData.launcher.class)}
            ${this.renderCard("Handgun", loadoutData.handgun.class, [loadoutData.handgun.muzzle])}
            ${this.renderCard("Uniform", loadoutData.clothing.uniform)}
            ${this.renderCard("Vest", loadoutData.clothing.vest)}
            ${this.renderCard("Backpack", loadoutData.clothing.backpack)}
            ${this.renderCard("Headgear", loadoutData.clothing.headgear)}
            ${this.renderCard("Facewear", loadoutData.clothing.facewear)}
            ${this.renderCard("Special Equipment", loadoutData.items.nvg, [loadoutData.items.binocular])}
        `;
        sqfOutput.textContent = SqfSerializer.formatPretty(sqf);
        const { copyBtn: genCopyBtn, shareBtn } = this.elements || {};
        if (genCopyBtn)
            genCopyBtn.disabled = false;
        if (shareBtn)
            shareBtn.disabled = false;
        if (downloadSqfBtn)
            downloadSqfBtn.disabled = false;
        if (exportCardBtn)
            exportCardBtn.disabled = false;
        // Render logistics panel
        this.renderLogistics(loadoutData);
    }
    static bindAdvancedTacticalControls() {
        const {
            sqfFormatSelect,
            downloadSqfBtn,
            exportCardBtn,
            audioToggleBtn,
            briefingCanvas
        } = this.elements || {};

        if (audioToggleBtn) {
            audioToggleBtn.addEventListener("click", () => {
                if (typeof SoundController !== 'undefined') {
                    SoundController.toggleMute();
                }
            });
        }

        if (sqfFormatSelect) {
            sqfFormatSelect.addEventListener("change", () => {
                if (typeof SoundController !== 'undefined') {
                    SoundController.playSwitchTick();
                }
                if (this.currentLoadoutData) {
                    const format = sqfFormatSelect.value || 'player';
                    this.currentSQF = SqfSerializer.serialize(this.currentLoadoutData, { format });
                    if (this.elements?.sqfOutput) {
                        this.elements.sqfOutput.textContent = SqfSerializer.formatPretty(this.currentSQF);
                    }
                }
            });
        }

        if (downloadSqfBtn) {
            downloadSqfBtn.addEventListener("click", () => {
                if (!this.currentSQF) return;
                if (typeof SoundController !== 'undefined') {
                    SoundController.playRadioClick();
                }
                const faction = (this.currentLoadoutData?.faction || 'unit').toLowerCase().replace(/\s+/g, '_');
                const role = (this.currentLoadoutData?.role || 'loadout').toLowerCase().replace(/\s+/g, '_');
                SqfSerializer.downloadSqfFile(`loadout_${faction}_${role}.sqf`, this.currentSQF);
            });
        }

        if (exportCardBtn) {
            exportCardBtn.addEventListener("click", () => {
                if (!this.currentLoadoutData || !briefingCanvas) return;
                if (typeof SoundController !== 'undefined') {
                    SoundController.playRadioClick();
                }
                if (typeof BriefingCardGenerator !== 'undefined') {
                    BriefingCardGenerator.download(briefingCanvas, this.currentLoadoutData);
                }
            });
        }
    }
    static renderCard(label, name, attachments = []) {
        if (!name)
            return "";
        const validAttachments = attachments.filter(Boolean);
        const attachmentsHtml = validAttachments.length > 0
            ? `<div class="gear-attachments">${validAttachments.map(a => `<div class="attachment">${this.escapeHtml(a)}</div>`).join("")}</div>`
            : "";
        return `
            <div class="gear-item animate-in">
                <span class="gear-label">${this.escapeHtml(label)}</span>
                <span class="gear-name">${this.escapeHtml(name)}</span>
                ${attachmentsHtml}
            </div>
        `;
    }
    /**
     * Renders Best Loadouts grid using event delegation for SQF copy buttons.
     */
    static bindMetaFilterEvents() {
        const { metaFactionPills, metaRolePills, metaModPills, rollMetaBtn } = this.elements || {};

        if (metaFactionPills) {
            metaFactionPills.forEach(pill => {
                pill.addEventListener("click", () => {
                    metaFactionPills.forEach(p => p.classList.remove("active"));
                    pill.classList.add("active");
                    this.activeMetaFaction = pill.getAttribute("data-faction") || "all";
                    this.renderBestLoadouts();
                });
            });
        }

        if (metaRolePills) {
            metaRolePills.forEach(pill => {
                pill.addEventListener("click", () => {
                    metaRolePills.forEach(p => p.classList.remove("active"));
                    pill.classList.add("active");
                    this.activeMetaRole = pill.getAttribute("data-role") || "all";
                    this.renderBestLoadouts();
                });
            });
        }

        if (metaModPills) {
            metaModPills.forEach(pill => {
                pill.addEventListener("click", () => {
                    metaModPills.forEach(p => p.classList.remove("active"));
                    pill.classList.add("active");
                    this.activeMetaMod = pill.getAttribute("data-mod") || "all";
                    this.renderBestLoadouts();
                });
            });
        }

        if (rollMetaBtn) {
            rollMetaBtn.addEventListener("click", () => {
                const faction = this.activeMetaFaction === "all" ? "Random" : this.activeMetaFaction;
                const role = this.activeMetaRole === "all" ? "Random" : this.activeMetaRole;
                const activeMods = this.getActiveMods();
                const rolled = BestLoadoutFactory.rollMeta(faction, role, activeMods);

                this.switchToTab("generator-view");

                const { loadoutGrid, sqfOutput, copyBtn, metaBadge } = this.elements;
                if (!loadoutGrid || !sqfOutput) return;

                this.currentSQF = rolled.sqf;

                if (metaBadge && rolled.loadoutData.meta) {
                    metaBadge.style.display = "inline-block";
                    metaBadge.textContent = "🎯 META PRESET: " + rolled.presetTitle + " • [" + rolled.loadoutData.meta.primaryMod + "] " + rolled.loadoutData.meta.caliber;
                }

                loadoutGrid.innerHTML = `
                    ${this.renderCard("Primary Weapon", rolled.loadoutData.primary.class, [rolled.loadoutData.primary.optic, rolled.loadoutData.primary.pointer, rolled.loadoutData.primary.bipod, rolled.loadoutData.primary.muzzle])}
                    ${this.renderCard("Secondary (Launcher)", rolled.loadoutData.launcher.class)}
                    ${this.renderCard("Handgun", rolled.loadoutData.handgun.class, [rolled.loadoutData.handgun.muzzle])}
                    ${this.renderCard("Uniform", rolled.loadoutData.clothing.uniform)}
                    ${this.renderCard("Vest", rolled.loadoutData.clothing.vest)}
                    ${this.renderCard("Backpack", rolled.loadoutData.clothing.backpack)}
                    ${this.renderCard("Headgear", rolled.loadoutData.clothing.headgear)}
                    ${this.renderCard("Facewear", rolled.loadoutData.clothing.facewear)}
                    ${this.renderCard("Special Equipment", rolled.loadoutData.items.nvg, [rolled.loadoutData.items.binocular])}
                `;

                sqfOutput.textContent = SqfSerializer.formatPretty(rolled.sqf);
                if (copyBtn) copyBtn.disabled = false;

                const panelEl = document.querySelector(".loadout-display");
                if (panelEl) {
                    panelEl.scrollIntoView({ behavior: "smooth" });
                }
            });
        }
    }

    /**
     * Renders Best Loadouts grid with interactive filtering, photo previews, specs, and SQF exports.
     */
    static renderBestLoadouts() {
        const { bestContainer, metaCountBadge } = this.elements || {};
        if (!bestContainer) return;

        const presets = BestLoadoutFactory.getAllPresets({
            faction: this.activeMetaFaction,
            role: this.activeMetaRole,
            mod: this.activeMetaMod
        });

        if (metaCountBadge) {
            const facLabel = this.activeMetaFaction === "all" ? "All Factions" : this.activeMetaFaction;
            const roleLabel = this.activeMetaRole === "all" ? "All Roles" : this.activeMetaRole;
            const modLabel = this.activeMetaMod === "all" ? "All Suites" : this.activeMetaMod;
            metaCountBadge.textContent = "Showing " + presets.length + " Meta Presets (" + facLabel + " • " + roleLabel + " • " + modLabel + ")";
        }

        if (presets.length === 0) {
            bestContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1rem;">
                    <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">No Meta Presets Found</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">Try adjusting your faction, role, or mod suite filter.</div>
                </div>
            `;
            return;
        }

        let html = "";
        for (const p of presets) {
            const { loadoutData, sqf } = BestLoadoutFactory.create(p.faction, p.role, p.mod);
            const weaponItem = WeaponRepository.getById(p.primaryClass);
            const imgPath = weaponItem?.photoUrl || "assets/real_weapons/default_rifle.png";
            const caliber = weaponItem?.caliber || "N/A";

            const factionClass = "badge-" + p.faction.toLowerCase();
            const modClass = "badge-" + p.mod.toLowerCase();

            const specs = [
                '<li><span class="spec-label">Primary:</span> <span class="spec-val accent">' + this.escapeHtml(p.primaryClass) + '</span></li>',
                '<li><span class="spec-label">Caliber:</span> <span class="spec-val">' + this.escapeHtml(caliber) + '</span></li>',
                p.optic ? '<li><span class="spec-label">Optic:</span> <span class="spec-val">' + this.escapeHtml(p.optic) + '</span></li>' : '',
                p.muzzle ? '<li><span class="spec-label">Suppressor:</span> <span class="spec-val">' + this.escapeHtml(p.muzzle) + '</span></li>' : '',
                p.bipod ? '<li><span class="spec-label">Bipod:</span> <span class="spec-val">' + this.escapeHtml(p.bipod) + '</span></li>' : '',
                p.pointer ? '<li><span class="spec-label">Device:</span> <span class="spec-val">' + this.escapeHtml(p.pointer) + '</span></li>' : '',
                p.launcherClass ? '<li><span class="spec-label">Launcher:</span> <span class="spec-val">' + this.escapeHtml(p.launcherClass) + '</span></li>' : '',
                '<li><span class="spec-label">Combat Load:</span> <span class="spec-val">' + this.escapeHtml(p.primaryMag[0]) + '</span></li>'
            ].filter(Boolean).join("");

            html += `
                <div class="best-loadout-card">
                    <div class="best-card-photo">
                        <img class="best-card-img" src="${imgPath}" alt="${this.escapeHtml(p.title)}" loading="lazy" onerror="this.src='assets/real_weapons/default_rifle.png'" />
                    </div>
                    <div class="best-card-body">
                        <div class="best-card-header">
                            <div class="best-card-title">${this.escapeHtml(p.title)}</div>
                            <div class="best-card-subtitle">${this.escapeHtml(p.faction)} • ${this.escapeHtml(p.role)}</div>
                        </div>
                        <div class="best-card-badges">
                            <span class="tag-badge ${factionClass}">${this.escapeHtml(p.faction)}</span>
                            <span class="tag-badge ${modClass}">${this.escapeHtml(p.mod)}</span>
                            <span class="tag-badge">${this.escapeHtml(p.role)}</span>
                            <span class="tag-badge">${this.escapeHtml(caliber)}</span>
                        </div>
                        <ul class="best-card-specs">
                            ${specs}
                        </ul>
                        <div class="best-card-actions">
                            <button class="primary-btn copy-best-btn" data-sqf="${encodeURIComponent(sqf)}">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                Copy SQF
                            </button>
                            <button class="inspect-best-btn" data-weapon-id="${this.escapeHtml(p.primaryClass)}" title="Inspect weapon in armory">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                Inspect
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        bestContainer.innerHTML = html;

        if (!this.isMetaEventsBound) {
            bestContainer.addEventListener("click", (e) => {
                const copyBtn = e.target.closest(".copy-best-btn");
                if (copyBtn) {
                    const rawSqf = copyBtn.getAttribute("data-sqf");
                    if (rawSqf) {
                        const sqf = decodeURIComponent(rawSqf);
                        this.copyToClipboard(sqf, copyBtn, "Copied SQF!");
                    }
                    return;
                }

                const inspectBtn = e.target.closest(".inspect-best-btn");
                if (inspectBtn) {
                    const weaponId = inspectBtn.getAttribute("data-weapon-id");
                    if (weaponId) {
                        ArmoryController.openInspectModal(weaponId);
                    }
                }
            });
            this.isMetaEventsBound = true;
        }
    }

    static bindCustomWeaponsManager() {
        const { addWeaponForm, importJsonBtn, exportJsonBtn, resetCustomBtn, customTbody, jsonArea } = this.elements;
        // Form Submit
        if (addWeaponForm) {
            addWeaponForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleAddWeaponSubmit();
            });
        }
        // Delegated Deletion on customTbody
        if (customTbody) {
            customTbody.addEventListener("click", (e) => {
                const deleteBtn = e.target.closest(".delete-custom-btn");
                if (!deleteBtn)
                    return;
                const indexAttr = deleteBtn.getAttribute("data-index");
                if (indexAttr !== null) {
                    const idx = parseInt(indexAttr, 10);
                    if (idx >= 0) {
                        const customs = WeaponRepository.getCustomWeapons();
                        customs.splice(idx, 1);
                        WeaponRepository.saveCustomWeapons(customs);
                        this.renderCustomWeaponsTable();
                    }
                }
            });
        }
        // Import JSON
        if (importJsonBtn && jsonArea) {
            importJsonBtn.addEventListener("click", () => {
                const raw = jsonArea.value.trim();
                if (!raw)
                    return;
                try {
                    const parsed = JSON.parse(raw);
                    const items = Array.isArray(parsed) ? parsed : [parsed];
                    const customs = WeaponRepository.getCustomWeapons();
                    let addedCount = 0;
                    for (const item of items) {
                        if (item && typeof item === "object" && item.id) {
                            const sanitized = WeaponRepository.sanitizeWeapon(item);
                            customs.push(sanitized);
                            addedCount++;
                        }
                    }
                    if (addedCount > 0) {
                        WeaponRepository.saveCustomWeapons(customs);
                        this.renderCustomWeaponsTable();
                        jsonArea.value = "";
                        alert(`Successfully imported ${addedCount} custom weapon(s)!`);
                    }
                    else {
                        alert("No valid weapons found in the provided JSON.");
                    }
                }
                catch (err) {
                    alert("Invalid JSON format! Please review the sample schema template.");
                }
            });
        }
        // Export JSON
        if (exportJsonBtn && jsonArea) {
            exportJsonBtn.addEventListener("click", () => {
                const customs = WeaponRepository.getCustomWeapons();
                jsonArea.value = JSON.stringify(customs, null, 2);
            });
        }
        // Reset Custom Mods
        if (resetCustomBtn) {
            resetCustomBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to clear all custom modded weapons?")) {
                    WeaponRepository.saveCustomWeapons([]);
                    this.renderCustomWeaponsTable();
                }
            });
        }
    }
    static handleAddWeaponSubmit() {
        var _a, _b, _c;
        const getVal = (id) => {
            const el = document.getElementById(id);
            return el ? el.value.trim() : "";
        };
        const id = getVal("custom-weapon-id");
        const name = getVal("custom-weapon-name");
        const magId = getVal("custom-mag-id");
        const capacity = parseInt(getVal("custom-mag-capacity"), 10) || 30;
        const caliber = getVal("custom-caliber");
        const modName = (getVal("custom-mod-name") || "Custom");
        const role = getVal("custom-role");
        const faction = getVal("custom-faction");
        const opticType = getVal("custom-optic-type");
        const hasBipod = ((_a = document.getElementById("custom-has-bipod")) === null || _a === void 0 ? void 0 : _a.checked) || false;
        const hasMuzzle = ((_b = document.getElementById("custom-has-muzzle")) === null || _b === void 0 ? void 0 : _b.checked) || false;
        if (!id || !magId) {
            alert("Weapon Classname and Default Magazine Classname are required!");
            return;
        }
        const newWeapon = WeaponRepository.sanitizeWeapon({
            id,
            name: name || id,
            mod: modName,
            factions: [faction],
            roles: [role],
            tier: "standard",
            caliber,
            defaultMag: [magId, capacity],
            opticType,
            hasBipod,
            hasMuzzle
        });
        const existing = WeaponRepository.getCustomWeapons();
        existing.push(newWeapon);
        WeaponRepository.saveCustomWeapons(existing);
        if ((_c = this.elements) === null || _c === void 0 ? void 0 : _c.addWeaponForm) {
            this.elements.addWeaponForm.reset();
            const modInput = document.getElementById("custom-mod-name");
            if (modInput)
                modInput.value = "Custom";
        }
        this.renderCustomWeaponsTable();
        alert(`Weapon ${id} registered successfully!`);
    }
    static renderCustomWeaponsTable() {
        const { customTbody, customCount } = this.elements;
        const customs = WeaponRepository.getCustomWeapons();
        if (customCount) {
            customCount.textContent = customs.length.toString();
        }
        if (!customTbody)
            return;
        if (customs.length === 0) {
            customTbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No custom weapons added yet. Use the form above or import JSON.</td></tr>`;
            return;
        }
        let html = "";
        customs.forEach((w, idx) => {
            html += `
                <tr>
                    <td><code>${this.escapeHtml(w.id)}</code></td>
                    <td>${this.escapeHtml(w.name || "-")}</td>
                    <td><span class="tag-badge badge-custom">${this.escapeHtml(w.mod)}</span></td>
                    <td><span class="tag-badge">${this.escapeHtml(w.caliber)}</span></td>
                    <td>${this.escapeHtml(w.roles.join(", "))}</td>
                    <td>${this.escapeHtml(w.factions.join(", "))}</td>
                    <td><code>${this.escapeHtml(w.defaultMag[0])} (${w.defaultMag[1]} rnd)</code></td>
                    <td>
                        <button class="icon-btn delete-custom-btn" data-index="${idx}" style="color: #ef4444; padding: 0.3rem 0.6rem;">Delete</button>
                    </td>
                </tr>
            `;
        });
        customTbody.innerHTML = html;
        if (typeof ArmoryController !== "undefined") {
            ArmoryController.refresh();
        }
    }
    static async copyToClipboard(text, triggerBtn, successText) {
        if (typeof SoundController !== 'undefined') {
            SoundController.playRadioClick();
        }
        var _a;
        try {
            if ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.clipboard) === null || _a === void 0 ? void 0 : _a.writeText) {
                await navigator.clipboard.writeText(text);
            }
            else {
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }
            const originalContent = triggerBtn.innerHTML;
            triggerBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ${this.escapeHtml(successText)}
            `;
            setTimeout(() => {
                triggerBtn.innerHTML = originalContent;
            }, 2000);
        }
        catch (err) {
            console.error("Clipboard copy failed:", err);
        }
    }
    static escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    /**
     * Renders the loadout history panel with favoriting, deletion, and restore.
     */
    static renderHistory() {
        const { historyContainer, historyCount } = this.elements || {};
        if (!historyContainer) return;
        const entries = LoadoutHistory.getAll();
        if (historyCount) {
            historyCount.textContent = String(entries.length);
        }
        if (entries.length === 0) {
            historyContainer.innerHTML = '<div class="history-empty">No loadouts generated yet. Roll one above!</div>';
            return;
        }
        let html = '';
        for (const entry of entries) {
            const d = new Date(entry.timestamp);
            const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
            const ld = entry.loadout;
            const factionClass = 'badge-' + (ld.faction || 'nato').toLowerCase();
            const starClass = entry.isFavorite ? 'starred' : '';
            const primaryName = ld.primary ? ld.primary.class : 'Unknown';
            html += `
                <div class="history-entry ${starClass}" data-history-id="${entry.id}">
                    <button class="history-star-btn ${starClass}" data-action="toggle-fav" data-id="${entry.id}" title="${entry.isFavorite ? 'Unfavorite' : 'Favorite'}">
                        ${entry.isFavorite ? '★' : '☆'}
                    </button>
                    <div class="history-entry-info">
                        <div class="history-entry-title">
                            <span class="tag-badge ${factionClass}" style="font-size: 0.7rem; padding: 0.15rem 0.45rem;">${this.escapeHtml(ld.faction)}</span>
                            <span class="history-role">${this.escapeHtml(ld.role)}</span>
                        </div>
                        <div class="history-weapon">${this.escapeHtml(primaryName)}</div>
                        <div class="history-time">${dateStr} ${timeStr}</div>
                    </div>
                    <div class="history-entry-actions">
                        <button class="history-action-btn" data-action="compare" data-id="${entry.id}" title="Compare with current loadout">⇄</button>
                        <button class="history-action-btn" data-action="restore" data-id="${entry.id}" title="Restore this loadout">↻</button>
                        <button class="history-action-btn" data-action="copy-sqf" data-id="${entry.id}" title="Copy SQF">⎘</button>
                        <button class="history-action-btn delete" data-action="delete" data-id="${entry.id}" title="Delete">✕</button>
                    </div>
                </div>
            `;
        }
        historyContainer.innerHTML = html;
    }
    /**
     * Binds history panel event delegation.
     */
    static bindHistoryEvents() {
        const { historyContainer, clearHistoryBtn, exportHistoryBtn, historyToggle, historyPanel } = this.elements || {};
        if (historyContainer) {
            historyContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-action]');
                if (!btn) return;
                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-id');
                if (action === 'toggle-fav' && id) {
                    LoadoutHistory.toggleFavorite(id);
                    this.renderHistory();
                } else if (action === 'delete' && id) {
                    LoadoutHistory.delete(id);
                    this.renderHistory();
                } else if (action === 'restore' && id) {
                    const entries = LoadoutHistory.getAll();
                    const entry = entries.find(e => e.id === id);
                    if (entry) {
                        this.restoreFromHistory(entry);
                    }
                } else if (action === 'compare' && id) {
                    const entries = LoadoutHistory.getAll();
                    const entry = entries.find(e => e.id === id);
                    if (entry && this.currentLoadoutData) {
                        this.openComparison(this.currentLoadoutData, entry.loadout, "Current Loadout", `History (${entry.loadout.role})`);
                    }
                } else if (action === 'copy-sqf' && id) {
                    const entries = LoadoutHistory.getAll();
                    const entry = entries.find(e => e.id === id);
                    if (entry && entry.sqf) {
                        this.copyToClipboard(entry.sqf, btn, 'Copied!');
                    }
                }
            });
        }
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                const removed = LoadoutHistory.clear();
                this.renderHistory();
            });
        }
        if (exportHistoryBtn) {
            exportHistoryBtn.addEventListener('click', () => {
                const json = LoadoutHistory.export();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'arma3_loadout_history.json';
                a.click();
                URL.revokeObjectURL(url);
            });
        }
        if (historyToggle && historyPanel) {
            historyToggle.addEventListener('click', () => {
                const isCollapsed = historyPanel.classList.toggle('collapsed');
                historyToggle.textContent = isCollapsed ? 'Show History ▼' : 'Hide History ▲';
            });
        }
    }
    /**
     * Restores a loadout from history into the main display.
     */
    static restoreFromHistory(entry) {
        if (!entry || !entry.loadout) return;
        this.restoreFromLoadout(entry.loadout, entry.sqf);
    }
    /**
     * Restores any loadout object into the UI and recomputes/formats its SQF.
     */
    static restoreFromLoadout(ld, sqfOverride) {
        if (!ld) return;
        const { loadoutGrid, sqfOutput, copyBtn, shareBtn, metaBadge } = this.elements || {};
        this.currentLoadoutData = ld;
        const sqf = sqfOverride || SqfSerializer.serialize(ld);
        this.currentSQF = sqf;
        if (metaBadge && ld.meta) {
            metaBadge.style.display = 'inline-block';
            metaBadge.textContent = `${ld.faction} • ${ld.role} • [${ld.meta.primaryMod || 'Vanilla'}] ${ld.meta.caliber || ''}`;
        } else if (metaBadge) {
            metaBadge.style.display = 'none';
        }
        if (loadoutGrid) {
            const p = ld.primary || {};
            const h = ld.handgun || {};
            const l = ld.launcher || {};
            const c = ld.clothing || {};
            const it = ld.items || {};
            loadoutGrid.innerHTML = `
                ${this.renderCard('Primary Weapon', p.class, [p.optic, p.pointer, p.bipod, p.muzzle])}
                ${this.renderCard('Secondary (Launcher)', l.class)}
                ${this.renderCard('Handgun', h.class, [h.muzzle])}
                ${this.renderCard('Uniform', c.uniform)}
                ${this.renderCard('Vest', c.vest)}
                ${this.renderCard('Backpack', c.backpack)}
                ${this.renderCard('Headgear', c.headgear)}
                ${this.renderCard('Facewear', c.facewear)}
                ${this.renderCard('Special Equipment', it.nvg, [it.binocular])}
            `;
        }
        if (sqfOutput) sqfOutput.textContent = SqfSerializer.formatPretty(sqf);
        if (copyBtn) copyBtn.disabled = false;
        if (shareBtn) shareBtn.disabled = false;
        this.renderLogistics(ld);
    }
    /**
     * Binds share loadout button to copy a shareable URL to clipboard.
     */
    static bindShareButton() {
        const { shareBtn } = this.elements || {};
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (!this.currentLoadoutData) return;
                const url = LoadoutShareCodec.generateShareUrl(this.currentLoadoutData);
                this.copyToClipboard(url, shareBtn, 'Link Copied!');
            });
        }
    }
    /**
     * Checks window.location.hash on load and restores shared loadout if present.
     */
    static checkHashOnLoad() {
        if (typeof window === 'undefined' || !window.location || !window.location.hash) return;
        const hash = window.location.hash;
        if (hash.startsWith('#loadout=')) {
            const encoded = hash.substring(9);
            const loadout = LoadoutShareCodec.decode(encoded);
            if (loadout) {
                this.restoreFromLoadout(loadout);
            }
        }
    }
    /**
     * Renders the weight & logistics panel below the loadout grid.
     */
    static renderLogistics(loadoutData) {
        const { logisticsPanel } = this.elements || {};
        if (!logisticsPanel) return;
        const stats = LogisticsCalculator.analyze(loadoutData);
        const encClass = 'encumbrance-' + stats.encumbranceLevel.toLowerCase();
        // Calculate percentages for weight bar
        const total = stats.totalWeightKg || 1;
        const weaponPct = Math.round((stats.weaponWeight / total) * 100);
        const ammoPct = Math.round((stats.ammoWeight / total) * 100);
        const gearPct = Math.max(0, 100 - weaponPct - ammoPct);
        logisticsPanel.style.display = 'block';
        logisticsPanel.innerHTML = `
            <div class="logistics-header">
                <div class="logistics-title">Weight & Logistics</div>
                <span class="encumbrance-badge ${encClass}">${stats.encumbranceLevel}</span>
            </div>
            <div class="logistics-weight-bar">
                <div class="weight-segment weapon" style="width: ${weaponPct}%" title="Weapons: ${stats.weaponWeight} kg"></div>
                <div class="weight-segment ammo" style="width: ${ammoPct}%" title="Ammunition: ${stats.ammoWeight} kg"></div>
                <div class="weight-segment gear" style="width: ${gearPct}%" title="Gear: ${stats.gearWeight} kg"></div>
            </div>
            <div class="logistics-legend">
                <span class="legend-item"><span class="legend-dot weapon"></span>Weapons ${stats.weaponWeight} kg</span>
                <span class="legend-item"><span class="legend-dot ammo"></span>Ammo ${stats.ammoWeight} kg</span>
                <span class="legend-item"><span class="legend-dot gear"></span>Gear ${stats.gearWeight} kg</span>
            </div>
            <div class="logistics-stats-row">
                <div class="logistics-stat">
                    <span class="logistics-stat-value">${stats.totalWeightKg}</span>
                    <span class="logistics-stat-label">Total kg</span>
                </div>
                <div class="logistics-stat">
                    <span class="logistics-stat-value">${stats.totalRounds}</span>
                    <span class="logistics-stat-label">Total Rnds</span>
                </div>
                <div class="logistics-stat">
                    <span class="logistics-stat-value">${stats.estimatedBursts}</span>
                    <span class="logistics-stat-label">3-Rnd Bursts</span>
                </div>
                <div class="logistics-stat">
                    <span class="logistics-stat-value">~${stats.sustainabilityMinutes} min</span>
                    <span class="logistics-stat-label">Sustained Fire</span>
                </div>
            </div>
        `;
    }
    /**
     * Binds Squad Builder controls and export handlers.
     */
    static bindSquadBuilder() {
        const { generateSquadBtn, copySquadSqfBtn, copySquadSqfBtn2, squadGrid } = this.elements || {};
        if (generateSquadBtn) {
            generateSquadBtn.addEventListener('click', () => {
                this.rollInitialSquad();
            });
        }
        const copySquadHandler = (btn) => {
            if (!this.currentSquadSQF) return;
            this.copyToClipboard(this.currentSquadSQF, btn, 'Squad SQF Copied!');
        };
        if (copySquadSqfBtn) {
            copySquadSqfBtn.addEventListener('click', () => copySquadHandler(copySquadSqfBtn));
        }
        if (copySquadSqfBtn2) {
            copySquadSqfBtn2.addEventListener('click', () => copySquadHandler(copySquadSqfBtn2));
        }
        if (squadGrid) {
            squadGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-squad-action]');
                if (!btn) return;
                const action = btn.getAttribute('data-squad-action');
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                if (action === 'inspect' && this.currentSquad && this.currentSquad.members && this.currentSquad.members[idx]) {
                    const member = this.currentSquad.members[idx];
                    this.restoreFromLoadout(member.loadout, member.sqf);
                    this.switchToTab('generator-view');
                } else if (action === 'copy-unit' && this.currentSquad && this.currentSquad.members && this.currentSquad.members[idx]) {
                    const member = this.currentSquad.members[idx];
                    this.copyToClipboard(member.sqf, btn, 'Unit Copied!');
                }
            });
        }
    }
    /**
     * Rolls or rerolls the squad from current UI selections.
     */
    static rollInitialSquad() {
        const { squadTemplateSelect, squadFactionSelect } = this.elements || {};
        const template = squadTemplateSelect ? squadTemplateSelect.value : "4-Man Fireteam";
        const faction = squadFactionSelect ? squadFactionSelect.value : "NATO";
        const activeMods = this.getActiveMods();
        const squad = SquadBuilder.generate({ template, faction, activeMods });
        this.renderSquad(squad);
    }
    /**
     * Renders squad member cards and bulk SQF output.
     */
    static renderSquad(squad) {
        if (!squad) return;
        this.currentSquad = squad;
        this.currentSquadSQF = SquadBuilder.exportSQF(squad);
        const { squadGrid, squadSqfOutput, copySquadSqfBtn, copySquadSqfBtn2, squadCountBadge } = this.elements || {};
        if (squadCountBadge) {
            squadCountBadge.textContent = `${squad.template} (${squad.members.length} Operators) • ${squad.faction}`;
        }
        if (squadSqfOutput) {
            squadSqfOutput.textContent = this.currentSquadSQF;
        }
        if (copySquadSqfBtn) copySquadSqfBtn.disabled = false;
        if (copySquadSqfBtn2) copySquadSqfBtn2.disabled = false;
        if (!squadGrid) return;

        let html = '';
        squad.members.forEach((m, idx) => {
            const ld = m.loadout;
            const primaryClass = ld.primary ? ld.primary.class : 'None';
            const primaryMag = (ld.primary && ld.primary.mag && ld.primary.mag[0]) ? `${ld.primary.mag[0]} x${ld.primary.count || 6}` : '-';
            const handgunClass = ld.handgun && ld.handgun.class ? ld.handgun.class : 'None';
            const launcherClass = ld.launcher && ld.launcher.class ? ld.launcher.class : 'None';
            const vestClass = ld.clothing && ld.clothing.vest ? ld.clothing.vest : 'Standard';
            const factionBadge = 'badge-' + (squad.faction || 'nato').toLowerCase();

            html += `
                <div class="squad-member-card animate-in" data-member-index="${idx}">
                    <div class="squad-member-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="squad-member-idx">#${idx + 1}</span>
                            <span class="squad-member-role">${this.escapeHtml(m.role)}</span>
                        </div>
                        <span class="tag-badge ${factionBadge}">${this.escapeHtml(squad.faction)}</span>
                    </div>
                    <div class="squad-member-weapons">
                        <div class="squad-member-weapon-row">
                            <span class="label">Primary:</span>
                            <span class="val">${this.escapeHtml(primaryClass)}</span>
                        </div>
                        <div class="squad-member-weapon-row">
                            <span class="label">Ammo:</span>
                            <span class="val">${this.escapeHtml(primaryMag)}</span>
                        </div>
                        ${launcherClass !== 'None' ? `
                        <div class="squad-member-weapon-row">
                            <span class="label">Launcher:</span>
                            <span class="val">${this.escapeHtml(launcherClass)}</span>
                        </div>` : ''}
                        <div class="squad-member-weapon-row">
                            <span class="label">Sidearm:</span>
                            <span class="val">${this.escapeHtml(handgunClass)}</span>
                        </div>
                        <div class="squad-member-weapon-row">
                            <span class="label">Vest:</span>
                            <span class="val">${this.escapeHtml(vestClass)}</span>
                        </div>
                    </div>
                    <div class="squad-member-actions">
                        <button class="icon-btn" data-squad-action="inspect" data-idx="${idx}" style="flex: 1; font-size: 0.8rem; padding: 0.35rem 0.5rem;" title="Load into generator">Load Kit</button>
                        <button class="icon-btn" data-squad-action="copy-unit" data-idx="${idx}" style="font-size: 0.8rem; padding: 0.35rem 0.6rem;" title="Copy Unit SQF">⎘</button>
                    </div>
                </div>
            `;
        });
        squadGrid.innerHTML = html;
    }
    /**
     * Binds Comparison modal events.
     */
    static bindComparisonEvents() {
        const { compareLastBtn, comparisonCloseBtn, comparisonCloseFooterBtn, comparisonSwapBtn } = this.elements || {};
        if (compareLastBtn) {
            compareLastBtn.addEventListener('click', () => {
                if (this.previousLoadoutData && this.currentLoadoutData) {
                    this.openComparison(this.previousLoadoutData, this.currentLoadoutData, "Previous Roll", "Current Roll");
                }
            });
        }
        if (comparisonCloseBtn) {
            comparisonCloseBtn.addEventListener('click', () => this.closeComparison());
        }
        if (comparisonCloseFooterBtn) {
            comparisonCloseFooterBtn.addEventListener('click', () => this.closeComparison());
        }
        if (comparisonSwapBtn) {
            comparisonSwapBtn.addEventListener('click', () => {
                if (this.comparisonA && this.comparisonB) {
                    this.openComparison(this.comparisonB, this.comparisonA, this.compTitleB, this.compTitleA);
                }
            });
        }
    }
    /**
     * Opens the comparison modal comparing two loadouts.
     */
    static openComparison(loadoutA, loadoutB, titleA = "Loadout A", titleB = "Loadout B") {
        if (!loadoutA || !loadoutB) return;
        this.comparisonA = loadoutA;
        this.comparisonB = loadoutB;
        this.compTitleA = titleA;
        this.compTitleB = titleB;

        const {
            comparisonModal,
            compColAHeader,
            compColBHeader,
            comparisonMatchBadge,
            comparisonDiffBadge,
            comparisonDeltaBar,
            comparisonTableTbody
        } = this.elements || {};

        if (!comparisonModal) return;

        const diff = LoadoutComparator.diff(loadoutA, loadoutB);

        if (compColAHeader) compColAHeader.textContent = titleA;
        if (compColBHeader) compColBHeader.textContent = titleB;
        if (comparisonMatchBadge) comparisonMatchBadge.textContent = `${diff.matchCount} Matches`;
        if (comparisonDiffBadge) {
            comparisonDiffBadge.textContent = `${diff.diffCount} Differences`;
            comparisonDiffBadge.style.display = diff.diffCount === 0 ? 'none' : 'inline-block';
        }

        // Logistics delta bar
        if (comparisonDeltaBar) {
            const ld = diff.logisticsDelta;
            const weightDeltaSign = ld.deltaWeight > 0 ? `+${ld.deltaWeight}` : `${ld.deltaWeight}`;
            const weightClass = ld.deltaWeight <= 0 ? 'better' : 'worse';
            const roundsDeltaSign = ld.deltaRounds > 0 ? `+${ld.deltaRounds}` : `${ld.deltaRounds}`;
            const roundsClass = ld.deltaRounds >= 0 ? 'better' : 'worse';
            const sustainDeltaSign = ld.deltaSustain > 0 ? `+${ld.deltaSustain}` : `${ld.deltaSustain}`;
            const sustainClass = ld.deltaSustain >= 0 ? 'better' : 'worse';

            comparisonDeltaBar.innerHTML = `
                <div class="delta-stat">
                    <span class="delta-label">Carry Weight</span>
                    <div class="delta-values">${ld.weightA} kg vs ${ld.weightB} kg</div>
                    <span class="delta-badge ${weightClass}">${weightDeltaSign} kg (${ld.encumbranceB})</span>
                </div>
                <div class="delta-stat">
                    <span class="delta-label">Total Ammo</span>
                    <div class="delta-values">${ld.roundsA} vs ${ld.roundsB} rnds</div>
                    <span class="delta-badge ${roundsClass}">${roundsDeltaSign} rnds</span>
                </div>
                <div class="delta-stat">
                    <span class="delta-label">Sustained Fire</span>
                    <div class="delta-values">~${ld.sustainA} vs ~${ld.sustainB} min</div>
                    <span class="delta-badge ${sustainClass}">${sustainDeltaSign} min</span>
                </div>
            `;
        }

        // Comparison table
        if (comparisonTableTbody) {
            let html = '';
            diff.fields.forEach(f => {
                const rowClass = f.match ? 'comparison-row match' : 'comparison-row diff';
                const fieldLabel = `${f.category} › ${f.field}`;
                html += `
                    <tr class="${rowClass}">
                        <td><strong>${this.escapeHtml(fieldLabel)}</strong></td>
                        <td><code>${this.escapeHtml(f.valA || '-')}</code></td>
                        <td><code>${this.escapeHtml(f.valB || '-')}</code></td>
                    </tr>
                `;
            });
            comparisonTableTbody.innerHTML = html;
        }

        comparisonModal.style.display = 'flex';
    }
    /**
     * Closes the comparison modal.
     */
    static closeComparison() {
        const { comparisonModal } = this.elements || {};
        if (comparisonModal) comparisonModal.style.display = 'none';
    }
    /**
     * Binds Arsenal Import events.
     */
    static bindImportEvents() {
        const { importToggleBtn, importPanelBody, parseImportBtn, clearImportBtn, sqfImportArea, importStatus, importFeedback } = this.elements || {};
        if (importToggleBtn && importPanelBody) {
            importToggleBtn.addEventListener('click', () => {
                const isCollapsed = importPanelBody.classList.toggle('collapsed');
                importToggleBtn.textContent = isCollapsed ? 'Import Kit ▼' : 'Hide Import ▲';
            });
        }
        if (clearImportBtn && sqfImportArea) {
            clearImportBtn.addEventListener('click', () => {
                sqfImportArea.value = '';
                if (importStatus) {
                    importStatus.textContent = '';
                    importStatus.className = 'import-status';
                }
                if (importFeedback) {
                    importFeedback.innerHTML = '';
                    importFeedback.style.display = 'none';
                }
            });
        }
        if (parseImportBtn) {
            parseImportBtn.addEventListener('click', () => this.handleImportSQF());
        }
    }
    /**
     * Handles parsing of pasted SQF and loading it into the generator UI.
     */
    static handleImportSQF() {
        const { sqfImportArea, importStatus, importFeedback } = this.elements || {};
        if (!sqfImportArea) return;
        const raw = sqfImportArea.value.trim();
        if (!raw) {
            if (importStatus) {
                importStatus.textContent = 'Please paste an SQF loadout array first.';
                importStatus.className = 'import-status error';
            }
            return;
        }

        const result = SqfImporter.parse(raw);
        if (!result.success || !result.loadout) {
            if (importStatus) {
                importStatus.textContent = result.error || 'Failed to parse SQF.';
                importStatus.className = 'import-status error';
            }
            if (importFeedback) {
                importFeedback.style.display = 'none';
            }
            return;
        }

        // Restore into generator view
        this.restoreFromLoadout(result.loadout, raw);

        if (importStatus) {
            importStatus.textContent = `Kit loaded successfully! (${result.loadout.role}, ${result.loadout.faction})`;
            importStatus.className = 'import-status valid';
        }

        if (importFeedback) {
            if (result.warnings && result.warnings.length > 0) {
                importFeedback.innerHTML = `
                    <div class="import-feedback-box warning">
                        <strong>⚠️ Notice:</strong> ${result.warnings.map(w => this.escapeHtml(w)).join('; ')}
                    </div>
                `;
                importFeedback.style.display = 'block';
            } else {
                importFeedback.innerHTML = `
                    <div class="import-feedback-box success">
                        ✓ All weapon classnames recognized by WeaponRepository.
                    </div>
                `;
                importFeedback.style.display = 'block';
            }
        }
    }
}
// Cached DOM elements
UIController.elements = null;
UIController.currentSQF = "";
UIController.currentLoadoutData = null;
UIController.previousLoadoutData = null;
UIController.comparisonA = null;
UIController.comparisonB = null;
UIController.compTitleA = "";
UIController.compTitleB = "";
UIController.isBestLoadoutsRendered = false;
UIController.activeMetaFaction = "all";
UIController.activeMetaRole = "all";
UIController.activeMetaMod = "all";
UIController.isMetaEventsBound = false;
UIController.currentSquad = null;
UIController.currentSquadSQF = "";
UIController.isSquadBuilderRendered = false;
// ----------------------------------------------------------------------------
// 11. Loadout History & Favorites System
// ----------------------------------------------------------------------------
class LoadoutHistory {
    static STORAGE_KEY = "arma3_loadout_history";
    static MAX_ENTRIES = 50;

    /**
     * Saves a loadout to history. Auto-evicts oldest non-favorited entries when full.
     */
    static save(loadoutData, sqf) {
        const entries = this.getRaw();
        const entry = {
            id: this.generateId(),
            timestamp: Date.now(),
            loadout: loadoutData,
            sqf: sqf,
            isFavorite: false
        };
        entries.unshift(entry);
        // Evict oldest non-favorited entries if over cap
        while (entries.length > this.MAX_ENTRIES) {
            const lastNonFav = this.findLastNonFavoriteIndex(entries);
            if (lastNonFav === -1) break; // all are favorites, allow overflow
            entries.splice(lastNonFav, 1);
        }
        this.persist(entries);
        return entry;
    }

    /**
     * Returns all entries sorted: favorites first (by recency), then non-favorites by recency.
     */
    static getAll() {
        const entries = this.getRaw();
        const favs = entries.filter(e => e.isFavorite).sort((a, b) => b.timestamp - a.timestamp);
        const rest = entries.filter(e => !e.isFavorite).sort((a, b) => b.timestamp - a.timestamp);
        return [...favs, ...rest];
    }

    /**
     * Returns raw entries array from localStorage (unsorted).
     */
    static getRaw() {
        try {
            if (typeof localStorage === "undefined") return [];
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            console.warn("[LoadoutHistory] Failed to read history:", err);
            return [];
        }
    }

    /**
     * Toggles favorite status on an entry by ID.
     */
    static toggleFavorite(id) {
        const entries = this.getRaw();
        const entry = entries.find(e => e.id === id);
        if (entry) {
            entry.isFavorite = !entry.isFavorite;
            this.persist(entries);
            return entry.isFavorite;
        }
        return false;
    }

    /**
     * Deletes a single entry by ID.
     */
    static delete(id) {
        const entries = this.getRaw();
        const filtered = entries.filter(e => e.id !== id);
        this.persist(filtered);
        return filtered.length < entries.length;
    }

    /**
     * Clears all non-favorited entries.
     */
    static clear() {
        const entries = this.getRaw();
        const favoritesOnly = entries.filter(e => e.isFavorite);
        this.persist(favoritesOnly);
        return entries.length - favoritesOnly.length;
    }

    /**
     * Exports full history as a JSON string.
     */
    static export() {
        return JSON.stringify(this.getAll(), null, 2);
    }

    /**
     * Returns the total count of entries.
     */
    static count() {
        return this.getRaw().length;
    }

    /**
     * Generates a short unique ID for history entries.
     */
    static generateId() {
        return "h_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 7);
    }

    /**
     * Finds index of the last non-favorited entry (for FIFO eviction).
     */
    static findLastNonFavoriteIndex(entries) {
        for (let i = entries.length - 1; i >= 0; i--) {
            if (!entries[i].isFavorite) return i;
        }
        return -1;
    }

    /**
     * Persists entries array to localStorage.
     */
    static persist(entries) {
        try {
            if (typeof localStorage !== "undefined") {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
            }
        } catch (err) {
            console.warn("[LoadoutHistory] Failed to persist history:", err);
        }
    }
}
// ----------------------------------------------------------------------------
// 12. Weight & Logistics Calculator
// ----------------------------------------------------------------------------

/**
 * Weight-per-round in grams, keyed by caliber string.
 * Derived from Arma 3 CfgWeapons approximate real-world equivalents.
 */
const WEIGHT_TABLE = Object.freeze({
    roundWeight: {
        "5.56x45": 12.3,
        "5.45x39": 10.7,
        "7.62x39": 16.3,
        "7.62x51": 25.4,
        "7.62x54": 25.9,
        "6.5x39": 15.1,
        "5.8x42": 12.8,
        "9x21": 8.0,
        ".45ACP": 14.9,
        "4.6x30": 6.5,
        ".300WM": 29.5,
        ".338": 39.7,
        "9.3x64": 37.0,
        ".408": 52.9,
        "12.7x108": 133.5,
        ".50BMG": 115.0,
        "12Gauge": 42.0,
        "Rocket": 2500.0
    },
    /**
     * Base weapon weight in kg, keyed by optic profile as a fallback heuristic.
     * Individual weapons can override via their caliber/category.
     */
    baseWeaponWeight: {
        "cqb": 2.8,
        "mid": 3.6,
        "long": 5.2
    },
    /** Magazine housing weight in grams (average polymer/steel mag body) */
    magHousingWeight: 110,
    /** Gear weight estimates in kg */
    gearWeight: {
        uniform: 1.2,
        vest: 3.8,
        backpack: 2.1,
        headgear: 0.8,
        facewear: 0.15,
        nvg: 0.6,
        binocular: 0.4,
        grenade: 0.4,
        smoke: 0.3
    },
    /** Handgun base weight in kg */
    handgunWeight: 0.9,
    /** Launcher base weight in kg */
    launcherWeight: 6.5,
    /** Launcher rocket weight in kg */
    launcherRocketWeight: 2.5
});

class LogisticsCalculator {
    /**
     * Analyzes a loadout and returns comprehensive weight and logistics data.
     * @param {object} loadout - A LoadoutData object from the generator.
     * @returns {{ totalWeightKg: number, primaryWeight: number, ammoWeight: number, gearWeight: number, totalRounds: number, estimatedBursts: number, sustainabilityMinutes: number, encumbranceLevel: string, breakdown: object }}
     */
    static analyze(loadout) {
        if (!loadout) return this.emptyResult();

        const primary = loadout.primary || {};
        const handgun = loadout.handgun || {};
        const launcher = loadout.launcher || {};
        const clothing = loadout.clothing || {};
        const items = loadout.items || {};
        const meta = loadout.meta || {};

        // --- Primary weapon weight ---
        const primaryCaliber = meta.caliber || "5.56x45";
        const primaryOptic = primary.optic || "";
        const weaponDef = primary.class ? WeaponRepository.getById(primary.class) : null;
        const weaponOpticProfile = weaponDef ? weaponDef.opticType : "mid";
        const baseWeapon = WEIGHT_TABLE.baseWeaponWeight[weaponOpticProfile] || 3.6;

        // Optic adds ~0.3-0.6kg
        const opticWeight = primaryOptic ? (weaponOpticProfile === "long" ? 0.6 : 0.35) : 0;
        // Suppressor adds ~0.4kg
        const muzzleWeight = primary.muzzle ? 0.4 : 0;
        // Bipod adds ~0.35kg
        const bipodWeight = primary.bipod ? 0.35 : 0;
        // Pointer/laser adds ~0.1kg
        const pointerWeight = primary.pointer ? 0.1 : 0;

        const primaryWeaponTotal = baseWeapon + opticWeight + muzzleWeight + bipodWeight + pointerWeight;

        // --- Primary ammo weight ---
        const magCount = primary.count || 6;
        const magCapacity = (primary.mag && primary.mag[1]) ? primary.mag[1] : 30;
        const roundWeightG = WEIGHT_TABLE.roundWeight[primaryCaliber] || 15.0;
        const primaryRounds = magCount * magCapacity;
        const primaryAmmoKg = ((primaryRounds * roundWeightG) + (magCount * WEIGHT_TABLE.magHousingWeight)) / 1000;

        // --- Handgun weight ---
        const handgunWeaponKg = handgun.class ? WEIGHT_TABLE.handgunWeight : 0;
        const handgunMagCount = handgun.count || 3;
        const handgunMagCap = (handgun.mag && handgun.mag[1]) ? handgun.mag[1] : 16;
        const handgunCaliber = "9x21"; // Most sidearms are 9mm
        const handgunRoundG = WEIGHT_TABLE.roundWeight[handgunCaliber] || 8.0;
        const handgunRounds = handgun.class ? handgunMagCount * handgunMagCap : 0;
        const handgunAmmoKg = handgun.class ? ((handgunRounds * handgunRoundG) + (handgunMagCount * WEIGHT_TABLE.magHousingWeight)) / 1000 : 0;
        const handgunMuzzleKg = handgun.muzzle ? 0.25 : 0;

        // --- Launcher weight ---
        const launcherKg = launcher.class ? WEIGHT_TABLE.launcherWeight : 0;
        const launcherAmmoKg = launcher.class ? WEIGHT_TABLE.launcherRocketWeight : 0;

        // --- Gear weight ---
        const gw = WEIGHT_TABLE.gearWeight;
        const uniformKg = clothing.uniform ? gw.uniform : 0;
        const vestKg = clothing.vest ? gw.vest : 0;
        const backpackKg = clothing.backpack ? gw.backpack : 0;
        const headgearKg = clothing.headgear ? gw.headgear : 0;
        const facewearKg = clothing.facewear ? gw.facewear : 0;
        const nvgKg = items.nvg ? gw.nvg : 0;
        const binocularKg = items.binocular ? gw.binocular : 0;
        const grenadeKg = (items.grenadeCount || 0) * gw.grenade;
        const smokeKg = (items.smokeCount || 0) * gw.smoke;
        const totalGearKg = uniformKg + vestKg + backpackKg + headgearKg + facewearKg + nvgKg + binocularKg + grenadeKg + smokeKg;

        // --- Totals ---
        const totalAmmoKg = primaryAmmoKg + handgunAmmoKg + launcherAmmoKg;
        const totalWeaponKg = primaryWeaponTotal + handgunWeaponKg + handgunMuzzleKg + launcherKg;
        const totalWeightKg = totalWeaponKg + totalAmmoKg + totalGearKg;
        const totalRounds = primaryRounds + handgunRounds;

        // --- Sustainability estimate ---
        // Assume ~3 round bursts, 2 bursts/minute sustained engagement
        const estimatedBursts = Math.floor(primaryRounds / 3);
        const sustainabilityMinutes = Math.round(estimatedBursts / 2);

        // --- Encumbrance level ---
        const encumbranceLevel = this.getEncumbranceLevel(totalWeightKg);

        return {
            totalWeightKg: Math.round(totalWeightKg * 100) / 100,
            primaryWeight: Math.round(primaryWeaponTotal * 100) / 100,
            ammoWeight: Math.round(totalAmmoKg * 100) / 100,
            gearWeight: Math.round(totalGearKg * 100) / 100,
            weaponWeight: Math.round(totalWeaponKg * 100) / 100,
            totalRounds,
            estimatedBursts,
            sustainabilityMinutes,
            encumbranceLevel,
            breakdown: {
                primaryWeapon: Math.round(primaryWeaponTotal * 100) / 100,
                primaryAmmo: Math.round(primaryAmmoKg * 100) / 100,
                handgun: Math.round((handgunWeaponKg + handgunMuzzleKg) * 100) / 100,
                handgunAmmo: Math.round(handgunAmmoKg * 100) / 100,
                launcher: Math.round(launcherKg * 100) / 100,
                launcherAmmo: Math.round(launcherAmmoKg * 100) / 100,
                gear: Math.round(totalGearKg * 100) / 100
            }
        };
    }

    /**
     * Returns encumbrance level string based on Arma 3 stamina thresholds.
     */
    static getEncumbranceLevel(weightKg) {
        if (weightKg < 25) return "Light";
        if (weightKg < 35) return "Medium";
        if (weightKg < 45) return "Heavy";
        return "Overloaded";
    }

    /**
     * Returns a zeroed result for empty/null loadouts.
     */
    static emptyResult() {
        return {
            totalWeightKg: 0, primaryWeight: 0, ammoWeight: 0, gearWeight: 0, weaponWeight: 0,
            totalRounds: 0, estimatedBursts: 0, sustainabilityMinutes: 0,
            encumbranceLevel: "Light",
            breakdown: { primaryWeapon: 0, primaryAmmo: 0, handgun: 0, handgunAmmo: 0, launcher: 0, launcherAmmo: 0, gear: 0 }
        };
    }
}
// ----------------------------------------------------------------------------
// 13. Shareable Loadout Links (URL Hash Encoding)
// ----------------------------------------------------------------------------

class LoadoutShareCodec {
    /** Minified key map for compact URL encoding */
    static KEY_MAP = {
        faction: 'f', role: 'r',
        'primary.class': 'pc', 'primary.optic': 'po', 'primary.pointer': 'pp',
        'primary.bipod': 'pb', 'primary.muzzle': 'pm', 'primary.mag': 'pg', 'primary.count': 'pn',
        'handgun.class': 'hc', 'handgun.muzzle': 'hm', 'handgun.mag': 'hg', 'handgun.count': 'hn',
        'launcher.class': 'lc', 'launcher.mag': 'lg',
        'clothing.uniform': 'cu', 'clothing.vest': 'cv', 'clothing.backpack': 'ck',
        'clothing.headgear': 'ch', 'clothing.facewear': 'cf',
        'items.nvg': 'in', 'items.binocular': 'ib',
        'items.grenadeChoice': 'ig', 'items.grenadeCount': 'igc',
        'items.smokeChoice': 'is', 'items.smokeCount': 'isc',
        'meta.chaosLevel': 'mc', 'meta.primaryMod': 'mp', 'meta.caliber': 'mb'
    };

    /**
     * Encodes a LoadoutData object into a compact Base64url string.
     */
    static encode(loadout) {
        if (!loadout) return '';
        const mini = {};
        const km = this.KEY_MAP;
        // Flatten loadout into minified keys
        mini[km.faction] = loadout.faction || '';
        mini[km.role] = loadout.role || '';
        // Primary
        const p = loadout.primary || {};
        mini[km['primary.class']] = p.class || '';
        mini[km['primary.optic']] = p.optic || '';
        mini[km['primary.pointer']] = p.pointer || '';
        mini[km['primary.bipod']] = p.bipod || '';
        mini[km['primary.muzzle']] = p.muzzle || '';
        mini[km['primary.mag']] = p.mag || ['', 0];
        mini[km['primary.count']] = p.count || 6;
        // Handgun
        const h = loadout.handgun || {};
        mini[km['handgun.class']] = h.class || '';
        mini[km['handgun.muzzle']] = h.muzzle || '';
        mini[km['handgun.mag']] = h.mag || ['', 0];
        mini[km['handgun.count']] = h.count || 3;
        // Launcher
        const l = loadout.launcher || {};
        mini[km['launcher.class']] = l.class || '';
        mini[km['launcher.mag']] = l.mag || ['', 0];
        // Clothing
        const c = loadout.clothing || {};
        mini[km['clothing.uniform']] = c.uniform || '';
        mini[km['clothing.vest']] = c.vest || '';
        mini[km['clothing.backpack']] = c.backpack || '';
        mini[km['clothing.headgear']] = c.headgear || '';
        mini[km['clothing.facewear']] = c.facewear || '';
        // Items
        const it = loadout.items || {};
        mini[km['items.nvg']] = it.nvg || '';
        mini[km['items.binocular']] = it.binocular || '';
        mini[km['items.grenadeChoice']] = it.grenadeChoice || '';
        mini[km['items.grenadeCount']] = it.grenadeCount || 0;
        mini[km['items.smokeChoice']] = it.smokeChoice || '';
        mini[km['items.smokeCount']] = it.smokeCount || 0;
        // Meta
        const m = loadout.meta || {};
        mini[km['meta.chaosLevel']] = m.chaosLevel || 1;
        mini[km['meta.primaryMod']] = m.primaryMod || '';
        mini[km['meta.caliber']] = m.caliber || '';

        // Strip empty values to minimize size
        const stripped = {};
        for (const [k, v] of Object.entries(mini)) {
            if (v !== '' && v !== 0 && !(Array.isArray(v) && v[0] === '' && v[1] === 0)) {
                stripped[k] = v;
            }
        }

        const jsonStr = JSON.stringify(stripped);
        // Base64url encoding (UTF-8 safe for both browser and Node environments)
        const btoaFn = typeof btoa === 'function' ? (s) => btoa(unescape(encodeURIComponent(s))) : (s) => Buffer.from(s, 'utf8').toString('base64');
        const b64 = btoaFn(jsonStr);
        // Convert to URL-safe Base64 (replace +, /, =)
        return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    /**
     * Decodes a Base64url hash string back into a LoadoutData object.
     * Returns null if decoding fails or data is invalid.
     */
    static decode(hash) {
        if (!hash || typeof hash !== 'string') return null;
        try {
            // Restore standard Base64 from URL-safe variant
            let b64 = hash.replace(/-/g, '+').replace(/_/g, '/');
            // Add back padding
            while (b64.length % 4 !== 0) b64 += '=';
            const atobFn = typeof atob === 'function' ? (s) => decodeURIComponent(escape(atob(s))) : (s) => Buffer.from(s, 'base64').toString('utf8');
            const jsonStr = atobFn(b64);
            const mini = JSON.parse(jsonStr);
            if (typeof mini !== 'object' || mini === null) return null;

            const km = this.KEY_MAP;
            return {
                faction: mini[km.faction] || 'NATO',
                role: mini[km.role] || 'Rifleman',
                primary: {
                    class: mini[km['primary.class']] || '',
                    optic: mini[km['primary.optic']] || '',
                    pointer: mini[km['primary.pointer']] || '',
                    bipod: mini[km['primary.bipod']] || '',
                    muzzle: mini[km['primary.muzzle']] || '',
                    mag: mini[km['primary.mag']] || ['', 0],
                    count: mini[km['primary.count']] || 6
                },
                handgun: {
                    class: mini[km['handgun.class']] || '',
                    muzzle: mini[km['handgun.muzzle']] || '',
                    mag: mini[km['handgun.mag']] || ['', 0],
                    count: mini[km['handgun.count']] || 3
                },
                launcher: {
                    class: mini[km['launcher.class']] || '',
                    mag: mini[km['launcher.mag']] || ['', 0]
                },
                clothing: {
                    uniform: mini[km['clothing.uniform']] || '',
                    vest: mini[km['clothing.vest']] || '',
                    backpack: mini[km['clothing.backpack']] || '',
                    headgear: mini[km['clothing.headgear']] || '',
                    facewear: mini[km['clothing.facewear']] || ''
                },
                items: {
                    nvg: mini[km['items.nvg']] || '',
                    binocular: mini[km['items.binocular']] || '',
                    grenadeChoice: mini[km['items.grenadeChoice']] || '',
                    grenadeCount: mini[km['items.grenadeCount']] || 0,
                    smokeChoice: mini[km['items.smokeChoice']] || '',
                    smokeCount: mini[km['items.smokeCount']] || 0,
                    linked: []
                },
                meta: {
                    chaosLevel: mini[km['meta.chaosLevel']] || 1,
                    primaryMod: mini[km['meta.primaryMod']] || '',
                    caliber: mini[km['meta.caliber']] || ''
                }
            };
        } catch (err) {
            console.warn('[LoadoutShareCodec] Failed to decode hash:', err);
            return null;
        }
    }

    /**
     * Generates a full shareable URL with the encoded loadout as a hash.
     */
    static generateShareUrl(loadout) {
        const encoded = this.encode(loadout);
        if (!encoded) return '';
        const baseUrl = (typeof window !== 'undefined' && window.location)
            ? (window.location.origin || '') + (window.location.pathname || '')
            : '';
        return baseUrl + '#loadout=' + encoded;
    }
}
// ----------------------------------------------------------------------------
// 14. Bulk Export & Squad Builder
// ----------------------------------------------------------------------------

const FIRETEAM_TEMPLATES = Object.freeze({
    "4-Man Fireteam": ["Rifleman", "Rifleman", "Medic", "Machine Gunner"],
    "6-Man SOF": ["Pointman", "Rifleman", "Rifleman", "Marksman", "Medic", "Machine Gunner"],
    "8-Man Section": ["Pointman", "Rifleman", "Rifleman", "Rifleman", "Medic", "Machine Gunner", "Marksman", "Anti-Tank"],
    "Sniper Team": ["Sniper", "Rifleman"]
});

class SquadBuilder {
    static FIRETEAM_TEMPLATES = FIRETEAM_TEMPLATES;

    /**
     * Returns array of available template names.
     */
    static getTemplates() {
        return Object.keys(FIRETEAM_TEMPLATES);
    }

    /**
     * Returns array of role names for a given template name.
     */
    static getTemplateRoles(templateName) {
        return FIRETEAM_TEMPLATES[templateName] ? [...FIRETEAM_TEMPLATES[templateName]] : ["Rifleman", "Medic"];
    }

    /**
     * Generates loadouts for an entire squad based on a template or explicit roles list.
     * @param {object} options
     * @param {string} [options.template="4-Man Fireteam"]
     * @param {string} [options.faction="NATO"]
     * @param {Set<string>} [options.activeMods]
     * @param {number} [options.chaosLevel=1]
     * @param {string[]} [options.roles]
     * @returns {{ template: string, faction: string, chaosLevel: number, members: Array<{ index: number, role: string, loadout: object, sqf: string }> }}
     */
    static generate(options = {}) {
        const template = options.template || "4-Man Fireteam";
        const faction = options.faction || "NATO";
        const chaosLevel = options.chaosLevel || 1;
        const activeMods = options.activeMods || new Set(["Vanilla"]);
        const roles = Array.isArray(options.roles) && options.roles.length > 0
            ? options.roles
            : this.getTemplateRoles(template);

        const members = roles.map((role, idx) => {
            const { loadoutData, sqf } = LoadoutEngine.generate({
                faction,
                role,
                chaosLevel,
                activeMods
            });
            return {
                index: idx,
                role,
                loadout: loadoutData,
                sqf
            };
        });

        return {
            template,
            faction,
            chaosLevel,
            members
        };
    }

    /**
     * Exports a squad into a unified bulk SQF script with unit assignments.
     * @param {object|Array} squadOrMembers - Squad object from generate() or array of members.
     * @param {object} [options={}]
     * @param {string} [options.unitPrefix='_unit']
     * @returns {string} Combined SQF script
     */
    static exportSQF(squadOrMembers, options = {}) {
        const unitPrefix = options.unitPrefix || '_unit';
        let members = [];
        let templateName = 'Custom Squad';
        let faction = 'NATO';

        if (Array.isArray(squadOrMembers)) {
            members = squadOrMembers;
        } else if (squadOrMembers && typeof squadOrMembers === 'object') {
            members = squadOrMembers.members || [];
            templateName = squadOrMembers.template || templateName;
            faction = squadOrMembers.faction || faction;
        }

        if (members.length === 0) return '// Empty squad — no units generated';

        let out = `// ============================================================================\n`;
        out += `// Arma 3 Squad Loadout Export\n`;
        out += `// Template: ${templateName} | Faction: ${faction} | Strength: ${members.length} operators\n`;
        out += `// Generated by Arma 3 Random Loadout Engine\n`;
        out += `// ============================================================================\n\n`;

        members.forEach((m, idx) => {
            const varName = `${unitPrefix}${idx}`;
            const role = m.role || (m.loadout ? m.loadout.role : 'Operator');
            const primaryClass = (m.loadout && m.loadout.primary) ? m.loadout.primary.class : 'Default';
            let rawSqf = m.sqf || '';
            if (rawSqf.startsWith('player setUnitLoadout ')) {
                rawSqf = rawSqf.replace(/^player setUnitLoadout\s*/, '');
            }
            if (rawSqf.endsWith(';')) {
                rawSqf = rawSqf.slice(0, -1);
            }
            rawSqf = rawSqf.trim();

            out += `// [Unit ${idx}] ${role} (${primaryClass})\n`;
            out += `${varName} setUnitLoadout ${rawSqf};\n\n`;
        });

        return out.trim();
    }
}
// ----------------------------------------------------------------------------
// 15. Loadout Comparison Mode
// ----------------------------------------------------------------------------

class LoadoutComparator {
    static emptyDiff() {
        return {
            matchCount: 0,
            diffCount: 0,
            logisticsDelta: {
                deltaWeight: 0,
                weightA: 0,
                weightB: 0,
                encumbranceB: 'Light',
                deltaRounds: 0,
                roundsA: 0,
                roundsB: 0,
                deltaSustain: 0,
                sustainA: 0,
                sustainB: 0
            },
            fields: []
        };
    }

    /**
     * Compares two LoadoutData objects and computes differences and logistics deltas.
     * @param {object} a - Base loadout
     * @param {object} b - Comparison loadout
     * @returns {{ matchCount: number, diffCount: number, logisticsDelta: object, fields: Array<{ category: string, field: string, valA: string, valB: string, match: boolean }> }}
     */
    static diff(a, b) {
        if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
            return this.emptyDiff();
        }

        const safeGet = (obj, path) => {
            const parts = path.split('.');
            let curr = obj;
            for (const p of parts) {
                if (!curr || typeof curr !== 'object') return '';
                curr = curr[p];
            }
            if (Array.isArray(curr)) return curr[0] || '';
            return curr !== undefined && curr !== null ? String(curr) : '';
        };

        const fieldSpecs = [
            { category: 'General', field: 'Faction', path: 'faction' },
            { category: 'General', field: 'Role', path: 'role' },
            { category: 'Primary Weapon', field: 'Classname', path: 'primary.class' },
            { category: 'Primary Weapon', field: 'Optic', path: 'primary.optic' },
            { category: 'Primary Weapon', field: 'Pointer / Rail', path: 'primary.pointer' },
            { category: 'Primary Weapon', field: 'Bipod', path: 'primary.bipod' },
            { category: 'Primary Weapon', field: 'Muzzle Device', path: 'primary.muzzle' },
            { category: 'Primary Weapon', field: 'Magazine Type', path: 'primary.mag' },
            { category: 'Primary Weapon', field: 'Magazine Count', path: 'primary.count' },
            { category: 'Launcher', field: 'Classname', path: 'launcher.class' },
            { category: 'Launcher', field: 'Rocket Type', path: 'launcher.mag' },
            { category: 'Sidearm', field: 'Classname', path: 'handgun.class' },
            { category: 'Sidearm', field: 'Muzzle Device', path: 'handgun.muzzle' },
            { category: 'Clothing', field: 'Uniform', path: 'clothing.uniform' },
            { category: 'Clothing', field: 'Tactical Vest', path: 'clothing.vest' },
            { category: 'Clothing', field: 'Backpack', path: 'clothing.backpack' },
            { category: 'Clothing', field: 'Headgear / Helmet', path: 'clothing.headgear' },
            { category: 'Clothing', field: 'Facewear / Goggles', path: 'clothing.facewear' },
            { category: 'Equipment', field: 'Night Vision Device', path: 'items.nvg' },
            { category: 'Equipment', field: 'Binoculars / Rangefinder', path: 'items.binocular' },
            { category: 'Equipment', field: 'Frag Grenades', path: 'items.grenadeCount' },
            { category: 'Equipment', field: 'Smoke Grenades', path: 'items.smokeCount' },
            { category: 'Meta', field: 'Chaos Level', path: 'meta.chaosLevel' },
            { category: 'Meta', field: 'Weapon Caliber', path: 'meta.caliber' }
        ];

        let matchCount = 0;
        let diffCount = 0;

        const fields = fieldSpecs.map(spec => {
            const valA = safeGet(a, spec.path);
            const valB = safeGet(b, spec.path);
            const match = (valA === valB);
            if (match) matchCount++;
            else diffCount++;
            return {
                category: spec.category,
                field: spec.field,
                valA: valA || 'None',
                valB: valB || 'None',
                match
            };
        });

        // Compute logistics delta
        let logisticsDelta = {
            deltaWeight: 0,
            weightA: 0,
            weightB: 0,
            encumbranceB: 'Light',
            deltaRounds: 0,
            roundsA: 0,
            roundsB: 0,
            deltaSustain: 0,
            sustainA: 0,
            sustainB: 0
        };

        if (typeof LogisticsCalculator !== 'undefined' && typeof LogisticsCalculator.analyze === 'function') {
            const logA = LogisticsCalculator.analyze(a);
            const logB = LogisticsCalculator.analyze(b);
            logisticsDelta = {
                deltaWeight: Math.round((logB.totalWeightKg - logA.totalWeightKg) * 100) / 100,
                weightA: logA.totalWeightKg,
                weightB: logB.totalWeightKg,
                encumbranceB: logB.encumbranceLevel,
                deltaRounds: logB.totalRounds - logA.totalRounds,
                roundsA: logA.totalRounds,
                roundsB: logB.totalRounds,
                deltaSustain: logB.sustainabilityMinutes - logA.sustainabilityMinutes,
                sustainA: logA.sustainabilityMinutes,
                sustainB: logB.sustainabilityMinutes
            };
        }

        return {
            matchCount,
            diffCount,
            logisticsDelta,
            fields
        };
    }
}

// ----------------------------------------------------------------------------
// 16. Arsenal Import Parser (Reverse-Parse SQF)
// ----------------------------------------------------------------------------

class SqfImporter {
    /**
     * Parses an SQF loadout string into a standard LoadoutData object.
     * Handles both `player setUnitLoadout [...]` and raw `[...]` arrays.
     * @param {string} sqfString
     * @returns {{ success: boolean, loadout: object|null, error?: string, warnings: string[], recognizedWeapons: string[], unrecognizedWeapons: string[] }}
     */
    static parse(sqfString) {
        if (!sqfString || typeof sqfString !== 'string') {
            return {
                success: false,
                loadout: null,
                error: 'Input is empty or not a string',
                warnings: [],
                recognizedWeapons: [],
                unrecognizedWeapons: []
            };
        }

        let cleanStr = sqfString.trim();
        // Remove single line comments // ...
        cleanStr = cleanStr.replace(/\/\/.*$/gm, '');
        // Remove multi-line comments /* ... */
        cleanStr = cleanStr.replace(/\/\*[\s\S]*?\*\//g, '');
        cleanStr = cleanStr.trim();

        // Match array brackets [...]
        const firstBracket = cleanStr.indexOf('[');
        const lastBracket = cleanStr.lastIndexOf(']');
        if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
            return {
                success: false,
                loadout: null,
                error: 'Could not find a valid SQF array [...] in the input',
                warnings: [],
                recognizedWeapons: [],
                unrecognizedWeapons: []
            };
        }

        const arrayText = cleanStr.substring(firstBracket, lastBracket + 1);

        let rawArr;
        try {
            // Replace single quotes with double quotes and remove trailing commas
            const jsonCandidate = arrayText
                .replace(/'([^']*)'/g, '"$1"')
                .replace(/,\s*]/g, ']');
            rawArr = JSON.parse(jsonCandidate);
        } catch (err) {
            return {
                success: false,
                loadout: null,
                error: 'Syntax error parsing SQF array: ' + err.message,
                warnings: [],
                recognizedWeapons: [],
                unrecognizedWeapons: []
            };
        }

        if (!Array.isArray(rawArr) || rawArr.length < 7) {
            return {
                success: false,
                loadout: null,
                error: 'SQF array is incomplete (expected at least 7 loadout slots)',
                warnings: [],
                recognizedWeapons: [],
                unrecognizedWeapons: []
            };
        }

        const warnings = [];
        const recognizedWeapons = [];
        const unrecognizedWeapons = [];

        const checkWeapon = (cls) => {
            if (!cls || cls === '') return;
            if (typeof WeaponRepository !== 'undefined' && WeaponRepository.getById(cls)) {
                recognizedWeapons.push(cls);
            } else {
                unrecognizedWeapons.push(cls);
                warnings.push(`Unrecognized weapon classname: "${cls}"`);
            }
        };

        // 0: Primary [weapon, muzzle, pointer, optic, [mag, ammo], [secondaryMag, ammo], bipod]
        const pArr = Array.isArray(rawArr[0]) ? rawArr[0] : [];
        const primaryClass = pArr[0] || '';
        const primaryMuzzle = pArr[1] || '';
        const primaryPointer = pArr[2] || '';
        const primaryOptic = pArr[3] || '';
        const primaryMag = Array.isArray(pArr[4]) ? [pArr[4][0] || '', Number(pArr[4][1]) || 0] : ['', 0];
        const primaryBipod = pArr[6] || '';
        checkWeapon(primaryClass);

        // Count primary ammo from containers
        let primaryAmmoCount = 0;
        const countMagsInContainer = (cont) => {
            if (Array.isArray(cont) && Array.isArray(cont[1])) {
                for (const it of cont[1]) {
                    if (Array.isArray(it) && it[0] === primaryMag[0]) {
                        primaryAmmoCount += Number(it[1]) || 1;
                    }
                }
            }
        };

        // 1: Secondary (Launcher) [weapon, muzzle, pointer, optic, [mag, ammo], [], bipod]
        const sArr = Array.isArray(rawArr[1]) ? rawArr[1] : [];
        const launcherClass = sArr[0] || '';
        const launcherMag = Array.isArray(sArr[4]) ? [sArr[4][0] || '', Number(sArr[4][1]) || 0] : ['', 0];
        checkWeapon(launcherClass);

        // 2: Handgun [weapon, muzzle, pointer, optic, [mag, ammo], [], bipod]
        const hArr = Array.isArray(rawArr[2]) ? rawArr[2] : [];
        const handgunClass = hArr[0] || '';
        const handgunMuzzle = hArr[1] || '';
        const handgunMag = Array.isArray(hArr[4]) ? [hArr[4][0] || '', Number(hArr[4][1]) || 0] : ['', 0];
        checkWeapon(handgunClass);

        // 3: Uniform [uniformClass, [...items]]
        const uArr = Array.isArray(rawArr[3]) ? rawArr[3] : [];
        const uniform = uArr[0] || '';
        countMagsInContainer(uArr);

        // 4: Vest [vestClass, [...items]]
        const vArr = Array.isArray(rawArr[4]) ? rawArr[4] : [];
        const vest = vArr[0] || '';
        countMagsInContainer(vArr);

        // 5: Backpack [backpackClass, [...items]]
        const bArr = Array.isArray(rawArr[5]) ? rawArr[5] : [];
        const backpack = bArr[0] || '';
        countMagsInContainer(bArr);

        // 6: Headgear (string)
        const headgear = typeof rawArr[6] === 'string' ? rawArr[6] : (Array.isArray(rawArr[6]) ? rawArr[6][0] || '' : '');

        // 7: Facewear (string)
        const facewear = typeof rawArr[7] === 'string' ? rawArr[7] : (Array.isArray(rawArr[7]) ? rawArr[7][0] || '' : '');

        // 8: Binocular [binocClass, ...]
        let binocular = '';
        if (typeof rawArr[8] === 'string') {
            binocular = rawArr[8];
        } else if (Array.isArray(rawArr[8])) {
            binocular = rawArr[8][0] || '';
        }

        // 9: Assigned items [map, terminal, radio, compass, watch, nvg]
        let nvg = '';
        if (Array.isArray(rawArr[9])) {
            nvg = rawArr[9][5] || '';
        }

        // Infer primary count (if loaded in gun, +1)
        const primaryCount = Math.max(1, primaryAmmoCount + (primaryMag[0] ? 1 : 0));

        // Infer caliber & mod from weapon repository if recognized
        let caliber = '5.56x45';
        let primaryMod = 'Vanilla';
        let inferredFaction = 'NATO';
        let inferredRole = 'Rifleman';

        if (primaryClass && typeof WeaponRepository !== 'undefined') {
            const weaponDef = WeaponRepository.getById(primaryClass);
            if (weaponDef) {
                caliber = weaponDef.caliber || caliber;
                primaryMod = weaponDef.mod || primaryMod;
                if (weaponDef.factions && weaponDef.factions.length > 0) {
                    inferredFaction = weaponDef.factions[0];
                }
                if (weaponDef.roles && weaponDef.roles.length > 0) {
                    inferredRole = weaponDef.roles[0];
                }
            }
        }
        if (launcherClass) {
            inferredRole = 'Anti-Tank';
        }

        const loadout = {
            faction: inferredFaction,
            role: inferredRole,
            primary: {
                class: primaryClass,
                optic: primaryOptic,
                pointer: primaryPointer,
                bipod: primaryBipod,
                muzzle: primaryMuzzle,
                mag: primaryMag,
                count: primaryCount
            },
            handgun: {
                class: handgunClass,
                muzzle: handgunMuzzle,
                mag: handgunMag,
                count: 3
            },
            launcher: {
                class: launcherClass,
                mag: launcherMag
            },
            clothing: {
                uniform,
                vest,
                backpack,
                headgear,
                facewear
            },
            items: {
                nvg,
                binocular,
                grenadeChoice: 'HandGrenade',
                grenadeCount: 2,
                smokeChoice: 'SmokeShell',
                smokeCount: 2,
                linked: Array.isArray(rawArr[9]) ? rawArr[9] : []
            },
            meta: {
                chaosLevel: 1,
                primaryMod,
                caliber
            }
        };

        return {
            success: true,
            loadout,
            warnings,
            recognizedWeapons,
            unrecognizedWeapons
        };
    }
}

// ----------------------------------------------------------------------------
// 17. Keyboard Shortcuts Controller
// ----------------------------------------------------------------------------

class KeyboardController {
    static SHORTCUTS = Object.freeze([
        { key: 'R', description: 'Roll / Generate new loadout' },
        { key: 'Ctrl+Shift+C', description: 'Copy current loadout SQF to clipboard' },
        { key: '1 - 5', description: 'Switch navigation tabs' },
        { key: '/', description: 'Focus armory search bar' },
        { key: 'F', description: 'Toggle favorite on current loadout' },
        { key: '?', description: 'Toggle keyboard shortcuts help modal' },
        { key: 'Escape', description: 'Close any open modal' }
    ]);

    /**
     * Checks if the active event target is an interactive input element.
     */
    static isInputFocused(event) {
        if (!event || !event.target) return false;
        const target = event.target;
        const tagName = target.tagName ? target.tagName.toUpperCase() : '';
        return (
            tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            tagName === 'SELECT' ||
            Boolean(target.isContentEditable)
        );
    }

    /**
     * Handles global keydown events.
     */
    static handleKeyDown(event) {
        if (!event) return;

        // Escape always closes open modals, even if focused inside an input
        if (event.key === 'Escape') {
            this.closeAllModals();
            return;
        }

        // Ignore hotkeys while user is typing in forms/inputs
        if (this.isInputFocused(event)) {
            return;
        }

        // Toggle shortcuts modal: ? or Shift+/
        if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
            event.preventDefault();
            this.toggleShortcutsModal();
            return;
        }

        // Copy SQF: Ctrl + Shift + C
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'C' || event.key === 'c')) {
            event.preventDefault();
            if (typeof UIController !== 'undefined' && UIController.currentSQF) {
                const copyBtn = UIController.elements?.copyBtn;
                UIController.copyToClipboard(UIController.currentSQF, copyBtn, 'Copied SQF!');
            }
            return;
        }

        // Roll loadout: R (without modifier keys)
        if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === 'r' || event.key === 'R')) {
            event.preventDefault();
            if (typeof UIController !== 'undefined' && typeof UIController.runGenerate === 'function') {
                UIController.runGenerate();
            }
            return;
        }

        // Toggle Favorite: F (without modifier keys)
        if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === 'f' || event.key === 'F')) {
            event.preventDefault();
            if (typeof LoadoutHistory !== 'undefined' && typeof UIController !== 'undefined') {
                const entries = LoadoutHistory.getAll();
                if (entries.length > 0) {
                    LoadoutHistory.toggleFavorite(entries[0].id);
                    UIController.renderHistory();
                }
            }
            return;
        }

        // Focus Armory search: / (without Shift/Ctrl/Alt)
        if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.key === '/') {
            event.preventDefault();
            if (typeof UIController !== 'undefined' && typeof UIController.switchToTab === 'function') {
                UIController.switchToTab('armory-view');
                if (typeof document !== 'undefined') {
                    const searchInput = document.getElementById('armory-search-input');
                    if (searchInput && typeof searchInput.focus === 'function') {
                        searchInput.focus();
                    }
                }
            }
            return;
        }

        // Tab switching: 1 - 5
        const tabMap = {
            '1': 'generator-view',
            '2': 'armory-view',
            '3': 'best-loadouts-view',
            '4': 'squad-builder-view',
            '5': 'mod-manager-view'
        };
        if (!event.ctrlKey && !event.metaKey && !event.altKey && tabMap[event.key]) {
            event.preventDefault();
            if (typeof UIController !== 'undefined' && typeof UIController.switchToTab === 'function') {
                UIController.switchToTab(tabMap[event.key]);
            }
            return;
        }
    }

    static closeAllModals() {
        if (typeof document === 'undefined') return;
        const shortcutsModal = document.getElementById('shortcuts-modal');
        if (shortcutsModal) shortcutsModal.style.display = 'none';

        const inspectModal = document.getElementById('armory-inspect-modal');
        if (inspectModal) inspectModal.style.display = 'none';

        const comparisonModal = document.getElementById('comparison-modal');
        if (comparisonModal) comparisonModal.style.display = 'none';
    }

    static openShortcutsModal() {
        if (typeof document === 'undefined') return;
        const modal = document.getElementById('shortcuts-modal');
        if (modal) modal.style.display = 'flex';
    }

    static closeShortcutsModal() {
        if (typeof document === 'undefined') return;
        const modal = document.getElementById('shortcuts-modal');
        if (modal) modal.style.display = 'none';
    }

    static toggleShortcutsModal() {
        if (typeof document === 'undefined') return;
        const modal = document.getElementById('shortcuts-modal');
        if (!modal) return;
        const isOpen = modal.style.display === 'flex' || modal.style.display === 'block';
        modal.style.display = isOpen ? 'none' : 'flex';
    }

    static init() {
        if (typeof document === 'undefined') return;
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        const openBtn = document.getElementById('shortcuts-btn');
        if (openBtn) {
            openBtn.addEventListener('click', () => this.openShortcutsModal());
        }
        const closeBtn = document.getElementById('shortcuts-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeShortcutsModal());
        }
        const closeFooterBtn = document.getElementById('shortcuts-close-footer-btn');
        if (closeFooterBtn) {
            closeFooterBtn.addEventListener('click', () => this.closeShortcutsModal());
        }
    }
}

// ----------------------------------------------------------------------------
// 17.1 Tactical Web Audio Sound FX Controller
// ----------------------------------------------------------------------------

class SoundController {
    static audioCtx = null;
    static isMuted = false;

    static init() {
        if (typeof window === 'undefined') return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('arma_sound_muted');
                if (saved !== null) {
                    this.isMuted = (saved === 'true');
                }
            }
        } catch (e) {}

        this.updateUiState();
    }

    static getContext() {
        if (typeof window === 'undefined') return null;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        if (!this.audioCtx) {
            this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
        }
        return this.audioCtx;
    }

    static toggleMute() {
        this.isMuted = !this.isMuted;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('arma_sound_muted', String(this.isMuted));
            }
        } catch (e) {}
        this.updateUiState();
        return this.isMuted;
    }

    static setMuted(muted) {
        this.isMuted = Boolean(muted);
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('arma_sound_muted', String(this.isMuted));
            }
        } catch (e) {}
        this.updateUiState();
    }

    static updateUiState() {
        if (typeof document === 'undefined') return;
        const btn = document.getElementById('audio-toggle-btn');
        if (!btn) return;
        if (this.isMuted) {
            btn.classList.add('muted');
            btn.innerHTML = '🔇 <span class="btn-text">Muted</span>';
            btn.title = 'Sound FX Muted - Click to Unmute';
        } else {
            btn.classList.remove('muted');
            btn.innerHTML = '🔊 <span class="btn-text">Audio FX</span>';
            btn.title = 'Sound FX Enabled - Click to Mute';
        }
    }

    /**
     * Synthesizes mechanical bolt-rack sound (two-stage click/chamber sound).
     */
    static playBoltRack() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;

            // First click (bolt back)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(140, now);
            osc1.frequency.exponentialRampToValueAtTime(45, now + 0.05);
            gain1.gain.setValueAtTime(0.18, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.05);

            // Second heavier clack (bolt release & chamber) at +70ms
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(260, now + 0.07);
            osc2.frequency.exponentialRampToValueAtTime(55, now + 0.16);
            gain2.gain.setValueAtTime(0.24, now + 0.07);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.07);
            osc2.stop(now + 0.16);
        } catch (e) {}
    }

    /**
     * Synthesizes tactical radio squelch / chirp sound.
     */
    static playRadioClick() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1100, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }

    /**
     * Synthesizes crisp switch/tick sound for tabs and controls.
     */
    static playSwitchTick() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(820, now);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.02);
        } catch (e) {}
    }
}

// ----------------------------------------------------------------------------
// 17.2 Tactical Unit Briefing Card Generator (Discord / A3 Mission Manifest)
// ----------------------------------------------------------------------------

class BriefingCardGenerator {
    /**
     * Renders an 800x480 tactical loadout briefing manifest on the supplied canvas.
     * @param {HTMLCanvasElement} canvas
     * @param {object} loadoutData
     */
    static render(canvas, loadoutData) {
        if (!canvas || !loadoutData) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width || 800;
        const height = canvas.height || 480;

        // Background
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(0, 0, width, height);

        // Grid lines overlay (tactical HUD look)
        ctx.strokeStyle = '#141d2b';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Exterior tactical border & corner brackets
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Header Banner
        ctx.fillStyle = '#111927';
        ctx.fillRect(12, 12, width - 24, 60);

        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('ARMA 3 TACTICAL LOADOUT BRIEFING // COMBAT MANIFEST', 28, 38);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px monospace';
        const faction = loadoutData.faction || 'NATO';
        const role = loadoutData.role || 'Operator';
        const caliber = loadoutData.meta?.caliber || 'Standard';
        const mod = loadoutData.meta?.primaryMod || 'Vanilla';
        ctx.fillText(`FACTION: [${faction.toUpperCase()}]   ROLE: [${role.toUpperCase()}]   CALIBER: [${caliber}]   MOD: [${mod}]`, 28, 58);

        // Left Section: Equipment Manifest (x: 28, width: 440)
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('PRIMARY ARSENAL & KIT', 28, 105);

        ctx.strokeStyle = '#223249';
        ctx.beginPath();
        ctx.moveTo(28, 112);
        ctx.lineTo(460, 112);
        ctx.stroke();

        const formatSlot = (label, val, sub = '') => {
            return { label, val: val || 'None', sub };
        };

        const primaryAttachments = [
            loadoutData.primary?.optic,
            loadoutData.primary?.pointer,
            loadoutData.primary?.bipod,
            loadoutData.primary?.muzzle
        ].filter(Boolean).join(' | ');

        const items = [
            formatSlot('PRIMARY WEAPON', loadoutData.primary?.class, primaryAttachments),
            formatSlot('LAUNCHER / SEC', loadoutData.launcher?.class),
            formatSlot('SIDEARM / PISTOL', loadoutData.handgun?.class, loadoutData.handgun?.muzzle ? `Muzzle: ${loadoutData.handgun.muzzle}` : ''),
            formatSlot('COMBAT UNIFORM', loadoutData.clothing?.uniform),
            formatSlot('TACTICAL VEST', loadoutData.clothing?.vest),
            formatSlot('BACKPACK', loadoutData.clothing?.backpack),
            formatSlot('HELMET / HEADGEAR', loadoutData.clothing?.headgear),
            formatSlot('NIGHT VISION / OPTICS', loadoutData.items?.nvg, loadoutData.items?.binocular ? `Binos: ${loadoutData.items.binocular}` : '')
        ];

        let curY = 132;
        items.forEach(it => {
            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(it.label + ':', 28, curY);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '12px monospace';
            const valStr = String(it.val).length > 36 ? String(it.val).slice(0, 34) + '...' : String(it.val);
            ctx.fillText(valStr, 175, curY);

            if (it.sub) {
                curY += 14;
                ctx.fillStyle = '#38bdf8';
                ctx.font = '10px monospace';
                const subStr = String(it.sub).length > 44 ? String(it.sub).slice(0, 42) + '...' : String(it.sub);
                ctx.fillText('↳ ' + subStr, 175, curY);
            }
            curY += 21;
        });

        // Logistics line
        if (typeof LogisticsCalculator !== 'undefined' && typeof LogisticsCalculator.analyze === 'function') {
            const log = LogisticsCalculator.analyze(loadoutData);
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(`WEIGHT: ${log.totalWeightKg}kg [${log.encumbranceLevel}] | AMMO: ${log.totalRounds} rds | SUSTAIN: ~${log.sustainabilityMinutes}m`, 28, 425);
        }

        // Right Section: Tactical Radar Chart & Combat Ratings
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('COMBAT PROFILE RADAR', 500, 105);

        ctx.strokeStyle = '#223249';
        ctx.beginPath();
        ctx.moveTo(500, 112);
        ctx.lineTo(770, 112);
        ctx.stroke();

        let stats = { firepower: 50, mobility: 50, survivability: 50, sustainability: 50, range: 50 };
        if (typeof RadarChart !== 'undefined' && typeof RadarChart.calculateStats === 'function') {
            stats = RadarChart.calculateStats(loadoutData);
            if (typeof RadarChart.drawOnContext === 'function') {
                RadarChart.drawOnContext(ctx, stats, 635, 230, 85, {
                    textColor: '#94a3b8',
                    gridColor: '#223249',
                    accentColor: 'rgba(0, 255, 136, 0.45)',
                    pointColor: '#00ff88',
                    fontSize: '11px monospace'
                });
            }
        }

        // Stats summary breakdown
        const statEntries = [
            { label: 'FIREPOWER', val: stats.firepower, col: '#f87171' },
            { label: 'MOBILITY', val: stats.mobility, col: '#34d399' },
            { label: 'SURVIVAL', val: stats.survivability, col: '#60a5fa' },
            { label: 'SUSTAIN', val: stats.sustainability, col: '#fbbf24' },
            { label: 'RANGE', val: stats.range, col: '#a78bfa' }
        ];

        let statX = 490;
        statEntries.forEach(s => {
            ctx.fillStyle = s.col;
            ctx.font = 'bold 11px monospace';
            ctx.fillText(`${s.label}: ${s.val}`, statX, 360);
            statX += 58;
        });

        // Bottom Footer Bar
        ctx.fillStyle = '#111927';
        ctx.fillRect(12, 442, width - 24, 26);

        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
        ctx.fillText(`CONFIDENTIAL // ARMA 3 LOADOUT ENGINE // GENERATED: ${timestamp} UTC`, 24, 458);

        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('STATUS: DEPLOYMENT READY', 625, 458);
    }

    /**
     * Renders card onto canvas and triggers browser PNG image download.
     * @param {HTMLCanvasElement} canvas
     * @param {object} loadoutData
     */
    static download(canvas, loadoutData) {
        if (!canvas || !loadoutData || typeof document === 'undefined') return;
        this.render(canvas, loadoutData);
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            const faction = (loadoutData.faction || 'loadout').toLowerCase().replace(/\s+/g, '_');
            const role = (loadoutData.role || 'op').toLowerCase().replace(/\s+/g, '_');
            a.download = `arma3_${faction}_${role}_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.error('Failed to export loadout image card:', e);
        }
    }
}

// ----------------------------------------------------------------------------
// 18. Bootstrap & Environment Export Bridge
// ----------------------------------------------------------------------------
// Automatically initialize UI in browser environments
if (typeof document !== "undefined" && typeof window !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => UIController.init());
    }
    else {
        UIController.init();
    }
}
// Expose public API to global scope for headless VM tests (e.g. test.js) and window scripts
const globalScope = typeof globalThis !== "undefined"
    ? globalThis
    : (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : undefined));
if (globalScope) {
    globalScope.generateLoadout = generateLoadout;
    globalScope.generateLoadoutWithOptions = generateLoadoutWithOptions;
    globalScope.generateBestLoadout = generateBestLoadout;
    globalScope.generateSQF = generateSQF;
    globalScope.WeaponRepository = WeaponRepository;
    globalScope.LoadoutEngine = LoadoutEngine;
    globalScope.BestLoadoutFactory = BestLoadoutFactory;
    globalScope.META_PRESETS = META_PRESETS;
    globalScope.SqfSerializer = SqfSerializer;
    globalScope.RandomUtils = RandomUtils;
    globalScope.UIController = UIController;
    globalScope.ArmoryController = ArmoryController;
    globalScope.WeaponAssetResolver = WeaponAssetResolver;
    globalScope.WeaponPhotoResolver = WeaponPhotoResolver;
    globalScope.LoadoutHistory = LoadoutHistory;
    globalScope.LogisticsCalculator = LogisticsCalculator;
    globalScope.WEIGHT_TABLE = WEIGHT_TABLE;
    globalScope.LoadoutShareCodec = LoadoutShareCodec;
    globalScope.FIRETEAM_TEMPLATES = FIRETEAM_TEMPLATES;
    globalScope.SquadBuilder = SquadBuilder;
    globalScope.LoadoutComparator = LoadoutComparator;
    globalScope.WEAPON_STATS_TABLE = WEAPON_STATS_TABLE;
    globalScope.RadarChart = RadarChart;
    globalScope.SqfImporter = SqfImporter;
    globalScope.KeyboardController = KeyboardController;
    globalScope.BIOME_GEAR = BIOME_GEAR;
    globalScope.AmmunitionManager = AmmunitionManager;
    globalScope.SoundController = SoundController;
    globalScope.BriefingCardGenerator = BriefingCardGenerator;
}
// Node.js CommonJS export support
if (typeof module !== "undefined" && module && module.exports) {
    module.exports = {
        generateLoadout,
        generateLoadoutWithOptions,
        generateBestLoadout,
        generateSQF,
        WeaponRepository,
        LoadoutEngine,
        BestLoadoutFactory,
        META_PRESETS,
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
    };
}
