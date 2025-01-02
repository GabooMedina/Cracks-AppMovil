import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

//Importaciones de Formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Importación de Componentes
import { AddUpdateModalComponent } from './components/add-update-modal/add-update-modal.component';


@NgModule({
  declarations: [AddUpdateModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddUpdateModalComponent]  
})
export class SharedModule { }
