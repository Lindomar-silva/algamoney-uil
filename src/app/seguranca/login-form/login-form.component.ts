import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private errorHandler: ErrorHandlerService,
        private router: Router,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle('Algamoney - Login');
    }

    login(usuario: string, senha: string) {
        this.authService.login(usuario, senha)
            .then(() => {
                this.router.navigate(['/dashboard']);
            })
            .catch(erro => {
                this.errorHandler.handle(erro);
            });

        // console.log(this.authService.jwtPayload);
    }
}
