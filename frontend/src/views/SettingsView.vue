<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>

<template>
  <main class="settingsViewMain">
    <h1>{{ t("title") }}</h1>
  </main>
</template>

<style>
.settingsViewMain {
  padding: 0 20%;
}
.settingsViewMain > h1 {
  font-size: 40px;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Schedule Settings"
  },
  "he": {
    "title": "הגדרות לו\"ז"
  }
}
</i18n>
