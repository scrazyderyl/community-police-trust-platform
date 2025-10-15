import { db } from '@/firebaseConfig';

export async function getAllGisData() {
  try {
    const docRef = db.doc("gis/index");
    const docSnap = await docRef.get();
    
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

export async function doesJurisdictionExist(id) {
  try {
    const data = await getAllGisData();

    return id in data;
  } catch (error) {
    return undefined;
  }
}