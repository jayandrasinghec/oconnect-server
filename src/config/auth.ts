class Auth {

    public static get roles(): Array<string> {
        return [
            "Master Admin",
            "Instructor",
            "member"
        ];
    }

    public static get users(): Array<any> {
        return [
            {
                username: "admin",
                password: "admin",
                firstname: "Sreejesh",
                lastname: "Pillai",
                mobile: "9497724344",
                email:"sreejesh@kriyatma.com",
                roles: [
                    "Master Admin"
                ]
            }
        ];
    }

}

export default Auth;