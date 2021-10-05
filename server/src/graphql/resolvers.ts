import { IResolvers } from "@graphql-tools/utils";
import { Database, Listing } from "../lib/types";
import { ObjectId } from "mongodb";

export const resolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    }
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const res = await db.listings.findOneAndDelete({
        _id: new ObjectId(id)
      });

      if (!res.value) {
        throw new Error("Failed to delete listing");
      };

      return res.value;
    }
  },
  // All resolvers needed for Listing, besides id which has a different name and
  // type in types.ts and typeDefs.ts, are trivial (same name and type), so we
  // do not need to define them.
  Listing: {
    id: (listing: Listing): string => listing._id.toString()
  }
};
