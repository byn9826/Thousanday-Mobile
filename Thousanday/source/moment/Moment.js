import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from "react-native";
import {CachedImage} from "react-native-img-cache";
class Moment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //if current user watched this pet
            like: this.props.like || []
        };
    }
    clickLike() {
        if (!this.props.userId) {
            alert("Please login first!");
        } else if (this.state.like.indexOf(this.props.userId) === -1) {
            //watch or unwatch pet
            fetch("http://192.168.0.13:5000/moments/updateLike", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "action": 1,
                    "id": this.props.userId,
                    "moment": this.props.data[0].moment_id,
                    "token": this.props.userToken
                })
            })
            .then((response) => response.json())
            .then((result) => {
                switch (result) {
                    case 0:
                        alert("Can't get data, please try later");
                        break;
                    case 1:
                        this.state.like.push(this.props.userId);
                        this.setState({like: this.state.like});
                        break;
                    case 2:
                        alert("Please login first");
                        break;
                }
            });
        } else {
            fetch("http://192.168.0.13:5000/moments/updateLike", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "action": 0,
                    "id": this.props.userId,
                    "moment": this.props.data[0].moment_id,
                    "token": this.props.userToken
                })
            })
            .then((response) => response.json())
            .then((result) => {
                switch (result) {
                    case 0:
                        alert("Can't get data, please try later");
                        break;
                    case 1:
                        this.state.like.splice(this.state.like.indexOf(this.props.userId), 1);
                        this.setState({like: this.state.like});
                        break;
                    case 2:
                        alert("Please login first");
                        break;
                }
            });
        }
    }
    render() {
        let comments = this.props.data[2].map((comment, index)=>
            <View key={"comments"+ index} style={styles.commentLine}>
                <CachedImage
                    source={{uri: "https://thousanday.com/img/user/" + comment.user_id + ".jpg"}}
                    style={styles.lineAvatar}
                />
                <Text style={styles.lineContent}>
                    {comment.comment_content}
                </Text>
            </View>

        )
        console.log(this.props.data);
        return (
            <ScrollView contentContainerStyle={styles.root}>
                <View style={styles.rootTop}>
                    <TouchableOpacity onPress={this.props.clickPet.bind(null, this.props.data[0].pet_id)}>
                        <CachedImage
                            source={{uri: "https://thousanday.com/img/pet/" + this.props.data[0].pet_id + "/cover/0.png"}}
                            style={styles.topAvatar}
                        />
                    </TouchableOpacity>
                    <View style={styles.topMessage}>
                        <Text style={styles.messageMoment}>
                            {this.props.data[0].moment_message}
                        </Text>
                        <Text style={styles.messageDate}>
                            {new Date(this.props.data[0].moment_date).toISOString().substring(0, 10)}
                        </Text>
                    </View>
                </View>
                <CachedImage
                    source={{uri: "https://thousanday.com/img/pet/" + this.props.data[0].pet_id + "/moment/" + this.props.data[0].image_name}}
                    style={styles.rootImg}
                />
                <View style={styles.rootSocial}>
                    {
                        (this.state.like.indexOf(this.props.userId) === -1)?(
                            <TouchableOpacity onPress={this.clickLike.bind(this)}>
                                <Text style={styles.socialLove}>
                                    &#128151; {this.state.like.length}
                                </Text>
                            </TouchableOpacity>
                        ):(
                            <TouchableOpacity onPress={this.clickLike.bind(this)}>
                                <Text style={styles.socialLove}>
                                    &#128152; {this.state.like.length}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
                <Text style={styles.rootTitle}>
                    Comments
                </Text>
                <View style={styles.rootComment}>
                    {comments}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginTop: 10,
        alignItems: "center",
        marginHorizontal: 10,
    },
    rootTop: {
        marginVertical: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    topAvatar: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 15
    },
    topMessage: {
        flex: 5,
    },
    messageMoment: {
        fontSize: 16,
        backgroundColor: "black",
        color: "white",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    messageDate: {
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5
    },
    rootImg: {
        width: Dimensions.get("window").width - 40,
        height: 300,
        resizeMode: "contain",
        borderRadius: 5
    },
    rootSocial: {
        flexDirection: "row",
        alignSelf: "flex-start",
        marginHorizontal: 20,
        marginVertical: 10,
    },
    socialLove: {
        fontSize: 20,
    },
    rootTitle: {
        marginTop: 20,
        alignSelf: "flex-start",
        marginLeft: 20,
        fontWeight: "bold",
        fontSize: 18
    },
    rootComment: {
        borderTopWidth: 1,
        borderTopColor: "black",
        paddingTop: 15,
        marginTop: 5,
        marginBottom: 20,
        marginHorizontal: 20,
        alignSelf: 'stretch',
    },
    commentLine: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7d7b4",
        borderRadius: 5
    },
    lineAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginVertical: 5,
        marginHorizontal: 5
    },
    lineContent: {
        flex: 1,
        marginHorizontal: 10,
    }
});

export default Moment;
