import gql from 'graphql-tag';

export const typeDefs = gql`
  type Municipality {
    id: ID!
    name: String!
    filing_info: String!
  }

  type Query {
    findMunicipalityByAddress(address: String!): [Municipality]
  }
`;
