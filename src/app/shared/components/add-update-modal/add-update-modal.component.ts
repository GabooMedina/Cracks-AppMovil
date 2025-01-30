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
  @Input() fields: { label: string; key: string; type: string; options?: { label: string; value: any }[] }[] = []; // Campos dinámicos con opciones
  @Input() isEdit: boolean = false;

  form!: FormGroup;
  minDate: string = new Date().toISOString(); // Min fecha para el selector

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Inicializar el formulario dinámico
    this.form = this.formBuilder.group(
      this.fields.reduce((acc: Record<string, any>, field) => {
        let initialValue = this.formData[field.key] || '';

        // Si el campo es de tipo "date", asegurarse de que sea un objeto Date
        if (field.type === 'date' && initialValue) {
          initialValue = initialValue instanceof Date ? initialValue : new Date(initialValue);
        }

        acc[field.key] = [
          initialValue, // Valor inicial
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
