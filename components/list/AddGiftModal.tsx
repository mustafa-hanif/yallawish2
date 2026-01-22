import { TextInputAreaField } from "@/components/TextInputAreaField";
import { TextInputField } from "@/components/TextInputField";
import { api } from "@/convex/_generated/api";
import { desktopStyles, styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import { useAction, useMutation } from "convex/react";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Easing, Image, Modal, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

type AddGiftModalProps = {
  visible: boolean;
  onClose: () => void;
  listId: string;
  onSaved?: (newItemId: string) => void;
};

const DESKTOP_BREAKPOINT = 1024;

export default function AddGiftModal({ visible, onClose, listId, onSaved }: AddGiftModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;

  // Animation for mobile bottom sheet
  const sheetAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: visible ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible, sheetAnim]);
  const translateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [600, 0] });

  // Form state
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
  const [isUrlValid, setIsUrlValid] = useState(true);

  // Gift image upload state
  const [isUploadingGiftImage, setIsUploadingGiftImage] = useState(false);
  const [giftImageUploadError, setGiftImageUploadError] = useState<string | null>(null);

  // In-sheet browser state (mobile)
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [currentBrowserUrl, setCurrentBrowserUrl] = useState<string | null>(null);

  // Convex actions/mutations
  // @ts-ignore generated after adding convex action
  const scrape = useAction((api as any).scrape.productMetadata);
  const createItem = useMutation(api.products.createListItem as any);
  const generateCoverUploadUrl = useMutation(api.products.generateListCoverUploadUrl);
  const getCoverUrl = useMutation(api.products.getListCoverUrl);

  // Derived
  const DESCRIPTION_LIMIT = 400;
  const canSave = useMemo(() => {
    return !!listId && (link.trim().length > 0 || name.trim().length > 0) && quantity > 0 && !saving && (link.trim().length === 0 || isUrlValid);
  }, [listId, link, name, quantity, saving, isUrlValid]);

  const validateUrl = (value: string) => {
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    return urlPattern.test(value.trim());
  };

  useEffect(() => {
    if (link.trim().length === 0) {
      setIsUrlValid(true);
      return;
    }
    const trimmed = link.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      setIsUrlValid(validateUrl(link));
    } else {
      setIsUrlValid(true);
    }
  }, [link]);

  // Scrape on link change (debounced)
  useEffect(() => {
    if (!link || !/^https?:\/\//i.test(link)) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        setScraping(true);
        setScrapeError(null);
        const meta = await scrape({ url: link });
        if (cancelled) return;
        if (meta.ok) {
          if (!name && meta.title) {
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
          if (meta.image) setImageUrl(meta.image);
        } else {
          setScrapeError(meta.error || "Could not extract data");
        }
      } catch (e: any) {
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
    onClose();
    resetForm();
  };

  const handleSave = async () => {
    if (!canSave || !listId) return;
    try {
      setSaving(true);
      const newId = await createItem({
        list_id: listId as any,
        name: name || link,
        description: description || null,
        image_url: imageUrl || null,
        quantity,
        price: price || null,
        currency: "AED",
        buy_url: link || null,
      });
      onSaved?.(String(newId));
    } catch (e) {
      console.warn("Failed to save gift", e);
    } finally {
      setSaving(false);
      onClose();
      resetForm();
    }
  };

  const openSearchBrowser = () => {
    const searchQuery = Platform.OS === "web" ? link.trim() : search.trim();
    if (!searchQuery) return;
    const q = encodeURIComponent(searchQuery);
    const url = `https://www.google.com/search?q=${q}&tbm=shop`;
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.open(url, "_blank");
    } else {
      setBrowserUrl(url);
      setCurrentBrowserUrl(url);
      setShowBrowser(true);
    }
  };

  const handleBrowserAdd = async () => {
    if (!currentBrowserUrl) return;
    setLink(currentBrowserUrl);
    setShowBrowser(false);
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

  return (
    <>
      <Modal visible={visible} transparent animationType={isDesktop ? "fade" : "none"} onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        {isDesktop ? (
          <View style={desktopStyles.modalContainer}>
            <View style={desktopStyles.modalContent}>
              <View style={desktopStyles.modalHeader}>
                <Text style={desktopStyles.modalTitle}>Add a Gift</Text>
                <Pressable onPress={onClose} style={desktopStyles.modalCloseButton}>
                  <Ionicons name="close" size={24} color="#8E8EA9" />
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={desktopStyles.modalScrollContent} showsVerticalScrollIndicator={false}>
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

                <View style={desktopStyles.modalProductRow}>
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

                <View style={desktopStyles.modalFieldGroup}>
                  <Text style={desktopStyles.modalFieldLabel}>Name of Gift</Text>
                  <View style={desktopStyles.modalInputRow}>
                    <TextInput value={name} onChangeText={setName} style={desktopStyles.modalInput} placeholder="Enter gift name" placeholderTextColor="#8E8EA9" />
                    <Ionicons name="pencil-outline" size={20} color="#AEAEB2" />
                  </View>
                </View>

                <View style={desktopStyles.modalFieldGroup}>
                  <Text style={desktopStyles.modalFieldLabel}>Description</Text>
                  <View style={desktopStyles.modalTextareaWrapper}>
                    <TextInput placeholder="Prefer color white, size medium etc" value={description} onChangeText={(t) => t.length <= DESCRIPTION_LIMIT && setDescription(t)} style={desktopStyles.modalTextarea} multiline placeholderTextColor="#8E8EA9" />
                    <Text style={desktopStyles.modalCharCount}>{description.length}/100</Text>
                  </View>
                </View>
              </ScrollView>

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
        ) : (
          <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}>
            <Pressable style={{ backgroundColor: "#FFFF", borderWidth: 0 }} onPress={onClose}>
              <View style={styles.sheetHandle} />
            </Pressable>
            <ScrollView contentContainerStyle={{ ...styles.sheetContent, paddingHorizontal: 0, gap: 0 }} showsVerticalScrollIndicator={false}>
              <View style={{ padding: 16, gap: 20, backgroundColor: "#ffff" }}>
                <Text style={styles.sheetTitle}> Add a gift item</Text>

                <TextInputField label="Add a web link" value={link} onChangeText={setLink} icon={<Image source={require("@/assets/images/externalLink.png")} />} keyboardType="url" placeholder="https://" autoCapitalize="none" autoCorrect={false} error={[...(!isUrlValid && link.trim().length > 0 ? ["Invalid URL"] : []), ...(scrapeError ? [String("We couldn’t fetch details from this link. Try again, remove extra tracking from the URL, or add the gift manually")] : [])]} />
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
                      <Image source={require("@/assets/images/search.png")} />
                    </Pressable>
                  }
                />
              </View>
              <View style={{ padding: 16, paddingTop: 24, gap: 20 }}>
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
          </Animated.View>
        )}
      </Modal>

      {/* Product search browser modal for mobile */}
      <Modal visible={showBrowser} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setShowBrowser(false)}>
        <LinearGradient colors={["#330065", "#45018ad7"]} locations={[0, 0.7]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 2 }}>
          <View style={[styles.browserHeader, { backgroundColor: "transparent", height: 80 }]}>
            <View style={[styles.navigation, { paddingBottom: 16 }]}>
              <Pressable
                onPress={() => {
                  setShowBrowser(false);
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
    </>
  );
}
