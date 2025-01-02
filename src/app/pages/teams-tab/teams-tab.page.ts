import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TeamService } from './services/team.service';
import { AddUpdateModalComponent } from '../../shared/components/add-update-modal/add-update-modal.component';

@Component({
  selector: 'app-teams-tab',
  templateUrl: './teams-tab.page.html',
  styleUrls: ['./teams-tab.page.scss'],
})
export class TeamsTabPage implements OnInit {

  teams: any[] = []; // Lista de equipos

  constructor(
    private firebaseService: TeamService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    // Obtener equipos al iniciar
    this.getTeams();
  }

  // Obtener equipos desde Firebase
  getTeams() {
    this.firebaseService.getTeams().subscribe((data) => {
      this.teams = data;
    });
  }

  // Abrir el modal para agregar o editar un equipo
  async openModal(team: any = null) {
    const fields = [
      { label: 'Nombre del equipo', key: 'name', type: 'text' },
      { label: 'Entrenador', key: 'coach', type: 'text' },
    ];

    const isEdit = !!team; // Determinar si es para editar

    const modal = await this.modalController.create({
      component: AddUpdateModalComponent,
      componentProps: {
        formData: team || {},
        fields: fields,
        isEdit: isEdit,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (result.data.isEdit) {
          // Editar equipo
          this.firebaseService.updateTeam(team.id, result.data.data).then(() => {
            this.getTeams(); // Actualizar la lista de equipos
          });
        } else {
          // Agregar nuevo equipo
          this.firebaseService.addTeam(result.data.data).then(() => {
            this.getTeams(); // Actualizar la lista de equipos
          });
        }
      }
    });

    await modal.present();
  }

  // Eliminar un equipo
  deleteTeam(teamId: string) {
    this.firebaseService.deleteTeam(teamId).then(() => {
      this.getTeams(); // Actualizar la lista después de eliminar
    });
  }

}
