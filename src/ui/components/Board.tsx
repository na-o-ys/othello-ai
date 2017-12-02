import * as React from "react"
import * as _ from "lodash"
import { Place, CellState } from "ui/types"
import { Cell } from "ui/components/Cell"
import * as style from "ui/constants/style"

export interface BoardProps {
    cells: CellState[],
    onClickCell: OnClickCell
}

export interface OnClickCell {
    (place: Place): void
}

export const Board = (props: BoardProps) => (
    <div style={boardStyle()}>
    {_.range(8).map(rowIdx => (
        <BoardRow
            key={rowIdx}
            rowIdx={rowIdx}
            cells={props.cells.slice(rowIdx * 8, (rowIdx + 1) * 8)}
            onClickCell={props.onClickCell}
        />
    ))}
    </div>
)

const boardStyle = (scale: number = 1) => ({
    width: style.boardWidth,
    height: style.boardWidth,
    margin: style.boardMargin
})

export interface BoardRowProps {
    rowIdx: number,
    cells: CellState[],
    onClickCell: OnClickCell
}

export const BoardRow = (props: BoardRowProps) => (
    <div style={boardRowStyle()}>
    {_.range(8).map(colIdx => (
        <Cell
            key={colIdx}
            place={{ x: colIdx, y: props.rowIdx }}
            state={props.cells[colIdx]}
            onClick={() => props.onClickCell({ x: colIdx, y: props.rowIdx })}
        />
    ))}
    </div>
)

const boardRowStyle = (scale: number = 1) => ({
    width: style.boardWidth,
    height: style.cellWidth + style.cellMargin * 2
})
