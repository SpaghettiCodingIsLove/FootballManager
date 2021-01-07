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
