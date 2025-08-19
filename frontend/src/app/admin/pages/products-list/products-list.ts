import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductResponse } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',   
  styleUrls: ['./products-list.scss']
})
export class ProductsListComponent implements OnInit {
  datas:Product[]=[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.productService.getAll().subscribe((res:ProductResponse)=>{
      this.datas = res.data.data
      
    })
  }
}
