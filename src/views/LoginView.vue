<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6" lg="4">
      <v-card rounded class="px-12 py-8">
        <span class="text-h4 py-3">Cafe v2</span>
        <v-form @submit.prevent>
          <v-text-field
            class="py-3"
            hide-details="auto"
            v-model="username"
            :rules="usernameRules"
            label="Usuario"
            variant="outlined"
            type="text"
          ></v-text-field>
          <v-text-field
            class="py-3"
            hide-details="auto"
            v-model="password"
            :rules="passwordRules"
            label="Contraseña"
            variant="outlined"
            type="password"
          ></v-text-field>
          <v-btn type="submit" class="mt-2" color="black" @click="login()" block>Ingresar</v-btn>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { useMenuDataStore } from "@/stores/menu-data-store";
import { mapActions } from "pinia";

const backendUri = import.meta.env.VITE_BACKEND_URI;

export default defineComponent({
  name: "LoginView",
  data() {
    return {
      username: "",
      usernameRules: [
        (value: string) => {
          if (value?.length > 0) return true;
          return "No puede estar vacio";
        },
      ],
      password: "",
      passwordRules: [
        (value: string) => {
          if (value?.length > 0) return true;
          return "No puede estar vacio";
        },
      ],
    };
  },
  methods: {
    ...mapActions(useMenuDataStore,["getCurrentMenuData"]),
    async login() {
      const response = await axios.post(`${backendUri}/auth/login`, {username: this.username, password: this.password});
      if (response.status === 200) {
        // const cookie = response.headers["set-cookie"];
        // if (cookie) {
        //   console.log(cookie);
        // }
        const { id, token } = response.data.data;
        localStorage.setItem("auth-token", token);
        localStorage.setItem("user-id", id);
        axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
        await this.getCurrentMenuData();
        this.$router.push('/ventas');
      } else {
        this.username = "";
        this.password = "";
        alert("Credenciales incorrectos.");
      }
    },
  },
});
</script>
