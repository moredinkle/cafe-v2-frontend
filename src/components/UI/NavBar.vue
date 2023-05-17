<template>
  <v-app-bar color="black">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" :disabled="route === '/'"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Café v2</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-account" @click="logout"></v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app color="black" temporary>
    <v-list nav>
      <v-list-item
        v-for="item in items"
        :prepend-icon="item.icon"
        :key="item.text"
        :title="item.text"
        router
        :to="item.route"
        class="text-h6"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from 'axios';

export default defineComponent({
  name: "NavBar",

  data() {
    return {
      drawer: false,
      items: [
        {
          icon: "mdi-clipboard-list-outline",
          text: "Menús",
          route: "/menus",
        },
        {
          icon: "mdi-notebook-outline",
          text: "Ventas",
          route: "/ventas",
        },
      ],
    };
  },
  computed: {
    route(){
      return this.$route.path
    }
  },
  methods: {
    logout(){
      localStorage.clear();
      axios.defaults.headers.common['Authorization'] = null;
      this.$router.push('/login');
    }
  }
});
</script>
