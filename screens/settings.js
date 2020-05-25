import React, { Component } from 'react';
import { StyleSheet, Text, View, BackHandler, TouchableOpacity, ImageBackground} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 



export default class Settings extends Component{ 


    componentDidMount()
    {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    componentWillUnmount() 
    {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {     
            this.props.navigation.goBack()        
            return true;
    }


    render() {

        return ( 
            
            <View style={styles.container}>
            <ImageBackground source={require('../assets/fonas_1.jpg')} blurRadius={1} style={styles.fonas}>
                <View style={styles.top}>
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}> 
                                <FontAwesome5 name="key" size={80} color="#913bfa" />
                            </TouchableOpacity>
                            <Text style = {styles.text}>Change password</Text>
                        </View>
                    </View>

                    <View style={styles.bottomItem}>
                        <View style={styles.bottomItemInner}>
                            <TouchableOpacity onPress = {() => this.props.navigation.navigate('DeleteAccount')}>
                                <AntDesign name="delete" size={80} color="#913bfa" />
                            </TouchableOpacity>
                            <Text style = {styles.text}>Delete account</Text>
                        </View>
                    </View>

                    <View style={styles.bottomItem}>
                        <View style={styles.bottomItemInner}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                                <MaterialCommunityIcons name="account-convert" size={80} color="#913bfa" />
                            </TouchableOpacity>
                            <Text style = {styles.text}>Logout</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            </View>
        )
    }

}

const styles = StyleSheet.create({
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