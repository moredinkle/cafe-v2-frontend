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
import { useMenuDataStore } from "./stores/menu-data-store";
import { mapActions, mapStores } from "pinia";

export default defineComponent({
  name: "App",
  components: {
    NavBar,
    ContentWrapper,
  },
  computed: {
    ...mapStores(useMenuDataStore),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(useMenuDataStore,["getCurrentMenuData", "updateMenuItems"]),
  },
  async created(){
    await this.getCurrentMenuData();
    await this.updateMenuItems(this.menuDataStoreStore.menu.id as string);
  }
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Almarai&family=Figtree&family=Varela+Round&family=Yantramanav&display=swap");
#app {
  font-family: "Figtree", sans-serif;
}
</style>
