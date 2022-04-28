import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  movie = '';
  movies = [];
  searchField: FormControl = new FormControl();
  displayedColumns: string[] = [
    'poster',
    'title',
    'year',
    'director',
    'imdbRating',
  ];
  totalResults = 0;
  pageSize = 10;
  pageEvent: PageEvent | undefined;
  isLoadingResults = false;

  constructor(private _httpService: HttpService) {}

  ngOnInit(): void {
    // usando FormControl para observar as mudanças de valor do input, com intervalo de 1s
    this.searchField.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.onSearchMovie(value, 1);
      });
  }

  onSearchMovie(movieTitle: string, pageIndex: number): void {
    // buscando filmes via API
    this.isLoadingResults = true;
    this._httpService.getMovies(movieTitle, pageIndex).subscribe({
      next: (data: any) => {
        if (data.Response === 'True') {
          let foundMovies = data.Search;
          // para cada filme encontrado, buscar pelo id individual na API e adicionar mais detalhes ao objeto encontrado inicialmente (foundMovies)
          foundMovies.forEach((movie: any) => {
            this._httpService.getMovieById(movie.imdbID).subscribe({
              next: (details: any) => {
                movie['Director'] = details['Director'];
                movie['imdbRating'] = details['imdbRating'];
              },
            });
          });
          // recolhendo resultados finais
          this.movie = movieTitle;
          this.movies = foundMovies;
          this.totalResults = data.totalResults;
        } else {
          console.log('No movies found');
        }
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.isLoadingResults = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    if (this.movie) {
      this.onSearchMovie(this.movie, event.pageIndex + 1);
    }
  }
}
