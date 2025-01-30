import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private matchesCollection = 'matches';
  private teamsCollection = 'teams';

  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los partidos
  getMatches(): Observable<any[]> {
    return this.firestore
      .collection(this.matchesCollection)
      .valueChanges({ idField: 'id' });
  }

  // Obtener todos los equipos
  getTeams(): Observable<any[]> {
    return this.firestore
      .collection(this.teamsCollection)
      .valueChanges({ idField: 'id' });
  }

  // Crear un nuevo partido
  addMatch(match: any): Promise<any> {
    return this.firestore.collection(this.matchesCollection).add(match);
  }

  // Actualizar un partido
  updateMatch(matchId: string, match: any): Promise<any> {
    return this.firestore.collection(this.matchesCollection).doc(matchId).update(match);
  }

  // Eliminar un partido
  deleteMatch(matchId: string): Promise<any> {
    return this.firestore.collection(this.matchesCollection).doc(matchId).delete();
  }
}
