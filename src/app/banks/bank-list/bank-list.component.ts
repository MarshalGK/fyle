import { GlobalService, BankData } from './../../services/global.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { pipe } from 'rxjs';
import { distinctUntilChanged, debounceTime, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { isObject } from 'util';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit {
  filters: FormGroup;
  displayedColumns: string[] = [
    'fav',
    'bank_id',
    'bank_name',
    'ifsc',
    'branch',
    'state',
    'city',
    'district',
    'address'
  ];
  dataSource: MatTableDataSource<BankData>;
  dataLength = 0;
  favBank = [];
  bankListLoader = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private APICALL: ApiService,
    private FORMBUILDER: FormBuilder,
    private GLOBALSERVICE: GlobalService,
    private ROUTER: Router
  ) { }

  ngOnInit() {
    this.filters = this.FORMBUILDER.group({
      city: [''],
      search: ['']
    });
    this.trackInputs();
  }

  fetchBankList(city: string) {
    let serverData: any;
    this.dataLength = 0;
    this.bankListLoader = true;
    this.filters.get('city').disable();
    this.APICALL.getBankList(city).subscribe(response => {
      serverData = response;
    },
      error => {
        console.log(error);
        this.bankListLoader = false;
        this.filters.get('city').enable();
      },
      () => {
        this.dataLength = serverData.length;
        this.dataSource = new MatTableDataSource(serverData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.filters.get('city').enable();
        this.bankListLoader = false;
      });
  }

  trackInputs() {
    this.filters.get('city').valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe(value => {
      if (value) {
        this.fetchBankList(value.toUpperCase());
      }
    });
    this.filters.get('search').valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(value => {
      if (this.dataLength) {
        this.applyFilter(value);
      }
    });
  }

  applyFilter(filterValue: string) {
    const data = this.dataSource;
    data.filter = filterValue.trim().toLowerCase();
  }

  favBankList(bank: BankData, check: MatCheckbox) {
    this.favBank = [];
    if (isObject(bank)) {
      const localData = localStorage.getItem('favBank');
      if (localData !== undefined && localData !== null && localData !== '') {
        const temp = JSON.parse(localData);
        temp.forEach(elm => {
          this.favBank.push(elm);
        });
        const fav = this.favBank;
        const index = fav.findIndex(elm => elm.ifsc === bank.ifsc);
        if (check.checked) {
          if (index === -1) {
            this.favBank.push(bank);
          }
        } else {
          if (index > -1) {
            this.favBank.splice(index, 1);
          }
        }
      } else {
        this.favBank.push(bank);
      }
      localStorage.setItem('favBank', JSON.stringify(this.favBank));
    } else {
      console.log('error');
    }
  }

  viewBankDetails(bank: BankData) {
    if (isObject(bank)) {
      localStorage.setItem('bankDetails', JSON.stringify(bank));
      this.ROUTER.navigate(['/bank', bank.ifsc]);
    }
  }
}
