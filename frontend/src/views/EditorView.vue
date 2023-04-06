<script setup lang="ts">
import { DateTime } from "luxon"
import ShiftEditor from "@/components/shiftEditor/ShiftEditor.vue"
</script>

<template>
  <main class="editorContainer">
    <ShiftEditor
      :initialDate="DateTime.local(2023, 4, 2)"
      :numColumns="7"
      :shiftTypes="[{}, {}, {}]"
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
