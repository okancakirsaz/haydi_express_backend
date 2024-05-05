import * as admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";
import { Firestore, WhereFilterOp, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";
import { FirebaseApp, initializeApp } from "firebase/app";
import { ref, uploadBytesResumable,getDownloadURL, getStorage, deleteObject } from "@firebase/storage";


export class FirebaseServices{
static instance:FirebaseServices = new FirebaseServices();
private serviceAccountCredentials = serviceAccount as admin.ServiceAccount; 
private db:Firestore;
private storage;
private app:FirebaseApp;
auth:Auth;

private firebaseConfig = {
  apiKey: "AIzaSyBfUZiudWTpMfLzFQuznhJG7bfdUIi7I8s",
  authDomain: "haydi-express.firebaseapp.com",
  projectId: "haydi-express",
  storageBucket: "haydi-express.appspot.com",
  messagingSenderId: "435392360770",
  appId: "1:435392360770:web:9d793b60922dd6557a98db",
  measurementId: "G-DB8XBN0TZ4"
};

initApp(){
    admin.initializeApp({
        credential: admin.credential.cert(this.serviceAccountCredentials)
      });
    this.app = initializeApp(this.firebaseConfig);
    this.db = getFirestore();
    this.auth = getAuth();
    this.storage = getStorage(this.app)
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

async getDataWithWhereQuery(column:string,whereKey:string,whereOperator:WhereFilterOp,whereValue:any){
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


async uploadFileToStorage(collection:string,subCollection:string,refId:string,file:Express.Multer.File):Promise<string>{
  const storageRef = ref(
    this.storage,
    `${collection}/${subCollection}/${refId}.jpg`
  );
  await uploadBytesResumable(storageRef, Uint8Array.from(file.buffer));
  return await getDownloadURL(storageRef);
}


async deleteFileFromStorage(collection:string,subCollection:string,refId:string){
  const storageRef = ref(
    this.storage,
    `${collection}/${subCollection}/${refId}.jpg`
  );
  await deleteObject(storageRef);
}
}