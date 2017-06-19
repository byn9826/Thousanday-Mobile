import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    TouchableOpacity
} from "react-native";
/*
const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken
} = FBSDK;*/
import processError from "../../js/processError.js";
import processGallery from "../../js/processGallery.js";
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import noGetGender from "../../js/noGetGender.js";
import noGetType from "../../js/noGetType.js";
import {CachedImage} from "react-native-img-cache";
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //store images
            userImages: processGallery(this.props.data[2]) || [],
            //indicate lock load more function
            userLocker: this.props.data[2].length === 20?false:true,
            //indicate how many time load more image
            loadTimes: 1,
            //refresh icon
            refresh: false,
            //store pet list belong to user
            belong: this.props.data[3]
        };
    }
    componentDidMount() {
        this._gSetup();
    }
    async _gSetup() {
        await GoogleSignin.hasPlayServices({ autoResolve: true });
        await GoogleSignin.configure({
			iosClientId: '835652983909-gf89tn5ttgcbkdacintdi0kiqem0968t.apps.googleusercontent.com',
            webClientId: '835652983909-6if3h222alkttk9oas3hr3tl15sq1u7m.apps.googleusercontent.com',
            offlineAccess: false
        });
        let user = await GoogleSignin.currentUserAsync();
    }
    _gLogout() {
        GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
            this.setState({refresh: true});
            fetch("https://thousanday.com/account/logout", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": this.props.userId,
                    "token": this.props.userToken
                })
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    processError(response);
                }
            })
            .then((result) => {
                this.setState({refresh: false});
                this.props.userLogout();
            });
        });
    }
    //load more moments
    loadMore() {
        if (!this.state.userLocker) {
            fetch("https://thousanday.com/user/load", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "load": this.state.loadTimes,
                    "belong": this.state.belong
                })
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    processError(response);
                }
            })
            .then((result) => {
                result = processGallery(result);
                let newResult = this.state.userImages.concat(result);
                if (result.length === 20) {
                    this.setState({userImages: newResult, loadTimes: this.state.loadTimes + 1});
                } else {
                    this.setState({userImages: newResult, loadTimes: this.state.loadTimes + 1, userLocker: true});
                }
            });
        }
    }
    render() {
        //show all pets
        let pets = this.props.data[1].map((pet, index) =>
            <View key={"petsthousn" + index} style={styles.petHub}>
                <TouchableOpacity onPress={this.props.clickPet.bind(null, pet.pet_id)}>
                    <CachedImage
                        source={{uri: "https://thousanday.com/img/pet/" + pet.pet_id + "/0.png"}}
                        style={styles.hubPet}
                        mutable
                    />
                </TouchableOpacity>
                {
                    !this.props.home?
                    (<View style={styles.hubDesc} >
                        <Text style={styles.descType}>
                            {noGetType(pet.pet_type)}
                        </Text>
                        <Text style={styles.descGender}>
                            {noGetGender(pet.pet_gender)}
                        </Text>
                    </View>):null
                }
                <Text style={styles.hubName}>
                    {pet.pet_name}
                </Text>
                {
                    this.props.home?
                    (
                        <TouchableOpacity onPress={this.props.clickEditPet.bind(null, pet.pet_id)}>
                            <Text style={styles.hubEdit}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                    ):null
                }
            </View>
        )
        //show all relatives
        let reldata = [], i;
		if (this.props.data[1].length !== 0) {
			for (i = 0; i < this.props.data[1].length; i++) {
				if (this.props.data[1][i].relative_id) {
					if (this.props.data[1][i].relative_id == this.props.userId) {
						reldata.push(this.props.data[1][i].owner_id);
					} else {
						reldata.push(this.props.data[1][i].relative_id);
					}
				}
			}
		}
		reldata = [...new Set(reldata)];
        let relatives = reldata.map((relative, index) =>
            <TouchableOpacity key={"relativesthousn" + index} onPress={this.props.clickUser.bind(null, parseInt(relative))}>
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
                <View style={styles.headerAction}>
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
                    <TouchableOpacity onPress={this.props.clickEditProfile.bind(this)}>
                        <View style={styles.actionCircle}>
                            <Text style={styles.circleContent}>
                                Edit
                            </Text>
                            <Text style={styles.circleContent}>
                                Profile
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.clickPostMoment.bind(this)}>
                        <View style={styles.actionCircle}>
                            <Text style={styles.circleContent}>
                                Post
                            </Text>
                            <Text style={styles.circleContent}>
                                Moment
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.clickWatchList.bind(this)}>
                        <View style={styles.actionCircle}>
                            <Text style={styles.circleContent}>
                                Watch
                            </Text>
                            <Text style={styles.circleContent}>
                                List
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.clickRequestMessage.bind(this)}>
                        <View style={styles.actionCircle}>
                            <Text style={styles.circleContent}>
                                Msg
                            </Text>
                            <Text style={styles.circleContent}>
                                Box
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
            if (this.props.platform === "facebook") {
                /*logout = (
                    <Facebook userId={this.props.userId} userToken={this.props.userToken} userLogout={this.props.userLogout.bind(this)}/>
					
                );*/
            } else {
                logout = (
                    <TouchableOpacity onPress={this._gLogout.bind(this)}>
                        <View style={styles.containerGoogle}>
                            <Text style={styles.googleOut}>Log out</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
            welcome = (
                <View style={styles.headerContainer}>
                    <Text style={styles.containerHome}>
                        Welcome Home! {this.props.data[0].user_name}
                    </Text>
                    {logout}
                </View>
            )
        } else {
            welcome = (
                <Text style={styles.headerName}>
                    Welcome to {this.props.data[0].user_name + "'s"} Home
                </Text>
            );
        }
        let user;
        if (this.props.home) {
            user = (
                <Text style={styles.headerId}>
                    Your user id is {this.props.userId}
                </Text>
            )
        }
        return (
            <FlatList
                style={styles.main}
                ListHeaderComponent={()=> {
                    return (
                        <View style={styles.mainHeader}>
                            <View style={styles.headerRow}>
                                <CachedImage
                                    source={{uri: "https://thousanday.com/img/user/" + this.props.userId + ".jpg"}}
                                    style={styles.headerAvatar}
                                    mutable
                                />
                                {welcome}
                            </View>
                            {user}
                            {panel}
                            {
                                this.props.data[2].length > 0?(
                                    <Text style={styles.headerTitle}>
                                        Pets List
                                    </Text>
                                ): null
                            }
                            <View style={styles.headerPet}>
                                {pets}
                            </View>
                            {
                                this.props.data[1].length > 0?(
                                    <Text style={styles.headerTitle}>
                                        Relatives
                                    </Text>
                                ): null
                            }
                            <View style={styles.headerUser}>
                                {relatives}
                            </View>
                            {
                                this.props.data[2].length > 0?(
                                    <Text style={styles.headerTitle}>
                                        Moments with pets
                                    </Text>
                                ):null
                            }
                        </View>
                    )
                }}
                contentContainerStyle={styles.mainContainer}
                data = {this.state.userImages}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between"
                }}
                renderItem={({item}) =>
                    <TouchableOpacity onPress={this.props.clickMoment.bind(null, item.id)}>
                        <CachedImage
                            source={{uri: item.key}}
                            style={styles.containerImage}
                        />
                    </TouchableOpacity>
                }
                onRefresh={()=>{}}
                refreshing={this.state.refresh}
                onEndReached={
                    this.loadMore.bind(this)
                }
            />
        )
    }
}
/*
let Facebook = React.createClass({
    render: function() {
        return (
            <LoginButton
                onLogoutFinished={
                    () => {
                        this.setState({refresh: true});
                        fetch("https://thousanday.com/account/logout", {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                "id": this.props.userId,
                                "token": this.props.userToken
                            })
                        })
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                processError(response);
                            }
                        })
                        .then((result) => {
                            this.setState({refresh: false});
                            this.props.userLogout();
                        });
                    }
                }
            />
        );
    }
});*/

