<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps<{
  open: boolean
}>()

const e = defineEmits<{
  overlayClicked: []
}>()
</script>

<template>
  <div :class="{ overlay: true, open }" @click="e('overlayClicked')"></div>
  <div :class="{ sidebar: true, collapsed: !open }">
    <div class="sidebarTitle">
      {{}}
    </div>
    <div class="sidebarItem">
      <img src="@/assets/sidebar/schedule.png" />
      {{ t("schedule") }}
    </div>
    <div class="sidebarItem">
      <img src="@/assets/sidebar/members.png" />
      {{ t("members") }}
    </div>
    <div class="sidebarItem">
      <img src="@/assets/sidebar/settings.png" />
      {{ t("settings") }}
    </div>
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
      "schedule": "Schedule",
      "members": "Members",
      "settings": "Settings",
    },
    "he": {
      "schedule": "משמרות",
      "members": "צוות",
      "settings": "הגדרות",
    }
  }
</i18n>
