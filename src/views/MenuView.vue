<template>
  <v-row>
    <v-col md="2">
      <div :class="mdAndUp ? mdTabsClass : smTabsClass">
        <v-btn
          color="indigo-darken-3"
          elevation="4"
          prepend-icon="mdi-pencil-box-outline"
          class="my-3 d-flex justify-start mx-1"
          :variant="editSelected ? 'elevated' : 'outlined'"
          @click="selectEditTab()"
          >Editar</v-btn
        >
        <v-btn
          color="indigo-darken-3"
          elevation="4"
          prepend-icon="mdi-notebook-outline"
          class="d-flex justify-start mx-1"
          :variant="reportSelected ? 'elevated' : 'outlined'"
          @click="selectReportTab()"
          >Cuentas</v-btn
        >
      </div>
    </v-col>

    <v-col cols="12" md="10">
      <template v-if="editSelected">
        <menu-edit :menu="menu" :menu-items="menuItems" @emit-update-items="updateMenuItems" />
      </template>
      <template v-else>
        <menu-report :menu="menu" :sales-report="salesReport" />
      </template>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MenuEdit from "@/components/Menu/MenuEdit.vue";
import MenuReport from "@/components/Menu/MenuReport.vue";
import type { Menu, MenuItem, SalesReportRow } from "@/utils/types";
import { useDisplay } from "vuetify";
import { mapStores, mapActions } from "pinia";
import { useMenuDataStore } from "../stores/menu-data-store";
import axios from "axios";
import { toReportRow } from "../utils/types";
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
      editSelected: true,
      reportSelected: false,
      menu: {} as Menu,
      menuItems: [] as MenuItem[],
      salesReport: [] as SalesReportRow[],
      menuId: this.$route.params.id_menu as string,
    };
  },
  computed: {
    ...mapStores(useMenuDataStore),
    formattedDate() {
      const date = new Date(this.menu.date);
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;
      const formattedDate = date.toLocaleDateString(undefined, options);
      return formattedDate.charAt(0).toLocaleUpperCase() + formattedDate.slice(1);
    },
  },
  methods: {
    ...mapActions(useMenuDataStore, ["getCurrentMenuData", "updateActiveMenuItems"]),
    async getMenuData() {
      const response = await axios.get(`${backendUri}/menus/${this.$route.params.id_menu}/complete`);
      this.menu = response.data.data.menu;
      this.menuItems = response.data.data.items;
      this.menu.date = this.formattedDate;
    },

    async getSalesReport() {
      const response = await axios.get(`${backendUri}/menus/${this.menu.id}/sales-report`);
      this.salesReport = response.data.data.map((row: any) => {
        return toReportRow(row);
      });
    },

    async updateMenuItems() {
      if (this.menu.status === "ACTIVE") {
        await this.updateActiveMenuItems();
        this.menuItems = [...this.menuDataStoreStore.currentMenuItems];
      } else {
        const response = await axios.get(`${backendUri}/menus/${this.$route.params.id_menu}/items`);
        this.menuItems = response.data.data;
      }
    },

    selectReportTab() {
      if (this.editSelected) {
        this.editSelected = false;
      }
      this.reportSelected = true;
    },

    selectEditTab() {
      if (this.reportSelected) {
        this.reportSelected = false;
      }
      this.editSelected = true;
    },
  },
  async created() {
    if (this.menuId === this.menuDataStoreStore.currentMenu.id) {
      this.menu = { ...this.menuDataStoreStore.currentMenu };
      this.menuItems = [...this.menuDataStoreStore.currentMenuItems];
      this.menu.date = this.formattedDate;
    } else {
      await this.getMenuData();
    }
    await this.getSalesReport();
  },
});
</script>
