import { Firestore, getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import serviceAccount from "../../log_db_serviceAccountKey.json";

export class LogDatabaseService{
static instance:LogDatabaseService = new LogDatabaseService();
db:Firestore;
private serviceAccountCredentials = serviceAccount as admin.ServiceAccount; 

initApp(){
   const secondary = admin.initializeApp({
        credential: admin.credential.cert(this.serviceAccountCredentials),
        
      },'secondary');
    this.db = admin.firestore(secondary);
}
}