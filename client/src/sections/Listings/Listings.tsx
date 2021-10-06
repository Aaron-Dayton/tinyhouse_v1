import React, { useState, useEffect } from "react";
import { server } from "../../lib/api/server";
import {
  Listing,
  ListingsData,
  DeleteListingVariables,
  DeleteListingData
} from "./types";

const LISTINGS = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const [listings, setListings] = useState<Listing[] | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS});
    setListings(data.listings)
  };

  const deleteListings = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id
      }
    });
    fetchListings();
  };

  const listingsList = listings
    ? <ul>{listings.map((listing) => {
        return  <div>
                  <li key={listing.id}>{listing.title}</li>
                  <button onClick={() => deleteListings(listing.id)}>Delete this listing</button>
                </div>;
      })}</ul>
    : null;

  return  <div>
            <h2>{title}</h2>
            {listingsList}
          </div>;
};
