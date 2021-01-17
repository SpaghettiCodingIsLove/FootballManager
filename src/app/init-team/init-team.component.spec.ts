import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InitTeamComponent } from './init-team.component';

describe('InitTeamComponent', () => {
  let component: InitTeamComponent;
  let fixture: ComponentFixture<InitTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitTeamComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InitTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
