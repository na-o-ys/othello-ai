import * as _ from "lodash"
import { CellState } from "ui/types"

export const initialBoard: CellState[] = [
    ".", ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", "w", "b", ".", ".", ".",
    ".", ".", ".", "b", "w", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".", ".",
]

export const lastTwentyBoard: CellState[] = _.flatten(`
.w......
..www...
.bwwbb..
bwwwwb.b
.bwbbwbb
bbbwwwwb
b.bbwwbb
b.wwww.b
`.split("\n").slice(1, 9).map(r => r.split("") as CellState[]))

export const lastOneBoard: CellState[] = _.flatten(`
bbbbbbbb
bbbbbww.
bbbbwwwb
bbwwwwwb
wwwwbbwb
bwwbbwwb
bwwwwwwb
bbbbbbbb
`.split("\n").slice(1, 9).map(r => r.split("") as CellState[]))

export const shouldPassBoard: CellState[] = _.flatten(`
bbbb....
bbbbb...
bbbbbb..
bwbbwbbb
wwbwbbbb
bwwbbwwb
bwwwwwwb
bbbbbbbb
`.split("\n").slice(1, 9).map(r => r.split("") as CellState[]))

export const lastOneBoard2: CellState[] = _.flatten(`
bbbbwww.
bbbwwwwb
bbwbbbbb
bwbwwbbb
wwwwbwbb
bwwbwbwb
bwwwwbwb
bbbbbbbb
`.split("\n").slice(1, 9).map(r => r.split("") as CellState[]))