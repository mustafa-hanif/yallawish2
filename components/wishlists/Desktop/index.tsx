import Tabs from "@/components/wishlists/Tabs";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import { responsiveStylesHome } from "@/styles/homePageResponsiveStyles";

import DeleteConfirmation from "@/components/DeleteConfirmationModal";
import * as LucideIcons from "lucide-react-native";
import ListDetails from "./ListDetails";
import ListsControlPanel from "./ListsControlPanel";
import NoListFoundDesktop from "./NoListFoundDesktop";
import SortAndFilterDropDown from "./SortAndFilterDropDown";
import WishListCardDesktop from "./WishListCardDesktop";

export function Desktop() {
  const isDesktop = true;
  const { user } = useUser();
  
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;
  const pathname = usePathname();

  const [currentTab, setCurrentTab] = useState<string>("my-events");
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>("default");
  const [filterBy, setFilterBy] = useState<string | null>(null);

  const [appliedSortBy, setAppliedSortBy] = useState<string | null>("default");
  const [appliedFilterBy, setAppliedFilterBy] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  
  const myLists = useQuery(api.products.getMyLists, user?.id ? { user_id: user.id } : "skip");
  const communityLists = useQuery(api.products.getCommunityLists, user?.id ? { exclude_user_id: user.id } : "skip");
  const selectedList = useQuery(api.products.getListById, selectedListId ? { listId: selectedListId as any } : "skip");
  const selectedListItems = useQuery(
    api.products.getListItems as any,
    selectedListId ? ({ list_id: selectedListId } as any) : "skip"
  );
  const createList = useMutation(api.products.createList);
  const deleteList = useMutation(api.products.deleteList);
  const archiveList = useMutation(api.products.setListArchived);
  const deleteListItemMutation = useMutation(api.products.deleteListItem as any);
  useEffect(() => {
    setCurrentTab("my-events");
  }, [pathname]);

  useEffect(() => {
    setShowSortSheet(false);
    setSortBy("default");
    setFilterBy(null);
    setAppliedSortBy("default");
    setAppliedFilterBy(null);
    setSearch("");
  }, [currentTab]);

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handleToggleModal = () => setShowSortSheet((prev) => !prev);

  const searchList = (arr: any[] = []) => {
    const q = search.trim().toLowerCase();
    if (!q) return arr;
    return arr.filter((item) => item.title.toLowerCase().includes(q));
  };

  const handlePressApply = () => {
    if (sortBy === "allList") {
      setAppliedSortBy(null);
    } else {
      setAppliedSortBy(sortBy);
    }
    setAppliedFilterBy(filterBy);
    setShowSortSheet(false);
  };
  const wishList = currentTab === "community-events" ? communityLists : myLists;

  const sortedWishList = useMemo(() => {
    const arr = Array.isArray(wishList) ? [...wishList] : [];
    const key = appliedSortBy;
    if (!arr.length) return arr;
    if (!key || key === "default") return arr;

    if (key === "dateOfEvent") {
      return arr.sort((a: any, b: any) => {
        const da = a?.eventDate ? new Date(a.eventDate).getTime() : (a?._creationTime ?? 0);
        const db = b?.eventDate ? new Date(b.eventDate).getTime() : (b?._creationTime ?? 0);
        return da - db;
      });
    }

    if (key === "alphabetically") {
      return arr.sort((a: any, b: any) => String(a.title || "").localeCompare(String(b.title || "")));
    }

    if (key === "percentage") {
      return arr.sort((a: any, b: any) => {
        const pa = a?.totalItems ? (a.totalClaimed || 0) / a.totalItems : 0;
        const pb = b?.totalItems ? (b.totalClaimed || 0) / b.totalItems : 0;
        return pb - pa; // higher completion first
      });
    }

    if (key === "totalItems") {
      return arr.sort((a: any, b: any) => (b.totalItems || 0) - (a.totalItems || 0));
    }

    return arr;
  }, [wishList, appliedSortBy]);

  const filteredWishList = useMemo(() => {
    const arr = Array.isArray(sortedWishList) ? [...sortedWishList] : [];
    const key = appliedFilterBy;
    if (!arr.length) return arr;
    if (!key) return arr;

    const now = Date.now();

    if (key === "archived") {
      return arr.filter((item: any) => item.isArchived === true);
    }
    if (key === "pastEvents") {
      return arr
        .filter((item: any) => {
          const t = item?.eventDate ? new Date(item.eventDate).getTime() : (item?._creationTime ?? 0);
          return t < now;
        })
        .sort((a: any, b: any) => {
          const ta = a?.eventDate ? new Date(a.eventDate).getTime() : (a?._creationTime ?? 0);
          const tb = b?.eventDate ? new Date(b.eventDate).getTime() : (b?._creationTime ?? 0);
          return tb - ta; // newest past first
        });
    }

    if (key === "upcomingEvents") {
      return arr
        .filter((item: any) => {
          const t = item?.eventDate ? new Date(item.eventDate).getTime() : (item?._creationTime ?? 0);
          return t >= now;
        })
        .sort((a: any, b: any) => {
          const ta = a?.eventDate ? new Date(a.eventDate).getTime() : (a?._creationTime ?? 0);
          const tb = b?.eventDate ? new Date(b.eventDate).getTime() : (b?._creationTime ?? 0);
          return ta - tb; // soonest first
        });
    }

    if (key === "completed") {
      return arr
        .filter((item: any) => {
          const total = item?.totalItems || 0;
          const claimed = item?.totalClaimed || 0;
          return total > 0 && claimed >= total;
        })
        .sort((a: any, b: any) => {
          const ta = a?.eventDate ? new Date(a.eventDate).getTime() : (a?._creationTime ?? 0);
          const tb = b?.eventDate ? new Date(b.eventDate).getTime() : (b?._creationTime ?? 0);
          return tb - ta; // recent completed first
        });
    }

    if (key === "inComplete") {
      return arr
        .filter((item: any) => {
          const left = (item?.totalItems || 0) - (item?.totalClaimed || 0);
          return left > 0;
        })
        .sort((a: any, b: any) => {
          const la = (a?.totalItems || 0) - (a?.totalClaimed || 0);
          const lb = (b?.totalItems || 0) - (b?.totalClaimed || 0);
          return lb - la; // most items left first
        });
    }

    return arr;
  }, [sortedWishList, appliedFilterBy]);

  const handleSelectDelete = (listId: string) => setDeleteListId(listId);
  const handleDeleteList = async (listId: string | null) => {
    await deleteList({ listId: listId as any });
    setDeleteListId(null);
  };

    const handleDeleteItem = async (itemId: string | null) => {
      if (!itemId) return;
      try {
        await deleteListItemMutation({ itemId: itemId as any });
      } catch (e) {
        console.warn("Failed to delete item", e);
        Alert.alert(
          "Delete failed",
          "Could not delete the item. Please try again."
        );
      } finally {
        setDeleteItemId(null);
      }
    };

  const handleArchiveList = async (listId: string | null, isArchived: boolean) => {
    await archiveList({ listId: listId as any, isArchived: isArchived });
  };

  const handleDuplicateList = async (listDetails: any) => {
    const newListId = await createList({
      title: listDetails.title,
      note: listDetails.note || null,
      eventDate: listDetails.eventDate || null,
      shippingAddress: listDetails.shippingAddress || null,
      occasion: listDetails.occasion || null,
      coverPhotoUri: listDetails.coverPhotoUri || null,
      coverPhotoStorageId: listDetails.coverPhotoStorageId || null,
      privacy: listDetails?.privacy || "private",
      user_id: listDetails?.user_id || user?.id || null,
    });

    router.push({
      pathname: "/add-gift",
      params: { listId: String(newListId) },
    });
  };

  const onRemoveItem = (itemId?: string) => {
    if (!itemId) return;
    // open confirmation modal
    setDeleteItemId(String(itemId));
  };
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {wishList && wishList?.length ? (
          <>
            <View style={styles.contentContainer}>
              {/* Left Sidebar */}
              <View style={styles.sidebar}>
                <View style={{ position: "relative", zIndex: 10002 }}>
                  <ListsControlPanel count={filteredWishList.length} handleToggleModal={handleToggleModal} />
                  <SortAndFilterDropDown currentTab={currentTab} showSortSheet={showSortSheet} handleToggleModal={handleToggleModal} sortBy={sortBy} setSortBy={setSortBy} filterBy={filterBy} setFilterBy={setFilterBy} handlePressApply={handlePressApply} />
                </View>
                <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
                <View style={{ height: 18 }} />
                <FlatList data={filteredWishList} contentContainerStyle={{ rowGap: 16, paddingVertical: 12 }} showsVerticalScrollIndicator={false} keyExtractor={(item) => String(item._id)} renderItem={({ item }) => <WishListCardDesktop item={item} onSelectDelete={handleSelectDelete} handleArchiveList={handleArchiveList} handleDuplicateList={handleDuplicateList} onSelect={() => setSelectedListId(String(item._id))} isSelected={selectedListId === String(item._id)} />} />
              </View>

              {/* Main Content */}
              <View style={styles.mainContent}>
                {selectedList && selectedListItems ? (
                  <ListDetails 
                    list={selectedList} 
                    items={selectedListItems || []}
                    onRemoveItem={onRemoveItem}
                    onUpdateQuantity={(itemId, quantity) => {
                      // TODO: Implement update quantity
                      console.log('Update quantity:', itemId, quantity);
                    }}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      Select a list to view details
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        ) : (
          <>
            <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <NoListFoundDesktop currentTab={currentTab} />
          </>
        )}
        {/* </View> */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: isDesktop ? 80 : 40,
            paddingHorizontal: isDesktop ? 0 : 20,
          }}
        >
          <View style={isDesktop ? responsiveStylesHome.sectionInner : undefined}>
            <View style={{ alignItems: "center", marginBottom: 48 }}>
              <View
                style={{
                  backgroundColor: "#F8A8D4",
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginBottom: 16,
                  transform: [{ rotate: "-5deg" }],
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 12,
                    color: "#330065",
                    textTransform: "uppercase",
                  }}
                >
                  Hurry up to buy
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 48,
                  color: "#1A0034",
                  textAlign: "center",
                }}
              >
                New Arrivals
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 24,
                justifyContent: isDesktop ? "space-between" : "center",
              }}
            >
              {[
                {
                  id: 1,
                  name: "Classic PX Smart Watch",
                  category: "Accessories, Watches",
                  price: "AED 249.00 - AED 399.00",
                  image: require("@/assets/images/homepage/arrivals/arrival1.png"),
                  bgColor: "#E6F4FE",
                },
                {
                  id: 2,
                  name: "Hoor Stylish Edged Ring",
                  category: "Jewelry, Ring",
                  price: "AED 249.00",
                  image: require("@/assets/images/homepage/arrivals/arrival2.png"),
                  bgColor: "#FDF2F8",
                },
                {
                  id: 3,
                  name: "Frames Upholstered Chair",
                  category: "Furniture, Chairs",
                  price: "AED 549.00",
                  image: require("@/assets/images/homepage/arrivals/arrival3.png"),
                  bgColor: "#FEFBEB",
                },
                {
                  id: 4,
                  name: "Nude Liquid Powder",
                  category: "Makeup, Skincare",
                  price: "AED 399.00",
                  image: require("@/assets/images/homepage/arrivals/arrival4.png"),
                  bgColor: "#FEFCE8",
                },
                {
                  id: 5,
                  name: "Baby Girl Warm Shirt",
                  category: "Clothes, Baby",
                  price: "AED 99.00 - AED 199.00",
                  image: require("@/assets/images/homepage/arrivals/arrival5.png"),
                  bgColor: "#F3E8FF",
                },
                {
                  id: 6,
                  name: "BERIBES Bluetooth Headphones",
                  category: "Accessories, Headphones",
                  price: "AED 149.00",
                  image: require("@/assets/images/homepage/arrivals/arrival6.png"),
                  bgColor: "#E0F2FE",
                },
              ].map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: isDesktop ? "31%" : "100%",
                    maxWidth: 400,
                    marginBottom: 40,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: item.bgColor,
                      borderRadius: 16,
                      aspectRatio: 1.2,
                      marginBottom: 20,
                      position: "relative",
                      overflow: "hidden",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 20,
                    }}
                  >
                    <Image source={item.image} style={{ width: "90%", height: "90%" }} contentFit="contain" />
                    <Pressable
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: "#330065",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LucideIcons.Heart size={16} color="#FFFFFF" />
                    </Pressable>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 18,
                        color: "#1A0034",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_400Regular",
                        fontSize: 14,
                        color: "#6F5F8F",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      {item.category}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 16,
                        color: "#DC2626",
                        marginBottom: 16,
                        textAlign: "center",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Pressable
                      style={{
                        borderWidth: 1,
                        borderColor: "#330065",
                        borderRadius: 999,
                        paddingHorizontal: 24,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito_600SemiBold",
                          fontSize: 14,
                          color: "#330065",
                        }}
                      >
                        Add to List
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ alignItems: "center", marginTop: 24 }}>
              <Pressable
                style={{
                  backgroundColor: "#330065",
                  borderRadius: 999,
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_600SemiBold",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Browse More Gifts
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <DeleteConfirmation visible={!!deleteListId} onCancel={() => setDeleteListId(null)} onDelete={() => handleDeleteList(deleteListId)} />
        <DeleteConfirmation visible={!!deleteItemId} onCancel={() => setDeleteItemId(null)} onDelete={() => handleDeleteItem(deleteItemId)} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingTop: 82,
    flexDirection: "row",
    height: 700,
    gap: 24,
    maxWidth: 1800,
    paddingHorizontal: 150,
  },
  sidebar: {
    width: 413,
    backgroundColor: "#FAFAFA",
    borderRadius: 15,
    paddingHorizontal: 16,
  },
  mainContent: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
  },
  emptyStateText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: "#8E8E93",
  },
});
