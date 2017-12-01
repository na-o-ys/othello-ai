import * as _ from "lodash"
import { octetCellsToCells, genOctetCells } from "GameDescription"

for (let i = 1; i < 1<<16; i++) {
    const currCells = octetCellsToCells(i)

    _.range(8).map(x => {
        if (currCells[x] !== ".") return i
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
            console.log(i)
            console.log(x)
            console.log(currCells.join(""))
            console.log(cells.join(""))
        }
        return genOctetCells(cells)
    })
    console.log(currCells.join(""))
}