const styles = StyleSheet.create({
    main: {
        marginTop: 10,
        marginHorizontal: 10,
        paddingBottom: 20
    },
    mainHeader: {
        alignItems: "flex-start",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerAvatar: {
        marginTop: 10,
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20
    },
    headerContainer: {
        alignItems: "center"
    },
    containerHome: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10
    },
    containerGoogle: {
        width: 186,
        backgroundColor: "#052456",
        height: 30,
        borderRadius: 5,
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    googleOut: {
        color: "white",
        fontSize: 14
    },
    headerId: {
        fontSize: 12,
        marginLeft: 10,
        marginTop: 10,
    },
    headerAction: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
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
        fontSize: 11,
        color: "white",
    },
    headerTitle: {
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
    headerPet: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: 10,
        marginBottom: 15
    },
    petHub: {
        backgroundColor: "#f7f9fc",
        alignItems: "center",
        marginRight: 20,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        marginBottom: 15,
        marginTop: 10,
        borderRadius: 5
    },
    hubPet: {
        width: 90,
        height: 90,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    hubEdit: {
        fontSize: 12,
        backgroundColor: "#ef8513",
        width: 90,
        paddingVertical: 5,
        color: "white",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        textAlign: "center"
    },
    hubDesc: {
        flexDirection: "row",
        alignItems: "center",
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
    headerUser: {
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
    containerImage: {
        width: Dimensions.get("window").width/2 - 12,
        height: Dimensions.get("window").width/2 - 12,
        resizeMode: "cover",
        marginBottom: 4,
        borderRadius: 5
    },
    headerName: {
        fontSize: 14,
        fontWeight: "bold"
    }
});

export default User;
