import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    ScrollView,
    Button,
    TouchableOpacity,
    Linking
} from "react-native";
import processError from "../../js/processError.js";
import ImagePicker from 'react-native-image-crop-picker';
class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: (this.props.platform === "google")?this.props.data.name.substr(0, 10): "",
            image: null,
            error: null
        };
    }
    //pick an image
    pickImg() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            mediaType: "photo",
            cropping: true,
        }).then(image => {
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: "image/jpg"},
                button: "Confirm Update?"
            });
        });
    }
    //open terms and conditions
    openTerms() {
        Linking.canOpenURL("https://thousanday.com/terms").then(supported => {
            if (supported) {
                Linking.openURL("https://thousanday.com/terms");
            } else {
                alert("Can't open this link");
            }
        });
    }
    //signup new users
    signUp() {
        let name = this.state.name.trim();
        if (name.length === 0 || name.length > 10) {
            this.setState({error: "Please type in your name."});
        } else if (!this.state.image) {
            this.setState({error: "Please upload avatar"});
        } else {
            let file = {uri: this.state.image.uri, type: 'multipart/form-data', name:'0.jpg'};
            let data = new FormData();
            data.append("name", name);
            data.append("file", file, "0.jpg");
            if (this.props.platform === "google") {
                data.append("token", this.props.data.idToken);
            } else {
                data.append("token", this.props.data.accessToken);
            }
            data.append("platform", this.props.platform);
            data.append("method", "mobile");
            fetch("http://192.168.0.13:7999/upload/create", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "multipart/form-data",
                },
                body: data
            })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    processError(response);
                }
            })
            .then((result) => {
                this.props.newUser(result, this.props.platform);
            });
        }
    }
    render() {
        return (
            <ScrollView style={styles.root}>
                <View style={styles.rootRow}>
                    <Text style={styles.rowLabel}>
                        Your username:
                    </Text>
                    <TextInput
                        onChangeText={(text) =>
                            this.setState({name: text.substr(0, 10)})
                        }
                        value={this.state.name}
                    />
                    <Text style={styles.rowHint}>
                        {this.state.name.length} / 10
                    </Text>
                </View>
                <View style={styles.rootImage}>
                    <Text style={styles.rowLabel}>
                        Your avatar:
                    </Text>
                    {
                        (this.state.image)? (
                            <Image
                                style={styles.imageProfile}
                                source={this.state.image}
                            />
                        ):null
                    }
                    <View style={styles.rootButton}>
                        <Button
                            onPress={this.pickImg.bind(this)}
                            title="Upload Avatar"
                            color="#841584"
                        />
                    </View>
                </View>
                <Text style={styles.rootError}>
                    {this.state.error}
                </Text>
                <Button
                    onPress={this.signUp.bind(this)}
                    title="SIGN UP"
                />
                <TouchableOpacity onPress={this.openTerms.bind(this)}>
                    <Text style={styles.rootTerm}>
                        By signing up, you agree to our Terms & Privacy Policy
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginTop: 20,
        marginHorizontal: 20
    },
    rootRow: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#f7d7b4",
        borderRadius: 5
    },
    rowLabel: {
        fontSize: 16,
        alignSelf: "flex-start",
        fontWeight: "bold"
    },
    rowHint: {
        marginLeft: 5
    },
    rootImage: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#f7d7b4",
        borderRadius: 5,
        marginVertical: 30,
        alignItems: "center"
    },
    imageProfile: {
        marginTop: 20,
        width: 200,
        height: 200,
        borderRadius: 5
    },
    rootError: {
        color: "red",
        fontSize: 14,
        marginBottom: 20
    },
    rootButton: {
        width: 200,
        marginTop: 20,
        marginBottom: 10
    },
    rootTerm: {
        marginTop: 40,
        marginBottom: 30,
        fontSize: 11
    },
});

export default Signup;
