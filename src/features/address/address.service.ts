import { Injectable } from '@nestjs/common';
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
}