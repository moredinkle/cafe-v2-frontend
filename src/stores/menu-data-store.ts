import type { MenuItem, Menu } from '@/utils/types';
import { defineStore } from 'pinia';
import axios from 'axios';

const backendUri = import.meta.env.VITE_BACKEND_URI;

export const useMenuDataStore = defineStore({
  id: 'menuDataStore',
  state: () => ({
    menu: {} as Menu,
    menuItems: [] as MenuItem[]
  }),
  getters: {},
  actions: {
    async updateMenuItems(id: string) {
      const response = await axios.get(`${backendUri}/menus/${id}/items`);
      this.menuItems = response.data.data;
    },
    async getCurrentMenuData() {
      try {
        const response = await axios.get(`${backendUri}/menus/?field=status&value=ACTIVE`);
        this.menu = response.data.data[0];
      } catch (error) {
        alert("No active menu");
      }
    }
  }
})