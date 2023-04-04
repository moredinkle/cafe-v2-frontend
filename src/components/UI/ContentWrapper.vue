<template>
  <v-container>
      <v-row>
        <v-col cols="12">
          <slot></slot>
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContentWrapper",
});
</script>
