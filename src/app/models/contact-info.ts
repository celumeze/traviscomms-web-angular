export class ContactInfo {
    constructor(init?: Partial<ContactInfo>) {
        Object.assign(this, init);
    }
    id: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    accountHolderId: string;
    isSelected: boolean;
}
