import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { JuniorsComponent } from './juniors/juniors.component';
import { SaveComponent } from './save/save.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TablesComponent } from './tables/tables.component';
import { TeamComponent } from './team/team.component';
import { TransfersComponent } from './transfers/transfers.component';

import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [AppComponent, MenuComponent, HomeComponent, JuniorsComponent, SaveComponent, ScheduleComponent, TablesComponent, TeamComponent, TransfersComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, MatButtonModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
