import { TestBed } from '@angular/core/testing';

import { SubscriptiontypeService } from './subscriptiontype.service';

describe('SubscriptiontypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptiontypeService = TestBed.get(SubscriptiontypeService);
    expect(service).toBeTruthy();
  });
});
