import * as _ from "lodash"
import { octetCellsToCells, genOctetCells, OctetCells } from "bitboard/GameDescription"

export const BitBoard: number[][] = _.range(Math.pow(3, 8)).map(i => {
    const currCells = octetCellsToCells(i)

    return _.range(8).map(x => {
        if (currCells[x] !== ".") return 0
        // 左方向
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
        let mask = 0
        for (let j = lEnd; j <= rEnd; j++) {
            mask |= (1 << j)
        }
        return mask
    })
})
