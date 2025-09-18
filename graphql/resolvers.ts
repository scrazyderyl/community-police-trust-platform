import { findMunicipalityByName } from "@/services/GeoService";

export const resolvers = {
  Query: {
    findMunicipalityByAddress: async (_, { address }) => {
      return await findMunicipalityByName(address);
    },
  },
};
