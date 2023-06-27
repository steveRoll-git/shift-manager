<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import { useI18n } from "vue-i18n"
import isRtl from "./isRtl"
import { ref } from "vue"

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
  <div :class="{ overlay: true, open: sidebarOpen }" @click="closeSidebar"></div>
  <div :class="{ sidebar: true, collapsed: !sidebarOpen }"></div>

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

.sidebar {
  position: fixed;
  width: 350px;
  height: 100vh;
  background-color: rgb(186, 223, 255);
  z-index: 2;
  transition: 0.3s;
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

[dir="rtl"] .sidebar.collapsed {
  transform: translateX(100%);
}

.sidebar:not(.collapsed) {
  box-shadow: 7px 0px 6px -3px rgba(0, 0, 0, 0.1);
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
