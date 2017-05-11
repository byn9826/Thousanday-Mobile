import React, { Component } from "react";
import {
    StyleSheet,
    Dimensions,
    FlatList,
} from "react-native";
import {CachedImage} from "react-native-img-cache";

class Watch extends Component {
    render() {
        return (
            <FlatList
                contentContainerStyle={styles.container}
                data = {this.props.data}
                renderItem={({item}) =>
                    <CachedImage
                        source={{uri: item.key}}
                        style={styles.containerImage}
                    />
                }
                onEndReached={()=>{
                    //Scroll to end, Call load more images function
                    this.props.loadWatch();
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 2
    },
    containerImage: {
        width: Dimensions.get("window").width/2.01,
        height: 180,
        resizeMode: "cover",
        marginBottom: 2,
        borderRadius: 5
    }
});

export default Watch;
