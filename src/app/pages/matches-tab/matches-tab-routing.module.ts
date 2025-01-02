import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchesTabPage } from './matches-tab.page';

const routes: Routes = [
  {
    path: '',
    component: MatchesTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchesTabPageRoutingModule {}
