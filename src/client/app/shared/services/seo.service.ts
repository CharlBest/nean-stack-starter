import { Injectable } from '@angular/core';
import { JsonLDService } from './JSON-LD.service';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(private jsonLDService: JsonLDService) { }

  init(): void {
    JsonLDService.webApplicationSchema();
    JsonLDService.websiteSchema();
    JsonLDService.organizationSchema();
  }
}
