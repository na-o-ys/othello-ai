import * as _ from "lodash"
import * as Rule from "bitboard/rule"
import { Board, reverse, stones } from "bitboard/Board"
import { evaluate } from "ai/eval"

const fullSearchThreshold = 12
// const depth = 6
const minScore = -1000
const maxScore = 1000
export function run(board: Board) {
    const movables = Rule.movables(board)
    if (64 - board.stones > fullSearchThreshold) {
        const timelimit = Date.now() + 500
        let scores
        for (let depth = 3;; depth++) {
            try {
                scores = movables.map(p => {
                    const nxt = reverse(Rule.move(board, p.x, p.y))
                    const score = -alphaBeta(nxt, depth - 1, -maxScore, -minScore, timelimit)
                    return [score, p]
                })
            } catch {
                console.log(depth)
                break
            }
        }
        return _.sortBy(scores, (s: any) => -s[0])
            .map(m => ({ score: m[0], place: m[1] }) as { score: number, place: { x: number, y: number }})
    } else {
        console.log("full search")
        const scores = movables.map(p => {
            const nxt = reverse(Rule.move(board, p.x, p.y))
            const score = -fullSearch(nxt, 0, -maxScore, -minScore)
            return [score, p]
        })
        return _.sortBy(scores, s => -s[0])
            .map(m => ({ score: m[0], place: m[1] }) as { score: number, place: { x: number, y: number }})
    }
}

function alphaBeta(board: Board, depth: number, a: number, b: number, tl: number): number {
    if (Date.now() > tl) throw "tle"
    if (depth <= 0) return evaluate(board)
    const movables = Rule.movables(board)
    if (movables.length == 0) return -alphaBeta(reverse(board), depth - 1, -b, -a, tl)
    for (const move of movables) {
        const nextDesc = reverse(Rule.move(board, move.x, move.y))
        a = _.max([a, -alphaBeta(nextDesc, depth - 1, -b , -a, tl)]) as number
        if (a >= b) return a
    }
    return a
}

function fullSearch(board: Board, passes: number, a: number, b: number): number {
    const [black, white] = stones(board)
    if (board.stones == 64) return black - white
    const movables = Rule.movables(board)
    if (movables.length == 0 && passes > 0) return black - white
    if (movables.length == 0) return -fullSearch(reverse(board), passes + 1, -b, -a)
    for (const move of movables) {
        const nextDesc = reverse(Rule.move(board, move.x, move.y))
        a = _.max([a, -fullSearch(nextDesc, passes, -b , -a)]) as number
        if (a >= b) return a
    }
    return a
}