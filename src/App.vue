<template>
  <v-app>
    <nav-bar />
    <content-wrapper>
      <v-main>
        <router-view />
      </v-main>
    </content-wrapper>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContentWrapper from "./components/UI/ContentWrapper.vue";
import NavBar from "./components/UI/NavBar.vue";
import axios from "axios";
import { mapActions } from "pinia";
import { useMenuDataStore } from "./stores/menu-data-store";

export default defineComponent({
  name: "App",
  components: {
    NavBar,
    ContentWrapper,
  },
  methods: {
    ...mapActions(useMenuDataStore, ["getCurrentMenu"]),
  },
  beforeUnmount () {
    localStorage.removeItem('auth-token');
  },
  async mounted() {
    const token = localStorage.getItem("auth-token");
    if (token) {
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      await this.getCurrentMenu();
    }
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Almarai&family=Figtree&family=Varela+Round&family=Yantramanav&display=swap");
#app {
  font-family: "Figtree", sans-serif;
}
</style>
