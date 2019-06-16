import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface BankData {
  address: string;
  bank_id: number;
  bank_name: string;
  branch: string;
  city: string;
  district: string;
  ifsc: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  bankDetails = new BehaviorSubject({});
  constructor() { }

  setBankGlobalDetails(data: any) {
    this.bankDetails.next(data);
  }

  get getBankGlobalDetails() {
    return this.bankDetails.asObservable();
  }


}
