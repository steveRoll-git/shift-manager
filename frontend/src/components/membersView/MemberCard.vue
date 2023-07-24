<script setup lang="ts">
import type { Member } from "@/types/Member"

defineProps<{
  member: Member
}>()
</script>

<template>
  <div class="memberCard">
    <span class="memberName">{{ member.name }}</span>
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
</style>
