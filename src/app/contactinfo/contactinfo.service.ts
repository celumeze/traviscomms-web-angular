import { Injectable } from '@angular/core';
import { ContactInfoModule } from './contactinfo.module';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { SubscriptionType } from '../models/subscriptiontype';
import { Constants } from '../constants';
import { ContactInfo } from '../models/contact-info';
import { ResponseMessage } from '../models/responsemessage';

@Injectable({
  providedIn: ContactInfoModule
})
export class ContactInfoService {

  constructor(
    private _httpClient: HttpClient) { }

  getContacts(): Observable<ContactInfo[]> {
     const contacts = from(this._httpClient.get<ContactInfo[]>(Constants.apiRoot + 'contacts')
                 .toPromise());
      return contacts;
  }

  addContact(contactInfo: ContactInfo): Observable<ResponseMessage> {
    return this._httpClient.post<ResponseMessage>(Constants.apiRoot + 'addContact', contactInfo);
  }
}
