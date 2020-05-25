import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert, BackHandler, ImageBackground, FlatList, Image} from 'react-native';
import firebase from '../database/firebase';
import { Ionicons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { EvilIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 


export default class Home extends Component{
   
    constructor() {
        super();
        this.state = { 
            assets: [],
            email:firebase.auth().currentUser.email,
            picture:null,
            pressed:false,
            seed:0,
            name: null,
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
  
    handleBackPress = () => {
        if(this.state.picture == null){
            this.pressExit();
        }else{
            this.state.picture = null; 
            this.pressBack();       
        }
        return true;
    }
    
    pressBack = () => {
        this.state.pressed = false;
        this.forceUpdate();
    }

    pressExit = () => {
        Alert.alert('Sure?', 'Do you really want to exit?', [
            {text: 'Cancel', onPress: () => console.log('Exit cancelled')},
            {text: 'Yes', onPress: () => BackHandler.exitApp()},
        ])
    }

    async displayImages(){
        var data = [];
        this.setState({assets: data});
        const storageRef = firebase.storage().ref().child("New/").listAll();
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
    pressHandler = (picture) => {
        this.setState({picture: picture})
        this.setname(picture);
        this.state.pressed = true;
        this.forceUpdate();
    }

    refresh(){
        this.setState({seed:this.state.seed+1},()=>this.displayImages());
    }

    setname = (url)=>{
        var regexConst = /%2F(.*?)\?alt/
        var ret = regexConst.exec(JSON.stringify(url))[1];
        this.setState({name:ret});
    }

    render(){
     
        return (
            <View style={styles.container}>
                {this.state.pressed && (
                    <View style={styles.topC}>
                        <Image style={styles.picture} source={{ uri: this.state.picture }}/>
                        <View style={styles.topBottom}>
                            <View style={styles.topBottomItem}>
                                <View style={styles.topBottomItemInner}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Comments', { name:this.state.name })}>
                                        <FontAwesome name="comments" size={50} color="#913bfa" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.topBottomItem}>
                                <View style={styles.topBottomItemInner}>
                                    <TouchableOpacity onPress={() => this.downloadPictureToPhone()}>
                                        <MaterialIcons name="cloud-download" size={50} color="#913bfa" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.topBottomItem}>
                                <View style={styles.topBottomItemInner}>
                                    <TouchableOpacity onPress={() => this.shareThePhoto()}>
                                        <AntDesign name="sharealt" size={50} color="#913bfa" />
                                    </TouchableOpacity>
                                </View>
                            </View>   
                        </View>
                    </View>
                )}
                {!this.state.pressed && (
                    <ImageBackground source={require('../assets/fonas_1.jpg')} blurRadius={1} style={styles.fonas}>
                        <View style={styles.top}>
                        <TouchableOpacity onPress={()=> this.refresh()}><Text style = {styles.text}>Refresh recent images</Text></TouchableOpacity>
                            <View style={styles.story}>
                                <FlatList
                                    extraData={this.state.refresh}
                                    horizontal={true}
                                    data={this.state.assets}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => this.pressHandler(item)}>
                                            <Image style={styles.image} source={{uri: item}}/>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                            <View style={styles.logo}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Photo')}>
                                    <AntDesign name="search1" size={80} color="#913bfa"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.center}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Photo')}>
                                <Text style = {styles.text1}>FIND MY ITEM</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottom}>
                            <View style={styles.bottomItem}>
                                <View style={styles.bottomItemInner}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Photo')}>  
                                        <Entypo name="camera" size={80} color="#913bfa" />
                                    </TouchableOpacity>
                                    <Text style = {styles.text}>Take a photo</Text>
                                </View>
                            </View>
                            <View style={styles.bottomItem}>
                                <View style={styles.bottomItemInner}>           
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Gallery')} >
                                        <Ionicons name="md-photos" size={80} color="#913bfa" />
                                    </TouchableOpacity>
                                    <Text style = {styles.text}>Gallery</Text>
                                </View>
                            </View>
                            <View style={styles.bottomItem}>
                                <View style={styles.bottomItemInner}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')} >
                                        <MaterialIcons name="settings" size={80} color="#913bfa" />
                                    </TouchableOpacity>
                                    <Text style = {styles.text}>Settings</Text>
                                </View>
                            </View>
                            <View style={styles.bottomItem}>
                                <View style={styles.bottomItemInner}>                        
                                    <TouchableOpacity onPress = {() => this.pressExit()}>
                                        <MaterialIcons name="exit-to-app" size={80} color="#913bfa" />
                                    </TouchableOpacity>
                                    <Text style = {styles.text}>Exit</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                )}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    topC: {
        flex: 1
    },
    topBottom: {
        height: '10%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
        backgroundColor: '#404040'
    },
    topBottomItem: {
        height: '100%',
        width: '33.3333%',
    },
    topBottomItemInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    story: {
        flex: 1
    },
    image: {
        width: 100,
        height: 100,
        padding: 10,
        margin: 10,
        borderColor: 'white',
        borderRadius: 180,
        borderWidth: 2
    },
    picture: {
        flex: 1
    },
    container: {
        flex: 1,
    },
    top: {
        height: '45%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fonas: {
        flex: 1
    },
    logo: {
        width: 140,
        height: 140,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: '#913bfa',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(69, 23, 98, 0.2 )',
        padding: 5,
        margin: 25
    },
    center: {
        height: '10%',
    },
    bottom: {
        height: '45%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
    },
    bottomItem: {
        width: '50%',
        height: '50%',
        padding: 5,
    },
    bottomItemInner: {
        flex: 1,
        borderRadius: 20,  
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(69, 23, 98, 0.2 )',
    },
    text: {
        fontSize: 18, 
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'sans-serif-light'
    },
    text1: {
        fontSize: 50, 
        color: '#fff', 
        alignItems: 'center',
        textAlign: 'center',
        borderColor: '#fff',
        borderWidth: 3,
        height: '100%',
        fontFamily: 'sans-serif-light'
    }  
}); 