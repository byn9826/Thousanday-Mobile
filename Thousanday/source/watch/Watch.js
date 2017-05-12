import React, { Component } from "react";
import {
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity
} from "react-native";
import {CachedImage} from "react-native-img-cache";

class Watch extends Component {
    render() {
        console.log(this.props.data);
        return (
            <FlatList
                contentContainerStyle={styles.container}
                data = {this.props.data}
                renderItem={({item}) =>
                    <TouchableOpacity onPress={this.props.clickMoment.bind(null, item.id)}>
                        <CachedImage
                            source={{uri: item.key}}
                            style={styles.containerImage}
                        />
                    </TouchableOpacity>
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
