import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { List, Avatar, Button, Spin, Alert } from "antd";
import { gql } from "apollo-boost";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables
} from "./__generated__/DeleteListing";
import { ListingsSkeleton } from "./components";
import "./styles/Listings.css"

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
    listings ? <List
                  itemLayout="horizontal"
                  dataSource={listings}
                  renderItem={(listings) => (
                    <List.Item actions={[
                      <Button
                        type="primary"
                        onClick={() => handleDeleteListing(listings.id)}
                      >
                        Delete
                      </Button>]
                    }>
                      <List.Item.Meta
                        title={listings.title}
                        description={listings.address}
                        avatar={
                          <Avatar
                            src={listings.image}
                            shape="square"
                            size={48}
                          />
                        }
                      />
                    </List.Item>
                  )}
                /> : null;

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={ title }  />
      </div>
    );
  };

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={ title } error />
      </div>
    );
  };

  const deleteListingErrorMsg =
    deleteListingError ? (
      <Alert
        type="error"
        message="Uh oh! Deletion failed - please try again later"
        className="listings__alert"
      />
    ) : null;

  return  <div className="listings">
            {deleteListingErrorMsg}
            <h2>{title}</h2>
            <Spin spinning={deleteListingLoading} />
            {!deleteListingLoading ? listingsList : null}
          </div>;
};
