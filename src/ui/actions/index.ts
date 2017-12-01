import { Place } from "ui/types"

export type Action = ClickCellAction

interface ClickCellAction {
    type: "click_cell"
    place: Place
}
export function clickCell(place: Place): ClickCellAction {
    return { type: "click_cell", place }
}
