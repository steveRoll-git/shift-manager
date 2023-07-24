<script setup lang="ts">
import ScheduleLoader from "@/components/ScheduleLoader.vue"
import MemberCard from "@/components/membersView/MemberCard.vue"
import { useScheduleFromRoute } from "@/composables/schedule"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const { loading, error, schedule } = useScheduleFromRoute()
</script>

<template>
  <main class="membersViewMain">
    <h1>{{ t("title") }}</h1>
    <ScheduleLoader :loading="loading" :error="error" :schedule="schedule" v-slot="loaded">
      <div class="membersTable">
        <MemberCard v-for="member in loaded.schedule.members" :key="member.id" :member="member" />
      </div>
    </ScheduleLoader>
  </main>
</template>

<style scoped>
.membersViewMain {
  padding: 0 30%;
}
.membersViewMain > h1 {
  font-size: 40px;
  margin-bottom: 50px;
}

.membersTable {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
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
