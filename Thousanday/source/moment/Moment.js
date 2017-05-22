import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Button,
    Share
} from "react-native";
import {CachedImage} from "react-native-img-cache";
class Moment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //if current user watched this pet
            like: this.props.like || [],
            comment: "",
            //store comment list
            list: this.props.data[2] || [],
            //load more comment
            load: (this.props.data[2].length === 5)?1:false,
            //send how many comment
            send: 0
        };
    }
    clickLike() {
        if (!this.props.userId) {
            alert("Please login first!");
        } else if (this.state.like.indexOf(this.props.userId) === -1) {
            //watch or unwatch pet
            fetch("https://thousanday.com/moments/updateLike", {
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
            fetch("https://thousanday.com/moments/updateLike", {
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
    //send new comment
    sendMessage() {
        fetch("https://thousanday.com/moments/sendComment", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": this.props.userId,
                "moment": this.props.data[0].moment_id,
                "token": this.props.userToken,
                "content": this.state.comment
            })
        })
        .then((response) => response.json())
        .then((result) => {
            switch (result) {
                case 0:
                    alert("Can't get data, please try later");
                    break;
                case 1:
                    let post = {
                        "comment_content": this.state.comment,
                        "user_id": this.props.userId
                    };
                    this.state.list.unshift(post);
                    this.setState({list: this.state.list, comment: "", send: this.state.send + 1});
                    break;
                case 2:
                    alert("Please login again");
                    break;
            }
        });
    }
    //load more comment
    loadMore() {
        fetch("https://thousanday.com/moments/loadComments", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "moment": this.props.data[0].moment_id,
                "load": this.state.load,
                "send": this.state.send
            })
        })
        .then((response) => response.json())
        .then((result) => {
            switch (result) {
                case 0:
                    alert("Can't get data, please try later");
                    break;
                default:
                    let add = this.state.list.concat(result);
                    if (result.length === 5) {
                        this.setState({list: add, load: this.state.load + 1});
                    } else {
                        this.setState({list: add, load: false});
                    }
                    break;
            }
        });
    }
    //share moment
    shareMoment() {
        Share.share({
            message: this.props.data[0].moment_message + " https://thousanday.com/moment/" + this.props.data[0].moment_id,
            url: "https://thousanday.com/moment/" + this.props.data[0].moment_id,
            title: 'Thousanday - Your pets and you'
        }, {
            dialogTitle: 'Share moment to the world',
            tintColor: 'green'
        });
    }
    render() {
        let comments = this.state.list.map((comment, index)=>
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
        return (
            <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="always">
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
                    <TouchableOpacity onPress={this.shareMoment.bind(this)}>
                        <Text style={styles.socialShare}>Share</Text>
                    </TouchableOpacity>
                </View>
                {
                    (this.state.list.length > 0)?(
                        <Text style={styles.rootTitle}>
                            Comments
                        </Text>
                    ):null
                }
                <View style={styles.rootComment}>
                    {comments}
                    {
                        this.state.load?(
                            <TouchableOpacity onPress={this.loadMore.bind(this)}>
                                <Text style={styles.commentMore}>
                                    Load More Comments ...
                                </Text>
                            </TouchableOpacity>
                        ):null
                    }
                </View>
                {
                    (this.props.userId)?(
                        <View style={styles.rootContain}>
                            <Text style={styles.rootLeave}>
                                Leave a comment:
                            </Text>
                            <TextInput
                                style={styles.rootInput}
                                multiline={true}
                                numberOfLines={5}
                                onChangeText={(text) =>
                                    this.setState({comment: text.substr(0, 150)})
                                }
                                value={this.state.comment}
                            />
                            <Text style={styles.rootHint}>
                                {this.state.comment.length} / 150
                            </Text>
                            {
                                (this.state.comment.length > 0)?(
                                    <View style={styles.rootButton}>
                                        <Button
                                            onPress={this.sendMessage.bind(this)}
                                            title="Send"
                                            color="#052456"
                                        />
                                    </View>
                                ):null
                            }
                        </View>
                    ):(
                        <Text style={styles.rootLogin}>
                            Login to leave a comment.
                        </Text>
                    )
                }
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
        alignItems: "center"
    },
    socialLove: {
        fontSize: 20,
    },
    socialShare: {
        fontSize: 14,
        backgroundColor: "#ef8513",
        color: "white",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
        marginLeft: 15
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
        alignSelf: "stretch",
    },
    commentLine: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7d7b4",
        borderRadius: 5,
        marginBottom: 10
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
    },
    commentMore: {
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: "#052456",
        alignSelf: "center",
        color: "white",
        textAlign: "center"
    },
    rootContain: {
        alignSelf: "stretch"
    },
    rootLogin: {
        marginBottom: 40
    },
    rootLeave: {
        alignSelf: "flex-start",
        marginBottom: 10,
        marginLeft: 20,
        fontWeight: "bold",
        fontSize: 18
    },
    rootInput: {
        backgroundColor: "#f7f9fc",
        alignSelf: "stretch",
        marginBottom: 5,
        marginHorizontal: 20
    },
    rootHint: {
        marginBottom: 20,
        alignSelf: "flex-start",
        marginLeft: 25
    },
    rootButton: {
        marginBottom: 50,
        marginHorizontal: 20
    }
});

export default Moment;
