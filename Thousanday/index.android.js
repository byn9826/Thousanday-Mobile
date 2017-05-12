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
import User from "./source/user/User";
import Explore from "./source/explore/Explore";
import Login from "./source/home/Login";

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
        };
    }
    //get most recent public images for watch on app open
    componentWillMount() {
        //load 10 newest moments by default
        fetch("https://thousanday.com/watch/view", {
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
            for (i = 0; i < result[0].length; i++) {
                watch.push(
                    {
                        key: "https://thousanday.com/img/pet/" + result[0][i].pet_id + "/moment/" + result[0][i].image_name
                    }
                )
            }
            this.setState({watchData: watch});
        });
    }
    //change view by route if user click on footer
    changeView(view) {
        if (this.state.route != view) {
            this.setState({route: view});
        }
    }
    //load more images for watch page
    loadWatch() {
        //check if watch lock exist
        if (!this.state.watchLocker) {
            //load another 10 public images
            let data = {
                "type": "recent",
                "time": this.state.watchTimes
            };
            fetch("https://thousanday.com/watch/loadMoment", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                body: Object.keys(data).map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                }).join('&')
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
                                        key: "https://thousanday.com/img/pet/" + result[i].pet_id + "/moment/" + result[i].image_name
                                    }
                                )
                            }
                            //lock load more watch public image function
                            if (result.length < 10) {
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
            let data = {
                "id": id
            };
            fetch("https://thousanday.com/pet/view", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                body: Object.keys(data).map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                }).join('&')
            })
            .then((response) => response.json())
            .then((pet) => {
                switch (pet) {
                    case 0:
        				alert("Can't get data, try later");
        				break;
        			case 1:
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
                let data = {
                    "id": id
                };
                fetch("https://thousanday.com/user/view", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    },
                    body: Object.keys(data).map((key) => {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                    }).join('&')
                })
                .then((response) => response.json())
                .then((user) => {
                    switch (user) {
                        case 0:
                            alert("Can't get data, try later");
                            break;
                        case 1:
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
    //load logged in user info
    componentDidMount() {
        this._loadUserData().done();
    }
    //get stored user id
    async _loadUserData() {
        let userId = await AsyncStorage.getItem("USER_KEY");
        if (userId != null) {
            this.setState({userId: parseInt(userId)});
        }
    }
    //set up user id
    async _setUserData(key) {
        await AsyncStorage.setItem("USER_KEY", key);
    }
    //get user data by userId
    userLogin(result) {
        let data = {
            "id": result[0]
        };
        fetch("https://thousanday.com/user/view", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: Object.keys(data).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&')
        })
        .then((response) => response.json())
        .then((user) => {
            switch (user) {
                case 0:
                    alert("Can't get data, try later");
                    break;
                case 1:
                    alert("User not exist");
                    break;
                default:
                    if (!this.state.userId) {
                        this._setUserData(result[0].toString());
                        this.setState({userData: user, userId: result[0]});
                    } else {
                        this.setState({userData: user});
                    }
                    break;
            }
        });
    }
    render() {
        //page route system
        let route;
        switch (this.state.route) {
            //default page, watch public images
            case "watch":
                route = <Watch data={this.state.watchData} loadWatch={this.loadWatch.bind(this)} />;
                break;
            //explore page could be seen by public
            case "explore":
                route = <Explore />;
                break;
            //go to pet page when user click on pet
            case "pet":
                route = <Pet key={"pet" + this.state.petId} data={this.state.petData} clickUser={this.clickUser.bind(this)} clickPet={this.clickPet.bind(this)} />;
                break;
            //go to user page when user click on one user
            case "user":
                route = <User key={"user" + this.state.pageId} data={this.state.pageData} clickUser={this.clickUser.bind(this)} clickPet={this.clickPet.bind(this)} />;
                break;
            case "home":
                //user already logged in
                if (this.state.userId) {
                    if (this.state.userData) {
                        route = <User key={"user" + this.state.userId} home={true} data={this.state.userData} clickUser={this.clickUser.bind(this)} clickPet={this.clickPet.bind(this)} />;
                    } else {
                        //get data for user first
                        this.userLogin([this.state.userId], () => {
                            route = <User key={"user" + this.state.userId} home={true} data={this.state.userData} clickUser={this.clickUser.bind(this)} clickPet={this.clickPet.bind(this)} />;
                        });
                    }
                } else {
                    route = <Login facebookLogin={this.userLogin.bind(this)} />;
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
