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

function move(state: GameState, place?: Place): GameState {
    const latest = _.last(state.positions) as Position
    const nextTurn: Color = latest.turn == "b" ? "w" : "b"
    const board = fromUiState(latest)

    if (!place) return {
        positions: _.concat(
            state.positions,
            [{
                cells: latest.cells,
                turn: nextTurn
            }]
        )
    }

    if (!Rule.canMove(board, place.x, place.y)) return state

    const nextBoard = latest.turn == "b" ?
        Rule.move(board, place.x, place.y) :
        reverse(Rule.move(board, place.x, place.y))

    return {
        positions: _.concat(
            state.positions,
            [{
                cells: toUiState(nextBoard),
                turn: nextTurn
            }]
        )
    }
}

export function reducers(state: GameState, action: Action): GameState  {
    if (action.type == "click_cell") return move(state, action.place)

    if (action.type == "click_pass") return move(state)

    if (action.type == "click_prev") {
        let positions = state.positions
        if (positions.length <= 1) return { positions }
        const currTurn = (_.last(positions) as Position).turn
        positions.pop()
        while (positions.length > 0 && (_.last(positions) as Position).turn != currTurn) {
            positions.pop()
        }
        return { positions }
    }

    return state
}
