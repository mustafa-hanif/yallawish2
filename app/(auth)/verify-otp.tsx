import { ResponsiveAuthLayout } from "@/components/ResponsiveAuthLayout";
import { SocialButton } from "@/components/auth";
import { api } from "@/convex/_generated/api";
import { authCardStyles as styles } from "@/styles/authCardStyles";
import { useSignUp } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const OTP_LENGTH = 6;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const upsertUserProfile = useMutation(api.products.upsertUserProfile);
  const { email, returnTo, addToList } = useLocalSearchParams<{ email?: string; returnTo?: string; addToList?: string }>();
  const decodedReturnTo = returnTo ? decodeURIComponent(String(returnTo)) : undefined;
  const emailAddress = email ? String(email) : undefined;
  const showAddToList = addToList && String(addToList).toLowerCase() !== "false";

  const { width } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && width >= 768;
  const instructionCopy = emailAddress
    ? `Enter the 6-digit code we sent to ${emailAddress}.`
    : "Enter the 6-digit code we just emailed to you.";

  const [digits, setDigits] = React.useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [errors, setErrors] = React.useState<string[]>([]);
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const inputRefs = React.useRef<(TextInput | null)[]>([]);

  const code = React.useMemo(() => digits.join(""), [digits]);
  const canVerify = code.length === OTP_LENGTH && digits.every(digit => digit !== "");

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  React.useEffect(() => {
    // If a user lands here without a pending sign-up, send them back to the start.
    if (isLoaded && !signUp?.status) {
      router.replace("/sign-up");
    }
  }, [isLoaded, signUp?.status, router]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < OTP_LENGTH) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleDigitChange = (index: number, rawValue: string) => {
    const sanitized = rawValue.replace(/\D/g, "");

    if (sanitized.length === 0) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      let cursor = index;
      sanitized.split("").forEach((digit) => {
        if (cursor < OTP_LENGTH) {
          next[cursor] = digit;
          cursor += 1;
        }
      });
      return next;
    });

    const nextIndex = Math.min(index + sanitized.length, OTP_LENGTH - 1);
    if (index + sanitized.length >= OTP_LENGTH) {
      inputRefs.current[OTP_LENGTH - 1]?.blur();
    } else {
      focusInput(nextIndex);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key !== "Backspace") return;

    if (digits[index]) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    if (index > 0) {
      focusInput(index - 1);
      setDigits((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
    }
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    if (!isLoaded || !canVerify) {
      setErrors(["Enter the 6-digit code to continue."]);
      return;
    }

    setIsVerifying(true);
    setErrors([]);
    setInfoMessage(null);

    try {
      const attempt = await signUp?.attemptEmailAddressVerification({ code });
      if (attempt?.status === "complete") {
        // Save basic user profile immediately after verification
        if (attempt?.createdUserId) {
          try {
            await upsertUserProfile({
              user_id: attempt.createdUserId,
              firstName: (attempt as any)?.firstName || undefined,
              lastName: (attempt as any)?.lastName || undefined,
              contactEmail: (attempt as any)?.emailAddress || undefined,
              displayName: undefined,
              phoneCountryCode: undefined,
              phoneNumber: undefined,
              gender: undefined,
              dateOfBirth: undefined,
              location: undefined,
              persona: undefined,
              giftOccasions: [],
              shareUpdates: false,
              giftInterests: [],
              giftShoppingStyle: null,
              giftBudgetRange: null,
              giftDiscoveryChannels: [],
              favoriteStores: [],
              reminderOptIn: false,
              aiIdeasOptIn: false,
              communityUpdatesOptIn: false,
              profileImageUrl: undefined,
            });
          } catch (e) {
            console.warn("upsertUserProfile failed after verification", e);
          }
        }
        await setActive?.({ session: attempt.createdSessionId });
        const target = decodedReturnTo ? (decodedReturnTo as any) : "/profile-setup";
        router.replace(target);
        return;
      }

      setErrors(["We couldn't verify that code. Please try again."]);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as any).errors)
      ) {
        setErrors((err as any).errors.map((e: any) => e.longMessage));
      } else {
        setErrors(["An unknown error occurred. Please try again."]);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) return;
    if (!isLoaded) return;

    setIsResending(true);
    setErrors([]);
    setInfoMessage(null);

    try {
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setInfoMessage("We sent a new code. It may take a moment to arrive.");
      setResendCooldown(30);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as any).errors)
      ) {
        setErrors((err as any).errors.map((e: any) => e.longMessage));
      } else {
        setErrors(["Unable to resend the code right now. Please try again later."]);
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignup = () => {
    router.replace({
      pathname: "/sign-up",
      params: {
        ...(showAddToList ? { addToList: String(addToList) } : {}),
        ...(decodedReturnTo ? { returnTo: encodeURIComponent(decodedReturnTo) } : {}),
      },
    });
  };

  return (
    <ResponsiveAuthLayout
      showHero={!isDesktop}
      heroTitle="Verify your email"
      heroSubtitle={!isDesktop ? undefined : instructionCopy}
    >
      <View
        style={[
          styles.formContainer,
          isDesktop ? styles.formContainerDesktop : styles.formContainerMobile,
        ]}
      >
        {isDesktop && (
          <Text
            style={[styles.welcomeTitle, styles.welcomeTitleDesktop]}
          >
            Verify your email
          </Text>
        )}

        <Text
          style={[styles.otpMessage, isDesktop && styles.cardSubtitleDesktop]}
        >
          {instructionCopy}
        </Text>

        <View style={styles.otpInputsRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleDigitChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              style={isDesktop ? styles.otpInput : styles.mobileOtpInput}
              autoFocus={index === 0}
              returnKeyType="done"
            />
          ))}
        </View>

        <SocialButton
          onPress={handleVerify}
          icon={null}
          label={isVerifying ? "Verifying..." : "Verify code"}
          variant={!isDesktop ? "default" : "primary"}
          style={(!canVerify || isVerifying) ? { opacity: 0.65 } : undefined}
        />

        {errors.length > 0 && (
          <View style={styles.errorContainer}>
            {errors.map((message, index) => (
              <Text key={index} style={styles.errorText}>
                {message}
              </Text>
            ))}
          </View>
        )}

        {infoMessage && (
          <Text style={styles.resendText}>{infoMessage}</Text>
        )}

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn’t receive the code?
          </Text>
          <Pressable
            disabled={isResending || resendCooldown > 0}
            onPress={handleResend}
          >
            <Text
              style={[
                styles.resendLink,
                (isResending || resendCooldown > 0) && styles.resendLinkDisabled,
              ]}
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : "Resend code"}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={handleBackToSignup}>
          <Text style={styles.backLink}>Back to sign up</Text>
        </Pressable>
      </View>
    </ResponsiveAuthLayout>
  );
}
