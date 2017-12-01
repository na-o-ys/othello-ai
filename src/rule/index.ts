import { GameDescription } from "GameDescription"

export function canMove(desc: GameDescription, x: number, y: number): boolean {
    return true
}

export function move(desc: GameDescription, x: number, y: number): GameDescription {
    return desc
}