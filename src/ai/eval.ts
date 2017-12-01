import { GameDescription } from "bitboard/GameDescription"
import * as Rule from "bitboard/rule"

export function evaluate(desc: GameDescription): number {
    return Rule.movables(desc).length
}