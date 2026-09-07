const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, '..', 'app.ts');
const tsCode = fs.readFileSync(tsPath, 'utf8');

const startMarker = 'const META_PRESETS: readonly MetaPreset[] = [';
const endMarker = '// 8. Public Top-Level API Facades';

const startIdx = tsCode.indexOf(startMarker);
const endIdx = tsCode.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found', { startIdx, endIdx });
    process.exit(1);
}

let chunk = tsCode.substring(startIdx, endIdx);

// Convert TS to clean JS:
chunk = chunk.replace('const META_PRESETS: readonly MetaPreset[] = [', 'const META_PRESETS = [');
chunk = chunk.replace(/public static /g, 'static ');
chunk = chunk.replace(/private static /g, 'static ');
chunk = chunk.replace(/static create\([\s\S]*?\)\s*:\s*\{[^}]*\}\s*\{/, 'static create(faction, role, modSuite) {');
chunk = chunk.replace(/static getAllPresets\([\s\S]*?\)\s*:\s*MetaPreset\[\]\s*\{/, 'static getAllPresets(filter) {');
chunk = chunk.replace(/static rollMeta\([\s\S]*?\)\s*:\s*\{[^}]*\}\s*\{/, 'static rollMeta(factionInput = "Random", roleInput = "Random", activeMods) {');
chunk = chunk.replace(/static serialize\(data: LoadoutData\): string {/, 'static serialize(data) {');
chunk = chunk.replace(/static formatPretty\(sqf: string\): string {/, 'static formatPretty(sqf) {');
chunk = chunk.replace(/const roleCandidates: RoleName\[\] =/g, 'const roleCandidates =');
chunk = chunk.replace(/const handgunMag: \[string, number\] =/g, 'const handgunMag =');
chunk = chunk.replace(/const loadoutData: LoadoutData =/g, 'const loadoutData =');
chunk = chunk.replace(/match!\.primaryClass/g, 'match.primaryClass');
chunk = chunk.replace(/: FactionName/g, '');
chunk = chunk.replace(/: RoleName/g, '');
chunk = chunk.replace(/: ModSource/g, '');
chunk = chunk.replace(/ as FactionName \| "Random"/g, '');
chunk = chunk.replace(/ as RoleName \| "Random"/g, '');
chunk = chunk.replace(/ as FactionName/g, '');
chunk = chunk.replace(/ as RoleName/g, '');

const outPath = path.join(__dirname, 'meta_chunk.js');
fs.writeFileSync(outPath, chunk);
console.log('Wrote meta_chunk.js successfully, size:', chunk.length);
