import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamsTabPageRoutingModule } from './teams-tab-routing.module';
import { TeamsTabPage } from './teams-tab.page';

// Importaciones de Componentes Externos
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamsTabPageRoutingModule,
    SharedModule
  ],
  declarations: [TeamsTabPage]
})
export class TeamsTabPageModule {}
