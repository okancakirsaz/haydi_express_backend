export class UserDto{
    userName:string
    userSurname:string
    mail:string
    emailVerified:boolean
    password:string
    uid:string
    phoneNumber:string
    //TODO: Change any to list of productDto
    buyHistory?:any
     //TODO: Change any to list of productDto
    activeOrders?:any
    //TODO: Change any to list of productDto
    shoppingCard?:any
    //TODO: Change any to list of blogDto
    savedBlogs?:any



    static toJson(data:UserDto):any{
        return {
        "userName":data.userName,
        "userSurname":data.userSurname,
        "mail":data.mail,
        "uid":data.uid,
        "emailVerified":data.emailVerified,
        "password":data.password,
        "phoneNumber":data.phoneNumber,
        "buyHistory":data.buyHistory,
        "activeOrders":data.activeOrders,
        "shoppingCard":data.shoppingCard,
        "savedBlogs":data.savedBlogs
        };
    }

    static fromJson(data:any):UserDto{
        const object:UserDto = new UserDto();
        object.userName=data["userName"];
        object.userSurname=data["userSurname"];
        object.mail=data["mail"];
        object.uid=data["uid"];
        object.emailVerified=data["emailVerified"];
        object.password=data["password"];
        object.phoneNumber=data["phoneNumber"];
        object.buyHistory=data["buyHistory"];
        object.shoppingCard=data["shoppingCard"];
        object.savedBlogs=data["savedBlogs"];
        return object;
    }
}