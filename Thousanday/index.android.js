import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    AsyncStorage
} from "react-native";
import Header from "./source/general/Header";
import Footer from "./source/general/Footer";
import Watch from "./source/watch/Watch";
import Pet from "./source/pet/Pet";
import AddPet from "./source/pet/Add";
import User from "./source/user/User";
import Explore from "./source/explore/Explore";
import Moment from "./source/moment/Moment";
import PostMoment from "./source/moment/Post";
import EditProfile from "./source/user/Change";
import EditPet from "./source/pet/Edit";
import WatchList from "./source/watch/Private";
import Love from "./source/love/Love";
import Login from "./source/login/Login";
import Signup from "./source/login/Signup";
import Request from "./source/request/Request";

export default class Thousanday extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //indicate route location
            route: "watch",
            //store data show watch public image page
            watchData: [],
            //indicate how many time watch image have be reload
            watchTimes: 1,
            //indicate don't need to load watch images any more
            watchLocker: false,
            //information to show one pet
            petData: [],
            //indicate which pet data have been stored now
            petId: null,
            //information to show one user
            pageData: [],
            //indicate which user data have been stored now
            pageId: null,
            //store login user id
            userId: null,
            //store all info for user page
            userData: null,
            //store which platform user login
            userPlatform: null,
            //store user token
            userToken: null,
            //store visit moment id
            momentId: null,
            //store all moment data
            momentData: [],
            //store edit pet data
            editData: [],
            //store watch list data
            watchData: [],
            //store token for signup
            signupData: null,
            //store signup platform
            signupPlatform: null,
            //store friend request data
            requestData: []
        };
    }
    //get most recent public images for watch on app open
    componentWillMount() {
        //load 20 newest moments by default
        fetch("https://thousanday.com/lists/readPublic", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((result) => {
            //consist watchdata with all image src
            let watch = [], i;
            for (i = 0; i < result.length; i++) {
                watch.push(
                    {
                        key: "https://thousanday.com/img/pet/" + result[i].pet_id + "/moment/" + result[i].image_name,
                        id: result[i].moment_id
                    }
                )
            }
            this.setState({watchData: watch});
        });
    }
    componentDidMount() {
        this._loadUserData().done();
    }
    //get stored user id
    async _loadUserData() {
        let userId = await AsyncStorage.getItem("USER_KEY");
        let platform = await AsyncStorage.getItem("Platform_KEY");
        let token = await AsyncStorage.getItem("Token_KEY");
        if (userId != null) {
            this.setState({userId: parseInt(userId), userPlatform: platform, userToken: token});
        }
    }
    //set up user id
    async _setUserData(key, platform) {
        await AsyncStorage.setItem("USER_KEY", key[0].toString());
        await AsyncStorage.setItem("Platform_KEY", platform);
        await AsyncStorage.setItem("Token_KEY", key[1]);
    }
    //remove user data
    async _removeUser() {
        await AsyncStorage.removeItem("USER_KEY");
        await AsyncStorage.removeItem("Platform_KEY");
        await AsyncStorage.removeItem("Token_KEY");
    }
    //change view by route if user click on footer
    changeView(view) {
        if (this.state.route != view) {
            if (view === "postMoment" && !this.state.userId) {
                this.setState({route: "home"});
            } else if (view === "love" && !this.state.userId) {
                this.setState({route: "home"});
            } else {
                this.setState({route: view});
            }
        }
    }
    //load more images for watch page
    loadWatch() {
        //check if watch lock exist
        if (!this.state.watchLocker) {
            fetch("https://thousanday.com/lists/loadPublic", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "times": this.state.watchTimes
                })
            })
            .then((response) => response.json())
            .then((result) => {
                switch (result) {
                    case 0:
                        alert("Can't get data, try later");
                        break;
                    default:
                        //update when there's new data
                        if (result.length !== 0) {
                            //consist watch data with all image src
                            let newWatch = [], i;
                            for (i = 0; i < result.length; i++) {
                                newWatch.push(
                                    {
                                        key: "https://thousanday.com/img/pet/" + result[i].pet_id + "/moment/" + result[i].image_name,
                                        id: result[i].moment_id
                                    }
                                )
                            }
                            //lock load more watch public image function
                            if (result.length < 20) {
                                this.setState({
                                    watchData: this.state.watchData.concat(newWatch),
                                    loadTimes: this.state.loadTimes + 1,
                                    watchLocker: true
                                });
                            } else {
                                this.setState({
                                    watchData: this.state.watchData.concat(newWatch),
                                    loadTimes: this.state.loadTimes + 1
                                });
                            }
                        } else {
                            //active lock when no more images
                            this.setState({watchLocker: true});
                        }
                }
            });
        }
    }
    //if user click on one pet, read pet data
    clickPet(id) {
        //pet page didn't be requested before
        if (this.state.petId !== id) {
            fetch("https://thousanday.com/pets/readPet", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": id
                })
            })
            .then((response) => response.json())
            .then((pet) => {
                switch (pet) {
                    case 0:
        				alert("Can't get data, try later");
        				break;
        			case 2:
        				alert("Pet not exist");
        				break;
        			default:
                        this.setState({route: "pet", petData: pet, petId: id});
        				break;
                }
            });
        } else {
            //go to user page directlly
            this.setState({route: "pet"});
        }
    }
    //if user click on one user, read user data
    clickUser(id) {
        if (this.state.userId && this.state.userId === id) {
            //click on owne page, directlly go to home route
            this.setState({route: "home"});
        } else {
            //user page didn't be requested before
            if (this.state.pageId !== id) {
                fetch("https://thousanday.com/users/read", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "id": id
                    })
                })
                .then((response) => response.json())
                .then((user) => {
                    switch (user) {
                        case 0:
                            alert("Can't get data, try later");
                            break;
                        case 2:
                            alert("User not exist");
                            break;
                        default:
                            this.setState({route: "user", pageData: user, pageId: id});
                            break;
                    }
                });
            } else {
                //go to user page directlly
                this.setState({route: "user"});
            }
        }
    }
    //if user click on one moment, read moment data
    clickMoment(id) {
        //last visit is not same moment, get data
        if (this.state.momentId !== id) {
            fetch("https://thousanday.com/moments/readMoment", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": id
                })
            })
            .then((response) => response.json())
            .then((moment) => {
                switch (moment) {
                    case 0:
                        alert("Can't get data, try later");
                        break;
                    case 2:
                        alert("Moment not exist");
                        break;
                    default:
                        this.setState({route: "moment", momentData: moment, momentId: id});
                        break;
                }
            });
        } else {
            //go to user page directlly
            this.setState({route: "moment"});
        }
    }
    //if user click on add pet
    clickAddPet() {
        this.setState({route: "addPet"});
    }
    //if user click on post moment
    clickPostMoment() {
        this.setState({route: "postMoment"});
    }
    //process user login action
    processLogin(result, platform) {
        fetch("https://thousanday.com/users/read", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": result[0]
            })
        })
        .then((response) => response.json())
        .then((user) => {
            switch (user) {
                case 0:
                    alert("Can't get data, try later");
                    break;
                case 2:
                    //go to sign up date if not exist
                    this.setState({userId: null, userToken: null, userData: null, route: "login"});
                    break;
                default:
                    if (!this.state.userId) {
                        if (platform && platform === "google") {
                            this._setUserData(result, "google");
                            this.setState({userData: user, userId: result[0], userToken: result[1], userPlatform: "google"});
                        } else {
                            this._setUserData(result, "facebook");
                            this.setState({userData: user, userId: result[0], userToken: result[1], userPlatform: "facebook"});
                        }
                    } else {
                        this.setState({userData: user});
                    }
                    break;
            }
        });
    }
    //facebook user logout
    userLogout() {
        this._removeUser();
        this.setState({userId: null, userData: null, userPlatform: null, route: "watch"});
    }
    //watch or unwatch a pet
    petWatch() {
        if (!this.state.userId) {
            //must login first
            alert("Please login first");
        } else  {
            let action;
            if (this.state.petData[2].indexOf(this.state.userId) === -1) {
                action = 0;
            } else {
                action = 1;
            }
            //watch or unwatch pet
            fetch("https://thousanday.com/pets/updateWatch", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "action": action,
                    "userId": this.state.userId,
                    "petId": this.state.petId,
                    "userToken": this.state.userToken
                })
            })
            .then((response) => response.json())
            .then((result) => {
                switch (result) {
                    case 0:
                        alert("Can't get data, please try later");
                        break;
                    case 1:
                        if (action === 1) {
                            this.state.petData[2].splice(this.state.petData[2].indexOf(this.state.userId), 1);
                            this.setState({petData: this.state.petData});
                        } else {
                            this.state.petData[2].push(this.state.userId);
                            this.setState({petData: this.state.petData});
                        }
                        break;
                    case 2:
                        alert("Please login first");
                        break;
                }
            });
        }
    }
    //refresh user's data
    refreshUser() {
        this.setState({userData: null, route: "home", petId: null});
    }
    //empty user data
    emptyUser() {
        this.setState({userData: null, petId: null});
    }
    //empty pet data
    refreshPet() {
        this.setState({petId: null});
    }
    //refresh user,moment, pet data, and go to new moment
    refreshMoment(id) {
        fetch("https://thousanday.com/moments/readMoment", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": id
            })
        })
        .then((response) => response.json())
        .then((moment) => {
            switch (moment) {
                case 0:
                    alert("Can't get data, try later");
                    break;
                case 2:
                    alert("Moment not exist");
                    break;
                default:
                    this.setState({route: "moment", userData: null, petId: null, momentData: moment, momentId: id});
                    break;
            }
        });
    }
    //click edit profile page
    clickEditProfile() {
        this.setState({route: "editProfile"});
    }
    //click edit pet, get info for one pet
    clickEditPet(id) {
        fetch("https://thousanday.com/panels/initEdit", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": id
            })
        })
        .then((response) => response.json())
        .then((pet) => {
            this.setState({editData: pet, route: "editPet"});
        });
    }
    //click watch lists,get watch list info
    clickWatchList() {
        fetch("https://thousanday.com/panels/watchList", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": this.state.userId,
                "pin": 0
            })
        })
        .then((response) => response.json())
        .then((list) => {
            this.setState({watchData: list, route: "watchList"});
        });
    }
    //signup feature
    goSignup(data, platform) {
        this.setState({signupData: data, signupPlatform: platform, route: "signup"});
    }
    //new user login
    newUser(result, platform) {
        if (platform === "google") {
            this._setUserData(result, "google");
            this.setState({userId: result[0], userToken: result[1], userData: null, userPlatform: "google", route: "home"});
        } else {
            this._setUserData(result, "facebook");
            this.setState({userId: result[0], userToken: result[1], userData: null, userPlatform: "facebook", route: "home"});
        }
    }
    //click friend request button
    clickRequestMessage() {
        fetch("http://192.168.0.13:5000/panels/requestMessage", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": this.state.userId,
                "pin": 0
            })
        })
        .then((response) => response.json())
        .then((list) => {
            this.setState({requestData: list, route: "requestMessage"});
        });
    }
    render() {
        //page route system
        let route;
        switch (this.state.route) {
            //default page, watch public images
            case "watch":
                route = <Watch data={this.state.watchData} loadWatch={this.loadWatch.bind(this)} clickMoment={this.clickMoment.bind(this)} />;
                break;
            //explore page could be seen by public
            case "explore":
                route = <Explore clickMoment={this.clickMoment.bind(this)} />;
                break;
            //go to pet page when user click on pet
            case "pet":
                route = <Pet
                    key={"pet" + this.state.petId}
                    data={this.state.petData}
                    userId={this.state.userId}
                    petWatch={this.petWatch.bind(this)}
                    clickUser={this.clickUser.bind(this)}
                    clickPet={this.clickPet.bind(this)}
                    clickMoment={this.clickMoment.bind(this)}
                />;
                break;
            //go to user page when user click on one user
            case "user":
                route = <User
                    key={"user" + this.state.pageId}
                    data={this.state.pageData}
                    userId={this.state.pageId}
                    clickUser={this.clickUser.bind(this)}
                    clickPet={this.clickPet.bind(this)}
                    clickMoment={this.clickMoment.bind(this)}
                />;
                break;
            case "moment":
                route = <Moment
                    data={this.state.momentData}
                    clickPet={this.clickPet.bind(this)}
                />
                break;
            case "love":
                route = <Love />
                break;
            case "addPet":
                route = <AddPet
                    userId={this.state.userId}
                    userToken={this.state.userToken}
                    refreshUser={this.refreshUser.bind(this)}
                />
                break;
            case "postMoment":
                if (this.state.userData) {
                    route = <PostMoment
                        petList={this.state.userData[2]}
                        userId={this.state.userId}
                        userToken={this.state.userToken}
                        refreshMoment={this.refreshMoment.bind(this)}
                    />
                } else {
                    this.processLogin([this.state.userId], this.state.userPlatform, () => {
                        route = <PostMoment
                            petList={this.state.userData[2]}
                            userId={this.state.userId}
                            userToken={this.state.userToken}
                            refreshMoment={this.refreshMoment.bind(this)}
                        />
                    });
                }
                break;
            case "editProfile":
                route = <EditProfile
                    userId={this.state.userId}
                    userName={this.state.userData[0][0]}
                    userToken={this.state.userToken}
                    refreshUser={this.refreshUser.bind(this)}
                />
                break;
            case "editPet":
                route = <EditPet
                    data={this.state.editData}
                    userId={this.state.userId}
                    userToken={this.state.userToken}
                    refreshPet={this.refreshPet.bind(this)}
                    refreshUser={this.refreshUser.bind(this)}
                />
                break;
            case "watchList":
                route = <WatchList
                    data={this.state.watchData}
                    userId={this.state.userId}
                    userToken={this.state.userToken}
                    clickPet={this.clickPet.bind(this)}
                    refreshPet={this.refreshPet.bind(this)}
                />
                break;
            case "requestMessage":
                route = <Request
                    data={this.state.requestData}
                    userId={this.state.userId}
                    userToken={this.state.userToken}
                    emptyUser={this.emptyUser.bind(this)}
                />
                break;
            case "signup":
                route = <Signup
                    data={this.state.signupData}
                    platform={this.state.signupPlatform}
                    newUser={this.newUser.bind(this)}
                />
                break;
            case "home":
                //user already logged in
                if (this.state.userId) {
                    if (this.state.userData) {
                        route = <User
                            key={"user" + this.state.userId}
                            home={true}
                            userId={this.state.userId}
                            data={this.state.userData}
                            clickUser={this.clickUser.bind(this)}
                            clickPet={this.clickPet.bind(this)}
                            clickMoment={this.clickMoment.bind(this)}
                            clickAddPet={this.clickAddPet.bind(this)}
                            clickPostMoment={this.clickPostMoment.bind(this)}
                            clickEditProfile={this.clickEditProfile.bind(this)}
                            clickEditPet={this.clickEditPet.bind(this)}
                            clickWatchList={this.clickWatchList.bind(this)}
                            clickRequestMessage={this.clickRequestMessage.bind(this)}
                            userLogout={this.userLogout.bind(this)}
                            platform={this.state.userPlatform}
                        />;
                    } else {
                        //get data for user first
                        this.processLogin([this.state.userId], this.state.userPlatform, () => {
                            route = <User
                                key={"user" + this.state.userId}
                                home={true}
                                userId={this.state.userId}
                                data={this.state.userData}
                                clickUser={this.clickUser.bind(this)}
                                clickPet={this.clickPet.bind(this)}
                                clickMoment={this.clickMoment.bind(this)}
                                clickAddPet={this.clickAddPet.bind(this)}
                                clickPostMoment={this.clickPostMoment.bind(this)}
                                clickEditProfile={this.clickEditProfile.bind(this)}
                                clickEditPet={this.clickEditPet.bind(this)}
                                clickWatchList={this.clickWatchList.bind(this)}
                                clickRequestMessage={this.clickRequestMessage.bind(this)}
                                userLogout={this.userLogout.bind(this)}
                                platform={this.state.userPlatform}
                            />;
                        });
                    }
                } else {
                    route = <Login home={false}
                        processLogin={this.processLogin.bind(this)}
                        goSignup={this.goSignup.bind(this)}
                    />;
                }
                break;
        }
        return (
            <View style={styles.container}>
                <Header title={this.state.route} />
                <View style={styles.main}>
                    {route}
                </View>
                <Footer changeView={this.changeView.bind(this)} view={this.state.route} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#F5FCFF"
    },
    main: {
        flex: 10,
        backgroundColor: "white"
    }
});

AppRegistry.registerComponent("Thousanday", () => Thousanday);
