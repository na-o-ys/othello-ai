import * as React from "react"
import * as ReactDOM from "react-dom"
import { Board } from "ui/components/Board"
import { InitialBoard } from "ui/constants"

export const App = () => (
    <Board cells={InitialBoard} />
)

export function start(dom: HTMLElement | null) {
    ReactDOM.render(
        <App />,
        dom
    )
}
