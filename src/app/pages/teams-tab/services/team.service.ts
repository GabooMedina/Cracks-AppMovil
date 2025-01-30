import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private firestore: AngularFirestore) { }

  // Obtener todos los equipos
  getTeams(): Observable<any[]> {
    return this.firestore.collection('teams').valueChanges({ idField: 'id' });
  }

  // Método que devuelve el ID y el nombre de los equipos para usar en un ComboBox
  getTeamsForComboBox(): Observable<{ id: string; name: string }[]> {
    return this.firestore.collection('teams').snapshotChanges().pipe(
      map((actions) =>
        actions.map((action) => {
          const data: any = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, name: data.name };
        })
      )
    );
  }

  // Verificar si existe un equipo con el mismo nombre o entrenador
  async checkDuplicates(team: any, excludeId?: string): Promise<{ exists: boolean, message: string }> {
    const teamsRef = this.firestore.collection('teams');
    
    // Consulta para nombre de equipo
    const nameQuery = teamsRef.ref
      .where('name', '==', team.name)
      .get();
    
    // Consulta para nombre de entrenador
    const coachQuery = teamsRef.ref
      .where('coach', '==', team.coach)
      .get();

    const [nameResults, coachResults] = await Promise.all([nameQuery, coachQuery]);

    // Verificar duplicados excluyendo el ID actual en caso de edición
    const duplicateName = nameResults.docs.some(doc => doc.id !== excludeId);
    const duplicateCoach = coachResults.docs.some(doc => doc.id !== excludeId);

    if (duplicateName) {
      return { exists: true, message: `Ya existe un equipo con el nombre "${team.name}"` };
    }
    if (duplicateCoach) {
      return { exists: true, message: `Ya existe un equipo con el entrenador "${team.coach}"` };
    }

    return { exists: false, message: '' };
  }

  // Agregar un nuevo equipo con validación
  async addTeam(team: any): Promise<any> {
    const duplicateCheck = await this.checkDuplicates(team);
    if (duplicateCheck.exists) {
      throw new Error(duplicateCheck.message);
    }
    return this.firestore.collection('teams').add(team);
  }

  // Actualizar un equipo existente con validación
  async updateTeam(teamId: string, team: any): Promise<void> {
    const duplicateCheck = await this.checkDuplicates(team, teamId);
    if (duplicateCheck.exists) {
      throw new Error(duplicateCheck.message);
    }
    return this.firestore.collection('teams').doc(teamId).update(team);
  }

  // Eliminar un equipo
  deleteTeam(teamId: string): Promise<void> {
    return this.firestore.collection('teams').doc(teamId).delete();
  }
}