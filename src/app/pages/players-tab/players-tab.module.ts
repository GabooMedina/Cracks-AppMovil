import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayersTabPageRoutingModule } from './players-tab-routing.module';

import { PlayersTabPage } from './players-tab.page';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayersTabPageRoutingModule,
    SharedModule
  ],
  declarations: [PlayersTabPage]
})
export class PlayersTabPageModule {}
