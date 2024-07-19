import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { OrderDto } from 'src/core/dt_objects/order/order.dto';
import { AddressDto } from 'src/core/dt_objects/user/address/address.dto';

@Injectable()
export class CustomerService extends BaseService{
    async deleteAccount(customerId:string):Promise<boolean|HttpException>{
        try {
            const activeOrders:any[] = await this.firebase.getDataWithWhereQuery(FirebaseColumns.ORDERS,"customerId","==",customerId)??[];
            if(activeOrders.length==0){
                await this.firebase.deleteDoc(FirebaseColumns.CUSTOMERS,customerId);
                return await this.deleteUserAddresses(customerId);
            }
            else{
                return new HttpException("Aktif siparişiniz bulunduğu için şu anda hesabınızı silemezsiniz.",HttpStatus.BAD_REQUEST)
            }
            
        } catch (error) {
            return new HttpException("Bir sorun oluştu lütfen tekrar deneyiniz.",HttpStatus.BAD_REQUEST);
        }
    }

   private async deleteUserAddresses(customerId:string):Promise<boolean|HttpException>{
        try {
            const userAddresses:AddressDto[] = (await this.firebase.getDataWithWhereQuery(FirebaseColumns.ADDRESSES,"addressOwner","==",customerId)??[]).map((e)=>AddressDto.fromJson(e));
            for(let i:number = 0;i<=userAddresses.length-1;i++){
                await this.firebase.deleteDoc(FirebaseColumns.ADDRESSES,userAddresses[i].uid);
            }
            return true;
        } catch (error) {
            return new HttpException("Bir sorun oluştu lütfen tekrar deneyiniz.",HttpStatus.BAD_REQUEST);
        }
    }

    async change(customerId:string,changedValue:string,newValue:string):Promise<boolean|HttpException>{
        try {
            const column:string = FirebaseColumns.CUSTOMERS;
           //TODO:Add phone verify
           if(changedValue=="phoneNumber"){
            await this.firebase.updateData(column,customerId,{"phoneNumber":newValue});
            return true;
           }
           if(changedValue=="email"){
            await this.firebase.updateData(column,customerId,{"email":newValue});
            return true;
           }
           if(changedValue=="nameSurname"){
            await this.firebase.updateData(column,customerId,{"name":newValue});
            return true;
           }
        } catch (error) {
            return new HttpException("Bir sorun oluştu lütfen tekrar deneyiniz.",HttpStatus.BAD_REQUEST);
        }
    }
}