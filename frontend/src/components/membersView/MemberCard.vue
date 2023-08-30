<script setup lang="ts">
import type { Member } from "@/types/Member"
import { vOnClickOutside } from "@vueuse/components"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

defineProps<{
  member: Member
}>()

const menuOpen = ref(false)
</script>

<template>
  <div class="memberCard">
    <span class="memberName">{{ member.name }}</span>
    <div class="memberMenuButton">
      <img src="@/assets/menu_vertical.png" width="20" height="20" @click="menuOpen = !menuOpen" />
      <Transition name="slide-fade">
        <div v-if="menuOpen" class="memberMenu" v-on-click-outside="() => (menuOpen = false)">
          <div class="memberMenuItem">
            <img src="@/assets/trash.png" width="20" height="20" />
            {{ t("menuOptions.delete") }}
          </div>
        </div>
      </Transition>
    </div>
    <!-- TODO show member details once they're implemented -->
  </div>
</template>

<style>
.memberCard {
  width: 150px;
  height: 200px;
  padding: 10px;
  border-radius: 6px;
  background-color: rgb(190, 225, 255);
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.31);
}

.memberName {
  font-size: 24px;
}

.memberMenuButton {
  position: absolute;
  top: 0;
  inset-inline-end: 0;
  margin-top: 15px;
  margin-inline-end: 8px;
  cursor: pointer;
}

.memberMenu {
  position: absolute;
  user-select: none;
  z-index: 1;
  top: 100%;
  inset-inline-start: -100%;
  border-radius: 10px;
  width: 140px;
  min-height: 20px;
  padding: 4px;
  background-color: white;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.31);
}

.memberMenuItem {
  display: flex;
  align-items: center;
  gap: 4px;

  border-radius: inherit;
  height: 35px;
  padding: 5px;
  font-size: 18px;
}
.memberMenuItem:hover {
  background-color: rgba(0, 0, 0, 0.07);
}
.memberMenuItem:active {
  background-color: rgba(0, 0, 0, 0.14);
}
</style>

<i18n lang="json">
{
  "en": {
    "menuOptions": {
      "delete": "Delete"
    }
  },
  "he": {
    "menuOptions": {
      "delete": "מחק"
    }
  }
}
</i18n>
