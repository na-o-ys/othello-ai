import * as React from "react"
import { Place } from "ui/components/types"

export interface CellProps {
    place: Place
}

export const Cell = (props: CellProps) => (
    <div>{ [props.place.x, props.place.y].join(",") }</div>
)