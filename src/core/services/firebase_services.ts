import * as admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";
import { Firestore, WhereFilterOp, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";


export class FirebaseServices{
static instance:FirebaseServices = new FirebaseServices();
private serviceAccountCredentials = serviceAccount as admin.ServiceAccount; 
private db:Firestore;
auth:Auth;

initApp(){
    admin.initializeApp({
        credential: admin.credential.cert(this.serviceAccountCredentials)
      });
    this.db = getFirestore();
    this.auth = getAuth();
}

async setData(column:string,doc:string,data:any){
  try {
    await this.db.collection(column).doc(doc).set(data);
  } catch (error) {
    console.log(
      `You have an error in write ${column}/${doc} data\nThis is your error: `,
      error
    );
  }
}

async getDoc(column:string,doc:string){
  return (await this.db.collection(column).doc(doc).get()).data();
}

async deleteDoc(column:string,doc:string){
   await this.db.collection(column).doc(doc).delete();
}

async updateData(column:string,doc:string,data:any){
  try {
    await this.db.collection(column).doc(doc).update(data);
  } catch (error) {
    console.log(
      `You have an error in update ${column}/${doc} data\nThis is your error: `,
      error
    );
  }
}

async getDataWithWhereQuery(column:string,whereKey:string,whereOperator:WhereFilterOp,whereValue:string){
  try {
    const queryRequest = await this.db.collection(column).where(whereKey,whereOperator,whereValue).get();
    const dataList = [];

    for(let i=0;i<=queryRequest.docs.length-1;i++){
      dataList.push(queryRequest.docs[i].data());
    }
   return dataList.length==0?null: dataList;
  } catch (error) {
    console.log(
      `You have an error in query ${column} data\nThis is your error: `,
      error
    );
  }
}

}