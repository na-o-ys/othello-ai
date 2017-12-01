import * as _ from "lodash"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as actions from "ui/actions"
import { Board, BoardProps } from "ui/components/Board"
import { Color, CellState } from "ui/types"

export interface GameState {
    turn: Color,
    cells: CellState[]
}

function mapStateToProps(state: GameState, ownProps: any): BoardProps {
    return {
        cells: state.cells
    }
}

function mapDispatchToProps(dispatch: Dispatch<0>): {} {
    return {}
}

export const Game = connect(mapStateToProps, mapDispatchToProps)(Board)
