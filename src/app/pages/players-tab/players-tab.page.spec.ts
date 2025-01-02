import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayersTabPage } from './players-tab.page';

describe('PlayersTabPage', () => {
  let component: PlayersTabPage;
  let fixture: ComponentFixture<PlayersTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
