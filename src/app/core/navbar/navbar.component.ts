import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/seguranca/auth.service';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
    exibindoMenu: boolean;

    constructor(
        public authService: AuthService,
        private errorHandler: ErrorHandlerService,
        private router: Router
    ) { }

    // https://app.algaworks.com/forum/topicos/84720/adaptar-menu-para-esconder-com-click-externo-ou-no-link
    ngAfterViewInit() {
        this.clickLinksDoMenuEscondeMenu();
        this.clickForaDoMenuEscondeMenu();
    }

    private clickLinksDoMenuEscondeMenu(): void {
        const links = document.querySelectorAll('.navbar-menuitem a');
        links.forEach(link => {
            link.addEventListener('click', () => { this.exibindoMenu = false; });
        });
    }

    private clickForaDoMenuEscondeMenu(): void {
        const menu = document.getElementsByClassName('navbar-menu')[0];
        const iconeMenu = document.getElementsByClassName('pi pi-bars')[0];

        window.addEventListener('click', evt => {
            if (evt.target !== iconeMenu && !menu.contains((evt.target as any))) {
                this.exibindoMenu = false;
            }
        });
    }

    logout() {
        this.authService.logout()
            .then(() => {
                this.router.navigate(['/login']);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
