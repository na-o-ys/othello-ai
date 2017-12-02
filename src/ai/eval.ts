import * as _ from "lodash"
import * as Board from "bitboard/Board"
import * as Rule from "bitboard/rule"

export function evaluate(desc: Board.Board): number {
    const rev = Board.reverse(desc)
    const movablesScore = Rule.movableIndices(desc).length - Rule.movableIndices(rev).length
    const lineScore = 0//calcLineScore(desc) - calcLineScore(rev)
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
    ["xxx", 10],
    [".xx", 10],
    ["..x", 10],
    ["x.x", 10],
    ["x..", 5],
    ["...", 0],
    ["xx.", -10],
    [".x.", -10]
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
