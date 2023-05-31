<template>
  <div class="my-3">
    <span class="text-h6">Guardar ventas manualmente</span>
    <v-row align="center">
      <v-col cols="12" sm="4">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="outlined" append-icon="mdi-menu-down" block>
              {{ selectedItem.name || "Elegir del menú" }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="item in report" :key="item.id" :value="item" @click="selectedItem = item">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-text class="d-flex flex-column">
            <span>Nombre: {{ selectedItem.name }} </span>
            <span>Vendidos: {{ selectedItem.sold }} </span>
            <span>Subtotal: {{ selectedItem.subtotal }} </span>
            <span>Stock: {{ selectedItem.stock }} </span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          hide-details="auto"
          v-model.number="manualSaveSold"
          :rules="manualSaveSoldRules"
          label="Vendidos"
          type="number"
        ></v-text-field>
        <v-btn color="success" block class="mt-1" @click="addToManualSaves" :disabled="manualSaveSold <= 0">Añadir</v-btn>
      </v-col>
    </v-row>

    <table-component :headers="tableHeaders" :items="manualSaves" table-title="Cambios" class="my-5" />
    <div class="d-flex justify-center">
      <v-btn color="success" size="large" @click="saveChanges" :loading="saveLoading" :disabled="manualSaves.length <= 0">Guardar cambios</v-btn>
    </div>
  </div>

  <v-snackbar v-model="snackbar" timeout="2000" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Order, OrderItem, SalesReportRow } from "@/utils/types";
import axios from "axios";
import TableComponent from "@/components/UI/TableComponent.vue";
import { mapStores } from "pinia";
import { useMenuDataStore } from "../../stores/menu-data-store";
const backendUri = import.meta.env.VITE_BACKEND_URI;

export default defineComponent({
  name: "ManualSave",
  emits: ["updateMenuItems"],
  components: {
    TableComponent,
  },
  computed: {
    ...mapStores(useMenuDataStore),
    total(): number {
      return this.manualSaves.reduce((acc, obj) => {
        return acc + obj.subtotal;
      }, 0);
    },
  },
  props: {
    report: {
      type: Array as () => SalesReportRow[],
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      selectedItem: {} as SalesReportRow,
      saveLoading: false,
      manualSaveSold: 0,
      manualSaveSoldRules: [
        (value: number) => {
          if (value > 0) return true;
          return "Debe ser mayor a 0";
        },
      ],
      snackbarColor: "",
      snackbarText: "",
      snackbar: false,
      manualSaves: [] as SalesReportRow[],
      tableHeaders: [
        { title: "Nombre", align: "start", key: "name" },
        { title: "Precio", key: "price" },
        { title: "Subtotal", key: "subtotal" },
        { title: "Vendidos", key: "sold" },
      ],
    };
  },
  methods: {
    addToManualSaves() {
      if (this.manualSaveSold > this.selectedItem.stock) {
        this.displaySnackbar("error", "No alcanza jefe");
        return;
      }
      const manual = { ...this.selectedItem };
      manual.sold = this.manualSaveSold;
      manual.subtotal = manual.price * this.manualSaveSold;
      this.manualSaves.push({ ...manual });
      this.manualSaveSold = 0;
    },

    displaySnackbar(color: string, text: string) {
      this.snackbarColor = color;
      this.snackbarText = text;
      this.snackbar = true;
    },

    async saveChanges() {
      try {
        this.saveLoading = true;
        const type = "VENTA";
        const order: Order = {
          change: 0,
          payedWith: this.total,
          total: this.total,
          type: type,
        };
        const response = await axios.post(`${backendUri}/orders`, order);
        if (response.status === 201) {
          const orderId = response.data.newId;
          for (const item of this.manualSaves) {
            const orderItem: OrderItem = {
              quantity: item.sold || 0,
              subtotal: item.subtotal || 0,
              menuItemId: item.id || "",
              orderId: orderId,
            };
            await axios.post(`${backendUri}/orders/${orderId}/items`, orderItem);
          }
          this.displaySnackbar("info", "Cambios guardados");
          this.manualSaves = [];
          this.selectedItem = {} as SalesReportRow;
          this.$emit("updateMenuItems");
          this.saveLoading = false;
        }
      } catch (error) {
        this.saveLoading = false;
        alert("Error al guardar");
      }
    },
  },
});
</script>
