import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import {Router} from '@angular/router';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-init-team',
  templateUrl: './init-team.component.html',
  styleUrls: ['./init-team.component.scss'],
})
export class InitTeamComponent implements OnInit {
  clubs = [];
  private leagueId: Number = null;
  private leagueName: String = null;
  private teamId: Number = null;
  private teamName: String = null;
  constructor(private databseProvider: DatabaseService, private router: Router, private file: File) { 
    
  }

  ngOnInit() {}

  loadAllClubs(){
    this.databseProvider.getAllClubs().then(data =>{
      this.clubs = data;
    })
  }

  loadPLClubs(){
    this.databseProvider.getPremierLeagueClubs().then(data =>{
      this.clubs = data;
    })
  }

  loadBundesClubs(){
    this.databseProvider.getBundesligaClubs().then(data =>{
      this.clubs = data;
    })
  }

  leagueChanged(e) {
    if (e.value == 'Premier League'){
      this.loadPLClubs();
      this.leagueName = 'Premier League';
      this.leagueId = 1;
    }else if (e.value == 'Bundesliga'){
      this.loadBundesClubs();
      this.leagueName = 'Bundesliga';
      this.leagueId = 2;
    }
    else {
        this.ngOnInit();
        this.leagueName = null;
        this.leagueId = null;
    }
    this.teamId = null;
    this.teamName = null;
  }

  clubChanged(e){
    this.teamName = e.value.Name;
    this.teamId = e.value.Id;
  }

  async save() {
    if (this.teamId != null && this.leagueId != null) {
      var toSave = `${this.leagueId};
      ${this.teamId};
      ${this.leagueName};
      ${this.teamName};
      ${this.teamId == 1 ? "2019-07-19" : "2019-08-19"};
      2019-07-01;
      2020-06-30;
      ${this.leagueId == 1 ? 1 : 5}`

      await this.file.writeFile(this.file.dataDirectory, 'player.txt', toSave, {replace:true})
      if (this.leagueId == 2){
        for (var i = 1; i < 5; i++){
          await this.simulateRound(i);
        }
      }
      this.router.navigateByUrl('/menu');

      
    }
  }

  async simulateRound(round){
    let matches = await this.databseProvider.getRound(round);

    matches.forEach(async game => {
      let visitorLuck = (Math.floor(Math.random() * (15 - 8)) + 8) / 10;
      let hostLuck = (Math.floor(Math.random() * (15 - 8)) + 8) / 10;

      let hostSt = await this.databseProvider.getSquadSt(game.Host);
      let visitorSt =  await this.databseProvider.getSquadSt(game.Visitor);
      let hostMid = await this.databseProvider.getSquadMid(game.Host);
      let visitorMid =  await this.databseProvider.getSquadMid(game.Visitor);
      let hostDef = await this.databseProvider.getSquadDef(game.Host);
      let visitorDef =  await this.databseProvider.getSquadDef(game.Visitor);
      let hostGk = await this.databseProvider.getSquadGk(game.Host);
      let visitorGk =  await this.databseProvider.getSquadGk(game.Visitor);

      let hostChances = Math.floor((hostMid * 2 - visitorDef) * 1.1 * hostLuck / 11);
      let visitorChances = Math.floor((visitorMid * 2 - hostDef) * visitorLuck / 11);

      let hostGoalChance = (hostSt * 2 - visitorGk) * 1.1 * hostLuck / 300;
      let visitorGoalChance = (visitorSt * 2 - hostGk) * visitorLuck / 300;

      let hostGoals = Math.round((hostChances < 0 ? 0 : hostChances) * (hostGoalChance < 0.20 ? 0 : hostGoalChance));
      let visitorGoals = Math.round((visitorChances < 0 ? 0 : visitorChances) * (visitorGoalChance < 0.20 ? 0 : visitorGoalChance));

      await this.databseProvider.updateGame(game.Id, hostGoals, visitorGoals);
      await this.databseProvider.updateTable(game.Host, hostGoals, visitorGoals);
      await this.databseProvider.updateTable(game.Visitor, visitorGoals, hostGoals);
    });
  }
}
