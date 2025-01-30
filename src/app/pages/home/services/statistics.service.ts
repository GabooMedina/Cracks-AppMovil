import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todas las estadísticas
  getStatistics(): Observable<Statistic[]> {
    return this.firestore.collection<Statistic>('statistics').valueChanges({ idField: 'id' });
  }

  // Verificar si existe un jugador en la base de datos basado en player_name y player_surname
async checkPlayerExists(playerName: string, playerSurname: string): Promise<boolean> {
  const playersRef = this.firestore.collection('players', ref =>
    ref
      .where('player_name', '==', playerName)
      .where('player_surname', '==', playerSurname)
      .limit(1)
  );

  const snapshot = await playersRef.get().toPromise();
  return snapshot !== undefined && !snapshot.empty;
}


  // Obtener las fechas de los partidos ordenadas
  getMatchDates(): Observable<any[]> {
    return this.firestore.collection('matches', ref => ref.orderBy('match_date')).valueChanges({ idField: 'id' });
  }

  // Buscar estadísticas de un jugador por nombre
  private async findPlayerStatistic(playerName: string): Promise<Statistic | null> {
    const statisticsRef = this.firestore.collection<Statistic>('statistics', ref => 
      ref.where('player_name', '==', playerName).limit(1)
    );

    const snapshot = await statisticsRef.get().toPromise();
    
    if (snapshot && !snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data() as Statistic;
      return {
        id: doc.id,
        ...data
      };
    }
    return null;
  }

 // Agregar o actualizar estadística con verificación de jugador actualizado
async addStatistic(newStatistic: Statistic): Promise<void> {
  try {
    const [playerName, playerSurname] = newStatistic.player_name.split(' '); // Asumimos que el nombre y apellido están juntos en `player_name`
    if (!playerName || !playerSurname) {
      throw new Error('Nombre y apellido deben estar especificados.');
    }

    const playerExists = await this.checkPlayerExists(playerName, playerSurname);

    if (!playerExists) {
      throw new Error('El jugador no existe en la base de datos.');
    }

    const existingPlayer = await this.findPlayerStatistic(newStatistic.player_name);

    if (existingPlayer && existingPlayer.id) {
      const updatedStats = {
        goals: (parseInt(existingPlayer.goals) + parseInt(newStatistic.goals)).toString(),
        assits: (parseInt(existingPlayer.assits) + parseInt(newStatistic.assits)).toString(),
        yellow_cards: (parseInt(existingPlayer.yellow_cards) + parseInt(newStatistic.yellow_cards)).toString(),
        red_cards: (parseInt(existingPlayer.red_cards) + parseInt(newStatistic.red_cards)).toString(),
        match_date: newStatistic.match_date,
      };

      await this.firestore.collection('statistics').doc(existingPlayer.id).update(updatedStats);
    } else {
      await this.firestore.collection('statistics').add(newStatistic);
    }
  } catch (error) {
    console.error('Error en addStatistic:', error);
    throw error;
  }
}
  // Actualizar una estadística específica
  updateStatistic(statId: string, statistic: Partial<Statistic>): Promise<void> {
    return this.firestore.collection('statistics').doc(statId).update(statistic);
  }

  // Eliminar una estadística
  deleteStatistic(statId: string): Promise<void> {
    return this.firestore.collection('statistics').doc(statId).delete();
  }

  // Filtrar estadísticas por nombre del jugador
  getStatisticsByPlayerName(playerName: string): Observable<Statistic[]> {
    return this.firestore.collection<Statistic>('statistics', ref => 
      ref.where('player_name', '==', playerName)
    ).valueChanges({ idField: 'id' });
  }
}