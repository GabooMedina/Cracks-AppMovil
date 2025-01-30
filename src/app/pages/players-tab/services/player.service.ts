import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los jugadores
  getPlayers(): Observable<any[]> {
    return this.firestore.collection('players').valueChanges({ idField: 'id' });
  }

  // Obtener jugadores de un equipo específico
  getPlayersByTeam(teamId: string): Observable<any[]> {
    return this.firestore
      .collection('players', (ref) => ref.where('team_id', '==', teamId))
      .valueChanges({ idField: 'id' });
  }

  // Verificar duplicados
  async checkDuplicates(player: any, excludeId?: string): Promise<{ exists: boolean, message: string }> {
    const playersRef = this.firestore.collection('players');
    
    // Consulta para nombre y apellido
    const nameQuery = playersRef.ref
      .where('player_name', '==', player.player_name)
      .where('player_surname', '==', player.player_surname)
      .get();
    
    // Consulta para teléfono
    const phoneQuery = playersRef.ref
      .where('player_phone', '==', player.player_phone)
      .get();

    // Consulta para número de camiseta en el mismo equipo
    const shirtQuery = playersRef.ref
      .where('team_id', '==', player.team_id)
      .where('player_shirt', '==', player.player_shirt)
      .get();

    const [nameResults, phoneResults, shirtResults] = await Promise.all([
      nameQuery, 
      phoneQuery, 
      shirtQuery
    ]);

    // Verificar duplicados excluyendo el ID actual en caso de edición
    const duplicateName = nameResults.docs.some(doc => doc.id !== excludeId);
    const duplicatePhone = phoneResults.docs.some(doc => doc.id !== excludeId);
    const duplicateShirt = shirtResults.docs.some(doc => doc.id !== excludeId);

    if (duplicateName) {
      return { 
        exists: true, 
        message: `Ya existe un jugador con el nombre "${player.player_name} ${player.player_surname}"`
      };
    }
    if (duplicatePhone) {
      return { 
        exists: true, 
        message: `Ya existe un jugador registrado con el teléfono "${player.player_phone}"`
      };
    }
    if (duplicateShirt) {
      return { 
        exists: true, 
        message: `Ya existe un jugador en el equipo con el número de camiseta "${player.player_shirt}"`
      };
    }

    return { exists: false, message: '' };
  }

  // Agregar un nuevo jugador con validación
  async addPlayer(player: any): Promise<any> {
    if (!player.team_id) {
      throw new Error('El Jugador Debe Estar Asociado a un Equipo.');
    }

    const duplicateCheck = await this.checkDuplicates(player);
    if (duplicateCheck.exists) {
      throw new Error(duplicateCheck.message);
    }

    return this.firestore.collection('players').add(player);
  }

  // Actualizar un jugador existente con validación
  async updatePlayer(playerId: string, player: any): Promise<void> {
    const duplicateCheck = await this.checkDuplicates(player, playerId);
    if (duplicateCheck.exists) {
      throw new Error(duplicateCheck.message);
    }

    return this.firestore.collection('players').doc(playerId).update(player);
  }

  // Eliminar un jugador
  deletePlayer(playerId: string): Promise<void> {
    return this.firestore.collection('players').doc(playerId).delete();
  }
}