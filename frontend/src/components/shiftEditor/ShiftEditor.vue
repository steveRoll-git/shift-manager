<script setup lang="ts">
import DayContainer from "./DayContainer.vue"
import type { Schedule } from "@/types/Schedule"
import type { DateTime } from "luxon"
import { useSchedulesStore } from "@/stores/schedules"
import { ref } from "vue"

const { fetchShifts } = useSchedulesStore()

const props = defineProps<{
  numColumns: number
  numRows: number
  schedule: Schedule
  initialDate: DateTime
}>()

const initialDate = ref(props.initialDate)

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

fetchShifts(
  props.schedule,
  initialDate.value,
  initialDate.value.plus({ days: props.numColumns * props.numRows })
)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; margin: 5px">
    <img src="@/assets/upArrow.svg" width="24" height="12" @click="decrementWeek" />
    <img src="@/assets/downArrow.svg" width="24" height="12" @click="incrementWeek" />
  </div>
  <div class="dayGrid">
    <DayContainer
      v-for="(date, i) in getDaysList()"
      :key="date.valueOf()"
      :column="(i % numColumns) + 1"
      :initial-row="Math.floor(i / numColumns) * (schedule.shiftTypes.length + 1) + 1"
      :schedule="schedule"
      :date="date"
    ></DayContainer>
  </div>
</template>

<style scoped>
.dayGrid {
  display: grid;
  column-gap: var(--day-grid-gap);
  grid-auto-flow: column;
  grid-template-columns: repeat(v-bind("props.numColumns"), 120px);
  grid-template-rows: repeat(
    calc(v-bind("(props.schedule.shiftTypes.length + 1) * props.numRows")),
    max-content
  );
  user-select: none;

  font-size: 20px;
}
</style>
