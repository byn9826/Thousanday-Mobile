import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity
} from "react-native";
import processError from "../../js/processError.js";
import {CachedImage} from "react-native-img-cache";
class Love extends Component {
    constructor(props) {
        super(props);
        this.state = {
            watchData: [],
            watchList: [],
            loveData: null,
            loveLoad: null,
            loveLocker: null,
            commentData: null,
            commentLoad: null,
            commentLocker: null,
            load: 1,
            locker: false,
            list: "watch",
            refresh: false
        };
    }
    componentWillMount() {
        this.setState({refresh: true});
        //load 20 newest moments by default
        fetch("http://192.168.0.13:7999/watch/read?id=" + this.props.userId, {
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
            if (result[1].length === 20) {
                this.setState({watchData: result[1], watchList: result[0]});
            } else {
                this.setState({watchData: result[1], watchList: result[0], locker: true});
            }
        });
    }
    loadMore() {
        if (this.state.list === "watch") {
            if (!this.state.locker) {
                fetch("http://192.168.0.13:7999/watch/load", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "list": this.state.watchList,
                        "load": this.state.load,
                        "route": "watch",
                        "user": this.props.userId
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
                    let newData = this.state.watchData.concat(result);
                    if (result.length === 20) {
                        this.setState({watchData: newData, load: this.state.load + 1});
                    } else {
                        this.setState({watchData: newData, load: this.state.load + 1, locker: true});
                    }
                });
            }
        } else if (this.state.list === "love") {
            if (!this.state.loveLocker) {
                fetch("http://192.168.0.13:7999/watch/load", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "user": this.props.userId,
                        "load": this.state.loveLoad,
                        "list": null,
                        "route": "love",
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
                    let newLove = this.state.loveData.concat(result);
                    if (result.length === 20) {
                        this.setState({loveData: newLove, loveLoad: this.state.loveLoad + 1});
                    } else {
                        this.setState({loveData: newLove, loveLoad: this.state.loveLoad + 1, loveLocker: true});
                    }
                });
            }
        } else if (this.state.list === "comment") {
            if (!this.state.commentLocker) {
                fetch("http://192.168.0.13:7999/watch/load", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "user": this.props.userId,
                        "load": this.state.commentLoad,
                        "list": null,
                        "route": "comment",
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
                    let newComment = this.state.commentData.concat(result);
                    if (result.length === 20) {
                        this.setState({commentData: newComment, commentLoad: this.state.commentLoad + 1});
                    } else {
                        this.setState({commentData: newComment, commentLoad: this.state.commentLoad + 1, commentLocker: true});
                    }
                });
            }
        }
    }
    //change lists
    changeList(list) {
        if (list !== this.state.list) {
            if (list === "love") {
                if (!this.state.loveData) {
                    this.setState({refresh: true});
                    fetch("http://192.168.0.13:7999/watch/load", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "user": this.props.userId,
                            "load": 0,
                            "list": null,
                            "route": "love",
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
                        if (result.length === 20) {
                            this.setState({loveData: result, loveLoad: 1, list: "love", loveLocker: false});
                        } else {
                            this.setState({loveData: result, loveLoad: 1, list: "love", loveLocker: true});
                        }
                    });
                } else {
                    this.setState({list: "love"});
                }
            } else if (list === "comment") {
                if (!this.state.commentData) {
                    this.setState({refresh: true});
                    fetch("http://192.168.0.13:7999/watch/load", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "user": this.props.userId,
                            "load": 0,
                            "list": null,
                            "route": "comment",
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
                        if (result.length === 20) {
                            this.setState({commentData: result, commentLoad: 1, list: "comment", commentLocker: false});
                        } else {
                            this.setState({commentData: result, commentLoad: 1, list: "comment", commentLocker: true});
                        }
                    });
                } else {
                    this.setState({list: "comment"});
                }
            } else {
                this.setState({list: list});
            }
        }
    }
    render() {
        let data = [], i;
        if (this.state.list === "watch") {
            for (i = 0; i < this.state.watchData.length; i++) {
                data.push(
                    {
                        key: this.state.watchData[i].moment_id,
                        image: "http://192.168.0.13:7999/img/pet/" + this.state.watchData[i].pet_id + "/moment/" + this.state.watchData[i].image_name
                    }
                )
            }
        } else if (this.state.list === "love") {
            for (i = 0; i < this.state.loveData.length; i++) {
                data.push(
                    {
                        key: this.state.loveData[i].moment_id,
                        image: "http://192.168.0.13:7999/img/pet/" + this.state.loveData[i].pet_id + "/moment/" + this.state.loveData[i].image_name
                    }
                )
            }
        } else if (this.state.list === "comment") {
            for (i = 0; i < this.state.commentData.length; i++) {
                data.push(
                    {
                        key: this.state.commentData[i].moment_id,
                        image: "http://192.168.0.13:7999/img/pet/" + this.state.commentData[i].pet_id + "/moment/" + this.state.commentData[i].image_name
                    }
                )
            }
        }
        return (
            <FlatList
                contentContainerStyle={styles.root}
                ListHeaderComponent={()=>{
                    return (
                        <View style={styles.rootHeader}>
                            <TouchableOpacity onPress={this.changeList.bind(this, "watch")}>
                                <View style={(this.state.list === "watch")?styles.headerContain:styles.headerChoose}>
                                    <Image
                                        source={require("../../image/follow.png")}
                                    />
                                    <Text style={styles.containSection}>
                                        Watch
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.changeList.bind(this, "love")}>
                                <View style={(this.state.list === "love")?styles.headerContain:styles.headerChoose}>
                                    <Image
                                        source={require("../../image/love.png")}
                                    />
                                    <Text style={styles.containSection}>
                                        Love
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.changeList.bind(this, "comment")}>
                                <View style={(this.state.list === "comment")?styles.headerContain:styles.headerChoose}>
                                    <Image
                                        source={require("../../image/comment.png")}
                                    />
                                    <Text style={styles.containSection}>
                                        Comment
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }}
                data = {data}
                renderItem={({item}) =>
                    <TouchableOpacity onPress={this.props.clickMoment.bind(null, item.key)}>
                        <CachedImage
                            source={{uri: item.image}}
                            style={styles.rootImage}
                        />
                    </TouchableOpacity>
                }
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                }}
                onEndReached={this.loadMore.bind(this)}
                onRefresh={()=>{}}
                refreshing={this.state.refresh}
            />
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginHorizontal: 10,
        marginTop: 20,
        paddingBottom: 30
    },
    rootHeader: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 20,
        borderBottomWidth: 3,
        borderBottomColor: "#abaeb2",
        paddingBottom: 20
    },
    headerContain: {
        backgroundColor: "#ef8513",
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 5,
        paddingHorizontal: 2,
        width: (Dimensions.get("window").width - 26) /3.5,
        marginHorizontal: 10,
        justifyContent: "center"
    },
    headerChoose: {
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 5,
        paddingHorizontal: 2,
        width: (Dimensions.get("window").width - 26) /3.5,
        marginHorizontal: 10,
        justifyContent: "center"
    },
    rootImage: {
        width: Dimensions.get("window").width/2 - 12,
        height: Dimensions.get("window").width/2 - 12,
        resizeMode: "cover",
        marginBottom: 4,
        borderRadius: 5
    }
});

export default Love;
