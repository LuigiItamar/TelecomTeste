import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fatura } from './fatura';

@Injectable({
  providedIn: 'root'
})
export class FaturaService {
  private apiUrl = 'http://localhost:5036/api/Fatura';

  constructor(private http: HttpClient) {}

  getFaturas(): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(this.apiUrl);
  }
}
