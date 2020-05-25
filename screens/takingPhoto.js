import React, {Component } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Image, BackHandler} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 

import firebase from '../database/firebase';

export default class TakingPhoto extends Component{
    
    componentDidMount()
    {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    componentWillUnmount() 
    {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    handleBackPress = () => {
        if(this.state.uploadPicture == null){
            this.props.navigation.goBack()
        }else{
            this.state.uploadPicture = null; 
            this.forceUpdate();       
        }
        return true;
    }


    constructor() {
        super();
        this.state = { 
            hasPermissions: null,
            uploadPicture: null,
            displayName: firebase.auth().currentUser.displayName,
            uid: firebase.auth().currentUser.uid,
            email: firebase.auth().currentUser.email
        }
    }
    
    save = async() => {
        const response = await fetch(this.state.uploadPicture.uri);
        const blob = await response.blob();
        var random = Math.random();
        var ref = firebase.storage().ref().child(this.state.email + "/" + random );
        await ref.put(blob);
        Alert.alert('Photo has been saved!', 'Do you want to show it to everyone?', [
            {text: 'No', onPress: () => console.log('Saved to everyone cancelled')},
            {text: 'Yes', onPress: () => this.saveEveryone(blob, random)},
        ])
        this.state.uploadPicture = null;   
        this.forceUpdate();
    }

    saveEveryone = async(blob, random) => {
        var refS = firebase.storage().ref().child("New/" + random );//////////////////////
        await refS.put(blob);    
    }

    deletePicture = () => {
        this.state.uploadPicture = null; 
        this.forceUpdate();
    }

    picture = async () => {
        if (this.camera) {
            const options = { quality: 1 };
            const result = await this.camera.takePictureAsync(options);
            this.state.uploadPicture = result;   
            this.forceUpdate();      
        }
    }

    choosePhoto = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.uri) {
            this.state.uploadPicture = pickerResult;
        }
        this.forceUpdate();
    }

    checkMultiPermissions = async() => {
        const { status, expires, permissions } = await Permissions.getAsync(
            Permissions.CAMERA,
            Permissions.AUDIO_RECORDING,
            Permissions.CAMERA_ROLL,
        );
        if (status !== 'granted') {
          alert('Hey! You have not enabled selected permissions');
        }
    }

    downloadFile(){
        Sharing.shareAsync(this.state.uploadPicture.uri);
    }

    render(){
        return(
            <View style={styles.container}>
                {!this.state.uploadPicture && ( <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={(ref) => { this.camera = ref; }}>
                    <View style={styles.top}></View>
                    <View style={styles.center}></View>
                    <View style={styles.bottom}>
                        <TouchableOpacity onPress={() => this.picture()}>   
                            <Feather name="circle" size={100} color="#913bfa" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.underBottom}>
                        <View style={styles.underBottomItem}>
                            <View style={styles.underBottomItemInner}>
                                <TouchableOpacity onPress={() => this.choosePhoto()}>
                                    <MaterialIcons name="photo-library" size={50} color="#913bfa" /> 
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.underBottomItem}>
                            <View style={styles.underBottomItemInner}>
                                <TouchableOpacity onPress={() => this.choosePhoto()}>
                                    <AntDesign name="qrcode" size={50} color="#913bfa" /> 
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.underBottomItem}>
                            <View style={styles.underBottomItemInner}>
                                <TouchableOpacity onPress={() => this.choosePhoto()}>
                                    <FontAwesome name="barcode" size={50} color="#913bfa" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.underBottomItem}>
                            <View style={styles.underottomItemInner}>
                                <TouchableOpacity onPress={() => this.choosePhoto()}>
                                    <Entypo name="text" size={50} color="#913bfa" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </View>
                </Camera> )}
                {this.state.uploadPicture && (
                <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', height: '90%'}}>
                    <Image
                        style={styles.picture}
                        source={{ uri: this.state.uploadPicture.uri }}
                    />
                    <View style={styles.bottomm}>
                        <View style={styles.bottomItem}>
                            <View style={styles.bottomItemInner}>
                            <TouchableOpacity onPress={()=> this.save()}>
                                <Entypo name="save" size={50} color="#913bfa" />
                            </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.bottomItem}>
                            <View style={styles.bottomItemInner}>
                                <TouchableOpacity onPress={() => this.deletePicture()}>
                                     <AntDesign name="delete" size={50} color="#913bfa" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.bottomItem}>
                            <View style={styles.bottomItemInner}>
                                <TouchableOpacity onPress={() => this.downloadFile()}>
                                    <AntDesign name="sharealt" size={50} color="#913bfa" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 1
    },
    top: {
        height: '10%',
        alignItems: 'flex-end',
    },
    center: {
        height: '60%',
    },
    bottom: {
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    underBottom: {
        height: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
        
    },
    underBottomItem: {
        height: '100%',
        width: '25%',
        padding: 10,
    },
    underBottomItemInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    picture: {

        flex: 1
    },
    centerFill: {
        height: '90%'
    },
    bottomm: {
        height: '10%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#404040'
    },
    bottomItem: {
        height: '100%',
        width: '33.333333%',
        padding: 30,
    },
    bottomItemInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});