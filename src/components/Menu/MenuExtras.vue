<template>
  <div>
    <div class="my-4">
      <span class="text-h6 text-green-darken-3">Total ingresos: {{ incomeTotal }}</span> <br>
      <span class="text-h6 text-orange-darken-3">Total gastos: {{ spendingTotal }}</span>
    </div>
    <template v-if="menuDataStoreStore.selectedMenu.status !== 'FINISHED'">
      <menu-extras-form @addMenuExtra="addExtra" />
    </template>
    <table-component
      :headers="tableHeaders"
      :items="extras"
      table-title=""
      class="my-5"
      @deleteTableItem="openDeleteDialog"
      @editTableItem="openEditDialog"
      :deleteButton="menuDataStoreStore.selectedMenu.status !== 'FINISHED'"
      :editButton="menuDataStoreStore.selectedMenu.status !== 'FINISHED'"
    />
  </div>
  <popup-dialog
    :dialog="deleteDialog"
    title="Eliminar"
    @confirm-dialog-action="deleteItem"
    @closeDialog="deleteDialog = false"
    @click:outside="deleteDialog = false"
  >
    <span>Seguro que desea eliminar {{ itemToDelete.description }} del menú?</span>
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
      <v-text-field v-model="itemToEdit.description" :rules="descriptionRules" label="Descripción" type="text"></v-text-field>
      <v-text-field v-model.number="itemToEdit.amount" :rules="amountRules" label="Monto" type="number"></v-text-field>
    </v-form>
  </popup-dialog>

</template>

<script lang="ts">
import { defineComponent, isProxy, toRaw } from "vue";
import MenuExtrasForm from "./MenuExtrasForm.vue";
import TableComponent from "../UI/TableComponent.vue";
import PopupDialog from "../UI/PopupDialog.vue";
import type { MenuExtra } from "@/utils/types";
import axios from "axios";
import { useMenuDataStore } from "@/stores/menu-data-store";
import { mapStores } from "pinia";
import { toExtra } from '../../utils/types';
const backendUri = import.meta.env.VITE_BACKEND_URI;

export default defineComponent({
  name: "MenuExtras",
  components: {
    MenuExtrasForm,
    TableComponent,
    PopupDialog
  },
  computed:{
    ...mapStores(useMenuDataStore)
  },
  data() {
    return {
      extras: [] as MenuExtra[],
      incomeTotal: 0,
      spendingTotal: 0,
      itemToEdit: {} as MenuExtra,
      itemToDelete: {} as MenuExtra,
      editDialog: false,
      deleteDialog: false,
      tableHeaders: [
        { title: "Descripción", align: "start", key: "description" },
        { title: "Monto", key: "amount" },
        { title: "Tipo", key: "type" },
        { title: "Acciones", key: "actions", sortable: false },
      ],
      descriptionRules: [
        (value: string) => {
          if (value?.length > 0) return true;
          return "No puede estar vacio";
        },
      ],
      amountRules: [
        (value: number) => {
          if (value > 0) return true;
          return "Debe ser mayor a 0";
        },
      ],
    };
  },
  methods: {
    async getExtras(){
      const response = await axios.get(`${backendUri}/menus/${this.menuDataStoreStore.selectedMenu.id}/extras`);
      this.extras = response.data.data.map((item: any) => {
        const it = toExtra(item);
        item.type === "GASTO" ? this.spendingTotal += it.amount : this.incomeTotal += it.amount;
        return it;
      });
    },

    async addExtra(extra: MenuExtra) {
      await axios.post(`${backendUri}/menu-extras`, extra);
      await this.getExtras();
    },

    openEditDialog(item: any) {
      let rawItem;
      if (isProxy(item)) {
        rawItem = toRaw(item);
      }
      const currentItem = rawItem.raw as MenuExtra;
      this.itemToEdit = { ...currentItem };
      this.editDialog = true;
    },

    async editItem() {
      await axios.put(`${backendUri}/menu-extras/${this.itemToEdit.id}`, this.itemToEdit);
      this.editDialog = false;
      this.itemToEdit = {} as MenuExtra;
      await this.getExtras();
    },

    openDeleteDialog(item: any) {
      let rawItem;
      if (isProxy(item)) {
        rawItem = toRaw(item);
      }
      const currentItem = rawItem.raw as MenuExtra;
      this.itemToDelete = { ...currentItem };
      this.deleteDialog = true;
    },

    async deleteItem() {
      await axios.delete(`${backendUri}/menu-extras/${this.itemToDelete.id}`);
      this.deleteDialog = false;
      this.itemToDelete = {} as MenuExtra;
      await this.getExtras();
    },
  },
  async created(){
    await this.getExtras();
  }
});
</script>
