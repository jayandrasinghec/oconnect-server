import * as jwt from "jwt-simple";

class Secret {
    private readonly TOKEN: string = "oconnect@sreejesh.ashish.aneesh@kriyatma";
    private readonly EXPIRY: number = 7; // in days
    public static readonly SESSION_SECRET: string | string[] = "Sr33j3sh@sh1sh@n33sh@kriyatma"; 
    public  static readonly MAXAGE: boolean = false; 

    public getToken(user: any): any {
        const expires: number = this.expiresIn(this.EXPIRY);
        const token: string = jwt.encode({uid: user.id, exp: expires}, this.TOKEN);
        return {
            token,
            expires,
            user
        };
    }

    private expiresIn(numDays: number): number {
        const dateObj: Date = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }
    public tokenKey(): string {
        return this.TOKEN;
    }
}

export default Secret;