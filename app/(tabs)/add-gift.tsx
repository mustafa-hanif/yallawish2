import DeleteConfirmation from "@/components/DeleteConfirmationModal";
import { RibbonHeader } from "@/components/RibbonHeader";
import { TextInputAreaField } from "@/components/TextInputAreaField";
import { TextInputField } from "@/components/TextInputField";
import { ActionsBar, FooterBar, GiftItemCard, HeaderBar, InfoBox, ListCover } from "@/components/list";
import type { GiftItem as GiftItemType } from "@/components/list/GiftItemCard";
import BottomSheet from "@/components/ui/BottomSheet";
import { api } from "@/convex/_generated/api";
import { desktopStyles, styles } from "@/styles/addGiftStyles";
import { formatLastUpdated, getDaysToGoText } from "@/utils";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useAction, useMutation, useQuery } from "convex/react";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Easing, Image, Modal, Platform, Pressable, ScrollView as RNScrollView, Share, StatusBar, Text, TextInput, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

type SortOption = "default" | "priceAsc" | "priceDesc" | "newest" | "oldest";

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "priceAsc", label: "Price: Low to High" },
  { key: "priceDesc", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
];

const DESKTOP_BREAKPOINT = 1024;
const FALLBACK_COVER = require("@/assets/images/nursery.png");

const getPrivacyDisplay = (privacy: string, loading: boolean, shareCount?: number) => {
  if (loading) {
    return {
      label: "Loading...",
      description: "Fetching privacy",
      icon: "lock-closed-outline" as const,
    };
  }
  const isShared = privacy === "shared";
  const isPublic = isShared && (shareCount ?? 0) === 0;
  if (isShared) {
    return {
      label: isPublic ? "Public" : "Shared",
      description: isPublic ? "Anyone with the link" : "Only people you choose",
      icon: isPublic ? ("globe-outline" as const) : ("people-outline" as const),
    };
  }
  return {
    label: "Private",
    description: "Only you can see this",
    icon: "lock-closed-outline" as const,
  };
};

