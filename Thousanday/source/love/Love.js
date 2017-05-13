import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from "react-native";
class Love extends Component {
    render() {
        return (
            <View style={styles.root}>
                <View style={styles.rootHeader}>
                    <View style={styles.headerContain}>
                        <Image
                            source={require("../../image/follow.png")}
                        />
                        <Text style={styles.containSection}>
                            Watch
                        </Text>
                    </View>
                    <View style={styles.headerContain}>
                        <Image
                            source={require("../../image/love.png")}
                        />
                        <Text style={styles.containSection}>
                            Love
                        </Text>
                    </View>
                    <View style={styles.headerContain}>
                        <Image
                            source={require("../../image/comment.png")}
                        />
                        <Text style={styles.containSection}>
                            Comment
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 10
    },
    rootHeader: {
        flexDirection: "row",
        marginTop: 15,
        justifyContent: "center",
        flexWrap: "wrap"
    },
    headerContain: {
        backgroundColor: "#ef8513",
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 5,
        paddingHorizontal: 2,
        width: (Dimensions.get("window").width - 26) /3.5,
        marginHorizontal: 10,
        justifyContent: "center"
    },
});

export default Love;
