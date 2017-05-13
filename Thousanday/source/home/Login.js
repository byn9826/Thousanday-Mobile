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
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

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
    _gSignIn() {
        GoogleSignin.signIn()
            .then((user) => {
                let token = user.idToken;
                //find user id from backend
                let info = {
                    "token": token
                };
                fetch("https://thousanday.com/account/gMobileLogin", {
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
                            alert("Can't get data, try later");
                            break;
                        case 1:
                            alert("Account not exist");
                            break;
                        case 2:
                            alert("Can't validate Google account");
                            break;
                        case 3:
                            alert("Please logout first");
                            break;
                        default:
                            this.props.googleLogin(result);
                    }
                });
            })
            .catch((err) => {
                alert(err);
            })
            .done();
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require("../../image/logo.png")} />
                <Text style={styles.title}>
                    Welcome! Please login ..
                </Text>
                <Text style={styles.notice}>
                    or Create a new account by Google or Facebook blow
                </Text>
                <View style={styles.google}>
                    <GoogleSigninButton
                        style={{width: 186, height: 38}}
                        size={GoogleSigninButton.Size.Standard}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={this._gSignIn.bind(this)}
                    />
                </View>
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
        fontSize: 14
    },
    google: {
        marginTop: 20
    },
    facebook: {
        marginVertical: 15
    }
});

export default Login;
