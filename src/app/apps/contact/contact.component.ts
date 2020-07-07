import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Contact } from './contact';
import { ContactInfo } from 'src/app/models/contact-info';
import { ContactInfoService } from 'src/app/contactinfo/contactinfo.service';
import { contacts } from '../contacts/contact-data';
import { async } from '@angular/core/testing';
import { ResponseMessage } from 'src/app/models/responsemessage';
import { CommonValidators } from 'src/app/common/common-validators';
import { ValidatorMessages } from 'src/app/common/validator-messages';

@Component({
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
    closeResult: string;
    contacts: ContactInfo[] = [];
    newContactInfo = new ContactInfo();
    searchText: any;
    contactForm: FormGroup;
    invalidContactNumber: string;

    constructor(private modalService: NgbModal,
                private _fb: FormBuilder,
                private _contactInfoService: ContactInfoService) {
                }

    open(content) {
        this.modalService.open(content, { size: 'lg', centered: true });
    }

    ngOnInit() {
        this.contactForm = this._fb.group({
            firstName: [''],
            lastName: [''],
            contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      });

       // validation watchers
       const contactNumberFormControl = this.contactForm.get('contactNumber');

       contactNumberFormControl.valueChanges.subscribe((value) => {
           this.invalidContactNumber =
           CommonValidators.setValidationMessage(contactNumberFormControl, ValidatorMessages.getContactFormValidationMessages());
       });




       // get available contact info
       this._contactInfoService.getContacts().subscribe(
           // tslint:disable-next-line: no-shadowed-variable
           contacts => {
               this.contacts = contacts;
           },
           error => {});
    }

    async addContact() {
        if (this.contactForm.dirty && this.contactForm.valid) {
           const newContactInfo = Object.assign({}, this.newContactInfo, this.contactForm.value);
           this._contactInfoService.addContact(newContactInfo).subscribe(
               async message => await this.onAddContactComplete(message),
               async error => await this.onAddContactError(error)
           );
        }
    }
    onAddContactComplete(message: ResponseMessage) {
        throw new Error("Method not implemented.");
    }
    onAddContactError(error: any) {
        throw new Error("Method not implemented.");
    }
}
