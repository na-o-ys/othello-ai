import * as _ from "lodash"
import * as UiTypes from "ui/types"

// black: 00
// white: 01
// empty: 10
export type Row = number

export interface Board {
    rows: Row[]
    cols: Row[]
    // left-bottom to right-top
    diagsR: Row[]
    // right-bottom to left-top
    diagsL: Row[]
    stones: number
}

export function reverse(desc: Board): Board {
    const ma = 0b1010101010101010
    const mb = 0b0101010101010101
    const rev = (r: Row) => r ^ mb ^ ((r & ma) >>> 1)
    return {
        rows: desc.rows.map(rev),
        cols: desc.cols.map(rev),
        diagsL: desc.diagsL.map(rev),
        diagsR: desc.diagsR.map(rev),
        stones: desc.stones
    }
}

export function flip(desc: Board, x: number, y: number) {
    desc.rows[y] &= ~(0b11 << (2 * (7 - x)))
    desc.cols[x] &= ~(0b11 << (2 * (7 - y)))
    if (x + y < 8) {
        desc.diagsR[x + y] &= ~(0b11 << (2 * (7 - x)))
    } else {
        desc.diagsR[x + y] &= ~(0b11 << (2 * y))
    }
    const rx = 7 - x
    if (rx + y < 8) {
        desc.diagsL[rx + y] &= ~(0b11 << (2 * (7 - rx)))
    } else {
        desc.diagsL[rx + y] &= ~(0b11 << (2 * y))
    }
}

export function stones(board: Board): number[] {
    return _.flatten(
        board.rows.map(row =>
            _.range(8)
                .map(i => (row >> ((7 - i) * 2)) & 0b11)
                .map(c => {
                    if (c == 0b00) return [1, 0]
                    if (c == 0b01) return [0, 1]
                    return [0, 0]
                })
        )
    )
        .reduce((acc, crr) => [acc[0] + crr[0], acc[1] + crr[1]], [0, 0])
}

export function fromUiState(cells: UiTypes.CellState[]): Board {
    const rows = _.chunk(cells, 8)
        .map(row => genRow(row))
    const cols = (_.zip.apply(null, _.chunk(cells, 8)) as Cell[][])
        .map(col => genRow(col))
    const diagsR = genDiagsR(cells)
        .map(diag => genRow(diag))
    const diagsL = genDiagsR(
        _.flatten(_.chunk(cells, 8).map(r => _.reverse(r)))
    )
        .map(diag => genRow(diag))

    const stones = cells.filter(c => c != ".").length

    return { rows, cols, diagsR, diagsL, stones }
}

export function toUiState(board: Board): UiTypes.CellState[] {
    return _.flatten(
        board.rows.map(row =>
            rowToCells(row) as UiTypes.CellState[]
        )
    )
}

type Cell = "." | "b" | "w"

function genRow(row: Cell[]): Row {
    return _.reduce(
        row,
        (octet, cell) => (octet << 2) + cellToByte(cell),
        0
    )
}

function cellToByte(cell: Cell): number {
    if (cell === "b") return 0
    if (cell === "w") return 1
    if (cell === ".") return 2
    return 3
}

function genDiagsR(cells: Cell[]): Cell[][] {
    const rows = _.chunk(cells, 8)
    // (0, 0), (1, -1), (2, -2), ...
    // (0, 1), (1, 0),  (2, -1), ...
    // (0, 2), (1, 1),  (2, 0),  ...
    // ...
    // (0, 7), (1, 6), ...
    const seg1 = _.range(8).map(idx =>
        _.range(8).map(x => {
            const y = idx - x
            if (y < 0) return "."
            return rows[y][x]
        })
    )

    // (1, 7), (2, 6), ...
    // (2, 7), (3, 6), ...
    // (3, 7), (4, 6), ...
    // ...
    // (7, 7), *(8, 6), ...
    const seg2 = _.range(8).map(idxY =>
        _.range(8).map(idxX => {
            const x = idxX + 1 + idxY
            const y = 7 - idxX
            if (x > 7) return "."
            return rows[y][x]
        })
    )

    return _.concat(seg1, seg2)
}

function rowToCells(octetCells: Row) {
    return _.range(8).map(idx => {
        const byte = (octetCells >> (2 * (7 - idx))) & 3
        if (byte === 0) return "b"
        if (byte === 1) return "w"
        return "."
    })
}
