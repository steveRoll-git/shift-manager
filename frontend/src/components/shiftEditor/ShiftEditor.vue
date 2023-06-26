<script setup lang="ts">
import DayContainer from "./DayContainer.vue"
import type { Schedule } from "@/types/Schedule"
import type { DateTime } from "luxon"
import { useSchedulesStore } from "@/stores/schedules"
import { nextTick, onMounted, onUpdated, ref, watch } from "vue"
import smoothScroll, { type Scroller } from "@/smoothScroll"
import { cubicOut } from "@/ease"

const { fetchShiftsCached } = useSchedulesStore()

const props = defineProps<{
  numColumns: number
  numRows: number
  schedule: Schedule
  initialDate: DateTime
  editMode: boolean
}>()

const initialDate = ref(props.initialDate)

const overflowContainer = ref<HTMLDivElement | null>(null)
const dayContainers = ref<InstanceType<typeof DayContainer>[]>([])

let dayScroller: Scroller | undefined

// Returns an array of the days visible in this editor
function getDaysList(): DateTime[] {
  return Array.from({ length: props.numColumns * props.numRows }, (i, j) =>
    initialDate.value.plus({ days: j })
  )
}

function decrementWeek() {
  initialDate.value = initialDate.value.minus({ weeks: 1 })
}
function incrementWeek() {
  initialDate.value = initialDate.value.plus({ weeks: 1 })
}

function scrollToCenter() {
  if (dayScroller) {
    dayScroller.cancel = true
  }
  const centerDay = dayContainers.value[Math.floor(dayContainers.value.length / 2)].dayBackground
  dayScroller = smoothScroll(overflowContainer.value!, centerDay!, 250, {
    onFinish: () => (dayScroller = undefined),
    ease: cubicOut
  })
}

watch(
  initialDate,
  async () => {
    await fetchShiftsCached(props.schedule, getDaysList())
  },
  { immediate: true }
)

onMounted(() => {
  new ResizeObserver(() => {
    scrollToCenter()
  }).observe(overflowContainer.value!)
  nextTick(() => setTimeout(scrollToCenter, 100))
})

onUpdated(() => {
  setTimeout(scrollToCenter, 1)
})
</script>

<template>
  <div class="editorContainer">
    <div style="display: flex; flex-direction: column; gap: 12px; margin: 5px">
      <button @click="decrementWeek">
        <img src="@/assets/upArrow.svg" width="24" height="12" />
      </button>
      <button @click="incrementWeek">
        <img src="@/assets/downArrow.svg" width="24" height="12" />
      </button>
    </div>
    <div class="dayOverflowContainer" ref="overflowContainer">
      <div class="dayGrid">
        <DayContainer
          v-for="(date, i) in getDaysList()"
          :key="date.valueOf()"
          :ref="
          (e) => {
            // The type of `e` isn't really correct in this case, so this hack is needed
            dayContainers[i] = e as unknown as InstanceType<typeof DayContainer>
          }
        "
          :column="(i % numColumns) + 1"
          :initial-row="Math.floor(i / numColumns) * (schedule.shiftTypes.length + 1) + 1"
          :schedule="schedule"
          :date="date"
          :edit-mode="editMode"
          @members-modified="() => nextTick(scrollToCenter)"
        ></DayContainer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dayGrid {
  display: grid;
  column-gap: var(--day-grid-gap);
  grid-auto-flow: column;
  grid-template-columns: repeat(v-bind("props.numColumns"), 200px);
  grid-template-rows: repeat(
    calc(v-bind("(props.schedule.shiftTypes.length + 1) * props.numRows")),
    max-content
  );
  user-select: none;
  padding: 100px 5px;

  font-size: 20px;
}
</style>

<style>
.editorContainer {
  height: 0px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dayOverflowContainer {
  height: 100%;
  overflow: hidden;
}
</style>
