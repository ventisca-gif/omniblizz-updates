# OmniBlizz 2.40.0 · revision 305

Diamante AF and the live Municipal Park/Vilgax encounter. Builds on the exact published 2.39.1 engine (SHA256 0c592025314bffc65b8f2fb543dde953585d280288846a32d8e5d63ffee7f8ef), retaining the skins scroll fix.

Native form: diamondaf305, 1900 base HP (chosen because request left HP unspecified), punch170, six skills:240/230/235(total triple)/260(seismic, chosen)/250(directional, chosen)/0(slide10s). Cooldowns8/4/13/16/9/18s. Native Ten/level damage, mastery200, combat domain300 and passive tree. Four genuine walking views; bounded lazy sprite/VFX caches (96 frames, 18 shots,16 effects,8 trail pieces).

Park entrance: existing park zone4 at800,520. Give100 existing Petropia crystals and15 existing crystalline shards once; receipt supports free retries. Vilgax800000HP,4000base damage then600000HP second round. Explicit elite exclusion prevents random legacy 1.5x health scaling. Telegraphs, dodge, shield, fire/crystal sword, eyes and gauntlet with cooldowns.

Live adapted story: opening recap, Jetray/BigChill/Humungousaur reversions, forced Chromastone rainbow channel, approach/shatter/badge handoff/rebuild, Diamond round2, concession. Original localized dialogue, not copied episode script. Temporary domain300 and borrowed skills never overwrite normal domain/mastery. Save snapshots restore origin/transient player fields; abort/death restores previous form. Only victory grants DNA. Source reference: Dwayne McDuffie episode302 ADR script, Municipal Park clearing.

Assets: expansion305/diamond.webp,vilgax.webp,vfx.webp,cast.webp,park.webp,hologram.png. Hologram is the unchanged supplied image with one-time cached runtime edge-black alpha mask. New atlases created from supplied references. All mission/alien text ES/EN/PT/TR.

Validation: node syntax check; 78 browser integration assertions in browser-results305.json covering cost atomicity, exact boss HP after elite seeding, story transitions, autosaves, temporary-domain isolation, all four walking views and frames, six skills, punch/page/slot dispatch, homing hold/release, harmless slide, AI melee/range/shield/dodge, abort/retry/victory and Omnipedia lock/unlock. Real browser pointer click also confirmed sixth skill starts18s cooldown. Visual inspection confirmed transparent hologram and cast, park, live encounter. Private qa305.js runs only in private fixture, not shipped as game engine.

Physical Android performance has not been benchmarked. No claim of guaranteed60FPS or zero bugs.
