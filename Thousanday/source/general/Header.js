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
                title = "A hive for your pets";
                break;
            case "moment":
                title = "Love Moments with pets";
                break;
            case "love":
                title = "Moments on your list";
                break;
            case "addPet":
                title = "Add new pet";
                break;
            case "postMoment":
                title = "Share your moment";
                break;
            case "editProfile":
                title = "Tell the world about you";
                break;
            case "editPet":
                title = "Edit your pet";
                break;
            case "signup":
                title = "Register for your digital home";
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
