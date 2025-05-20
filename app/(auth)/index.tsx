import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import { supabase } from '@/utils/supabase';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with `TOKEN_REFRESHED` or `SIGNED_OUT` if session changes.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// CustomInput: wraps a TextInput with a label (optional) and error styles.
// Based on patterns from reusable input tutorials :contentReference[oaicite:3]{index=3}.
const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
}: {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}) => (
  <View style={styles.inputContainer}>
    {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoCapitalize="none"
      secureTextEntry={secureTextEntry}
    />
  </View>
);

// CustomButton: a reusable button component using TouchableOpacity.
// This approach follows best practices of custom buttons in React Native :contentReference[oaicite:4]{index=4}.
const CustomButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
}: {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      disabled ? styles.buttonDisabled : styles.buttonEnabled,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.7} // ensures a pleasant opacity feedback :contentReference[oaicite:5]{index=5}
  >
    {loading ? (
      <ActivityIndicator color="#FFFFFF" />
    ) : (
      <Text style={styles.buttonText}>{title}</Text>
    )}
  </TouchableOpacity>
);

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    } else if (!session) {
      Alert.alert('Please check your inbox for email verification!');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <CustomInput
          label="Email"
          placeholder="email@address.com"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <CustomInput
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <CustomButton
          title="Sign In"
          onPress={signInWithEmail}
          disabled={loading}
          loading={loading}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <CustomButton
          title="Sign Up"
          onPress={signUpWithEmail}
          disabled={loading}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  // Input styles
  inputContainer: {
    marginVertical: 8,
  },
  inputLabel: {
    marginBottom: 4,
    fontSize: 14,
    color: '#333333',
  },
  textInput: {
    height: 48,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000000',
  },
  // Button styles
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#2e86de',
  },
  buttonDisabled: {
    backgroundColor: '#a5b1c2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
