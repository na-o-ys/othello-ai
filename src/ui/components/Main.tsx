import * as React from "react"
import { Place, CellState, Color } from "ui/types"
import { Board, BoardProps, OnClickCell } from "ui/components/Board"
import { Control } from "ui/components/Control"
import * as style from "ui/constants/style"

export interface MainProps {
    cells: CellState[],
    turn: Color,
    onClickCell: OnClickCell,
    onClickPass: () => void,
    onClickPrev: () => void,
    shouldPass: boolean
}

export const Main = (props: MainProps) => (
    <div style={mainStyle()}>
        <Board cells={props.cells} onClickCell={props.onClickCell} />
        <Control
            shouldPass={props.shouldPass}
            onClickPass={props.onClickPass}
            onClickPrev={props.onClickPrev}
        />
    </div>
)

const mainStyle = (scale: number = 1) => ({
    width: style.mainWidth,
    height: style.mainHeight
})