export default function AddGift() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const { user } = useUser();

  const list = useQuery(api.products.getListById, {
    listId: listId as any,
  });
  const createList = useMutation(api.products.createList);
  const deleteList = useMutation(api.products.deleteList);
  const archiveList = useMutation(api.products.setListArchived);

  const items = useQuery(api.products.getListItems as any, listId ? ({ list_id: listId } as any) : "skip");

  // All list items
  const giftItems: GiftItemType[] = useMemo(() => (Array.isArray(items) ? [...items] : []), [items]);

  // Sort & Filter state
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filterClaimed, setFilterClaimed] = useState(false);
  const [filterUnclaimed, setFilterUnclaimed] = useState(false);

  // Derived displayed items
  let displayedItems: GiftItemType[] = giftItems;
  if (filterClaimed && !filterUnclaimed) {
    displayedItems = displayedItems.filter((i) => (i.claimed ?? 0) >= (i.quantity ?? 1));
  } else if (filterUnclaimed && !filterClaimed) {
    displayedItems = displayedItems.filter((i) => (i.claimed ?? 0) < (i.quantity ?? 1));
  }
  try {
    displayedItems = [...displayedItems].sort((a, b) => {
      const aPrice = parseFloat(String(a.price ?? 0)) || 0;
      const bPrice = parseFloat(String(b.price ?? 0)) || 0;
      const ad = (a as any)?.created_at || "";
      const bd = (b as any)?.created_at || "";
      switch (sortBy) {
        case "priceAsc":
          return aPrice - bPrice;
        case "priceDesc":
          return bPrice - aPrice;
        case "newest":
          return bd.localeCompare(ad);
        case "oldest":
          return ad.localeCompare(bd);
        default:
          return 0;
      }
    });
  } catch {}
  // @ts-ignore generated after adding convex action
  const scrape = useAction((api as any).scrape.productMetadata);

  // Format YYYY-MM-DD to a friendly date like: Mon, Aug 11, 2025
  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-").map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateStr;
    const [y, m, d] = parts;
    const date = new Date(y, (m ?? 1) - 1, d ?? 1); // local time to avoid TZ shift
    try {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  };

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;

  const availability = useMemo<"all" | "claimed" | "unclaimed">(() => {
    if (filterClaimed && !filterUnclaimed) return "claimed";
    if (filterUnclaimed && !filterClaimed) return "unclaimed";
    return "all";
  }, [filterClaimed, filterUnclaimed]);

  const handleAvailabilityChange = useCallback(
    (value: "all" | "claimed" | "unclaimed") => {
      switch (value) {
        case "claimed":
          setFilterClaimed(true);
          setFilterUnclaimed(false);
          break;
        case "unclaimed":
          setFilterClaimed(false);
          setFilterUnclaimed(true);
          break;
        default:
          setFilterClaimed(false);
          setFilterUnclaimed(false);
          break;
      }
    },
    [setFilterClaimed, setFilterUnclaimed],
  );

  const totals = useMemo(() => {
    return giftItems.reduce(
      (acc, item) => {
        const quantity = Number(item.quantity ?? 1);
        const claimed = Number(item.claimed ?? 0);
        acc.totalItems += 1;
        acc.totalQuantity += quantity;
        acc.claimedUnits += Math.min(quantity, claimed);
        if (claimed >= quantity) {
          acc.fullyClaimed += 1;
        } else if (claimed > 0) {
          acc.claimedCount += 1;
        } else {
          acc.unclaimedCount += 1;
        }
        return acc;
      },
      {
        totalItems: 0,
        totalQuantity: 0,
        fullyClaimed: 0,
        claimedCount: 0,
        unclaimedCount: 0,
        claimedUnits: 0,
      },
    );
  }, [giftItems]);

  const eventDateStr = (list?.eventDate as string | undefined) ?? undefined;
  const formattedEventDate = formatEventDate(eventDateStr);

  const daysToGoText = useMemo(() => {
    return getDaysToGoText(eventDateStr);
  }, [eventDateStr]);

  const lastUpdatedLabel = `Last updated: ${formatLastUpdated(list?.updated_at)}`;
  const listIdString = listId ? String(listId) : undefined;

  const handleOpenGift = useCallback(
    async (item: GiftItemType) => {
      if (!item?.buy_url) return;
      try {
        const { Linking } = require("react-native");
        await Linking.openURL(item.buy_url);
      } catch (e) {
        console.warn("Failed to open store URL", e);
      }
      // router.push({
      //   pathname: "/gift-detail",
      //   params: {
      //     itemId: String(item._id),
      //     ...(listIdString ? { listId: listIdString } : {}),
      //   },
      // });
    },
    [listIdString],
  );

  const handleBack = () => {
    router.back();
  };

  // Bottom sheet + form state
  const [showSheet, setShowSheet] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current; // 0 hidden,1 visible
  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: showSheet ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [showSheet, sheetAnim]);
  const translateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const [link, setLink] = useState("");
  const [search, setSearch] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  // In-sheet browser state
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null); // initial search url
  const [currentBrowserUrl, setCurrentBrowserUrl] = useState<string | null>(null); // updated as user navigates
  // Sort & Filter sheet visibility
  const [showSortSheet, setShowSortSheet] = useState(false);
  // Temp draft selections while sheet open
  const [tempSortBy, setTempSortBy] = useState<SortOption>("default");
  const [tempFilterClaimed, setTempFilterClaimed] = useState(false);
  const [tempFilterUnclaimed, setTempFilterUnclaimed] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [deleteListId, setDeleteListId] = useState<string | null>(null);

  // Cover photo upload state
  const [showCoverUploadModal, setShowCoverUploadModal] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  // Gift image upload state
  const [isUploadingGiftImage, setIsUploadingGiftImage] = useState(false);
  const [giftImageUploadError, setGiftImageUploadError] = useState<string | null>(null);

  // Convex mutations for cover photo
  const generateCoverUploadUrl = useMutation(api.products.generateListCoverUploadUrl);
  const getCoverUrl = useMutation(api.products.getListCoverUrl);
  const updateListDetails = useMutation(api.products.updateListDetails);

  const openSortSheet = useCallback(() => {
    setTempSortBy(sortBy);
    setTempFilterClaimed(filterClaimed);
    setTempFilterUnclaimed(filterUnclaimed);
    setShowSortSheet(true);
  }, [filterClaimed, filterUnclaimed, sortBy]);

  useEffect(() => {
    if (!showSortSheet) {
      setTempSortBy(sortBy);
      setTempFilterClaimed(filterClaimed);
      setTempFilterUnclaimed(filterUnclaimed);
    }
  }, [showSortSheet, sortBy, filterClaimed, filterUnclaimed]);

  useEffect(() => {
    if (link.trim().length === 0) {
      setIsUrlValid(true);
      return;
    }
    // Only validate if it looks like a URL (starts with http:// or https://)
    // Keywords without http/https prefix are considered valid
    const trimmedLink = link.trim();
    if (trimmedLink.startsWith("http://") || trimmedLink.startsWith("https://")) {
      setIsUrlValid(validateUrl(link));
    } else {
      // It's a keyword, not a URL, so it's valid
      setIsUrlValid(true);
    }
  }, [link]);

  const DESCRIPTION_LIMIT = 400;
  const canSave = !!listId && (link.trim().length > 0 || name.trim().length > 0) && quantity > 0 && !saving && (link.trim().length === 0 || isUrlValid);

  const validateUrl = (value: string) => {
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    return urlPattern.test(value.trim());
  };

  const handleAddGift = () => setShowSheet(true);
  const closeSheet = () => setShowSheet(false);
  const incQty = useCallback(() => setQuantity((q) => Math.min(99, q + 1)), []);
  const decQty = useCallback(() => setQuantity((q) => Math.max(1, q - 1)), []);
  const resetForm = () => {
    setLink("");
    setSearch("");
    setQuantity(1);
    setPrice("");
    setName("");
    setDescription("");
    setImageUrl(null);
    setScrapeError(null);
  };
  const handleCancel = () => {
    closeSheet();
    resetForm();
  };
  const createItem = useMutation(api.products.createListItem as any);
  const handleSave = async () => {
    if (!canSave || !listId) return;
    try {
      setSaving(true);
      await createItem({
        list_id: listId as any,
        name: name || link, // fallback
        description: description || null,
        image_url: imageUrl || null,
        quantity,
        price: price || null,
        currency: "AED",
        buy_url: link || null,
      });
    } catch (e) {
      console.warn("Failed to save gift", e);
    } finally {
      setSaving(false);
      closeSheet();
      resetForm();
    }
  };

  const openSearchBrowser = () => {
    // On web, use the link input value; on mobile, use the search field
    const searchQuery = Platform.OS === "web" ? link.trim() : search.trim();
    if (!searchQuery) return;

    const q = encodeURIComponent(searchQuery);
    const url = `https://www.google.com/search?q=${q}&tbm=shop`;

    if (Platform.OS === "web" && typeof window !== "undefined") {
      // On web, open in a new tab
      window.open(url, "_blank");
    } else {
      // On mobile, use WebView modal
      setBrowserUrl(url);
      setCurrentBrowserUrl(url);
      // Hide sheet while browsing
      setShowSheet(false);
      setShowBrowser(true);
    }
  };

  const handleBrowserAdd = async () => {
    if (!currentBrowserUrl) return;
    // Set link field then trigger scrape (will auto-scrape due to effect)
    setLink(currentBrowserUrl);
    setShowBrowser(false);
    // Reopen sheet so user can confirm/edit
    setTimeout(() => setShowSheet(true), 60);
  };

  // Handle cover photo upload
  const handleCoverPhotoUpload = async () => {
    try {
      console.log("[CoverUpload] Starting image picker...");
      setCoverUploadError(null);

      if (isUploadingCover) {
        console.log("[CoverUpload] Already uploading, skipping");
        return;
      }

      // Request permissions for mobile
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          setCoverUploadError("Permission denied to access photos");
          return;
        }
      }

      // Launch image picker
      console.log("[CoverUpload] Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: Platform.OS !== "web",
        aspect: Platform.OS !== "web" ? [16, 9] : undefined,
        quality: 0.9,
      });

      console.log("[CoverUpload] Image picker result:", result);

      if (result.canceled) {
        console.log("[CoverUpload] User canceled");
        return;
      }

      const asset = result.assets?.[0];
      console.log("[CoverUpload] Selected asset:", asset);

      if (!asset?.uri) {
        console.error("[CoverUpload] No asset URI found");
        setCoverUploadError("Failed to get image. Please try again.");
        return;
      }

      const uri = asset.uri;
      const mime = asset.mimeType ?? "";
      const ext = uri.split(".").pop()?.toLowerCase();
      console.log("[CoverUpload] URI:", uri, "MIME:", mime, "EXT:", ext);

      // Validate file type using MIME type and extension
      const isValidType = mime.startsWith("image/jpeg") || mime.startsWith("image/png") || ext === "jpg" || ext === "jpeg" || ext === "png";

      if (!isValidType) {
        console.error("[CoverUpload] Invalid file type");
        setCoverUploadError("Only JPG and PNG images are supported");
        return;
      }

      // Validate file size (4MB max)
      const sizeBytes = asset.fileSize;
      console.log("[CoverUpload] File size:", sizeBytes);
      if (typeof sizeBytes === "number" && sizeBytes > 4 * 1024 * 1024) {
        console.error("[CoverUpload] File too large");
        setCoverUploadError("Image must be less than 4MB");
        return;
      }

      // Start upload
      console.log("[CoverUpload] Starting upload process...");
      setIsUploadingCover(true);

      // Generate upload URL from Convex
      console.log("[CoverUpload] Generating upload URL...");
      const uploadUrl = await generateCoverUploadUrl();
      console.log("[CoverUpload] Upload URL:", uploadUrl);

      if (typeof uploadUrl !== "string" || uploadUrl.length === 0) {
        throw new Error("Failed to get upload URL");
      }

      // Upload file to Convex storage
      let storageId: string | undefined;

      if (Platform.OS === "web") {
        // Web platform: use fetch with blob
        console.log("[CoverUpload] Web platform detected, processing blob...");
        let blob: Blob;

        // Check if we have a File object directly
        if (asset && "file" in asset && asset.file instanceof File) {
          console.log("[CoverUpload] Using File object directly");
          blob = asset.file;
        } else if (uri.startsWith("blob:")) {
          console.log("[CoverUpload] Fetching blob URL...");
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error(`Failed to fetch blob: ${response.status}`);
          }
          blob = await response.blob();
          console.log("[CoverUpload] Blob fetched, size:", blob.size);
        } else if (uri.startsWith("data:")) {
          console.log("[CoverUpload] Converting data URL to blob...");
          const response = await fetch(uri);
          blob = await response.blob();
          console.log("[CoverUpload] Blob created, size:", blob.size);
        } else {
          console.log("[CoverUpload] Fetching as regular URL...");
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }
          blob = await response.blob();
          console.log("[CoverUpload] Blob fetched, size:", blob.size);
        }

        console.log("[CoverUpload] Uploading blob to:", uploadUrl);
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: blob,
          headers: {
            "Content-Type": mime && mime.length > 0 ? mime : "application/octet-stream",
          },
        });

        console.log("[CoverUpload] Upload response status:", uploadResponse.status);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text().catch(() => "");
          console.error("[CoverUpload] Upload failed:", uploadResponse.status, errorText);
          throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
        }

        try {
          const parsed = await uploadResponse.json();
          console.log("[CoverUpload] Upload response:", parsed);
          storageId = parsed?.storageId;
        } catch (parseError) {
          console.error("[CoverUpload] Failed to parse upload response", parseError);
          const responseText = await uploadResponse.text().catch(() => "");
          console.error("[CoverUpload] Response body:", responseText);
          throw new Error("Unexpected response from upload service");
        }
      } else {
        // Native platforms: use FileSystem
        console.log("[CoverUpload] Native platform detected, using FileSystem...");
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, uri, {
          httpMethod: "POST",
          headers: {
            "Content-Type": mime && mime.length > 0 ? mime : "application/octet-stream",
          },
        });

        console.log("[CoverUpload] Upload result status:", uploadResult.status);

        if (uploadResult.status !== 200) {
          throw new Error(`Upload failed with status ${uploadResult.status}`);
        }

        try {
          const parsed = JSON.parse(uploadResult.body ?? "{}");
          console.log("[CoverUpload] Upload response:", parsed);
          storageId = parsed?.storageId;
        } catch (parseError) {
          console.error("[CoverUpload] Failed to parse upload response", parseError);
          throw new Error("Unexpected response from upload service");
        }
      }

      if (!storageId) {
        console.error("[CoverUpload] No storageId returned");
        throw new Error("No storageId returned from upload");
      }

      // Get the permanent URL
      console.log("[CoverUpload] Getting public URL for storageId:", storageId);
      const publicUrl = await getCoverUrl({ storageId } as any);
      console.log("[CoverUpload] Public URL:", publicUrl);

      // Update list with new cover photo
      if (listId) {
        await updateListDetails({
          listId: listId as any,
          title: list?.title || "Your List",
          coverPhotoUri: publicUrl,
          coverPhotoStorageId: storageId,
        });
      }

      console.log("[CoverUpload] Upload completed successfully!");

      // Close modal
      setShowCoverUploadModal(false);
      setIsUploadingCover(false);
      setCoverUploadError(null);
    } catch (error) {
      console.error("[CoverUpload] Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[CoverUpload] Error message:", errorMessage);
      setCoverUploadError(`Failed to upload: ${errorMessage}`);
      setIsUploadingCover(false);
    }
  };

  // Handle gift item image upload
  const handleGiftImageUpload = async () => {
    try {
      console.log("[GiftImageUpload] Starting image picker...");
      setGiftImageUploadError(null);

      if (isUploadingGiftImage) {
        console.log("[GiftImageUpload] Already uploading, skipping");
        return;
      }

      // Request permissions for mobile
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          setGiftImageUploadError("Permission denied to access photos");
          Alert.alert("Permission Required", "Please grant access to your photo library to upload images.");
          return;
        }
      }

      // Launch image picker
      console.log("[GiftImageUpload] Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.9,
      });

      console.log("[GiftImageUpload] Image picker result:", result);

      if (result.canceled) {
        console.log("[GiftImageUpload] User canceled");
        return;
      }

      const asset = result.assets?.[0];
      console.log("[GiftImageUpload] Selected asset:", asset);

      if (!asset?.uri) {
        console.error("[GiftImageUpload] No asset URI found");
        setGiftImageUploadError("Failed to get image. Please try again.");
        return;
      }

      const uri = asset.uri;
      const mime = asset.mimeType ?? "";
      const ext = uri.split(".").pop()?.toLowerCase();
      console.log("[GiftImageUpload] URI:", uri, "MIME:", mime, "EXT:", ext);

      // Validate file type
      const isValidType = mime.startsWith("image/jpeg") || mime.startsWith("image/png") || ext === "jpg" || ext === "jpeg" || ext === "png";

      if (!isValidType) {
        console.error("[GiftImageUpload] Invalid file type");
        setGiftImageUploadError("Only JPG and PNG images are supported");
        Alert.alert("Invalid File Type", "Only JPG and PNG images are supported");
        return;
      }

      // Validate file size (4MB max)
      const sizeBytes = asset.fileSize;
      console.log("[GiftImageUpload] File size:", sizeBytes);
      if (typeof sizeBytes === "number" && sizeBytes > 4 * 1024 * 1024) {
        console.error("[GiftImageUpload] File too large");
        setGiftImageUploadError("Image must be less than 4MB");
        Alert.alert("File Too Large", "Image must be less than 4MB");
        return;
      }

      // Start upload
      console.log("[GiftImageUpload] Starting upload process...");
      setIsUploadingGiftImage(true);

      // Generate upload URL from Convex
      console.log("[GiftImageUpload] Generating upload URL...");
      const uploadUrl = await generateCoverUploadUrl();
      console.log("[GiftImageUpload] Upload URL:", uploadUrl);

      if (typeof uploadUrl !== "string" || uploadUrl.length === 0) {
        throw new Error("Failed to get upload URL");
      }

      // Upload file to Convex storage
      let storageId: string | undefined;

      if (Platform.OS === "web") {
        // Web platform: use fetch with blob
        console.log("[GiftImageUpload] Web platform detected, processing blob...");
        let blob: Blob;

        if (asset && "file" in asset && asset.file instanceof File) {
          console.log("[GiftImageUpload] Using File object directly");
          blob = asset.file;
        } else if (uri.startsWith("blob:")) {
          console.log("[GiftImageUpload] Fetching blob URL...");
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error(`Failed to fetch blob: ${response.status}`);
          }
          blob = await response.blob();
          console.log("[GiftImageUpload] Blob fetched, size:", blob.size);
        } else if (uri.startsWith("data:")) {
          console.log("[GiftImageUpload] Converting data URL to blob...");
          const response = await fetch(uri);
          blob = await response.blob();
          console.log("[GiftImageUpload] Blob created, size:", blob.size);
        } else {
          console.log("[GiftImageUpload] Fetching as regular URL...");
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }
          blob = await response.blob();
          console.log("[GiftImageUpload] Blob fetched, size:", blob.size);
        }

        console.log("[GiftImageUpload] Uploading blob to:", uploadUrl);
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: blob,
          headers: {
            "Content-Type": mime && mime.length > 0 ? mime : "application/octet-stream",
          },
        });

        console.log("[GiftImageUpload] Upload response status:", uploadResponse.status);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text().catch(() => "");
          console.error("[GiftImageUpload] Upload failed:", uploadResponse.status, errorText);
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        try {
          const parsed = await uploadResponse.json();
          console.log("[GiftImageUpload] Upload response:", parsed);
          storageId = parsed?.storageId;
        } catch (parseError) {
          console.error("[GiftImageUpload] Failed to parse upload response", parseError);
          throw new Error("Unexpected response from upload service");
        }
      } else {
        // Native platforms: use FileSystem
        console.log("[GiftImageUpload] Native platform detected, using FileSystem...");
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, uri, {
          httpMethod: "POST",
          headers: {
            "Content-Type": mime && mime.length > 0 ? mime : "application/octet-stream",
          },
        });

        console.log("[GiftImageUpload] Upload result status:", uploadResult.status);

        if (uploadResult.status !== 200) {
          throw new Error(`Upload failed with status ${uploadResult.status}`);
        }

        try {
          const parsed = JSON.parse(uploadResult.body ?? "{}");
          console.log("[GiftImageUpload] Upload response:", parsed);
          storageId = parsed?.storageId;
        } catch (parseError) {
          console.error("[GiftImageUpload] Failed to parse upload response", parseError);
          throw new Error("Unexpected response from upload service");
        }
      }

      if (!storageId) {
        console.error("[GiftImageUpload] No storageId returned");
        throw new Error("No storageId returned from upload");
      }

      // Get the permanent URL
      console.log("[GiftImageUpload] Getting public URL for storageId:", storageId);
      const publicUrl = await getCoverUrl({ storageId } as any);
      console.log("[GiftImageUpload] Public URL:", publicUrl);

      // Update the imageUrl state with the uploaded image
      setImageUrl(publicUrl);
      console.log("[GiftImageUpload] Upload completed successfully!");

      setIsUploadingGiftImage(false);
      setGiftImageUploadError(null);
    } catch (error) {
      console.error("[GiftImageUpload] Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[GiftImageUpload] Error message:", errorMessage);
      setGiftImageUploadError(`Failed to upload: ${errorMessage}`);
      Alert.alert("Upload Failed", `Failed to upload image: ${errorMessage}`);
      setIsUploadingGiftImage(false);
    }
  };

  // Scrape on link change (debounced)
  useEffect(() => {
    if (!link || !/^https?:\/\//i.test(link)) return; // not a full URL yet
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        setScraping(true);
        setScrapeError(null);
        console.log("Scraping URL:", link);
        const meta = await scrape({ url: link });
        console.log("Scrape result:", JSON.stringify(meta, null, 2));
        if (cancelled) return;
        if (meta.ok) {
          if (!name && meta.title) {
            // Clean title by removing common e-commerce site prefixes
            let cleanTitle = meta.title
              .replace(/^amazon\.com\s*:\s*/i, "")
              .replace(/^amazon\s*:\s*/i, "")
              .replace(/^ebay\s*:\s*/i, "")
              .replace(/^walmart\.com\s*:\s*/i, "")
              .replace(/^target\.com\s*:\s*/i, "")
              .trim();
            setName(cleanTitle);
          }
          if (!price && meta.price) setPrice(meta.price);
          if (meta.image) {
            console.log("Setting image URL:", meta.image);
            setImageUrl(meta.image);
          } else {
            console.log("No image in scrape result");
          }
        } else {
          console.log("Scrape failed:", meta.error);
          setScrapeError(meta.error || "Could not extract data");
        }
      } catch (e: any) {
        console.error("Scrape exception:", e);
        if (!cancelled) setScrapeError(e.message);
      } finally {
        if (!cancelled) setScraping(false);
      }
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link]);

  const handleShare = async () => {
    try {
      if (!listId) return;
      let url = "";
      if (Platform.OS === "web" && typeof window !== "undefined") {
        const origin = window.location?.origin || "";
        const qs = `listId=${encodeURIComponent(String(listId))}`;
        url = `${origin}/view-list?${qs}`;
        // copy to clipboard
        await navigator.clipboard.writeText(url).catch(() => {});
      } else {
        url = Linking.createURL("view-list", {
          queryParams: { listId: String(listId) },
        });
      }

      await Share.share({ message: url, url });
    } catch (e) {
      console.warn("Share failed", e);
    }
  };

  const handleManageList = () => {
    if (!listId) return;
    router.push({
      pathname: "/manage-list",
      params: { listId: String(listId) },
    });
  };

  // Delete mutation for list items
  const deleteListItemMutation = useMutation(api.products.deleteListItem as any);
  // Replace Alert with DeleteConfirmation modal flow
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const onDelete = (itemId?: string) => {
    if (!itemId) return;
    // open confirmation modal
    setDeleteItemId(String(itemId));
  };

  const handleDeleteItem = async (itemId: string | null) => {
    if (!itemId) return;
    try {
      await deleteListItemMutation({ itemId: itemId as any });
    } catch (e) {
      console.warn("Failed to delete item", e);
      Alert.alert("Delete failed", "Could not delete the item. Please try again.");
    } finally {
      setDeleteItemId(null);
    }
  };

  const loading = !list; // simple loading flag

  const title = list?.title ?? "Your List";
  const subtitle = list?.note ?? "";
  const coverUri = list?.coverPhotoUri as string | undefined;
  const privacy = list?.privacy ?? "private";
  const shares = useQuery(api.products.getListShares as any, listId ? ({ list_id: listId } as any) : "skip");
  const shareCount = Array.isArray(shares) ? shares.length : undefined;
  const address = (list?.shippingAddress as string | undefined) ?? null;
  const ribbonSubtitle = subtitle || formattedEventDate || "";
  const occasion = list?.occasion || "";

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

  const handleSelectDelete = (listId: string) => setDeleteListId(listId);

  const handleDeleteList = async (listId: string | null) => {
    await deleteList({ listId: listId as any });
    setDeleteListId(null);
    router.replace("/");
  };

  const onSelectManageListDropdown = (action: string) => {
    if (action === "archive") {
      handleArchiveList(listId ? String(listId) : null, !(list?.isArchived || false));
    }
    if (action === "unArchive") {
      handleArchiveList(listId ? String(listId) : null, !(list?.isArchived || false));
    } else if (action === "duplicateList") {
      handleDuplicateList(list);
    } else if (action === "editList") {
      router.push({ pathname: "/create-list-step2", params: { listId: String(listId) } });
    } else if (action === "delete") {
      handleSelectDelete(listId ? String(listId) : "");
    }
  };
  // const creator = list?.creator || null;
  const layout = isDesktop ? (
    <DesktopLayout
      title={title}
      subtitle={subtitle}
      ribbonSubtitle={ribbonSubtitle}
      coverUri={coverUri}
      formattedEventDate={formattedEventDate}
      daysToGo={daysToGoText}
      totals={totals}
      totalItemsCount={giftItems.length}
      availability={availability}
      onAvailabilityChange={handleAvailabilityChange}
      sortBy={sortBy}
      onSelectSort={setSortBy}
      displayedItems={displayedItems}
      onAddGift={handleAddGift}
      onShare={handleShare}
      onManage={handleManageList}
      onChangeCover={() => setShowCoverUploadModal(true)}
      onOpenGift={handleOpenGift}
      privacy={privacy}
      shareCount={shareCount}
      loading={loading}
      address={address}
      lastUpdated={lastUpdatedLabel}
      occasion={occasion}
      onDelete={onDelete}
      onSelectManageListDropdown={onSelectManageListDropdown}
      isArchived={list?.isArchived || false}
    />
  ) : (
    <MobileLayout
      title={title}
      subtitle={ribbonSubtitle}
      coverUri={coverUri}
      overlayText={formattedEventDate}
      daysToGo={daysToGoText}
      displayedItems={displayedItems}
      onAddGift={handleAddGift}
      onOpenSortSheet={openSortSheet}
      listId={listIdString}
      onShare={handleShare}
      onManage={handleManageList}
      handleBack={handleBack}
      privacy={privacy}
      loading={loading}
      shareCount={shareCount}
      address={address}
      lastUpdated={lastUpdatedLabel}
      occasion={occasion}
      tempSortBy={tempSortBy}
      tempFilterClaimed={tempFilterClaimed}
      tempFilterUnclaimed={tempFilterUnclaimed}
      creator={list?.creator || null}
      onDelete={onDelete}
    />
  );

  return (
    <View style={isDesktop ? desktopStyles.container : styles.container}>
      {layout}
      {/** Bottom Sheet / Modal **/}
      {isDesktop ? (
        <>
          <Modal visible={showSheet} transparent animationType={isDesktop ? "fade" : "none"} onRequestClose={closeSheet}>
            <Pressable style={styles.backdrop} onPress={closeSheet} />
            <View style={desktopStyles.modalContainer}>
              <View style={desktopStyles.modalContent}>
                {/* Header */}
                <View style={desktopStyles.modalHeader}>
                  <Text style={desktopStyles.modalTitle}>Add a Gift</Text>
                  <Pressable onPress={closeSheet} style={desktopStyles.modalCloseButton}>
                    <Ionicons name="close" size={24} color="#8E8EA9" />
                  </Pressable>
                </View>

                <RNScrollView contentContainerStyle={desktopStyles.modalScrollContent} showsVerticalScrollIndicator={false}>
                  {/* Web Link Section */}
                  <View style={desktopStyles.modalFieldGroup}>
                    <Text style={desktopStyles.modalFieldLabel}>Web Link</Text>
                    <View style={desktopStyles.modalInputRow}>
                      <TextInput value={link} onChangeText={setLink} style={desktopStyles.modalInput} autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholder="Type, paste or search" placeholderTextColor="#8E8EA9" />
                      <Pressable onPress={openSearchBrowser} style={desktopStyles.modalSearchButton}>
                        <Text style={desktopStyles.modalSearchButtonText}>Search via</Text>
                        <View style={desktopStyles.googleLogo}>
                          <Text style={desktopStyles.googleG}>G</Text>
                        </View>
                      </Pressable>
                    </View>
                    {!isUrlValid && link.trim().length > 0 && <Text style={desktopStyles.modalErrorText}>Invalid URL</Text>}
                    {scrapeError && <Text style={desktopStyles.modalErrorText}>{"We couldn’t fetch details from this link. Try again, remove extra tracking from the URL, or add the gift manually"}</Text>}
                    {scraping && <Text style={desktopStyles.modalScrapingText}>Loading...</Text>}
                  </View>

                  {/* Product Image and Details Row */}
                  <View style={desktopStyles.modalProductRow}>
                    {/* Image Section */}
                    <View style={desktopStyles.modalImageContainer}>
                      {imageUrl ? (
                        <View style={desktopStyles.modalImageWrapper}>
                          <Image source={{ uri: imageUrl }} style={desktopStyles.modalProductImage} resizeMode="contain" />
                          {isUploadingGiftImage && (
                            <View style={desktopStyles.modalImageLoadingOverlay}>
                              <ActivityIndicator size="large" color="#3B0076" />
                            </View>
                          )}
                          <Pressable style={desktopStyles.modalImageEditButton} onPress={handleGiftImageUpload} disabled={isUploadingGiftImage}>
                            <Ionicons name="image-outline" size={20} color="#3B0076" />
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable style={desktopStyles.modalImagePlaceholder} onPress={handleGiftImageUpload} disabled={isUploadingGiftImage}>
                          {isUploadingGiftImage ? (
                            <ActivityIndicator size="large" color="#3B0076" />
                          ) : (
                            <>
                              <Ionicons name="image-outline" size={48} color="#D1D1D6" />
                              <Text style={desktopStyles.modalImagePlaceholderText}>Click to upload image</Text>
                            </>
                          )}
                        </Pressable>
                      )}
                      {giftImageUploadError && <Text style={desktopStyles.modalErrorText}>{giftImageUploadError}</Text>}
                    </View>

                    {/* Price and Quantity Section */}
                    <View style={desktopStyles.modalPriceQtyColumn}>
                      <View style={desktopStyles.modalFieldGroup}>
                        <Text style={desktopStyles.modalFieldLabel}>Price of gift</Text>
                        <TextInput value={price} onChangeText={setPrice} style={desktopStyles.modalPriceInput} keyboardType="decimal-pad" placeholder="AED 0.00" placeholderTextColor="#8E8EA9" />
                      </View>
                      <View style={desktopStyles.modalFieldGroup}>
                        <Text style={desktopStyles.modalFieldLabel}>Quantity</Text>
                        <View style={desktopStyles.modalQtyRow}>
                          <Pressable onPress={decQty} style={desktopStyles.modalQtyButton}>
                            <Text style={desktopStyles.modalQtyButtonText}>–</Text>
                          </Pressable>
                          <Text style={desktopStyles.modalQtyValue}>{String(quantity).padStart(2, "0")}</Text>
                          <Pressable onPress={incQty} style={desktopStyles.modalQtyButton}>
                            <Text style={desktopStyles.modalQtyButtonText}>+</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Name of Gift */}
                  <View style={desktopStyles.modalFieldGroup}>
                    <Text style={desktopStyles.modalFieldLabel}>Name of Gift</Text>
                    <View style={desktopStyles.modalInputRow}>
                      <TextInput value={name} onChangeText={setName} style={desktopStyles.modalInput} placeholder="Enter gift name" placeholderTextColor="#8E8EA9" />
                      <Ionicons name="pencil-outline" size={20} color="#AEAEB2" />
                    </View>
                  </View>

                  {/* Description */}
                  <View style={desktopStyles.modalFieldGroup}>
                    <Text style={desktopStyles.modalFieldLabel}>Description</Text>
                    <View style={desktopStyles.modalTextareaWrapper}>
                      <TextInput placeholder="Prefer color white, size medium etc" value={description} onChangeText={(t) => t.length <= DESCRIPTION_LIMIT && setDescription(t)} style={desktopStyles.modalTextarea} multiline placeholderTextColor="#8E8EA9" />
                      <Text style={desktopStyles.modalCharCount}>{description.length}/100</Text>
                    </View>
                  </View>
                </RNScrollView>

                {/* Footer Buttons */}
                <View style={desktopStyles.modalFooter}>
                  <Pressable style={desktopStyles.modalCancelButton} onPress={handleCancel}>
                    <Text style={desktopStyles.modalCancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[desktopStyles.modalSaveButton, !canSave && desktopStyles.modalSaveButtonDisabled]} onPress={handleSave} disabled={!canSave}>
                    <Text style={[desktopStyles.modalSaveButtonText, !canSave && desktopStyles.modalSaveButtonTextDisabled]}>{saving ? "Saving..." : "Save"}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : null}

      {!isDesktop ? (
        <>
          <BottomSheet isVisible={showSheet} onClose={closeSheet}>
            <ScrollView
              contentContainerStyle={{
                ...styles.sheetContent,
                paddingHorizontal: 0,
                gap: 0,
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ padding: 16, gap: 20, backgroundColor: "#ffff" }}>
                <Text style={styles.sheetTitle}> Add a gift item</Text>

                <TextInputField label="Add a web link" value={link} onChangeText={setLink} icon={<Image source={require("@/assets/images/externalLink.png")} />} keyboardType="url" placeholder="https://" autoCapitalize="none" autoCorrect={false} error={[...(!isUrlValid && link.trim().length > 0 ? ["Invalid URL"] : []), ...(scrapeError ? [String("We couldn’t fetch details from this link. Try again, remove extra tracking from the URL, or add the gift manually")] : [])]} />
                {imageUrl ? (
                  <View style={{ height: 343, width: "100%", borderRadius: 8, borderWidth: 1, borderColor: "#D1D1D6", justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
                    <View style={{ width: "100%", height: "100%", position: "relative", justifyContent: "center", alignItems: "center" }}>
                      <Pressable style={{ position: "absolute", top: 8, right: 8, zIndex: 10, backgroundColor: "#FFFFFF", padding: 6, borderRadius: 20 }} onPress={handleGiftImageUpload} disabled={isUploadingGiftImage}>
                        <Image source={require("@/assets/images/addImage.png")} />
                      </Pressable>
                      <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%", borderRadius: 8 }} resizeMode="contain" />
                    </View>
                  </View>
                ) : null}
                <View style={styles.orDivider}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.orLine} />
                </View>

                <TextInputField
                  label="Search via Google"
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search products"
                  icon={
                    <Pressable onPress={openSearchBrowser}>
                      <Image source={require("@/assets/images/googleIcon.png")} />
                    </Pressable>
                  }
                />
              </View>
              <View style={{ padding: 16, paddingTop: 24, gap: 30 }}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Desired quantity</Text>
                  <View style={styles.qtyRow}>
                    <Pressable onPress={decQty} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>–</Text>
                    </Pressable>
                    <Text style={styles.qtyValue}>{String(quantity).padStart(2, "0")}</Text>
                    <Pressable onPress={incQty} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </Pressable>
                  </View>
                </View>
                <TextInputField label="Price of gift" value={price} onChangeText={setPrice} keyboardType="decimal-pad" inputLabelContainerStyle={{ backgroundColor: "#F2F2F7" }} />

                <TextInputField label="Name of gift" value={name} onChangeText={setName} inputLabelContainerStyle={{ backgroundColor: "#F2F2F7" }} icon={<Image source={require("@/assets/images/Edit.png")} />} />

                <TextInputAreaField label="Description (optional)" placeholder="Prefer white, size M." value={description} onChangeText={(t) => t.length <= DESCRIPTION_LIMIT && setDescription(t)} inputLabelContainerStyle={{ backgroundColor: "#F2F2F7" }} descriptionLimit={DESCRIPTION_LIMIT} />
                <Pressable style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]} onPress={handleSave} disabled={!canSave}>
                  <Text style={[styles.saveBtnText, !canSave && styles.saveBtnTextDisabled]}>{saving ? "Saving..." : "Save"}</Text>
                </Pressable>
                <Pressable style={styles.cancelBtn} onPress={handleCancel}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </BottomSheet>
        </>
      ) : null}

      {/* Delete confirmation modal for item deletion */}
      <DeleteConfirmation visible={!!deleteItemId} onCancel={() => setDeleteItemId(null)} onDelete={() => handleDeleteItem(deleteItemId)} />

      {/* Cover Photo Upload Modal */}
      {isDesktop && (
        <Modal visible={showCoverUploadModal} transparent animationType="fade" onRequestClose={() => !isUploadingCover && setShowCoverUploadModal(false)}>
          <Pressable style={desktopStyles.uploadBackdrop} onPress={() => !isUploadingCover && setShowCoverUploadModal(false)}>
            <Pressable style={desktopStyles.uploadModalCard} onPress={(e) => e.stopPropagation()}>
              <View style={desktopStyles.uploadModalHeader}>
                <Text style={desktopStyles.uploadModalTitle}>{coverUri ? "Change Cover Photo" : "Upload Cover Photo"}</Text>
                <Pressable onPress={() => !isUploadingCover && setShowCoverUploadModal(false)} disabled={isUploadingCover}>
                  <Ionicons name="close" size={24} color="#8E8E93" />
                </Pressable>
              </View>

              {/* Image Preview or Upload Zone */}
              <View style={desktopStyles.uploadContent}>
                {coverUri ? (
                  <View style={desktopStyles.uploadPreviewContainer}>
                    <Image source={{ uri: coverUri }} style={desktopStyles.uploadPreviewImage} resizeMode="cover" />
                  </View>
                ) : (
                  <Pressable style={[desktopStyles.uploadZone, isUploadingCover && desktopStyles.uploadZoneDisabled]} onPress={handleCoverPhotoUpload} disabled={isUploadingCover}>
                    {isUploadingCover ? (
                      <ActivityIndicator size="large" color="#3B0076" />
                    ) : (
                      <>
                        <Ionicons name="cloud-upload-outline" size={48} color="#3B0076" />
                        <Text style={desktopStyles.uploadZoneTitle}>Drag and drop your files here</Text>
                        <Text style={desktopStyles.uploadZoneSubtitle}>Maximum file size: 4MB. Only JPG, JPEG and PNG with a ratio of 16:9</Text>
                        {/* <Pressable style={desktopStyles.browseButton}>
                          <Text style={desktopStyles.browseButtonText}>
                            Browse Files
                          </Text>
                        </Pressable> */}
                      </>
                    )}
                  </Pressable>
                )}

                {/* Error Message */}
                {coverUploadError && <Text style={desktopStyles.uploadErrorText}>{coverUploadError}</Text>}

                {/* Supported Formats */}
                <Text style={desktopStyles.uploadSupportedFormats}>Supported file formats: JPEG, PNG. Max size: 4MB. Only JPG, JPEG and PNG with a ratio of 16:9</Text>
              </View>

              {/* Action Buttons */}
              <View style={desktopStyles.uploadModalFooter}>
                {/* <Pressable
                  style={desktopStyles.uploadCancelButton}
                  onPress={() => !isUploadingCover && setShowCoverUploadModal(false)}
                  disabled={isUploadingCover}
                >
                  <Text style={desktopStyles.uploadCancelButtonText}>
                    Cancel
                  </Text>
                </Pressable> */}
                <Pressable style={[desktopStyles.uploadSubmitButton, isUploadingCover && desktopStyles.uploadSubmitButtonDisabled]} onPress={handleCoverPhotoUpload} disabled={isUploadingCover}>
                  <Text style={desktopStyles.uploadSubmitButtonText}>{isUploadingCover ? "Uploading..." : coverUri ? "Change Photo" : "Upload"}</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* Product search browser modal */}
      <Modal visible={showBrowser} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setShowBrowser(false)}>
        <LinearGradient colors={["#330065", "#45018ad7"]} locations={[0, 0.7]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 2 }}>
          <View style={[styles.browserHeader, { backgroundColor: "transparent", height: 80 }]}>
            <View style={[styles.navigation, { paddingBottom: 16 }]}>
              <Pressable
                onPress={() => {
                  setShowBrowser(false);
                  setTimeout(() => setShowSheet(true), 60);
                }}
                style={styles.backButton}
              >
                <Image source={require("@/assets/images/backArrow.png")} />
              </Pressable>
              <Text style={styles.headerTitle}>Search via Google</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.browserModalContainer}>
          {browserUrl && <WebView source={{ uri: browserUrl }} onNavigationStateChange={(nav) => setCurrentBrowserUrl(nav.url)} startInLoadingState style={styles.webview} />}
          <SafeAreaView edges={["bottom"]} style={styles.browserActionBarWrapper}>
            <Pressable style={styles.browserActionBar} onPress={handleBrowserAdd}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.browserActionBarText}>Add Product</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </Modal>
      {/* Sort & Filter Bottom Sheet (designed) */}
      <BottomSheet isVisible={showSortSheet} onClose={() => setShowSortSheet(false)}>
        <ScrollView contentContainerStyle={styles.sortSheetContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sortSheetTitle}>Sort & Filter</Text>
          <View style={styles.sortDivider} />
          <View style={styles.sortSection}>
            <View style={styles.sortSectionHeader}>
              <Text style={styles.sortSectionTitle}>Sort by</Text>
              <Ionicons name="chevron-down" size={20} color="#1C0335" />
            </View>
            {[
              { key: "default", label: "Default" },
              { key: "priceAsc", label: "Price Lowest - Highest" },
              { key: "priceDesc", label: "Price Highest - Lowest" },
              { key: "newest", label: "Most Recent to Oldest" },
              { key: "oldest", label: "Oldest to Most Recent" },
            ].map((o) => (
              <Pressable key={o.key} style={styles.radioRow} onPress={() => setTempSortBy(o.key as SortOption)}>
                <View style={[styles.radioOuter, tempSortBy === o.key && styles.radioOuterActive]}>{tempSortBy === o.key && <View style={styles.radioInner} />}</View>
                <Text style={styles.radioLabel}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.sortSection}>
            <View style={styles.sortSectionHeader}>
              <Text style={styles.sortSectionTitle}>Filter by Availability</Text>
              <Ionicons name="chevron-down" size={20} color="#1C0335" />
            </View>
            <Pressable style={styles.radioRow} onPress={() => setTempFilterClaimed((v) => !v)}>
              <View style={[styles.checkboxBox, tempFilterClaimed && styles.checkboxBoxActive]}>{tempFilterClaimed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}</View>
              <Text style={styles.radioLabel}>Claimed</Text>
            </Pressable>
            <Pressable style={styles.radioRow} onPress={() => setTempFilterUnclaimed((v) => !v)}>
              <View style={[styles.checkboxBox, tempFilterUnclaimed && styles.checkboxBoxActive]}>{tempFilterUnclaimed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}</View>
              <Text style={styles.radioLabel}>Unclaimed</Text>
            </Pressable>
          </View>
          <View style={styles.sortScrollSpacer} />
        </ScrollView>
        <View style={styles.applyBarWrapper}>
          <Pressable
            style={styles.applyBtnFull}
            onPress={() => {
              setSortBy(tempSortBy);
              setFilterClaimed(tempFilterClaimed);
              setFilterUnclaimed(tempFilterUnclaimed);
              setShowSortSheet(false);
            }}
          >
            <Text style={styles.applyBtnText}>Apply</Text>
          </Pressable>
        </View>
      </BottomSheet>

      <DeleteConfirmation visible={!!deleteListId} onCancel={() => setDeleteListId(null)} onDelete={() => handleDeleteList(deleteListId)} />
    </View>
  );
}

