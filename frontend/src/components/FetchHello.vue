<script setup lang="ts">
import { useHelloStore } from "@/stores/hello"

const { hello, fetchHello } = useHelloStore()

if (!hello.loaded) {
  fetchHello()
}
</script>

<template>
  <p v-if="hello.error">Error:<br />{{ hello.error }}</p>
  <p v-else-if="hello.loaded">{{ hello.data }}</p>
  <p v-else>Loading...</p>
</template>
