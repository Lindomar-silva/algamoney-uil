export const environment = {
    production: true,
    apiUrl: 'https://algamoney-api-lss.herokuapp.com',

    tokenAllowedDomains: [new RegExp('algamoney-api-lss.herokuapp.com')],
    tokenDisallowedRoutes: [new RegExp('\/oauth\/token')]
};
