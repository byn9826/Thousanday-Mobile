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
        return (
            <FlatList
                contentContainerStyle={styles.container}
                data = {this.props.data}
                renderItem={({item}) =>
                    <TouchableOpacity key={"publicwatch" + item.key} onPress={this.props.clickMoment.bind(null, item.id)}>
                        <CachedImage
                            source={{uri: item.key}}
                            style={styles.containerImage}
                        />
                    </TouchableOpacity>
                }
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                }}
                onEndReached={()=>{
                    //Scroll to end, Call load more images function
                    this.props.loadWatch();
                }}
                onRefresh={()=>{}}
                refreshing={this.props.refresh}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 2
    },
    containerImage: {
        width: Dimensions.get("window").width/2 - 1,
        height: Dimensions.get("window").width/2 - 1,
        resizeMode: "cover",
        marginBottom: 2,
        borderRadius: 5
    }
});

export default Watch;
