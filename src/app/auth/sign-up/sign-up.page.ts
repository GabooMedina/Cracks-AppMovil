import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, doc, setDoc } from 'firebase/firestore';  // Usar Firestore desde firebase/firestore
import { getFirestore } from 'firebase/firestore';  // Acceder a la instancia de Firestore

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  group!: FormGroup;
  firestoreInstance: Firestore;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private afAuth: AngularFireAuth
  ) {
    // Inicializamos Firestore
    this.firestoreInstance = getFirestore();  // Obtener la instancia de Firestore
  }

  ngOnInit() {
    // Configuración del formulario reactivo
    this.group = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  async save() {
    if (this.group.invalid) {
      this.showToast('Por Favor, Completa Todos los Campos Correctamente.', 'danger');
      return;
    }

    const { name, lastName, email, password, confirmPassword } = this.group.value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      this.showToast('Las Contraseñas No Coinciden.', 'danger');
      return;
    }

    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Guardar datos adicionales en Firestore
        await setDoc(doc(this.firestoreInstance, 'clients', user.uid), {
          name,
          lastName,
          email,
          createdAt: new Date(),
        });

        // Mostrar mensaje de éxito y redirigir
        this.showToast('Usuario Registrado con Éxito.', 'success');
        this.router.navigate(['/auth']); // Redirige al login
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al registrar usuario:', error.message);
        this.showToast('Error al registrar usuario: ' + error.message, 'danger');
      } else {
        console.error('Error desconocido al registrar usuario:', error);
        this.showToast('Error desconocido al registrar usuario.', 'danger');
      }
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color, // Especifica el color del toast (success, danger, etc.)
    });
    toast.present();
  }
}
