import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

    oauthTokenUrl: string;
    tokensRenokeUrl: string;
    jwtPayload: any;

    constructor(
        private http: HttpClient,
        private jwtHelper: JwtHelperService
    ) {
        // Verifica na construção do (AuthService) se tem um token no localStorage e descodifica
        this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
        this.tokensRenokeUrl = `${environment.apiUrl}/tokens/revoke`;
        this.carregarToken();
    }

    login(usuario: string, senha: string): Promise<void> {
        const httpHeaders = new HttpHeaders()
            .append('Content-Type', 'application/x-www-form-urlencoded')
            .append('Authorization', 'Basic YW5ndWxhcjphZG1pbg==');

        const body = `username=${usuario}&password=${senha}&grant_type=password`;

        // Usando 'withCredentials: true' para resolver erro ("Cannot convert access token to JSON")
        // Quando uma requisição cross-site, deve enviar/receber credenciais (ex: cookie)
        return this.http.post(this.oauthTokenUrl, body, { headers: httpHeaders, withCredentials: true })
            .toPromise()
            .then(response => {
                this.armazenarToken(response[`access_token`]);
            }).catch(errorResponse => {
                if (errorResponse.status === 400) {
                    if (errorResponse.error.error === 'invalid_grant') {
                        return Promise.reject('Usuário ou senha inválida!');

                        // https://www.algaworks.com/forum/topicos/84449/mensagem-com-encoding-incorreto
                        // return Promise.reject(errorResponse.error.error_description);
                    }
                }

                return Promise.reject(errorResponse);
            });
    }

    logout() {
        return this.http.delete(this.tokensRenokeUrl, { withCredentials: true })
            .toPromise()
            .then(() => {
                this.limparAccessToken();
            });
    }

    limparAccessToken() {
        localStorage.removeItem('token');
        this.jwtPayload = null;
    }

    isAccessTokenInvalido() {
        const token = localStorage.getItem('token');
        return !token || this.jwtHelper.isTokenExpired(token);
    }

    temPermissao(permissao: string) {
        return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
    }

    temQualquerPermissao(roles: any) {
        for (const perm of roles) {
            if (this.temPermissao(perm)) {
                return true;
            }
        }
        return false;
    }

    obterNovoAccessToken(): Promise<any> {
        const httpHeaders = new HttpHeaders()
            .append('Content-Type', 'application/x-www-form-urlencoded')
            .append('Authorization', 'Basic YW5ndWxhcjphZG1pbg==');

        const body = 'grant_type=refresh_token';

        // Usando 'withCredentials: true' para resolver erro ("Cannot convert access token to JSON")
        // Quando uma requisição cross-site, deve enviar/receber credenciais (ex: cookie)
        return this.http.post(this.oauthTokenUrl, body, { headers: httpHeaders, withCredentials: true })
            .toPromise()
            .then(response => {
                this.armazenarToken(response[`access_token`]);
                console.log('Novo access token criado!');
                return Promise.resolve(null);
            })
            .catch(erroResponse => {
                console.log('Erro ao renovar token.', erroResponse);
                return Promise.resolve(null);
            });
    }

    private armazenarToken(token: string) {
        this.jwtPayload = this.jwtHelper.decodeToken(token); // Decodifica o token
        localStorage.setItem('token', token); // Armazena os dados do token no navegador do usuário
        // Pesquisar sobre (sessionStorage)
        // https://www.algaworks.com/forum/topicos/77682/localstorage-x-sessionstorage
    }

    private carregarToken() {
        const token = localStorage.getItem('token');
        if (token) { // Verifica se tem um token no localStorage e descodifica
            this.armazenarToken(token);
        }
    }

}
