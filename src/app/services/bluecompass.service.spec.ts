import { TestBed } from '@angular/core/testing';

import { BluecompassService } from './bluecompass.service';

describe('BluecompassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BluecompassService = TestBed.get(BluecompassService);
    expect(service).toBeTruthy();
  });
});
