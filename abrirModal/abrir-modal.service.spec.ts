import { TestBed } from '@angular/core/testing';

import { AbrirModalService } from './abrir-modal.service';

describe('AbrirModalService', () => {
  let service: AbrirModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbrirModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
