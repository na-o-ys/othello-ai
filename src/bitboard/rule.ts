import * as _ from "lodash"
import { Board, rowToCells, flip } from "bitboard/Board"
import { MoveTable, lookupMoveTable } from "bitboard/MoveTable"
import * as UiTypes from "ui/types"

export function movables(desc: Board): { x: number, y: number }[] {
    return movableIndices(desc)
        .map(i => ({ x: i % 8, y: (i / 8) >> 0}))
}

export function movableIndices(desc: Board): number[] {
    return _.range(8 * 8)
        .filter(i => canMove(desc, i % 8, (i / 8) >> 0))
}

function rowToTriplet(row: number): number {
    const cells = _.range(8).map(i =>
        (row >> ((7 - i) * 2)) & 0b11
    )
    return _.reduce(cells, (acc, c) => acc * 3 + c, 0)
}

export function canMove(desc: Board, x: number, y: number): boolean {
    // row
    if (lookupMoveTable(desc.rows[y], x) != 0) return true
    // col
    if (lookupMoveTable(desc.cols[x], y) != 0) return true
    // diagR
    const diagR = desc.diagsR[x + y]
    if (x + y < 8) {
        // seg1
        if (lookupMoveTable(diagR, x) != 0) return true
    } else {
        // seg2
        if (lookupMoveTable(diagR, 7 - y) != 0) return true
    }
    // diagL
    const rx = 7 - x
    const diagL = desc.diagsL[rx + y]
    if (rx + y < 8) {
        // seg1
        if (lookupMoveTable(diagL, rx) != 0) return true
    } else {
        // seg2
        if (lookupMoveTable(diagL, 7 - y) != 0) return true
    }
    return false
}

export function move(desc: Board, x: number, y: number): Board {
    const next = _.cloneDeep(desc)
    // row
    const rowFlipped = MoveTable[desc.rows[y]][x]
    _.range(8).forEach(i => {
        if ((rowFlipped & (1 << (7 - i))) == 0) return
        flip(next, i, y)
    })

    // col
    const colFlipped = MoveTable[desc.cols[x]][y]
    _.range(8).forEach(i => {
        if ((colFlipped & (1 << (7 - i))) == 0) return
        flip(next, x, i)
    })

    // diagR
    const diagR = desc.diagsR[x + y]
    if (x + y < 8) {
        // seg1
        const diagFlipped = MoveTable[diagR][x]
        _.range(8).forEach(i => {
            if ((diagFlipped & (1 << (7 - i))) == 0) return
            const iy = (x + y) - i
            flip(next, i, iy)
        })
    } else {
        // seg2
        const diagFlipped = MoveTable[diagR][7 - y]
        _.range(8).forEach(i => {
            if ((diagFlipped & (1 << (7 - i))) == 0) return
            const ix = (x + y - 7) + i
            const iy = 7 - i
            flip(next, ix, iy)
        })
    }

    // diagL
    const rx = 7 - x
    const diagL = desc.diagsL[rx + y]
    if (rx + y < 8) {
        // seg1
        const diagFlipped = MoveTable[diagL][rx]
        _.range(8).forEach(i => {
            if ((diagFlipped & (1 << (7 - i))) == 0) return
            const iy = (rx + y) - i
            flip(next, 7 - i, iy)
        })
    } else {
        // seg2
        const diagFlipped = MoveTable[diagL][7 - y]
        _.range(8).forEach(i => {
            if ((diagFlipped & (1 << (7 - i))) == 0) return
            const ix = (rx + y - 7) + i
            const iy = 7 - i
            flip(next, 7 - ix, iy)
        })
    }
    next.stones += 1

    return next
}
