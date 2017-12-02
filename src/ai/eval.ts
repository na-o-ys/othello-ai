import * as _ from "lodash"
import { GameDescription, OctetCells, octetCellsToCells, reverseColor } from "bitboard/GameDescription"
import * as Rule from "bitboard/rule"

export function evaluate(desc: GameDescription): number {
    const movables = Rule.movables(desc).length
    const line = lineScore(desc)
    return movables + line
}

function lineScore(desc: GameDescription): number {
    return [
        desc.rows[0],
        desc.rows[7],
        desc.cols[0],
        desc.cols[7],
        desc.diagsL[7],
        desc.diagsR[7]
    ]
        .map(rowScore)
        .reduce((acc, crr) => acc + crr, 0)
}

const rowScores: { [key: string]: number } = {
    "xxx": 10,
    ".xx": 9,
    "..x": 5,
    "x.x": 5,
    "x..": 1,
    "...": 0,
    "xx.": -5,
    ".x.": -5
}

function rowScore(row: OctetCells): number {
    // TODO: ビット演算
    const bCells = octetCellsToCells(row)
        .map(c => c == "b" ? "x" : ".")
    const bEdges = [
        [bCells[2], bCells[1], bCells[0]].join(""),
        [bCells[5], bCells[6], bCells[7]].join("")
    ]
    const bScore = _.sum(bEdges.map(v => rowScores[v]))

    const wCells = octetCellsToCells(row)
        .map(c => c == "w" ? "x" : ".")
    const wEdges = [
        [wCells[2], wCells[1], wCells[0]].join(""),
        [wCells[5], wCells[6], wCells[7]].join("")
    ]
    const wScore = _.sum(wEdges.map(v => rowScores[v]))
    return bScore - wScore
}

// bbb 10
// .bb 9
// ..b 5
// b.b 5
// b.. 1
// ... 0
// bb. -5
// .b. -5
