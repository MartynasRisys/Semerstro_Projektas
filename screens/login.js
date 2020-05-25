import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard, BackHandler } from 'react-native';
import firebase from '../database/firebase';
import * as Permissions from 'expo-permissions';

export default class Login extends Component {
  
  constructor() {
    super();
    this.state = { 
      email: '', 
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  userLogin = () => {
    if(this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter details to signin!')
    }
     else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
      
      var user = firebase.auth().currentUser;

      var valid = false;

      var emailVerified = user.emailVerified;
      console.log(res)


      if(!emailVerified){
            Alert.alert('Email is not verified')
            this.setState({ isLoading: false })
        }
      else{

        
        console.log('User logged-in successfully!')
        this.setState({
          isLoading: false,
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Home')
      }

      })
      .catch(error => this.setState({ isLoading: false }, Alert.alert('Wrong email or password')) )
    }
       
  }

  askMultiPermissions = async() => {
      const { status, expires, permissions } = await Permissions.askAsync(
          Permissions.CAMERA,
          Permissions.AUDIO_RECORDING,
          Permissions.CAMERA_ROLL
      );
      if (status !== 'granted') {
        Alert.alert('Hey!', 'You have not enabled selected permissions', [
          {text: 'Cancel', onPress: () => this.forceUpdate()},
          {text: 'Ok', onPress: () => BackHandler.exitApp()},
        ])
      }
  }

  render() {
    this.askMultiPermissions();
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    
    return (
      <TouchableWithoutFeedback onPress = {() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>  
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />   
        <Button
          color="#913bfa"
          title="Signin"
          onPress={() => this.userLogin()}
        />   

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          Don't have account? Click here to signup
        </Text>      

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Reset')}>
          Forgot your password?
        </Text>

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('ResendVerification')}>
          Resend verification email
        </Text>  

      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#404040'
  },
  inputStyle: {
    color: '#913bfa',
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
    color: '#913bfa',
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#913bfa'
  }
});