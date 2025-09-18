import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function getAllGisData() {
  try {
    const docRef = doc(db, "jurisdiction_gis", "index");
    const docSnap = await getDoc(docRef);
    
    return docSnap.data();
  } catch (error) {
    return null;
  }
}

export async function getJurisdictionGis(id) {
  try {
    const data = await getAllGisData();

    return data[id];
  } catch (error) {
    return undefined;
  }
}