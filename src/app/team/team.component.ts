import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { MenuComponent } from '../menu/menu.component';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  club = [];
  players = [];
  selectedPlayerId = "";
  selectedPlayerClub = "";
  selectedPlayerSalary = "";
  selectedPlayerValue = "";
  newSalary = "";
  newContract = "";
  constructor(public navCtrl: NavController, private databseProvider: DatabaseService) {
    this.databseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getClub();
        this.getPlayers();
        document.getElementById("clubName").innerHTML = MenuComponent.ClubName.toString();
        document.getElementById("clubManager").innerHTML = this.club[0].Coach.toString();
        document.getElementById("clubBudget").innerHTML = this.club[0].Budget.toString();
        document.getElementById("clubSalaryBudget").innerHTML = this.club[0].SalaryBudget.toString();
      }
    })
   }

   NPsalaryUpdated(ob){
    this.newSalary = ob.target.value;
   }

   NPcontractUpdated(ob)
   {
    this.newContract = ob.target.value;
   }   

   playerChanged(ob){
    this.selectedPlayerId = ob.value.Id;
    this.selectedPlayerClub = ob.value.Club;
    this.selectedPlayerSalary = ob.value.Salary;
    this.selectedPlayerValue = ob.value.Value;
    document.getElementById("Overall").innerHTML = ob.value.Overall;
    document.getElementById("Potential").innerHTML = ob.value.Potential;
    document.getElementById("Defense").innerHTML = ob.value.Defence;
    document.getElementById("Offense").innerHTML = ob.value.Offense;
    document.getElementById("Passing").innerHTML = ob.value.Pass;
    document.getElementById("GK").innerHTML = ob.value.Gk;
    document.getElementById("Name").innerHTML = ob.value.Name;
    document.getElementById("Surname").innerHTML = ob.value.Surname;
    document.getElementById("Club").innerHTML = ob.value.Club;
    document.getElementById("Country").innerHTML = ob.value.Nationality;
    document.getElementById("Birthday").innerHTML = ob.value.DateofBirth;
    document.getElementById("Contract").innerHTML = ob.value.Contract;
    document.getElementById("Value").innerHTML = ob.value.Value;
    document.getElementById("Salary").innerHTML = ob.value.Salary;
   }

   wyczysc(){
    document.getElementById("Overall").innerHTML = "";
    document.getElementById("Potential").innerHTML = "";
    document.getElementById("Defense").innerHTML = "";
    document.getElementById("Offense").innerHTML = "";
    document.getElementById("Passing").innerHTML = "";
    document.getElementById("GK").innerHTML = "";
    document.getElementById("Name").innerHTML = "";
    document.getElementById("Surname").innerHTML = "";
    document.getElementById("Club").innerHTML = "";
    document.getElementById("Country").innerHTML = "";
    document.getElementById("Birthday").innerHTML = "";
    document.getElementById("Contract").innerHTML = "";
    document.getElementById("Value").innerHTML = "";
    document.getElementById("Salary").innerHTML = "";
   }

   ExtendContract(){
       var szansa = Math.random();
       if((szansa <= 90 && parseInt(this.newSalary) > parseInt(this.selectedPlayerSalary)) || (szansa <= 30 && parseInt(this.newSalary) < parseInt(this.selectedPlayerSalary)))
       {
         this.databseProvider.PlayerNewContract(this.newSalary, this.newContract, this.selectedPlayerSalary, this.selectedPlayerId);
         alert("Odnowiłeś kontrakt z zawodnikiem");
         document.getElementById("Salary").innerHTML = this.newSalary;
         document.getElementById("Contract").innerHTML = this.newContract;
         this.getPlayers();
       }
       else{
         alert("Zawodnik nie chce podpisać nowego kontraktu");
       }
   }

   getClub()
   {
     this.databseProvider.getYourClub().then(data =>{
      this.club = data;
     })
   }

   getPlayers(){
     this.databseProvider.getYourPlayers().then(data =>{
       this.players = data;
     })
   }

  ngOnInit() {}

}
