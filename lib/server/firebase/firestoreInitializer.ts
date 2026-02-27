import "server-only";
import firebaseAdmin from './firebaseInitializer';

const firestore = firebaseAdmin.firestore();

export default firestore;