type Totals = {
  totalItems: number;
  totalQuantity: number;
  fullyClaimed: number;
  claimedCount: number;
  unclaimedCount: number;
  claimedUnits: number;
};

type MobileLayoutProps = {
  title: string;
  subtitle: string;
  coverUri?: string;
  overlayText: string;
  displayedItems: GiftItemType[];
  onAddGift: () => void;
  onOpenSortSheet: () => void;
  listId?: string;
  onShare: () => void;
  onManage: () => void;
  handleBack: () => void;
  privacy: string;
  loading: boolean;
  shareCount?: number;
  address?: string | null;
  lastUpdated: string;
  occasion?: string;
  tempSortBy?: string;
  tempFilterClaimed?: boolean;
  tempFilterUnclaimed?: boolean;
  daysToGo: string | null;
  creator?: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    contactEmail?: string;
  } | null;
  onDelete: (itemId: string) => void;
};

function MobileLayout({ title, subtitle, coverUri, overlayText, displayedItems, onAddGift, onOpenSortSheet, listId, onShare, onManage, handleBack, privacy, loading, shareCount, address, lastUpdated, occasion, tempSortBy, tempFilterClaimed, tempFilterUnclaimed, daysToGo, creator, onDelete }: MobileLayoutProps) {
  return (
    <>
      <HeaderBar title={title} onBack={handleBack} />
      <RNScrollView contentContainerStyle={styles.scrollContent}>
        <ListCover imageUri={coverUri} overlayText={String(daysToGo || "")} occasion={occasion} creator={creator} />

        <View style={styles.listInfoContainer}>
          <RibbonHeader occasion={occasion} title={title} subtitle={subtitle} />
        </View>

        <ActionsBar
          privacy={privacy}
          loading={loading}
          onFilterPress={onOpenSortSheet}
          address={address}
          shareCount={shareCount}
          onPressSettings={() =>
            listId &&
            router.push({
              pathname: "/create-list-step3",
              params: { listId: String(listId), isEdit: String(true) },
            })
          }
        />
        {displayedItems.length > 0 ? <SelectedFilter tempSortBy={String(tempSortBy)} tempFilterClaimed={Boolean(tempFilterClaimed)} tempFilterUnclaimed={Boolean(tempFilterUnclaimed)} /> : null}

        <View style={styles.addGiftSection}>
          {displayedItems.length > 0 ? (
            <>
              {displayedItems.map((item, index) => (
                <Fragment key={item._id}>
                  {index !== 0 ? <View style={styles.giftDivider} /> : null}
                  <GiftItemCard title={title} item={item} onDelete={onDelete} isOwner />
                </Fragment>
              ))}
              <Pressable style={styles.addMoreButton} onPress={onAddGift}>
                <Ionicons name="add" size={20} color="#3B0076" />
                <Text style={styles.addMoreButtonText}>Add more gifts</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.addYourFirstGift}>
              <Text style={styles.addGiftTitle}> Add your first gift item</Text>
              <Pressable style={styles.addGiftButton} onPress={onAddGift}>
                <Ionicons name="add" size={24} color="#3B0076" />
                <Text style={styles.addGiftButtonText}>Add a gift</Text>
              </Pressable>
            </View>
          )}
        </View>

        <InfoBox>
          To learn more on how to add gifts from web browser, <Text style={styles.linkText}>click here</Text>
        </InfoBox>
      </RNScrollView>

      <FooterBar lastUpdated={lastUpdated} onShare={onShare} onManage={onManage} />
    </>
  );
}

