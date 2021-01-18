import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage'


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public http: HttpClient, private sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform) { 
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() =>
      this.sqlite.create({
        name: 'fm2.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.storage.get('database_filled').then(val => {
          if (val) {
            this.databaseReady.next(true);
          } else {
            this.fillDatabase();
          }
        })
      })
    )
  }

  clearPlayers() {
    return this.database.executeSql("delete from players", []).then(res => {
      return res;
    });
  }

  clearSchedule() {
    return this.database.executeSql("delete from schedule", []).then(res => {
      return res;
    });
  }

  clearClub() {
    return this.database.executeSql("delete from club", []).then(res => {
      return res;
    });
  }

  clearLeague() {
    return this.database.executeSql("delete from league", []).then(res => {
      return res;
    });
  }

  clearCountry() {
    return this.database.executeSql("delete from country", []).then(res => {
      return res;
    });
  }

  fillDatabase() {
    this.http.get(
      'assets/dump.sql', 
      {responseType: 'text'}
    ).subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(data => {
        this.databaseReady.next(true);
        this.storage.set('database_filled', true);
      })
    });
  }

  removePlayer() {
    return this.database.executeSql("delete from players where id = 3", []).then(res => {
      return res;
    });
  }

  buyPlayer(newSalary, contractLength, playerId){
    return this.database.executeSql("UPDATE players set salary = "+newSalary+", contract_terminates = '"+contractLength+"', club = 2 where id = "+playerId, []).then(res =>{
      return res;
    })
  }

  PlayerNewContract(newSalary, contract, playerSalary, playerId){
    this.updateClubSalaryBudget(newSalary, playerSalary, playerId);
    this.updatePlayerSalary(newSalary, contract, playerId);
  }

  updateClubSalaryBudget(newSalary, playerSalary, playerId){
    return this.database.executeSql("update club set salaryBudget = salaryBudget -"+(newSalary - playerSalary)+"where id = (select p.club from players p where p.id = "+playerId+")", []).then(res =>{
      return res;
    })
  }

  updatePlayerSalary(newSalary, contract, playerId)
  {
    return this.database.executeSql("update players set salary ="+newSalary+", contract_terminates = '"+contract+"' where id = "+playerId, []).then(res =>{
      return res;
    })
  }

  getYourClub(){
    return this.database.executeSql("select id, name, budget, salaryBudget, coach from club where id = 2", []).then(data =>{
      let club = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          club.push({
            Id: data.rows.item(i).id,
            Name: data.rows.item(i).name,
            Budget: data.rows.item(i).budget,
            SalaryBudget: data.rows.item(i).salaryBudget,
            Coach: data.rows.item(i).coach
          })
        }
      }
      return club;
    }, err => {
      return [];
    })
  }


  transferToClub(playerId, oldClub, transferCost, playerSalary, playerContract, playerValue, playerActuallSalary)
  {
      var szansa = Math.random();
      if((szansa <= 90 && transferCost > playerValue) || (szansa <= 30 && transferCost < playerValue)){
        szansa = Math.random();
        if(playerSalary > playerActuallSalary && szansa <= 90)
        {
          this.transferFromClub(oldClub, transferCost, playerSalary);
          this.buyPlayer(playerSalary, playerContract, playerId);
          this.updateClubMoney(transferCost, playerSalary);
        }
        else{
          alert("Zawodnik nie chce przejść do twojego klubu");
        }
      }
      else{
        alert("Klub nie chce sprzedać tego zawodnika");
      }
  }

  updateClubMoney(transferCost, playerSalary){
    return this.database.executeSql("UPDATE club set budget = budget - "+transferCost+", salaryBudget = salaryBudget - "+playerSalary+" where id = 2", []).then(res =>{
      return res;
    })
  }

  transferFromClub(clubName, transferCost, playerSalary)
  {
    return this.database.executeSql("UPDATE club set budget = budget + "+transferCost+", salaryBudget = salaryBudget + "+playerSalary+" where name = '"+clubName+"'", []).then(res =>{
      return res;
    })
  }

  getClubBudget(){
    return this.database.executeSql("select budget, salaryBudget from club where id = 2", []).then(data =>{
      let club = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          club.push({
            Budget: data.rows.item(i).budget,
            SalaryBudget: data.rows.item(i).salaryBudget
          })
        }
      }
      return club;
    }, err => {
      return [];
    })
  }

  getYourPlayers(){
    return this.database.executeSql("select p.id as id, p.club as clubId, p.name as name, surname, dateofbirth, n.name as nationality, position, c.name as club, value, salary, contract_terminates, p.overall as overall, offense, defence, potential, pass, gk, isJunior, isRetiring, currPosition from players p, country n, club c, league l where p.club = c.id and p.nationality = n.id and c.league = l.id and p.club = 2", []).then(data =>{
      let players = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          players.push({
            Id: data.rows.item(i).id,
            Name: data.rows.item(i).name,
            Surname: data.rows.item(i).surname,
            DateofBirth: data.rows.item(i).dateofbirth,
            Position: data.rows.item(i).position,
            Club: data.rows.item(i).club,
            ClubId: data.rows.item(i).clubId,
            Nationality: data.rows.item(i).nationality,
            Value: data.rows.item(i).value,
            Salary: data.rows.item(i).salary,
            Contract: data.rows.item(i).contract_terminates,
            Overall: data.rows.item(i).overall,
            Offense: data.rows.item(i).offense,
            Defence: data.rows.item(i).defence,
            Potential: data.rows.item(i).potential,
            Pass: data.rows.item(i).pass,
            Gk: data.rows.item(i).gk
          })
        }
      }
      return players;
    }, err => {
      return [];
    })
  }


  selectPlayers(query){
    return this.database.executeSql(query, []).then(data =>{
      let players = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          players.push({
            Id: data.rows.item(i).id,
            Name: data.rows.item(i).name,
            Surname: data.rows.item(i).surname,
            DateofBirth: data.rows.item(i).dateofbirth,
            Position: data.rows.item(i).position,
            Club: data.rows.item(i).club,
            ClubId: data.rows.item(i).clubId,
            Nationality: data.rows.item(i).nationality,
            Value: data.rows.item(i).value,
            Salary: data.rows.item(i).salary,
            Contract: data.rows.item(i).contract_terminates,
            Overall: data.rows.item(i).overall,
            Offense: data.rows.item(i).offense,
            Defence: data.rows.item(i).defence,
            Potential: data.rows.item(i).potential,
            Pass: data.rows.item(i).pass,
            Gk: data.rows.item(i).gk
          })
        }
      }
      return players;
    }, err => {
      return [];
    })
  }

  getAllPlayers() {
    return this.database.executeSql("SELECT * FROM players", []).then(data => {
      let players = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          players.push({
            Name: data.rows.item(i).name,
            Surname: data.rows.item(i).surname
          })
        }
      }
      return players;
    }, err => {
      return [];
    })
  }

  getBundesligaTable(){
    return this.database.executeSql("SELECT name, points, played, scored_goals, lost_goals, wins, loses, draws FROM club where league = 2 order by points desc, scored_goals desc, lost_goals asc", []).then(
      data => {
        let table = [];
        if(data.rows.length > 0)
        {
          for(var i=0; i< data.rows.length; i++){
            table.push({
              Name: data.rows.item(i).name,
              Points: data.rows.item(i).points,
              Played: data.rows.item(i).played,
              Scored_goals: data.rows.item(i).scored_goals,
              Lost_goals: data.rows.item(i).lost_goals,
              Wins: data.rows.item(i).wins,
              Lost: data.rows.item(i).loses,
              Draws: data.rows.item(i).draws
            })
          }
        }
        return table;
      },
      err => {return [];}
    )
  }

  getAllClubs(){
    return this.database.executeSql("SELECT id, name from club where id != 2", []).then(
      data => {
        let table = [];
        if(data.rows.length > 0)
        {
          for(var i=0; i< data.rows.length; i++){
            table.push({
              Name: data.rows.item(i).name,
              Id: data.rows.item(i).id
            })
          }
        }
        return table;
      },
      err => {return [];}
    )
  }

  getCountries(){
    return this.database.executeSql("SELECT id, name from country", []).then(
      data => {
        let table = [];
        if(data.rows.length > 0)
        {
          for(var i=0; i< data.rows.length; i++){
            table.push({
              Name: data.rows.item(i).name,
              Id: data.rows.item(i).id
            })
          }
        }
        return table;
      },
      err => {return [];}
    )
  }

  getBundesligaSchedule(){
    return this.database.executeSql("select s.id as id, c.name as host, c1.name as visitor, host_goals, visitor_goals, matchday, l.name as league, date from schedule s, club c, club c1, league l where s.host = c.id and s.visitor = c1.id and s.league = l.id and l.name = 'Bundesliga' order by matchday", []).then(
      data => {
        let table = [];
        if(data.rows.length > 0)
        {
          for(var i=0; i< data.rows.length; i++){
            table.push({
              Id: data.rows.item(i).id,
              Host: data.rows.item(i).host,
              Visitor: data.rows.item(i).visitor,
              GH: data.rows.item(i).host_goals,
              VG: data.rows.item(i).visitor_goals,
              Matchday: data.rows.item(i).matchday,
              League: data.rows.item(i).league
            })
            if(data.rows.item(i).league == "Bundesliga")
              table[i].Matchday = table[i].Matchday - 4;
          }
        }
        return table;
      },
      err => {return [];}
    )
  }

  getBundesligaMatchday(matchday){
    return this.database.executeSql("select s.id as id, c.name as host, c1.name as visitor, host_goals, visitor_goals, matchday, l.name as league, date from schedule s, club c, club c1, league l where s.host = c.id and s.visitor = c1.id and s.league = l.id and l.name = 'Bundesliga' and matchday =" + matchday, []).then(
      data => {
        let table = [];
        if(data.rows.length > 0)
        {
          for(var i=0; i< data.rows.length; i++){
            table.push({
              Id: data.rows.item(i).id,
              Host: data.rows.item(i).host,
              Visitor: data.rows.item(i).visitor,
              GH: data.rows.item(i).host_goals,
              VG: data.rows.item(i).visitor_goals,
              Matchday: data.rows.item(i).matchday,
              League: data.rows.item(i).league
            })
            if(data.rows.item(i).league == "Bundesliga")
              table[i].Matchday = table[i].Matchday - 4;
          }
        }
        return table;
      },
      err => {return [];}
    )
  }

  getPremierLeagueTable(){
    return this.database.executeSql("SELECT name, points, played, scored_goals, lost_goals, wins, loses, draws FROM club where league = 1 order by points desc, scored_goals desc, lost_goals asc", []).then(
      data => {
        let table = [];
        if(data.rows.length > 0)
        {
          for(var i=0; i< data.rows.length; i++){
            table.push({
              Name: data.rows.item(i).name,
              Points: data.rows.item(i).points,
              Played: data.rows.item(i).played,
              Scored_goals: data.rows.item(i).scored_goals,
              Lost_goals: data.rows.item(i).lost_goals,
              Wins: data.rows.item(i).wins,
              Lost: data.rows.item(i).loses,
              Draws: data.rows.item(i).draws
            })
          }
        }
        return table;
      },
      err => {return [];}
    )
  }

  getPremierLeagueSchedule(){
    return this.database.executeSql("select s.id as id, c.name as host, c1.name as visitor, host_goals, visitor_goals, matchday, l.name as league, date from schedule s, club c, club c1, league l where s.host = c.id and s.visitor = c1.id and s.league = l.id and l.name = 'Premier League' order by matchday", []).then(
      data => {
        let table = [];
        if(data.rows.length > 0)
        {
          for(var i=0; i< data.rows.length; i++){
            table.push({
              Id: data.rows.item(i).id,
              Host: data.rows.item(i).host,
              Visitor: data.rows.item(i).visitor,
              GH: data.rows.item(i).host_goals,
              VG: data.rows.item(i).visitor_goals,
              Matchday: data.rows.item(i).matchday,
              League: data.rows.item(i).league
            })
          }
        }
        return table;
      },
      err => {return [];}
    )
  }

  getPremierLeagueMatchday(matchday){
    return this.database.executeSql("select s.id as id, c.name as host, c1.name as visitor, host_goals, visitor_goals, matchday, l.name as league, date from schedule s, club c, club c1, league l where s.host = c.id and s.visitor = c1.id and s.league = l.id and l.name = 'Premier League' and matchday =" + matchday, []).then(
      data => {
        let table = [];
        if(data.rows.length > 0)
        {
          for(var i=0; i< data.rows.length; i++){
            table.push({
              Id: data.rows.item(i).id,
              Host: data.rows.item(i).host,
              Visitor: data.rows.item(i).visitor,
              GH: data.rows.item(i).host_goals,
              VG: data.rows.item(i).visitor_goals,
              Matchday: data.rows.item(i).matchday,
              League: data.rows.item(i).league
            })
          }
        }
        return table;
      },
      err => {return [];}
    )
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  getPremierLeagueClubs() {
    return this.database.executeSql("select id, name from club where league = 1", []).then(data => {
      let players = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          players.push({
            Name: data.rows.item(i).name,
            Id: data.rows.item(i).id
          })
        }
      }
      return players;
    }, err => {
      return [];
    })
  }

  getBundesligaClubs() {
    return this.database.executeSql("select id, name from club where league = 2", []).then(data => {
      let players = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          players.push({
            Name: data.rows.item(i).name,
            Id: data.rows.item(i).id
          })
        }
      }
      return players;
    }, err => {
      return [];
    })
  }

  getRound(round) {
    return this.database.executeSql("select id, host, visitor from schedule where matchday = " + round , []).then(data => {
      let players = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          players.push({
            Id: data.rows.item(i).id,
            Host: data.rows.item(i).host,
            Visitor: data.rows.item(i).visitor
          })
        }
      }
      return players;
    }, err => {
      return [];
    })
  }

  getSquadDef(id){
    return this.database.executeSql("select avg(defence) as defence from (select defence from players where club = " + id + " and position = \"Defender\" order by defence desc limit 4)", []).then(data => {
      let defence = data.rows.item(0).defence;
      return defence;
    }, err => {
      return 0;
    })
  }

  getSquadSt(id){
    return this.database.executeSql("select avg(offense) as offense from (select offense from players where club = "+ id +" and position = \"Striker\" order by offense desc limit 3)", []).then(data => {
      let st = data.rows.item(0).offense;
      return st;
    }, err => {
      return 0;
    })
  }

  getSquadMid(id){
    return this.database.executeSql("select avg(pass) as pass from (select pass from players where club = " + id + " and position = \"Midfielder\" order by pass desc limit 3)", []).then(data => {
      let mid = data.rows.item(0).pass;
      return mid;
    }, err => {
      return 0;
    })
  }

  getSquadGk(id){
    return this.database.executeSql("select gk from players where club = " + id + " and position = \"Goalkeeper\" order by gk desc limit 1", []).then(data => {
      let gk = data.rows.item(0).gk;
      return gk;
    }, err => {
      return 0;
    })
  }

  updateGame(id, hostGoals, visitorGoals){
    return this.database.executeSql("update schedule set host_goals = " +hostGoals+", visitor_goals = "+visitorGoals+" where id = "+id, [])
    .then(res =>{
      return res;
    })
  }

  updateTable(id: Number, teamGoals: Number, oponentGoals: Number){
    return this.database.executeSql("UPDATE club set points = points + " + (teamGoals == oponentGoals ? "1" : teamGoals > oponentGoals ? "3" : "0") + ", played = played + 1, scored_goals = scored_goals +" + teamGoals +", lost_goals = lost_goals + " + oponentGoals + ", wins = wins + " + (oponentGoals < teamGoals ? 1 : 0) + ", loses = loses + " + (oponentGoals > teamGoals ? 1 : 0) + ", draws = draws + " + (oponentGoals == teamGoals ? 1 : 0) + " where id = " + id, [])
    .then(res =>{
      return res;
    })
  }
}
