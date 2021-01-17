import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
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
        document.getElementById("clubName").innerHTML = this.club[0].Name.toString();
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

   ExtendContract(){
     if(parseInt(this.newSalary) - parseInt(this.selectedPlayerSalary) > this.club[0].SalaryBudget)
     {
       var szansa = Math.random();
       if((szansa <= 90 && parseInt(this.newSalary) > parseInt(this.selectedPlayerSalary)) || (szansa <= 30 && parseInt(this.newSalary) < parseInt(this.selectedPlayerSalary)))
       {
         this.databseProvider.PlayerNewContract(this.newSalary, this.newContract, this.selectedPlayerSalary, this.selectedPlayerId);
         alert("Odnowiłeś kontrakt z zawodnikiem");
       }
       else{
         alert("Zawodnik nie chce podpisać nowego kontraktu");
       }
     }
     else{
       alert("Nie stać cię");
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
