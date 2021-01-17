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

<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
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

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }
}
