<script setup lang="ts">
import type { Member } from "@/types/Member"
import { getShiftSet, type Schedule } from "@/types/Schedule"
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

const memberList = computed(() => getShiftSet(props.schedule, props.date, props.shiftType.id))

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
  flex-wrap: wrap;
  left: 0;
  right: 0;
  margin: auto;
  top: calc(100% + 5px);
  width: 100%;

  background-color: rgb(255, 255, 255);
  border-top: 5px solid rgb(153, 209, 255);
  border-radius: 6px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.3);
  z-index: 2;
  padding: 2px;
}

.memberSeparator {
  background-color: #00000026;
  height: 2px;
  margin: 3px;
}
</style>
