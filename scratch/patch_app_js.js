const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Replace BestLoadoutFactory + SqfSerializer block with meta_chunk.js
const metaChunkPath = path.join(__dirname, 'meta_chunk.js');
const metaChunk = fs.readFileSync(metaChunkPath, 'utf8');

const startTarget = '// 6. Curated Best Loadout Factory (High-Performance SOF Presets)';
const endTarget = '// 8. Public Top-Level API Facades (Backward Compatibility & Testing)';

const startIdx = appCode.indexOf(startTarget);
const endIdx = appCode.indexOf(endTarget);

if (startIdx === -1 || endIdx === -1) {
    console.error('Target markers for BestLoadoutFactory not found!', { startIdx, endIdx });
    process.exit(1);
}

// Keep the section comment header and replace the content up to endTarget
const before = appCode.substring(0, startIdx);
const after = appCode.substring(endIdx);

appCode = before + '// 6. Curated Best Loadout Factory (High-Performance SOF Presets & Meta Engine)\n// ----------------------------------------------------------------------------\n' + metaChunk + after;

// 2. Update UIController.init() to call this.bindMetaFilterEvents()
appCode = appCode.replace(
    'this.bindCustomWeaponsManager();\n        this.renderCustomWeaponsTable();',
    'this.bindCustomWeaponsManager();\n        this.bindMetaFilterEvents();\n        this.renderCustomWeaponsTable();'
);

// 3. Update UIController.cacheElements() to cache meta elements
const cacheTarget = 'modCustom: getEl("mod-custom")\n        };';
const cacheReplacement = `modCustom: getEl("mod-custom"),
            metaFactionPills: document.querySelectorAll("#meta-faction-pills .pill"),
            metaRolePills: document.querySelectorAll("#meta-role-pills .pill"),
            metaModPills: document.querySelectorAll("#meta-mod-pills .pill"),
            metaCountBadge: getEl("meta-count-badge"),
            rollMetaBtn: getEl("roll-meta-btn")
        };`;
appCode = appCode.replace(cacheTarget, cacheReplacement);

// 4. Replace renderBestLoadouts() in UIController with bindMetaFilterEvents() + new renderBestLoadouts()
const renderTargetStart = '    static renderBestLoadouts() {';
const renderTargetEnd = '    static bindCustomWeaponsManager() {';

const rStartIdx = appCode.indexOf(renderTargetStart);
const rEndIdx = appCode.indexOf(renderTargetEnd);

if (rStartIdx === -1 || rEndIdx === -1) {
    console.error('Target markers for renderBestLoadouts not found!', { rStartIdx, rEndIdx });
    process.exit(1);
}

