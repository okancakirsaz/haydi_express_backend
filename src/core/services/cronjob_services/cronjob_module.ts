import { Module } from "@nestjs/common";
import { CronjobService } from "./cronjob_service";


@Module(
    {
        providers:[CronjobService]
    }
)
export class CronjobServiceModule{}