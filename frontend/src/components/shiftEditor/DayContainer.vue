<script setup lang="ts">
import { useI18n } from "vue-i18n"
import type { DateTime } from "luxon"
import PlusButton from "./PlusButton.vue"
import NameBlock from "./NameBlock.vue"
import type { Member } from "@/types/Member"
import { computed, reactive, type ComputedRef } from "vue"
import type { Schedule } from "@/types/Schedule"
import MemberSelector from "./MemberSelector.vue"
import { vOnClickOutside } from "@vueuse/components"
import { useSchedulesStore } from "@/stores/schedules"
import type { ShiftType } from "@/types/ShiftType"

const { t } = useI18n({
  inheritLocale: true,
  useScope: "local"
})

const { getMemberList } = useSchedulesStore()

const props = defineProps<{
  column: number
  initialRow: number
  schedule: Schedule
  date: DateTime
}>()

const editingShift = reactive<{
  editing: boolean
  shiftType?: number
}>({
  editing: false
})

const shiftsMap: ComputedRef<Map<number, Set<Member>>> = computed(
  () => props.schedule.shifts.get(props.date.valueOf()) ?? new Map()
)

function plusButtonClicked(shiftType: ShiftType) {
  // Don't open the member selector if all members have been added
  if (getMemberList(props.schedule, props.date, shiftType).size == props.schedule.members.length) {
    return
  }
  editingShift.editing = true
  editingShift.shiftType = shiftType.id
}

function addMember(shiftType: ShiftType, member: Member) {
  const memberList = getMemberList(props.schedule, props.date, shiftType)
  memberList.add(member)
  // Close the member selector when all members have been added
  if (shiftType.id == editingShift.shiftType && memberList.size == props.schedule.members.length) {
    editingShift.editing = false
  }
}

function removeMember(shiftType: ShiftType, member: Member) {
  const memberList = getMemberList(props.schedule, props.date, shiftType)
  memberList.delete(member)
}
</script>

<template>
  <div class="dayBackground"></div>
  <div class="dayHeader">
    {{ date.day }}/{{ date.month }}
    <span class="weekDayTitle">{{ t(`weekDays[${props.date.weekday % 7}]`) }}</span>
  </div>
  <div
    v-for="(shiftType, i) in schedule.shiftTypes"
    :key="shiftType.id"
    class="shiftContainer"
    :style="{ gridRow: props.initialRow + 1 + i }"
  >
    <NameBlock
      v-for="member in shiftsMap.get(shiftType.id)"
      :key="member.id"
      :member="member"
      :show-remove-button="true"
      @remove-clicked="removeMember(shiftType, member)"
    ></NameBlock>
    <PlusButton @click="plusButtonClicked(shiftType)" />

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
  background-color: rgb(41, 170, 245);
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
  background-color: rgb(116, 116, 116);
  border-radius: 10px;
  margin-top: var(--day-grid-gap);
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
