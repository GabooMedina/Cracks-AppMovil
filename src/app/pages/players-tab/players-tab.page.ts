import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { PlayerService } from './services/player.service';
import { TeamService } from '../teams-tab/services/team.service';
import { AddUpdateModalComponent } from '../../shared/components/add-update-modal/add-update-modal.component';

@Component({
  selector: 'app-players-tab',
  templateUrl: './players-tab.page.html',
  styleUrls: ['./players-tab.page.scss'],
})
export class PlayersTabPage implements OnInit {
  players: any[] = [];
  teams: { id: string; name: string }[] = [];

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.getPlayers();
  }

  loadTeams(): void {
    this.teamService.getTeamsForComboBox().subscribe((teams) => {
      this.teams = teams;
    });
  }

  getPlayers(): void {
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data.map(player => {
        const team = this.teams.find(team => team.id === player.team_id);
        return {
          ...player,
          team_name: team ? team.name : 'Equipo no encontrado',
        };
      });
    });
  }

  async openModal(player: any = null) {
    const fields = [
      { label: 'Nombre del Jugador', key: 'player_name', type: 'text' },
      { label: 'Apellido del Jugador', key: 'player_surname', type: 'text' },
      { label: 'Edad', key: 'player_age', type: 'number' },
      { label: 'Teléfono', key: 'player_phone', type: 'text' },
      { label: '# Camiseta', key: 'player_shirt', type: 'number' },
      { 
        label: 'Género', 
        key: 'player_gender', 
        type: 'select', 
        options: [
          { label: 'Masculino', value: 'Masculino' },
          { label: 'Femenino', value: 'Femenino' },
        ] 
      },
      { 
        label: 'Equipo', 
        key: 'team_id', 
        type: 'select', 
        options: this.teams.map(team => ({ label: team.name, value: team.id }))
      },
    ];

    const isEdit = !!player;

    const modal = await this.modalController.create({
      component: AddUpdateModalComponent,
      componentProps: {
        formData: player || {},
        fields: fields,
        isEdit: isEdit,
      },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        try {
          const formData = result.data.data;
  
          // Validación: Comprobar si el número de camiseta es negativo
          if (formData.player_shirt < 0) {
            await this.showToast({
              message: '⚠️ El Número de la Camiseta No puede ser Negativo',
              color: 'danger',
              duration: 3000,
              icon: 'warning-outline'
            });
            return; // Evitar continuar si la validación falla
          }
  
          if (result.data.isEdit) {
            await this.playerService.updatePlayer(player.id, formData);
            this.getPlayers();
            await this.showToast({
              message: '¡Jugador Actualizado Exitosamente!',
              color: 'success',
              duration: 4000,
              icon: 'checkmark-circle-outline'
            });
          } else {
            await this.playerService.addPlayer(formData);
            this.getPlayers();
            await this.showToast({
              message: '¡Nuevo Jugador Creado Exitosamente!',
              color: 'success',
              duration: 4000,
              icon: 'checkmark-circle-outline'
            });
          }
        } catch (error: any) {
          let errorMessage = '';
          if (error.message.includes('nombre')) {
            errorMessage = `⚠️ No se pudo ${isEdit ? 'Actualizar' : 'Crear'} el Jugador: Ya existe un Jugador con ese Nombre`;
          } else if (error.message.includes('teléfono')) {
            errorMessage = `⚠️ No se pudo ${isEdit ? 'Actualizar' : 'Crear'} el Jugador: El Número de Teléfono ya está Registrado`;
          } else if (error.message.includes('camiseta')) {
            errorMessage = `⚠️ No se pudo ${isEdit ? 'Actualizar' : 'Crear'} el Jugador: El Número de Camiseta ya está en uso en este equipo`;
          } else {
            errorMessage = `⚠️ Error al ${isEdit ? 'actualizar' : 'crear'} el jugador: ${error.message}`;
          }
  
          await this.showToast({
            message: errorMessage,
            color: 'danger',
            duration: 4000,
            icon: 'warning-outline'
          });
        }
      }
    });
  
    await modal.present();
  }

  // Función de validación para nombres
  isValidName(value: string): boolean {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/; // Solo letras y espacios
    return regex.test(value);
  }

  // Función de validación para edad (número positivo)
  isValidAge(value: number): boolean {
    return value > 0; // La edad debe ser positiva
  }

  // Función de validación para teléfono (10 dígitos y no negativo)
  isValidPhone(value: string): boolean {
    const regex = /^[0-9]{10}$/; // El teléfono debe tener exactamente 10 dígitos
    return regex.test(value) && parseInt(value) > 0;
  }

  async deletePlayer(playerId: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este jugador?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.playerService.deletePlayer(playerId);
              this.getPlayers();
              await this.showToast({
                message: '¡Jugador Eliminado Correctamente!',
                color: 'success',
                duration: 4000,
                icon: 'trash-outline'
              });
            } catch (error) {
              await this.showToast({
                message: '⚠️ Error al eliminar el jugador',
                color: 'danger',
                duration: 3000,
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
    icon?: string;
  }) {
    const toast = await this.toastController.create({
      message: options.message,
      duration: options.duration,
      position: 'top',
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