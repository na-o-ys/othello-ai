import * as _ from "lodash"
import { octetCellsToCells, genOctetCells, OctetCells } from "GameDescription"

interface BitBoardEntry {
    [key: number]: OctetCells | undefined
}

export const BitBoard: BitBoardEntry[] = _.range(1<<16).map(i => {
    const currCells = octetCellsToCells(i)
    let entry: BitBoardEntry = {}

    _.range(8).forEach(x => {
        if (currCells[x] !== ".") return
        const cells = _.clone(currCells)
        // 左方向
        let lEnd = x
        if (x - 1 >= 0 && currCells[x - 1] === "w") {
            for (let j = x - 2; j >= 0; j--) {
                if (currCells[j] === "b") {
                    lEnd = j
                    break
                }
                if (currCells[j] === "." || currCells[j] === "-") break
            }
        }
        let rEnd = x
        if (x + 1 < 8 && currCells[x + 1] === "w") {
            for (let j = x + 2; j < 8; j++) {
                if (currCells[j] === "b") {
                    rEnd = j
                    break
                }
                if (currCells[j] === "." || currCells[j] === "-") break
            }
        }
        if (lEnd != rEnd) {
            for (let j = lEnd; j <= rEnd; j++) {
                cells[j] = "b"
            }
            entry[x] = genOctetCells(cells)
        }
    })

    return entry
})
