import * as _ from "lodash"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as actions from "ui/actions"
import { Main, MainProps } from "ui/components/Main"
import { Color, CellState, Place } from "ui/types"

export interface GameState {
    turn: Color,
    cells: CellState[],
    shouldPass: boolean
}

function mapStateToProps(state: GameState, ownProps: any) {
    return {
        cells: state.cells,
        shouldPass: state.shouldPass
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
