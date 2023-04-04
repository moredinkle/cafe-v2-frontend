import { defineStore } from 'pinia'

export const useApiUrlStore = defineStore('counter', {
  state: () => {
    return { url: 'http://localhost:3000/api/v1' }
  }
})