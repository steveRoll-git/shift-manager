<script setup lang="ts">
import { useI18n } from "vue-i18n"
import type { DateTime } from "luxon"
import PlusButton from "./PlusButton.vue"
import NameBlock from "./NameBlock.vue"
import type { Member } from "@/types/Member"
import { reactive, ref } from "vue"
import { getShiftSet as _getShiftSet, modifyShift, shiftKey, type Schedule } from "@/types/Schedule"
import MemberSelector from "./MemberSelector.vue"
import { vOnClickOutside } from "@vueuse/components"
import type { ShiftType } from "@/types/ShiftType"

const { t } = useI18n({
  inheritLocale: true,
  useScope: "local"
})

const props = defineProps<{
  column: number
  initialRow: number
  schedule: Schedule
  date: DateTime
  editMode: boolean
}>()

const emit = defineEmits<{
  (e: "membersModified"): void
}>()

const editingShift = reactive<{
  editing: boolean
  shiftType?: number
}>({
  editing: false
})

function getShiftSet(shiftType: number) {
  return _getShiftSet(props.schedule, props.date, shiftType)
}

const dayBackground = ref<HTMLDivElement | null>(null)

function plusButtonClicked(shiftType: ShiftType) {
  // Don't open the member selector if all members have been added
  if (getShiftSet(shiftType.id).size == props.schedule.members.length) {
    return
  }
  editingShift.editing = true
  editingShift.shiftType = shiftType.id
}

function addMember(shiftType: ShiftType, member: Member) {
  modifyShift(props.schedule, shiftKey(props.date, shiftType.id), "add", member)

  // Close the member selector when all members have been added
  if (
    shiftType.id == editingShift.shiftType &&
    getShiftSet(shiftType.id).size == props.schedule.members.length
  ) {
    editingShift.editing = false
  }

  emit("membersModified")
}

function removeMember(shiftType: ShiftType, member: Member) {
  modifyShift(props.schedule, shiftKey(props.date, shiftType.id), "remove", member)
  emit("membersModified")
}

defineExpose({
  dayBackground
})
</script>

<template>
  <div class="dayBackground" ref="dayBackground"></div>
  <div class="dayHeader">
    {{ date.day }}/{{ date.month }}
    <span class="weekDayTitle">{{ t(`weekDays[${props.date.weekday % 7}]`) }}</span>
  </div>
  <div
    v-for="(shiftType, i) in schedule.shiftTypes"
    :key="shiftType.id"
    :class="{
      shiftContainer: true,
      modifiedShift: schedule.editedShifts.has(shiftKey(date, shiftType.id))
    }"
    :style="{ gridRow: props.initialRow + 1 + i }"
  >
    <NameBlock
      v-for="member in getShiftSet(shiftType.id)"
      :key="member.id"
      :member="member"
      :show-remove-button="editMode"
      @remove-clicked="removeMember(shiftType, member)"
    ></NameBlock>
    <PlusButton v-if="editMode" @click="plusButtonClicked(shiftType)" />

    <Transition name="slide-fade">
      <MemberSelector
        v-if="editingShift.editing && editingShift.shiftType == shiftType.id"
        :schedule="schedule"
        :date="props.date"
        :shift-type="shiftType"
        @member-click="addMember(shiftType, $event)"
        v-on-click-outside="() => (editingShift.editing = false)"
      />
    </Transition>
  </div>
</template>

<style scoped>
.weekDayTitle {
  font-size: 75%;
  line-height: 75%;
  margin-top: 5px;
}

.dayHeader {
  background-color: rgb(190, 225, 255);
  margin: 0 0 var(--shift-sections-gap);
  grid-row: v-bind("props.initialRow");
  grid-column: v-bind("props.column");
  border-radius: 9px 9px 0 0;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: var(--day-grid-gap);
  padding-top: 5px;
}

.dayBackground {
  grid-column: v-bind("props.column");
  grid-row: v-bind("props.initialRow") / span calc(v-bind("props.schedule.shiftTypes.length") + 1);
  background-color: rgb(234, 234, 234);
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.31);
  border-radius: 10px;
  margin-top: var(--day-grid-gap);
}

.shiftContainer {
  grid-column: v-bind("props.column");
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  padding: 2px;
  margin: 0 var(--shift-sections-gap) var(--shift-sections-gap);
  min-height: 21px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.modifiedShift {
  background-color: lightyellow;
}
</style>

<i18n>
  {
    "en": {
      "weekDays": [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
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
