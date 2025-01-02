import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayersTabPage } from './players-tab.page';

const routes: Routes = [
  {
    path: '',
    component: PlayersTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayersTabPageRoutingModule {}
