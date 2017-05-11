import React, { Component } from "react";
import {
    StyleSheet,
    Image,
    View,
    TouchableOpacity
} from "react-native";
class Footer extends Component {
    render() {
        return (
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerTouch} onPress={this.props.changeView.bind(this, "watch")}>
                    <Image style={styles.touchIcon} source={this.props.view === "watch"?require("../../image/watch.png"):require("../../image/watch1.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerTouch} onPress={this.props.changeView.bind(this, "explore")}>
                    <Image style={styles.touchIcon} source={this.props.view === "explore"?require("../../image/explore.png"):require("../../image/explore1.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerTouch} onPress={this.props.changeView.bind(this, "camera")}>
                    <Image style={styles.touchIcon} source={require("../../image/camera1.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerTouch} onPress={this.props.changeView.bind(this, "love")}>
                    <Image style={styles.touchIcon} source={require("../../image/love1.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerTouch} onPress={this.props.changeView.bind(this, "home")}>
                    <Image style={styles.touchIcon} source={this.props.view === "home"?require("../../image/home.png"):require("../../image/home1.png")} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        backgroundColor: "#f7f9fc",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderColor: "#e5e5e5",
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center"
    },
    footerTouch: {
        padding: 10
    },
    touchIcon: {
        resizeMode: "contain"
    }
});

export default Footer;
