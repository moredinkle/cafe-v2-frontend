<template>
  <v-row class="mb-2">
    <v-col cols="12" sm="6" class="flex-column">
      <span class="text-h5">Nuevo menú</span>
      <v-form class="mt-1">
        <v-row>
          <v-col cols="8">
            <v-text-field v-model="newMenuDate" label="Fecha" type="date" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn color="success" block @click="createMenu()">Crear</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
    <v-col cols="12" sm="6">
      <span class="text-h5 mb-1">Menú activo</span>
      <menu-card :date="currentMenu.date" :menuId="currentMenu.id" />
    </v-col>
  </v-row>
  <span class="text-h5">Menús pasados</span>
  <v-row class="my-2">
    <v-col cols="12" sm="4" md="3" v-for="menu in pastMenus" :key="menu.id">
      <menu-card :date="menu.date" :menuId="menu.id" />
    </v-col>
  </v-row>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import axios from 'axios';
import MenuCard from "@/components/Menu/MenuCard.vue";
import type { Menu } from '../utils/types';

const backendUri = import.meta.env.VITE_BACKEND_URI;


export default defineComponent({
  name: "MenuListView",
  components: {
    MenuCard,
  },
  data() {
    return {
      newMenuDate: new Date().toISOString().slice(0, 10),
      pastMenus: [] as Menu[],
      currentMenu: {} as Menu
    };
  },
  methods:{
    async createMenu(){
      const response = await axios.post(`${backendUri}/menus`, {date: this.newMenuDate, status: "INACTIVE"});
      const newId = response.data.newMenuId;
      this.$router.push(`/menus/${newId}`);
    },

    async getMenus(){
      const response = await axios.get(`${backendUri}/menus`);
      const rawMenus = response.data.data;
      rawMenus.map((menu: Menu) => {
        if(menu.status==="ACTIVE"){
          this.currentMenu = menu;
        }
        else {
          this.pastMenus.push(menu);
        }
      });
    },

  },
  async created(){
    await this.getMenus();
  }
});
</script>
