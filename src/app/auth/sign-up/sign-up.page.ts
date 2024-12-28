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
    // Usa la instancia inicializada de Firebase
    this.firestoreInstance = getFirestore();
  }

  ngOnInit() {
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
      this.showToast('Por favor, completa todos los campos correctamente.', 'danger');
      return;
    }

    const { name, lastName, email, password, confirmPassword } = this.group.value;

    if (password !== confirmPassword) {
      this.showToast('Las contraseñas no coinciden.', 'danger');
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

        this.showToast('Usuario registrado con éxito.', 'success');
        this.router.navigate(['/auth']);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al registrar usuario:', error.message);
        this.showToast('Error al registrar usuario: ' + error.message, 'danger');
      } else {
        console.error('Error desconocido:', error);
        this.showToast('Error desconocido.', 'danger');
      }
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    toast.present();
  }
}
