import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, BackHandler, Button, Alert } from 'react-native';
import firebase from '../database/firebase';
import { AntDesign } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { CheckBox } from 'react-native-elements';
import * as MediaLibrary from 'expo-media-library';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';

export default class Gallery extends Component{

    constructor() {
        super();
        this.state = { 
              assets: [],
              pressed: false,
              currentPicture: null,
              name:null,
              email: firebase.auth().currentUser.email,
              spejimai: [],
              pressedSpeti: false,
              checked: false,
              checkedChanges: false,
        }
    }

    componentDidMount()
    {
        this.displayImages();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    componentWillUnmount() 
    {
        this.setState({assets: []});
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    spetiNuotraukas= async(imageData)=>{
        const Clarifai = require('clarifai');
        const app = new Clarifai.App({
            apiKey: '379296912e97411ca0eccabf6c7d27b3'
        });
        let pre = await app.models.predict(
            Clarifai.GENERAL_MODEL,
            imageData
          );
        this.setState({spejimai:pre.outputs[0].data.concepts})
        
        Alert.alert(pre.outputs[0].data.concepts[0].name, 'Do you want to see more suggestions?', [
            {text: 'Cancel', onPress: () => console.log('More cancelled')},
            {text: 'Yes', onPress: () => {
                this.state.pressedSpeti = true;
                this.forceUpdate(); 
            }},
        ])
    }

    handleBackPress = async() => {
        if(this.state.currentPicture == null){
            this.props.navigation.goBack()
        }else if(this.state.pressedSpeti == true){
            this.state.pressedSpeti = false;
            this.forceUpdate();
        }else{
            await this.addOrDelete(this.state.currentPicture);
            this.state.currentPicture = null; 
            this.pressBack();       
        }
        return true;
    }

    addOrDelete = async(pic) => {
        if(this.state.checked != this.state.checkedChanges){
            if(this.state.checked == true){
                const response = await fetch(pic);
                const blob = await response.blob();  
                var refS = firebase.storage().ref().child("New/" + this.state.name);
                await refS.put(blob);     
            }else{
                const storageRefN = firebase.storage().ref().child("New/").listAll();
                var itemsN = (await storageRefN).items;
                itemsN.forEach(element=>{
                    this.deleteMain(element);           
                });    
            }
        }
    }

   async displayImages(){
        const storageRef = firebase.storage().ref().child(this.state.email+"/").listAll();
        var items = (await storageRef).items;
        items.forEach(item=>{
            this.issaugoti(item);
        })
    }

    async issaugoti(item){
        var data = [];
        data = this.state.assets;
        var url = await item.getDownloadURL();
        data.push(await url.toString());
        this.setState({assets:data})
    }

    pressHandler = async(picture) => {
        this.setState({currentPicture: picture})
        this.setname(picture);

        const storageRef = await firebase.storage().ref().child("New/").listAll();
        var items =  storageRef.items;
        items.forEach((item)=>{
            this.patikrinti(item);
        })

        this.state.pressed = true;
        this.forceUpdate();
    }

    setname = (url)=>{
        var regexConst = /%2F(.*?)\?alt/
        var ret = regexConst.exec(JSON.stringify(url))[1];
        this.setState({name:ret});
    }

    patikrinti = async(item) =>{
        var url = await item.getDownloadURL();   
        var regexConst = /%2F(.*?)\?alt/
        var ret = regexConst.exec(JSON.stringify(url))[1];
        var boolys = false;
        if(ret == this.state.name){
            boolys = true;
        }
        this.setState({checked: boolys});
        this.setState({checkedChanges: boolys});
        this.forceUpdate();
    }

    pressBack = () => {
        this.state.pressed = false;
        this.state.pressedSpeti = false;
        this.forceUpdate();
    }

    async pressDelete(){

        if(this.state.checked == true){
            const storageRefN = firebase.storage().ref().child("New/").listAll();
            var itemsN = (await storageRefN).items;
            itemsN.forEach(element=>{
                this.deleteMain(element);           
            });
        }

        const storageRef = firebase.storage().ref().child(this.state.email+"/").listAll();
        var items = (await storageRef).items;
        items.forEach(element=>{
           this.waitToDelete(element);           
        });
 
        this.state.pressed = false;
        this.forceUpdate();
       
    }

    async deleteMain(item){
        var n = await item.getDownloadURL();
        var regexConst = /%2F(.*?)\?alt/
        var ret = regexConst.exec(JSON.stringify(n))[1];
        if(ret == this.state.name){
            await item.delete();
        }
    }

    async waitToDelete(item){
        var url = await item.getDownloadURL();
        if(url == this.state.currentPicture){
           var data = this.state.assets;
           var kitas = [];
           data.forEach(item=>{
               if(item != this.state.currentPicture){
                   kitas.push(item);
               }
           })
           this.setState({assets: kitas});
           await item.delete();
        }
    }

    downloadPictureToPhone=async()=>{
        const fileUri = FileSystem.documentDirectory+'item.png';
        const im = await FileSystem.downloadAsync(this.state.currentPicture, fileUri);
        const createAsset = await MediaLibrary.createAssetAsync(im.uri);
        await MediaLibrary.createAlbumAsync("Expo", createAsset, false);
        await FileSystem.deleteAsync(fileUri);
        Alert.alert("Photo has been downloaded to the device!");
    }

    shareThePhoto = async() =>{
        let fileUri = FileSystem.documentDirectory+'item.png';
        await FileSystem.downloadAsync(this.state.currentPicture, fileUri);
        Sharing.shareAsync(fileUri);
        await FileSystem.deleteAsync(fileUri);
    }

    render(){
        return(      
            <View style={styles.container}>
                {!this.state.pressed && (
                    <FlatList
                        horizontal={false}
                        keyExtractor={(item) => item}
                        numColumns={3}
                        data={this.state.assets}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => this.pressHandler(item)}>
                                <Image
                                    style={styles.image}
                                    source={{uri: item}}
                                />
                            </TouchableOpacity>
                        )}
                    />
                )}
                {this.state.pressed && (
                    
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', height: '90%' }}>
                        <Image
                            style={styles.picture}
                            source={{ uri: this.state.currentPicture }}
                    />
                    {this.state.pressedSpeti && (
                    <FlatList
                        data={this.state.spejimai.map(spejimai => ({
                        key: `${spejimai.name} ${spejimai.value}`,
                    }))}
                        renderItem={({ item }) => (
                        <Text style={{ margin: 0.5, paddingLeft: 15, color: 'white', fontSize: 20 }}>{item.key}</Text>
                    )}
                     /> )}    

                        <CheckBox
                            center
                            title='Add to story'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checkedColor='#913bfa'
                            checked={this.state.checked}
                            onPress={() => this.setState({checked: !this.state.checked})}
                        />
                        <View style={styles.bottom}>
                            <View style={styles.bottomItem}>
                                <View style={styles.bottomItemInner}>
                                    <TouchableOpacity onPress={() => this.pressDelete()}>
                                        <AntDesign name="delete" size={50} color="#913bfa" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.bottomItem}>
                                <View style={styles.bottomItemInner}>
                                    <TouchableOpacity onPress={() => this.spetiNuotraukas(this.state.currentPicture)}>
                                        <Feather name="search" size={50} color="#913bfa" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.bottomItem}>
                                <View style={styles.bottomItemInner}>
                                    <TouchableOpacity onPress={() => this.downloadPictureToPhone()}>
                                        <MaterialIcons name="cloud-download" size={50} color="#913bfa" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.bottomItem}>
                                <View style={styles.bottomItemInner}>
                                    <TouchableOpacity onPress={() => this.shareThePhoto()}>
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
        flex: 1,
        backgroundColor: '#404040',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        padding: 10,
        margin: 10,
    },
    picture: {
        flex: 1
    },
    bottom: {
        height: '10%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
        backgroundColor: '#404040'
    },
    bottomItem: {
        height: '100%',
        width: '25%',
    },
    bottomItemInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
