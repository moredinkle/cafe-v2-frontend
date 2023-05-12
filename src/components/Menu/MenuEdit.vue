<template>
      <template v-if="menu.status !== 'FINISHED'">
        <menu-item-form @addMenuItem="addItemToMenu" />
      </template>
      <table-component
        class="my-3"
        :headers="tableHeaders"
        :items="menuItems"
        @deleteTableItem="openDeleteDialog"
        @editTableItem="openEditDialog"
        :deleteButton="menu.status === 'INACTIVE'"
        :editButton="menu.status !== 'FINISHED'"
        tableTitle="Menú"
      />

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
import PopupDialog from "../UI/PopupDialog.vue";
import axios from "axios";
import type { Menu } from "@/utils/types";
import type { MenuItem } from "../../utils/types";
import { isProxy, toRaw } from "vue";
import { useMenuDataStore } from "@/stores/menu-data-store";
import { mapStores } from "pinia";
const backendUri = import.meta.env.VITE_BACKEND_URI;

export default defineComponent({
  name: "MenuEdit",
  components: {
    MenuItemForm,
    TableComponent,
    PopupDialog,
  },
  emits: ["emitUpdateItems", "emitUpdateActiveItems", "markAsActive"],
  props: {
    menuItems: {
      type: Array as () => MenuItem[],
      default: {} as MenuItem,
    },
  },
  computed: {
    ...mapStores(useMenuDataStore),
    menu(): Menu {
      return this.menuDataStoreStore.selectedMenu;
    },
    formattedDate(): string {
      const date = new Date(this.menuDataStoreStore.selectedMenu.date);
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;
      const formattedDate = date.toLocaleDateString(undefined, options);
      return formattedDate.charAt(0).toLocaleUpperCase() + formattedDate.slice(1);
    },
  },
  data() {
    return {
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
  methods: {
    async addItemToMenu(item: any) {
      const menuItem = item as MenuItem;
      menuItem.menuId = this.menuId;
      await axios.post(`${backendUri}/menus/${this.menuDataStoreStore.selectedMenu.id}/items`, menuItem);
      this.$emit("emitUpdateItems");
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
      await axios.put(`${backendUri}/menus/${this.menuDataStoreStore.selectedMenu.id}/items/${this.itemToEdit.id}`, this.itemToEdit);
      this.editDialog = false;
      this.itemToEdit = {} as MenuItem;
      this.$emit("emitUpdateItems");
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
      await axios.delete(`${backendUri}/menus/${this.menuDataStoreStore.selectedMenu.id}/items/${this.itemToDelete.id}`);
      this.deleteDialog = false;
      this.itemToDelete = {} as MenuItem;
      this.$emit("emitUpdateItems");
    },

    markAsActive() {
      this.$emit("markAsActive");
    },
  },
});
</script>
