import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operadora } from './operadora';

@Injectable({
  providedIn: 'root',
})
export class OperadoraService {
  private apiUrl = 'http://localhost:5036/api/Operadora';

  constructor(private http: HttpClient) {}

  listarOperadoras(): Observable<Operadora[]> {
    return this.http.get<Operadora[]>(this.apiUrl);
  }

  criarOperadora(operadora: Operadora): Observable<Operadora> {
    return this.http.post<Operadora>(this.apiUrl, operadora);
  }

  atualizarOperadora(operadora: Operadora): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${operadora.id}`, operadora);
  }

  excluirOperadora(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
