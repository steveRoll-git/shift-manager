<script setup lang="ts">
import { DateTime } from "luxon"
import ShiftEditor from "@/components/shiftEditor/ShiftEditor.vue"
import { useSchedulesStore } from "@/stores/schedules"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import swal from "sweetalert"
import axios, { type AxiosResponse } from "axios"
import { unpackShiftKey, type Schedule } from "@/types/Schedule"
import { onMounted, ref } from "vue"

type Shift = {
  shiftTypeId: number
  memberId: number
  date: string
}

const route = useRoute()

const { t } = useI18n({
  inheritLocale: true,
  useScope: "local"
})

const { getSchedule } = useSchedulesStore()

let loading = ref<boolean>(true)
let error = ref<string | undefined>()
let schedule: Schedule | undefined

const editMode = ref<boolean>(false)

async function publishChanges() {
  let diffs: {
    addShifts: Shift[]
    removeShifts: Shift[]
  } = {
    addShifts: [],
    removeShifts: []
  }

  for (const pair of schedule!.editedShifts) {
    const [key, newShift] = pair
    const shiftType = unpackShiftKey(key)
    const originalShift = schedule!.originalShifts.get(key)
    if (originalShift) {
      // Go over all members and figure out which of them were added or removed
      for (const member of schedule!.members) {
        if (originalShift.has(member) && !newShift.has(member)) {
          diffs.removeShifts.push({ ...shiftType, memberId: member.id })
        } else if (!originalShift.has(member) && newShift.has(member)) {
          diffs.addShifts.push({ ...shiftType, memberId: member.id })
        }
      }
    } else {
      // This shift did not exist at all originally - all of the new members must be added
      diffs.addShifts.push(
        ...[...newShift].map((member) => ({ ...shiftType, memberId: member.id }))
      )
    }
  }

  console.log(diffs)

  let result: AxiosResponse | null = null
  let error = undefined
  try {
    result = await axios.put(`/api/schedules/${schedule!.id}/shifts`, diffs)
  } catch (e) {
    error = e
  }

  if (result && result.status == 200) {
    // Edited shifts now become the original shifts
    for (const newShift of schedule!.editedShifts) {
      schedule!.originalShifts.set(...newShift)
    }
    schedule!.editedShifts.clear()

    swal({
      text: t("published.success.text"),
      icon: "success"
    })
  } else {
    swal({
      text: t("published.error.text") + "\n" + String(error),
      icon: "error"
    })
  }
}

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
  <main class="scheduleViewMain">
    <div v-if="loading">{{ t("loading") }}</div>
    <template v-else-if="schedule">
      <div class="scheduleToolbar">
        <button @click="editMode = !editMode">
          {{ !editMode ? "Start editing" : "Stop editing" }}
        </button>
        <button v-if="editMode" :disabled="schedule.editedShifts.size == 0" @click="publishChanges">
          Publish Changes
        </button>
      </div>
      <ShiftEditor
        :initialDate="DateTime.local(2023, 3, 26)"
        :numColumns="7"
        :numRows="7"
        :schedule="schedule"
        :editMode="editMode"
      />
    </template>
    <div v-else-if="error" class="errorBox">
      <img src="@/assets/error.svg" width="36" height="36" />
      {{ t(error) }}
    </div>
  </main>
</template>

<style>
.scheduleViewMain {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scheduleToolbar {
  display: flex;
  width: 50%;
}
</style>

<i18n>
{
  "en": {
    "scheduleNotFound": "The schedule you are trying to view does not exist, or you do not have permission to view it.",
    "serverError": "There was an error showing the schedule.",
    "loading": "Loading...",
    "published": {
      "success": {
        "text": "Your changes to the schedule have been published.",
      },
      "error": {
        "text": "There was an error while publishing your changes."
      }
    }
  },
  "he": {
    "scheduleNotFound": "הלו\"ז שאתם מנסים להציג אינו קיים, או שאין לכם הרשאות לצפות בו.",
    "serverError": "קרתה שגיאה בטעינת הלו\"ז.",
    "loading": "טוען...",
    "published": {
      "success": {
        "text": "השינויים שלכם ללו\"ז פורסמו בהצלחה.",
      },
      "error": {
        "text": "קרתה שגיאה בזמן פרסום השינויים שלכם."
      }
    }
  }
}
</i18n>
