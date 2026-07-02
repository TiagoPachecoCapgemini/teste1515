# Traceability Matrix

## Coverage Summary

- Total rows: 7
- Complete rows: 7
- Partial rows: 0
- Missing coverage rows: 0
- Coverage status: complete

## Matrix

| ID | Requirement | User Story | Component | Test Case | Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Reveal Board Tiles | As a player, I want to click on hidden tiles to reveal them, so that I can safely find plants and avoid detonating zo... | game.js (application logic) | TC1.1: Reveal Safe Tile and Verify Adjacent Count | code_package.json | complete |
| TR-002 | Flag Potential Zombies | As a player, I want to flag tiles that I suspect contain zombies, so that I do not accidentally click on them and los... | index.html (entrypoint) | TC1.2: Reveal Zombie and Trigger Game Over | package_manifest.md | complete |
| TR-003 | Game Over on Zombie Reveal | As a player, I want the game to end immediately when I reveal a zombie, so that I know I have lost and can see where... | styles.css (styles) | TC1.3: Flag and Unflag Tile | generated README.md | complete |
| TR-004 | Win Condition Validation | As a player, I want to win the game when all safe plant tiles are revealed, so that my victory is acknowledged and ce... | README.md (documentation) | TC2.1: Win Condition with Incorrect Flags | game.js | complete |
| TR-005 | First-Click Safety Guarantee | As a player, I want my very first click on the board to always reveal a safe tile, so that I never lose on the first... | README.md (documentation) | TC3.1: First-Click Safety Verification | index.html | complete |
| TR-006 | Restart Game Functionality | As a player, I want to easily restart the game at any point, so that I can quickly start a fresh round with a new ran... | README.md (documentation) | TC4.1: Restart Game Functionality | styles.css | complete |
| TR-007 | Plants vs. Zombies Visual Theme | As a player, I want the game's user interface and assets to be fully styled with Plants vs. Zombies artwork, so that... | README.md (documentation) | TC4.1: Restart Game Functionality | README.md | complete |
