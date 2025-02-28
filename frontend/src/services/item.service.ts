import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth } from 'firebase/auth';
import { Item } from '../models/item.model';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = `${environment.baseUrl}/items`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getItems(): Observable<Item[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((items) => items.map((item) => this.mapToItem(item))),
      catchError(this.handleError<Item[]>('getItems', []))
    );
  }

  getItemById(id: string): Observable<Item | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map((item) => this.mapToItem(item)),
      catchError(this.handleError<Item>('getItemById'))
    );
  }

  addItem(item: any): Observable<Item> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.snackBar.open('Usuário não autenticado!', 'Fechar', {
        duration: 3000,
      });
      return throwError(() => new Error('Usuário não autenticado'));
    }

    if (!item.name || !item.description) {
      this.snackBar.open('Preencha todos os campos!', 'Fechar', {
        duration: 3000,
      });
      return throwError(() => new Error('Preencha todos os campos'));
    }

    return this.http.post<any>(this.apiUrl, item).pipe(
      map((response) => this.mapToItem(response)),
      tap(() => {
        this.snackBar.open('Item criado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      }),
      catchError(this.handleError<Item>('addItem'))
    );
  }

  updateItem(id: string, item: any): Observable<Item> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.patch<any>(url, item).pipe(
      map((response) => this.mapToItem(response)),
      tap(() => {
        this.snackBar.open('Item atualizado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      }),
      catchError(this.handleError<Item>('updateItem'))
    );
  }

  deleteItem(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.snackBar.open('Item excluído com sucesso!', 'Fechar', {
          duration: 3000,
        });
      }),
      catchError(this.handleError<void>('deleteItem'))
    );
  }

  private mapToItem(data: any): Item {
    return {
      id: data.id || data._id,
      name: data.name || data.nome,
      description: data.description || data.descricao,
      imageUrl: data.imageUrl || data.foto || '',
      createdAt: data.createdAt || data.criadoEm || new Date(),
    };
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falhou: ${error.message}`);

      this.snackBar.open(
        `Erro ao ${operation}: ${error.error?.message || error.message}`,
        'Fechar',
        { duration: 5000 }
      );

      return of(result as T);
    };
  }
}
