import * as _ from "lodash"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as actions from "ui/actions"
import { Main, MainProps } from "ui/components/Main"
import { Color, CellState, Place } from "ui/types"
import * as Rule from "bitboard/rule"
import * as Board from "bitboard/Board"

export interface GameState {
    positions: Position[]
}

export interface Position {
    turn: Color,
    cells: CellState[]
}

function mapStateToProps(state: GameState, ownProps: any) {
    const position = _.last(state.positions) as Position
    const board = Board.fromUiState(position)
    const [black, white] = Board.stones(board)
    return {
        cells: position.cells,
        turn: position.turn,
        shouldPass: Rule.movables(board).length == 0,
        black,
        white
    }
}

function mapDispatchToProps(dispatch: Dispatch<0>): {} {
    return {
        onClickCell(place: Place) { dispatch(actions.clickCell(place)) },
        onClickPrev() { dispatch(actions.clickPrev) },
        onClickPass() { dispatch(actions.clickPass) }
    }
}

export const Game = connect(mapStateToProps, mapDispatchToProps)(Main)
