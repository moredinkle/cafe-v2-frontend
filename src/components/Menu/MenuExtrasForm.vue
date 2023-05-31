<template>
  <span class="text-h6 my-3">Añadir extras</span>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          hide-details="auto"
          v-model="description"
          :rules="descriptionRules"
          label="Descripción"
          type="text"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          hide-details="auto"
          v-model.number="amount"
          :rules="amountRules"
          label="Monto"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-select v-model="orderType" label="Tipo" :items="['GASTO', 'INGRESO']" variant="outlined"></v-select>
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn type="submit" class="mt-2" color="success" @click="addToExtras()" :disabled="disableButton">Guardar</v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MenuExtrasForm",
  emits: ["addMenuExtra"],
  computed:{
    disableButton(){
      if(!this.description || this.amount <= 0){
        return true;
      }
      return false;
    }
  },
  data() {
    return {
      orderType: "GASTO",
      description: "",
      descriptionRules: [
        (value: string) => {
          if (value?.length > 0) return true;
          return "No puede estar vacio";
        },
      ],
      amount: 0,
      amountRules: [
        (value: number) => {
          if (value > 0) return true;
          return "Monto debe ser mayor a 0";
        },
      ],
      menuId: this.$route.params.id_menu,
    };
  },
  methods: {
    addToExtras() {
      const menuExtra = {
        description: this.description,
        amount: this.amount,
        type: this.orderType,
        menuId: this.menuId,
      };
      this.$emit("addMenuExtra", menuExtra);
      this.description = "";
      this.amount = 0;
    },
  },
});
</script>
