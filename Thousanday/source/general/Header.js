import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
class Header extends Component {
    render() {
        let title;
        switch (this.props.title) {
            case "watch":
                title = "Watch the world";
                break;
            case "explore":
                title = "Explore the cute";
                break;
            case "pet":
                title = "Pet in digital hub";
                break;
            case "user":
                title = "Pets Mommy or Daddy";
                break;
            case "home":
                title = "A space for your pets";
                break;
        }
        return (
            <View style={styles.header}>
                <Text style={styles.headerBrand}>
                    {title}
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

export default Header;
