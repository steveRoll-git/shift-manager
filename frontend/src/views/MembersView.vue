<script setup lang="ts">
import ScheduleLoader from "@/components/ScheduleLoader.vue"
import { useScheduleFromRoute } from "@/composables/schedule"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const { loading, error, schedule } = useScheduleFromRoute()
</script>

<template>
  <main class="membersViewMain">
    <h1>{{ t("title") }}</h1>
    <ScheduleLoader :loading="loading" :error="error" :schedule="schedule">
      <div class="membersTable">
        <span class="membersHeaderText">
          {{ t("header.name") }}
        </span>
        <span class="membersHeaderText">
          {{ t("header.permissions") }}
        </span>
        <span class="membersHeaderText">
          {{ t("header.email") }}
        </span>
      </div>
    </ScheduleLoader>
  </main>
</template>

<style>
.membersViewMain {
  padding: 0 20%;
}
.membersViewMain > h1 {
  font-size: 40px;
  margin-bottom: 50px;
}

.membersTable {
  display: grid;
  grid-template-columns: repeat(3, 1fr) 60px; /* TODO */
}

.membersHeaderText {
  font-size: 24px;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Members",
    "header": {
      "name": "Name",
      "permissions": "Permissions",
      "email": "Email"
    }
  },
  "he": {
    "title": "צוות",
    "header": {
      "name": "שם",
      "permissions": "הרשאות",
      "email": "דוא\"ל"
    }
  }
}
</i18n>
