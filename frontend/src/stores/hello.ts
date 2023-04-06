import { ref } from "vue"
import { defineStore } from "pinia"

export interface HelloData {
  loaded: boolean
  data?: string
  error?: string
}

export const useHelloStore = defineStore("hello", () => {
  const hello = ref<HelloData>({ loaded: false })

  async function fetchHello() {
    try {
      const response = await fetch("/api/")
      if (response.ok) {
        hello.value.data = await response.text()
        hello.value.loaded = true
      } else {
        hello.value.error = response.statusText
      }
    } catch (error) {
      hello.value.error = String(error)
    }
  }

  return { hello, fetchHello }
})
