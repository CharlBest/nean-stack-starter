import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isProcessing = true;
  error = false;
  model: any;
  skip = 0;

  constructor(private searchService: HomeService) { }

  ngOnInit() {
  }

  reload() {
    location.reload();
  }
}
