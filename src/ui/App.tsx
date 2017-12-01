import * as React from "react"
import * as ReactDOM from "react-dom"
import { Store } from "redux"
import { createStore } from "redux"
import { Provider } from "react-redux"
import { Game, GameState } from "ui/containers/Game"
import { reducers } from "ui/reducers"
import { initialBoard } from "ui/constants"

export function start(dom: HTMLElement | null) {
    let store = createStore<GameState>(
        reducers,
        {
            cells: initialBoard,
            turn: "b"
        }
    )

    ReactDOM.render(
        <App store={store} />,
        dom
    )
}

export interface AppProps {
    store: Store<GameState>
}
const App = ({ store }: AppProps) => (
    <Provider store={store}>
        <Game />
    </Provider>
)
