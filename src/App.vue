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


export default defineComponent({
  name: "App",
  components: {
    NavBar,
    ContentWrapper,
  },

  data() {
    return {
      //
    };
  },
});
</script>

<style>
  
</style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Almarai&family=Figtree&family=Varela+Round&family=Yantramanav&display=swap');
#app {
  /* font-family: 'Almarai', sans-serif; */
  font-family: 'Figtree', sans-serif;
}
</style>
