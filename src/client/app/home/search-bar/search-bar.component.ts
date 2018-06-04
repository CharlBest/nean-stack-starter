import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../shared/form.service';
import { HomeService } from '../home.service';
// import { SearchViewModel } from '../../../../shared/view-models/search/SearchViewModel';
// import { debounceTime, switchMap, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  form: FormGroup;
  formErrors;
  isProcessing = false;
  searchResults: any[];
  showNothingFoundMessage = false;

  constructor(private fb: FormBuilder,
    private homeService: HomeService,
    private formService: FormService) { }

  ngOnInit() {
    // this.buildForm();
  }

  // buildForm() {
  //   // TODO: maybe form is overkill just for one field. Consider using ngModel (only template driven forms?)
  //   this.form = this.fb.group({
  //     term: ['']
  //   });

  //   this.form.get('term').valueChanges
  //     .map(x => {
  //       if (x === '') {
  //         this.searchResults = null;
  //       }
  //       return x;
  //     })
  //     .debounceTime(1000)
  //     .filter(x => x !== '')
  //     .switchMap(value => this.search(value))
  //     .subscribe(
  //     data => {
  //       this.isProcessing = false;
  //       this.searchResults = data;

  //       if (data !== null && data.length > 0) {
  //         this.showNothingFoundMessage = false;
  //       } else {
  //         this.showNothingFoundMessage = true;
  //       }
  //     }, error => {
  //       this.isProcessing = false;
  //       this.formErrors = this.formService.showServerErrors(error);
  //     });
  // }

  // search(term: string) {
  //   this.isProcessing = true;
  //   const viewModel = new SearchViewModel();
  //   viewModel.term = term;
  //   return this.searchService.searchStartWith(viewModel);
  // }
}
