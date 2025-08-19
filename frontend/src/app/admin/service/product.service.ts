import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import {Product, ProductResponse} from '../model/product.model';

const httpOptions ={
  headers:new HttpHeaders({'Content-Type':'Application/json'})
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000/admin/products/';
  constructor(private httpClient: HttpClient) {}
  getAll(): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(this.apiUrl);
  }
}