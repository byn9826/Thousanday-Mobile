import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image
} from "react-native";

const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken
} = FBSDK;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require("../../image/logo.png")} />
                <Text style={styles.title}>
                    Welcome! Please login ..
                </Text>
                <Text style={styles.notice}>
                    or Create a new account by click Google or Facebook blow
                </Text>
                <Facebook getId={this.props.facebookLogin.bind(this)} />
            </View>
        )
    }
}

let Facebook = React.createClass({
    render: function() {
        return (
            <View style={styles.facebook}>
                <LoginButton
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("login has error: " + result.error);
                            } else if (result.isCancelled) {
                                alert("login is cancelled.");
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                    (data) => {
                                        console.log(data.accessToken);
                                        let token = data.accessToken;
                                        //find user id from backend
                                        let info = {
                                            "token": token
                                        };
                                        fetch("https://thousanday.com/account/facebookLogin", {
                                            method: "POST",
                                            headers: {
                                                "Accept": "application/json",
                                                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                                            },
                                            body: Object.keys(info).map((key) => {
                                                return encodeURIComponent(key) + '=' + encodeURIComponent(info[key]);
                                            }).join('&')
                                        })
                                        .then((response) => response.json())
                                        .then((result) => {
                                            switch(result) {
                                                case 0:
                                                    console.log("Can't connect to database");
                                                    break;
                                                case 1:
                                                    console.log("Account not exist");
                                                    break;
                                                case 2:
                                                    console.log("Can't validate Facebook account");
                                                    break;
                                                case 3:
                                                    console.log("Please logout first");
                                                    break;
                                                default:
                                                    this.props.getId(result);
                                                    //this.setState({loginName: result[1], loginId: result[0], newNum: result[2], showDrop: false});
                                            }
                                        });
                                    }
                                )
                            }
                        }
                    }
                    onLogoutFinished={
                        () => {
                            fetch("https://thousanday.com/account/logOut", {
                                method: "POST",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                },
                            })
                            .then((response) => response.json())
                            .then((result) => {
                                switch (result) {
                                    case 0:
                                        console.log("logged out");
                                        break;
                                    case 1:
                                        console.log("Please try again");
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
    container: {
        flex: 1,
        marginHorizontal: 10,
        alignItems: "center"
    },
    logo: {
        marginTop: 50,
        width: 50,
        height: 50,
    },
    title: {
        marginVertical: 10,
        fontSize: 20,
        fontWeight: "bold"
    },
    notice: {
        fontSize: 12
    },
    facebook: {
        marginVertical: 25
    }
});

export default Login;