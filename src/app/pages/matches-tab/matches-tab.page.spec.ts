import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchesTabPage } from './matches-tab.page';

describe('MatchesTabPage', () => {
  let component: MatchesTabPage;
  let fixture: ComponentFixture<MatchesTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
