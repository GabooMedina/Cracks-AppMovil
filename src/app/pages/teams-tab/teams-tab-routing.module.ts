import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamsTabPage } from './teams-tab.page';

const routes: Routes = [
  {
    path: '',
    component: TeamsTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsTabPageRoutingModule {}
