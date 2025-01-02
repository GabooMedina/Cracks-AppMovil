import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamsTabPage } from './teams-tab.page';

describe('TeamsTabPage', () => {
  let component: TeamsTabPage;
  let fixture: ComponentFixture<TeamsTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
