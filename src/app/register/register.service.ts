import { Injectable } from '@angular/core';
import { RegisterModule } from './register.module';
import { HttpClient } from '@angular/common/http';
import { AccountHolder } from '../models/account-holder';
import { ResponseMessage } from '../models/responsemessage';
import { Constants } from '../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: RegisterModule
})
export class RegisterService {

  constructor(private _httpClient: HttpClient) { }

    registerAccountHolder(accountHolder: AccountHolder): Observable<ResponseMessage> {
       return this._httpClient.post<ResponseMessage>(Constants.apiRoot + 'register', accountHolder);
    }
}
