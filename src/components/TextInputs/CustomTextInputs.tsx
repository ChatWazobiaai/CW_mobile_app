import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {Colors} from '../Colors/Colors';
import {BoldText, RegularText} from '../Texts/CustomTexts/BaseTexts'; // Import your custom text component

interface CustomTextInputProps {
  label?: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean; // Optional for password input
  width?: string | number; // Accepts string or number for width
  error?: string | any; // Error message
  errorColor?: string; // Custom error color
  value?: string;
  numeric?: boolean;
}

interface PhoneNumberInputProps {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  width?: string | number; // Accepts string or number for width
  error?: string; // Error message
  errorColor?: string; // Custom error color
  value?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  onChangeText,
  isPassword = false,
  width = '100%', // Default width is 100%
  error,
  value,
  numeric = false,
  errorColor = Colors.errorColor, // Default error color
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Add state for focus

  // Determine border and label color based on error state
  const borderColor = error
    ? errorColor
    : isFocused
    ? Colors.primaryColor
    : Colors.grayColor65;
  const labelColor = error
    ? errorColor
    : isFocused
    ? Colors.primaryColor
    : Colors.grayColor;

  return (
    <View style={[styles.container, {width} as any]}>
      {label && (
        <View
          style={{
            backgroundColor: '#121212',
            // borderWidth: 2,
            // borderColor: '#fff',
            alignSelf: 'flex-start',
            padding: 4,
            borderRadius: 12,
            marginTop: -12,
            paddingHorizontal: 10,
            position: 'absolute',
            zIndex: 2,
            marginLeft: 16,
          }}>
          <BoldText
            fontSize={16}
            color={labelColor} // Change color based on focus or error state
            style={[
              styles.label,
              {
                marginTop: 0,
              },
            ]} // Add style prop for top margin
          >
            {label}
          </BoldText>
        </View>
      )}
      <View style={[styles.inputContainer, {borderColor}]}>
        {isPassword ? (
          <>
            <TextInput
              value={value}
              style={[
                styles.input,
                {
                  color: error ? Colors.errorColor : Colors.primaryColor,
                },
              ]}
              placeholder={placeholder}
              placeholderTextColor={Colors.grayColor65}
              secureTextEntry={!showPassword}
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)} // Set focus state to true
              onBlur={() => setIsFocused(false)} // Set focus state to false
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.togglePassword}>
              <Text style={styles.togglePasswordText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </>
        ) : numeric ? (
          <TextInput
            keyboardType="numeric"
            value={value}
            style={[
              styles.input,
              {
                color: error ? Colors.errorColor : Colors.primaryColor,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={Colors.grayColor65}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)} // Set focus state to true
            onBlur={() => setIsFocused(false)} // Set focus state to false
          />
        ) : (
          <TextInput
            value={value}
            style={[
              styles.input,
              {
                color: error ? Colors.errorColor : Colors.primaryColor,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={Colors.grayColor65}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)} // Set focus state to true
            onBlur={() => setIsFocused(false)} // Set focus state to false
          />
        )}
      </View>
      {error && (
        <RegularText fontSize={14} color={errorColor} style={styles.errorText}>
          {error}
        </RegularText>
      )}
    </View>
  );
};

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  placeholder,
  onChangeText,
  width = '100%',
  error,
  value,
  errorColor = Colors.errorColor, // Default error color
}) => {
  const [isFocused, setIsFocused] = useState(false); // Add state for focus

  // Determine border and label color based on error state
  const borderColor = error
    ? errorColor
    : isFocused
    ? Colors.primaryColor
    : Colors.grayColor65;
  const labelColor = error
    ? errorColor
    : isFocused
    ? Colors.primaryColor
    : Colors.grayColor;
  const {fontScale} = useWindowDimensions();
  return (
    <View style={[styles.container, {width} as any]}>
      <RegularText
        fontSize={16}
        color={labelColor} // Change color based on focus or error state
        style={styles.label} // Add style prop for top margin
      >
        {label}
      </RegularText>
      <View style={[styles.phoneInputContainer, {borderColor}]}>
        <View style={styles.flagContainer}>
          <Text style={styles.flagText}>🇳🇬</Text>
          <Text style={styles.countryCode}>+234</Text>
        </View>
        <TextInput
          allowFontScaling={false}
          value={value}
          style={[
            styles.input,
            {
              color: error ? Colors.errorColor : Colors.primaryColor,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.grayColor65}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)} // Set focus state to true
          onBlur={() => setIsFocused(false)} // Set focus state to false
        />
      </View>
      {error && (
        <RegularText fontSize={14} color={errorColor} style={styles.errorText}>
          {error}
        </RegularText>
      )}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 17, // Apply top margin of 23
  },
  inputContainer: {
    borderWidth: 1.7,
    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 4 : 3,
  },
  phoneInputContainer: {
    borderWidth: 1.7,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 4 : 3,
  },
  input: {
    flex: 1,
    fontSize: 17,
    // Input text color when typing
    fontFamily: Platform.OS === 'android' ? 'LufgaSemiBold' : 'Lufga-SemiBold',
    paddingVertical: 20,
    backgroundColor: '#ffffff09',
    padding: Platform.OS === 'android' ? 6 : 14,
    // Set font family to Lufga Regular
  },
  togglePassword: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  togglePasswordText: {
    color: Colors.grayColor,
    fontSize: 14, // Reduced font size to 14
    fontFamily: Platform.OS === 'android' ? 'LufgaRegular' : 'Lufga-Regular',
    // Set font family to Lufga Regular
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flagText: {
    fontSize: 20,
  },
  countryCode: {
    color: Colors.grayColor,
    fontSize: 16,
    fontFamily: Platform.OS === 'android' ? 'LufgaRegular' : 'Lufga-Regular',
    // Set font family to Lufga Regular
  },
  errorText: {
    //fontSize: 14,
    marginTop: 4, // Spacing between input and error message
    fontFamily: Platform.OS === 'android' ? 'LufgaRegular' : 'Lufga-Regular',
    // Set font family for error text
  },
});
