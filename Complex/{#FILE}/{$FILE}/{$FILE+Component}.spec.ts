import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { {$NAME}Component } from './{$FILE+Component}';

describe('{$NAME}Component', () => {
  let component: {$NAME}Component;
  let fixture: ComponentFixture<{$NAME}Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [{$NAME}Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent({$NAME}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
