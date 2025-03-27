import { TestBed } from '@angular/core/testing';

import { ExpenseitemService } from './expenseitem.service';

describe('ExpenseitemService', () => {
  let service: ExpenseitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
