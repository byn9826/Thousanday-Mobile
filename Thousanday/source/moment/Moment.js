import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from "react-native";
import {CachedImage} from "react-native-img-cache";
class Moment extends Component {
    render() {
        console.log(this.props.data);
        let likeUsers = [], i;
        if (this.props.data[1].length !== 0) {
            for (i = 0; i < this.props.data[1].length; i++) {
                likeUsers.push(this.props.data[1][i][0]);
            }
        }
        return (
            <View style={styles.root}>
                <View style={styles.rootTop}>
                    <TouchableOpacity onPress={this.props.clickPet.bind(null, this.props.data[0].pet_id)}>
                        <CachedImage
                            source={{uri: "https://thousanday.com/img/pet/" + this.props.data[0].pet_id + "/cover/0.png"}}
                            style={styles.topAvatar}
                        />
                    </TouchableOpacity>
                    <View style={styles.topMessage}>
                        <Text style={styles.messageMoment}>
                            {this.props.data[0].moment_message}
                        </Text>
                        <Text style={styles.messageDate}>
                            {new Date(this.props.data[0].moment_date).toISOString().substring(0, 10)}
                        </Text>
                    </View>
                </View>
                <CachedImage
                    source={{uri: "https://thousanday.com/img/pet/" + this.props.data[0].pet_id + "/moment/" + this.props.data[0].image_name}}
                    style={styles.rootImg}
                />
                <View style={styles.rootSocial}>
                    <Text style={styles.socialLove}>
                        &#128151; {likeUsers.length}
                    </Text>
                    {/*&#128152;*/}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginTop: 10,
        alignItems: "center",
        marginHorizontal: 10,
    },
    rootTop: {
        marginVertical: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    topAvatar: {
        flex: 1,
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 15
    },
    topMessage: {
        flex: 5,
    },
    messageMoment: {
        fontSize: 16,
        backgroundColor: "black",
        color: "white",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    messageDate: {
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5
    },
    rootImg: {
        width: Dimensions.get("window").width - 40,
        height: 300,
        resizeMode: "contain",
        borderRadius: 5
    },
    rootSocial: {
        flexDirection: "row",
        alignSelf: "flex-start",
        marginHorizontal: 20,
        marginVertical: 10
    },
    socialLove: {
        fontSize: 20,

    }
});

export default Moment;
