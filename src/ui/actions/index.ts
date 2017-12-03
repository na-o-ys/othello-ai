import { Place } from "ui/types"

export type Action = ClickCellAction | ClickPrevAction | ClickPassAction | LaunchAiAction

interface ClickCellAction {
    type: "click_cell"
    place: Place
}
export function clickCell(place: Place): ClickCellAction {
    return { type: "click_cell", place }
}

interface ClickPrevAction {
    type: "click_prev"
}
export const clickPrev = { type: "click_prev" }

interface ClickPassAction {
    type: "click_pass"
}
export const clickPass = { type: "click_pass" }

interface LaunchAiAction {
    type: "launch_ai"
}
export const aiMove = { type: "launch_ai" }