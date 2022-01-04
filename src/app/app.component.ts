import { Component } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product{
  name: string;
  price: number;
  qty: number;
}
class Invoice{
  customerName: string;
  address: string;
  contactNo: number;
  email: string;

  products: Product[] = [];
  additionalDetails: string;

  constructor(){
    this.products.push(new Product());
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ngOnInit(): void {
  }

  invoice = new Invoice();

  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
          text: 'AIFA.NET',
          fontSize: 16,
          alignment: 'center',
          color: '#000000'
        },
        {
          text: 'Müşteri Bilgileri',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.invoice.customerName,
                bold:true
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo }
            ],
            [
              {
                text: `Tarih: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              {
                text: `Fatura No : ${((Math.random() *1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Ürün Bilgileri',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Ürün', 'Fiyat ₺', 'Adet', 'Tutar ₺'],
              ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
              [{text: 'Total Amount ₺', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Adres Bilgileri',
          style: 'sectionHeader'
        },
        {
            text: this.invoice.additionalDetails,
            margin: [0, 0 ,0, 15]
        },
        {
          columns: [
            [{ qr: `${this.invoice.customerName}`, fit: '50' }],
            [{ text: 'İmza', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Şartlar ve Koşullar',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Fatura 10 gün için geçerlidir. ',
              'Faturada yanlış bir durum varsa 10 gün içinde bildirmeniz gerekiri Eğer belirtilen gün içinde bildirmezseniz talebiniz işleme alınmaz.',
              'Bu Fatura sistem tarafından oluşturulup kaşe veya imza gerektirmez. Kaşe veya imza talabiniz varsa bunu bildiriniz.',
            ],
        },
        {
          text: 'Oğuzhan ÇART',
          style:'Footer',
          bold: true,
          color: '#8d8d8d'
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]
        },
        Footer:{
          margin: [240, 270,20,180]
        }
      }

    };

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();
    }else{
      pdfMake.createPdf(docDefinition).open();
    }

  }

  addProduct(){
    this.invoice.products.push(new Product());
  }

}
