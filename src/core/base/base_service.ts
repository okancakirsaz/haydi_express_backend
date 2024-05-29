import { FirebaseServices } from "../services/firebase_services";

export abstract class BaseService{
    firebase = FirebaseServices.instance;

     capitalizeWords(str: string): string {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
}