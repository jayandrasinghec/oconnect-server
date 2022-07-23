

class UtilityScripts {
    public static machine_name(name: string): string {
        return name.toLowerCase().replace(" ", "_");
    }

    public static generatePassword(): string {
        const generatePassword = require('password-generator');
        return generatePassword(8, false);
    }
}

export default UtilityScripts;
