import type { MenuItem, Menu } from '@/utils/types';
import { defineStore } from 'pinia';
import axios from 'axios';

const backendUri = import.meta.env.VITE_BACKEND_URI;

export const useMenuDataStore = defineStore({
  id: 'menuDataStore',
  state: () => ({
    currentMenu: {} as Menu,
    currentMenuItems: [] as MenuItem[],
    selectedMenu: {} as Menu
  }),
  getters: {
    stockFilteredItems(state) {
      return state.currentMenuItems.filter(item => item.stock > 0);
    },
  },
  actions: {
    async updateActiveMenuItems() {
      const response = await axios.get(`${backendUri}/menus/${this.currentMenu.id}/items`);
      this.currentMenuItems = response.data.data;
      this.currentMenuItems.forEach(item => {
        item.price = parseFloat(item.price as unknown as string);
      });
    },
    async getCurrentMenuData() {
      try {
        const response = await axios.get(`${backendUri}/menus/?field=status&value=ACTIVE`);
        this.currentMenu = response.data.data[0];
        this.updateActiveMenuItems();
      } catch (error) {
        alert("No active menu");
      }
    },
    selectMenu(menu: Menu){
      this.selectedMenu = menu;
    },
    setCurrentMenu(menu: Menu){
      this.currentMenu = menu;
    }
  }
})