import { GameState } from "ui/containers/Game"
import { Action } from "ui/actions"
import { Color, CellState, Place } from "ui/types"

function turn(state: Color, action: Action): Color {
    return state == "b" ? "w" : "b"
}

function cells(state: CellState[], action: Action): CellState[] {
    return state
}

export const reducers = (state: GameState, action: Action) => {
    return {
        turn: turn(state.turn, action),
        cells: cells(state.cells, action)
    }
}