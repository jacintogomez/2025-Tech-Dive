import React, {useState} from 'react';
import {Image} from 'react-native';
import {Card} from 'react-native-paper';

const PinCard=({item,navigation,styles}) =>{
    const [imageError, setImageError]=useState(false);

    return (
        <Card style={styles.pinCard} onPress={()=>navigation.navigate('PinDetail',{ pinId:item._id })}>
            <Image
                source={imageError||!item.imageUrl ? require('../assets/no-image.png'):{uri:item.imageUrl }}
                style={styles.pinImage}
                onError={()=>setImageError(true)}
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

export default PinCard;
