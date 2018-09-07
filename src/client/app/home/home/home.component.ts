import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { RefreshSameUrlService } from '../../shared/services/refresh-same-url.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RefreshSameUrlService]
})
export class HomeComponent implements OnInit {

  isProcessing = true;
  items: ItemViewModel[];

  constructor(private homeService: HomeService,
    public formErrorsService: FormErrorsService,
    private refreshSameUrlService: RefreshSameUrlService) { }

  ngOnInit() {
    this.refreshSameUrlService.init(() => {
      window.scrollTo(0, 0);
      this.getAllItems();
    });

    this.getAllItems();
  }

  getAllItems() {
    this.isProcessing = true;

    this.homeService.getAll(0)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.items = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }
}
