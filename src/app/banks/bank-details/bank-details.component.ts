import { isObject } from 'util';
import { GlobalService, BankData } from './../../services/global.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  bankDetails: BankData;
  detailKeys = [];
  constructor(
    private GLOBALSERVICE: GlobalService,
    private ROUTER: Router,
    private ACTIVATEDROUTE: ActivatedRoute
  ) { }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('bankDetails'));
    if (isObject(data)) {
      this.detailKeys = Object.keys(data);
      this.bankDetails = data;
    } else {
      this.ROUTER.navigate(['/']);
    }
    this.fetchParams();
  }

  fetchParams() {
    this.ACTIVATEDROUTE.params.subscribe(param => {
      const id = param.id;
      if (id !== this.bankDetails.ifsc) {
        this.ROUTER.navigate(['/']);
      }
    });
  }

}
