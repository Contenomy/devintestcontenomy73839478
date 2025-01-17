import { Url } from "next/dist/shared/lib/router/router"

export interface LoginProvider {
    name: string,
    icon: Url,
    login: Url
}

export const loginProviders: LoginProvider[] = [
    {
        name: 'Google',
        icon: '/external-logins/google.svg',
        login: ''
    }
]