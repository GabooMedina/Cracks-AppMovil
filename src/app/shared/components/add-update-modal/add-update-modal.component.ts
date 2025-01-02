import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-update-modal',
  templateUrl: './add-update-modal.component.html',
  styleUrls: ['./add-update-modal.component.scss'],
})
export class AddUpdateModalComponent implements OnInit {
  @Input() formData: Record<string, any> = {}; // Datos iniciales
  @Input() fields: { label: string; key: string; type: string }[] = []; // Campos dinámicos
  @Input() isEdit: boolean = false;

  form!: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Inicializar el formulario dinámico
    this.form = this.formBuilder.group(
      this.fields.reduce((acc: Record<string, any>, field) => {
        acc[field.key] = [
          this.formData[field.key] || '', // Valor inicial
          Validators.required, // Validación requerida
        ];
        return acc;
      }, {} as Record<string, any>) // Inicialización del acumulador
    );
  }

  // Guardar cambios
  save() {
    if (this.form.valid) {
      this.modalController.dismiss({
        data: this.form.value,
        isEdit: this.isEdit,
      });
    }
  }

  // Cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }
}
