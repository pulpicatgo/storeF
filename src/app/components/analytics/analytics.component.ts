import { Component, OnInit } from '@angular/core';
import { ProductAnalytic } from 'src/app/models/analytics';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor(private productsService: ProductsService) { }

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;


  dataStructure: ProductAnalytic[] = [];

  view: [number, number] = [1000, 500];

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe((data) => {
      data.forEach((e: Product) => {
        const name = e.nombreProd!;
        const value = e.cantidad!;
        this.dataStructure.push({ name, value })
      })

    })
  }

  get single() {
    return this.dataStructure;
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
