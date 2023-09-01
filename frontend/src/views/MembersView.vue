<script setup lang="ts">
import ScheduleLoader from "@/components/ScheduleLoader.vue"
import MemberCard from "@/components/membersView/MemberCard.vue"
import { useScheduleFromRoute } from "@/composables/schedule"
import { useI18n } from "vue-i18n"
import { ref } from "vue"
import MemberModal from "@/components/membersView/MemberModal.vue"
import type { Member } from "@/types/Member"

export type EditingMember = Member & {
  isNew?: boolean
}

const { t } = useI18n()

const { loading, error, schedule } = useScheduleFromRoute()

const editingMember = ref<EditingMember | undefined>(undefined)
</script>

<template>
  <main class="membersViewMain">
    <h1>{{ t("title") }}</h1>
    <ScheduleLoader :loading="loading" :error="error" :schedule="schedule" v-slot="loaded">
      <button class="addMemberButton" @click="editingMember = { id: 0, name: '', isNew: true }">
        <img src="@/assets/plus.png" width="16" height="16" />
        {{ t("addMember") }}
      </button>
      <div class="membersTable">
        <MemberCard v-for="member in loaded.schedule.members" :key="member.id" :member="member" />
      </div>
      <MemberModal
        v-if="editingMember"
        :schedule="loaded.schedule"
        :member="editingMember"
        @close="() => (editingMember = undefined)"
      >
      </MemberModal>
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

.addMemberButton {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
    "addMember": "Add Member",
    "header": {
      "name": "Name",
      "permissions": "Permissions",
      "email": "Email"
    }
  },
  "he": {
    "title": "צוות",
    "addMember": "הוסף",
    "header": {
      "name": "שם",
      "permissions": "הרשאות",
      "email": "דוא\"ל"
    }
  }
}
</i18n>
