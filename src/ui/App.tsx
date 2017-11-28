import * as React from "react"
import * as ReactDOM from "react-dom"
import { Hello } from "ui/components/Hello"

export const App = () => (
    <Hello />
)

export function start(dom: HTMLElement | null) {
    ReactDOM.render(
        <App />,
        dom
    )
}
