import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/home';
import Gallery from '../screens/gallery';
import TakingPhoto from '../screens/takingPhoto';
import Settings from '../screens/settings';
import Reset from '../screens/passwordreset';
import ChangePassword from '../screens/changepassword';
import DeleteAccount from '../screens/deleteaccount';
import ResendVerification from '../screens/resendverification';
import Comments from '../screens/comments';


import Login from '../screens/login';
import Signup from '../screens/signup';

const Stack = createStackNavigator();

export default function HomeStack(){
    return (
        <NavigationContainer>
            <Stack.Navigator
               screenOptions={
                   {headerTitleAlign: 'center', headerTintColor: '#913bfa', headerLeft: null, headerStyle: {backgroundColor: '#404040'  }}
               }
            >
                <Stack.Screen name="Login" component={Login}/>  
                <Stack.Screen name="SignUp" component={Signup}/>        
                <Stack.Screen name="Home" component={Home}/>       
                <Stack.Screen name="Gallery" component={Gallery}/>       
                <Stack.Screen name="Photo" component={TakingPhoto}/>
                <Stack.Screen name="Settings" component={Settings}/>
                <Stack.Screen name="Reset" component={Reset}/>
                <Stack.Screen name="ChangePassword" component={ChangePassword}/>
                <Stack.Screen name="DeleteAccount" component={DeleteAccount}/>
                <Stack.Screen name="ResendVerification" component={ResendVerification}/>
                <Stack.Screen name="Comments" component={Comments}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}