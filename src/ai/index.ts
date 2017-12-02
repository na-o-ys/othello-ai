import * as _ from "lodash"
import * as Rule from "bitboard/rule"
import { GameDescription, reverse } from "bitboard/GameDescription"
import { evaluate } from "ai/eval"

const minScore = -1000
const maxScore = 1000
export function run(desc: GameDescription, depth: number): any {
    const movables = Rule.movables(desc)
    // return _.maxBy(movables, place => {
    //     const nextDesc = reverse(Rule.move(desc, place.x, place.y))
    //     return alphaBeta(nextDesc, depth, -maxScore, -minScore)
    // })
    const scores = movables.map(p => {
        const nxt = reverse(Rule.move(desc, p.x, p.y))
        const score = alphaBeta(nxt, depth, -maxScore, -minScore)
        return [score, p]
    })
    return _.sortBy(scores, s => s[0])
}

function alphaBeta(desc: GameDescription, depth: number, a: number, b: number): number {
    if (depth <= 0) return evaluate(desc)
    const movables = Rule.movables(desc)
    if (movables.length == 0) return -alphaBeta(reverse(desc), depth - 1, -b, -a)
    for (const move of movables) {
        const nextDesc = reverse(Rule.move(desc, move.x, move.y))
        a = _.max([a, -alphaBeta(nextDesc, depth - 1, -b , -a)]) as number
        if (a >= b) return a
    }
    return a
}