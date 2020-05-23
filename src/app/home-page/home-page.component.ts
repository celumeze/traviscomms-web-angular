import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonValidators } from '../common/common-validators';
import { ValidatorMessages } from '../common/validator-messages';
import { SubscriptionType } from '../models/subscriptiontype';
import { SubscriptionTypeService } from '../subscriptionypes/subscriptiontype.service';
import { AccountHolder } from '../models/accountholder';
import { RegisterService } from '../register/register-service.service';
import { ResponseMessage } from '../models/responsemessage';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../core/auth-service.component.ts';

function subscriptionSelectionCheck(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const trialSubscriptionTypeControl = c.get('trialSubscriptionType');
  const paidSubscriptionTypeControl = c.get('paidSubscriptionType');

  if (
    trialSubscriptionTypeControl.value === true ||
    paidSubscriptionTypeControl.value === true
  ) {
    return null;
  }
  // tslint:disable-next-line:object-literal-key-quotes
  return { subscriptionCheck: true };
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  registerForm: FormGroup;
  newAccountHolder = new AccountHolder();
  responseMessage = new ResponseMessage();
  subscriptionTypes: SubscriptionType[] = [];
  emailValidationMessage: string;
  passwordMismatchMessage: string;
  invalidPasswordMessage: string;

  tmp = false;
  // tslint:disable-next-line: ban-types
  toggleLoader: Boolean = false;
    // output
  isPasswordValid = false;
  // tslint:disable-next-line: ban-types
  isLoggedIn = false;

  // tslint:disable-next-line: variable-name
  constructor(private _fb: FormBuilder,
              // tslint:disable-next-line: variable-name
              private _registerService: RegisterService,
              // tslint:disable-next-line: variable-name
              private _subscriptionTypeService: SubscriptionTypeService,
              // tslint:disable-next-line: variable-name
              private _snackBar: MatSnackBar,
              // tslint:disable-next-line: variable-name
              private _authService: AuthService) {
this._authService.loginChanged.subscribe(loggedIn => {
  this.isLoggedIn = loggedIn;
});

}

  ngOnInit() {
    this.registerForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      emailAddress: ['', [Validators.required, Validators.email]],
      company: '',
      passwordGroup: this._fb.group(
        {
          password: ['', [Validators.required, CommonValidators.checkPwdRequirement(this.isPasswordValid)]],
          confirmPassword: ['', Validators.required],
        },
        {
          validators: CommonValidators.textInputMatch(
            'password',
            'confirmPassword'
          ),
        }
      ),
      subscriptionTypeGroup: this.buildSubscriptionTypes()
    });

      // get available subscription types
    this._subscriptionTypeService.getSubscriptionTypes().subscribe(
        subscriptionTypes => {
        this.subscriptionTypes = subscriptionTypes;
        this.updateSubscriptionTypeIds();
      },
      error => {});


    // validation watcher
    const emailFormControl = this.registerForm.get('emailAddress');
    const confirmPasswordFormControl = this.registerForm.get('passwordGroup');
    const passwordFormControl = this.registerForm.get('passwordGroup.password');

    emailFormControl.valueChanges.subscribe((value) => {
        this.emailValidationMessage =
        CommonValidators.setValidationMessage(emailFormControl, ValidatorMessages.getAccountFormValidationMessages());
    });
    confirmPasswordFormControl.valueChanges.subscribe((value) => {
      this.passwordMismatchMessage =
      CommonValidators.setValidationMessage(confirmPasswordFormControl, ValidatorMessages.getAccountFormValidationMessages());
  });
    passwordFormControl.valueChanges.subscribe((value) => {
      this.invalidPasswordMessage =
      CommonValidators.setValidationMessage(passwordFormControl, ValidatorMessages.getAccountFormValidationMessages());
  });

    // for login status check
    this._authService.isLoggedIn().then(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }


  ////// Functions

  // submit registration form
  async createAccount() {
    if (this.registerForm.dirty && this.registerForm.valid) {

      let accountHolder = Object.assign({}, this.newAccountHolder, this.registerForm.value);
      accountHolder = this.buildAccountHolderValue(accountHolder);
      this.toggleLoader = CommonValidators.showLoader();
      this._registerService.registerAccountHolder(accountHolder).subscribe(
      async message => await this.onCreateAccountComplete(message),
      async error => await this.onCreateAccountError(error));
    }
  }

   // set object to submit to form
   // tslint:disable-next-line: variable-name
   buildAccountHolderValue(_accountHolder: AccountHolder): AccountHolder {
    if (this.registerForm.get('subscriptionTypeGroup.trialSubscriptionType').value) {
      _accountHolder.subscriptionTypeId = this.registerForm.get('subscriptionTypeGroup.trialSubscriptionId').value;
    } else {
      _accountHolder.subscriptionTypeId = this.registerForm.get('subscriptionTypeGroup.paidSubscriptionId').value;
    }
    _accountHolder.password = this.registerForm.get('passwordGroup.password').value;
    _accountHolder.confirmPassword = this.registerForm.get('passwordGroup.confirmPassword').value;
    return _accountHolder;
  }

  // initialize subscription type values
  buildSubscriptionTypes(): FormGroup {
    return this._fb.group(
      {
        trialSubscriptionType: true,
        trialSubscriptionId: CommonValidators.emptyGuid,
        paidSubscriptionType: false,
        paidSubscriptionId: CommonValidators.emptyGuid
      },
      { validators: subscriptionSelectionCheck }
    );
  }

   // update subscription types when a selection is made
  // to allow only one is selected at a time from form
  setSubscriptionType(selectedSubType: string) {
    if (selectedSubType === 'trial') {
      this.registerForm.get('subscriptionTypeGroup').patchValue({
        paidSubscriptionType: false,
      });
    } else {
      this.registerForm.controls.subscriptionTypeGroup.patchValue({
        trialSubscriptionType: false,
      });
    }
  }

   // update subscription type id when http get is complete
   updateSubscriptionTypeIds() {
    this.subscriptionTypes.forEach(subscriptionType => {
       if (subscriptionType.price > 0) {
        this.registerForm.get('subscriptionTypeGroup').patchValue({
          paidSubscriptionId: subscriptionType.subscriptionTypeId,
        });
       } else {
        this.registerForm.get('subscriptionTypeGroup').patchValue({
          trialSubscriptionId: subscriptionType.subscriptionTypeId,
        });
       }
    });
  }

    // for password strength indicator
    passwordValid(event) {
      this.isPasswordValid = event;
      this.registerForm.get('passwordGroup.password').setValidators(CommonValidators.checkPwdRequirement(this.isPasswordValid));
      this.registerForm.get('passwordGroup.password').updateValueAndValidity();
    }

      // complete create account
  onCreateAccountComplete(message: ResponseMessage) {
    this.responseMessage = message;
    this.registerForm.patchValue({
      firstName: '',
      lastName: '',
      emailAddress: null,
      passwordGroup: { password: '', confirmPassword: '' },
      paidSubscriptionType: false,
      trialSubscriptionType: true
    });
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
    this.toggleLoader = CommonValidators.hideLoader();
    CommonValidators.openSnackBar(this._snackBar, this.responseMessage.successMessage);
  }

  // complete create account hhtp response error
  async onCreateAccountError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if (error.error.errorMessage) {
        this.responseMessage.errorMessage = error.error.errorMessage;
      } else {
        this.responseMessage.errorMessage = CommonValidators.internalServerError;
      }
    }
    this.toggleLoader = CommonValidators.hideLoader();
  }

  login() {
    this._authService.login();
  }

  

}
