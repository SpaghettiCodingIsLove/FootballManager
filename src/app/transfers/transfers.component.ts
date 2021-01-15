import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss'],
})
export class TransfersComponent implements OnInit {
  clubs = [];
  players = [];
  countries = [];
  league = "";
  club = "";
  country = "";
  name = "";
  surname = "";
  age = "";
  position = "";
  value = "";
  constructor(public navCtrl: NavController, private databseProvider: DatabaseService) {
    this.databseProvider.getDatabaseState().subscribe(rdy =>{
      if(rdy){
        this.loadCountries();
        this.loadAllClubs();
      }
    }) 
  }

  loadAllClubs(){
    this.databseProvider.getAllClubs().then(data =>{
      this.clubs = data;
    })
  }

  leagueChanged(ob){
    this.league = ob.value;
  }

  clubChanged(ob){
    this.club = ob.value;
  }

  ageChanged(ob)
  {
    this.age = ob.value;
  }

  countryChanged(ob){
    this.country = ob.value;
  }

  positionChanged(ob){
    this.position = ob.value;
  }

  loadCountries(){
    this.databseProvider.getCountries().then(data =>{
      this.countries = data;
    })
  }

  szukaj(){
    var command1 = "select p.id as id, p.club as clubId, p.name as name, surname, dateofbirth, n.name as nationality, position, c.name as club, value, salary, contract_terminates, p.overall as overall, offense, defence, potential, pass, gk, isJunior, isRetiring, currPosition from players p, country n, club c, league l where p.club = c.id and p.nationality = n.id and c.league = l.id and p.club != 2";
            if (this.league != "")
                command1 += " and l.name like '%"+this.league+"%'";
            if (this.club != "")
                command1 += " and c.name like '%"+this.club+"%'";
            if (this.country != "")
                command1 += " and n.name like '%"+this.country+"%'";
            if (this.position != "")
                command1 += " and position like '%"+this.position+"%'";
            if (document.getElementById("maxValue").innerHTML != "")
                command1 += " and p.value <= "+document.getElementById("maxValue").innerHTML;

    command1 += " order by p.overall desc";
    
    console.log(command1);
    this.loadSearchedPlayers(command1);

    document.getElementById("opcjeSzukania").style.display = "none";
    document.getElementById("Zawodnicy").style.display = "block";
  }

  zamknij(){
    document.getElementById("opcjeSzukania").style.display = "block";
    document.getElementById("Zawodnicy").style.display = "none";
  }

  kup(){
  }

  loadSearchedPlayers(query)
  {
    this.databseProvider.selectPlayers(query).then(data =>{
      this.players = data;
    })
  }

  playerChanged(ob){
    document.getElementById("overall").innerHTML = ob.value.Overall;
    document.getElementById("potential").innerHTML = ob.value.Potential;
    document.getElementById("defense").innerHTML = ob.value.Defence;
    document.getElementById("offense").innerHTML = ob.value.Offense;
    document.getElementById("passing").innerHTML = ob.value.Pass;
    document.getElementById("goalkeeper").innerHTML = ob.value.Gk;
    document.getElementById("Pname").innerHTML = ob.value.Name;
    document.getElementById("Psurname").innerHTML = ob.value.Surname;
    document.getElementById("Pclub").innerHTML = ob.value.Club;
    document.getElementById("nationality").innerHTML = ob.value.Nationality;
    document.getElementById("birthday").innerHTML = ob.value.DateofBirth;
    document.getElementById("contract").innerHTML = ob.value.Contract;
    document.getElementById("value").innerHTML = ob.value.Value;
    document.getElementById("salary").innerHTML = ob.value.Salary;
  }

  buyNewPlayer(newSalary, contractLength, playerId){
    this.databseProvider.buyPlayer(newSalary, contractLength, playerId).then(data =>{
      data.loadPlayerData();
    })
  }

  ngOnInit() {}

}
