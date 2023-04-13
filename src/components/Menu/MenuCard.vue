<template>
  <v-card :title="title" :subtitle="dayOfMenu" :text="cardText" variant="outlined" @click.stop="goToMenu()">
  </v-card>
</template>

<script lang="ts">
import type { Menu } from "@/utils/types";
import { defineComponent } from "vue";

export default defineComponent({
  data()  {
    return {
      dayOfMenu: '',
      cardText: `Total recaudado: 100Bs`,
      title: '',
      days: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    }

  },
  props: {
    menu: {
      type: Object as () => Menu,
      default: {} as Menu,
    },
  },
  methods: {
    goToMenu(){
      this.$router.push(`/menus/${this.menu.id}`);
    },
    displayData(){
      const date = new Date(this.menu.date);
      this.title = date.toLocaleDateString();
      this.dayOfMenu = this.days[date.getDay()];
    }
  },
  created(){
    this.displayData();
  }
});
</script>
