<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components"

defineProps<{
  title?: string
}>()

const e = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="modalOverlay">
      <div class="modal" v-on-click-outside="() => e('close')">
        <img
          src="@/assets/remove.svg"
          width="16"
          height="16"
          class="modalCloseButton"
          @click="e('close')"
        />
        <div class="modalTitle">
          {{ title }}
        </div>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style>
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.2);
}

.modal {
  background-color: white;
  width: max(25vw, 300px);
  min-height: 200px;
  max-height: 80vh;
  padding: 15px;
  box-shadow: 0px 8px 16px 1px rgba(0, 0, 0, 0.37);
}

.modalCloseButton {
  position: absolute;
  inset-inline-end: 16px;
  top: 16px;
  cursor: pointer;
  z-index: 1;
}

.modalTitle {
  font-size: 34px;
  margin-bottom: 16px;
}

.modalButtonRow {
  position: absolute;
  bottom: 0;
  margin-bottom: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.modalButtonRow > * {
  width: 75px;
}
</style>
