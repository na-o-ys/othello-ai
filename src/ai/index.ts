import * as _ from "lodash"
import * as Move from "bitboard/move"
import { Board, reverse, stones } from "bitboard/Board"
import { evaluate } from "ai/eval"

const FullSearchCount = 12
const MinScore = -10000
const MaxScore = 10000
const TimeoutMS = 500

interface MoveScore {
    score: number,
    place: { x: number, y: number }
}

interface Place {
    x: number,
    y: number
}

export function run(board: Board): MoveScore[] {
    if (64 - board.stones <= FullSearchCount) return fullSearch(board)
    return iterativeDeepning(board)
}

function iterativeDeepning(board: Board): MoveScore[] {
    console.log("iterative deepning")
    const movables = Move.movables(board)
    const timelimit = Date.now() + TimeoutMS
    let scores: MoveScore[] = []

    for (let depth = 3;; depth++) {
        try {
            scores = movables.map(place => ({
                score: -alphaBetaEval(
                    reverse(Move.move(board, place.x, place.y)),
                    depth - 1,
                    -MaxScore,
                    -MinScore,
                    timelimit
                ),
                place
            }))
        } catch {
            console.log(`depth: ${depth}`)
            break
        }
    }
    return _.sortBy(scores, s => -s.score)
}

function alphaBetaEval(board: Board, depth: number, a: number, b: number, tl: number): number {
    if (Date.now() > tl) throw "tle"
    if (depth <= 0) return evaluate(board)
    const movables = Move.movables(board)
    if (movables.length == 0) return -alphaBetaEval(reverse(board), depth - 1, -b, -a, tl)
    for (const move of movables) {
        const next = reverse(Move.move(board, move.x, move.y))
        a = _.max([a, -alphaBetaEval(next, depth - 1, -b , -a, tl)]) as number
        if (a >= b) return a
    }
    return a
}

function fullSearch(board: Board): MoveScore[] {
    console.log("full search")
    const movables = Move.movables(board)
    const scores = movables.map(place => ({
        score: -alphaBetaFull(
            reverse(Move.move(board, place.x, place.y)),
            0,
            -MaxScore,
            -MinScore
        ),
        place
    }))
    return _.sortBy(scores, s => -s.score)
}

function alphaBetaFull(board: Board, passes: number, a: number, b: number): number {
    const [black, white] = stones(board)
    if (board.stones == 64) return black - white
    const movables = Move.movables(board)
    if (movables.length == 0 && passes > 0) return black - white
    if (movables.length == 0) return -alphaBetaFull(reverse(board), passes + 1, -b, -a)
    for (const move of movables) {
        const nextDesc = reverse(Move.move(board, move.x, move.y))
        a = _.max([a, -alphaBetaFull(nextDesc, passes, -b , -a)]) as number
        if (a >= b) return a
    }
    return a
}
