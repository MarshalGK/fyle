import { FavBankComponent } from './banks/fav-bank/fav-bank.component';
import { BankDetailsComponent } from './banks/bank-details/bank-details.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { BankListComponent } from './banks/bank-list/bank-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bankList' },
  { path: 'bankList', component: BankListComponent },
  { path: 'favbanks', component: FavBankComponent },
  { path: 'bank/:id', component: BankDetailsComponent },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
