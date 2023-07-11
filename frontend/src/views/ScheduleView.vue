<script setup lang="ts">
import { DateTime } from "luxon"
import ShiftEditor from "@/components/shiftEditor/ShiftEditor.vue"
import ScheduleLoader from "@/components/ScheduleLoader.vue"
import { useI18n } from "vue-i18n"
import swal from "sweetalert"
import axios, { type AxiosResponse } from "axios"
import { unpackShiftKey } from "@/types/Schedule"
import { ref } from "vue"
import { useScheduleFromRoute } from "@/composables/schedule"

type Shift = {
  shiftTypeId: number
  memberId: number
  date: string
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: "local"
})

const { loading, error, schedule } = useScheduleFromRoute()

const editMode = ref<boolean>(false)

async function publishChanges() {
  let diffs: {
    addShifts: Shift[]
    removeShifts: Shift[]
  } = {
    addShifts: [],
    removeShifts: []
  }

  for (const pair of schedule.value!.editedShifts) {
    const [key, newShift] = pair
    const shiftType = unpackShiftKey(key)
    const originalShift = schedule.value!.originalShifts.get(key)
    if (originalShift) {
      // Go over all members and figure out which of them were added or removed
      for (const member of schedule.value!.members) {
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
    result = await axios.put(`/api/schedules/${schedule.value!.id}/shifts`, diffs)
  } catch (e) {
    error = e
  }

  if (result && result.status == 200) {
    // Edited shifts now become the original shifts
    for (const newShift of schedule.value!.editedShifts) {
      schedule.value!.originalShifts.set(...newShift)
    }
    schedule.value!.editedShifts.clear()

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
</script>

<template>
  <main class="scheduleViewMain">
    <ScheduleLoader :loading="loading" :error="error" :schedule="schedule" v-slot="loaded">
      <div class="scheduleToolbar">
        <button @click="editMode = !editMode">
          {{ !editMode ? "Start editing" : "Stop editing" }}
        </button>
        <button
          v-if="editMode"
          :disabled="loaded.schedule.editedShifts.size == 0"
          @click="publishChanges"
        >
          Publish Changes
        </button>
      </div>
      <ShiftEditor
        :initialDate="DateTime.local(2023, 3, 26)"
        :numColumns="7"
        :numRows="7"
        :schedule="loaded.schedule"
        :editMode="editMode"
      />
    </ScheduleLoader>
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
