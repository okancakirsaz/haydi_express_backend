export class AddressDto{
    name:string;
    city:string;
    state:string;
    neighborhood:string;
    street:string;
    buildingNumber:string;
    doorNumber:string;
    addressDirection:string;
    lat?:number;
    long?:number;
    isVerifiedFromCourier:boolean
    courierAddressDirection?:string;
    uid:string;
    addressOwner:string
    

    static toJson(data: AddressDto): any {
        return {
          "name": data.name,
          "city":data.city,
          "state": data.state,
          "neighborhood":data.neighborhood,
          "street":data.street,
          "buildingNumber":data.buildingNumber,
          "doorNumber": data.doorNumber,
          "addressDirection":data.addressDirection,
          "lat": data.lat,
          "long":data.long,
          "isVerifiedFromCourier":data.isVerifiedFromCourier,
          "uid":data.uid,
          "courierAddressDirection?":data.courierAddressDirection,
          "addressOwner?":data.addressOwner,
        };
      }
    
      static fromJson(data: any): AddressDto {
        const object: AddressDto = new AddressDto();
        object.name = data['name'];
        object.city = data["city"];
        object.state = data['state'];
        object.neighborhood=data["neighborhood"];
        object.street=data["street"];
        object.buildingNumber=data["buildingNumber"];
        object.doorNumber = data['doorNumber'];
        object.addressDirection = data["addressDirection"];
        object.lat = data['lat'];
        object.long=data["long"];
        object.isVerifiedFromCourier = data["isVerifiedFromCourier"];
        object.uid = data['uid'];
        object.courierAddressDirection=data['courierAddressDirection'];
        object.addressOwner=data['addressOwner'];
        return object;
      }
}