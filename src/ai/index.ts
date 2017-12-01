import * as _ from "lodash"
import * as Rule from "bitboard/rule"
import { GameDescription, reverse } from "bitboard/GameDescription"
import { evaluate } from "ai/eval"

const minScore = 0
const maxScore = 100
export function run(desc: GameDescription, depth: number): { x: number, y: number } | undefined {
    const movables = Rule.movables(desc)
    return _.maxBy(movables, place => {
        const nextDesc = reverse(Rule.move(desc, place.x, place.y))
        return alphaBeta(reverse(nextDesc), depth, -maxScore, -minScore)
    })
}

function alphaBeta(desc: GameDescription, depth: number, a: number, b: number): number {
    if (depth == 0) return evaluate(desc)
    for (const move of Rule.movables(desc)) {
        const nextDesc = reverse(Rule.move(desc, move.x, move.y))
        a = _.max([a, -alphaBeta(nextDesc, depth - 1, -b , -a)]) as number
        if (a >= b) return a
    }
    return a
}