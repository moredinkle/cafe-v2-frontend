<template>
  <v-row>
    <v-col md="2">
      <div :class="mdAndUp ? mdTabsClass : smTabsClass">
        <v-btn
          color="indigo-darken-3"
          elevation="4"
          prepend-icon="mdi-pencil-box-outline"
          class="my-3 d-flex justify-start mx-1"
          :variant="selectedTab === 0 ? 'elevated' : 'outlined'"
          @click="selectedTab = 0"
          >Editar</v-btn
        >
        <v-btn
          color="indigo-darken-3"
          elevation="4"
          prepend-icon="mdi-notebook-outline"
          class="d-flex justify-start mx-1"
          :variant="selectedTab === 1 ? 'elevated' : 'outlined'"
          @click="selectedTab = 1"
          >Cuentas</v-btn
        >
      </div>
    </v-col>

    <v-col cols="12" md="10">
      <v-card rounded>
        <div class="px-3">
          <div class="d-flex flex-wrap justify-space-between align-center mt-2">
            <div class="d-flex flex-column justify-end">
              <h2>{{ formattedDate }}</h2>
              <span class="text-subtitle-2">{{ menuDataStoreStore.selectedMenu.status }}</span>
            </div>
            <template v-if="menuDataStoreStore.selectedMenu.status === 'INACTIVE'">
            <v-btn
              color="green-darken-2"
              @click="updateMenuStatus('ACTIVE')"
              >Marcar como activo</v-btn
            >
            </template>
            <template v-else-if="menuDataStoreStore.selectedMenu.status === 'ACTIVE'">
            <v-btn
              color="red-darken-2"
              @click="updateMenuStatus('FINISHED')"
              >Marcar como terminado</v-btn
            >
            </template>
          </div>
          <template v-if="selectedTab === 0">
            <menu-edit :menu-items="menuItems" @emit-update-items="updateMenuItems" />
          </template>
          <template v-else>
            <menu-report :sales-report="salesReport" :ushers-report="ushersReport" :extras="extras" @emit-update-extras="getExtras"/>
          </template>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MenuEdit from "@/components/Menu/MenuEdit.vue";
import MenuReport from "@/components/Menu/MenuReport.vue";
import { toExtra, toReportRow, type MenuExtra, type Menu, type MenuItem, type SalesReportRow } from "@/utils/types";
import { useDisplay } from "vuetify";
import { mapStores, mapActions } from "pinia";
import { useMenuDataStore } from "../stores/menu-data-store";
import axios from "axios";
const backendUri = import.meta.env.VITE_BACKEND_URI;

export default defineComponent({
  name: "MenuView",
  components: {
    MenuEdit,
    MenuReport,
  },
  setup() {
    const { mdAndUp } = useDisplay();
    return { mdAndUp };
  },
  data() {
    return {
      smTabsClass: "d-flex justify-start align-center",
      mdTabsClass: "d-flex flex-column justify-center",
      selectedTab: 0,
      reportSelected: false,
      menu: {} as Menu,
      extras: [] as MenuExtra[],
      menuItems: [] as MenuItem[],
      salesReport: [] as SalesReportRow[],
      ushersReport: [] as SalesReportRow[],
      menuId: this.$route.params.id_menu as string,
    };
  },
  computed: {
    ...mapStores(useMenuDataStore),
    selectedMenu(): Menu {
      return this.menuDataStoreStore.selectedMenu;
    },
    formattedDate(): string {
      const date = new Date(this.menuDataStoreStore.selectedMenu.date);
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;
      const formattedDate = date.toLocaleDateString(undefined, options);
      return formattedDate.charAt(0).toLocaleUpperCase() + formattedDate.slice(1);
    },
  },
  methods: {
    ...mapActions(useMenuDataStore, ["getCurrentMenuData", "updateActiveMenuItems", "selectMenu", "setCurrentMenu"]),
    async getMenuData() {
      const response = await axios.get(`${backendUri}/menus/${this.menuId}/complete`);
      this.menu = response.data.data.menu;
      this.menuItems = response.data.data.items;
    },

    async getSalesReport() {
      const response = await axios.get(`${backendUri}/menus/${this.selectedMenu.id}/sales`);
      this.salesReport = response.data.data.map((row: any) => {
        return toReportRow(row);
      });
    },

    async getUshersReport() {
      const response = await axios.get(`${backendUri}/menus/${this.selectedMenu.id}/ushers`);
      this.ushersReport = response.data.data.map((row: any) => {
        return toReportRow(row);
      });
    },
    
    async getExtras(){
      const response = await axios.get(`${backendUri}/menus/${this.menuDataStoreStore.selectedMenu.id}/extras`);
      this.extras = response.data.data.map((item: any) => {
        const it = toExtra(item);
        return it;
      });
    },

    async updateMenuItems() {
      const response = await axios.get(`${backendUri}/menus/${this.selectedMenu.id}/items`);
      this.menuItems = response.data.data;
    },

    async updateMenuStatus(newStatus: "INACTIVE" | "ACTIVE" | "FINISHED") {
      const response = await axios.put(`${backendUri}/menus/${this.selectedMenu.id}`, {status: newStatus});
      if(newStatus === "ACTIVE" && this.menuDataStoreStore.currentMenu.id === this.menuId) {
        this.setCurrentMenu(response.data.updatedMenu as Menu);
        this.setCurrentMenuItems(this.menuItems);
      }
    },
  },

  async created() {
    if (this.menuId === this.menuDataStoreStore.currentMenu.id) {
      this.menu = { ...this.menuDataStoreStore.currentMenu };
      this.menuItems = [...this.menuDataStoreStore.currentMenuItems];
    } else {
      await this.getMenuData();
    }
    this.selectMenu(this.menu);
    await this.getSalesReport();
    await this.getUshersReport();
    await this.getExtras();
  },
});
</script>
