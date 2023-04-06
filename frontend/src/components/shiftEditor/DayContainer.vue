<script setup lang="ts">
import { useI18n } from "vue-i18n"
import type { DateTime } from "luxon"
import type ShiftType from "./ShiftType"

const { t, locale } = useI18n({
  inheritLocale: true,
  useScope: "local"
})

const props = defineProps<{
  column: number
  initialRow: number
  shiftTypes: ShiftType[]
  date: DateTime
}>()
</script>

<template>
  <div class="dayBackground"></div>
  <div class="dayHeader">
    <span class="weekDayTitle">{{ t(`weekDays[${props.date.weekday % 7}]`) }}</span>
    {{ date.day }}/{{ date.month }}
  </div>
  <div
    v-for="(shiftType, i) in shiftTypes"
    :key="shiftType.id"
    class="shiftContainer"
    :style="{ gridRow: props.initialRow + 1 + i }"
  ></div>
</template>

<style scoped>
.weekDayTitle {
  font-size: 75%;
  line-height: 75%;
  display: block;
  margin-top: 5px;
}

.dayHeader {
  background-color: rgb(41, 170, 245);
  margin: 0 0 var(--shift-sections-gap);
  grid-row: 1;
  grid-column: v-bind("props.column");
  border-radius: 9px 9px 0 0;
  padding-left: 10px;
  padding-right: 10px;
}

.dayBackground {
  grid-column: v-bind("props.column");
  grid-row: v-bind("props.initialRow") / span calc(v-bind("props.shiftTypes.length") + 1);
  background-color: rgb(116, 116, 116);
  border-radius: 10px;
}

.shiftContainer {
  grid-column: v-bind("props.column");
  background-color: lightblue;
  border-radius: 5px;
  padding: 2px;
  margin: 0 var(--shift-sections-gap) var(--shift-sections-gap);
  min-height: 21px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: baseline;
}
</style>

<i18n>
  {
    "en": {
      "weekDays": [
        "Sun",
        "Mon",
        "Tue",
        "Wen",
        "Thu",
        "Fri",
        "Sat"
      ]
    },
    "he": {
      "weekDays": [
        "א'",
        "ב'",
        "ג'",
        "ד'",
        "ה'",
        "ו'",
        "ש'"
      ]
    }
  }
</i18n>
