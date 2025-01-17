export default interface IUserProfile {
    id: string,
    name?: string
    email?: string,
    phone?:string,
    nickname?:string,
    roles: string[],
    claims: {
        [key: string]: string
    },
    isAuthenticated: boolean
}