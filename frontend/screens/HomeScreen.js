import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Text, Card, ActivityIndicator, FAB, Searchbar, IconButton, Menu, useTheme} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { pinsAPI } from '../services/api';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Image} from 'react-native';

const { width } = Dimensions.get('window');
const numColumns = 2;
const pinWidth = (width - 48) / numColumns; // 48 = padding (16) * 2 + gap (16)

const createStyles =(theme)=> StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.dark?'#333':'#e0e0e0',
    },
    searchBar: {
        flex: 1,
        marginRight: 8,
        backgroundColor: theme.dark?'#333':'#e0e0e0',
        elevation: 0,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    pinGrid: {
        padding: 16,
    },
    pinCard: {
        width: pinWidth,
        marginBottom: 16,
        marginRight: 16,
        elevation: 2,
        backgroundColor: theme.colors.elevation?.level1||theme.colors.surface,
    },
    pinImage: {
        height: pinWidth,
    },
    pinTitle: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

const PinCard = ({ item, navigation,styles }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Card
            style={styles.pinCard}
            onPress={() => navigation.navigate('PinDetail', { pinId: item._id })}
        >
            <Image
                source={
                    imageError || !item.imageUrl
                        ? require('../assets/no-image.png')
                        : { uri: item.imageUrl }
                }
                style={styles.pinImage}
                onError={() => setImageError(true)}
                resizeMode="cover"
            />
            <Card.Title
                title={item.title}
                subtitle={item.description}
                titleNumberOfLines={2}
                subtitleNumberOfLines={2}
                style={styles.pinTitle}
            />
        </Card>
    );
};


const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const theme=useTheme();
    const styles=createStyles(theme);

    const fetchPins = async () => {
        try {
            setLoading(true);
            const response = await pinsAPI.getAllPins();
            setPins(response);
            setError(null);
        } catch (err) {
            console.error('Error fetching pins:', err);
            setError('Failed to load pins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPins();
        const unsubscribe = navigation.addListener('refreshHome', () => {
            fetchPins();
        });
        return unsubscribe;
    }, [navigation]);

    const filteredPins = pins.filter(pin =>
        pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isvalidimageurl=(url)=>{
        console.log('url is ',url);
        return typeof url==='string'&&url.trim()!=='';
    }

    const renderPin = ({ item }) => <PinCard item={item} navigation={navigation} styles={styles}/>;

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search pins"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor="#E60023"
                />
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <IconButton
                            icon="account-circle"
                            size={24}
                            onPress={() => setMenuVisible(true)}
                            iconColor="#E60023"
                        />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate('Profile');
                        }}
                        title="Profile"
                        leadingIcon="account"
                    />
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate('Settings');
                        }}
                        title="Settings"
                        leadingIcon="cog"
                    />
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            logout();
                        }}
                        title="Logout"
                        leadingIcon="logout"
                    />
                </Menu>
            </View>

            <FlatList
                data={filteredPins}
                renderItem={renderPin}
                keyExtractor={(item) => item._id}
                numColumns={numColumns}
                contentContainerStyle={styles.pinGrid}
                showsVerticalScrollIndicator={false}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('CreatePin')}
                color="#fff"
                backgroundColor="#E60023"
            />
        </View>
    );
};

export default HomeScreen;