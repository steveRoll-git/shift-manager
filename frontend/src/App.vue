<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import { useI18n } from "vue-i18n"
import isRtl from "./isRtl"

const { t, locale } = useI18n({
  inheritLocale: true,
  useScope: "local"
})

if (isRtl(locale.value as unknown as string)) {
  document.querySelector("body")?.setAttribute("dir", "rtl")
}
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/schedule/2">Test Schedule</RouterLink>
    </nav>
  </header>

  <div class="mainContent">
    <RouterView />
  </div>
</template>

<style scoped>
.mainContent {
  flex: 1 1 auto;
}

nav {
  display: flex;
  gap: 5px;
  padding: 5px;
}
</style>
