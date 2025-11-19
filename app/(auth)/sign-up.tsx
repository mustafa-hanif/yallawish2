import { ResponsiveAuthLayout } from "@/components/ResponsiveAuthLayout";
import { Divider, SocialButton } from "@/components/auth";
import { authCardStyles as styles } from "@/styles/authCardStyles";
import { useSignUp } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const { addToList, returnTo } = useLocalSearchParams<{ addToList?: string; returnTo?: string }>();
  const decodedReturnTo = returnTo ? decodeURIComponent(String(returnTo)) : undefined;
  const showAddToList = !!addToList && String(addToList).toLowerCase() !== "false";
  const ctaLabel = showAddToList ? "Add to list" : "Sign up";

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [marketing, setMarketing] = React.useState(false);
  const [error, setError] = React.useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || isLoading) return;
    
    // Basic validation
    if (!emailAddress.trim()) {
      setError(["Please enter your email address."]);
      return;
    }
    if (!password.trim()) {
      setError(["Please enter a password."]);
      return;
    }
    
    setIsLoading(true);
    setError([]);
    
    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        unsafeMetadata: {
          marketing,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.push({
        pathname: "/verify-otp",
        params: {
          email: emailAddress.trim(),
          ...(showAddToList ? { addToList: String(addToList) || "1" } : {}),
          ...(decodedReturnTo
            ? { returnTo: encodeURIComponent(decodedReturnTo) }
            : {}),
        },
      });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (typeof err === "object" && err !== null && "errors" in err && Array.isArray((err as any).errors)) {
        setError((err as any).errors.map((e: any) => e.longMessage));
      } else {
        setError(["An unknown error occurred."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

 const TabUI = () => (
  <View style={[styles.segmentedControl, isDesktop ? styles.segmentedControlDesktop: styles.segmentedControlMobile]}>
    <View style={styles.segmentedOption}>
      <View style={{...styles.segmentedActive, ...(!isDesktop ? styles.segmentedActiveMobile : {})}}>
        <Text style={[styles.segmentedActiveText, !isDesktop ? styles.segmentedActiveTextMobile : {}]}>Signup</Text>
      </View>
    </View>
    <View style={styles.segmentedOption}>
      <Link
        href={{
          pathname: "/log-in",
          params: {
            ...(showAddToList ? { addToList: String(addToList) || "1" } : {}),
            ...(decodedReturnTo ? { returnTo: encodeURIComponent(decodedReturnTo) } : {}),
          },
        }}
        asChild
      >
        <Pressable style={{...styles.segmentedInactive, ...(!isDesktop ? styles.segmentedInactiveMobile : {})}}>
          <Text style={[styles.segmentedInactiveText, !isDesktop ? styles.segmentedInactiveTextMobile : {}]}>Login</Text>
        </Pressable>
      </Link>
    </View>
  </View>
);

  return (
    <ResponsiveAuthLayout
      showHero={!isDesktop}
      heroTitle={`Sign up to save \n this gift`}
      heroSubtitle="Add it to your list now and start creating your own to share with friends and family."
      mobileLogoHeaderStyle={{ marginTop: 20, marginBottom: 20 }}
      tabs={<TabUI />}
    >
      <View style={[
        styles.formContainer,
        isDesktop ? styles.formContainerDesktop : styles.formContainerMobile,
      ]}>
        {isDesktop ? <TabUI /> : null}
     
        {isDesktop && (<>
          <Text
            style={[
              styles.welcomeTitle,
              isDesktop && styles.welcomeTitleDesktop,
            ]}
          >
            Welcome to YallaWish
          </Text>
        </>)}

        <View style={styles.fieldsStack}>
          <View style={[styles.nameRow, isDesktop && styles.nameRowDesktop]}>
          <TextInput
            style={[
              styles.input,
              styles.inputField,
              isDesktop && styles.inputDesktop,
              !isDesktop ? styles.inputMobile : {}
            ]}
            value={firstName}
            placeholder={isDesktop ? "First name" : "First Name"}
            placeholderTextColor="#FFFFFF66"
            onChangeText={(text) => {
              setFirstName(text);
              if (error.length > 0) setError([]);
            }}
          />
            <TextInput
              style={[
                styles.input,
                styles.inputField,
                isDesktop && styles.inputDesktop,
                !isDesktop ? styles.inputMobile : {}
              ]}
              value={lastName}
              placeholder={isDesktop ? "Last name" : "Last Name"}
              placeholderTextColor="#FFFFFF66"
              onChangeText={(text) => {
                setLastName(text);
                if (error.length > 0) setError([]);
              }}
            />
          </View>

          <TextInput
            style={[styles.input, isDesktop && styles.inputDesktop, !isDesktop ? styles.inputMobile : {}]}
            autoCapitalize="none"
            value={emailAddress}
            placeholder={isDesktop ? "Email address" : "Email"}
            placeholderTextColor="#FFFFFF66"
            keyboardType="email-address"
            onChangeText={(text) => {
              setEmailAddress(text);
              if (error.length > 0) setError([]);
            }}
          />

          <TextInput
            style={[styles.input, isDesktop && styles.inputDesktop, !isDesktop ? styles.inputMobile : {}]}
            value={password}
            placeholder="Password"
            placeholderTextColor="#FFFFFF66"
            secureTextEntry
            onChangeText={(text) => {
              setPassword(text);
              if (error.length > 0) setError([]);
            }}
            onSubmitEditing={onSignUpPress}
            returnKeyType="done"
          />
        </View>

        <Pressable
          onPress={() => setMarketing((v) => !v)}
          style={styles.checkboxRow}
        >
          <View
            style={[
              styles.checkboxBox,
              marketing && styles.checkboxBoxChecked,
            ]}
          >
            {marketing && (
              <Ionicons name="checkmark" size={14} color="#1B0A3A" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree, by signing up the <Text style={styles.termsLink}>Terms &amp; Policy</Text>
          </Text>
        </Pressable>

        <SocialButton
          onPress={onSignUpPress}
          icon={null}
          label={isLoading ? "Signing up..." : ctaLabel}
          variant={isDesktop? "primary" : "default"}
        />

        {error.length > 0 && (
          <View style={styles.errorContainer}>
            {error.map((e, i) => (
              <Text key={i} style={styles.errorText}>
                {e}
              </Text>
            ))}
          </View>
        )}

        <Divider text={isDesktop ? "Or continue with" : "OR" } tone="card" marginVertical={isDesktop ? 16 : 8} />

        {isDesktop ? (
          <View style={styles.socialRowDesktop}>
            <SocialButton
              onPress={() => {}}
              icon={<AntDesign name="google" size={24} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Google"
            />
            <SocialButton
              onPress={() => {}}
              icon={<Ionicons name="logo-facebook" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Facebook"
            />
            <SocialButton
              onPress={() => {}}
              icon={<AntDesign name="apple" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Apple"
            />
            <SocialButton
              onPress={() => {}}
              icon={<Ionicons name="logo-whatsapp" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with WhatsApp"
            />
          </View>
        ) : (
          <View style={styles.socialStack}>
            <SocialButton
              onPress={() => {}}
              icon={<Image source={require('@/assets/images/googleIcon.png')} />}
              label="Continue with Google"
            />
            <SocialButton
              onPress={() => {}}
              icon={<Image source={require('@/assets/images/appleIcon.png')} />}
              label="Continue with Apple"
            />
          </View>
        )}
      </View>
    </ResponsiveAuthLayout>
  );
}
