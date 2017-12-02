import * as React from "react"
import { Place, CellState, Color } from "ui/types"
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
        { props.state != "." ?
            <span style={stoneStyle(props.state)} /> :
            null
        }
    </div>
)

const cellStyle = (scale: number = 1) => ({
    float: "left",
    width: style.cellWidth * scale,
    height: style.cellWidth * scale,
    margin: style.cellMargin * scale,
    background: "#090"
})

const stoneStyle = (color: Color, scale: number = 1) => ({
    display: "inline-block",
    width: (style.cellWidth - style.stoneMargin * 2) * scale,
    height: (style.cellWidth - style.stoneMargin * 2) * scale,
    borderRadius: style.cellWidth * scale,
    background: color == "b" ? "#000" : "#fff",
    margin: style.stoneMargin
})
