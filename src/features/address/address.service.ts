import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { AddressDto } from 'src/core/dt_objects/user/address/address.dto';

@Injectable()
export class AddressService extends BaseService{

    async createAddress(params:AddressDto):Promise<boolean>{
        try {
            await this.firebase.setData(FirebaseColumns.ADDRESSES,params.uid,AddressDto.toJson(params));
        return true;
        } catch (error) {
            return false;
        }
    }

    async getUserAddresses(userId:string):Promise<AddressDto[]>{
            const data:AddressDto[] =(await this.firebase
                .getDataWithWhereQuery(FirebaseColumns.ADDRESSES,
                "addressOwner","==",userId)??[]).map((e)=>AddressDto.fromJson(e));;
            return data
        
    }

    async deleteAddress(id:string):Promise<boolean>{
       try {
        await this.firebase.deleteDoc(FirebaseColumns.ADDRESSES,id);
        return true;
       } catch (error) {
        return false;
       }
    
}
}