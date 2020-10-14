export class ContactCsvInfo {
    constructor() {
        this.firstNameHeader = '';
        this.lastNameHeader = '';
        this.contactNumberHeader = '';
    }
    firstNameHeader: string;
    lastNameHeader: string;
    contactNumberHeader: string;
    separatorText: string;
    file: FormData;
    fileName: string;
    accountHolderId: string;
}
