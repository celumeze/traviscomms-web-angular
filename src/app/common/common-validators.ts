
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export class CommonValidators {

    // error messages
    public static internalServerError = 'An error occured. Please try again';
    public static emptyGuid = '00000000-0000-0000-0000-000000000000';
    public static  isLoaderShown = false;

    // success messages
    public static addContactSuccess = 'Contact was successfully added';
    public static editContactSuccess = 'Contact was successfully updated';
    public static emptyContacts = 'No contact found';


  public static textInputMatch(
    textInput1: string,
    textInput2: string,
  ): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const textInput1FormControl = c.get(textInput1);
      const textInput2FormControl = c.get(textInput2);

      if (textInput1FormControl.value === textInput2FormControl.value) {
        return null;
      }
      // tslint:disable-next-line:object-literal-key-quotes
      return { textInputMatch: true };
    };
  }

  public static checkPwdRequirement(isPasswordValid: boolean): ValidatorFn {
         return (c: AbstractControl): {[key: string]: boolean } | null => {
            if (c.pristine || c.value === '') {
                return null;
            }
            if (isPasswordValid) {
                return null;
            }
            return { invalidPassword: true };

         };
  }


  public static setValidationMessage(
    c: AbstractControl,
    validationMessagesObj: { [key: string]: string }
  ): string {
    if ((c.touched || c.dirty) && c.errors) {
      return Object.keys(c.errors)
        .map((key) => validationMessagesObj[key])
        .join(' ');
    }
  }

  public static showLoader(): Boolean {
      this.isLoaderShown = true;
      return this.isLoaderShown;
  }

  public static hideLoader(): Boolean {
    this.isLoaderShown = false;
    return this.isLoaderShown;
}

}
