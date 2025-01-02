import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationTabsPage } from './navigation-tabs.page';

describe('NavigationTabsPage', () => {
  let component: NavigationTabsPage;
  let fixture: ComponentFixture<NavigationTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
