<template>
  <v-card :title="title" :subtitle="subtitle" :text="text" variant="outlined" @click.stop="goToMenu()">
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => {},
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    text: String
  },
  methods: {
    goToMenu(){
      // this.$router.push(`menus/${}`)
      console.log("menu elegido");
    }
  }
});
</script>
