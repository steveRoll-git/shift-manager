import { useSchedulesStore } from "@/stores/schedules"
import type { Schedule } from "@/types/Schedule"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

export function useSchedule(id: number) {
  const { getSchedule } = useSchedulesStore()

  const loading = ref<boolean>(true)
  const error = ref<string | undefined>()
  const schedule = ref<Schedule | undefined>()

  onMounted(async () => {
    const result = await getSchedule(id)

    loading.value = false

    if (typeof result == "string") {
      error.value = result
    } else {
      schedule.value = result
    }
  })

  return { loading, error, schedule }
}

export function useScheduleFromRoute() {
  const route = useRoute()

  return useSchedule(Number(route.params.scheduleId))
}
