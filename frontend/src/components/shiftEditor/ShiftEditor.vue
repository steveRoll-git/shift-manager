<script setup lang="ts">
import DayContainer from "./DayContainer.vue"
import type { Schedule } from "@/types/Schedule"
import type { DateTime } from "luxon"
import { useSchedulesStore } from "@/stores/schedules"

const { fetchShifts } = useSchedulesStore()

const props = defineProps<{
  numColumns: number
  numRows: number
  schedule: Schedule
  initialDate: DateTime
}>()

// Returns an array of the days visible in this editor
function getDaysList(): DateTime[] {
  return Array.from({ length: props.numColumns * props.numRows }, (i, j) =>
    props.initialDate.plus({ days: j })
  )
}

fetchShifts(props.schedule, props.initialDate, props.initialDate.plus({ days: props.numColumns }))
</script>

<template>
  <div class="shiftEditor">
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
.shiftEditor {
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