type DesktopLayoutProps = {
  title: string;
  subtitle: string;
  ribbonSubtitle: string;
  coverUri?: string;
  formattedEventDate: string;
  daysToGo: string | null;
  totals: Totals;
  totalItemsCount: number;
  availability: "all" | "claimed" | "unclaimed";
  onAvailabilityChange: (value: "all" | "claimed" | "unclaimed") => void;
  sortBy: SortOption;
  onSelectSort: (value: SortOption) => void;
  displayedItems: GiftItemType[];
  onAddGift: () => void;
  onShare: () => void;
  onManage: () => void;
  onChangeCover: () => void;
  onOpenGift: (item: GiftItemType) => void;
  privacy: string;
  shareCount?: number;
  loading: boolean;
  address?: string | null;
  lastUpdated: string;
  occasion?: string;
  onDelete: (itemId: string) => void;
  onSelectManageListDropdown: (action: string) => void;
  isArchived?: boolean;
};

function DesktopLayout({ title, subtitle, ribbonSubtitle, coverUri, formattedEventDate, daysToGo, totals, totalItemsCount, availability, onAvailabilityChange, sortBy, onSelectSort, displayedItems, onAddGift, onShare, onManage, onChangeCover, onOpenGift, privacy, shareCount, loading, address, lastUpdated, occasion, onDelete, onSelectManageListDropdown, isArchived }: DesktopLayoutProps) {
  const privacyDisplay = getPrivacyDisplay(privacy, loading, shareCount);
  const availabilityOptions: {
    value: "all" | "claimed" | "unclaimed";
    label: string;
  }[] = [
    { value: "all", label: "All" },
    { value: "claimed", label: "Claimed" },
    { value: "unclaimed", label: "Unclaimed" },
  ];
  const [isShowDropDownMenu, setIsShowDropDownMenu] = React.useState(false);
  const availabilityLabel = availabilityOptions.find((opt) => opt.value === availability)?.label ?? "All";
  const sortLabel = SORT_OPTIONS.find((opt) => opt.key === sortBy)?.label ?? "Default";
  const visibilityText = React.useMemo(() => {
    if (loading) return "Loading privacy";
    if (privacy === "shared") {
      return (shareCount ?? 0) === 0 ? "Visible to Everyone" : "Visible to My People";
    }
    if (privacy === "public") return "Visible to Everyone";
    return "Only Me";
  }, [loading, privacy, shareCount]);
  const [showAvailabilityMenu, setShowAvailabilityMenu] = React.useState(false);
  const [showSortMenu, setShowSortMenu] = React.useState(false);

  const dropdownOptions = [
    ...[isArchived ? { id: "11", icon: require("@/assets/images/unarchiveList.png"), title: "Unarchive", action: "unArchive" } : { id: "1", icon: require("@/assets/images/archiveList.png"), title: "Archive", action: "archive" }],
    { id: "2", icon: require("@/assets/images/duplicateList.png"), title: "Duplicate List", action: "duplicateList" },
    { id: "3", icon: require("@/assets/images/Edit.png"), title: "Edit List", action: "editList" },
    { id: "4", icon: require("@/assets/images/deleteList.png"), title: "Delete", action: "delete" },
  ];
  return (
    <SafeAreaView style={desktopStyles.safeArea} edges={Platform.OS === "web" ? [] : ["top"]}>
      <StatusBar barStyle="dark-content" />
      <RNScrollView contentContainerStyle={desktopStyles.scrollContent}>
        <View style={desktopStyles.maxWidth}>
          <View style={desktopStyles.topBar}>
            <Text style={desktopStyles.breadcrumbText}>
              Home / My List / <Text style={desktopStyles.breadcrumbCurrent}>{title}</Text>
            </Text>
            <View style={desktopStyles.topActions}>
              <View style={{ position: "relative", zIndex: 100 }}>
                <Pressable style={[desktopStyles.manageButton, { shadowOffset: { width: 0, height: 0 }, gap: 10, borderWidth: 2, borderColor: "#330065", borderRadius: 8, paddingHorizontal: 24, paddingVertical: 8, height: 48 }]} onPress={() => setIsShowDropDownMenu((prev) => !prev)}>
                  <Text style={desktopStyles.manageButtonText}>Manage List</Text>
                  <Ionicons name="caret-down" size={18} color="#3B0076" />
                </Pressable>
                {isShowDropDownMenu && (
                  <View style={{ padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 12, borderRadius: 8, top: "100%", left: 0, marginTop: 8, zIndex: 9999, position: "absolute", width: 287, minHeight: 200, backgroundColor: "#ffff" }}>
                    <Text style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}>Manage List</Text>
                    <View style={{ rowGap: 12, marginTop: 8 }}>
                      {dropdownOptions.map((option) => (
                        <Pressable
                          key={option.id}
                          style={({ hovered }: { hovered?: boolean }) => ({
                            backgroundColor: hovered ? "#EFEFEF" : "transparent",
                            borderRadius: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 13,
                            padding: 4,
                          })}
                          onPress={() => {
                            setIsShowDropDownMenu(false);
                            onSelectManageListDropdown(option.action);
                          }}
                        >
                          <View style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 8, backgroundColor: "#EFEFEF" }}>
                            <Image source={option.icon} resizeMode="contain" style={{ width: 16, height: 16 }} />
                          </View>
                          <View>
                            <Text style={{ fontSize: 16, fontFamily: "Nunito_600SemiBold", color: option?.title === "Delete" ? "#FF3B30" : "#000000" }}>{option.title}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
              </View>
              <Pressable style={[desktopStyles.addButton, { shadowOffset: { width: 0, height: 0 }, gap: 10, backgroundColor: "#330065", borderRadius: 8, paddingHorizontal: 24, paddingVertical: 8, height: 48 }]} onPress={onAddGift}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={[{ ...desktopStyles.addButtonText }, { color: "#FFFFFF" }]}>Add a Gift</Text>
              </Pressable>
              <Pressable style={[desktopStyles.addButton, { shadowOffset: { width: 0, height: 0 }, gap: 10, backgroundColor: "#330065", borderRadius: 8, paddingHorizontal: 24, paddingVertical: 8, height: 48 }]} onPress={onShare}>
                <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
                <Text style={[{ ...desktopStyles.addButtonText }, { color: "#FFFFFF" }]}>Share list</Text>
              </Pressable>
            </View>
          </View>

          <View style={desktopStyles.heroCardWrapper}>
            <View style={[desktopStyles.heroCard, { height: 260, borderRadius: 8, overflow: "hidden" }]}>
              <Image source={coverUri ? { uri: coverUri } : FALLBACK_COVER} style={[desktopStyles.heroImage, { height: "100%", borderRadius: 0 }]} resizeMode="cover" />
              <View style={desktopStyles.heroOverlay}>
                <Pressable style={desktopStyles.changeCoverButton} onPress={onChangeCover}>
                  <Text style={desktopStyles.changeCoverText}>Change cover photo</Text>
                </Pressable>
              </View>
            </View>
            <View style={desktopStyles.ribbonContainer}>
              <RibbonHeader occasion={occasion} title={title} subtitle={[ribbonSubtitle, daysToGo].filter(Boolean).join(" - ")} />
            </View>
          </View>

          {/* Gift Stats Cards */}
          <View style={desktopStyles.statsRow}>
            <LinearGradient colors={["#3B0076", "#5A00B8"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={desktopStyles.statCard}>
              <Text style={desktopStyles.statCardLabel}>Total Items</Text>
              <Text style={desktopStyles.statCardValue}>{totalItemsCount}</Text>
            </LinearGradient>
            <LinearGradient colors={["#1F6F4A", "#2A8F5F"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={desktopStyles.statCard}>
              <Text style={desktopStyles.statCardLabel}>All Claimed</Text>
              <Text style={desktopStyles.statCardValue}>{totals.fullyClaimed}</Text>
            </LinearGradient>
            <LinearGradient colors={["#F2994A", "#FFB366"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={desktopStyles.statCard}>
              <Text style={desktopStyles.statCardLabel}>Items Claimed</Text>
              <Text style={desktopStyles.statCardValue}>{totals.claimedCount}</Text>
            </LinearGradient>
            <LinearGradient colors={["#4D4D4D", "#666666"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={desktopStyles.statCard}>
              <Text style={desktopStyles.statCardLabel}>Items Unclaimed</Text>
              <Text style={desktopStyles.statCardValue}>{totals.unclaimedCount}</Text>
            </LinearGradient>
          </View>

          <View style={desktopStyles.controlsRow}>
            <Pressable style={desktopStyles.visibilityTrigger} onPress={onManage}>
              <Ionicons name={privacyDisplay.icon === "globe-outline" ? "eye-outline" : privacyDisplay.icon} size={18} color="#3B0076" />
              <Text style={desktopStyles.visibilityText}>{visibilityText}</Text>
              <Ionicons name="chevron-down" size={16} color="#3B0076" />
            </Pressable>

            <View style={desktopStyles.filterCluster}>
              <View style={desktopStyles.filterGroup}>
                <Text style={desktopStyles.filterLabel}>Availability:</Text>
                <Pressable style={desktopStyles.filterButton} onPress={() => setShowAvailabilityMenu(true)}>
                  <Text style={desktopStyles.filterButtonText}>{availabilityLabel}</Text>
                  <Ionicons name="chevron-down" size={14} color="#3B0076" />
                </Pressable>
              </View>
              <View style={desktopStyles.filterGroup}>
                <Text style={desktopStyles.filterLabel}>Sort</Text>
                <Pressable style={desktopStyles.filterButton} onPress={() => setShowSortMenu(true)}>
                  <Text style={desktopStyles.filterButtonText}>{sortLabel}</Text>
                  <Ionicons name="chevron-down" size={14} color="#3B0076" />
                </Pressable>
              </View>
            </View>

            <Pressable style={desktopStyles.shareLink} onPress={onShare}>
              <Ionicons name="share-social-outline" size={18} color="#3B0076" />
              <Text style={desktopStyles.shareLinkText}>Share List</Text>
            </Pressable>
          </View>

          <View style={desktopStyles.sectionDivider} />

          {!!address && (
            <View style={desktopStyles.addressNotice}>
              <Ionicons name="location-outline" size={18} color="#3B0076" />
              <Text style={desktopStyles.addressText} numberOfLines={1}>
                {address}
              </Text>
            </View>
          )}

          <View style={desktopStyles.listSummaryRow}>
            <View style={desktopStyles.listSummaryLeft}>
              <Text style={desktopStyles.listSummaryLabel}>Total items in list:</Text>
              <View style={desktopStyles.listSummaryBadge}>
                <Text style={desktopStyles.listSummaryBadgeText}>{totalItemsCount}</Text>
              </View>
            </View>
            {/* <Pressable style={desktopStyles.summaryShare} onPress={onShare}>
              <Text style={desktopStyles.summaryShareText}>Share List</Text>
              <Ionicons name="share-social-outline" size={16} color="#3B0076" />
            </Pressable> */}
          </View>

          <View style={desktopStyles.sectionDivider} />

          <View style={desktopStyles.itemsColumn}>
            {displayedItems.length > 0 ? (
              displayedItems.map((item, index) => <DesktopGiftItemRow key={item._id} item={item} onPress={onOpenGift} onDelete={onDelete} index={index} />)
            ) : (
              <View style={desktopStyles.emptyState}>
                <Text style={desktopStyles.emptyTitle}>No gifts yet</Text>
                <Text style={desktopStyles.emptySubtitle}>Start adding items to make this list shine.</Text>
                <Pressable style={desktopStyles.addButtonSecondary} onPress={onAddGift}>
                  <Ionicons name="add" size={18} color="#3B0076" />
                  <Text style={desktopStyles.addButtonSecondaryText}>Add a gift</Text>
                </Pressable>
              </View>
            )}
          </View>

          <Text style={desktopStyles.lastUpdated}>{lastUpdated}</Text>

          {displayedItems.length > 0 && (
            <Pressable
              style={{
                width: 626,
                height: 48,
                backgroundColor: "#330065",
                borderRadius: 8,
                margin: "auto",
                marginTop: 39,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={onAddGift}
            >
              <Ionicons name="add" size={18} color="#ffff" />
              <Text style={{ ...desktopStyles.shareLinkText, color: "#ffff" }}>Add more gifts</Text>
            </Pressable>
          )}
        </View>
      </RNScrollView>

      <Modal visible={showAvailabilityMenu} transparent animationType="fade" onRequestClose={() => setShowAvailabilityMenu(false)}>
        <Pressable style={desktopStyles.menuBackdrop} onPress={() => setShowAvailabilityMenu(false)}>
          <View style={desktopStyles.menuCard}>
            {availabilityOptions.map((option) => (
              <Pressable
                key={option.value}
                style={desktopStyles.menuRow}
                onPress={() => {
                  setShowAvailabilityMenu(false);
                  onAvailabilityChange(option.value);
                }}
              >
                <Text style={desktopStyles.menuLabel}>{option.label}</Text>
                {availability === option.value && <Ionicons name="checkmark" size={18} color="#3B0076" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showSortMenu} transparent animationType="fade" onRequestClose={() => setShowSortMenu(false)}>
        <Pressable style={desktopStyles.menuBackdrop} onPress={() => setShowSortMenu(false)}>
          <View style={desktopStyles.menuCard}>
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                style={desktopStyles.menuRow}
                onPress={() => {
                  setShowSortMenu(false);
                  onSelectSort(option.key);
                }}
              >
                <Text style={desktopStyles.menuLabel}>{option.label}</Text>
                {sortBy === option.key && <Ionicons name="checkmark" size={18} color="#3B0076" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

type DesktopGiftItemRowProps = {
  item: GiftItemType;
  onPress: (item: GiftItemType) => void;
  onDelete?: (itemId: string) => void;
  index: number;
};

function DesktopGiftItemRow({ item, onPress, onDelete, index }: DesktopGiftItemRowProps) {
  const quantity = Math.max(1, Number(item.quantity ?? 1));
  const claimed = Math.max(0, Number(item.claimed ?? 0));
  const claimedPct = Math.min(100, Math.round((claimed / quantity) * 100));
  const isSoldOut = claimed >= quantity;
  const hasClaims = claimed > 0 && !isSoldOut;
  const statusLabel = isSoldOut ? "All Claimed" : hasClaims ? `${claimed} Claimed` : "Unclaimed";
  const badgeStyle = isSoldOut ? desktopStyles.statusBadgeSuccess : hasClaims ? desktopStyles.statusBadgeWarning : desktopStyles.statusBadgeNeutral;
  const badgeTextStyle = isSoldOut ? desktopStyles.statusBadgeSuccessText : hasClaims ? desktopStyles.statusBadgeWarningText : desktopStyles.statusBadgeNeutralText;
  const quantityLabel = String(quantity).padStart(2, "0");
  let currencyLabel = "AED";

  if (typeof item.price === "string") {
    const match = item.price.trim().match(/^([A-Za-z]{3})/);
    if (match && match[1]) {
      currencyLabel = match[1].toUpperCase();
    }
  }

  const formatPriceNumber = (value: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return value.toFixed(2);
    }
  };

  let formattedPrice: string | null = null;
  if (item.price != null && item.price !== "") {
    if (typeof item.price === "number" && Number.isFinite(item.price)) {
      formattedPrice = formatPriceNumber(item.price);
    } else if (typeof item.price === "string") {
      const numericPart = item.price.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
      const parsed = Number(numericPart);
      if (!Number.isNaN(parsed) && numericPart.length > 0) {
        formattedPrice = formatPriceNumber(parsed);
      } else {
        formattedPrice = item.price.trim().replace(/^([A-Za-z]{3})\s*/, "");
      }
    }
  }

  return (
    <View style={desktopStyles.itemRow}>
      <View style={desktopStyles.itemIndexBubble}>
        <Text style={desktopStyles.itemIndexText}>{String(index + 1).padStart(2, "0")}</Text>
      </View>
      <View style={desktopStyles.itemImageWrapper}>{item.image_url ? <Image source={{ uri: item.image_url }} style={desktopStyles.itemImage} /> : <View style={desktopStyles.itemImagePlaceholder} />}</View>
      <View style={desktopStyles.itemDetails}>
        <View style={desktopStyles.itemHeaderRow}>
          <View style={desktopStyles.itemTitleBlock}>
            <Text style={desktopStyles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            {item.description && (
              <Text style={desktopStyles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
          <View style={desktopStyles.itemActionsColumn}>
            <Pressable style={[desktopStyles.buyButton, isSoldOut && desktopStyles.buyButtonDisabled]} onPress={() => onPress(item)} disabled={isSoldOut}>
              <Text style={[desktopStyles.buyButtonText, isSoldOut && desktopStyles.buyButtonTextDisabled]}>View on store</Text>
            </Pressable>
            <Pressable style={desktopStyles.deleteButton} onPress={() => onDelete && onDelete(String(item._id))}>
              <Ionicons name="trash-outline" size={20} color="#E54848" />
            </Pressable>
          </View>
        </View>

        <View style={desktopStyles.itemMetaRow}>
          {formattedPrice && (
            <View style={desktopStyles.priceRow}>
              <Text style={desktopStyles.priceCurrency}>{currencyLabel}</Text>
              <Text style={desktopStyles.priceText}>{formattedPrice}</Text>
            </View>
          )}
          <Text style={desktopStyles.quantityText}>Quantity: {quantityLabel}</Text>
          <View style={[desktopStyles.statusBadge, badgeStyle]}>
            <Text style={[desktopStyles.statusBadgeText, badgeTextStyle]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={desktopStyles.progressTrack}>
          <View style={[desktopStyles.progressFill, { width: `${claimedPct}%` }]} />
        </View>
      </View>
    </View>
  );
}

function SelectedFilter({ tempSortBy, tempFilterClaimed, tempFilterUnclaimed }: { tempSortBy: string; tempFilterClaimed: boolean; tempFilterUnclaimed: boolean }) {
  let availabilityValue = "All";
  if (tempFilterClaimed === false && tempFilterUnclaimed === false) {
    availabilityValue = "All";
  } else if (tempFilterClaimed === true && tempFilterUnclaimed === true) {
    availabilityValue = "All";
  } else if (tempFilterClaimed === true && tempFilterUnclaimed === false) {
    availabilityValue = "Claimed";
  } else if (tempFilterClaimed === false && tempFilterUnclaimed === true) {
    availabilityValue = "UnClaimed";
  }

  return (
    <View style={styles.selectedFilterContainer}>
      <View style={styles.filterItem}>
        <Image source={require("@/assets/images/sortIcon.png")} />
        <View style={styles.filterContent}>
          <Text style={styles.filterTitle}>Sort:</Text>
          <Text style={styles.filterValue}>{String(tempSortBy)}</Text>
        </View>
      </View>
      <View style={styles.filterItem}>
        <Image source={require("@/assets/images/availabilityIcon.png")} />
        <View style={styles.filterContent}>
          <Text style={styles.filterTitle}>Availability:</Text>
          <Text style={styles.filterValue}>{availabilityValue}</Text>
        </View>
      </View>
    </View>
  );
}
