import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { {#NAME}DialogComponent } from './{#FILE+DialogComponent}';

describe('{#NAME}DialogComponent', () => {
  let component: {#NAME}DialogComponent;
  let fixture: ComponentFixture<{#NAME}DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [{#NAME}DialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent({#NAME}DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
