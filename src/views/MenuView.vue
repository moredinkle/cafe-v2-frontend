<template>
  <v-row>
    <v-col cols="2">
      <div class="d-flex flex-column justify-center">
        <v-btn color="blue" class="my-3" :variant="editSelected ? 'elevated' : 'outlined'" @click="changeTab()">Editar</v-btn>
        <v-btn color="blue" :variant="reportSelected ? 'elevated' : 'outlined'" @click="changeTab()">Cuentas</v-btn>
      </div>
    </v-col>
    <v-col cols="10">
        <h1>Menú: {{menu.date}}</h1>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { useApiUrlStore } from "../stores/generic-store";
import type { Menu } from "@/utils/types";

export default defineComponent({
  name: "MenuView",
  components: {},
  data() {
    return {
      apiUrlStore: useApiUrlStore(),
      editSelected: true,
      reportSelected: false,
      menu: {} as Menu
    };
  },
  methods: {
    async getMenuData() {
      const response = await axios.get(`${this.apiUrlStore.url}/menus/${this.$route.params.id_menu}`);
      this.menu = response.data.data;
      this.formatDate();
    },
    formatDate(){
      const date = new Date(this.menu.date);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
      const formattedDate = date.toLocaleDateString(undefined, options);
      this.menu.date = formattedDate.charAt(0).toLocaleUpperCase() + formattedDate.slice(1);
    },
    changeTab(){
      this.editSelected = !this.editSelected;
      this.reportSelected = !this.reportSelected;
    }
  },
  async created() {
    await this.getMenuData();
  },
});
</script>
