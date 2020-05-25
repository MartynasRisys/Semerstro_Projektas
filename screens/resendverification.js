import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import firebase from '../database/firebase';

export default class resendverification extends Component {

constructor() {
    super();
    this.state = { 
      email: '',
      password: ''
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

resetpassword = () => {


    if(this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter email address and password!')
    }
    else {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
      
      var user = firebase.auth().currentUser;

      var valid = false;

      var emailVerified = user.emailVerified;


      if(emailVerified){
            Alert.alert('Email is allready verified')
            this.setState({ isLoading: false })
        }
      else{
          user.sendEmailVerification().then(function() {}).catch(function(error) {});
          Alert.alert('A new verification email has been sent');
      }
      })
      .catch(error => this.setState({}, Alert.alert('User with this email and password does not exist')) )
    }
       
  }


render() {

    return ( 
        
        <View style={styles.container}>  
        
        <TextInput
          style={styles.inputStyle}
          value={this.state.email}
          placeholder="Enter your email here"
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />

        <TextInput
          style={styles.inputStyle}
          value={this.state.password}
          placeholder="Enter your password here"
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          secureTextEntry={true}
        />

        <Button
          color="#913bfa"
          title="Resend verification email"
          onPress={() => this.resetpassword()}
        />   

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}>
          Go back to login page
        </Text>   


        </View>
    )
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