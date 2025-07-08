import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Fuse from 'fuse.js';

async function getAllData() {
  try {
    const docRef = doc(db, "jurisdiction_gis", "index");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function findJurisdictionsByName(query, exclude) {
  try {
    const data = await getAllData();
    const jurisdictions = Object.entries(data).map(([id, v]) => ({ id, name: v.name }));
    let results;

    // Show all entries if query is empty
    if (query === "") {
      results = jurisdictions
        .map(r => ({
          value: r.id,
          label: r.name,
        }))
        .filter(r => r.id !== exclude)
        .sort((a, b) => {
          if (a.label < b.label) {
            return -1;
          }

          if (a.label > b.label) {
            return 1;
          }

          return 0;
        });
    } else {
      const fuse = new Fuse(jurisdictions, { keys: ["name"], threshold: 0.4 });
      results = fuse.search(query)
        .filter(r => r.item.id !== exclude)
        .slice(0, 5)
        .map(r => ({
          value: r.item.id,
          label: r.item.name,
        }));
    }
    
    return results;
  } catch (error) {
    return null;
  }
}

export async function getJurisdictionById(id) {
  try {
    const data = await getAllData();

    return data[id];
  } catch (error) {
    return undefined;
  }
}

export async function jurisidictionExists(id) {
  try {
    const data = await getAllData();

    return id in data;
  } catch (error) {
    return false;
  }
}

export async function addNewJurisdiction(id, name) {
  try {
    const data = await getAllData();

    // Don't overwrite if id exists
    if (id in data) {
      return false;
    }

    // Add to object
    data[id] = {
      name: name
    };

    // Add entry to Firebase
    const docRef = doc(db, "jurisdiction_gis", "index");

    await updateDoc(docRef, {
      [id]: { name: name }
    });

    return true;
  } catch (error) {
    return false;
  }
}