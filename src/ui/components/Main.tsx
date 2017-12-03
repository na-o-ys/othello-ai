import * as _ from "lodash"
import * as React from "react"
import { Place, CellState, Color } from "ui/types"
import { Board, BoardProps, OnClickCell } from "ui/components/Board"
import { Control } from "ui/components/Control"
import * as style from "ui/constants/style"

export interface MainProps {
    cells: CellState[],
    turn: Color,
    onClickCell: OnClickCell,
    onClickPass: () => void,
    onClickPrev: () => void,
    launchAi: () => void,
    shouldPass: boolean,
    playerColor: Color,
    black: number,
    white: number
}

export class Main extends React.Component<MainProps, {}> {
    constructor(readonly props: MainProps) {
        super(props)
    }

    componentDidUpdate() {
        console.log(`${this.props.black} - ${this.props.white}`)
        console.log(
            _.chunk(this.props.cells, 8)
                .map(row => row.join(""))
                .join("\n")
        )
        if (this.props.turn != this.props.playerColor) {
            process.nextTick(() => this.props.launchAi())
        }
    }

    render() {
        return (
            <div style={mainStyle()}>
                <Board cells={this.props.cells} onClickCell={this.props.onClickCell} />
                <Control
                    shouldPass={this.props.shouldPass}
                    onClickPass={this.props.onClickPass}
                    onClickPrev={this.props.onClickPrev}
                    black={this.props.black}
                    white={this.props.white}
                />
            </div>            
        )
    }
}

const mainStyle = (scale: number = 1) => ({
    width: style.mainWidth,
    height: style.mainHeight
})
