<script setup lang="ts">
import { DateTime } from "luxon"
import ShiftEditor from "@/components/shiftEditor/ShiftEditor.vue"
import { useSchedulesStore } from "@/stores/schedules"

const { getSchedule } = useSchedulesStore()
</script>

<template>
  <main class="editorContainer">
    <!--TODO use view params-->
    <ShiftEditor
      :initialDate="DateTime.local(2023, 4, 2)"
      :numColumns="7"
      :schedule="getSchedule(1)!"
    />
  </main>
</template>

<style>
.editorContainer {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
