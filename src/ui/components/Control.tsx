import * as React from "react"
import { Place, CellState } from "ui/types"
import { Board, BoardProps, OnClickCell } from "ui/components/Board"
import * as style from "ui/constants/style"

export interface ControlProps {
    onClickPass: () => void,
    onClickPrev: () => void,
    shouldPass: boolean,
    black: number,
    white: number
}

export const Control = (props: ControlProps) => (
    <div style={controlStyle()}>
        <div>
            {props.black} - {props.white}
        </div>
        <div>
            <span onClick={props.onClickPrev} style={{marginRight: 10}}>Prev</span>
            {
                props.shouldPass ?
                    <span onClick={props.onClickPass}>Pass</span> :
                    <span>Pass</span>
            }
        </div>
    </div>
)

const controlStyle = (scale: number = 1) => ({
    width: style.mainWidth,
    height: style.controlHeight,
    margin: style.boardMargin
})
