import { styles } from "@/styles/auth";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header section with logo and toggle buttons */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>YallaWish</Text>
        </View>

        <View style={styles.toggleContainer}>
          <Link
            href="/sign-up"
            style={[styles.toggleButton, styles.inactiveToggle]}
          >
            <Text style={styles.inactiveToggleText}>Sign-up</Text>
          </Link>
          <Link
            href="/sign-in"
            style={[styles.toggleButton, styles.activeToggle]}
          >
            <Text style={styles.activeToggleText}>Login</Text>
          </Link>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Enter your details below</Text>

        {/* Form fields */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            keyboardType="email-address"
            onChangeText={setEmailAddress}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.eyeIcon}>
              <Text style={styles.eyeIconText}>👁</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>
              Forget your password ?
            </Text>
          </TouchableOpacity>

          <Pressable style={styles.loginButton} onPress={onSignInPress}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </Pressable>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
            <Link href="/sign-up">
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
