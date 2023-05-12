<template>
      <span class="text-h6 text-indigo-darken-4">Total recaudado: {{ totalSales }} Bs</span>
      <div class="d-flex align-center mt-2">
        <v-btn
          class="mr-2"
          color="indigo-darken-3"
          :variant="currentView === 0 ? 'elevated' : 'outlined'"
          @click="currentView = 0"
          >Resumen</v-btn
        >
        <v-btn
          class="mr-2"
          color="indigo-darken-3"
          :variant="currentView === 1 ? 'elevated' : 'outlined'"
          @click="currentView = 1"
          >Extras</v-btn
        >
        <v-btn
          v-if="menuDataStoreStore.selectedMenu.status === 'ACTIVE'"
          class="mr-2"
          color="indigo-darken-3"
          :variant="currentView === 2 ? 'elevated' : 'outlined'"
          @click="currentView = 2"
          >Cierre manual</v-btn
        >
      </div>
      <template v-if="currentView === 0">
        <table-component class="my-3" :headers="tableHeaders" :items="salesReport" tableTitle="Ventas del dia" />
      </template>
      <template v-else-if="currentView === 1">
        <menu-extras :extras="extras" @update-extras="emitUpdateExtras"/>
      </template>
      <template v-else-if="currentView === 2">
        <manual-save :report="salesReport" />
      </template>

  <popup-dialog
    :dialog="deleteDialog"
    title="Eliminar"
    @closeDialog="deleteDialog = false"
    @click:outside="deleteDialog = false"
  >
    <span>Seguro que desea eliminar {{ itemToDelete.name }} del menú?</span>
  </popup-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TableComponent from "@/components/UI/TableComponent.vue";
import ManualSave from "./ManualSave.vue";
import MenuExtras from "./MenuExtras.vue";
import PopupDialog from "../UI/PopupDialog.vue";
import type { Menu, SalesReportRow, MenuExtra } from "@/utils/types";
import { useMenuDataStore } from "@/stores/menu-data-store";
import { mapStores } from "pinia";

export default defineComponent({
  name: "MenuReport",
  emits: ["markAsCompleted", "emitUpdateExtras"],
  components: {
    TableComponent,
    PopupDialog,
    ManualSave,
    MenuExtras,
  },
  props: {
    salesReport: {
      type: Array as () => SalesReportRow[],
      default: {} as SalesReportRow,
    },
    extras: {
      type: Array as () => MenuExtra[],
      default: {} as MenuExtra,
    },
  },
  computed: {
    ...mapStores(useMenuDataStore),
    menu(): Menu {
      return this.menuDataStoreStore.selectedMenu;
    },
    totalSales(): number {
      return this.salesReport.reduce((acc, obj) => {
        return acc + obj.subtotal;
      }, 0);
    },
  },
  data() {
    return {
      currentView: 0,
      itemToDelete: {} as SalesReportRow,
      itemToEdit: {} as SalesReportRow,
      deleteDialog: false,
      editDialog: false,
      tableHeaders: [
        { title: "Nombre", align: "start", key: "name" },
        { title: "Precio", key: "price" },
        { title: "Subtotal", key: "subtotal" },
        { title: "Vendidos", key: "sold", sortable: false },
      ],
    };
  },
  methods: {
    emitUpdateExtras(){
      this.$emit("emitUpdateExtras");
    }
  },
  //TODO
  //refactor uris backend
  //servidores --> todo lo que tenga que ver con servidores (ventas y reporte)
});
</script>
