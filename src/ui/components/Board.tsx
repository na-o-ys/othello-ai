import * as React from "react"
import * as _ from "lodash"
import { Place, CellState } from "ui/types"
import { Cell } from "ui/components/Cell"
import * as styleConst from "ui/styleConstants"

export interface BoardProps {
    cells: CellState[]
}

export const Board = (props: BoardProps) => (
    <div style={boardStyle()}>
    {_.range(8).map(rowIdx => (
        <BoardRow
            key={rowIdx}
            rowIdx={rowIdx}
            cells={props.cells.slice(rowIdx * 8, (rowIdx + 1) * 8)}
        />
    ))}
    </div>
)

const boardStyle = (scale: number = 1) => ({
    width: styleConst.boardWidth,
    height: styleConst.boardWidth
})

export interface BoardRowProps {
    rowIdx: number,
    cells: CellState[]
}

export const BoardRow = (props: BoardRowProps) => (
    <div style={boardRowStyle()}>
    {_.range(8).map(colIdx => (
        <Cell
            key={colIdx}
            place={{ x: colIdx, y: props.rowIdx }}
            state={props.cells[colIdx]}
        />
    ))}
    </div>
)

const boardRowStyle = (scale: number = 1) => ({
    width: styleConst.boardWidth,
    height: styleConst.cellWidth + styleConst.cellMargin * 2
})