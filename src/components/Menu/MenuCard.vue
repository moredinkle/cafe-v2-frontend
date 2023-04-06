<template>
  <v-card :title="title" :subtitle="dayOfMenu" :text="cardText" variant="outlined" @click.stop="goToMenu()">
  </v-card>
</template>

<script lang="ts">
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
    date: {
      type: String,
      default: ''
    },
    menuId: {
      type: String,
      default: ''
    },
  },
  methods: {
    goToMenu(){
      this.$router.push(`/menus/${this.menuId}`);
    },
    displayData(){
      const date = new Date(this.date);
      this.title = date.toLocaleDateString();
      this.dayOfMenu = this.days[date.getDay()];
      console.log(this.date);
    }
  },
  created(){
    this.displayData();
  }
});
</script>
