import { FirebaseServices } from "../services/firebase_services";
import { LogDatabaseService } from "../services/log_database_service";

export abstract class BaseService{
    firebase = FirebaseServices.instance;
    logDatabase = LogDatabaseService.instance;
}