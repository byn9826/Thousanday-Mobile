import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import {ImageCache} from "react-native-img-cache";
class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.userName,
            avatar: null,
            saveName: "Save",
            button: null
        };
    }
    pickImg() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            mediaType: "photo",
            cropping: true,
        }).then(image => {
            this.setState({
                avatar: {uri: image.path, width: image.width, height: image.height, mime: this.props.userId + ".jpg"},
                button: "Confirm Update?"
            });
        });
    }
    //confirm image, upload it
    confirmImg() {
        let image = this.state.avatar;
        let file = {uri: image.uri, type: 'multipart/form-data', name: image.mime};
        let data = new FormData();
        data.append("file", file);
        data.append("token", this.props.userToken);
        data.append("id", this.props.userId);
        fetch("http://192.168.0.13:5000/panels/profileImage", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
            },
            body: data
        })
        .then((response) => response.json())
        .then((result) => {
            switch (result) {
                case 0:
                    alert("Can't get data, try later!");
                    break;
                case 1:
                    ImageCache.get().bust("https://thousanday.com/img/user/" + this.props.userId + ".jpg");
                    this.props.refreshUser();
                    break;
                case 2:
                    alert("Please try to login again");
                    break;
            }
        });
    }
    //save name
    saveName() {
        if (this.state.name !== this.props.userName) {
            fetch("http://192.168.0.13:5000/panels/profileName", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": this.props.userId,
                    "token": this.props.userToken,
                    "name": this.state.name
                })
            })
            .then((response) => response.json())
            .then((result) => {
                switch (result) {
                    case 0:
                        alert("Can't get data, try later!");
                        break;
                    case 1:
                        this.props.refreshUser();
                        break;
                    case 2:
                        alert("Please try to login again");
                        break;
                }
            });
        }
    }
    render() {
        return (
            <View style={styles.root}>
                <View style={styles.rootRow}>
                    <View style={styles.rowTitle}>
                        <Text style={styles.titleHint}>
                            Update Your Name:
                        </Text>
                        <TouchableOpacity onPress={this.saveName.bind(this)}>
                            <Text style={styles.titleSave}>
                                {this.state.saveName}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.rowInput}
                        onChangeText={(text) =>
                            this.setState({name: text.substr(0, 10)})
                        }
                        value={this.state.name}
                    />
                    <Text style={styles.rowHint}>
                        {this.state.name.length} / 10
                    </Text>
                </View>
                <View style={styles.rootPicture}>
                    <Image
                        style={styles.pictureProfile}
                        source={this.state.avatar?this.state.avatar:{uri: "https://thousanday.com/img/user/" + this.props.userId + ".jpg"}}
                    />
                    <View style={styles.pictureUpload}>
                        <Button
                            onPress={this.pickImg.bind(this)}
                            title="Upload Avatar"
                            color="#052456"
                        />
                        {
                            this.state.avatar?
                                <View style={styles.pictureUpload}>
                                    <Button
                                        onPress={this.confirmImg.bind(this)}
                                        title={this.state.button}
                                        color="#ef8513"
                                    />
                                </View>
                                :null
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginHorizontal: 20,
        marginTop: 20
    },
    rootRow: {
        backgroundColor: "#f7f9fc",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5
    },
    rowInput: {
        fontSize: 18
    },
    rowTitle: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    titleHint: {
        fontSize: 16,
        fontWeight: "bold"
    },
    titleSave: {
        marginRight: 10,
        backgroundColor: "#ef8513",
        paddingVertical: 3,
        paddingHorizontal: 8,
        color: "white",
        borderRadius: 5
    },
    rowHint: {
        marginLeft: 5,
        fontSize: 12
    },
    rootPicture: {
        backgroundColor: "#f7f9fc",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 40
    },
    pictureProfile: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    },
    pictureUpload: {
        width: 250,
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 30
    }
});

export default EditProfile;
