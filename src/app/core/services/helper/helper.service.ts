import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  setItem(key, val) {
    return localStorage.setItem(key, JSON.stringify(val));
  }

  getItem(key) {
    try {
      return JSON.parse( localStorage.getItem(key) );
    } catch (e) {
      return false;
    }
  }

  removeItem(key) {
    return localStorage.removeItem(key);
  }

  removeAll() {
    return localStorage.clear();
  }

  parseToJson( value ) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
}
