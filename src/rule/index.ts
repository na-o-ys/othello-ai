import { GameDescription, fromUiState, toUiState, octetCellsToCells } from "GameDescription"
import { BitBoard } from "BitBoard"
import * as UiTypes from "ui/types"

export function canMove(desc: GameDescription, x: number, y: number): boolean {
    // row
    if (BitBoard[desc.rows[y]][x]) return true
    // col
    if (BitBoard[desc.cols[x]][y]) return true
    // diag
    const diag = desc.diags[x + y]
    if (x + y < 8) {
        // seg1
        if (BitBoard[diag][x]) return true
    } else {
        // seg2
        if (BitBoard[diag][7 - y]) return true
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
    // diag
    const diag = desc.diags[x + y]
    if (x + y < 8) {
        // seg1
        const nextDiag = BitBoard[diag][x]
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
        const nextDiag = BitBoard[diag][7 - y]
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

    // TODO: たぶんdescに変換する処理を飛ばせる
    return fromUiState({ turn: "b", cells })
}