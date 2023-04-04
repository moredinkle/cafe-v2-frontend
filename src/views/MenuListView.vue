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
      <span class="text-h5">Menú activo</span>
      <menu-card class="mt-1" title="1/1/2023" subtitle="Domingo" text="Total recaudado: 100Bs" />
    </v-col>
  </v-row>
  <span class="text-h5">Menús pasados</span>
  <v-row class="my-2">
    <v-col cols="12" sm="4" md="3" v-for="n in 10" :key="n">
      <menu-card title="1/1/2023" subtitle="Domingo" text="Total recaudado: 100Bs" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from 'axios';
import MenuCard from "@/components/Menu/MenuCard.vue";
import { useApiUrlStore } from '../stores/generic-store';


export default defineComponent({
  name: "MenuListView",
  components: {
    MenuCard,
  },
  data() {
    return {
      apiUrlStore: useApiUrlStore(),
      newMenuDate: new Date().toISOString().substr(0, 10),
    };
  },
  methods:{
    async createMenu(){
      console.log(`${this.apiUrlStore.url}/menus`);
      const response = await axios.post(`${this.apiUrlStore.url}/menus`, {date: this.newMenuDate, status: "INACTIVE"});
      console.log(response.data);
      const newId = response.data.newMenuId;
      this.$router.push(`/menus/${newId}`);
    },
  }
});
</script>
