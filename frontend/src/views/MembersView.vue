<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>

<template>
  <main class="membersViewMain">
    <h1>{{ t("title") }}</h1>
  </main>
</template>

<style>
.membersViewMain {
  padding: 0 20%;
}
.membersViewMain > h1 {
  font-size: 40px;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Members"
  },
  "he": {
    "title": "צוות"
  }
}
</i18n>
