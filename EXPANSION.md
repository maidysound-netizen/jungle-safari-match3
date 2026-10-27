# Stage expansion plan (101 → 200)

Every Tuesday at 21:00, 20 new stages are added and pushed to GitHub Pages.
Each block of 10 stages introduces one new **trick** (a new obstacle or rule).
Earlier tricks keep appearing in later stages, so difficulty keeps stacking.

| Run | Date | Stages | New tricks | Status |
|---|---|---|---|---|
| 1 | 2026-10-27 | 101–120 | 101 Mud Puddle · 111 Coconut Bomb | done |
| 2 | 2026-11-03 | 121–140 | 121 Lost Egg · 131 River Current | pending |
| 3 | 2026-11-10 | 141–160 | 141 Fog · 151 Monkey Thief | pending |
| 4 | 2026-11-17 | 161–180 | 161 Totem · 171 Chameleon | pending |
| 5 | 2026-11-24 | 181–200 | 181 Turtle Shell · 191 Volcano Boss | pending |

After run 5 there are no more runs.

## Tricks

1. **Mud Puddle** (101): a floor tile that stays in place while blocks move. Popping a block on it cleans it. Must clean all.
2. **Coconut Bomb** (111): a normal block with a number. The number drops by 1 after every move; at 0 the stage fails. Matching it defuses it. Must defuse all.
3. **Lost Egg** (121): egg pieces that can't be matched. They fall like blocks; when one reaches the bottom cell of its column it's collected. Collect the stage's egg count.
4. **River Current** (131): 1–2 marked rows. After every move, the blocks in those rows slide one cell to the right (wrapping around). Fixed cells and holes in that row stay put.
5. **Fog** (141): cells covered with fog show "?" and can't be swapped. A match next to a fog cell clears the fog. Must clear all fog.
6. **Monkey Thief** (151): every 4 moves, a monkey swaps two random movable blocks (with a short animation and status text). It never creates a match by itself.
7. **Totem** (161): a fixed cell showing one animal. It breaks only when that same animal is matched next to it. Must break all.
8. **Chameleon** (171): a block that changes to a different animal after every move. It counts as a normal block when matched.
9. **Turtle Shell** (181): a block wearing a shell. The first match removes the shell, and a second match clears the block. It can be swapped. Must clear all.
10. **Volcano Boss** (191): a 2×2 fixed boss in the middle with HP. Every adjacent match deals 1 damage, and a blast deals 3. Defeat it to clear. HP grows with the stage.

## Rules for each run (must not break existing features)

- Before editing, run `git fetch` and compare with `origin/main`. If GitHub has commits that aren't local, or local files have uncommitted changes in `script.js`, `styles.css` or `index.html`, **stop and report a possible merge conflict instead of pushing**.
- Stages 1 to the previous `MAX_STAGE` must generate exactly the same as before. Compare `getStage(n)` old vs new.
- Add each trick to `OBSTACLE_RULES` / `OB_TYPES` with its `start` stage, plus an `OB_INTRO` line, help text in `index.html`, a `.mini.ob-*` swatch and cell styles.
- Raise `MAX_STAGE` by 20 and update the table above.
- Test in the browser: the new trick works, old stages still load, there are no new console errors (404s for optional `backgrounds/` and `music/` files are expected).
- Commit and push to `main`, then check that https://maidysound-netizen.github.io/jungle-safari-match3/ shows the new stages.
