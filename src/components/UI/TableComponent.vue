<template>
  <v-card rounded>
    <v-data-table :headers="headers" :items="items" density="compact" items-per-page="30">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-if="editButton || deleteButton" v-slot:[`item.actions`]="{ item }">
        <v-icon v-if="editButton" size="small" @click="emitEditItem(item)"> mdi-pencil </v-icon>
        <v-icon v-if="deleteButton" size="small" @click="emitDeleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableComponent",
  emits: ["deleteTableItem", "editTableItem"],
  components: {},
  props: {
    headers: Array,
    items: Array,
    tableTitle: {
      type: String,
      default: "",
    },
    editButton: Boolean,
    deleteButton: Boolean,
  },
  data() {
    return {
      dialog: false,
      dialogTitle: "",
      itemToDelete: {},
    };
  },
  methods: {
    emitEditItem(item: any) {
        this.$emit("editTableItem", item);
    },
    emitDeleteItem(item: any) {
      this.$emit("deleteTableItem", item);
    },
  }
});
</script>
