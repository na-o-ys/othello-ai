import * as _ from "lodash"
import { GameState, Position } from "ui/containers/Game"
import { Action } from "ui/actions"
import { Color, CellState, Place } from "ui/types"
import { fromUiState, toUiState, reverse } from "bitboard/Board"
import * as Move from "bitboard/move"
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
    const board = latest.turn == "b" ?
        fromUiState(latest.cells) :
        reverse(fromUiState(latest.cells))

    if (!place) return {
        ...state,
        positions: _.concat(
            state.positions,
            [{
                cells: latest.cells,
                turn: nextTurn
            }]
        )
    }

    if (!Move.canMove(board, place.x, place.y)) return state

    const nextBoard = latest.turn == "b" ?
        Move.move(board, place.x, place.y) :
        reverse(Move.move(board, place.x, place.y))

    return {
        ...state,
        latestMove: place,
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
    const latestPosition = state.positions[state.positions.length - 1]
    if (action.type == "click_cell" && latestPosition.turn == state.playerColor) {
        return move(state, action.place)
    }

    if (action.type == "click_pass" && latestPosition.turn == state.playerColor) {
        return move(state)
    }

    if (action.type == "launch_ai" && latestPosition.turn != state.playerColor) {
        const board = latestPosition.turn == "b" ?
            fromUiState(latestPosition.cells) :
            reverse(fromUiState(latestPosition.cells))
        const moves = Ai.run(board)

        console.log("--- ai moves")
        console.log(moves.map(m => `${m.place.x},${m.place.y} ${m.score}`))
        return move(state, moves.length > 0 ? moves[0].place : undefined)
    }

    if (action.type == "click_prev") {
        let positions = state.positions
        if (positions.length <= 1) return { ...state, positions }
        const currTurn = (_.last(positions) as Position).turn
        positions.pop()
        while (positions.length > 0 && (_.last(positions) as Position).turn != currTurn) {
            positions.pop()
        }
        return { ...state, positions, latestMove: undefined }
    }

    return state
}
