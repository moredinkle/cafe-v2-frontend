<template>
  <v-card :title="title" :subtitle="dayOfMenu" text="" variant="outlined" @click.stop="goToMenu()">
    <div class="mb-2">
      <span :class='`px-3 text-body-2 text-${textColor}`'>{{ cardText }}</span>
    </div>
  </v-card>
</template>

<script lang="ts">
import type { Menu } from "@/utils/types";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    menu: {
      type: Object as () => Menu,
      default: {} as Menu,
    },
  },
  data()  {
    return {
      dayOfMenu: '',
      title: '',
      textColor: '',
      cardText: '',
      days: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    }
  },
  methods: {
    goToMenu(){
      this.$router.push(`/menus/${this.menu.id}`);
    },
    displayData(){
      const date = new Date(this.menu.date);
      this.title = date.toLocaleDateString();
      this.dayOfMenu = this.days[date.getDay()];
      switch(this.menu.status) {
        case 'ACTIVE': {
          this.cardText = 'ACTIVO';
          this.textColor ='green-darken-3';
          break;
        }
        case 'INACTIVE': {
          this.cardText = 'INACTIVO';
          this.textColor ='blue-grey-lighten-2';
          break;
        }
        case 'FINISHED': {
          this.cardText = 'TERMINADO';
          this.textColor ='orange-darken-3';
          break;
        }
      }
    }
  },
  created(){
    this.displayData();
  }
});
</script>
