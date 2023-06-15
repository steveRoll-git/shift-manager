import type { DateTime } from "luxon"
import type { Member } from "./Member"
import type { ShiftType } from "./ShiftType"

declare const _shiftKey: unique symbol
/**
 * A key that is the product of a DateTime and a shift type.
 */
export type ShiftKey = string & { [_shiftKey]: true }

/**
 * A map that stores which members are in which shift type for each day.
 */
type ShiftMap = Map<ShiftKey, Set<Member>>

export interface Schedule {
  id: number
  name: string
  members: Member[]
  shiftTypes: ShiftType[]
  /**
   * The schedule's shifts as they were last published.
   */
  originalShifts: ShiftMap
  /**
   * Contains any shifts that the user edited.
   *
   * If a shift is not present in this map, it means the user hasn't edited it,
   * therefore it's the same as in `originalShifts`.
   */
  editedShifts: ShiftMap
}

export function shiftKey(date: DateTime, shiftType: number): ShiftKey {
  return (date.valueOf() + " " + shiftType) as ShiftKey
}

export function getShiftSet(schedule: Schedule, date: DateTime, shiftType: number) {
  const key = shiftKey(date, shiftType)
  return schedule.editedShifts.get(key) ?? schedule.originalShifts.get(key) ?? new Set()
}
