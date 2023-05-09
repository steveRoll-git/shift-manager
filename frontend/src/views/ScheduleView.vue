<script setup lang="ts">
import { DateTime } from "luxon"
import ShiftEditor from "@/components/shiftEditor/ShiftEditor.vue"
import { useSchedulesStore } from "@/stores/schedules"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import type { Schedule } from "@/types/Schedule"
import { onMounted, ref } from "vue"

const route = useRoute()

const { t } = useI18n({
  inheritLocale: true,
  useScope: "local"
})

const { getSchedule } = useSchedulesStore()

let loading = ref<boolean>(true)
let error = ref<string | undefined>()
let schedule: Schedule | undefined

onMounted(async () => {
  const result = await getSchedule(Number(route.params.id))

  loading.value = false

  if (typeof result == "string") {
    error.value = result
  } else {
    schedule = result
  }
})
</script>

<template>
  <main class="editorContainer">
    <div v-if="loading">{{ t("loading") }}</div>
    <ShiftEditor
      v-else-if="schedule"
      :initialDate="DateTime.local(2023, 3, 26)"
      :numColumns="7"
      :numRows="7"
      :schedule="schedule"
    />
    <div v-else-if="error" class="errorBox">
      <img src="@/assets/error.svg" width="36" height="36" />
      {{ t(error) }}
    </div>
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

<i18n>
{
  "en": {
    "scheduleNotFound": "The schedule you are trying to view does not exist, or you do not have permission to view it.",
    "serverError": "There was an error showing the schedule.",
    "loading": "Loading...",
  },
  "he": {
    "scheduleNotFound": "הלו\"ז שאתם מנסים להציג אינו קיים, או שאין לכם הרשאות לצפות בו.",
    "serverError": "קרתה שגיאה בטעינת הלו\"ז.",
    "loading": "טוען...",
  }
}
</i18n>
