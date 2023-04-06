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
        <v-card rounded class="px-3">
          <div class="d-flex justify-space-between align-center">
            <h1>{{ menu.date }}</h1>
            <span class="text-subtitle-1 text-red" >{{ menu.status }}</span>
          </div>
          <menu-item-form @addMenuItem="addItemToMenu" />
          <table-component
            class="my-3"
            :headers="tableHeaders"
            :items="menuItems"
            @deleteTableItem="openDeleteDialog"
            @editTableItem="openEditDialog"
            deleteButton
            editButton
            tableTitle="Menú"
          />
        </v-card>
      </template>

      <template v-else>
        <v-card rounded class="px-3">
          <h1>{{ menu.date }}</h1>
          <h3>Aqui van cuentas</h3>
        </v-card>
      </template>
    </v-col>
  </v-row>
  <!-- Popups -->
  <popup-dialog
    :dialog="deleteDialog"
    title="Eliminar"
    @confirm-dialog-action="deleteItem"
    @closeDialog="deleteDialog = false"
    @click:outside="deleteDialog = false"
  >
    <span>Seguro que desea eliminar {{ itemToDelete.name }} del menú?</span>
  </popup-dialog>

  <popup-dialog
    :dialog="editDialog"
    title="Editar"
    action-confirm-text="Guardar"
    @confirm-dialog-action="editItem"
    @closeDialog="editDialog = false"
    @click:outside="editDialog = false"
  >
    <v-form @submit.prevent>
      <v-text-field v-model="itemToEdit.name" :rules="itemNameRules" label="Nombre" type="text"></v-text-field>
      <v-text-field v-model="itemToEdit.stock" :rules="stockRules" label="Stock" type="number"></v-text-field>
    </v-form>
  </popup-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MenuItemForm from "@/components/Menu/MenuItemForm.vue";
import TableComponent from "@/components/UI/TableComponent.vue";
import PopupDialog from "@/components/UI/PopupDialog.vue";
import axios from "axios";
import type { Menu } from "@/utils/types";
import type { MenuItem } from "../utils/types";
import { isProxy, toRaw } from "vue";
import { useDisplay } from "vuetify";
import { mapStores } from 'pinia'
import { useMenuDataStore } from '../stores/menu-data-store';
const backendUri = import.meta.env.VITE_BACKEND_URI;

export default defineComponent({
  name: "MenuView",
  components: {
    MenuItemForm,
    TableComponent,
    PopupDialog,
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
      itemToDelete: {} as MenuItem,
      itemToEdit: {} as MenuItem,
      deleteDialog: false,
      editDialog: false,
      menuId: this.$route.params.id_menu as string,
      tableHeaders: [
        { title: "Nombre", align: "start", key: "name" },
        { title: "Precio", key: "price" },
        { title: "Stock", key: "stock" },
        { title: "Acciones", key: "actions", sortable: false },
      ],
      itemNameRules: [
        (value: string) => {
          if (value?.length > 3) return true;
          return "First name must be at least 3 characters.";
        },
      ],
      stockRules: [
        (value: number) => {
          if (value > 0) return true;
          return "Stock debe ser mayor a 0";
        },
      ],
    };
  },
  computed: {
    ...mapStores(useMenuDataStore),
    formattedDate() {
      const date = new Date(this.menu.date);
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;
      const formattedDate = date.toLocaleDateString(undefined, options);
      return formattedDate.charAt(0).toLocaleUpperCase() + formattedDate.slice(1);
    }
  },
  methods: {
    async getMenuData() {
      const response = await axios.get(`${backendUri}/menus/${this.$route.params.id_menu}/complete`);
      this.menu = response.data.data.menu;
      this.menuItems = response.data.data.items;
      this.menu.date = this.formattedDate;
    },

    async updateMenuItems() {
      const response = await axios.get(`${backendUri}/menus/${this.$route.params.id_menu}/items`);
      this.menuItems = response.data.data;
    },

    selectReportTab() {
      if(this.editSelected) {
        this.editSelected = false;
      }
      this.reportSelected = true;
    },

    selectEditTab() {
      if(this.reportSelected) {
        this.reportSelected = false;
      }
      this.editSelected = true;
    },

    async addItemToMenu(item: any) {
      const menuItem = item as MenuItem;
      menuItem.menuId = this.menuId;
      await axios.post(`${backendUri}/menu-items`, menuItem);
      this.updateMenuItems();
    },

    openEditDialog(item: any) {
      let rawItem;
      if (isProxy(item)) {
        rawItem = toRaw(item);
      }
      const currentItem = rawItem.raw as MenuItem;
      this.itemToEdit = { ...currentItem };
      this.editDialog = true;
    },

    async editItem() {
      await axios.put(`${backendUri}/menu-items/${this.itemToEdit.id}`, this.itemToEdit);
      this.editDialog = false;
      this.itemToEdit = {} as MenuItem;
      await this.updateMenuItems();
    },

    openDeleteDialog(item: any) {
      let rawItem;
      if (isProxy(item)) {
        rawItem = toRaw(item);
      }
      const currentItem = rawItem.raw as MenuItem;
      this.itemToDelete = { ...currentItem };
      this.deleteDialog = true;
    },

    async deleteItem() {
      await axios.delete(`${backendUri}/menu-items/${this.itemToDelete.id}`);
      this.deleteDialog = false;
      this.itemToDelete = {} as MenuItem;
      await this.updateMenuItems();
    },
  },
  
  async created() {
    await this.getMenuData();
  },
});
</script>
