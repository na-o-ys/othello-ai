import { GameDescription } from "GameDescription"
import { BitBoard } from "BitBoard"

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
    return desc
}