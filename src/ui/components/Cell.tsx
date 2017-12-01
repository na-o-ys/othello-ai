import * as React from "react"
import { Place, CellState } from "ui/types"
import * as styleConst from "ui/styleConstants"

export interface CellProps {
    place: Place,
    state: CellState,
    scale?: number
}

export const Cell = (props: CellProps) => (
    <div style={cellStyle()} >{ props.state }</div>
)

const cellStyle = (scale: number = 1) => ({
    float: "left",
    width: styleConst.cellWidth * scale,
    height: styleConst.cellWidth * scale,
    margin: styleConst.cellMargin * scale
})