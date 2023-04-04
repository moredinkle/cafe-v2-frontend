<template>
  <div>
    <h1>hola</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { useApiUrlStore } from "../stores/generic-store";

export default defineComponent({
  name: "MenuView",
  components: {},
  data() {
    return {
        apiUrlStore: useApiUrlStore(),
    };
  },
  methods: {
    async getMenuData() {
      const response = await axios.get(`${this.apiUrlStore.url}/menus/${this.$route.params.id_menu}`);
      console.log(response.data);
      const menu = response.data.data;
    },
  },
  async created() {
    await this.getMenuData();
  },
});
</script>
