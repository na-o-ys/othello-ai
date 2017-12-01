import * as React from "react"
import * as _ from "lodash"
import { Place, CellState } from "ui/types"
import { Cell } from "ui/components/Cell"
import * as style from "ui/constants/style"

export interface BoardProps {
    cells: CellState[],
    onClickCell: OnClickCell
}