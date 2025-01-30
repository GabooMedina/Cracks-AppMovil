import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TeamService } from './services/team.service';
import { AddUpdateModalComponent } from '../../shared/components/add-update-modal/add-update-modal.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-teams-tab',
  templateUrl: './teams-tab.page.html',
  styleUrls: ['./teams-tab.page.scss'],
})
export class TeamsTabPage implements OnInit {
  teams: any[] = [];

  constructor(
    private firebaseService: TeamService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.getTeams();
  }

  getTeams() {
    this.firebaseService.getTeams().subscribe((data) => {
      this.teams = data;
    });
  }

  async openModal(team: any = null) {
    const fields = [
      { label: 'Nombre del equipo', key: 'name', type: 'text' },
      { label: 'Entrenador', key: 'coach', type: 'text' },
    ];

    const isEdit = !!team;

    const modal = await this.modalController.create({
      component: AddUpdateModalComponent,
      componentProps: {
        formData: team || {},
        fields: fields,
        isEdit: isEdit,
      },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const { name, coach } = result.data.data;

        // Validación de nombre del equipo
        if (!this.isValidName(name)) {
          await this.showToast({
            message: '⚠️ El Nombre del Equipo Solo puede contener Letras y Espacios.',
            color: 'danger',
            duration: 4000,
            position: 'top',
            icon: 'warning-outline',
          });
          return;
        }

        // Validación de nombre del entrenador
        if (!this.isValidName(coach)) {
          await this.showToast({
            message: '⚠️ El Nombre del Entrenador solo puede contener Letras y Espacios.',
            color: 'danger',
            duration: 4000,
            position: 'top',
            icon: 'warning-outline',
          });
          return;
        }

        try {
          if (result.data.isEdit) {
            await this.firebaseService.updateTeam(team.id, result.data.data);
            this.getTeams();
            await this.showToast({
              message: '¡Equipo Actualizado Exitosamente!',
              color: 'success',
              duration: 4000,
              position: 'top',
              icon: 'checkmark-circle-outline',
            });
          } else {
            await this.firebaseService.addTeam(result.data.data);
            this.getTeams();
            await this.showToast({
              message: '¡Nuevo Equipo Creado Exitosamente!',
              color: 'success',
              duration: 4000,
              position: 'top',
              icon: 'checkmark-circle-outline',
            });
          }
        } catch (error: any) {
          let errorMessage = `⚠️ Error al ${isEdit ? 'Actualizar' : 'Crear'} El Equipo: ${error.message}`;
          await this.showToast({
            message: errorMessage,
            color: 'danger',
            duration: 4000,
            position: 'top',
            icon: 'warning-outline',
          });
        }
      }
    });

    await modal.present();
  }

   // Función de validación para nombre
   isValidName(value: string): boolean {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/; // Solo letras y espacios
    return regex.test(value);
  }

  async deleteTeam(teamId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este equipo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.firebaseService.deleteTeam(teamId);
              this.getTeams();
              await this.showToast({
                message: '¡Equipo Eliminado Correctamente!',
                color: 'success',
                duration: 4000,
                position: 'top',
                icon: 'trash-outline'
              });
            } catch (error) {
              await this.showToast({
                message: '⚠️ Error al eliminar el equipo',
                color: 'danger',
                duration: 3000,
                position: 'top',
                icon: 'warning-outline'
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(options: {
    message: string;
    color: string;
    duration: number;
    position: 'top' | 'bottom' | 'middle';
    icon?: string;
  }) {
    const toast = await this.toastController.create({
      message: options.message,
      duration: options.duration,
      position: options.position,
      color: options.color,
      buttons: [
        {
          icon: options.icon || 'information-circle-outline',
          side: 'start'
        },
        {
          icon: 'close-outline',
          role: 'cancel'
        }
      ],
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}