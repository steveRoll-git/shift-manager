<script setup lang="ts">
import type { Schedule } from "@/types/Schedule"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

defineProps<{
  loading: boolean
  error: string | undefined
  schedule: Schedule | undefined
}>()
</script>

<template>
  <div v-if="loading">{{ t("loading") }}</div>
  <template v-else-if="schedule">
    <slot :schedule="schedule"></slot>
  </template>
  <div v-else-if="error" class="errorBox">
    <img src="@/assets/error.svg" width="36" height="36" />
    {{ t(error) }}
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "scheduleNotFound": "The schedule you are trying to view does not exist, or you do not have permission to view it.",
    "serverError": "There was an error showing the schedule.",
    "loading": "Loading..."
  },
  "he": {
    "scheduleNotFound": "הלו\"ז שאתם מנסים להציג אינו קיים, או שאין לכם הרשאות לצפות בו.",
    "serverError": "קרתה שגיאה בטעינת הלו\"ז.",
    "loading": "טוען..."
  }
}
</i18n>
