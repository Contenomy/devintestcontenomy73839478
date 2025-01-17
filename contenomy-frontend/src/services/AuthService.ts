import IUserProfile from "@model/UserProfile";
import { environment } from "@environment/environment.development";

export default class AuthService {

    static readonly instance: AuthService = new AuthService();

    private readonly authPath: string;
    private _userProfile!: IUserProfile

    private constructor() {
        this.authPath = `${environment.serverUrl}/auth`;
        try {
            // this.fetchProfile();
        } catch (err) {
            console.error(err);
        }
    }

    async logout() {
        const res = await fetch(`${this.authPath}/logout`, {
            method: 'GET',
            credentials: 'include'
        });

        if (res.status >= 400) {
            console.error("Errore di logout");
            return false;
        }

        await this.fetchProfile(true);

        console.log("Logout effettuato con successo");
        return true;
    }

    private setDeveloperProfile()  {
        this._userProfile = {
            "isAuthenticated": true,
            "id": "ddbb4450-cdda-4a73-8edd-473d208c2eb3",
            "name": "DEVELOPER",
            "email": "developer@contenomy.com",
            "roles": [
              "Developer"
            ],
            "claims": {
              "AccessLevel": "DEVELOPER",
              "Test": "FOO"
            }
          };
    }

    async login(loginBody: FormData): Promise<boolean> {
        const res = await fetch(`${this.authPath}/login`, {
            method: 'POST',
            body: loginBody,
            credentials: 'include'
        });

        if (res.status >= 400) {
            console.error("Errore di login");
            return false;
        }

        await this.fetchProfile(true);

        console.log("Login effettuato con successo");
        return true;
    }

    async fetchProfile(force: boolean = false): Promise<IUserProfile> {
        if (!force && this._userProfile) {
            return this._userProfile;
        }

        try {
            const res = await fetch(`${this.authPath}/profile`, {
                credentials: 'include'
            });

            if (res.status >= 400) {
                const msg = await res.text();
                console.error(msg);
                
                this.setDeveloperProfile();
            }

            this._userProfile = await res.json() as IUserProfile;
        }
        catch (err) {
            console.log(err);
            
            this.setDeveloperProfile();
        }
        return this._userProfile;
    }

    get profile() {
        return this._userProfile;
    }
}