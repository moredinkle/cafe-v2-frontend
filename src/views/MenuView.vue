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
            <div class="d-flex flex-column justify-end align-start">
              <h2>{{ formattedDate }}</h2>
              <span class="text-subtitle-2">{{ menuDataStoreStore.selectedMenu.status }}</span>
            </div>
            <div class="d-flex flex-column justify-start">
              <template v-if="menuDataStoreStore.selectedMenu.status === 'INACTIVE'">
                <v-btn color="green-darken-2" @click="updateMenuStatus('ACTIVE')">Marcar como activo</v-btn>
              </template>
              <template v-else-if="menuDataStoreStore.selectedMenu.status === 'ACTIVE'">
                <v-btn color="red-darken-2" @click="updateMenuStatus('FINISHED')">Marcar como terminado</v-btn>
              </template>
              <v-btn class="my-1" color="black" append-icon="mdi-file-pdf-box" @click="toPdf">Pdf</v-btn>
            </div>
          </div>
          <template v-if="selectedTab === 0">
            <menu-edit :menu-items="menuItems" @emit-update-items="updateMenuItems" />
          </template>
          <template v-else>
            <menu-report
              :sales-report="salesReport"
              :ushers-report="ushersReport"
              :extras="extras"
              @emit-update-extras="getExtras"
              @emit-update-items="updateMenuItems"
            />
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
import { toExtra, type MenuExtra, type Menu, type MenuItem, type SalesReportRow } from "@/utils/types";
import { useDisplay } from "vuetify";
import { mapStores, mapActions } from "pinia";
import { useMenuDataStore } from "../stores/menu-data-store";
import axios from "axios";
const backendUri = import.meta.env.VITE_BACKEND_URI;
import { exportPdf } from "../utils/pdf";

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
    ...mapActions(useMenuDataStore, [
      "getMenuData",
      "updateExtras",
      "updateActiveMenuItems",
      "updateSalesData",
      "selectMenu",
      "setCurrentMenu",
    ]),
    async getMenuData() {
      const response = await axios.get(`${backendUri}/menus/${this.menuId}/complete`);
      this.menu = response.data.menuData.menu;
      this.menuItems = response.data.menuData.items;
      this.extras = response.data.menuData.extras;
      this.salesReport = response.data.menuData.sales;
      this.ushersReport = response.data.menuData.ushers;
    },

    async getExtras() {
      if (this.menuDataStoreStore.currentMenu.id === this.menuId) {
        await this.updateExtras();
        this.extras = [...this.menuDataStoreStore.currentMenuData.extras];
      } else {
        const response = await axios.get(`${backendUri}/menus/${this.menuDataStoreStore.selectedMenu.id}/extras`);
        this.extras = response.data.data.map((item: any) => {
          const it = toExtra(item);
          return it;
        });
      }
    },

    async updateMenuItems() {
      if (this.menuDataStoreStore.currentMenu.id === this.menuId) {
        await this.updateActiveMenuItems();
        this.menuItems = [...this.menuDataStoreStore.currentMenuData.items];
      } else {
        const response = await axios.get(`${backendUri}/menus/${this.selectedMenu.id}/items`);
        this.menuItems = response.data.data; //?
      }
    },

    async updateMenuStatus(newStatus: "INACTIVE" | "ACTIVE" | "FINISHED") {
      const response = await axios.put(`${backendUri}/menus/${this.selectedMenu.id}`, { status: newStatus });
      if (newStatus === "ACTIVE" && this.menuDataStoreStore.currentMenu.id === this.menuId) {
        this.setCurrentMenu(response.data.updatedMenu as Menu);
        this.setCurrentMenuItems(this.menuItems);
      }
    },

    toPdf() {
      const totalSales = this.salesReport.reduce((acc, obj) => {
        return acc + obj.subtotal;
      }, 0);
      const totalExtras = this.extras.reduce((total, extra) => {
        return extra.type === "INGRESO" ? total + extra.amount : total - extra.amount;
      }, 0);
      exportPdf(this.salesReport, this.ushersReport, this.extras, this.formattedDate, totalSales, totalExtras);
    },
  },

  async created() {
    if (this.menuId === this.menuDataStoreStore.currentMenu.id) {
      if (this.menuDataStoreStore.newSalesFlag) {
        await this.updateSalesData();
      }
      this.menu = { ...this.menuDataStoreStore.currentMenu };
      this.menuItems = [...this.menuDataStoreStore.currentMenuData.items];
      this.extras = [...this.menuDataStoreStore.currentMenuData.extras];
      this.salesReport = [...this.menuDataStoreStore.currentMenuData.sales];
      this.ushersReport = [...this.menuDataStoreStore.currentMenuData.ushers];
    } else {
      await this.getMenuData();
    }
    this.selectMenu(this.menu);
  },
});
</script>
