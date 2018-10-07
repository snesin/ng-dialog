import { TestBed } from '@angular/core/testing';

import { {#NAME}Dialog } from './{#FILE+Dialog}';

describe('{#NAME}Dialog', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: {#NAME}Dialog = TestBed.get({#NAME}Dialog);
    expect(service).toBeTruthy();
  });
});
