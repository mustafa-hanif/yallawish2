import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManageList() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const list = useQuery(api.products.getListById, listId ? ({ listId } as any) : "skip");
  const deleteList = useMutation(api.products.deleteList);

  const [archiveExpanded, setArchiveExpanded] = useState(true);
  const [archivingScope, setArchivingScope] = useState<"self" | "everyone" | null>(null);

  const handleBack = () => router.back();

  const handleDelete = async () => {
    if (!listId) return;
    Alert.alert("Delete List", "Are you sure you want to delete this list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteList({ listId: listId as any });
          router.push("/(tabs)/index" as any); // fallback to home tab
        }
      }
    ]);
  };

  const Row = ({ icon, label, right, onPress }: { icon: React.ReactNode; label: string; right?: React.ReactNode; onPress?: () => void }) => (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>{right}</View>
    </Pressable>
  );

  const ArchiveOption = ({ value, label }: { value: "self" | "everyone"; label: string }) => (
    <Pressable style={styles.archiveOption} onPress={() => setArchivingScope(value)}>
      <View style={[styles.radioOuter, archivingScope === value && styles.radioOuterActive]}> 
        {archivingScope === value && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.archiveLabel}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient 
        colors={["#330065", "#45018ad7"]}
        locations={[0, 0.7]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 2 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                 <Image source={require("@/assets/images/backArrow.png")} />
              </Pressable>
              <Text style={styles.headerTitle}>Manage List</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Row icon={<Ionicons name="color-wand-outline" size={22} color="#1C0335" />} label="Customize" right={<Ionicons name="chevron-forward" size={20} color="#1C0335" />} onPress={() => listId && router.push({ pathname: '/create-list-step2', params: { listId: String(listId) } })} />
        <Row icon={<Ionicons name="eye-off-outline" size={22} color="#1C0335" />} label="Manage Visibility" right={<Ionicons name="chevron-forward" size={20} color="#1C0335" />} onPress={() => listId && router.push({ pathname: '/create-list-step3', params: { listId: String(listId) } })} />

        <View style={styles.sectionSeparator} />

        <Pressable style={styles.row} onPress={() => setArchiveExpanded((p) => !p)}>
          <View style={styles.rowLeft}>
            <Ionicons name="archive-outline" size={22} color="#1C0335" />
            <Text style={styles.rowLabel}>Archive List</Text>
          </View>
          <Ionicons name={archiveExpanded ? "chevron-up" : "chevron-down"} size={20} color="#1C0335" />
        </Pressable>
        {archiveExpanded && (
          <View style={styles.archiveOptionsWrap}>
            <ArchiveOption value="self" label="Archive for self" />
            <ArchiveOption value="everyone" label="Archive for everyone" />
          </View>
        )}

        <View style={styles.sectionSeparator} />

        <Row icon={<Ionicons name="copy-outline" size={22} color="#1C0335" />} label="Duplicate List" />

        <View style={styles.sectionSeparator} />

        <Pressable style={styles.deleteRow} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            <Text style={styles.deleteLabel}>Delete List</Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}> 
        <Pressable style={[styles.footerButton, styles.footerPrimary]} onPress={handleBack}>
          <Text style={styles.footerPrimaryText}>Back to list</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 108, paddingBottom: 16, },
  headerContent: { paddingHorizontal: 16 },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { color: "#FFFFFF", fontSize: 24, fontFamily: "Nunito_700Bold", lineHeight: 28, letterSpacing: -1 },
  scrollContent: { paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 18 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowLabel: { fontSize: 17.49, fontFamily: 'Nunito_700Bold', color: '#1C0335', letterSpacing:0 },
  rowRight: { },
  sectionSeparator: { height: 1, backgroundColor: '#E5E5EA' },
  archiveOptionsWrap: { paddingLeft: 60, gap: 12, paddingTop: 12, paddingBottom: 12 },
  archiveOption: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  archiveLabel: { fontSize: 16, fontFamily: 'Nunito_400Regular', color: '#1C0335' },
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#AEAEB2', alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: '#3B0076' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3B0076' },
  deleteRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 18 },
  deleteLabel: { fontSize: 16, fontFamily: 'Nunito_700Bold', color: '#FF3B30' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#D1D1D6' },
  footerButton: { borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
  footerPrimary: { backgroundColor: '#28004E' },
  footerPrimaryText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito_700Bold' }
});
