<template>
  <div class="my-6">
    <menu-extras-form />
    <table-component :headers="tableHeaders" :items="manualSaves" table-title="" class="my-5" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MenuExtrasForm from "./MenuExtrasForm.vue";
import TableComponent from "../UI/TableComponent.vue";

export default defineComponent({
  name: "MenuExtras",
  components: {
    MenuExtrasForm,
    TableComponent
  },
  data() {
    return {
      manualSaves: [],
      tableHeaders: [
        { title: "Descripción", align: "start", key: "description" },
        { title: "Monto", key: "amount" },
        { title: "Tipo", key: "type" },
      ],
    };
  },
});
</script>
