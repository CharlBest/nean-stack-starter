import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log(value: unknown, ...rest) {
    console.log(value, ...rest);
  }

  error(value: unknown, ...rest) {
    console.error(value, ...rest);
  }

  warn(value: unknown, ...rest) {
    console.warn(value, ...rest);
  }
}
