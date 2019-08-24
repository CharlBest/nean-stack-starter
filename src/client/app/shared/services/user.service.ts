import { Injectable } from '@angular/core';

// Workaround for circular dependancies with auth and storage services

@Injectable({
  providedIn: 'root'
})
export class UserService {
  storedLoggedInUserId?: number | null;
}
