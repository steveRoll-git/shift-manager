<script setup lang="ts">
import Modal from "@/components/Modal.vue"
import type { EditingMember } from "@/views/MembersView.vue"
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import type { Schedule } from "@/types/Schedule"
import { useSchedulesStore } from "@/stores/schedules"

const { t } = useI18n()

const { addMember } = useSchedulesStore()

const props = defineProps<{
  schedule: Schedule
  member: EditingMember
}>()

const editingMember: EditingMember = reactive({
  ...props.member
})

const e = defineEmits<{
  close: []
}>()

const error = ref()

async function saveChanges() {
  if (editingMember.isNew) {
    const result = await addMember(props.schedule, { name: editingMember.name })
    if (result.ok) {
      e("close")
    } else {
      error.value = result.error
    }
  } else {
    // TODO update member info
  }
}
</script>

<template>
  <Modal @close="e('close')">
    <label>
      {{ t("name") }}
      <input v-model="editingMember.name" style="margin-inline-start: 6px" />
    </label>
    <div class="modalButtonRow">
      <div v-if="error" class="errorBox">
        {{ t("serverError") }}
      </div>
      <button @click="saveChanges" :disabled="!editingMember.name">{{ t("save") }}</button>
    </div>
  </Modal>
</template>

<i18n lang="json">
{
  "en": {
    "name": "Name:",
    "save": "Save",
    "serverError": "Something went wrong"
  },
  "he": {
    "name": "שם:",
    "save": "שמור",
    "serverError": "משהו השתבש"
  }
}
</i18n>
