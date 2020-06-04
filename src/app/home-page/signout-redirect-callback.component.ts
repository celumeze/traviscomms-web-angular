import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-signout-callback',
    template: '<div></div>'
})

export class SignoutRedirectCallbackComponent implements OnInit {
    constructor(private _authService: AuthService,
                private _router: Router) { }

    ngOnInit() {
        this._authService.completeLogout().then(user => {
            console.log(user);
            console.log('ddfdfd');
            this._router.navigate(['/home']);
        });
    }
}
