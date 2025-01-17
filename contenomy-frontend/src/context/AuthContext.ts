import { createContext } from "react";
import IUserProfile from '@model/UserProfile'

export interface IAuthConext {
    profile: IUserProfile,
    setProfile: Function
}

export const DEFAULT_PROFILE: IAuthConext = {
    profile: {
        isAuthenticated: false,
        id: "",
        roles: [],
        claims: {}
    },
    setProfile: (IUserProfile: IUserProfile) => {

    }
};

const authContext = createContext<IAuthConext>(DEFAULT_PROFILE);

const AuthProvider = authContext.Provider;


export { authContext, AuthProvider }