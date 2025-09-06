import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectProfile() {
  const { userId } = useAuth();
  const contacts = useQuery(api.products.getContacts as any, userId ? ({ owner_id: userId } as any) : "skip");
  const createContact = useMutation(api.products.createContact as any);
  const [createVisible, setCreateVisible] = useState(false);
  // Bottom sheet form state (client-only fields for now)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState<string>("");
  const [allowEdit, setAllowEdit] = useState(true);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showRelationPicker, setShowRelationPicker] = useState(false);
  const data = useMemo(() => contacts ?? [], [contacts]);

  const handleBack = () => router.back();
  const handleSelect = (contact: any) => {
    router.push({ pathname: "/create-list-step2", params: { profileId: String(contact._id) } });
  };
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setDob("");
    setGender("");
    setCountryCode("+971");
    setPhone("");
    setEmail("");
    setRelation("");
    setAllowEdit(true);
    setShowGenderPicker(false);
    setShowRelationPicker(false);
  };

  const handleCreate = async () => {
    if (!userId) return;
    const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!displayName) return;
    const id = await createContact({
      owner_id: userId,
      name: displayName,
      email: email.trim() || undefined,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      dateOfBirth: dob || undefined,
      gender: gender || undefined,
      phoneCountryCode: countryCode || undefined,
      phoneNumber: phone || undefined,
      relation: relation || undefined,
      allowEdit,
    } as any);
    setCreateVisible(false);
    resetForm();
    router.push({ pathname: "/create-list-step2", params: { profileId: String(id) } });
  };

  const handleCreateAnother = async () => {
    if (!userId) return;
    const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!displayName) return;
    await createContact({
      owner_id: userId,
      name: displayName,
      email: email.trim() || undefined,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      dateOfBirth: dob || undefined,
      gender: gender || undefined,
      phoneCountryCode: countryCode || undefined,
      phoneNumber: phone || undefined,
      relation: relation || undefined,
      allowEdit,
    } as any);
    // Keep sheet open and clear fields for another entry
    resetForm();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <StatusBar barStyle="light-content" backgroundColor="#330065" />
      <LinearGradient colors={["#330065", "#6600CB"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingBottom: 16 }}>
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingTop: 16 }}>
              <Pressable onPress={handleBack} style={{ padding: 4 }}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={{ color: "#FFFFFF", fontSize: 24, fontFamily: "Nunito_700Bold", lineHeight: 28, letterSpacing: -1 }}>Select Profile</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, color: "#1C0335", fontFamily: "Nunito_700Bold" }}>Select or Add Profile</Text>
        <Text style={{ color: "#1C0335", marginTop: 6 }}>Choose or add a new profile to create a wishlist for</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item._id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSelect(item)} style={{ flex: 1, borderWidth: 1, borderColor: "#DDD7E4", borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#EEE", marginBottom: 12 }} />
            <Text style={{ color: "#1C0335", fontFamily: "Nunito_700Bold", fontSize: 18 }} numberOfLines={1}>{item.name}</Text>
          </Pressable>
        )}
        ListFooterComponent={
          <Pressable onPress={() => setCreateVisible(true)} style={{ marginHorizontal: 16, marginTop: 4, borderWidth: 1, borderColor: "#DDD7E4", borderRadius: 12, padding: 24, alignItems: "center" }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#4B0082", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
              <Ionicons name="add" size={36} color="#FFF" />
            </View>
            <Text style={{ color: "#1C0335", fontFamily: "Nunito_700Bold", fontSize: 18 }}>Add New</Text>
          </Pressable>
        }
      />

      <Modal visible={createVisible} transparent animationType="slide" onRequestClose={() => setCreateVisible(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Pressable style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" }} onPress={() => setCreateVisible(false)} />
          <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "88%" }}>
            <View style={{ alignItems: "center", paddingTop: 8 }}>
              <View style={{ width: 48, height: 5, borderRadius: 2.5, backgroundColor: "#E5E0EC" }} />
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 22, fontFamily: "Nunito_700Bold", color: "#1C0335" }}>Create a profile for someone else</Text>
              <Text style={{ color: "#1C0335", marginTop: 6 }}>Add a child, parent, partner, or even a pet — and build their gift list on their behalf.</Text>

              <Pressable style={{ marginTop: 16, borderWidth: 1.5, borderColor: "#DDD7E4", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: "#4B0082", fontFamily: "Nunito_700Bold" }}>Choose from contacts</Text>
                <Ionicons name="arrow-forward-outline" size={20} color="#4B0082" />
              </Pressable>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: "#EEE" }} />
                <Text style={{ color: "#8E8E93" }}>OR</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: "#EEE" }} />
              </View>

              {/* Profile photo placeholder */}
              <Text style={{ color: "#8E8E93", marginBottom: 8 }}>Profile photo (optional)</Text>
              <View style={{ borderRadius: 12, overflow: "hidden", backgroundColor: "#F2F0F6" }}>
                <View style={{ aspectRatio: 16 / 9, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="image-outline" size={48} color="#B1A6C4" />
                </View>
                <View style={{ position: "absolute", left: 12, right: 12, top: 12, flexDirection: "row", gap: 8 }}>
                  <Pressable style={{ backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ color: "#FFF" }}>Change Image</Text>
                  </Pressable>
                  <Pressable style={{ backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ color: "#FFF" }}>Reframe Image</Text>
                  </Pressable>
                  <Pressable style={{ backgroundColor: "#E53935", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ color: "#FFF" }}>Delete Image</Text>
                  </Pressable>
                </View>
              </View>

              {/* First name */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ color: "#8E8E93" }}>First name</Text>
                <View style={{ borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, paddingHorizontal: 12, height: 48, justifyContent: "center" }}>
                  <TextInput value={firstName} onChangeText={setFirstName} placeholder="John" placeholderTextColor="#B1A6C4" />
                </View>
              </View>

              {/* Last name */}
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: "#8E8E93" }}>Last name</Text>
                <View style={{ borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, paddingHorizontal: 12, height: 48, justifyContent: "center" }}>
                  <TextInput value={lastName} onChangeText={setLastName} placeholder="Smith" placeholderTextColor="#B1A6C4" />
                </View>
              </View>

              {/* Date of birth */}
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: "#8E8E93" }}>Date of birth</Text>
                <View style={{ borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, paddingHorizontal: 12, height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <TextInput value={dob} onChangeText={setDob} placeholder="January 13, 2025" placeholderTextColor="#B1A6C4" style={{ flex: 1 }} />
                  <Ionicons name="calendar-outline" size={20} color="#B1A6C4" />
                </View>
              </View>

              {/* Gender */}
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: "#8E8E93" }}>Gender</Text>
                <Pressable onPress={() => setShowGenderPicker((v) => !v)} style={{ borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, paddingHorizontal: 12, height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: gender ? "#1C0335" : "#B1A6C4" }}>{gender || "Select"}</Text>
                  <Ionicons name="chevron-down" size={18} color="#8E8E93" />
                </Pressable>
                {showGenderPicker && (
                  <View style={{ borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, marginTop: 8, overflow: "hidden" }}>
                    {(["Male", "Female", "Other"]).map((g) => (
                      <Pressable key={g} onPress={() => { setGender(g); setShowGenderPicker(false); }} style={{ padding: 12 }}>
                        <Text style={{ color: "#1C0335" }}>{g}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Mobile number */}
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: "#8E8E93" }}>Mobile number (optional)</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ width: 100, borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, paddingHorizontal: 12, height: 48, justifyContent: "center" }}>
                    <TextInput value={countryCode} onChangeText={setCountryCode} placeholder="+971" placeholderTextColor="#B1A6C4" />
                  </View>
                  <View style={{ flex: 1, borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, paddingHorizontal: 12, height: 48, justifyContent: "center" }}>
                    <TextInput value={phone} onChangeText={setPhone} placeholder="521 123 456" placeholderTextColor="#B1A6C4" keyboardType="phone-pad" />
                  </View>
                </View>
              </View>

              {/* Email */}
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: "#8E8E93" }}>Email address</Text>
                <View style={{ borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, paddingHorizontal: 12, height: 48, justifyContent: "center" }}>
                  <TextInput value={email} onChangeText={setEmail} placeholder="john_smith@gmail.com" placeholderTextColor="#B1A6C4" keyboardType="email-address" autoCapitalize="none" />
                </View>
              </View>

              {/* Relation */}
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: "#8E8E93" }}>Relation with this person (optional)</Text>
                <Pressable onPress={() => setShowRelationPicker((v) => !v)} style={{ borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, paddingHorizontal: 12, height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: relation ? "#1C0335" : "#B1A6C4" }}>{relation || "Select"}</Text>
                  <Ionicons name="chevron-down" size={18} color="#8E8E93" />
                </Pressable>
                {showRelationPicker && (
                  <View style={{ borderWidth: 1, borderColor: "#E5E0EC", borderRadius: 12, marginTop: 8, overflow: "hidden" }}>
                    {(["Son", "Daughter", "Spouse", "Partner", "Friend", "Parent", "Sibling", "Pet", "Other"]).map((r) => (
                      <Pressable key={r} onPress={() => { setRelation(r); setShowRelationPicker(false); }} style={{ padding: 12 }}>
                        <Text style={{ color: "#1C0335" }}>{r}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Allow edit */}
              <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View>
                  <Text style={{ color: "#1C0335", fontFamily: "Nunito_700Bold" }}>Allow them to edit</Text>
                  <Text style={{ color: "#8E8E93", fontSize: 12 }}>They can add or edit items on this list</Text>
                </View>
                <Switch value={allowEdit} onValueChange={setAllowEdit} thumbColor={allowEdit ? "#FFF" : "#FFF"} trackColor={{ false: "#E5E5EA", true: "#22C55E" }} />
              </View>

              {/* Actions */}
              <View style={{ height: 16 }} />
              <Pressable onPress={handleCreate} style={{ height: 56, borderRadius: 12, backgroundColor: "#4B0082", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#FFF", fontFamily: "Nunito_700Bold" }}>Save profile</Text>
              </Pressable>
              <View style={{ height: 12 }} />
              <Pressable onPress={handleCreateAnother} style={{ height: 56, borderRadius: 12, borderWidth: 1.5, borderColor: "#4B0082", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#4B0082", fontFamily: "Nunito_700Bold" }}>+  Add another profile</Text>
              </Pressable>
              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
