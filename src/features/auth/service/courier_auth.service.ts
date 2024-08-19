import { CodeLogInDto } from 'src/core/dt_objects/auth/code_log_in.dto';
import { AuthService } from './auth.services';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { CourierDto } from 'src/core/dt_objects/user/courier.dto';

export class CourierAuthService extends AuthService {
  async logInWithCode(
    params: CodeLogInDto,
  ): Promise<CodeLogInDto | HttpException> {
    const usr = await this.firebase.getDataWithWhereQuery(
      FirebaseColumns.COURIERS,
      'secureCode',
      '==',
      params.code,
    );
    if (usr != null) {
      params.accessToken = await this.jwtService.signAsync({
        email: 'ocakirsaz@gmail.com',
        pass: params.code,
      });
      params.userId= CourierDto.fromJson(usr[0]).courierId;
      return params;
    } else {
      return new HttpException(
        'Girilen kod geçerli değil.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
