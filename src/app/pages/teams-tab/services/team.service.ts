import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los equipos
  getTeams(): Observable<any[]> {
    return this.firestore.collection('teams').valueChanges({ idField: 'id' });
  }

  // Agregar un nuevo equipo
  addTeam(team: any): Promise<any> {
    return this.firestore.collection('teams').add(team);
  }

  // Actualizar un equipo existente
  updateTeam(teamId: string, team: any): Promise<void> {
    return this.firestore.collection('teams').doc(teamId).update(team);
  }

  // Eliminar un equipo
  deleteTeam(teamId: string): Promise<void> {
    return this.firestore.collection('teams').doc(teamId).delete();
  }
}
