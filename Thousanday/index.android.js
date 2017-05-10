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
import Explore from "./source/explore/Explore";
import Login from "./source/home/Login";
import Home from "./source/home/Home";

export default class Thousanday extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //store info to show which page
            route: "watch",
            //store data show watch page image gallery
            gallery: [],
            //store login user id
            userId: null,
            //store all info for user page
            userData: null
        };
    }
    componentWillMount() {
        //get stayed login user
        let userId
        try{
            userId = AsyncStorage.getItem("userId");
        } finally{
            alert(userId);
        }
        
        try {
            AsyncStorage.removeItem("userId");
        } catch (error) {
            alert(error);
        }
        if (userId !== null){
            this.setState({userId: userId});
            //AsyncStorage.setItem("userId", null);
        }
        //AsyncStorage.setItem("userId", null);
        //get data to show image gallery
        fetch("https://thousanday.com/watch/view", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((result) => {
            this.setState({gallery: result[0]});
        });
    }
    //change view after click
    viewRoute(view) {
        if (this.state.route != view) {
            this.setState({route: view});
        }
    }
    //login by facebook
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
        .then((result) => {
            switch (result) {
                case "0":
                    console.log("Can't connect to db");
                    break;
                case "1":
                    console.log("User not exist");
                    break;
                default:
                    if (!this.state.userId) {
                        try {
                            AsyncStorage.setItem("userId", result[0]);
                        } catch (error) {
                            console.log(error);
                        } finally {
                            this.setState({userData: result, userId: result[0]});
                        }
                    } else {
                        this.setState({userData: result});
                    }
                    break;
                    //ReactDOM.render(<User user={result[0]} relative={result[1]} relation={result[2]} pet={result[3]} moment={result[4]} visitorId={result[5]} visitorName={result[6]} petsList={result[7]} unread={result[8]} />, document.getElementById("root"));
            }
        });
    }
    render() {
        //show differnt page base on route
        let route;
        switch (this.state.route) {
            case "watch":
                route = <Watch gallery={this.state.gallery} />;
                break;
            case "explore":
                route = <Explore />;
                break;
            case "home":
                if (this.state.userId) {
                    if (this.state.userData) {
                        route = <Home data={this.state.userData} />
                    } {
                        //get data for user first 
                        //this.userLogin([this.state.userId]);
                        route = <Home data={this.state.userData} />
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
                <Footer route={this.viewRoute.bind(this)} view={this.state.route} />
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
