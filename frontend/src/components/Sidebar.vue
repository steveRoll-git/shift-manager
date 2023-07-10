<script setup lang="ts">
import { useSchedulesStore } from "@/stores/schedules"
import type { Schedule } from "@/types/Schedule"
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

const { t } = useI18n()

const route = useRoute()

const { getSchedule } = useSchedulesStore()

const props = defineProps<{
  open: boolean
}>()

const schedule = ref<Schedule | null>(null)

const scheduleButtons = [
  {
    to: "schedule",
    img: "/src/assets/sidebar/schedule.png",
    text: "shifts"
  },
  {
    to: "scheduleMembers",
    img: "/src/assets/sidebar/members.png",
    text: "members"
  },
  {
    to: "scheduleSettings",
    img: "/src/assets/sidebar/settings.png",
    text: "settings"
  }
]

watch(
  () => route.params.scheduleId,
  async (value) => {
    if (value) {
      const loadedSchedule = await getSchedule(Number(value))
      if (typeof loadedSchedule != "string") {
        schedule.value = loadedSchedule
      }
    } else {
      schedule.value = null
    }
  }
)

const e = defineEmits<{
  closeSidebar: []
}>()
</script>

<template>
  <div :class="{ overlay: true, open }" @click="e('closeSidebar')"></div>
  <div :class="{ sidebar: true, collapsed: !open }">
    <template v-if="route.params.scheduleId && schedule">
      <div class="sidebarTitle">{{ schedule.name }}</div>
      <RouterLink
        v-for="sidebarButton in scheduleButtons"
        :key="sidebarButton.to"
        :to="{ name: sidebarButton.to, params: { scheduleId: schedule.id } }"
        @click="e('closeSidebar')"
        class="sidebarItem"
        :class="{ current: route.name == sidebarButton.to }"
      >
        <img :src="sidebarButton.img" />
        {{ t(sidebarButton.text) }}
      </RouterLink>
    </template>
  </div>
</template>

<style>
.sidebar {
  position: fixed;
  width: 350px;
  height: 100vh;
  background-color: rgb(184, 222, 255);
  z-index: 2;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

[dir="rtl"] .sidebar.collapsed {
  transform: translateX(100%);
}

.sidebar:not(.collapsed) {
  box-shadow: 0px 0px 6px 3px rgba(0, 0, 0, 0.1);
}

.sidebarTitle {
  font-size: 35px;
  margin: 10px;
}

.sidebarItem {
  width: 100%;
  height: 45px;
  padding: 5px 0;
  padding-inline-start: 30px;
  font-size: 20px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  color: inherit;
}
.sidebarItem.current {
  border-inline-start: 8px solid rgb(82, 161, 192);
  background-color: rgba(255, 255, 255, 0.288);
}
.sidebarItem:hover {
  background-color: rgba(255, 255, 255, 0.414);
}
.sidebarItem img {
  max-height: 100%;
  margin-inline-end: 10px;
}

.overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  transition: 0.3s;
}
.overlay.open {
  background-color: rgba(0, 0, 0, 0.178);
  pointer-events: all;
}
</style>

<i18n>
  {
    "en": {
      "shifts": "Shifts",
      "members": "Members",
      "settings": "Settings",
    },
    "he": {
      "shifts": "משמרות",
      "members": "צוות",
      "settings": "הגדרות",
    }
  }
</i18n>
