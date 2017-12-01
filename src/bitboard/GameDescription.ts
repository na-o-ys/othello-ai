import * as _ from "lodash"
import { GameState } from "ui/containers/Game"
import * as UiTypes from "ui/types"

// 自石: 00
// 相手石: 01
// 空: 10
// 壁: 11
export type OctetCells = number

export interface GameDescription {
    rows: OctetCells[]
    cols: OctetCells[]
    // 左下から右上
    diagsR: OctetCells[]
    // 右下から左上
    diagsL: OctetCells[]
}

export function fromUiState({ turn, cells }: GameState): GameDescription {
    const fpCells = turn == "b" ? cells : reverseColor(cells)

    const rows = _.chunk(fpCells, 8)
        .map(row => genOctetCells(row))
    const cols = (_.zip.apply(null, _.chunk(fpCells, 8)) as Cell[][])
        .map(col => genOctetCells(col))
    const diagsR = genDiagsR(fpCells)
        .map(diag => genOctetCells(diag))
    const diagsL = genDiagsL(fpCells)
        .map(diag => genOctetCells(diag))

    return { rows, cols, diagsR, diagsL }
}

export function toUiState(desc: GameDescription, turn: UiTypes.Color): UiTypes.CellState[] {
    const cells = octetCellRowsToUiCells(desc.rows)
    return turn == "b" ? cells : reverseColor(cells)
}

type Cell = "." | "b" | "w" | "-"

export function genOctetCells(row: Cell[]): OctetCells {
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
            if (y < 0) return "-"
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
            if (x > 7) return "-"
            return rows[y][x]
        })
    )

    return _.concat(seg1, seg2)
}

function genDiagsL(cells: Cell[]): Cell[][] {
    const rows = _.chunk(cells, 8)
    const seg1 = _.range(8).map(idx =>
        _.range(8).map(x => {
            const y = idx - x
            if (y < 0) return "-"
            return rows[y][7 - x]
        })
    )

    const seg2 = _.range(8).map(idxY =>
        _.range(8).map(idxX => {
            const x = idxX + 1 + idxY
            const y = 7 - idxX
            if (x > 7) return "-"
            return rows[y][7 - x]
        })
    )

    return _.concat(seg1, seg2)
}

function octetCellRowsToUiCells(rows: OctetCells[]): UiTypes.CellState[] {
    return _.flatten(
        rows.map(row =>
            octetCellsToCells(row) as UiTypes.CellState[]
        )
    )
}

function reverseColor(cells: UiTypes.CellState[]): UiTypes.CellState[] {
    return cells.map(c => {
        if (c == "b") return "w"
        if (c == "w") return "b"
        return c
    })
}

export function octetCellsToCells(octetCells: OctetCells): Cell[] {
    return _.range(8).map(idx => {
        const byte = (octetCells >> (2 * (7 - idx))) & 3
        if (byte === 0) return "b"
        if (byte === 1) return "w"
        if (byte === 2) return "."
        return "-"
    })
}

export function reverse(desc: GameDescription): GameDescription {
    const cells = octetCellRowsToUiCells(desc.rows)
    const reversed = reverseColor(cells)
    return fromUiState({ turn: "b", cells: reversed })
}

// for debug

export function showOctetCols(cols: OctetCells[]) {
    const colCells = cols.map(octetCellsToCells)
    const str = _.range(8).map(y =>
        _.range(8).map(x =>
            colCells[x][y]
        ).join("")
    ).join("\n")
    console.log("--- debug show octet cols")
    console.log(str)
}

export function showOctetDiags(diags: OctetCells[]) {
    console.log("--- debug show octet diags")
    let rows: any = _.range(8).map(() => _.range(8))
    diags.map((diag, idxY) => {
        const cells = octetCellsToCells(diag)
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