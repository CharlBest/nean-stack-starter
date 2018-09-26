import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log(value: unknown, ...rest: any[]) {
    console.log(value, ...rest);
  }

  error(value: unknown, ...rest: any[]) {
    console.error(value, ...rest);
  }

  warn(value: unknown, ...rest: any[]) {
    console.warn(value, ...rest);
  }
}
