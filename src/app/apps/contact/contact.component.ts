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
import { ContactCsvInfo } from 'src/app/models/contact-csv-info';

@Component({
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
    closeResult: string;
    modalTitle: string;
    fileName: string;
    fileToUpload: File;
    contacts: ContactInfo[] = [];
    newContactInfo = new ContactInfo();
    contactCsvInfo = new ContactCsvInfo();
    searchText: any;
    contactForm: FormGroup;
    contactUploadForm: FormGroup;
    invalidContactNumber: string;
    currentlySelectedContact: ContactInfo;
    responseMessage = new ResponseMessage();
    isAddVisible = true;
    isLoaderVisible = false;
    isUploadVisible = true;
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

    openUploadContact(content) {
        this.modalService.open(content, { size: 'lg', centered: true});
        this.contactUploadForm.patchValue({
            firstNameHeader: [''],
            lastNameHeader: [''],
            contactNumberHeader: ['']
          });
          this.modalTitle = 'Upload Contact As Csv';
          this.responseMessage = new ResponseMessage();
          this.fileName = '';
          this.fileToUpload = null;
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
            contactNumber: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      });

      this.contactUploadForm = this._fb.group({
          firstNameHeader: [''],
          lastNameHeader: [''],
          contactNumberHeader: ['', Validators.required],
          separatorText: ['', Validators.required],
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

    uploadCsvFile(files) {
        if (files.length === 0) {
           return;
        }
        this.fileToUpload = <File>files[0];
        this.fileName = this.fileToUpload.name;

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

    async submitFile() {
        const contactCsvInfo = Object.assign({}, this.contactCsvInfo, this.contactUploadForm.value);
        const formData = new FormData();
        formData.append('browse', this.fileToUpload, this.fileName);
        formData.append('firstNameHeader', contactCsvInfo.firstNameHeader);
        formData.append('lastNameHeader', contactCsvInfo.lastNameHeader);
        formData.append('contactNumberHeader', contactCsvInfo.contactNumberHeader);
        formData.append('separatorText', contactCsvInfo.separatorText);
        this.isUploadVisible = false;
        this.isLoaderVisible = true;
        this._contactInfoService.uploadContacts(formData).subscribe(
            // tslint:disable-next-line: no-shadowed-variable
            async contacts => {
                await this.onSubmitFileComplete(contacts);
            },
            async error => await this.onSubmitFiletError(error)
        );
    }


    async onSubmitFileComplete(newContacts: ContactInfo[]) {
        newContacts.forEach(newContact => {
            this.contacts.push(newContact);
        });
        this.responseMessage.errorMessage = '';
        this.responseMessage.successMessage = newContacts.length === 1
                                            ? CommonValidators.uploadContactSuccess
                                            : CommonValidators.uploadContactsSuccess;
        this.contactUploadForm.markAsPristine();
        this.contactUploadForm.markAsTouched();
        this.contactUploadForm.reset();
        this.isUploadVisible = true;
        this.isLoaderVisible = false;
        this.fileName = '';
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

    async onSubmitFiletError(error: any) {
        this.responseMessage.successMessage = '';
        if (error instanceof HttpErrorResponse) {
            this.responseMessage.errorMessage = error.error ? error.error
                                                : CommonValidators.internalServerError;
        }
        this.isUploadVisible = true;
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
