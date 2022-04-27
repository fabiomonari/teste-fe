import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  API_URL = 'https://www.omdbapi.com/?apikey=e9d181e';

  constructor(private http: HttpClient) {}

  getMovies(movieTitle: string, pageIndex: number): Observable<any> {
    return this.http
      .get<any>(`${this.API_URL}&type=movie&s=${movieTitle}&page=${pageIndex}`)
      .pipe(retry(3), catchError(this.errorHandler));
  }

  getMovieById(movieId: string): Observable<any> {
    return this.http
      .get<any>(`${this.API_URL}&i=${movieId}`)
      .pipe(retry(3), catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error(`Erro de conexão (${error.status}):`, error.error);
    } else {
      console.error(
        `Erro ${error.status} retornado pelo backend:`,
        error.error
      );
    }
    return throwError(
      () => new Error('Algo deu errado! Por favor, tente novamente mais tarde.')
    );
  }
}
