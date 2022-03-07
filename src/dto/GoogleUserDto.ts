export default interface GoogleUserDto{
    readonly id?:string;
    readonly email:string;
    readonly password:string;
    readonly given_name:string;
    readonly family_name:string;
    readonly displayName:string;
}