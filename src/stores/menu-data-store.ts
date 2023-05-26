import { type MenuItem, type Menu, type MenuExtra, type SalesReportRow, toReportRow, toExtra, toMenuItem } from "@/utils/types";
import { defineStore } from "pinia";
import axios from "axios";

const backendUri = import.meta.env.VITE_BACKEND_URI;

export const useMenuDataStore = defineStore({
  id: "menuDataStore",
  state: () => ({
    currentMenu: {} as Menu,
    currentMenuData: {
      items: [] as MenuItem[],
      extras: [] as MenuExtra[],
      sales: [] as SalesReportRow[],
      ushers: [] as SalesReportRow[],
    },
    newSalesFlag: false,
    selectedMenu: {} as Menu,
  }),
  getters: {
    stockFilteredItems(state) {
      return state.currentMenuData.items.filter((item) => item.stock > 0);
    },
  },
  actions: {
    async getCurrentMenu() {
      try {
        const response = await axios.get(`${backendUri}/menus/?field=status&value=ACTIVE`);
        if (response.data.data.length > 0) {
          this.currentMenu = response.data.data[0];
          await this.getMenuData();
        }
      } catch (error) {
        alert("Error inesperado");
      }
    },

    async getMenuData() {
      const response = await axios.get(`${backendUri}/menus/${this.currentMenu.id}/complete`);
      const { items, extras, sales, ushers } = response.data.menuData;
      this.currentMenuData.items = items.map((item: any) => {
        return toMenuItem(item);
      });
      this.currentMenuData.extras = extras.map((row: any) => {
        return toExtra(row);
      });
      this.currentMenuData.sales = sales.map((row: any) => {
        return toReportRow(row);
      });
      this.currentMenuData.ushers = ushers.map((row: any) => {
        return toReportRow(row);
      });
    },

    async updateActiveMenuItems() {
      const response = await axios.get(`${backendUri}/menus/${this.currentMenu.id}/items`);
      this.currentMenuData.items = response.data.data;
      this.currentMenuData.items.forEach((item) => {
        item.price = parseFloat(item.price as unknown as string);
      });
    },

    async updateSalesReport() {
      const response = await axios.get(`${backendUri}/menus/${this.currentMenu.id}/sales`);
      this.currentMenuData.sales = response.data.data.map((row: any) => {
        return toReportRow(row);
      });
    },

    async updateUshersReport() {
      const response = await axios.get(`${backendUri}/menus/${this.currentMenu.id}/ushers`);
      this.currentMenuData.ushers = response.data.data.map((row: any) => {
        return toReportRow(row);
      });
    },

    async updateExtras() {
      const response = await axios.get(`${backendUri}/menus/${this.currentMenu.id}/extras`);
      this.currentMenuData.extras = response.data.data.map((row: any) => {
        return toExtra(row);
      });
    },
    
    async updateSalesData(){
      const response = await axios.get(`${backendUri}/menus/${this.currentMenu.id}/report`);
      const { sales, ushers } = response.data.data;
      this.currentMenuData.sales = sales.map((row: any) => {
        return toReportRow(row);
      });
      this.currentMenuData.ushers = ushers.map((row: any) => {
        return toReportRow(row);
      });
      this.setNewSalesFlag(false);
    },

    async updateManualClose(){
      const response = await axios.get(`${backendUri}/menus/${this.currentMenu.id}/report`);
      const { items, sales, ushers } = response.data.data;
      this.currentMenuData.items = items.map((row: any) => {
        return toMenuItem(row);
      });
      this.currentMenuData.sales = sales.map((row: any) => {
        return toReportRow(row);
      });
      this.currentMenuData.ushers = ushers.map((row: any) => {
        return toReportRow(row);
      });
    },

    selectMenu(menu: Menu) {
      this.selectedMenu = menu;
    },
    setCurrentMenu(menu: Menu) {
      this.currentMenu = menu;
    },
    setCurrentMenuItems(items: MenuItem[]) {
      this.currentMenuData.items = items;
    },
    setCurrentMenuData(items: MenuItem[], extras: MenuExtra[], sales: SalesReportRow[], ushers: SalesReportRow[]) {
      this.currentMenuData.items = items;
      this.currentMenuData.extras = extras;
      this.currentMenuData.sales = sales;
      this.currentMenuData.ushers = ushers;
    },
    setNewSalesFlag(newValue: boolean) {
      this.newSalesFlag = newValue;
    },
  },
});
