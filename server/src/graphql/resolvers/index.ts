import merge = require("lodash.merge");
import { listingResolver } from "./Listings";

export const resolvers = merge(listingResolver);
