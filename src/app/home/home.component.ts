import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  movie = '';
  searchField: FormControl = new FormControl();

  constructor() {}

  ngOnInit(): void {
    // usando FormControl para observar as mudanças de valor do input, com intervalo de 1s
    this.searchField.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.movie = value;
      });
  }
}
