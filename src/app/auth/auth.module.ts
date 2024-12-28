import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthPageRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms'; 
import { AuthPage } from './auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
