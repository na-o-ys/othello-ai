import * as React from "react"
import { Place, CellState } from "ui/types"
import * as style from "ui/constants/style"

export interface CellProps {
    place: Place,
    state: CellState,
    scale?: number,
    onClick: () => void
}


export const Cell = (props: CellProps) => (
    <div
        style={cellStyle()}
        onClick={props.onClick}
    >
        { props.state }
    </div>
)

const cellStyle = (scale: number = 1) => ({
    float: "left",
    width: style.cellWidth * scale,
    height: style.cellWidth * scale,
    margin: style.cellMargin * scale
})