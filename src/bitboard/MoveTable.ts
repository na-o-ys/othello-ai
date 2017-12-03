import * as _ from "lodash"
import { Row } from "bitboard/Board"

export function lookupMoveTable(row: number, x: number): number {
    return MoveTable[row][x]
}

export const MoveTable: number[][] = _.range(1<<16).map(i => {
    const currCells = rowToCells(i)
    return _.range(8).map(x => {
        if (currCells[x] !== ".") return 0
        let lEnd = x
        if (x - 1 >= 0 && currCells[x - 1] === "w") {
            for (let j = x - 2; j >= 0; j--) {
                if (currCells[j] === "b") {
                    lEnd = j
                    break
                }
                if (currCells[j] === ".") break
            }
        }
        let rEnd = x
        if (x + 1 < 8 && currCells[x + 1] === "w") {
            for (let j = x + 2; j < 8; j++) {
                if (currCells[j] === "b") {
                    rEnd = j
                    break
                }
                if (currCells[j] === ".") break
            }
        }
        if (lEnd == rEnd) return 0
        let flipCells = 0
        for (let j = lEnd; j <= rEnd; j++) {
            flipCells |= 1 << (7 - j)
        }
        return flipCells
    })
})

export function rowToCells(row: number) {
    return _.range(8).map(idx => {
        const byte = (row >> (2 * (7 - idx))) & 3
        if (byte === 0) return "b"
        if (byte === 1) return "w"
        return "."
    })
}

// debug

export function naiveLookup(row: number, x: number): number {
    if (((row >> ((7 - x) * 2)) & 0b11) != 0b10) return 0
    let lEnd = x
    if (x - 1 >= 0 && ((row >> ((7 - x + 1) * 2)) & 0b11) == 0b01) {
        for (let j = x - 2; j >= 0; j--) {
            if (((row >> ((7 - j) * 2)) & 0b11) == 0b00) {
                lEnd = j
                break
            }
            if (((row >> ((7 - j) * 2)) & 0b11) == 0b10) break
        }
    }
    let rEnd = x
    if (x + 1 < 8 && ((row >> ((7 - x - 1) * 2)) & 0b11) == 0b01) {
        for (let j = x + 2; j < 8; j++) {
            if (((row >> ((7 - j) * 2)) & 0b11) == 0b00) {
                rEnd = j
                break
            }
            if (((row >> ((7 - j) * 2)) & 0b11) == 0b10) break
        }
    }
    if (lEnd == rEnd) return 0
    let flipCells = 0
    for (let j = lEnd; j <= rEnd; j++) {
        flipCells |= 1 << (7 - j)
    }
    return flipCells
}
