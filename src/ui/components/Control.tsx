import * as React from "react"
import { Place, CellState } from "ui/types"
import { Board, BoardProps, OnClickCell } from "ui/components/Board"
import * as style from "ui/constants/style"

export interface ControlProps {
    onClickPass: () => void,
    onClickPrev: () => void,
    shouldPass: boolean
}

export const Control = (props: ControlProps) => (
    <div style={controlStyle()}>
        <span onClick={props.onClickPrev} style={{marginRight: 10}}>Prev</span>
        {
            props.shouldPass ?
                <span onClick={props.onClickPass}>Pass</span> :
                <span>Pass</span>
        }
    </div>
)

const controlStyle = (scale: number = 1) => ({
    width: style.mainWidth,
    height: style.controlHeight,
    margin: style.boardMargin
})
