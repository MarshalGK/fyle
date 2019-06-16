import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavBankComponent } from './fav-bank.component';

describe('FavBankComponent', () => {
  let component: FavBankComponent;
  let fixture: ComponentFixture<FavBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
