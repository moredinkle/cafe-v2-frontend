<template>
    <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import axios from "axios";
import { useApiUrlStore } from "@/stores/generic-store";

export default defineComponent({
  name: "MenuItemForm",
  components: {},
  data() {
    return {
      apiUrlStore: useApiUrlStore(),
      menuId: this.$route.params.id_menu,
    };
  },
  methods: {
  }
});


</script>
