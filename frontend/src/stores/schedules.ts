import { reactive } from "vue"
import { defineStore } from "pinia"
import type { Schedule } from "@/types/Schedule"
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
      for (const member of schedule.members) {
        members.set(member.id, member)
      }
      for (const shiftType of schedule.shiftTypes) {
        shiftTypes.set(shiftType.id, shiftType)
      }
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
      shiftMap.set(shiftType.id, new Set())
    }
    return shiftMap.get(shiftType.id)!
  }

  /**
   * Fetches the schedule's shifts within the specified date range.
   *
   * If ranges are not provided, all of the schedule's shifts will be fetched.
   * @param schedule
   * @param minDate
   * @param maxDate
   */
  async function fetchShifts(schedule: Schedule, minDate?: DateTime, maxDate?: DateTime) {
    const options = new URLSearchParams()
    if (minDate) {
      options.append("minDate", minDate.toISODate()!)
    }
    if (maxDate) {
      options.append("maxDate", maxDate.toISODate()!)
    }
    const response = await fetch(`/api/schedules/${schedule.id}/shifts?${options}`)
    //TODO error handling if needed
    const shifts: GetShiftsResponse = (await response.json()).map((o: any) => {
      return { ...o, date: DateTime.fromISO(o.date) }
    })
    for (const shift of shifts) {
      const memberList = getMemberList(schedule, shift.date, shiftTypes.get(shift.shiftTypeId)!)
      memberList.add(members.get(shift.memberId)!)
    }
  }

  return { getSchedule, getMemberList, fetchShifts }
})
