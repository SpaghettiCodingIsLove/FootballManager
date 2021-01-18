import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import {Router} from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private file: File, private router: Router) {}

  ngOnInit() {}

  exit() {
    navigator['app'].exitApp();
  }

  async go() {
      this.file.checkFile(this.file.dataDirectory, 'player.txt').then(
        async (x) => {
          var text = await this.file.readAsText(this.file.dataDirectory, 'player.txt')
          if (text == ""){
            this.router.navigateByUrl('/initTeam');
          }
          else {
            this.router.navigateByUrl('/menu')
          }
        }
      ).catch((x) => {this.router.navigateByUrl('/initTeam');});
  }
}
