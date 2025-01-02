import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavigationTabsPageRoutingModule } from './navigation-tabs-routing.module';

import { NavigationTabsPage } from './navigation-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavigationTabsPageRoutingModule
  ],
  declarations: [NavigationTabsPage]
})
export class NavigationTabsPageModule {}
