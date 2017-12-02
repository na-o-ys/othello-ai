import * as _ from "lodash"
import { rowToCells, genRow, Row } from "bitboard/Board"

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
