<template>
  <v-snackbar :color="color" :timeout="timer" v-model="showSnackbar">
    {{ message }}
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "SnackBar",
  data() {
    return {
      showSnackbar: false,
      message: "",
      color: "success",
      timer: 3000,
    };
  },
  methods: {
    show(message: string, color: string, timer: number) {
      this.message = message || 'missing "message".';
      this.color = color || "success";
      this.timer = timer || 3000;
      this.showSnackbar = true;
    },
  },
});
</script>
