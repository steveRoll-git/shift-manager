import type { Member } from "./Member"
import type { ShiftType } from "./ShiftType"

export interface Schedule {
  id: number
  name: string
  shiftTypes: ShiftType[]
  /**
   * Map where key is valueOf a date, and value is a map of `ShiftType`'s
   * ids and the members for that shift for that day.
   */
  shifts: Map<number, Map<number, Member[]>>
}
