import Fuse from 'fuse.js';

interface GisEntry {
  name: string;
}

async function getAllData() {
  try {
    const req = await fetch("/api/get_gis_index");
    
    return req.json();
  } catch (error) {
    return null;
  }
}

export async function findJurisdictionsByName(query, exclude?) {
  try {
    const data = await getAllData();
    const jurisdictions = Object.entries(data).map(([id, v]: [string, GisEntry]) => ({ id, name: v.name }));
    let results;

    // Show all entries if query is empty
    if (query === "") {
      results = jurisdictions
        .filter(r => r.id !== exclude)
        .map(r => ({
          value: r.id,
          label: r.name,
        }))
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