<template>
  <v-card :color="color" rounded class="px-2 py-2">
    <span class="text-h5 font-weight-bold">{{ name }}</span> <br>
    <span class="text-subtitle-2 font-weight-light">{{ price }} Bs</span>
    <div class="d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <v-btn
          class="mr-1"
          density="comfortable"
          color="black"
          size="small"
          icon="mdi-minus"
          @click="quantity > 1 ? quantity-- : quantity"
        ></v-btn>
        <v-btn
          class="mr-3"
          density="comfortable"
          color="black"
          size="small"
          icon="mdi-plus"
          @click="quantity++"
        ></v-btn>
        <span class="text-h6 font-weight-bold">
          {{ quantity }}
        </span>
      </div>
      <div>
        <v-btn color="black" size="small" @click="emitAddToOrder">Añadir</v-btn>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SalesView",
  components: {},
  emits: ["addItemToOrder"],
  props: {
    color: String,
    id: String,
    name: String,
    price: {
      type: Number,
      default: 0
    }
  },
  computed: {},

  data() {
    return {
      quantity: 1,
    };
  },
  methods: {
    emitAddToOrder(){
      if(this.quantity > 0){
        this.$emit('addItemToOrder', this.id, this.quantity);
        this.quantity = 1;
      }
    }
  },
});
</script>
