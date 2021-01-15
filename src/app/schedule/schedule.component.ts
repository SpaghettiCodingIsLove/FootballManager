import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  matchday = "";
  league = "";
  BundesligaMatchday = [];
  PremierLeagueMatchday = [];
  constructor(public navCtrl: NavController, private databseProvider: DatabaseService) {
      this.databseProvider.getDatabaseState().subscribe(rdy =>{
        if(rdy){

        }
      })
    
  }

  leagueChanged(ob){
    this.league = ob.value;
  }

  matchdayChanged(ob){
    this.matchday = ob.value;
  }

  loadBundesligaSchedule(){
    this.databseProvider.getBundesligaSchedule().then(data =>{
      this.BundesligaMatchday = data;
    })
  }

  loadBundesligaMatchday(matchday){
    this.databseProvider.getBundesligaMatchday(matchday).then(data =>{
      this.BundesligaMatchday = data;
    })
  }

  loadPremierLeagueaSchedule(){
    this.databseProvider.getPremierLeagueSchedule().then(data =>{
      this.PremierLeagueMatchday = data;
    })
  }

  loadPremierLeagueMatchday(matchday){
    this.databseProvider.getPremierLeagueMatchday(matchday).then(data =>{
      this.PremierLeagueMatchday = data;
    })
  }

  szukaj()
  {
    if(this.league == "Bundesliga" && this.matchday == "")
    {
      this.loadBundesligaSchedule();
      document.getElementById("premierLeagueSchedule").style.display = "none";
      document.getElementById("bundesligaSchedule").style.display = "block";
    }
    if(this.league == "Bundesliga" && parseInt(this.matchday) >= 5)
    {
      this.loadBundesligaMatchday(this.matchday);
      document.getElementById("premierLeagueSchedule").style.display = "none";
      document.getElementById("bundesligaSchedule").style.display = "block";
    }
    if(this.league == "Premier League" && this.matchday == "")
    {
      this.loadPremierLeagueaSchedule();
      document.getElementById("premierLeagueSchedule").style.display = "block";
      document.getElementById("bundesligaSchedule").style.display = "none";
    }
    if(this.league == "Premier League" && this.matchday != "")
    {
      this.loadPremierLeagueMatchday(this.matchday)
      document.getElementById("premierLeagueSchedule").style.display = "block";
      document.getElementById("bundesligaSchedule").style.display = "none";
    }
  }

  clear(){
    this.league = "";
    this.matchday = "";
    document.getElementById("bundesligaSchedule").style.display = "none";
  }

  ngOnInit() {}

}
