import * as _ from "lodash"
import * as Board from "bitboard/Board"
import * as Rule from "bitboard/rule"

const k = 1

export function evaluate(desc: Board.Board): number {
    const rev = Board.reverse(desc)
    const movablesScore = 100 * (Rule.movableIndices(desc).length - Rule.movableIndices(rev).length)
    const lineScore = k * (calcLineScore(desc) - calcLineScore(rev))
    return movablesScore + lineScore
}

function calcLineScore(desc: Board.Board): number {
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

const rowScores = [
    ["xxx", 100],
    [".xx", 100],
    ["..x", 100],
    ["x.x", 100],
    ["x..", 50],
    ["...", 0],
    ["xx.", -100],
    [".x.", -100]
]
    .sort((a, b) => a[0] > b[0] ? 1 : -1)
    .map(e => e[1] as number)

function rowScore(row: Board.Row): number {
    let left = 0
    if (((row >> 10) & 0b11) == 0) left = 1
    left <<= 1
    if (((row >> 12) & 0b11) == 0) left += 1
    left <<= 1
    if (((row >> 14) & 0b11) == 0) left += 1

    let right = 0
    if (((row >> 4) & 0b11) == 0) right = 1
    right <<= 1
    if (((row >> 2) & 0b11) == 0) right += 1
    right <<= 1
    if ((row & 0b11) == 0) right += 1
    return rowScores[left] + rowScores[right]
}
