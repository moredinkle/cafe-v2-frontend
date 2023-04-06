<template>
  <v-dialog v-model="showDialog" max-width="500px">
    <v-card :title="title">
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="gray darken-1" text @click="closeDialog">Cancelar</v-btn>
        <v-btn color="success" text @click="confirmAction">{{ actionConfirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PopupDialog",
  emits: ["closeDialog", "confirmDialogAction"],
  props: {
    title: {
      type: String,
      default: "",
    },
    actionConfirmText: {
      type: String,
      default: "Continuar",
    },
    dialog: Boolean,
  },
  data() {
    return {
    };
  },
  computed: {
    showDialog(){
        return this.dialog;
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    confirmAction() {
      this.$emit("confirmDialogAction");
    },
  },
});
</script>
