import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountTabPage } from './account-tab.page';

describe('AccountTabPage', () => {
  let component: AccountTabPage;
  let fixture: ComponentFixture<AccountTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
