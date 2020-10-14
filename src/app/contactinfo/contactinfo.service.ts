import { Injectable } from '@angular/core';
import { ContactInfoModule } from './contactinfo.module';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { SubscriptionType } from '../models/subscriptiontype';
import { Constants } from '../constants';
import { ContactInfo } from '../models/contact-info';
import { ResponseMessage } from '../models/responsemessage';
import { ContactCsvInfo } from '../models/contact-csv-info';

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

  addContact(newContact: ContactInfo): Observable<ContactInfo> {
    return this._httpClient.post<ContactInfo>(Constants.apiRoot + 'contact', newContact);
  }

  uploadContacts(contactCsvInfo: FormData): Observable<ContactInfo[]> {
    return this._httpClient.post<ContactInfo[]>(Constants.apiRoot + 'uploadcontactscsv', contactCsvInfo);
  }

  updateContact(editContact: ContactInfo): Observable<ContactInfo> {
    return this._httpClient.patch<ContactInfo>(Constants.apiRoot + 'editcontact', editContact);
  }
}
