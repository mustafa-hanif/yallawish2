import { StyleSheet } from "react-native";

export const responsiveStylesHome = StyleSheet.create({
  pageContainer: {
    paddingBottom: 0,
  },
  headerWrapper: {
    width: "100%",
  },
  navBarDesktop: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  header: {
    paddingHorizontal: 0,
    justifyContent: "center",
  },
  headerInner: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerInnerDesktop: {
    paddingVertical: 6,
  },
  headerSearch: {
    maxWidth: 520,
  },
  profileButtonDesktop: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 20,
  },
  heroSectionDesktop: {
    width: "100%",
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  heroContentDesktop: {
    flex: 1,
    paddingRight: 48,
  },
  heroVisualDesktop: {
    flex: 1.1,
    paddingLeft: 32,
    justifyContent: "center",
  },
  heroSwiperDesktop: {
    justifyContent: "center",
    width: "100%",
  },
  section: {
    paddingHorizontal: 0,
  },
  sectionInner: {
    width: "100%",
    maxWidth: 1800,
    alignSelf: "center",
    paddingHorizontal: 150,
  },
  lifeMomentGridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: 'center',
    rowGap: 54.5
  },
  lifeMomentGridMobile: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    rowGap: 20
  },
  lifeMomentCardDesktop: {
    width: '23%',
    height: 246,
    minWidth: 260,
    justifyContent: 'center'
  },
  lifeMomentCardMobile: {
    width: 300,
    // marginRight: 16,
  },
  lifeMomentScrollContent: {
    paddingHorizontal: 20,
    gap: 20
  },
  eventsDesktopList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  eventCardDesktop: {
    width: "31%",
    minWidth: 250,
    marginBottom: 24,
    marginRight: 24,
  },
  picksDesktopList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  pickCardDesktop: {
    width: "31%",
    minWidth: 240,
    marginBottom: 24,
    marginRight: 24,
  },
  inspirationDesktopList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  inspirationCardDesktop: {
    width: "48%",
    minWidth: 340,
    marginBottom: 24,
    marginRight: 24,
  },
  aiSectionOuter: {
    padding: 0,
    backgroundColor: "transparent",
    marginHorizontal: 0,
    marginTop: 0,
  },
  aiSectionOuterMobile: {
    padding: 0,
    backgroundColor: "transparent",
    marginHorizontal: 0,
    marginTop: 0,
  },
  aiSectionDesktopWrapper: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    // paddingVertical: 40,
    // paddingHorizontal: 20,
  },
  aiSectionDesktop: {
    borderRadius: 32,
    // paddingHorizontal: 40,
    // paddingVertical: 40,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#330065",
  },
  aiContentDesktop: {
    flex: 1,
    padding: 40
  },
  aiRobotDesktop: {
    flex: 1,
    alignItems: "flex-end",
    height: '100%',
    justifyContent: 'flex-end',
  },
  robotImageDesktop: {
    width: 340,
    height: 260,
  },
  signOutWrapper: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 20,
    marginTop: 24,
  },
});