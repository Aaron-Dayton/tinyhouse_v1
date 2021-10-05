import { IResolvers } from "@graphql-tools/utils";
import { listings } from "../listings";

export const resolvers: IResolvers = {
  Query: {
    listings: () => { return listings}
  },
  Mutation: {
    deleteListing: (_root: undefined, { id }: { id: string }) => {
      for (let ctr = 0; ctr < listings.length; ctr++) {
        if (listings[ctr].id === id) {
          return listings.splice(ctr, 1)[0]
        }
      }

      throw new Error("Failed to delete listing")
    }
  }
};
