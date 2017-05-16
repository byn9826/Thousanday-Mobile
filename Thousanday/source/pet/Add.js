import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Picker,
    Button,
    Image,
    ScrollView
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
class AddPet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: null,
            type: "choose",
            nature: "choose",
            avatar: null,
            error: null
        };
    }
    //change pet name
    changeName(e) {
        this.setState({name: e.target.value});
    }
    //click male
    clickMale() {
        if (this.state.gender === 0) {
            this.setState({gender: null});
        } else {
            this.setState({gender: 0});
        }
    }
    //click female
    clickFemale() {
        if (this.state.gender === 1) {
            this.setState({gender: null});
        } else {
            this.setState({gender: 1});
        }
    }
    //pick photo
    pickImg() {
        ImagePicker.openPicker({
            width: 250,
            height: 250,
            mediaType: "photo",
            cropping: true
        }).then(image => {
            this.setState({
                avatar: {uri: image.path, width: image.width, height: image.height, mime: "image/png"}
            });
        });
    }
    //confirm add pet
    confirmAdd() {
        let name = this.state.name.trim();
        let gender = this.state.gender;
        let type = this.state.type;
        let nature = this.state.nature;
        let image = this.state.avatar;
        if (name.length <= 0 || name.length > 10) {
            this.setState({error: "Length of Pet Name is not correct"});
        } else if (gender !== 0 && gender !== 1) {
            this.setState({error: "Please choose your pet's gender"});
        } else if (type !== 0 && type !== 1 && type !== 2 && type !== 3 && type !== 4) {
            this.setState({error: "Please choose your pet's type"});
        } else if (nature !== 0 && nature !== 1 && nature !== 2 && nature !== 3) {
            this.setState({error: "Please choose your pet's nature"});
        } else if (!image) {
            this.setState({error: "Please upload your pet's avatar"});
        } else {
            let file = {uri: image.uri, type: 'multipart/form-data', name:'0.png'};
            let data = new FormData();
            data.append("name", name);
            data.append("gender", gender);
            data.append("type", type);
            data.append("nature", nature);
            data.append("file", file);
            data.append("token", this.props.userToken);
            data.append("id", this.props.userId);
            fetch("http://192.168.0.13:5000/panels/createPet", {
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
        let picture;
        if (this.state.avatar){
            picture = <Image source={this.state.avatar} style={styles.rootAvatar} />
        }
        return (
            <ScrollView contentContainerStyle={styles.root}>
                <View style={styles.rootRow}>
                    <Text style={styles.rowTitle}>
                        Name:
                    </Text>
                    <TextInput
                        style={styles.rowInput}
                        placeholder="Your pets name"
                        onChangeText={(text) =>
                            this.setState({name: text.substr(0, 10)})
                        }
                        value={this.state.name}
                    />
                    <Text style={styles.rowHint}>
                        {this.state.name.length} / 10
                    </Text>
                </View>
                <View style={styles.rootRow}>
                    <Text style={styles.rowTitle}>
                        Gender:
                    </Text>
                    <TouchableOpacity onPress={this.clickMale.bind(this)}>
                        <Text style={(this.state.gender === 0)?styles.rowChoose:styles.rowGender}>
                            ♂
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.clickFemale.bind(this)}>
                        <Text style={(this.state.gender === 1)?styles.rowChoose:styles.rowGender}>
                            ♀
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.rootRow}>
                    <Text style={styles.rowTitle}>
                        Type:
                    </Text>
                    <Picker
                        style={styles.rowPicker}
                        selectedValue={this.state.type}
                        onValueChange={(type) => this.setState({type: type})}>
                        <Picker.Item label="Choose a type" value="choose" />
                        <Picker.Item label="dog" value={0} />
                        <Picker.Item label="cat" value={1} />
                        <Picker.Item label="bird" value={2} />
                        <Picker.Item label="fish" value={3} />
                        <Picker.Item label="other" value={4} />
                    </Picker>
                </View>
                <View style={styles.rootRow}>
                    <Text style={styles.rowTitle}>
                        Nature:
                    </Text>
                    <Picker
                        style={styles.rowPicker}
                        selectedValue={this.state.nature}
                        onValueChange={(nature) => this.setState({nature: nature})}>
                        <Picker.Item label="Choose a nature" value="choose" />
                        <Picker.Item label="cute" value={0} />
                        <Picker.Item label="strong" value={1} />
                        <Picker.Item label="smart" value={2} />
                        <Picker.Item label="beauty" value={3} />
                    </Picker>
                </View>
                <Text style={styles.rootNotice}>
                    {"You can't modify gender, type, and nature after creation"}
                </Text>
                <Button
                    onPress={this.pickImg.bind(this)}
                    title="Upload Avatar"
                    color="#052456"
                />
                {picture}
                <Text style={styles.rowError}>
                    {this.state.error}
                </Text>
                <TouchableOpacity onPress={this.confirmAdd.bind(this)}>
                    <Text style={styles.rowCreate}>
                        Add Pet
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
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7d7b4",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 20
    },
    rowTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 15
    },
    rowInput: {
        width: 170,
    },
    rowHint: {
        marginLeft: 10,
        fontSize: 12
    },
    rowChoose: {
        fontSize: 25,
        marginRight: 15,
        backgroundColor: "#ef8513",
        color: "white",
        width: 32,
        borderRadius: 15,
        textAlign: "center"
    },
    rowGender: {
        fontSize: 25,
        marginRight: 15,
        backgroundColor: "white",
        width: 32,
        borderRadius: 15,
        textAlign: "center"
    },
    rowPicker: {
        width: 220,
    },
    rootNotice:{
        fontSize: 14,
        marginBottom: 20
    },
    rootAvatar: {
        width: 250,
        height: 250,
        alignSelf: "center",
        marginTop: 40
    },
    rowError: {
        color: "red",
        alignSelf: "center",
        fontSize: 16,
        marginTop: 25,
        marginBottom: 15
    },
    rowCreate: {
        backgroundColor: "#ef8513",
        color: "white",
        width: 180,
        textAlign: "center",
        paddingVertical: 6,
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
        borderRadius: 5,
        marginBottom: 50
    }
});



export default AddPet;
