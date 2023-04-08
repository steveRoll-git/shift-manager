import { reactive } from "vue"
import { defineStore } from "pinia"
import type { Schedule } from "@/types/Schedule"

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
          shiftTypes: [{ id: 1 }, { id: 2 }, { id: 3 }],
          shifts: new Map()
        })
      )
    }
    return schedules.get(id)
  }

  return { getSchedule }
})
