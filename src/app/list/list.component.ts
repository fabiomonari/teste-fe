import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnChanges {
  movies = [];
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

  @Input() movie: string | undefined | null;

  constructor(private _httpService: HttpService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.onSearchMovie(changes['movie'].currentValue, 1);
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
          this.movies = [];
          this.totalResults = 0;
        }
        // return window to beginning of the list
        window.scrollTo(0, 0);
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
