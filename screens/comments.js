import React, { useState, useEffect, Component } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, TextInput, Keyboard, Button} from 'react-native';
import { setProvidesAudioData } from 'expo/build/AR';
import firebase from '../database/firebase';
import { set } from 'react-native-reanimated';

import 'firebase/firestore';

export default function Comments({ route, navigation }){
    const id = firebase.auth().currentUser.displayName;
    const { name } = route.params;
    var text = 'nill';

    name1 = "TestDummyImage1";
    name2 = "TestDummyImage2";

    var subName = name.substr(2);/// reikia, nes nuotraukos prasideda 0. o i db negalima key kad turetu ,./?! ir pan.
    var users=[];
    var comms=[];

    /* db struktura
    *   /images                 (pagr kolekcija, dummy testams)
    *    +{image name}
    *     /comments             (komentaru kolekcija apacioj info apie tuos komentarus)
    *      +string(comment)
    *      +string(user)
    *     +bool state           (nepridejau bet glaima pridet add field paspuadus ant image name)
    */

    addUser = () => {
        const db = firebase.firestore();
        const ur = db.collection('images').doc(subName).set({},{merge:true});
        const userRef = db.collection('dummy').doc(subName).collection('comments').add({
            user: id,
            text: text
          }); 
    };
    showComm = async() => {
        //users=[];
        //comms=[];
        const db = firebase.firestore();
        ////dummy - pagr. kolekcijos pav; subName - dokumentas(nuotraukos name bus); comments - komentaru kolekcija

        const ref = db.collection('images').doc(subName).collection('comments').get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
            users.push(doc.data().user);
            comms.push(doc.data().text);
        })}); 
        
    };
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text>GoBACK</Text>
            </TouchableOpacity>
        <Text>ImageName: {name}</Text>
        <Text>Uname: {id}</Text>
        <Text></Text><Text></Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Comment"
          onChangeText={(t) => text=t}
        />
        <Button
          color="#913bfa"
          title="Post"
          onPress={addUser}
        />  
        <Button
          color="#913bfa"
          title="Show"
          onPress={showComm}
        />       
        <FlatList
            horizontal={false}
            keyExtractor={(item) => item.id}
            numColumns={1}
            data={users}///////////////// users - useriai, comms - comentarai
            renderItem={({item}) => ( <Text>{item}</Text> )}
        />
        <Text></Text><Text></Text>
        
      </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputStyle: {
        color: '#913bfa',
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderBottomWidth: 1
      },
      loginText: {
        color: '#913bfa',
        marginTop: 25,
        textAlign: 'center'
      },
    image: {
        width: 100,
        height: 100,
        padding: 10,
        margin: 10,
    },
    list: {
        flex: 1,
    },

    pictureTake: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingTop: 500,
    },
    upload: {
        flex: 3,
        alignItems: 'flex-end',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    picture: {
        flex: 1,
    },
    text: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ff6600',
        borderRadius: 10,
        color: '#ff6600',
        fontSize: 20,
        padding: 20,
        margin: 20,
    },
    text2: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ff6600',
        borderRadius: 10,
        color: '#ff6600',
        fontSize: 20,
        paddingVertical: 20,
        paddingHorizontal: 30,
        margin: 20,
    },
    savingButtons: {
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        width: '100%',
        height: '10%',
        margin: 10,
    }
})
