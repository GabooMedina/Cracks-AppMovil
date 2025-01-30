import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './services/statistics.service';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { AddUpdateModalComponent } from '../../shared/components/add-update-modal/add-update-modal.component';

interface Statistic {
  id?: string;
  player_name: string;
  goals: string;
  assits: string;
  yellow_cards: string;
  red_cards: string;
  match_date: string;
}

interface Player {
  id?: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  statistics: Statistic[] = [];
  filteredStatistics: Statistic[] = [];
  playerName: string = '';
  matchDates: string[] = [];
  players: Player[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getStatistics();
    this.getMatchDates();
  }

  getStatistics() {
    this.statisticsService.getStatistics().subscribe((data: Statistic[]) => {
      this.statistics = data;
      this.filteredStatistics = data;
    });
  }

  getMatchDates() {
    this.statisticsService.getMatchDates().subscribe((matches) => {
      this.matchDates = matches.map(match => {
        const matchDate = match['match_date'];
        if (matchDate && matchDate.toDate) {
          return matchDate.toDate().toLocaleDateString();
        } else if (matchDate instanceof Date) {
          return matchDate.toLocaleDateString();
        }
        return '';
      });
    });
  }

  filterByPlayer() {
    if (this.playerName) {
      const searchTerm = this.playerName.toLowerCase();
      this.filteredStatistics = this.statistics.filter(stat =>
        stat.player_name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredStatistics = this.statistics;
    }
  }

  async openModal(stat: Statistic | null = null) {
    const fields = [
      { label: 'Nombre y Apellido del Jugador', key: 'player_name', type: 'text' },
      { label: 'Goles', key: 'goals', type: 'number' },
      { label: 'Asistencias', key: 'assits', type: 'number' },
      { label: 'Tarjetas Amarillas', key: 'yellow_cards', type: 'number' },
      { label: 'Tarjetas Rojas', key: 'red_cards', type: 'number' },
    ];
  
    const isEdit = !!stat;
  
    const modal = await this.modalController.create({
      component: AddUpdateModalComponent,
      componentProps: {
        formData: stat || {},
        fields: fields,
        isEdit: isEdit,
      },
    });
  
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const { player_name, goals, assits, yellow_cards, red_cards } = result.data.data;
  
        // Validaciones
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(player_name)) {
          await this.showToast('⚠️ El nombre del jugador solo debe contener letras.', 'danger');
          return;
        }
  
        if (goals < 0 || assits < 0 || yellow_cards < 0 || red_cards < 0) {
          await this.showToast('⚠️ Goles, asistencias y tarjetas no pueden ser valores negativos.', 'danger');
          return;
        }
  
        try {
          if (result.data.isEdit && stat?.id) {
            await this.statisticsService.updateStatistic(stat.id, result.data.data);
            await this.showToast('¡Estadística Actualizada Exitosamente!', 'success');
          } else {
            const formattedData: Statistic = {
              player_name: result.data.data.player_name,
              goals: result.data.data.goals.toString(),
              assits: result.data.data.assits.toString(),
              yellow_cards: result.data.data.yellow_cards.toString(),
              red_cards: result.data.data.red_cards.toString(),
              match_date: new Date().toISOString(),
            };
  
            await this.statisticsService.addStatistic(formattedData);
            await this.showToast('¡Estadística Guardada Exitosamente!', 'success');
          }
          this.getStatistics();
        } catch (error) {
          console.error('Error:', error);
          await this.showToast('⚠️ Error: No se encontró el jugador.', 'danger');
        }
      }
    });
  
    await modal.present();
  }
  
  
  async deleteStatistic(statId: string) {
    if (!statId) {
      await this.showToast('⚠️ Error: ID de estadística no válido', 'danger');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar esta estadística?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.statisticsService.deleteStatistic(statId);
              this.getStatistics();
              await this.showToast('¡Estadística Eliminada Correctamente!', 'success');
            } catch (error) {
              console.error('Error:', error);
              await this.showToast('⚠️ Error al eliminar la estadística', 'danger');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color,
    });
    toast.present();
  }
}