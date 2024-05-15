import { Module } from "@nestjs/common";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/core/guard/auth.guard";

@Module({
    providers:[MenuService,AuthGuard],
    controllers:[MenuController]
})
export class MenuModule{}