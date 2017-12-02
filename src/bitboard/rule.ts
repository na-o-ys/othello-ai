import * as _ from "lodash"
import { Board, fromUiState, toUiState, rowToCells } from "bitboard/Board"
import { MoveTable } from "bitboard/MoveTable"
import * as UiTypes from "ui/types"

export function movables(desc: Board): { x: number, y: number }[] {
    return _.range(8 * 8)
        .filter(i => canMove(desc, i % 8, (i / 8) >> 0))
        .map(i => ({ x: i % 8, y: (i / 8) >> 0}))
}

export function canMove(desc: Board, x: number, y: number): boolean {
    // row
    if (MoveTable[desc.rows[y]][x] != -1) return true
    // col
    if (MoveTable[desc.cols[x]][y] != -1) return true
    // diagR
    const diagR = desc.diagsR[x + y]
    if (x + y < 8) {
        // seg1
        if (MoveTable[diagR][x] != -1) return true
    } else {
        // seg2
        if (MoveTable[diagR][7 - y] != -1) return true
    }
    // diagL
    const rx = 7 - x
    const diagL = desc.diagsL[rx + y]
    if (rx + y < 8) {
        // seg1
        if (MoveTable[diagL][rx] != -1) return true
    } else {
        // seg2
        if (MoveTable[diagL][7 - y] != -1) return true
    }
    return false
}

export function move(desc: Board, x: number, y: number): Board {
    const cells = toUiState(desc, "b")
    // row
    const nextRow = MoveTable[desc.rows[y]][x]
    if (nextRow != -1) {
        rowToCells(nextRow)
            .forEach((cell, ix) => {
                cells[8 * y + ix] = cell as UiTypes.CellState
            })
    }
    // col
    const nextCol = MoveTable[desc.cols[x]][y]
    if (nextCol != -1) {
        rowToCells(nextCol)
            .forEach((cell, iy) => {
                cells[8 * iy + x] = cell as UiTypes.CellState
            })
    }
    // diagR
    const diagR = desc.diagsR[x + y]
    if (x + y < 8) {
        // seg1
        const nextDiag = MoveTable[diagR][x]
        if (nextDiag != -1) {
            rowToCells(nextDiag)
                .forEach((cell, ix) => {
                    const iy = (x + y) - ix
                    if (iy < 0) return
                    cells[8 * iy + ix] = cell as UiTypes.CellState
                })
        }
    } else {
        // seg2
        const nextDiag = MoveTable[diagR][7 - y]
        if (nextDiag != -1) {
            rowToCells(nextDiag)
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
        const nextDiag = MoveTable[diagL][rx]
        if (nextDiag != -1) {
            rowToCells(nextDiag)
                .forEach((cell, ix) => {
                    const iy = (rx + y) - ix
                    if (iy < 0) return
                    cells[8 * iy + 7 - ix] = cell as UiTypes.CellState
                })
        }
    } else {
        // seg2
        const nextDiag = MoveTable[diagL][7 - y]
        if (nextDiag != -1) {
            rowToCells(nextDiag)
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
