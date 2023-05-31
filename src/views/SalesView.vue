<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="3" v-for="(item, index) in menuDataStoreStore.stockFilteredItems" :key="item.id">
      <sales-card :item="item" :color="colors[index]" @addItemToOrder="addToOrder"></sales-card>
    </v-col>
  </v-row>
  <table-component
    class="my-3"
    :headers="tableHeaders"
    :items="orderItems"
    @deleteTableItem="deleteFromOrder"
    deleteButton
    tableTitle="Pedido"
  />
  <v-row justify="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="pa-3">
        <div class="d-flex flex-column">
          <v-switch
            v-model="orderType"
            hide-details
            color="success"
            true-value="Venta"
            false-value="Servidor"
            :label="orderType"
          ></v-switch>
          <v-text-field
            hide-details="auto"
            v-model="payedWith"
            :rules="payedWithRules"
            label="Pagado con"
            type="number"
          ></v-text-field>
          <span class="text-subtitle-1 mt-1"> Total: {{ orderTotal }} </span>
          <span class="text-subtitle-1 mt-1"> Cambio: {{ change }} </span>
          <v-btn
            color="success"
            size="large"
            class="mt-1"
            @click="saveOrder"
            :loading="saveOrderLoading"
            :disabled="sellDisabled"
            >Guardar</v-btn
          >
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-snackbar v-model="snackbar" timeout="2000" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SalesCard from "@/components/Sales/SalesCard.vue";
import TableComponent from "@/components/UI/TableComponent.vue";
import { mapActions, mapStores } from "pinia";
import { useMenuDataStore } from "@/stores/menu-data-store";
import { colors } from "@/utils/colors";
import type { Menu, MenuItem, Order, OrderItem } from "../utils/types";
import axios from "axios";
const backendUri = import.meta.env.VITE_BACKEND_URI;

export default defineComponent({
  name: "SalesView",
  components: {
    SalesCard,
    TableComponent,
  },
  computed: {
    ...mapStores(useMenuDataStore),
    menu(): Menu {
      return this.menuDataStoreStore.currentMenu;
    },
    menuItems(): MenuItem[] {
      return this.menuDataStoreStore.currentMenuData.items;
    },
    change(): number {
      return this.payedWith - this.orderTotal;
    },
    sellDisabled(): boolean {
      return (this.orderType === "Venta" && this.change < 0) || this.orderItems.length < 1;
    },
  },
  data() {
    return {
      colors: colors,
      orderType: "Venta",
      itemToDelete: {} as MenuItem,
      payedWith: 0,
      orderTotal: 0,
      snackbarColor: "",
      snackbarText: "",
      snackbar: false,
      saveOrderLoading: false,
      tableHeaders: [
        { title: "Nombre", align: "start", key: "name" },
        { title: "Cantidad", key: "quantity" },
        { title: "Subtotal", key: "subtotal" },
        { title: "Eliminar", key: "actions", sortable: false },
      ],
      payedWithRules: [
        (value: number) => {
          if (value > 0) return true;
          return "Debe ser mayor a 0";
        },
      ],
      orderItems: [] as MenuItem[],
    };
  },
  methods: {
    ...mapActions(useMenuDataStore, ["updateActiveMenuItems", "setNewSalesFlag"]),
    deleteFromOrder(item: any) {
      const deleteIndex = this.orderItems.findIndex((it) => it.id === item.id);
      this.orderItems.splice(deleteIndex, 1);
    },

    addToOrder(item: MenuItem, quantity: number) {
      let existsInOrder = false;
      const addIndex = this.orderItems.findIndex((it) => it.id === item.id);
      if (addIndex >= 0) {
        item.quantity = (this.orderItems[addIndex].quantity as number) + quantity;
        item.subtotal = (this.orderItems[addIndex].subtotal as number) + quantity * item.price;
        existsInOrder = true;
      } else {
        item.quantity = quantity;
        item.subtotal = quantity * item.price;
      }
      if (item.quantity > item.stock) {
        this.displaySnackbar("warning", "No alcanza jefe");
        return undefined;
      }
      existsInOrder ? (this.orderItems[addIndex] = { ...item }) : this.orderItems.push(item);
      this.calculateOrderTotal();
    },

    displaySnackbar(color: string, text: string) {
      this.snackbarColor = color;
      this.snackbarText = text;
      this.snackbar = true;
    },

    calculateOrderTotal() {
      this.orderTotal = this.orderItems.reduce((acc, obj) => {
        return acc + (obj.subtotal ? obj.subtotal : 0);
      }, 0);
    },

    async saveOrder() {
      try {
        this.saveOrderLoading = true;
        const type = this.orderType === "Venta" ? "VENTA" : "SERVIDOR";
        if (type === "SERVIDOR") {
          this.payedWith = this.orderTotal;
        }
        const order: Order = {
          change: this.change,
          payedWith: this.payedWith,
          total: this.orderTotal,
          type: type,
        };
        const response = await axios.post(`${backendUri}/orders`, order);
        if (response.status === 201) {
          const orderId = response.data.newId;
          await Promise.all(
            this.orderItems.map(async (item) => {
              const orderItem: OrderItem = {
                quantity: item.quantity || 0,
                subtotal: item.subtotal || 0,
                menuItemId: item.id || "",
                orderId: orderId,
              };
              await axios.post(`${backendUri}/orders/${orderId}/items`, orderItem);
            })
          );
          this.orderItems = [];
          this.payedWith = 0;
          this.orderTotal = 0;
          this.displaySnackbar("success", "Guardado con exito");
          await this.updateActiveMenuItems();
          if (!this.menuDataStoreStore.newSalesFlag) {
            this.setNewSalesFlag(true);
          }
          this.saveOrderLoading = false;
        }
      } catch (error) {
        this.saveOrderLoading = false;
        alert("Error al guardar");
      }
    },
  },
});
</script>
