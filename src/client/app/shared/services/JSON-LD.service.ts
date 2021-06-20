import { Injectable } from '@angular/core';
import { Article, BreadcrumbList, Organization, WebApplication, WebSite, WithContext } from 'schema-dts';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JsonLDService {

  private static readonly context = 'https://schema.org';


  // https://developers.google.com/search/docs/data-types/software-app
  static webApplicationSchema = (): WithContext<WebApplication> => {
    return {
      '@context': JsonLDService.context,
      '@type': 'WebApplication',
      name: 'NEAN',
      operatingSystem: 'Android, IOS, Windows, Mac',
      applicationCategory: ApplicationCategory.DeveloperApplication,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.6',
        ratingCount: 10
      },
      offers: {
        '@type': 'Offer',
        price: '0', // 1.00
        // priceCurrency: 'USD'
      }
    };
  }

  // https://developers.google.com/search/docs/data-types/sitelinks-searchbox
  static websiteSchema = (): WithContext<WebSite> => {
    return {
      '@context': JsonLDService.context,
      '@type': 'WebSite',
      name: 'NEAN',
      url: environment.serverEndpoint,
      sameAs: ['https://github.com/CharlBest/nean-stack-starter'],
      potentialAction: {
        '@type': 'SearchAction',
        target: `${environment.serverEndpoint}/discover?q={search_term_string}`,
        query: 'required name=search_term_string'
      }
    };
  }

  static organizationSchema = (): WithContext<Organization> => {
    return {
      '@context': JsonLDService.context,
      '@type': 'Organization',
      url: 'https://google.com',
      name: 'Google',
      logo: `${environment.serverEndpoint}/assets/logo-color.png`,
      founder: 'Charl Best',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'charlbest@yahoo.com',
        contactType: 'Customer service'
      }
    };
  }

  // https://developers.google.com/search/docs/data-types/breadcrumb
  static breadcrumbSchema = (crumbs: Array<{ name: string, url: string }>): WithContext<BreadcrumbList> => {

    const itemListElement = crumbs.map((crumb, index) => {
      return {
        '@type': 'ListItem' as 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      };
    });

    return {
      '@context': JsonLDService.context,
      '@type': 'BreadcrumbList',
      itemListElement
    };
  }

  // https://developers.google.com/search/docs/data-types/article
  static articleSchema = (name?: string): WithContext<Article> => {
    return {
      '@context': JsonLDService.context,
      '@type': 'Article',
      name
    };
  }

  constructor(@Inject(DOCUMENT) private _document: Document) { }

  removeStructuredData(): void {
    const els = [];
    ['structured-data', 'structured-data-org'].forEach(c => {
      els.push(...Array.from(this._document.head.getElementsByClassName(c)));
    });
    els.forEach(el => this._document.head.removeChild(el));
  }

  insertSchema(schema: Record<string, any>, className = 'structured-data'): void {
    let script;
    let shouldAppend = false;
    if (this._document.head.getElementsByClassName(className).length) {
      script = this._document.head.getElementsByClassName(className)[0];
    } else {
      script = this._document.createElement('script');
      shouldAppend = true;
    }
    script.setAttribute('class', className);
    script.type = 'application/json+ld';
    script.text = JSON.stringify(schema);
    if (shouldAppend) {
      this._document.head.appendChild(script);
    }
  }
}

enum ApplicationCategory {
  GameApplication = 'GameApplication',
  SocialNetworkingApplication = 'SocialNetworkingApplication',
  TravelApplication = 'TravelApplication',
  ShoppingApplication = 'ShoppingApplication',
  SportsApplication = 'SportsApplication',
  LifestyleApplication = 'LifestyleApplication',
  BusinessApplication = 'BusinessApplication',
  DesignApplication = 'DesignApplication',
  DeveloperApplication = 'DeveloperApplication',
  DriverApplication = 'DriverApplication',
  EducationalApplication = 'EducationalApplication',
  HealthApplication = 'HealthApplication',
  FinanceApplication = 'FinanceApplication',
  SecurityApplication = 'SecurityApplication',
  BrowserApplication = 'BrowserApplication',
  CommunicationApplication = 'CommunicationApplication',
  DesktopEnhancementApplication = 'DesktopEnhancementApplication',
  EntertainmentApplication = 'EntertainmentApplication',
  MultimediaApplication = 'MultimediaApplication',
  HomeApplication = 'HomeApplication',
  UtilitiesApplication = 'UtilitiesApplication',
  ReferenceApplication = 'ReferenceApplication'
}
