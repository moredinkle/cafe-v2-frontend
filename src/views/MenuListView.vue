<template>
  <v-row class="mb-2">
    <v-col cols="12" sm="6" class="flex-column">
      <span class="text-h5">Nuevo menú</span>
      <v-form class="mt-1">
        <v-row align="baseline">
          <v-col cols="8">
            <v-text-field v-model="newMenuDate" label="Fecha" type="date" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn color="success" block @click="createMenu()" append-icon="mdi-content-save-outline">Crear</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <v-col cols="12" sm="6">
      <span class="text-h5 mb-1">Menú activo</span>
      <v-card
        :title="currentMenu.id ? currentMenuDate : 'Sin menú activo'"
        :text="dayOfMenu"
        @click="goToCurrentMenu()"
        variant="outlined"
        :disabled="currentMenu.id ? false : true"
      ></v-card>
    </v-col>
  </v-row>

  <span class="text-h5">Buscar menús</span>
  <v-row justify="start" align="baseline" class="py-4">
    <v-col cols="6" sm="4" lg="2">
      <v-text-field
        v-model="filterStartDate"
        hide-details="auto"
        label="Fecha inicio"
        type="date"
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="6" sm="4" lg="2">
      <v-text-field
        v-model="filterEndDate"
        hide-details="auto"
        label="Fecha fin"
        type="date"
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="4" lg="2">
      <v-btn color="success" block @click="searchMenus()" append-icon="mdi-folder-search-outline">Buscar</v-btn>
    </v-col>
  </v-row>
  <v-row class="my-2">
    <v-col cols="12" sm="4" md="3" v-for="menu in pastMenus" :key="menu.id">
      <menu-card :menu="menu" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import MenuCard from "@/components/Menu/MenuCard.vue";
import type { Menu } from "../utils/types";
import { mapStores } from "pinia";
import { useMenuDataStore } from "../stores/menu-data-store";

const backendUri = import.meta.env.VITE_BACKEND_URI;

export default defineComponent({
  name: "MenuListView",
  components: {
    MenuCard,
  },
  data() {
    return {
      newMenuDate: "",
      filterStartDate: "",
      filterEndDate: "",
      pastMenus: [] as Menu[],
      currentMenu: {} as Menu,
      days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayOfMenu: "",
    };
  },
  computed: {
    ...mapStores(useMenuDataStore),
    currentMenuDate() {
      const date = new Date(this.currentMenu.date);
      return date.toLocaleDateString();
    },
  },
  methods: {
    async createMenu() {
      const date = new Date(this.newMenuDate);
      const hoursToAdd = 8;
      date.setHours(date.getHours() + hoursToAdd);
      const response = await axios.post(`${backendUri}/menus`, { date: date.toISOString(), status: "INACTIVE" });
      const newId = response.data.newMenuId;
      this.$router.push(`/menus/${newId}`);
    },

    async searchMenus() {
      const hoursToAdd = 8;
      const start = new Date(this.filterStartDate);
      const end = new Date(this.filterEndDate);
      start.setHours(start.getHours() + hoursToAdd);
      end.setHours(end.getHours() + hoursToAdd);
      const response = await axios.get(`${backendUri}/menus?start=${start.toISOString()}&end=${end.toISOString()}`);
      this.pastMenus = response.data.data;
    },

    goToCurrentMenu() {
      this.$router.push(`/menus/${this.currentMenu.id}`);
    },

    setDates() {
      let date = new Date();
      this.filterEndDate = date.toISOString().slice(0, 10);
      this.newMenuDate = date.toISOString().slice(0, 10);
      date.setMonth(date.getMonth() - 1);
      this.filterStartDate = date.toISOString().slice(0, 10);
    },

    setCurrentMenuData() {
      if (this.menuDataStoreStore.currentMenu) {
        this.currentMenu = this.menuDataStoreStore.currentMenu;
        const date = new Date(this.currentMenu.date);
        this.dayOfMenu = this.days[date.getDay()];
      }
    },
  },
  created() {
    this.setDates();
    this.setCurrentMenuData();
  },
});
</script>
