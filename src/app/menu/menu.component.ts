import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { File } from '@ionic-native/file/ngx';
import {Router} from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public static LeagueId: Number;
  public static ClubId: Number;
  public static LeagueName: String;
  public static ClubName: String;
  public static CurrentDate: Date;
  public static SeasonEnd: Date;
  public static SeasonStart: Date;
  public static Round: Number;
  private next: Boolean;
  private end: Boolean;
  private nextEnabled: Boolean;

  constructor(private databseProvider: DatabaseService, private file: File, private router: Router) {
    document.addEventListener("backbutton",function(e) {
      // Do nothing
    }, false);
    this.nextEnabled = true;
    this.readData();
    if (MenuComponent.Round >= 39){
      this.next = false;
      this.end = true;
    }
    else {
      this.next = true;
      this.end = false;
    }
    
   }
   
  reset() {
    this.databseProvider.clearPlayers();
    this.databseProvider.clearSchedule();
    this.databseProvider.clearClub();
    this.databseProvider.clearLeague();
    this.databseProvider.clearCountry();
    this.databseProvider.fillDatabase();
    this.file.writeFile(this.file.dataDirectory, 'player.txt', "", {replace:true})
    this.router.navigateByUrl('/initTeam')
  }

  async readData(){
    let text = await this.file.readAsText(this.file.dataDirectory, 'player.txt');
    let array = text.split(';');
    MenuComponent.LeagueId = Number(array[0]);
    MenuComponent.ClubId = Number(array[1]);
    MenuComponent.LeagueName = array[2];
    MenuComponent.ClubName = array[3];
    MenuComponent.CurrentDate = new Date(array[4]);
    MenuComponent.SeasonStart = new Date(array[5]);
    MenuComponent.SeasonEnd = new Date(array[6]);
    MenuComponent.Round = Number(array[7]);
  }

  ngOnInit() {}

  exit() {
    navigator['app'].exitApp();
  }
 
  async nextGame() {
    if (MenuComponent.Round < 39){
      this.nextEnabled = false;
      let matches = await this.databseProvider.getRound(MenuComponent.Round);
      MenuComponent.Round = +MenuComponent.Round + 1;
      if (MenuComponent.Round == 39){
        this.next = false;
        this.end = true;
      }
      else {
        this.next = true;
        this.end = false;
      }
      MenuComponent.CurrentDate.setDate(MenuComponent.CurrentDate.getDate() + 1);
      let toSave = `${MenuComponent.LeagueId};
      ${MenuComponent.ClubId};
      ${MenuComponent.LeagueName};
      ${MenuComponent.ClubName};
      ${MenuComponent.CurrentDate};
      ${MenuComponent.SeasonStart};
      ${MenuComponent.SeasonEnd};
      ${MenuComponent.Round}`;
      await this.file.writeFile(this.file.dataDirectory, 'player.txt', toSave, {replace: true})

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
      this.nextEnabled = true;
    }
  }

  nextSeason(){

  }
}
