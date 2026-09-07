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
     * Serializes LoadoutData into an authentic Arma 3 `player setUnitLoadout` command.
     */
    static serialize(data) {
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

        const uniformItems = `[["ACE_EarPlugs",1],["ACE_tourniquet",2],["ACE_morphine",2],["ACE_epinephrine",2],["${pMag[0]}",${uniMags},${pMag[1]}],["${hMag[0]}",${h.count},${hMag[1]}]]`;

        let vestItems = `[["ACE_elasticBandage",6],["ACE_packingBandage",6],["ACE_splint",1],["${pMag[0]}",${vestMags},${pMag[1]}]`;
        if (data.items.grenadeCount > 0) {
            vestItems += `,["${data.items.grenadeChoice}",${data.items.grenadeCount},1]`;
        }
        if (data.items.smokeCount > 0) {
            vestItems += `,["${data.items.smokeChoice}",${data.items.smokeCount},1]`;
        }
        vestItems += `]`;

        let backpackItems = `[]`;
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

        const uniformArr = `["${data.clothing.uniform}",${uniformItems}]`;
        const vestArr = `["${data.clothing.vest}",${vestItems}]`;
        const backpackArr = data.clothing.backpack ? `["${data.clothing.backpack}",${backpackItems}]` : `[]`;

        const headgearStr = `"${data.clothing.headgear}"`;
        const facewearStr = `"${data.clothing.facewear}"`;
        const binocArr = data.items.binocular ? `["${data.items.binocular}","","","",["",0],[],""]` : `[]`;
        const linkedArr = `["ItemMap","","ItemRadio","ItemCompass","ItemWatch","${data.items.nvg}"]`;

        const sqfArray = `[${primaryArr},${secondaryArr},${handgunArr},${uniformArr},${vestArr},${backpackArr},${headgearStr},${facewearStr},${binocArr},${linkedArr}]`;
        return `player setUnitLoadout ${sqfArray};`;
    }

    /**
     * Formats raw SQF output into a beautifully indented multiline view.
     */
    static formatPretty(sqf) {
        const bracketIndex = sqf.indexOf("[");
        if (bracketIndex === -1) return sqf;

        const arrayStr = sqf.substring(bracketIndex);
        return `player setUnitLoadout ` + arrayStr
            .replace(/],\[/g, "],\n  [")
            .replace(/^\[/, "[\n  ")
            .replace(/\];$/, "\n];");
    }
}

// ----------------------------------------------------------------------------
