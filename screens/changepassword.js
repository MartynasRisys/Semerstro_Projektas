import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import firebase from '../database/firebase';

export default class changepassword extends Component {

constructor() {
    super();
    this.state = { 
      email: '',
      password: '',
      newpassword: '',
      newpassword2: ''
    }
  }

ChangeThepassword = () => {

    var user = firebase.auth().currentUser;

    user.updatePassword(this.state.newpassword).then(function() {
        Alert.alert('Your password has been changed')
    }).catch(function(error) {
        Alert.alert('Error ocured try later')
    });
}

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

resetpassword = () => {
    if(this.state.email === '') {
      Alert.alert('Enter your email address!')
    }
    else if(this.state.password === '')
    {
        Alert.alert('Enter your current password!')
    }
    else if(this.state.newpassword === '')
    {
        Alert.alert('Enter your new password!')
    }
    else if(this.state.newpassword2 === '')
    {
        Alert.alert('Repeat your new password!')
    }
    else if(this.state.newpassword2 != this.state.newpassword)
    {
        Alert.alert('New passwords do not match')
    }
    else {

        var user = firebase.auth().currentUser;

        var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.state.password
        );

        var pass = this.state.newpassword;
        
        user.reauthenticateWithCredential(credential).then(function() {           
            user.updatePassword(pass).then(function() {
                Alert.alert('Your password has been changed')
            }).catch(function(error) {
                Alert.alert('Error ocured try later')
            });
        }).catch(function(error) {
            Alert.alert('Wrong email or password')
        });
    }
       
  }


render() {

    return ( 
        
        <View style={styles.container}>  
        
        <TextInput
          style={styles.inputStyle}
          value={this.state.password}
          placeholder="Enter your password here"
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          secureTextEntry={true}
        />

        <TextInput
          style={styles.inputStyle}
          value={this.state.newpassword}
          placeholder="Enter your new password here"
          onChangeText={(val) => this.updateInputVal(val, 'newpassword')}
          secureTextEntry={true}
        />

        <TextInput
          style={styles.inputStyle}
          value={this.state.newpassword2}
          placeholder="Repeat your new password"
          onChangeText={(val) => this.updateInputVal(val, 'newpassword2')}
          secureTextEntry={true}
        />

        <Button
          color="#913bfa"
          title="Reset my password"
          onPress={() => this.resetpassword()}
        />   

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Settings')}>
          Go back to settings page
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
    backgroundColor: '#fff'
  }
});