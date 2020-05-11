import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { SubscriptionType } from '../models/subscriptiontype';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionTypeService {

  constructor(
    private _httpClient: HttpClient) { }

  public getSubscriptionTypes(): Observable<SubscriptionType[]> {    
     const subscriptiontypes = from(this._httpClient.get<SubscriptionType[]>(Constants.apiRoot + "subscriptiontypes")
                 .toPromise());
      return subscriptiontypes;
  }
           
}
