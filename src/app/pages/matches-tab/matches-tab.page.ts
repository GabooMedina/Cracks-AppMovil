import { Component, OnInit } from '@angular/core';
import { MatchesService } from './services/matches.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AddUpdateModalComponent } from 'src/app/shared/components/add-update-modal/add-update-modal.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-matches-tab',
  templateUrl: './matches-tab.page.html',
  styleUrls: ['./matches-tab.page.scss'],
})
export class MatchesTabPage implements OnInit {
  matches: any[] = [];
  teams: { id: string; name: string }[] = [];

  constructor(
    private matchesService: MatchesService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadTeamsAndMatches();
  }

  loadTeamsAndMatches(): void {
    this.matchesService.getTeams().subscribe((teams) => {
      this.teams = teams;
      this.getMatches();
    });
  }

  getMatches(): void {
    this.matchesService.getMatches().subscribe((data) => {
      this.matches = data.map((match) => {
        const matchDate = match.match_date && match.match_date.toDate ? match.match_date.toDate() : new Date(match.match_date);
        
        return {
          ...match,
          match_date: matchDate,
          home_team_name: this.teams.find((team) => team.id === match.home_team_id)?.name || 'No definido',
          away_team_name: this.teams.find((team) => team.id === match.away_team_id)?.name || 'No definido',
        };
      });
    });
  }

  async openModal(match: any = null) {
    const teamOptions = this.teams.map((team) => ({ label: team.name, value: team.id }));

    const fields = [
      { label: 'Equipo Local', key: 'home_team_id', type: 'select', options: teamOptions },
      { label: 'Equipo Visitante', key: 'away_team_id', type: 'select', options: teamOptions },
      { label: 'Fecha del Partido', key: 'match_date', type: 'date' },
    ];

    const isEdit = !!match;

    const modal = await this.modalController.create({
      component: AddUpdateModalComponent,
      componentProps: { formData: match || {}, fields, isEdit },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const newMatchData = result.data.data;

        if (newMatchData.home_team_id === newMatchData.away_team_id) {
          await this.showToast({
            message: '⚠️ No se puede Crear el Partido: El equipo Local y Visitante no pueden ser el mismo',
            color: 'danger',
            duration: 4000,
            icon: 'warning-outline'
          });
          return;
        }

        try {
          if (result.data.isEdit) {
            await this.matchesService.updateMatch(match.id, newMatchData);
            this.getMatches();
            await this.showToast({
              message: '¡Partido Actualizado Exitosamente!',
              color: 'success',
              duration: 4000,
              icon: 'checkmark-circle-outline'
            });
          } else {
            await this.matchesService.addMatch(newMatchData);
            this.getMatches();
            await this.showToast({
              message: '¡Nuevo Partido Creado Exitosamente!',
              color: 'success',
              duration: 4000,
              icon: 'checkmark-circle-outline'
            });
          }
        } catch (error: any) {
          await this.showToast({
            message: `⚠️ Error al ${isEdit ? 'actualizar' : 'crear'} el partido: ${error.message}`,
            color: 'danger',
            duration: 3000,
            icon: 'warning-outline'
          });
        }
      }
    });

    await modal.present();
  }

  async deleteMatch(matchId: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas Eliminar este Partido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.matchesService.deleteMatch(matchId);
              this.getMatches();
              await this.showToast({
                message: '¡Partido Eliminado Correctamente!',
                color: 'success',
                duration: 4000,
                icon: 'trash-outline'
              });
            } catch (error) {
              await this.showToast({
                message: '⚠️ Error al eliminar el partido',
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