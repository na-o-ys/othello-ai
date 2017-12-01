import * as _ from "lodash"
import { GameDescription, fromUiState } from "GameDescription"
import * as Rule from "rule"

export function randomBoard(): GameDescription {
    const cells: any = Array(64).map(() => _.sample(["b", "w", "."]))
    return fromUiState({ turn: "b", cells })
}

export function bench() {
    const start = new Date().getTime()
    let itr = 0
    while (new Date().getTime() - start < 5000) {
        const desc = randomBoard()
        Array(500).map(() => Rule.movables(desc))
        itr += 1
    }
    const mmps = itr * 500 / 5 / 1000000
    console.log(`${mmps} Mm/s`)
}