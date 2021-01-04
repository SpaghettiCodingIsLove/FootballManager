import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { JuniorsComponent } from './juniors/juniors.component';
import { MenuComponent } from './menu/menu.component';
import { SaveComponent } from './save/save.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TablesComponent } from './tables/tables.component';
import { TeamComponent } from './team/team.component';
import { TransfersComponent } from './transfers/transfers.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'juniors',
    component: JuniorsComponent
  },
  {
    path: 'save',
    component: SaveComponent
  },
  {
    path: 'schedule',
    component: ScheduleComponent
  },
  {
    path: 'tables',
    component: TablesComponent
  },
  {
    path: 'team',
    component: TeamComponent
  },
  {
    path: 'transfers',
    component: TransfersComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
