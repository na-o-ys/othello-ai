import { GameState } from "ui/containers/Game"
import { Action } from "ui/actions"
import { Color, CellState, Place } from "ui/types"
import { fromUiState, toUiState, showOctetCols, showOctetDiags } from "bitboard/GameDescription"
import * as Rule from "bitboard/rule"

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
        return {
            turn: state.turn == "b" ? "w" : "b",
            cells: toUiState(moved, state.turn)
        }
    }

    return state
}