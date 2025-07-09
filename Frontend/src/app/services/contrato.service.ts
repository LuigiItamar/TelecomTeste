import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contrato } from './contrato';

@Injectable({ providedIn: 'root' })
export class ContratoService {
  private apiUrl = 'http://localhost:5036/api/Contrato';

  constructor(private http: HttpClient) {}

  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.apiUrl);
  }

  criarContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(this.apiUrl, contrato);
  }

  atualizarContrato(contrato: Contrato): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${contrato.id}`, contrato);
  }

  excluirContrato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 