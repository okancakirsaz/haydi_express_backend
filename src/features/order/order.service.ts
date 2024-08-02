import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { OrderDto } from 'src/core/dt_objects/order/order.dto';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';
import { PaymentMethods } from 'src/core/constants/payment_methods';
import { PaymentDto } from 'src/core/dt_objects/order/payment.dto';
import { OrderGateway } from './order.gateway';
import { params } from 'firebase-functions/v1';
import { CancelOrderDto } from 'src/core/dt_objects/order/cancel_order.dto';
import { MenuDto } from '../../core/dt_objects/menu/menu.dto';
import { RestaurantService } from '../user/restraurant/restaurant.service';
import { DistanceCalculator } from 'src/core/services/distance_calculator';

@Injectable()
export class OrderService extends BaseService {
  constructor(private readonly gateway: OrderGateway) {
    super();
  }

  private readonly cancelledOrderState: string = 'İptal Edildi';
  private readonly deliveredOrderState: string = 'Teslim Edildi';
  private readonly restaurantService:RestaurantService = new RestaurantService();

  async isRestaurantsUsesHe(ids: string[]): Promise<boolean[]> {
    let finalValue: boolean[] = [];
    for (let i = 0; i <= ids.length - 1; i++) {
      const restaurantData = await this.firebase.getDoc(
        FirebaseColumns.RESTAURANTS,
        ids[i],
      );
      const asModel = RestaurantDto.fromJson(restaurantData);

      if (asModel.wantDeliveryFromUs) {
        finalValue.push(true);
      } else {
        finalValue.push(false);
      }
    }
    return finalValue;
  }

