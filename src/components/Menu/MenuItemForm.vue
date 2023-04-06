<template>
  <h3 class="my-3">Añadir al menú</h3>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="12" md="4" class="mb-0">
        <v-text-field
          hide-details="auto"
          v-model="itemName"
          :rules="itemNameRules"
          label="Nombre"
          type="text"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" class="mb-0">
        <v-text-field
          hide-details="auto"
          v-model="price"
          :rules="priceRules"
          label="Precio"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" class="mb-0">
        <v-text-field
          hide-details="auto"
          v-model="stock"
          :rules="stockRules"
          label="Stock"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn type="submit" class="mt-2" color="success" @click="addToMenu()">Guardar</v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import axios from "axios";

export default defineComponent({
  name: "MenuItemForm",
  emits: ["addMenuItem"],
  components: {},
  data() {
    return {
      itemName: "",
      itemNameRules: [
        (value: string) => {
          if (value?.length > 3) return true;
          return "First name must be at least 3 characters.";
        },
      ],
      price: 0,
      priceRules: [
        (value: number) => {
          if (value > 0) return true;
          return "Precio debe ser mayor a 0";
        },
      ],
      stock: 0,
      stockRules: [
        (value: number) => {
          if (value > 0) return true;
          return "Stock debe ser mayor a 0";
        },
      ],
      menuId: this.$route.params.id_menu,
    };
  },
  methods: {
    addToMenu() {
      const menuItem = {
        name: this.itemName,
        price: this.price,
        stock: this.stock,
        menuId: this.menuId
      };
      this.$emit('addMenuItem', menuItem);
      this.itemName = "";
      this.stock = 0;
      this.price = 0;
    },
  },
});
</script>
