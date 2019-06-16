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
  selector: 'app-fav-bank',
  templateUrl: './fav-bank.component.html',
  styleUrls: ['./fav-bank.component.scss']
})
export class FavBankComponent implements OnInit {
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
    this.dataLength = 0;
    const data = JSON.parse(localStorage.getItem('favBank'));
    if (data) {
      this.favBank = data;
      this.dataLength = data.length;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = null;
    }
  }

  trackInputs() {
    this.filters.get('city').valueChanges.subscribe(value => {
      if (value) {
        this.applyFilter(value);
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
  viewBankDetails(bank: BankData) {
    if (isObject(bank)) {
      localStorage.setItem('bankDetails', JSON.stringify(bank));
      this.ROUTER.navigate(['/bank', bank.ifsc]);
    }
  }
  favBankList(bank: BankData, check: MatCheckbox) {
    if (isObject(bank)) {
      const fav = this.favBank;
      const index = fav.findIndex(elm => elm.ifsc === bank.ifsc);
      if (index > -1) {
        this.favBank.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.favBank);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.filters.reset();
        // this.applyFilter(this.filters.get('search').value);
      }
      localStorage.setItem('favBank', JSON.stringify(this.favBank));
    } else {
      console.log('error');
    }
  }
}
