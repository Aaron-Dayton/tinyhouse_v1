import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "apollo-boost";
import {
  ListingsData,
  DeleteListingVariables,
  DeleteListingData
} from "./types";

const LISTINGS = gql`
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

const DELETE_LISTING = gql`
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
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);
  const [deleteListing, {
    loading: deleteListingLoading,
    error: deleteListingError
  }] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listings = data ? data.listings : null;
  const listingsList =
    listings ? <ul>{listings.map((listing) => {
                 return <div>
                          <li key={listing.id}>{listing.title}</li>
                          <button onClick={() => handleDeleteListing(listing.id)}>
                            Delete
                          </button>
                        </div>;
               })}</ul> :
               null;

  if (loading) {
    return <h2>Loading...</h2>;
  };

  if (error) {
    return <h2> Uh oh! Something went wrong - please try again later</h2>
  };

  const deleteListingLoadingMsg =
    deleteListingLoading ? (<h4>Deletion in progress...</h4>) : null;

  const deleteListingErrorMsg =
    deleteListingError ? (<h4>Uh oh! Deletion failed - please try again later</h4>) : null;

  return  <div>
            <h2>{title}</h2>
            {listingsList}
            {deleteListingLoadingMsg}
            {deleteListingErrorMsg}
          </div>;
};
