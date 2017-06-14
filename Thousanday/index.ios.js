import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    AsyncStorage
} from "react-native";
import Header from "./source/general/Header";
import Footer from "./source/general/Footer";
import processError from "./js/processError.js";
import processGallery from "./js/processGallery.js";
import Watch from "./source/watch/Watch";
import Explore from "./source/explore/Explore";
import Moment from "./source/moment/Moment";
import Login from "./source/login/Login";
import User from "./source/user/User";
/*
import Pet from "./source/pet/Pet";
import AddPet from "./source/pet/Add";
import PostMoment from "./source/moment/Post";
import EditProfile from "./source/user/Change";
import EditPet from "./source/pet/Edit";
import WatchList from "./source/watch/Private";
import Love from "./source/love/Love";

import Signup from "./source/login/Signup";
import Request from "./source/request/Request";
*/
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
            privateData: [],
            //store token for signup
            signupData: null,
            //store signup platform
            signupPlatform: null,
            //store friend request data
            requestData: [],
            //refresh public list
            refresh: true
        };
    }
    //get most recent public images for watch on app open
    componentWillMount() {
        //load 20 newest moments by default
        fetch("https://thousanday.com/index/read?load=0", {
            method: "GET",
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
            //consist watchd ata with all image src
            let watch = processGallery(result);
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
        await AsyncStorage.setItem("Token_KEY", key[2]);
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
            fetch("https://thousanday.com/index/read?load=" + this.state.watchTimes, {
                method: "GET",
            })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    processError(response);
                }
            })
            .then((result) => {
                if (result.length !== 0) {
                    //consist watch data with all image src
                    let newWatch = processGallery(result);
                    //lock load more watch public image function
                    if (result.length < 20) {
                        this.setState({
                            watchData: this.state.watchData.concat(newWatch),
                            watchTimes: this.state.watchTimes + 1,
                            watchLocker: true
                        });
                    } else {
                        this.setState({
                            watchData: this.state.watchData.concat(newWatch),
                            watchTimes: this.state.watchTimes + 1
                        });
                    }
                } else {
                    //active lock when no more images
                    this.setState({watchLocker: true});
                }
            });
        }
    }
    //if user click on one pet, read pet data
    clickPet(id) {
        //pet page didn't be requested before
        if (this.state.petId !== id) {
            fetch("https://thousanday.com/pet/read?id=" + id, {
                method: "GET"
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    processError(response);
                }
            })
            .then((pet) => {
                this.setState({route: "pet", petData: pet, petId: id});
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
                fetch("https://thousanday.com/user/read?id=" + id, {
                    method: "GET",
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        processError(response);
                    }
                })
                .then((user) => {
                    this.setState({route: "user", pageData: user, pageId: id});
                });
            } else {
                //go to user page directlly
                this.setState({route: "user"});
            }
        }
    }
    //if user click on one moment, read moment data
    clickMoment(id) {
        fetch("https://thousanday.com/moment/read?id=" + id, {
            method: "GET",
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                processError(response);
            }
        })
        .then((moment) => {
            this.setState({route: "moment", momentData: moment, momentId: id});
        });
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
        fetch("https://thousanday.com/user/read?id=" + result[0], {
            method: "GET",
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                processError(response);
            }
        })
        .then((user) => {
            if (!this.state.userId) {
                if (platform && platform === "google") {
                    this._setUserData(result, "google");
                    this.setState({userData: user, userId: result[0], userToken: result[2], userPlatform: "google"});
                } else {
                    this._setUserData(result, "facebook");
                    this.setState({userData: user, userId: result[0], userToken: result[2], userPlatform: "facebook"});
                }
            } else {
                this.setState({userData: user});
            }
        });
    }
    //facebook user logout
    userLogout() {
        this._removeUser();
        this.setState({userId: null, userData: null, userToken: null, userPlatform: null, route: "watch"});
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
        fetch("https://thousanday.com/moment/read?id=" + id, {
            method: "GET",
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                processError(response);
            }
        })
        .then((moment) => {
            this.setState({route: "moment", userData: null, petId: null, momentData: moment, momentId: id});
        });
    }
    //click edit profile page
    clickEditProfile() {
        this.setState({route: "editProfile"});
    }
    //click edit pet, get info for one pet
    clickEditPet(id) {
        fetch("https://thousanday.com/edit/read?pet=" + id + "&user=" + this.state.userId, {
            method: "GET",
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                processError(response);
            }
        })
        .then((pet) => {
            this.setState({editData: pet, route: "editPet"});
        });
    }
    //click watch lists,get watch list info
    clickWatchList() {
        fetch("https://thousanday.com/watch/read?id=" + this.state.userId, {
            method: "GET",
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                processError(response);
            }
        })
        .then((list) => {
            this.setState({privateData: list[2], route: "watchList"});
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
        fetch("https://thousanday.com/request/read?id=" + this.state.userId, {
            method: "GET",
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                processError(response);
            }
        })
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
                route = <Watch
                    data={this.state.watchData}
                    loadWatch={this.loadWatch.bind(this)}
                    clickMoment={this.clickMoment.bind(this)}
                    refresh={this.state.refresh}
                />;
                break;
            //explore page could be seen by public
            case "explore":
                route = <Explore clickMoment={this.clickMoment.bind(this)} />;
                break;
			case "moment":
                let likeUsers = [], i;
                if (this.state.momentData[2].length !== 0) {
                    for (i = 0; i < this.state.momentData[2].length; i++) {
                        likeUsers.push(parseInt(this.state.momentData[2][i].user_id));
                    }
                }
                route = <Moment
                    data={this.state.momentData}
                    like={likeUsers}
                    userId={this.state.userId}
                    userToken={this.state.userToken}
                    clickPet={this.clickPet.bind(this)}
                />
                break;
			case "home":
                //user already logged in
                if (this.state.userId) {
                    if (this.state.userData) {
                        route = <User
                            ref="user"
                            key={"user" + this.state.userId}
                            home={true}
                            userId={this.state.userId}
                            userToken={this.state.userToken}
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
                                ref="user"
                                key={"user" + this.state.userId}
                                home={true}
                                userId={this.state.userId}
                                userToken={this.state.userToken}
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
			/*
            //go to pet page when user click on pet
            case "pet":
                route = <Pet
                    key={"pet" + this.state.petId}
                    data={this.state.petData}
                    userId={this.state.userId}
                    userToken={this.state.userToken}
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
            case "love":
                route = <Love
                    userId={this.state.userId}
                    clickMoment={this.clickMoment.bind(this)}
                />
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
                        petList={this.state.userData[1]}
                        userId={this.state.userId}
                        userToken={this.state.userToken}
                        refreshMoment={this.refreshMoment.bind(this)}
                    />
                } else {
                    this.processLogin([this.state.userId], this.state.userPlatform, () => {
                        route = <PostMoment
                            petList={this.state.userData[1]}
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
                    userName={this.state.userData[0].user_name}
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
                    emptyUser={this.emptyUser.bind(this)}
                />
                break;
            case "watchList":
                route = <WatchList
                    data={this.state.privateData}
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
            
				*/
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