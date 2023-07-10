<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import { useI18n } from "vue-i18n"
import isRtl from "./isRtl"
import { ref } from "vue"
import Sidebar from "./components/Sidebar.vue"

const { t, locale } = useI18n({
  inheritLocale: true,
  useScope: "local"
})

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
function closeSidebar() {
  sidebarOpen.value = false
}

if (isRtl(locale.value as unknown as string)) {
  document.querySelector("body")?.setAttribute("dir", "rtl")
}
</script>

<template>
  <Sidebar :open="sidebarOpen" @close-sidebar="closeSidebar" />

  <header>
    <nav>
      <img src="@/assets/menu.svg" width="40" class="menuButton" @click="toggleSidebar" />
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

nav > * {
  margin: auto 0;
}

.menuButton {
  margin: 5px;
  cursor: pointer;
  z-index: 3;
}
</style>
