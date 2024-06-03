import { JwtModule } from "@nestjs/jwt"

export class JwtConstants{
    //TODO: Import secret
    secret = "JWT_SECRET"

    jwtModule= JwtModule.register({
        global: true,
        secret: this.secret,
        //NOTE: You can set access token expire date
      });
}