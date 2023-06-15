import { reactive } from "vue"
import { defineStore } from "pinia"
import { shiftKey, type Schedule } from "@/types/Schedule"
import { DateTime } from "luxon"
import type { ShiftType } from "@/types/ShiftType"
import type { GetScheduleError } from "@/types/errors/GetScheduleError"
import type { Member } from "@/types/Member"

type GetShiftsResponse = {
  scheduleId: number
  shiftTypeId: number
  memberId: number
  date: DateTime
}[]

export const useSchedulesStore = defineStore("schedules", () => {
  const schedules: Map<number, Schedule> = new Map()
  const members: Map<number, Member> = new Map()
  const shiftTypes: Map<number, ShiftType> = new Map()
  const fetchedShifts: Map<number, Set<number>> = new Map()

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
          originalShifts: new Map(),
          editedShifts: new Map()
        })
      )
      for (const member of schedule.members) {
        members.set(member.id, member)
      }
      for (const shiftType of schedule.shiftTypes) {
        shiftTypes.set(shiftType.id, shiftType)
      }
      fetchedShifts.set(id, new Set())
    }
    return schedules.get(id)!
  }

  /**
   * Fetches the schedule's shifts within the specified dates.
   * @param schedule
   */
  async function fetchShifts(schedule: Schedule, dates: DateTime[]) {
    const options = new URLSearchParams()
    for (const date of dates) {
      options.append("dates[]", date.toISODate()!)
    }
    const response = await fetch(`/api/schedules/${schedule.id}/shifts?${options}`)
    //TODO error handling if needed
    const shifts: GetShiftsResponse = (await response.json()).map((o: any) => {
      return { ...o, date: DateTime.fromISO(o.date) }
    })
    for (const shift of shifts) {
      const key = shiftKey(shift.date, shift.shiftTypeId)
      if (!schedule.originalShifts.has(key)) {
        schedule.originalShifts.set(key, new Set())
      }
      schedule.originalShifts.get(key)?.add(members.get(shift.memberId)!)
    }
  }

  /**
   * Like `fetchShifts`, but only fetches dates that weren't fetched
   * with `fetchShiftsCached` before.
   * @param schedule
   */
  async function fetchShiftsCached(schedule: Schedule, dates: DateTime[]) {
    dates = dates.filter((d) => !fetchedShifts.get(schedule.id)!.has(d.valueOf()))
    if (dates.length == 0) {
      return
    }
    for (const date of dates) {
      fetchedShifts.get(schedule.id)!.add(date.valueOf())
    }
    fetchShifts(schedule, dates)
  }

  return { getSchedule, fetchShifts, fetchShiftsCached }
})
