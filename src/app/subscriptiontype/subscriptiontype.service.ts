import { Injectable } from '@angular/core';
import { SubscriptionTypeModule } from './subscriptiontype.module';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Constants } from '../constants';
import { SubscriptionType } from '../models/subscriptiontype';

@Injectable({
  providedIn: SubscriptionTypeModule
})
export class SubscriptionTypeService {

  constructor(
    private _httpClient: HttpClient) { }

  public getSubscriptionTypes(): Observable<SubscriptionType[]> {
     const subscriptiontypes = from(this._httpClient.get<SubscriptionType[]>(Constants.apiRoot + 'subscriptiontypes')
                 .toPromise());
      return subscriptiontypes;
  }
}
