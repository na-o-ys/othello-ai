import { GameState } from "ui/containers/Game"
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

export function reducers(state: GameState, action: Action): GameState  {
    if (action.type == "click_cell") {
        const desc = fromUiState(state)
        console.log(Rule.movables(desc))
        if (!Rule.canMove(desc, action.place.x, action.place.y)) return state

        const moved = Rule.move(desc, action.place.x, action.place.y)
        const aiMoves = Ai.run(reverse(moved), 6)
        console.log(aiMoves[0][1])
        console.log(aiMoves.map((m: any) => [m[0], [m[1].x, m[1].y].join()]))
        const next = reverse(Rule.move(reverse(moved), aiMoves[0][1].x, aiMoves[0][1].y))
        return { turn: state.turn, cells: toUiState(next, state.turn)}
        // return {
        //     turn: state.turn == "b" ? "w" : "b",
        //     cells: toUiState(moved, state.turn)
        // }
    }

    return state
}
