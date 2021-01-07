import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit {
  players = [];
  player = {};
  constructor(public navCtrl: NavController, private databseProvider: DatabaseService) { 
    this.databseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadPlayerData();
      }
    })
  }

  loadPlayerData() {
    this.databseProvider.getAllPlayers().then(data => {
      this.players = data;
    });
  }

  removePlayer() {
    this.databseProvider.removePlayer().then(data => {
      data.loadPlayerData();
    });
  }

  ngOnInit() {}

}
