import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fatura } from './fatura';

@Injectable({ providedIn: 'root' })
export class FaturaService {
  private apiUrl = 'http://localhost:5036/api/Fatura';

  constructor(private http: HttpClient) {}

  getFaturas(): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(this.apiUrl);
  }

  criarFatura(fatura: Fatura): Observable<Fatura> {
    return this.http.post<Fatura>(this.apiUrl, fatura);
  }

  atualizarFatura(fatura: Fatura): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${fatura.id}`, fatura);
  }

  excluirFatura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
