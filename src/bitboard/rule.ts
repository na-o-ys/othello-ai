import * as _ from "lodash"
import { GameDescription, fromUiState, toUiState, octetCellsToCells } from "bitboard/GameDescription"
import { BitBoard } from "bitboard/BitBoard"
import * as UiTypes from "ui/types"

export function movables(desc: GameDescription): { x: number, y: number }[] {
    return _.range(8 * 8)
        .filter(i => canMove(desc, i % 8, (i / 8) >> 0))
        .map(i => ({ x: i % 8, y: (i / 8) >> 0}))
}

export function canMove(desc: GameDescription, x: number, y: number): boolean {
    // row
    if (BitBoard[desc.rows[y]][x] !== 0) return true
    // col
    if (BitBoard[desc.cols[x]][y] !== 0) return true
    // diagR
    const diagR = desc.diagsR[x + y]
    if (x + y < 8) {
        // seg1
        const mask = (1 << x + y + 1) - 1
        if ((BitBoard[diagR][x] & mask) !== 0) return true
    } else {
        // seg2
        const mask = (1 << (16 - x - y)) - 1
        if ((BitBoard[diagR][7 - y] & mask) !== 0) return true
    }
    // diagL
    const rx = 7 - x
    const diagL = desc.diagsL[rx + y]
    if (rx + y < 8) {
        // seg1
        const mask = (1 << rx + y + 1) - 1
        if ((BitBoard[diagL][rx] & mask) !== 0) return true
    } else {
        // seg2
        const mask = (1 << (16 - rx - y)) - 1
        if ((BitBoard[diagL][7 - y] & mask) !== 0) return true
    }
    return false
}

export function move(desc: GameDescription, x: number, y: number): GameDescription {
    const cells = toUiState(desc, "b")
    // row
    const nextRow = BitBoard[desc.rows[y]][x]
    if (nextRow) {
        octetCellsToCells(nextRow)
            .forEach((cell, ix) => {
                cells[8 * y + ix] = cell as UiTypes.CellState
            })
    }
    // col
    const nextCol = BitBoard[desc.cols[x]][y]
    if (nextCol) {
        octetCellsToCells(nextCol)
            .forEach((cell, iy) => {
                cells[8 * iy + x] = cell as UiTypes.CellState
            })
    }
    // diagR
    const diagR = desc.diagsR[x + y]
    if (x + y < 8) {
        // seg1
        const nextDiag = BitBoard[diagR][x]
        if (nextDiag) {
            octetCellsToCells(nextDiag)
                .forEach((cell, ix) => {
                    const iy = (x + y) - ix
                    if (iy < 0) return
                    cells[8 * iy + ix] = cell as UiTypes.CellState
                })
        }
    } else {
        // seg2
        const nextDiag = BitBoard[diagR][7 - y]
        if (nextDiag) {
            octetCellsToCells(nextDiag)
                .forEach((cell, i) => {
                    const ix = (x + y - 7) + i
                    const iy = 7 - i
                    if (ix > 7) return
                    cells[8 * iy + ix] = cell as UiTypes.CellState
                })
        }
    }
    // diagL
    const rx = 7 - x
    const diagL = desc.diagsL[rx + y]
    if (rx + y < 8) {
        // seg1
        const nextDiag = BitBoard[diagL][rx]
        if (nextDiag) {
            octetCellsToCells(nextDiag)
                .forEach((cell, ix) => {
                    const iy = (rx + y) - ix
                    if (iy < 0) return
                    cells[8 * iy + 7 - ix] = cell as UiTypes.CellState
                })
        }
    } else {
        // seg2
        const nextDiag = BitBoard[diagL][7 - y]
        if (nextDiag) {
            octetCellsToCells(nextDiag)
                .forEach((cell, i) => {
                    const ix = (rx + y - 7) + i
                    const iy = 7 - i
                    if (ix > 7) return
                    cells[8 * iy + 7 - ix] = cell as UiTypes.CellState
                })
        }
    }

    // TODO: たぶんdescに変換する処理を飛ばせる
    return fromUiState({ turn: "b", cells })
}