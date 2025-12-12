import React from "react";
import { FlatList, View } from "react-native";
import NoListFound from "../NoListFound";
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
  totalClaimed: number;
};

interface WishListingProps {
  wishList?: WishListItem[];
  onSelectDelete?: (id: string) => void;
  handleArchiveList?: (listId: string | null, isArchived: boolean) => Promise<void>;
  handleDuplicateList?: (listDetails: WishListItem | null) => Promise<void>;
  appliedFilterBy?: string;
}

export default function WishListing({ wishList = [], onSelectDelete, handleArchiveList, appliedFilterBy, handleDuplicateList }: WishListingProps) {
  if (wishList.length === 0) {
    return <NoListFound selectedFilter={appliedFilterBy} />;
  }
  return (
    <View style={styles.container}>
      <FlatList columnWrapperStyle={styles.columnWrapperStyle} contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false} numColumns={2} key={2} data={wishList} renderItem={({ item }) => <WishListCard item={item} onSelectDelete={onSelectDelete} handleArchiveList={handleArchiveList} handleDuplicateList={handleDuplicateList} />} keyExtractor={(item) => String(item._id)} />
    </View>
  );
}
