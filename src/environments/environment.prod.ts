export const environment = {
    production: true,
    apiUrl: 'https://algamoney-api-lss1.herokuapp.com',

    tokenAllowedDomains: [new RegExp('algamoney-api-lss1.herokuapp.com')],
    tokenDisallowedRoutes: [new RegExp('\/oauth\/token')]
};
