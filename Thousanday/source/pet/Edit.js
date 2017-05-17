import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Button,
    ScrollView
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import {ImageCache} from "react-native-img-cache";
class EditPet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveName: "Save",
            name: this.props.data.pet_name,
            avatar: null,
            button: null,
            role: this.props.data.owner_id === this.props.userId,
            end: false,
            add: false,
            input: "",
            relative: this.props.data.relative_id || null,
            getName: null,
            search: null,
            addResult: false
        };
    }
    //save name
    saveName() {
        if (this.state.name !== this.props.data.pet_name) {
            fetch("http://192.168.0.13:5000/panels/petName", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": this.props.userId,
                    "token": this.props.userToken,
                    "pet": this.props.data.pet_id,
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
                        this.setState({saveName: "Saved!"});
                        break;
                    case 2:
                        alert("Please try to login again");
                        break;
                }
            });
        }
    }
    //pick profile image
    pickImg() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            mediaType: "photo",
            cropping: true
        }).then(image => {
            this.setState({
                avatar: {uri: image.path, width: image.width, height: image.height, mime: "0.png"},
                button: "Confirm Update?"
            });
        });
    }
    //confirm update profile image
    confirmImg() {
        let image = this.state.avatar;
        let file = {uri: image.uri, type: 'multipart/form-data', name: "0.png"};
        let data = new FormData();
        data.append("file", file);
        data.append("token", this.props.userToken);
        data.append("id", this.props.userId);
        data.append("pet", this.props.data.pet_id);
        fetch("http://192.168.0.13:5000/panels/petImage", {
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
                    ImageCache.get().bust("https://thousanday.com/img/pet/" + this.props.userId + "/cover/0.png");
                    this.setState({button: "Update Success!"})
                    this.props.refreshPet();
                    break;
                case 2:
                    alert("Please try to login again");
                    break;
            }
        });
    }
    //click end relationship
    clickEnd() {
        this.setState({end: true});
    }
    //confirm end relationship
    confirmEnd() {
        fetch("http://192.168.0.13:5000/panels/endRelation", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": this.props.userId,
                "token": this.props.userToken,
                "pet": this.props.data.pet_id
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
    //click Add relative
    clickAdd() {
        this.setState({add: true, addResult: false});
    }
    //confirm send request
    confirmSend() {
        fetch("http://192.168.0.13:5000/panels/petRequest", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "senderId": this.props.userId,
                "receiverId": this.state.search,
                "petId": this.props.data.pet_id,
                "token": this.props.userToken,
            })
        })
        .then((response) => response.json())
        .then((result) => {
            switch (result) {
                case 0:
                    alert("Can't get data, try later!");
                    break;
                case 1:
                    this.setState({addResult: true});
                    break;
                case 2:
                    alert("Please try to login again");
                    break;
                case 3:
                    this.setState({addResult: true});
                    break;
            }
        });
    }
    render() {
        let role, action;
        if (this.state.role) {
            role = "You are the Owner:";
            if (this.state.end) {
                action = null;
            } else {
                if (this.state.relative) {
                    action = null;
                } else {
                    if (this.state.add && !this.state.addResult) {
                        action = (
                            <View style={styles.ownerAdd}>
                                <Text style={styles.confirmHint}>
                                    Search user by user id:
                                </Text>
                                <TextInput
                                    style={styles.confirmInput}
                                    onChangeText={(text) => {
                                        id = parseInt(text);
                                        if (id >= 0 || text === "") {
                                            this.setState({search: text})
                                            if (text !== "") {
                                                fetch("http://192.168.0.13:5000/panels/searchUser", {
                                                    method: "POST",
                                                    headers: {
                                                        "Accept": "application/json",
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        "id": id,
                                                    })
                                                })
                                                .then((response) => response.json())
                                                .then((result) => {
                                                    switch (result) {
                                                        case 0:
                                                            alert("Can't get data, try later!");
                                                            break;
                                                        default:
                                                            if (result) {
                                                                this.setState({getName: result[0]});
                                                                break;
                                                            } else {
                                                                this.setState({getName: null});
                                                                break;
                                                            }
                                                    }
                                                });
                                            }
                                        }
                                    }}
                                    value={this.state.search}
                                />
                                {
                                    (this.state.getName && this.state.search)? (
                                        <View style={styles.confirmInfo}>
                                            <Image
                                                source={{uri: "https://thousanday.com/img/user/" + this.state.search + ".jpg"}}
                                                style={styles.infoImage}
                                            />
                                            <Text style={styles.infoName}>
                                                {this.state.getName}
                                            </Text>
                                            <TouchableOpacity style={styles.infoSend} onPress={this.state.search == this.props.userId?null:this.confirmSend.bind(this)}>
                                                <Text style={styles.sendButton}>
                                                    {this.state.search == this.props.userId?"Yourself":"Send Request"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ):null
                                }
                            </View>
                        )
                    } else if (this.state.add && this.state.addResult) {
                        action = (
                            <Text style={styles.ownerReuslt}>
                                Request Sent!
                            </Text>
                        )
                    } else {
                        action = (
                            <View style={styles.ownerAction}>
                                <Button
                                    onPress={this.clickAdd.bind(this)}
                                    title="Add Relative?"
                                    color="red"
                                />
                            </View>
                        );
                    }
                }
            }
        } else {
            role = "You are the relative:";
            if (!this.state.end) {
                action = (
                    <View style={styles.ownerAction}>
                        <Button
                            onPress={this.clickEnd.bind(this)}
                            title="End Relation?"
                            color="red"
                        />
                    </View>
                )
            } else {
                action = (
                    <View style={styles.ownerConfirm}>
                        <Text style={styles.confirmHint}>
                            Type in "Confirm End" to end relationship with {this.props.data.pet_name}
                        </Text>
                        <TextInput
                            style={styles.confirmInput}
                            onChangeText={(text) =>
                                this.setState({input: text})
                            }
                            value={this.state.input}
                        />
                        {
                            this.state.input.trim() === "Confirm End"?(
                                <Button
                                    onPress={this.confirmEnd.bind(this)}
                                    title="Confirm"
                                    color="black"
                                />
                            ): null
                        }
                    </View>
                )
            }

        }
        return (
            <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="always">
                <View style={styles.rootRow}>
                    <View style={styles.rowTitle}>
                        <Text style={styles.titleHint}>
                            {"Update " + this.props.data.pet_name + " 's Name:"}
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
                        source={this.state.avatar?this.state.avatar:{uri: "https://thousanday.com/img/pet/" + this.props.data.pet_id + "/cover/0.png"}}
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
                <View style={styles.rootOwner}>
                    <Text style={styles.ownerTitle}>
                        {role}
                    </Text>
                    {action}
                </View>
            </ScrollView>
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
        borderRadius: 5,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    },
    pictureUpload: {
        width: 250,
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 30
    },
    rootOwner: {
        backgroundColor: "#f7f9fc",
        paddingHorizontal: 15,
        paddingTop: 10,
        borderRadius: 5,
        marginTop: 40,
        marginBottom: 50,
        paddingBottom: 20
    },
    ownerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 10
    },
    ownerAction: {
        width: 250,
        alignSelf: "center"
        //alignItems: "center"
    },
    ownerConfirm: {
        width: 320,
        alignSelf: "center",
        backgroundColor: "red",
        borderRadius: 5,
        paddingBottom: 20
    },
    confirmHint: {
        alignSelf: "center",
        fontSize: 14,
        color: "white",
        marginTop: 10,
        paddingHorizontal: 10,
    },
    confirmInput: {
        marginHorizontal: 20
    },
    ownerAdd: {
        width: 320,
        alignSelf: "center",
        backgroundColor: "#ef8513",
        borderRadius: 5,
        paddingBottom: 20
    },
    confirmInfo: {
        flexDirection: "row",
        marginLeft: 20,
        alignItems: "center"
    },
    infoImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    infoName: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 10
    },
    infoSend: {
        backgroundColor: "#052456",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 20
    },
    sendButton: {
        fontSize: 12,
        color: "white"
    },
    ownerReuslt: {
        fontWeight: "bold",
        fontSize: 14,
        alignSelf: "center",
        color: "red"
    }
});

export default EditPet;
