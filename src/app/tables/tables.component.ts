import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
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
  BundesligaTable = [];
  PremierLeagueTable = [];
  Bclub = {};
  PLclub = {};
  constructor(public navCtrl: NavController, private databseProvider: DatabaseService) { 
    this.databseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadPlayerData();
        this.loadBundesligaTableData();
      }
    })
  }

  leagueChanged(ob){
    console.log(ob.value);
    if(ob.value == "Bundesliga")
    {
      this.loadBundesligaTableData();
      document.getElementById("bundesligaTable").style.display = "block";
      document.getElementById("premierLeagueTable").style.display = "none";
      console.log(this.BundesligaTable.length);
    }

    if(ob.value == "Premier League")
    {
      this.loadPremierLeagueTableData();
      document.getElementById("bundesligaTable").style.display = "none";
      document.getElementById("premierLeagueTable").style.display = "block";
      console.log(this.PremierLeagueTable.length);
    }
  }

  loadPlayerData() {
    this.databseProvider.getAllPlayers().then(data => {
      this.players = data;
    });
  }

  loadBundesligaTableData(){
    this.databseProvider.getBundesligaTable().then(data =>{
      this.BundesligaTable = data;
    });
  }

  loadPremierLeagueTableData(){
    this.databseProvider.getPremierLeagueTable().then(data =>{
      this.PremierLeagueTable = data;
    });
  }

  removePlayer() {
    this.databseProvider.removePlayer().then(data => {
      data.loadPlayerData();
    });
  }

  ngOnInit() {}

}
