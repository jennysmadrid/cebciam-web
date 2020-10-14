import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaTemplateComponent } from './mfa-template.component';

describe('MfaTemplateComponent', () => {
  let component: MfaTemplateComponent;
  let fixture: ComponentFixture<MfaTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfaTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
