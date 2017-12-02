import * as _ from "lodash"
import { GameState, Position } from "ui/containers/Game"
import { Action } from "ui/actions"
import { Color, CellState, Place } from "ui/types"
import { fromUiState, toUiState, showOctetCols, showOctetDiags, reverse } from "bitboard/Board"
import * as Rule from "bitboard/rule"
import * as Ai from "ai"

function turn(state: Color, action: Action): Color {
    return state == "b" ? "w" : "b"
}

function cells(state: CellState[], action: Action): CellState[] {
    return state
}

const playerColor: Color = "b"

export function reducers(state: GameState, action: Action): GameState  {
    if (action.type == "click_cell") {
        const latest = _.last(state.positions) as Position
        const desc = fromUiState(latest)
        console.log(Rule.movables(desc))
        if (latest.turn != playerColor) return state
        if (!Rule.canMove(desc, action.place.x, action.place.y)) return state

        const moved = Rule.move(desc, action.place.x, action.place.y)

        const aiMoves = Ai.run(reverse(moved), 6)
        console.log(aiMoves[0][1])
        console.log(aiMoves.map((m: any) => [m[0], [m[1].x, m[1].y].join()]))
        const aiMoved = reverse(Rule.move(reverse(moved), aiMoves[0][1].x, aiMoves[0][1].y))

        return {
            positions: _.concat(
                state.positions,
                [{
                    cells: toUiState(aiMoved, playerColor),
                    turn: playerColor
                }]
            )
        }
    }

    if (action.type == "click_pass") {
        const latest = _.last(state.positions) as Position
        const desc = fromUiState(latest)
        const aiMoves = Ai.run(reverse(desc), 6)
        console.log(aiMoves[0][1])
        console.log(aiMoves.map((m: any) => [m[0], [m[1].x, m[1].y].join()]))
        const aiMoved = reverse(Rule.move(reverse(desc), aiMoves[0][1].x, aiMoves[0][1].y))

        return {
            positions: _.concat(
                state.positions,
                [{
                    cells: toUiState(aiMoved, playerColor),
                    turn: playerColor
                }]
            )
        }
    }

    if (action.type == "click_prev") {
        return {
            positions: state.positions.slice(
                0,
                state.positions.length - 1
            )
        }
    }

    return state
}
