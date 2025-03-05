import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import Ico2 from 'react-native-vector-icons/Entypo';
import { Formik } from 'formik';
import * as yup from 'yup';
import { RadioButton } from 'react-native-paper';
import { useEffect, useState } from 'react';
function Signup({ route, navigation }) {

  const [selectedValue, setSelectedValue] = useState('Job Seeker');
  const { data } = route.params;
  const [loading,setLoading]=useState(false);
  const [fullData, setFullData] = useState({
    full_name: data.full_name,
    aadhaar_number: data.aadhaar_number,
    dob: data.dob,
    gender: data.gender,
    country: data.address.country,
    state: data.address.state,
    dist: data.address.dist,
    loc: data.address.loc,
    zip: data.zip,
    phone: '',
    email: '',
    password: '',
    userType: selectedValue
  })


  const loginValidationSchema = yup.object().shape({
    phone: yup
      .string()
      .matches(/^[0-9]+$/, 'Please enter a valid phone number') // Custom regex for phone numbers
      .required('Phone is required'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email address is required'),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
    userType: yup
      .string()
  });




  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView>
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={fullData}
          onSubmit={async values => {
            setLoading(true)
            console.log('Submitting:', values);
            navigation.navigate('ProfileImage', {
              data: {
                ...data,
                phone: values.phone,
                email: values.email,
                password: values.password,
                userType: values.userType,
              }
            });
            setLoading(false)
          }}

        >

          {({ handleChange, handleBlur, handleSubmit, values, errors ,setFieldValue}) => (
            <View style={styles.container}>
              <Ico2 name='arrow-with-circle-left' style={styles.backIcon} onPress={() => { navigation.goBack() }} />
              <View>
                <Text style={styles.heading}>Register yourself</Text>
                <Text style={styles.subTitles}>Required fields have an asterisk</Text>
              </View>

              {/* Full Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>FULL NAME</Text>
                <TextInput
                  style={styles.inputFiled}
                  placeholder='Lalan Chaudhary'
                  value={data.full_name}
                />
              </View>

              {/* Aadhar */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>ADHAR</Text>
                <TextInput
                  style={styles.inputFiled}
                  placeholder=''
                  value={data.aadhaar_number}
                />
              </View>

              {/* DOB */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>DOB</Text>
                <TextInput
                  style={styles.inputFiled}
                  placeholder=''
                  value={data.dob}
                />
              </View>

              {/* Address */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>ADDRESS</Text>
                <TextInput
                  style={styles.inputFiled}
                  placeholder=''
                  value={data.address.loc}
                />
              </View>

              {/* Zip */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>ZIP</Text>
                <TextInput
                  style={styles.inputFiled}
                  placeholder=''
                  value={data.zip}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labels}>User Type</Text>
                <RadioButton.Group
                  onValueChange={newValue => {
                    setSelectedValue(newValue);
                    setFieldValue('userType', newValue);  // Updating Formik field
                  }}
                  value={selectedValue}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="Job Seeker" />
                      <Text>Job Seeker</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="Job Provider" />
                      <Text>Job Provider</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Phone */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>PHONE <Text style={{ color: 'red' }}> *</Text></Text>
                <TextInput
                  style={[styles.inputFiled, { borderColor: errors.phone ? 'red' : 'grey' }]}
                  placeholder=''
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  keyboardType='numeric'
                />
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>EMAIL <Text style={{ color: 'red' }}> *</Text></Text>
                <TextInput
                  style={[styles.inputFiled, { borderColor: errors.email ? 'red' : 'grey' }]}
                  placeholder=''
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType='email-address'
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>PASSWORD <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                  style={[styles.inputFiled, { borderColor: errors.password ? 'red' : 'grey' }]}
                  placeholder=''
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                />
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>CONFIRM <Text style={{ color: 'red' }}> *</Text></Text>
                <TextInput
                  style={[styles.inputFiled, { borderColor: errors.confirmPassword ? 'red' : 'grey' }]}
                  placeholder=''
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry
                />
              </View>



              {/* Submit Button */}
              <TouchableOpacity style={styles.next_btn} onPress={handleSubmit}>
                <Text style={styles.btn_text}>NEXT {!loading?<Icon name='right' style={{ fontSize: 16 }} />:'...'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backIcon: {
    position: 'absolute',
    fontSize: 25,
    left: 20,
    top: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: 'black',
    marginTop: 50,
    marginBottom: 10,
  },
  subTitles: {
    fontSize: 14,
    color: '#252525',
    fontWeight: '400',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginVertical: 10,
    width: '100%',
  },
  labels: {
    fontSize: 18,
    color: '#4d4d4d',
    fontWeight: '700',
    width: '30%',
  },
  inputFiled: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    textAlign: 'start',
    fontSize: 18,
    width: '60%',
    paddingHorizontal: 10,
    // minHeight: 80, // Ensure enough space for wrapping
    // textAlignVertical: 'top', // Align text from the top
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  next_btn: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3c69a4',
    borderRadius: 30,
    marginVertical: 50,
    gap: 10,
  },
  btn_text: {
    color: 'white',
    fontSize: 16,
  },
});
