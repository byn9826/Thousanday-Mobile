import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
class Home extends Component {
    render() {
        console.log(this.props.data);
        return (
            <View style={styles.header}>
                <Text style={styles.headerBrand}>
                    1231231231
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#ef8513"
    },
    headerBrand: {
        color: "white",
        fontSize: 16,
        marginLeft: 10
    }
});

export default Home;