import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Operadora {
  id: number;
  nome: string;
  tipoServico: string;
  contatoSuporte: string;
}

@Injectable({
  providedIn: 'root'
})
export class OperadoraService {
  private apiUrl = 'http://localhost:5036/api/Operadora';

  constructor(private http: HttpClient) {}

  listar(): Observable<Operadora[]> {
    return this.http.get<Operadora[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Operadora> {
    return this.http.get<Operadora>(`${this.apiUrl}/${id}`);
  }

  criar(operadora: Operadora): Observable<Operadora> {
    return this.http.post<Operadora>(this.apiUrl, operadora);
  }

  atualizar(operadora: Operadora): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${operadora.id}`, operadora);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
