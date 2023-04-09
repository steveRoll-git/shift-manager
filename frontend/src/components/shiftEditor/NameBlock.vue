<script setup lang="ts">
import type { Member } from "@/types/Member"

const props = defineProps<{
  member: Member
}>()
</script>

<template>
  <div class="nameBlock">
    {{ props.member.name }}
  </div>
</template>

<style>
.nameBlock {
  width: fit-content;
}
</style>
