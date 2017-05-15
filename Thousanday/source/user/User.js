import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from "react-native";
const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken
} = FBSDK;
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import noGetGender from "../../js/noGetGender.js";
import noGetType from "../../js/noGetType.js";
import {CachedImage} from "react-native-img-cache";
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //store images
            userImages: this.props.data[4] || [],
            //indicate lock load more function
            userLocker: false,
            //indicate how many time load more image
            loadTimes: 1
        };
    }
    componentDidMount() {
        this._gSetup();
    }
    async _gSetup() {
        await GoogleSignin.hasPlayServices({ autoResolve: true });
        await GoogleSignin.configure({
            webClientId: '835652983909-6if3h222alkttk9oas3hr3tl15sq1u7m.apps.googleusercontent.com',
            offlineAccess: false
        });
        let user = await GoogleSignin.currentUserAsync();
    }
    //load more moments
    /*
    loadMore() {
        alert(123);
        fetch("http://192.168.0.13:5000/users/loadMoments", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "petsList": this.props.data[3],
                "loadTimes": this.state.loadTimes
            })
        })
        .then((response) => response.json())
        .then((result) => {
            switch (result) {
                case 0:
                    alert("Can't get data, please try later");
                    break;
                default:
                    //lock load more image
                    if (result.length < 20 && result.length > 0) {
                        this.setState({
                            userImages: this.state.userImages.concat(result),
                            loadTimes: this.state.loadTimes + 1,
                            userLocker: true
                        });
                    } else if (result.length === 0) {
                        this.setState({userLocker: true});
                    } else {
                        this.setState({
                            userImages: this.state.userImages.concat(result),
                            loadTimes: this.state.loadTimes + 1
                        });
                    }
            }
        });
    }
    */
    //logout with google
    _gLogout() {
        GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
            fetch("http://192.168.0.13:5000/accounts/logOut", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": this.props.userId
                })
            })
            .then((response) => response.json())
            .then((result) => {
                switch (result) {
                    case 0:
                        alert("Something wrong, please try again");
                        break;
                    case 1:
                        this.props.userLogout();
                        break;
                }
            });
        })
        .done();
    }
    render() {
        //process data to get all images
        let gallery = [], i;
        for (i = 0; i < this.state.userImages.length; i++) {
            gallery.push(
                {
                    key: "https://thousanday.com/img/pet/" + this.state.userImages[i].pet_id + "/moment/" + this.state.userImages[i].image_name,
                    id: this.state.userImages[i].moment_id
                }
            )
        }
        //show all pets
        let pets = this.props.data[2].map((pet, index) =>
            <TouchableOpacity key={"petsthousn" + index} onPress={this.props.clickPet.bind(null, pet.pet_id)}>
                <View style={styles.petHub}>
                    <CachedImage
                        source={{uri: "https://thousanday.com/img/pet/" + pet.pet_id + "/cover/0.png"}}
                        style={styles.hubPet}
                        mutable
                    />
                    <View style={styles.hubDesc} >
                        <Text style={styles.descType}>
                            {noGetType(pet.pet_type)}
                        </Text>
                        <Text style={styles.descGender}>
                            {noGetGender(pet.pet_gender)}
                        </Text>
                    </View>
                    <Text style={styles.hubName}>
                        {pet.pet_name}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        //show all relatives
        let relatives = this.props.data[1].map((relative, index) =>
            <TouchableOpacity key={"relativesthousn" + index} onPress={this.props.clickUser.bind(null, relative)}>
                <CachedImage
                    source={{uri: "https://thousanday.com/img/user/" + relative + ".jpg"}}
                    style={styles.userImg}
                    mutable
                />
            </TouchableOpacity>
        )
        //show admin panel, show welcome message
        let panel, welcome, logout;
        if (this.props.home) {
            panel = (
                <View style={styles.mainAction}>
                    <TouchableOpacity onPress={this.props.clickAddPet.bind(this)}>
                        <View style={styles.actionCircle}>
                            <Text style={styles.circleContent}>
                                Add
                            </Text>
                            <Text style={styles.circleContent}>
                                Pet
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.actionCircle}>
                        <Text style={styles.circleContent}>
                            Edit
                        </Text>
                        <Text style={styles.circleContent}>
                            Pet
                        </Text>
                    </View>
                    <View style={styles.actionCircle}>
                        <Text style={styles.circleContent}>
                            Edit
                        </Text>
                        <Text style={styles.circleContent}>
                            Profile
                        </Text>
                    </View>
                    <View style={styles.actionCircle}>
                        <Text style={styles.circleContent}>
                            Post
                        </Text>
                        <Text style={styles.circleContent}>
                            Moment
                        </Text>
                    </View>
                    <View style={styles.actionCircle}>
                        <Text style={styles.circleContent}>
                            Friend
                        </Text>
                        <Text style={styles.circleContent}>
                            List
                        </Text>
                    </View>
                </View>
            );
            welcome = (
                <Text style={styles.headerHome}>
                    Welcome Home! {this.props.data[0][0]}
                </Text>
            )
            if (this.props.platform === "facebook") {
                logout = (
                    <Facebook userId={this.props.userId} userLogout={this.props.userLogout.bind(this)}/>
                )
            } else {
                logout = (
                    <TouchableOpacity onPress={this._gLogout.bind(this)}>
                        <View style={styles.mainGoogle}>
                            <Text style={styles.googleOut}>Log out</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        } else {
            welcome = (
                <Text style={styles.headerName}>
                    Welcome to {this.props.data[0][0] + "'s"} Home
                </Text>
            );
        }
        return (
            <ScrollView contentContainerStyle={styles.main}>
                <View style={styles.mainHeader}>
                    <CachedImage
                        source={{uri: "https://thousanday.com/img/user/" + this.props.userId + ".jpg"}}
                        style={styles.headerAvatar}
                        mutable
                    />
                    {welcome}
                </View>
                {panel}
                {logout}
                <Text style={styles.mainTitle}>
                    Pets List
                </Text>
                <View style={styles.mainPet}>
                    {pets}
                </View>
                <Text style={styles.mainTitle}>
                    Relatives
                </Text>
                <View style={styles.mainUser}>
                    {relatives}
                </View>
                <Text style={styles.mainTitle}>
                    Moments with pets
                </Text>
                <FlatList
                    contentContainerStyle={styles.mainContainer}
                    data = {gallery}
                    renderItem={({item}) =>
                        <TouchableOpacity onPress={this.props.clickMoment.bind(null, item.id)}>
                            <CachedImage
                                source={{uri: item.key}}
                                style={styles.containerImage}
                            />
                        </TouchableOpacity>
                    }
                />
            </ScrollView>
        )
    }
}

let Facebook = React.createClass({
    render: function() {
        return (
            <View style={styles.mainLogout}>
                <LoginButton
                    onLogoutFinished={
                        () => {
                            fetch("http://192.168.0.13:5000/accounts/logOut", {
                                method: "POST",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    "id": this.props.userId
                                })
                            })
                            .then((response) => response.json())
                            .then((result) => {
                                switch (result) {
                                    case 0:
                                        alert("Something wrong, please try again");
                                        break;
                                    case 1:
                                        this.props.userLogout();
                                        break;
                                }
                            });
                        }
                    }
                />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    main: {
        marginHorizontal: 10
    },
    mainHeader: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap"
    },
    headerAvatar: {
        marginTop: 10,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    headerName: {
        marginLeft: 20,
        fontWeight: "bold",
        fontSize: 16
    },
    headerHome: {
        marginLeft: 20,
        fontWeight: "bold",
        fontSize: 16,
        backgroundColor: "#052456",
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5
    },
    mainGoogle: {
        width: 186,
        backgroundColor: "#052456",
        height: 38,
        borderRadius: 5,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    googleOut: {
        color: "white",
        fontSize: 14
    },
    mainLogout: {
        marginTop: 20,
    },
    mainAction: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
        backgroundColor: "#e5e5e5",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    actionCircle: {
        backgroundColor: "#ef8513",
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        marginRight: 15
    },
    circleContent: {
        fontSize: 12,
        color: "white",
    },
    mainTitle: {
        marginLeft: 10,
        fontWeight: "bold",
        fontSize: 16,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: "#052456",
        width: 250,
        marginBottom: 10,
        marginTop: 20
    },
    mainPet: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: 10
    },
    petHub: {
        backgroundColor: "#f7f9fc",
        alignItems: "center",
        marginRight: 20,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    hubPet: {
        width: 90,
        height: 90,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    hubDesc: {
        flexDirection: "row",
        alignItems: "center"
    },
    descType: {
        fontSize: 12,
        backgroundColor: "#ef8513",
        color: "white",
        paddingVertical: 1,
        paddingHorizontal: 2,
        borderRadius: 3
    },
    descGender: {
        marginLeft: 5,
        fontSize: 20
    },
    hubName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5
    },
    mainUser: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: 10
    },
    userImg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15
    },
    mainContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginHorizontal: 10
    },
    containerImage: {
        width: (Dimensions.get("window").width - 40 )/2.02,
        height: 180,
        resizeMode: "cover",
        marginBottom: 3,
        borderRadius: 5
    }
});

export default User;
