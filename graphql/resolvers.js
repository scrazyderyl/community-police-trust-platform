import { findMunicipalityByAddress } from "@/services/GeoService";

export const resolvers = {
  Query: {
    findMunicipalityByAddress: async (_, { address }) => {
      return await findMunicipalityByAddress(address);
    },
  },
};
