import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [showGenderPicker, setShowGenderPicker] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<(string | null)[]>([]);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: firstName,
        lastName: lastName,
        unsafeMetadata: {
          dateOfBirth: dateOfBirth,
          gender: gender,
          mobile: mobile,
        },
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as any).errors)
      ) {
        setError(
          (err as any).errors.map((e: any) => {
            return e.longMessage;
          })
        );
      } else {
        setError(["An unknown error occurred."]);
      }
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError([]);
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as any).errors)
      ) {
        setError(
          (err as any).errors.map((e: any) => {
            return e.longMessage;
          })
        );
      } else {
        setError(["An unknown error occurred."]);
      }
    }
  };

  if (pendingVerification) {
    return (
      <View
        style={{
          backgroundColor: "white",
          display: "flex",
          gap: 20,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Verify your email
        </Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10 }}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Pressable
          style={{
            backgroundColor: "#007AFF",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={onVerifyPress}
        >
          <Text>Verify</Text>
        </Pressable>
        <View>
          {error.length > 0 &&
            error.map((e, i) => (
              <Text key={i} style={{ color: "red" }}>
                {e}
              </Text>
            ))}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header section with logo and toggle buttons */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>yallawish</Text>
        </View>

        <View style={styles.toggleContainer}>
          <Link
            href="/sign-up"
            style={[styles.toggleButton, styles.activeToggle]}
          >
            <Text style={styles.activeToggleText}>Sign-up</Text>
          </Link>
          <Link
            href="/sign-in"
            style={[styles.toggleButton, styles.inactiveToggle]}
          >
            <Text style={styles.inactiveToggleText}>Login</Text>
          </Link>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>Login or Signup Today</Text>
        <Text style={styles.subtitle}>Enter your details below</Text>

        {/* Form fields */}
        <View style={styles.formContainer}>
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={firstName}
              placeholder="First Name"
              placeholderTextColor="#9ca3af"
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={lastName}
              placeholder="Last Name"
              placeholderTextColor="#9ca3af"
              onChangeText={setLastName}
            />
          </View>

          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => {
              // For now, we'll just show an alert. In a real app, you'd use a date picker
              console.log("Date picker functionality to be implemented");
            }}
          >
            <TextInput
              style={[styles.inputText, { flex: 1 }]}
              value={dateOfBirth}
              placeholder="Date of Birth"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              onChangeText={setDateOfBirth}
              editable={true}
            />
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => {
              setShowGenderPicker(!showGenderPicker);
            }}
          >
            <Text style={gender ? styles.inputText : styles.placeholderText}>
              {gender || "Gender"}
            </Text>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>

          {showGenderPicker && (
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => {
                  setGender("Male");
                  setShowGenderPicker(false);
                }}
              >
                <Text style={styles.pickerOptionText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => {
                  setGender("Female");
                  setShowGenderPicker(false);
                }}
              >
                <Text style={styles.pickerOptionText}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => {
                  setGender("Other");
                  setShowGenderPicker(false);
                }}
              >
                <Text style={styles.pickerOptionText}>Other</Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={styles.input}
            value={mobile}
            placeholder="Mobile"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            onChangeText={setMobile}
          />

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            onChangeText={setEmailAddress}
          />

          <TextInput
            style={styles.input}
            value={password}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <Pressable style={styles.signupButton} onPress={onSignUpPress}>
            <Text style={styles.signupButtonText}>Signup</Text>
          </Pressable>
        </View>

        {/* Social login section */}
        <View style={styles.socialSection}>
          <Text style={styles.orText}>Or continue with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>🍎</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error messages */}
        {error.length > 0 && (
          <View style={styles.errorContainer}>
            {error.map((e, i) => (
              <Text key={i} style={styles.errorText}>
                {e}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    overflowY: "scroll",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    padding: 4,
    width: "100%",
    maxWidth: 300,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    textAlign: "center",
  },
  activeToggle: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  inactiveToggle: {
    backgroundColor: "transparent",
  },
  activeToggleText: {
    color: "#1a1a2e",
    fontWeight: "600",
    fontSize: 16,
  },
  inactiveToggleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#2d1b69",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    gap: 20,
  },
  nameRow: {
    flexDirection: "row",
    gap: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "white",
    backgroundColor: "transparent",
  },
  halfInput: {
    flex: 1,
  },
  dropdownInput: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  inputText: {
    fontSize: 16,
    color: "white",
  },
  placeholderText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
  },
  chevron: {
    color: "white",
    fontSize: 12,
  },
  signupButton: {
    backgroundColor: "#00ffff",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "#1a1a2e",
    fontSize: 18,
    fontWeight: "bold",
  },
  socialSection: {
    marginTop: 40,
    alignItems: "center",
  },
  orText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  socialButtonText: {
    fontSize: 24,
    color: "white",
  },
  errorContainer: {
    marginTop: 20,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "#1a1a2e",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginTop: -10,
    overflow: "hidden",
  },
  pickerOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  pickerOptionText: {
    color: "white",
    fontSize: 16,
  },
});
