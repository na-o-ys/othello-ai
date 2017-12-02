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

interface UiPosition {
    turn: UiTypes.Color,
    cells: UiTypes.CellState[]
}

export function fromUiState({ turn, cells }: UiPosition): Board {
    const fpCells = turn == "b" ? cells : reverseColor(cells)

    const rows = _.chunk(fpCells, 8)
        .map(row => genRow(row))
    const cols = (_.zip.apply(null, _.chunk(fpCells, 8)) as Cell[][])
        .map(col => genRow(col))
    const diagsR = genDiagsR(fpCells)
        .map(diag => genRow(diag))
    const diagsL = genDiagsR(
        _.flatten(_.chunk(fpCells, 8).map(r => _.reverse(r)))
    )
        .map(diag => genRow(diag))

    const stones = fpCells.filter(c => c != ".").length

    return { rows, cols, diagsR, diagsL, stones }
}

export function toUiState(desc: Board, turn: UiTypes.Color): UiTypes.CellState[] {
    const cells = rowsToUiCells(desc.rows)
    return turn == "b" ? cells : reverseColor(cells)
}

type Cell = "." | "b" | "w"

export function genRow(row: Cell[]): Row {
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

function rowsToUiCells(rows: Row[]): UiTypes.CellState[] {
    return _.flatten(
        rows.map(row =>
            rowToCells(row) as UiTypes.CellState[]
        )
    )
}

export function reverseColor(cells: UiTypes.CellState[]): UiTypes.CellState[] {
    return cells.map(c => {
        if (c == "b") return "w"
        if (c == "w") return "b"
        return c
    })
}

export function rowToCells(octetCells: Row): Cell[] {
    return _.range(8).map(idx => {
        const byte = (octetCells >> (2 * (7 - idx))) & 3
        if (byte === 0) return "b"
        if (byte === 1) return "w"
        return "."
    })
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

// for debug

export function showOctetCols(cols: Row[]) {
    const colCells = cols.map(rowToCells)
    const str = _.range(8).map(y =>
        _.range(8).map(x =>
            colCells[x][y]
        ).join("")
    ).join("\n")
    console.log("--- debug show octet cols")
    console.log(str)
}

export function showOctetDiags(diags: Row[]) {
    console.log("--- debug show octet diags")
    let rows: any = _.range(8).map(() => _.range(8))
    diags.map((diag, idxY) => {
        const cells = rowToCells(diag)
        if (idxY < 8) {
            _.range(8).forEach(x => {
                const y = idxY - x
                if (y < 0) return
                rows[y][x] = cells[x]
            })
        } else {
            _.range(8).forEach(idxX => {
                const x = (idxY - 7) + idxX
                const y = 7 - idxX
                if (x > 7) return
                rows[y][x] = cells[idxX]
            })
        }
    })
    console.log(rows.map((row: any) => row.join("")).join("\n"))
}
