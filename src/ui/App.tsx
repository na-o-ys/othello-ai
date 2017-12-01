import * as React from "react"
import * as ReactDOM from "react-dom"
import { Store, Middleware } from "redux"
import { applyMiddleware, createStore } from "redux"
import { createLogger } from "redux-logger"
import { Provider } from "react-redux"
import { Game, GameState } from "ui/containers/Game"
import { reducers } from "ui/reducers"
import { initialBoard } from "ui/constants"
import { bench } from "bench"

const middleWares: Middleware[] = [
    process.env.NODE_ENV !== "production" && createLogger() as any
].filter(Boolean)

export function start(dom: HTMLElement | null) {
    bench()
    let store = createStore<GameState>(
        reducers,
        {
            cells: initialBoard,
            turn: "b"
        },
        applyMiddleware(...middleWares)
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
