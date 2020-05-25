import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import firebase from '../database/firebase';

export default class passwordreset extends Component {

constructor() {
    super();
    this.state = { 
      email: ''
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

resetpassword = () => {
    if(this.state.email === '') {
      Alert.alert('Enter email address to reset password!')
    }
    else {
    
    var auth = firebase.auth();
    var emailAddress = this.state.email;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
        Alert.alert('A letter has been sent to your email address!')
    }).catch(function(error) {
        Alert.alert('Entered email address does not exist!')
    });
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

        <Button
          color="#913bfa"
          title="Reset my password"
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