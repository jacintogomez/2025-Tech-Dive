import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider,MD3LightTheme,MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider,useSettings } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import PinDetailScreen from './screens/PinDetailScreen';
import CreatePinScreen from './screens/CreatePinScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <MainApp/>
            </SettingsProvider>
        </AuthProvider>
    );
}

const MainApp=()=>{
    const {settings}=useSettings();
    const theme=settings.darkMode?MD3DarkTheme:MD3LightTheme;
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                <Stack.Navigator
                    initialRouteName="Login"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: theme.colors.background,
                        },
                        headerTintColor: theme.colors.background,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="PinDetail"
                        component={PinDetailScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="CreatePin"
                        component={CreatePinScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
                <StatusBar style={settings.darkMode?'light':'dark'} />
            </NavigationContainer>
        </PaperProvider>
    );
}