import { reactive } from "vue"
import { defineStore } from "pinia"
import type { Schedule } from "@/types/Schedule"
import type { DateTime } from "luxon"
import type { ShiftType } from "@/types/ShiftType"
import type { GetScheduleError } from "@/types/errors/GetScheduleError"

export const useSchedulesStore = defineStore("schedules", () => {
  const schedules: Map<number, Schedule> = new Map()

  /**
   * According to a schedule id, fetches the data if necessary
   * and returns a reactive object that represents the schedule.
   * @param id The id of the schedule
   * @returns A reactive object that represents the schedule.
   */
  async function getSchedule(id: number): Promise<Schedule | GetScheduleError> {
    if (!schedules.has(id)) {
      const response = await fetch(`/api/schedules/${id}`)
      if (response.status == 404) {
        return "scheduleNotFound"
      } else if (!response.ok) {
        return "serverError"
      }
      const schedule = await response.json()
      schedules.set(
        id,
        reactive({
          ...schedule,
          shifts: new Map()
        })
      )
    }
    return schedules.get(id)!
  }

  /**
   * Returns a reactive list of members in the specified schedule, date and shift type.
   *
   * The given `schedule` must be reactive.
   * @param schedule
   * @param date
   * @param shiftType
   */
  function getMemberList(schedule: Schedule, date: DateTime, shiftType: ShiftType) {
    if (!schedule.shifts.has(date.valueOf())) {
      schedule.shifts.set(date.valueOf(), new Map())
    }
    const shiftMap = schedule.shifts.get(date.valueOf())!
    if (!shiftMap.has(shiftType.id)) {
      shiftMap.set(shiftType.id, [])
    }
    return shiftMap.get(shiftType.id)!
  }

  return { getSchedule, getMemberList }
})