const newMethods = `    static bindMetaFilterEvents() {
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

                loadoutGrid.innerHTML = \`
                    \${this.renderCard("Primary Weapon", rolled.loadoutData.primary.class, [rolled.loadoutData.primary.optic, rolled.loadoutData.primary.pointer, rolled.loadoutData.primary.bipod, rolled.loadoutData.primary.muzzle])}
                    \${this.renderCard("Secondary (Launcher)", rolled.loadoutData.launcher.class)}
                    \${this.renderCard("Handgun", rolled.loadoutData.handgun.class, [rolled.loadoutData.handgun.muzzle])}
                    \${this.renderCard("Uniform", rolled.loadoutData.clothing.uniform)}
                    \${this.renderCard("Vest", rolled.loadoutData.clothing.vest)}
                    \${this.renderCard("Backpack", rolled.loadoutData.clothing.backpack)}
                    \${this.renderCard("Headgear", rolled.loadoutData.clothing.headgear)}
                    \${this.renderCard("Facewear", rolled.loadoutData.clothing.facewear)}
                    \${this.renderCard("Special Equipment", rolled.loadoutData.items.nvg, [rolled.loadoutData.items.binocular])}
                \`;

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
            bestContainer.innerHTML = \`
                <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1rem;">
                    <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">No Meta Presets Found</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">Try adjusting your faction, role, or mod suite filter.</div>
                </div>
            \`;
            return;
        }

        let html = "";
        for (const p of presets) {
            const { loadoutData, sqf } = BestLoadoutFactory.create(p.faction, p.role, p.mod);
            const weaponItem = WeaponRepository.getById(p.primaryClass);
            const imgPath = weaponItem?.image || "assets/real_weapons/default_rifle.png";

            const factionClass = "badge-" + p.faction.toLowerCase();
            const modClass = "badge-" + p.mod.toLowerCase();

            const specs = [
                '<li><span class="spec-label">Primary:</span> <span class="spec-val accent">' + this.escapeHtml(p.primaryClass) + '</span></li>',
                '<li><span class="spec-label">Caliber:</span> <span class="spec-val">' + this.escapeHtml(p.caliber) + '</span></li>',
                p.optic ? '<li><span class="spec-label">Optic:</span> <span class="spec-val">' + this.escapeHtml(p.optic) + '</span></li>' : '',
                p.muzzle ? '<li><span class="spec-label">Suppressor:</span> <span class="spec-val">' + this.escapeHtml(p.muzzle) + '</span></li>' : '',
                p.bipod ? '<li><span class="spec-label">Bipod:</span> <span class="spec-val">' + this.escapeHtml(p.bipod) + '</span></li>' : '',
                p.pointer ? '<li><span class="spec-label">Device:</span> <span class="spec-val">' + this.escapeHtml(p.pointer) + '</span></li>' : '',
                p.launcherClass ? '<li><span class="spec-label">Launcher:</span> <span class="spec-val">' + this.escapeHtml(p.launcherClass) + '</span></li>' : '',
                '<li><span class="spec-label">Combat Load:</span> <span class="spec-val">' + this.escapeHtml(p.primaryMag[0]) + '</span></li>'
            ].filter(Boolean).join("");

            html += \`
                <div class="best-loadout-card">
                    <div class="best-card-photo">
                        <img class="best-card-img" src="\${imgPath}" alt="\${this.escapeHtml(p.title)}" loading="lazy" onerror="this.src='assets/real_weapons/default_rifle.png'" />
                    </div>
                    <div class="best-card-body">
                        <div class="best-card-header">
                            <div class="best-card-title">\${this.escapeHtml(p.title)}</div>
                            <div class="best-card-subtitle">\${this.escapeHtml(p.faction)} • \${this.escapeHtml(p.role)}</div>
                        </div>
                        <div class="best-card-badges">
                            <span class="tag-badge \${factionClass}">\${this.escapeHtml(p.faction)}</span>
                            <span class="tag-badge \${modClass}">\${this.escapeHtml(p.mod)}</span>
                            <span class="tag-badge">\${this.escapeHtml(p.role)}</span>
                            <span class="tag-badge">\${this.escapeHtml(p.caliber)}</span>
                        </div>
                        <ul class="best-card-specs">
                            \${specs}
                        </ul>
                        <div class="best-card-actions">
                            <button class="primary-btn copy-best-btn" data-sqf="\${encodeURIComponent(sqf)}">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                Copy SQF
                            </button>
                            <button class="inspect-best-btn" data-weapon-id="\${this.escapeHtml(p.primaryClass)}" title="Inspect weapon in armory">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                Inspect
                            </button>
                        </div>
                    </div>
                </div>
            \`;
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

`;

appCode = appCode.substring(0, rStartIdx) + newMethods + appCode.substring(rEndIdx);

// 5. Add static properties to UIController
appCode = appCode.replace(
    'UIController.isBestLoadoutsRendered = false;',
    'UIController.isBestLoadoutsRendered = false;\nUIController.activeMetaFaction = "all";\nUIController.activeMetaRole = "all";\nUIController.activeMetaMod = "all";\nUIController.isMetaEventsBound = false;'
);

// 6. Expose META_PRESETS in globalScope and exports
appCode = appCode.replace(
    'globalScope.BestLoadoutFactory = BestLoadoutFactory;',
    'globalScope.BestLoadoutFactory = BestLoadoutFactory;\n    globalScope.META_PRESETS = META_PRESETS;'
);
appCode = appCode.replace(
    'BestLoadoutFactory,',
    'BestLoadoutFactory,\n        META_PRESETS,'
);

fs.writeFileSync(appPath, appCode);
console.log('Successfully patched app.js!');
