import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log(value: unknown, ...rest: unknown[]): void {
    console.log(value, ...rest);
  }

  error(value: unknown, ...rest: unknown[]): void {
    console.error(value, ...rest);
  }

  warn(value: unknown, ...rest: unknown[]): void {
    console.warn(value, ...rest);
  }
}
