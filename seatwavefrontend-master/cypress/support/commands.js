Cypress.Commands.add('loginAsAdmin', () => {
    const apiUrl = Cypress.env('apiUrl');

    cy.request({
        method: 'POST',
        url: `${apiUrl}/api/auth/login`,
        body: {
            email: Cypress.env('adminEmail'),
            password: Cypress.env('adminPassword'),
        },
    }).then(response => {
        // Read auth cookies straight from the response headers instead of using
        // cy.getCookie(). cy.getCookie() matches on the current page domain
        // (localhost), but in CI the API runs on a different hostname (backend),
        // so the cookies would never be found.
        const setCookies = [].concat(response.headers['set-cookie'] ?? []);

        const extract = (name) => {
            const entry = setCookies.find(c => c.trimStart().startsWith(`${name}=`));
            return entry ? entry.split(';')[0].trim().slice(name.length + 1) : '';
        };

        const xsrfToken   = extract('XSRF-TOKEN');
        const accessToken = extract('access_token');

        // Persist both tokens so authenticatedRequest can use them without
        // needing another cy.getCookie() call.
        Cypress.env('xsrfToken',   xsrfToken);
        Cypress.env('accessToken', accessToken);

        // Register intercepts BEFORE cy.visit() so they are active from the
        // very first navigation in each test. GET requests are handled by the
        // browser's cookie jar (populated by cy.request above). POST/PUT/DELETE
        // also need the XSRF header, which the app can't inject itself when the
        // API is on a different origin, so we do it here.
        ['POST', 'PUT', 'DELETE'].forEach(method => {
            cy.intercept({ method, url: `${apiUrl}/**` }, req => {
                req.headers['X-XSRF-TOKEN'] = xsrfToken;
                req.headers['Cookie'] = `access_token=${accessToken}; XSRF-TOKEN=${xsrfToken}`;
            });
        });

        cy.visit('/');
    });
});

Cypress.Commands.add('authenticatedRequest', (options) => {
    const xsrfToken   = Cypress.env('xsrfToken')   ?? '';
    const accessToken = Cypress.env('accessToken')  ?? '';

    cy.request({
        ...options,
        headers: {
            ...options.headers,
            'X-XSRF-TOKEN': xsrfToken,
            'Cookie': `access_token=${accessToken}; XSRF-TOKEN=${xsrfToken}`,
        },
    });
});