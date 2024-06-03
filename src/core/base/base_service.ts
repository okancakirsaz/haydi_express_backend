import { FirebaseServices } from "../services/firebase_services";

export abstract class BaseService{
    firebase = FirebaseServices.instance;
}