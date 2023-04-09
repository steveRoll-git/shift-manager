import { reactive } from "vue"
import { defineStore } from "pinia"
import type { Schedule } from "@/types/Schedule"
import type { DateTime } from "luxon"
import type { ShiftType } from "@/types/ShiftType"
import type { Member } from "@/types/Member"

export const useSchedulesStore = defineStore("schedules", () => {
  const schedules: Map<number, Schedule> = new Map()

  /**
   * According to a schedule id, fetches the data if necessary
   * and returns a reactive object that represents the schedule.
   * @param id The id of the schedule
   * @returns A reactive object that represents the schedule.
   */
  function getSchedule(id: number) {
    if (!schedules.has(id)) {
      // TODO fetching code
      schedules.set(
        id,
        reactive({
          id,
          name: "test",
          members: [
            { id: 4, name: "Anna" },
            { id: 3, name: "Josh" },
            { id: 2, name: "Ori" }
          ],
          shiftTypes: [{ id: 1 }, { id: 2 }, { id: 3 }],
          shifts: new Map()
        })
      )
    }
    return schedules.get(id)
  }

  /**
   * Returns a reactive list of members in the specified schedule, date and shift type.
   * @param schedule
   * @param date
   * @param shiftType
   */
  function getMemberList(schedule: Schedule, date: DateTime, shiftType: ShiftType): Member[] {
    const rSchedule = getSchedule(schedule.id)
    if (!rSchedule?.shifts.has(date.valueOf())) {
      rSchedule?.shifts.set(date.valueOf(), new Map())
    }
    const shiftMap = rSchedule?.shifts.get(date.valueOf())!
    if (!shiftMap.has(shiftType.id)) {
      shiftMap.set(shiftType.id, [])
    }
    return shiftMap.get(shiftType.id)!
  }

  return { getSchedule, getMemberList }
})
