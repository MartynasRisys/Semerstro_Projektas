import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import firebase from '../database/firebase';

export default class passwordreset extends Component {

constructor() {
    super();
    this.state = { 
      password: '',
      ms: 100000
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

DeleteStorage = async(user) =>{

 const storageRef = firebase.storage().ref().child(firebase.auth().currentUser.email+"/").listAll();
      var items = (await storageRef).items;
      items.forEach(element => {
        element.delete();
      }); 
    await user.delete();

  Alert.alert('Your account has been deleted');   
    this.props.navigation.goBack();
            this.props.navigation.goBack();
            this.props.navigation.goBack(); 
}


DeleteMyAccount = async() => {
    if(this.state.password === '') {
      Alert.alert('Enter password to delete your account!')
    }
    else {

            var user = firebase.auth().currentUser;

            var credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            this.state.password
        );
        
         user.reauthenticateWithCredential(credential).then(() =>  this.DeleteStorage(user)).catch(function(error) {
                Alert.alert('Wrong password')
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

        <Button
          color="#913bfa"
          title="Delete my account"
          onPress={() => this.DeleteMyAccount()}
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
    backgroundColor: '#913bfa'
  }
});