import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { CourierDto } from 'src/core/dt_objects/user/courier.dto';
import { CourierOptionsDto } from 'src/features/options/courier_options.dto';

@Injectable()
export class CourierService extends BaseService{

    private readonly optionsCol:string = "COURIER_OPTIONS";

    async getCouriers():Promise<CourierDto[]>{
        const rawData = await this.firebase.getCollection(FirebaseColumns.COURIERS)??[];
        return rawData.map((e)=>CourierDto.fromJson(e));
    }

    async setCourier(params:CourierDto):Promise<boolean>{
        try {
            const data = await this.firebase.getDoc(FirebaseColumns.COURIERS,params.courierId);
            if(data==null){
            await this.setNewCourier(params);
            }
            else{
             await this.updateExistCourier(params);
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    private async setNewCourier(params:CourierDto){
        params.secureCode=this.createRandSecureCode();
        await this.firebase.setData(FirebaseColumns.COURIERS,params.courierId,CourierDto.toJson(params),);
    }

    private async updateExistCourier(params:CourierDto){
        await this.firebase.updateData(FirebaseColumns.COURIERS,params.courierId,CourierDto.toJson(params));
    }

    private createRandSecureCode():string{
        const characters:string = "abcdefghjklmnoprstziABCDEFGHJKLMNOPRSTZI0123456789!"
        let letter:string = "";
        for(let i:number=0;i<=6;i++){
            const randomIndex = Math.floor(Math.random() * characters.length);
            letter+=characters[randomIndex];
        }
        return letter;
    }

    async getCourierOptions():Promise<CourierOptionsDto>{
        const rawData = (await this.logDatabase.db.collection(this.optionsCol).doc("options").get()).data();
        return CourierOptionsDto.fromJson(rawData);
    }

    async setCourierOptions(params:CourierOptionsDto):Promise<boolean>{
       try {
        await this.logDatabase.db.collection(this.optionsCol).doc("options").update(CourierOptionsDto.toJson(params));
        return true;
       } catch (error) {
        return false;
       }
    }

    async updateCourierWorkState(params:CourierDto):Promise<boolean>{
        try {
            await this.updateExistCourier(params);
            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteCourier(courierId:string):Promise<boolean>{
        try {
            await this.firebase.deleteDoc(FirebaseColumns.COURIERS,courierId);
            return true;
        } catch (error) {
            return false;
        }
    }

}