import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service.component.ts';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin-callback',
    template: '<div></div>'
})

export class SigninRedirectCallbackComponent implements OnInit {
    // tslint:disable-next-line: variable-name
    constructor(private _authService: AuthService,
                // tslint:disable-next-line: variable-name
                private _router: Router) { }

    ngOnInit() {
        this._authService.completeLogin().then(user => {
            this._router.navigateByUrl('/main-dashboard');
        });
    }
}
