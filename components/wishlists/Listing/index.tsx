import React from "react";
import { FlatList, View } from "react-native";
import WishListCard from "../WishListCard";
import { styles } from "./style";

type WishListItem = {
  _creationTime: number;
  _id: string;
  coverPhotoUri: string | null;
  created_at: string;
  eventDate: string;
  note: string | null;
  occasion: string;
  password: string;
  privacy: string;
  requiresPassword: boolean;
  shippingAddress: string;
  title: string;
  updated_at: string;
  user_id: string;
  totalItems: number;
  totalClaimed: number
};

interface WishListingProps {
  wishList: WishListItem[];
}

export default function WishListing({ wishList = [] }: WishListingProps) {
  return (
    <View style={styles.container}>
      <FlatList columnWrapperStyle={styles.columnWrapperStyle} contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false} numColumns={2} key={2} data={wishList} renderItem={({ item }) => <WishListCard item={item} />} keyExtractor={(item) => String(item._id)} />
    </View>
  );
}
