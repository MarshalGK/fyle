import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public responseCache = new Map();
  bankListApi = environment.BankListApi;
  constructor(
    private HTTP: HttpClient
  ) { }

  getBankList(cityName: string): Observable<any> {
    const URL = `${this.bankListApi}/banks?city=${cityName}`;
    const cache = this.responseCache.get(URL);
    if (cache) {
      return of(cache);
    }
    return this.HTTP.get(URL).pipe(
      map(data => {
        this.responseCache.set(URL, data);
        return data;
      }),
      catchError(error => this.handleError(error))
    );
  }
  handleError(error) {
    console.log(error);
    return error;
  }
}
