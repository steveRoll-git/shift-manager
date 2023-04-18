<script setup lang="ts">
import { useSchedulesStore } from "@/stores/schedules"
import type { Member } from "@/types/Member"
import type { Schedule } from "@/types/Schedule"
import type { ShiftType } from "@/types/ShiftType"
import type { DateTime } from "luxon"
import { computed } from "vue"
import NameBlock from "./NameBlock.vue"

const props = defineProps<{
  schedule: Schedule
  date: DateTime
  shiftType: ShiftType
}>()

const emit = defineEmits<{
  (e: "memberClick", member: Member): void
}>()

const { getMemberList } = useSchedulesStore()

const memberList = computed(() => getMemberList(props.schedule, props.date, props.shiftType))

/**
 * List of members that _aren't_ currently in this shift
 */
const otherMembers = computed(() => props.schedule.members.filter((m) => !memberList.value.has(m)))
</script>

<template>
  <div class="memberSelector">
    <NameBlock
      v-for="member in otherMembers"
      :key="member.id"
      :member="member"
      style="cursor: pointer"
      @click="emit('memberClick', member)"
    />
  </div>
</template>

<style>
.memberSelector {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0;
  right: 0;
  margin: auto;
  top: calc(100% + 5px);
  width: 100%;

  background-color: rgb(151, 239, 255);
  border: 2px solid black;
  border-radius: 6px;
  z-index: 2;
  padding: 2px;
}

.memberSeparator {
  background-color: #00000026;
  height: 2px;
  margin: 3px;
}
</style>
