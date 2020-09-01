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
import { HttpErrorResponse } from '@angular/common/http';
import { id } from 'date-fns/locale';

@Component({
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
    closeResult: string;
    modalTitle: string;
    contacts: ContactInfo[] = [];
    newContactInfo = new ContactInfo();
    searchText: any;
    contactForm: FormGroup;
    invalidContactNumber: string;
    currentlySelectedContact: ContactInfo;
    responseMessage = new ResponseMessage();
    isAddVisible = true;
    isLoaderVisible = false;
    isEditVisible = false;
    isSpinnerVisible = false;
    emptyContacts = CommonValidators.emptyContacts;


    constructor(private modalService: NgbModal,
                private _fb: FormBuilder,
                private _contactInfoService: ContactInfoService) {
                }

    open(content) {
        this.modalService.open(content, { size: 'lg', centered: true});
        this.contactForm.patchValue({
            Id: [''],
            firstName: [''],
            lastName: [''],
            contactNumber: ['']
          });
          this.isAddVisible = true;
          this.isEditVisible = false;
          this.modalTitle = 'Add Contact';
          this.responseMessage = new ResponseMessage();
          this.currentlySelectedContact = null;
    }

    openEditModal(content, c: ContactInfo) {
        this.modalService.open(content, { size: 'lg', centered: true});
        this.contactForm.patchValue({
            Id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            contactNumber: c.contactNumber
          });
          this.modalTitle = 'Update Contact';
          this.isAddVisible = false;
          this.isEditVisible = true;
          this.responseMessage = new ResponseMessage();
          this.currentlySelectedContact = c;
    }

    ngOnInit() {
        this.contactForm = this._fb.group({
            Id: [''],
            firstName: [''],
            lastName: [''],
            contactNumber: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[0-9]*$')]],
      });
      this.getContacts();
       // validation watchers
       const contactNumberFormControl = this.contactForm.get('contactNumber');

       contactNumberFormControl.valueChanges.subscribe((value) => {
           this.invalidContactNumber =
           CommonValidators.setValidationMessage(contactNumberFormControl, ValidatorMessages.getContactFormValidationMessages());
       });
    }


    async getContacts() {
        // tslint:disable-next-line: no-shadowed-variable
        this.isSpinnerVisible = true;
        // tslint:disable-next-line: no-shadowed-variable
        this._contactInfoService.getContacts().subscribe(contacts => {
            this.contacts = contacts;
            this.isSpinnerVisible = false;
        },
        async error => await this.onGetContactsError(error));
    }

    async addContact() {
        if (this.contactForm.dirty && this.contactForm.valid) {
           const newContactInfo = Object.assign({}, this.newContactInfo, this.contactForm.value);
           this.isAddVisible = false;
           this.isLoaderVisible = true;
           this._contactInfoService.addContact(newContactInfo).subscribe(
               async contact =>  {
                await this.onAddContactComplete(contact);
               },
               async error => await this.onAddContactError(error)
           );

        }
    }

    async editContact() {
        if (this.contactForm.dirty && this.contactForm.valid) {
           const editContact = this.contactForm.value;
           this.isEditVisible = false;
           this.isLoaderVisible = true;
           this._contactInfoService.updateContact(editContact).subscribe(
               async contact =>  {
                await this.onEditContactComplete(contact);
               },
               async error => await this.onEditContactError(error)
           );

        }
    }


    async onAddContactComplete(newContactInfo: ContactInfo) {
        this.contacts.push(newContactInfo);
        this.responseMessage.errorMessage = '';
        this.responseMessage.successMessage = CommonValidators.addContactSuccess;
        this.contactForm.markAsPristine();
        this.contactForm.markAsTouched();
        this.contactForm.reset();
        this.isAddVisible = true;
        this.isLoaderVisible = false;

    }

    async onEditContactComplete(editContactInfo: ContactInfo) {
        const index = this.contacts.indexOf(this.currentlySelectedContact, 0);
        if (index > -1) {
            this.contacts.splice(index, 1, editContactInfo);
        }
        this.responseMessage.errorMessage = '';
        this.responseMessage.successMessage = CommonValidators.editContactSuccess;
        this.isEditVisible = true;
        this.isLoaderVisible = false;

    }

    async onAddContactError(error: any) {
        this.responseMessage.successMessage = '';
        if (error instanceof HttpErrorResponse) {
            this.responseMessage.errorMessage = CommonValidators.internalServerError;
        }
        this.isAddVisible = true;
        this.isLoaderVisible = false;
    }
    async onEditContactError(error: any) {
        this.responseMessage.successMessage = '';
        if (error instanceof HttpErrorResponse) {
            this.responseMessage.errorMessage = CommonValidators.internalServerError;
        }
        this.isEditVisible = true;
        this.isLoaderVisible = false;
    }

    async onGetContactsError(error: any) {
        this.isSpinnerVisible = false;
    }

    closeAlert() {
        this.responseMessage.errorMessage = '';
        this.responseMessage.successMessage = '';
    }
}
