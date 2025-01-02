import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavigationTabsPage } from './navigation-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: NavigationTabsPage,
    children:[
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'teams-tab',
        loadChildren: () => import('../pages/teams-tab/teams-tab.module').then(m => m.TeamsTabPageModule),
      },
      {
        path: 'players-tab',
        loadChildren: () => import('../pages/players-tab/players-tab.module').then(m => m.PlayersTabPageModule),
      },
      {
        path: 'matches-tab',
        loadChildren: () => import('../pages/matches-tab/matches-tab.module').then(m => m.MatchesTabPageModule),
      },
      {
        path: 'account-tab',
        loadChildren: () => import('../pages/account-tab/account-tab.module').then(m => m.AccountTabPageModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavigationTabsPageRoutingModule {}
