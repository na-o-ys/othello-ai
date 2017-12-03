import * as _ from "lodash"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as actions from "ui/actions"
import { Main, MainProps } from "ui/components/Main"
import { Color, CellState, Place } from "ui/types"
import * as Move from "bitboard/move"
import * as Board from "bitboard/Board"

export interface GameState {
    positions: Position[],
    playerColor: Color,
    latestMove?: Place
}

export interface Position {
    turn: Color,
    cells: CellState[]
}

function mapStateToProps(state: GameState, ownProps: any) {
    const position = _.last(state.positions) as Position
    const board = position.turn == "b" ?
        Board.fromUiState(position.cells) :
        Board.reverse(Board.fromUiState(position.cells))
    const [black, white] = position.turn == "b" ?
        Board.stones(board) :
        Board.stones(board).reverse()
    let status = "normal"
    if (Move.movables(board).length == 0) {
        if (Move.movables(Board.reverse(board)).length == 0) {
            status = "finished"
        } else {
            status = "pass"
        }
    }
    return {
        cells: position.cells,
        turn: position.turn,
        status,
        black,
        white,
        playerColor: state.playerColor,
        latestMove: state.latestMove
    }
}

function mapDispatchToProps(dispatch: Dispatch<0>): {} {
    return {
        onClickCell(place: Place) { dispatch(actions.clickCell(place)) },
        onClickPrev() { dispatch(actions.clickPrev) },
        onClickPass() { dispatch(actions.clickPass) },
        launchAi() { dispatch(actions.aiMove) }
    }
}

export const Game: any = connect<any>(mapStateToProps, mapDispatchToProps)(Main)
