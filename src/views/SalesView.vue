<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="3" v-for="(item, index) in menuDataStoreStore.currentMenuItems" :key="item.id">
      <sales-card
        :id="item.id"
        :name="item.name"
        :price="item.price as number"
        :color="colors[index]"
        @addItemToOrder="addToOrder"
      ></sales-card>
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
  <v-row align="center">
    <v-col cols="6" sm="4">
      <v-text-field
          hide-details="auto"
          v-model="payedWith"
          :rules="payedWithRules"
          label="Pagado con"
          type="number"
        ></v-text-field>
    </v-col>
    <v-col cols="6" sm="4">
      <span class="text-h6 d-flex justify-center">
        Cambio: {{ change }}
      </span>
    </v-col>
    <v-col cols="12" sm="4" class="d-flex justify-center">
      <v-btn color="success" size="large">Guardar</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMenuDataStore } from "@/stores/menu-data-store";
import { mapActions, mapStores } from "pinia";
import type { Menu, MenuItem } from "../utils/types";
import { colors } from "@/utils/colors";
import SalesCard from "@/components/Sales/SalesCard.vue";
import TableComponent from "@/components/UI/TableComponent.vue";
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
      return this.menuDataStoreStore.currentMenuItems;
    },
    change(): Number{
      return this.payedWith - this.orderTotal;
    }
  },
  data() {
    return {
      colors: colors,
      itemToDelete: {} as MenuItem,
      payedWith: 0,
      orderTotal: 0,
      deleteDialog: false,
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
    ...mapActions(useMenuDataStore, ["updateActiveMenuItems"]),
    deleteFromOrder(item: any) {
      const deleteIndex = this.orderItems.findIndex((it) => it.id === item.id);
      this.orderItems.splice(deleteIndex, 1);
    },

    addToOrder(id: string, quantity: number) {
      const menuItem = this.menuItems.find((it) => it.id === id);
      if (menuItem === undefined) {
        return;
      }
      const addIndex = this.orderItems.findIndex((it) => it.id === id);
      if (addIndex >= 0) {
        menuItem.quantity = (this.orderItems[addIndex].quantity) as number + quantity;
        menuItem.subtotal = (this.orderItems[addIndex].subtotal) as number + quantity * menuItem.price;
        this.orderItems[addIndex] = {...menuItem};
      } else {
        menuItem.quantity = quantity;
        menuItem.subtotal = quantity * menuItem.price;
        this.orderItems.push(menuItem);
      }
      this.orderTotal = this.orderItems.reduce((acc, obj) => { return acc + (obj.subtotal ? obj.subtotal : 0); }, 0);
    },
  },
  created(){
  }
});
</script>
