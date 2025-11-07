import { ResponsiveAuthLayout } from "@/components/ResponsiveAuthLayout";
import { Divider, SocialButton } from "@/components/auth";
import { authCardStyles as styles } from "@/styles/authCardStyles";
import { useSignUp } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import {
  Dimensions,
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

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError([]);
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          marketing,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.push({
        pathname: "/verify-otp",
        params: {
          email: emailAddress,
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
    }
  };

  return (
    <ResponsiveAuthLayout
      showHero={!isDesktop}
      heroTitle="Sign up to save{'\n'}this gift"
      heroSubtitle="Add it to your list now and start creating your own to share with friends and family."
    >
      <View style={[
        styles.formContainer,
        isDesktop ? styles.formContainerDesktop : styles.formContainerMobile,
      ]}>
        <View
          style={[
            styles.segmentedControl,
            isDesktop && styles.segmentedControlDesktop,
          ]}
        >
          <View style={styles.segmentedOption}>
            <View style={styles.segmentedActive}>
              <Text style={styles.segmentedActiveText}>Signup</Text>
            </View>
          </View>
          <View style={styles.segmentedOption}>
            <Link
              href={{
                pathname: "/log-in",
                params: {
                  ...(showAddToList
                    ? { addToList: String(addToList) || "1" }
                    : {}),
                  ...(decodedReturnTo
                    ? { returnTo: encodeURIComponent(decodedReturnTo) }
                    : {}),
                },
              }}
              asChild
            >
              <Pressable style={styles.segmentedInactive}>
                <Text style={styles.segmentedInactiveText}>Login</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <Text
          style={[
            styles.welcomeTitle,
            isDesktop && styles.welcomeTitleDesktop,
          ]}
        >
          Welcome to YallaWish
        </Text>

        <View style={styles.fieldsStack}>
          <View style={[styles.nameRow, isDesktop && styles.nameRowDesktop]}>
            <TextInput
              style={[
                styles.input,
                styles.inputField,
                isDesktop && styles.inputDesktop,
              ]}
              value={firstName}
              placeholder="First name"
              placeholderTextColor="rgba(255,255,255,0.65)"
              onChangeText={setFirstName}
            />
            <TextInput
              style={[
                styles.input,
                styles.inputField,
                isDesktop && styles.inputDesktop,
              ]}
              value={lastName}
              placeholder="Last name"
              placeholderTextColor="rgba(255,255,255,0.65)"
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            style={[styles.input, isDesktop && styles.inputDesktop]}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email address"
            placeholderTextColor="rgba(255,255,255,0.65)"
            keyboardType="email-address"
            onChangeText={setEmailAddress}
          />

          <TextInput
            style={[styles.input, isDesktop && styles.inputDesktop]}
            value={password}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.65)"
            secureTextEntry
            onChangeText={setPassword}
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
          label={ctaLabel}
          variant="primary"
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

        <Divider text="Or continue with" tone="card" />

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
              icon={<AntDesign name="apple1" size={26} color="#FFFFFF" />}
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
              icon={<AntDesign name="google" size={20} color="#4285F4" />}
              label="Continue with Google"
            />
            <SocialButton
              onPress={() => {}}
              icon={<AntDesign name="apple1" size={22} color="#000000" />}
              label="Continue with Apple"
            />
          </View>
        )}
      </View>
    </ResponsiveAuthLayout>
  );
}
