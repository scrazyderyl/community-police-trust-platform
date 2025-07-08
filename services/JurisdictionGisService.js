import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import Fuse from 'fuse.js';

const filePath = path.join(process.cwd(), 'lib', 'jurisdiction_gis.json');

function readAllData() {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function findJurisdictionsByName(query) {
  try {
    const data = readAllData();
    const jurisdictions = Object.entries(data).map(([id, v]) => ({ id, name: v.name }));
    const fuse = new Fuse(jurisdictions, { keys: ["name"], threshold: 0.4 });
    const results = fuse.search(query).slice(0, 5).map(r => ({
      value: r.item.id,
      label: r.item.name,
    }));

    return results;
  } catch (error) {
    return null;
  }
}

export function getJurisdictionById(id) {
  try {
    const data = readAllData();

    return data[id];
  } catch (error) {
    return undefined;
  }
}

export function jurisidictionExists(id) {
  try {
    const data = readAllData();

    return id in data;
  } catch (error) {
    return false;
  }
}

export function addNewJurisdiction(id, name) {
  try {
    const data = readAllData();

    // Don't overwrite if id exists
    if (id in data) {
      return false;
    }

    // Add to object
    data[id] = {
      name: name
    };

    // Write to json
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    return true;
  } catch (error) {
    return false;
  }
}