  async createOrder(params: OrderDto): Promise<boolean | HttpException> {
    try {
      const column: string = FirebaseColumns.ORDERS;
      params.distance = await this.calculateDistance(params);
      
      if (params.paymentMethod == PaymentMethods.online) {
        const onlinePayment:boolean|HttpException = await this.onlinePaymentProcess(params);
        if(onlinePayment != true){
          return onlinePayment;
        }
      } 
      await this.firebase.setData(
        column,
        params.orderId,
        OrderDto.toJson(params),
      );
        await this.newOrderStream(params);
        await this.updateMenusTotalOrderData(
          params.menuData.map((e) => e.menuElement),
        );
        return true;
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Bilinmeyen bir hata oluştu.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async calculateDistance(params: OrderDto): Promise<number | null> {
    const restaurant: RestaurantDto =
      await this.restaurantService.getRestaurant(params.restaurantId);
    if (
      (restaurant.address.lat != null && restaurant.address.long != null) ||
      (params.addressData.lat != null && params.addressData.long != null)
    ) {
      const calculator = new DistanceCalculator(
        { lat: restaurant.address.lat, long: restaurant.address.long },
        { lat: params.addressData.lat, long: params.addressData.long },
      );
      return calculator.calculate();
    }
  }

  async updateMenusTotalOrderData(menus: MenuDto[]) {
    for (let i: number = 0; i < menus.length; i++) {
      menus[i].stats.totalOrderCount += 1;
      await this.firebase.updateData(
        FirebaseColumns.RESTAURANT_MENUS,
        menus[i].menuId,
        menus[i],
      );
    }
  }

  async newOrderStream(params: OrderDto) {
    const restaurantUsesCourierService:boolean = (await this.restaurantService.getRestaurant(params.restaurantId)).wantDeliveryFromUs;
    if(restaurantUsesCourierService){
    this.gateway.newHubOrder(params)
    }
    this.gateway.newRestaurantOrder(params, params.restaurantId);
  }

  private async getPaid(
    paymentData: PaymentDto,
  ): Promise<boolean | HttpException> {
    try {
      //TODO: Create payment gateway
      return true;
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }
  private async onlinePaymentProcess(
    params: OrderDto,
  ): Promise<boolean | HttpException> {
    const isPaidSuccess: boolean | HttpException = await this.getPaid(
      params.paymentData,
    );
    if (isPaidSuccess == true) {
      params.isPaidSuccess = isPaidSuccess as boolean;
      return true;
    } else {
      return isPaidSuccess as HttpException;
    }
  }

  async restaurantActiveOrders(restaurantId: string): Promise<OrderDto[]> {
    const dbQuery: any[] =
      (await this.firebase.getDataWithWhereQuery(
        FirebaseColumns.ORDERS,
        'restaurantId',
        '==',
        restaurantId,
      )) ?? [];
    if (dbQuery.length != 0) {
      const transportedQuery: OrderDto[] = dbQuery.map((e) =>
        OrderDto.fromJson(e),
      );
      const filteredQuery: OrderDto[] = transportedQuery.filter((e) => {
        if (e.isPaidSuccess == null || e.isPaidSuccess) {
          return e;
        }
      });
      return filteredQuery;
    } else {
      return [];
    }
  }

  async customerActiveOrders(customerId: string): Promise<OrderDto[]> {
    const dbQuery: any[] =
      (await this.firebase.getDataWithWhereQuery(
        FirebaseColumns.ORDERS,
        'customerId',
        '==',
        customerId,
      )) ?? [];
    if (dbQuery.length != 0) {
      const transportedQuery: OrderDto[] = dbQuery.map((e) =>
        OrderDto.fromJson(e),
      );
      const filteredQuery: OrderDto[] = transportedQuery.filter((e) => {
        if (e.isPaidSuccess == null || e.isPaidSuccess) {
          return e;
        }
      });
      return filteredQuery;
    } else {
      return [];
    }
  }

  async updateOrderState(params: OrderDto): Promise<boolean | HttpException> {
    try {
      if (
        params.orderState == this.deliveredOrderState ||
        params.orderState == this.cancelledOrderState
      ) {
        return await this.orderDeliveryOrCancelledProcess(params);
      } else {
        await this.firebase.updateData(
          FirebaseColumns.ORDERS,
          params.orderId,
          OrderDto.toJson(params),
        );
      }
      this.gateway.orderUpdate(params, params.orderId);
      return true;
    } catch (error) {
      return new HttpException(
        'Bir sorun oluştu, tekrar deneyiniz.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  async hubActiveOrders():Promise<OrderDto[]>{
    const dbQuery: any[] =
    (await this.firebase.getDataWithWhereQuery(
      FirebaseColumns.ORDERS,
      'isDeliveringWithCourierService',
      '==',
      true,
    )) ?? [];
  if (dbQuery.length != 0) {
    const transportedQuery: OrderDto[] = dbQuery.map((e) =>
      OrderDto.fromJson(e),
    );
    const filteredQuery: OrderDto[] = transportedQuery.filter((e) => {
      if (e.isPaidSuccess == null || e.isPaidSuccess) {
        return e;
      }
    });
    return filteredQuery;
  } else {
    return [];
  }
  }

  private async orderDeliveryOrCancelledProcess(
    params: OrderDto,
  ): Promise<boolean | HttpException> {
    params.deliveryDate = this.isDeliveredSetDeliveryDate(params.orderState);
    const logProcess = await this.takeLogExpiredOrder(params);
    this.gateway.orderUpdate(params, params.orderId);
    if (logProcess == true) {
      await this.firebase.deleteDoc(FirebaseColumns.ORDERS, params.orderId);
    }
    return logProcess;
  }

  private isDeliveredSetDeliveryDate(orderState: string): string | null {
    if (orderState == this.deliveredOrderState) {
      return new Date().toISOString();
    } else {
      return null;
    }
  }

  private async takeLogExpiredOrder(
    order: OrderDto,
  ): Promise<boolean | HttpException> {
    try {
      await this.logDatabase.db
        .collection(FirebaseColumns.ORDERS)
        .doc(order.orderId)
        .set(OrderDto.toJson(order));
      return true;
    } catch (error) {
      return new HttpException(
        'Bir sorun oluştu, tekrar deneyiniz.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

   //TODO: Make SOLID compilable
  async getOrderLogs(
    restaurantId: string,
    dateRange: string[],
  ): Promise<OrderDto[]> {
    const response: any[] =
      (
        await this.logDatabase.db
          .collection(FirebaseColumns.ORDERS)
          .where('restaurantId', '==', restaurantId)
          .where('orderCreationDate', '>=', dateRange[0])
          .where('orderCreationDate', '<=', dateRange[1])
          .get()
      ).docs ?? [];
    return response.map((e) => OrderDto.fromJson(e.data()));
  }

   //TODO: Make SOLID compilable
  async getOrderLogsForHub(
    dateRange: string[],
  ): Promise<OrderDto[]> {
    const response: any[] =
      (
        await this.logDatabase.db
          .collection(FirebaseColumns.ORDERS)
          .where('isDeliveringWithCourierService', '==', true)
          .where('orderCreationDate', '>=', dateRange[0])
          .where('orderCreationDate', '<=', dateRange[1])
          .get()
      ).docs ?? [];
    return response.map((e) => OrderDto.fromJson(e.data()));
  }
  
  //TODO: Make SOLID compilable
  async getOrderLogsForCustomer(customerId: string): Promise<OrderDto[]> {
    const response: any[] =
      (
        await this.logDatabase.db
          .collection(FirebaseColumns.ORDERS)
          .where('customerId', '==', customerId)
          .get()
      ).docs ?? [];
    return response.map((e) => OrderDto.fromJson(e.data()));
  }


 

  //isCancelledFromCourier data came with params
  async cancelOrder(params: CancelOrderDto): Promise<boolean | HttpException> {
    try {
      //TODO: Integrate cashback
      params.order.orderState = this.cancelledOrderState;
      const updateProcessSuccess: boolean | HttpException =
        await this.updateOrderState(params.order);
      if (updateProcessSuccess == true) {
        await this.firebase.setData(
          FirebaseColumns.CANCELLED_ORDERS,
          params.order.orderId,
          CancelOrderDto.toJson(params),
        );
      }
      return updateProcessSuccess;
    } catch (error) {
      return new HttpException(
        'Bir sorun oluştu, tekrar deneyiniz.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
