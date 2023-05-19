import type { MenuExtra, SalesReportRow } from "./types";
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


export function verpdf(sales: SalesReportRow[], ushers: SalesReportRow[], extras: MenuExtra[], menuDate: string, totalSales: number, totalExtras: number) {
    const salesData: any = [
      [
        { text: "Nombre", bold: true, fillColor: '#e0ebeb' },
        { text: "Precio", bold: true, fillColor: '#e0ebeb' },
        { text: "Cantidad", bold: true, fillColor: '#e0ebeb' },
        { text: "Subtotal", bold: true, fillColor: '#e0ebeb' },
      ],
    ];
    sales.map((item) => {
        salesData.push({...item});
    });
    const extrasData: any = [
      [
        { text: "Descripción", bold: true, fillColor: '#e0ebeb' },
        { text: "Monto", bold: true, fillColor: '#e0ebeb' },
        { text: "Tipo", bold: true, fillColor: '#e0ebeb' },
      ],
    ];
    extras.map((item) => {
      const it = [item.description, item.amount, item.type];
      extrasData.push({...it});
    });
    const ushersData: any = [
      [
        { text: "Nombre", bold: true, fillColor: '#e0ebeb' },
        { text: "Cantidad", bold: true, fillColor: '#e0ebeb' }
      ],
    ];
    ushers.map((item) => {
      const it = [item.name, item.sold];
      ushersData.push({...it});
    });

    const docDefinition = {
      content: [
        {
          text: `Resumen diario: ${menuDate}`,
          style: "header",
        },
        { text: "Ventas", style: "tableTitle" },
        " ",
        {
          table: {
            headerRows: 1,
            widths: ["*", 100, 100, 100],
            body: salesData,
          },
        },
        " ",
        { text: `Total ventas: ${totalSales}`, style: "resultsStyle" },
        " ",
        { text: "Para servidores", style: "tableTitle" },
        " ",
        {
          table: {
            headerRows: 1,
            widths: ["*", "*"],
            body: ushersData,
          },
        },
        " ",
        { text: "Extras", style: "tableTitle" },
        " ",
        {
          table: {
            headerRows: 1,
            widths: ["*", 100, 100],
            body: extrasData,
          },
        },
        " ",
        { text: `Total extras: ${totalExtras}`, style: "resultsStyle" },
        " ",
        { text: `Total final: ${totalSales + totalExtras}`, style: "resultsStyle" },
        {
          text: `Fondo para compras: ${(totalSales + totalExtras) / 2}`,
          style: ["resultsStyle", "finalResults"],
        },
        {
          text: `Efectivo entregado: ${(totalSales + totalExtras) / 2}`,
          style: ["resultsStyle", "finalResults"],
        },
      ],

      styles: {
        header: {
          fontSize: 22,
          lineHeight: 2,
          bold: true,
        },
        tableTitle: {
          italics: true,
          fontSize: 18,
          background: '#e6ffe6'
        },
        resultsStyle: {
          italics: true,
          fontSize: 14,
          alignment: "center",
        },
        finalResults: {
          color: "blue",
        },
      },
    };

    const pdf = pdfMake.createPdf(docDefinition as any);
    pdf.open();
  }