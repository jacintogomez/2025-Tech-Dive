import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Text,
    FAB,
    Searchbar,
    IconButton,
    Menu,
    useTheme
} from 'react-native-paper';

import { useAuth } from '../context/AuthContext';
import PinCard from '../components/PinCard';
import LoadingView from '../components/LoadingView';
import { pinFunctions } from '../hooks/pinFunctions';

const { width } = Dimensions.get('window');
const numColumns = 2;
const pinWidth = (width - 48) / numColumns;

const createStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.dark ? '#333' : '#e0e0e0',
    },
    searchBar: {
        flex: 1,
        marginRight: 8,
        backgroundColor: theme.dark ? '#333' : '#e0e0e0',
        elevation: 0,
    },
    pinGrid: { padding: 16 },
    pinCard: {
        width: pinWidth,
        marginBottom: 16,
        marginRight: 16,
        elevation: 2,
        backgroundColor: theme.colors.elevation?.level1 || theme.colors.surface,
    },
    pinImage: { height: pinWidth },
    pinTitle: { padding: 8 },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

const HomeScreen = () => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const navigation = useNavigation();
    const { logout } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);

    const { pins, loading, error } = pinFunctions(navigation);

    const filteredPins = pins.filter(pin =>
        pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LoadingView theme={theme} />;
    if (error) return <Text style={{ textAlign: 'center', marginTop: 20 }}>Error: {error}</Text>;

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
                    <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Profile'); }} title="Profile" leadingIcon="account" />
                    <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Settings'); }} title="Settings" leadingIcon="cog" />
                    <Menu.Item onPress={() => { setMenuVisible(false); logout(); }} title="Logout" leadingIcon="logout" />
                </Menu>
            </View>

            <FlatList
                data={filteredPins}
                renderItem={({ item }) => <PinCard item={item} navigation={navigation} styles={styles} />}
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
