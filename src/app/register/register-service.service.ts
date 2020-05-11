import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountHolder } from '../models/accountholder';
import { Observable, from } from 'rxjs';
import { Constants } from '../constants';
import { ResponseMessage } from '../models/responsemessage';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private _httpClient: HttpClient) { }

    registerAccountHolder(accountHolder: AccountHolder): Observable<ResponseMessage>{
       return this._httpClient.post<ResponseMessage>(Constants.apiRoot + 'register', accountHolder);
    }
}
