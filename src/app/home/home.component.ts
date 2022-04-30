import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  movie: any = {};
  searchField: FormControl = new FormControl();
  isLoadingResults = false;

  constructor(private _httpService: HttpService) {}

  ngOnInit(): void {
    // usando FormControl para observar as mudanças de valor do input, com intervalo de 1s
    this.searchField.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        // buscando filme único, por título, via API
        this.isLoadingResults = true;
        this._httpService.getMovieByTitle(value).subscribe({
          next: (data: any) => {
            if (data.Response === 'True') {
              this.movie = data;
            } else {
              console.log('Search: 😩', data.Error);
              this.movie = {};
            }
          },
          error: (err: any) => {
            console.log(err); // :2DO
          },
          complete: () => {
            this.isLoadingResults = false;
          },
        });
      });
  }
}
