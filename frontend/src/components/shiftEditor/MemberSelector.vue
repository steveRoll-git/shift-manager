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

const { getMemberList } = useSchedulesStore()

const memberList = computed(() => getMemberList(props.schedule, props.date, props.shiftType))

/**
 * List of members that _aren't_ currently in this shift
 */
const otherMembers = computed(() =>
  props.schedule.members.filter((m) => !memberList.value.includes(m))
)

function addMember(member: Member) {
  memberList.value.push(member)
}
function removeMember(member: Member) {
  memberList.value.splice(memberList.value.indexOf(member), 1)
}
</script>

<template>
  <div class="memberSelector">
    <NameBlock
      v-for="member in otherMembers"
      :key="member.id"
      :member="member"
      style="cursor: pointer"
      @click="addMember(member)"
    />
    <div class="memberSeparator" v-if="memberList.length > 0 && otherMembers.length > 0"></div>
    <div v-for="member in memberList" :key="member.id" style="display: flex; align-items: center">
      <img
        src="@/assets/remove.svg"
        style="width: calc(var(--name-font-size) * 1.3); cursor: pointer"
        @click="removeMember(member)"
      />
      <NameBlock :member="member" style="opacity: 0.5" />
    </div>
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
