import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, getFirestore, collection, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  group!: FormGroup;
  private firestoreInstance: Firestore;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private afAuth: AngularFireAuth
  ) {
    this.firestoreInstance = getFirestore();
  }

  ngOnInit() {
    this.group = this.fb.group({
      name: ['', [Validators.required, this.nameValidator]],
      lastName: ['', [Validators.required, this.nameValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  // Validación para solo letras y espacios
  nameValidator(control: any) {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/;
    if (!regex.test(control.value)) {
      return { invalidName: true };
    }
    return null;
  }

  async save() {
    if (this.group.invalid) {
      this.showToast('⚠️ Por favor, Completa Todos los Campos Correctamente.', 'danger');
      return;
    }

    const { name, lastName, email, password, confirmPassword } = this.group.value;

    // Validación de contraseñas
    if (password !== confirmPassword) {
      this.showToast('⚠️ Las Contraseñas no Coinciden.', 'danger');
      return;
    }

    // Validación de contraseña mínima de 6 caracteres
    if (password.length < 6) {
      this.showToast('⚠️ La Contraseña debe tener al menos 6 caracteres.', 'danger');
      return;
    }

    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(this.firestoreInstance, 'clients', user.uid), {
          name,
          lastName,
          email,
          createdAt: new Date(),
        });

        this.showToast('✔️ Usuario Registrado con Éxito.', 'success');
        this.router.navigate(['/auth']);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.showToast(`⚠️ Error al registrar usuario: ${error.message}`, 'danger');
      } else {
        this.showToast('⚠️ Error desconocido.', 'danger');
      }
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color,
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel',
        }
      ],
    });
    toast.present();
  }
}
