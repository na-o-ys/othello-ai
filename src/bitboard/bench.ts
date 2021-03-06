import * as _ from "lodash"
import { Board, fromUiState } from "bitboard/Board"
import * as Move from "bitboard/move"

export function randomBoard(): Board {
    const cells: any = Array(64).map(() => _.sample(["b", "w", "."]))
    return fromUiState(cells)
}

export function bench() {
    const start = new Date().getTime()
    let itr = 0
    let sum = 0
    const desc = randomBoard()
    while (new Date().getTime() - start < 5000) {
        sum += Move.movables(desc).length
        itr += 1
    }
    const mmps = itr * 5 / 1000000
    console.log(`${mmps} Mm/s`)
}
