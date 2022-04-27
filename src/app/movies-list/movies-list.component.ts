import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements OnInit {
  movies = [];
  searchField: FormControl = new FormControl();
  displayedColumns: string[] = [
    'poster',
    'title',
    'year',
    'director',
    'imdbRating',
  ];

  constructor(private _httpService: HttpService) {}

  ngOnInit() {
    // usando FormControl para observar as mudanças de valor do input, com intervalo de 1s
    this.searchField.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        // buscando filmes via API
        this._httpService.getMovies(value, 1).subscribe({
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
              this.movies = foundMovies;
            } else {
              console.log('No movies found');
            }
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      });
  }
}
