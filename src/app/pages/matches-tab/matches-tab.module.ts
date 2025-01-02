import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchesTabPageRoutingModule } from './matches-tab-routing.module';

import { MatchesTabPage } from './matches-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchesTabPageRoutingModule
  ],
  declarations: [MatchesTabPage]
})
export class MatchesTabPageModule {}
