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
        fetch("https://thousanday.com/lists/readWatch", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": this.props.userId,
            })
        })
        .then((response) => response.json())
        .then((result) => {
            this.setState({refresh: false});
            switch(result) {
                case 0:
                    alert("Can't get data, try later");
                    break;
                case 1:
                    break;
                default:
                    if (result[0].length === 20) {
                        this.setState({watchData: result[0], watchList: result[1]});
                    } else {
                        this.setState({watchData: result[0], watchList: result[1], locker: true});
                    }
                    break;
            }
        });
    }
    loadMore() {
        if (this.state.list === "watch") {
            if (!this.state.locker) {
                fetch("https://thousanday.com/lists/loadWatch", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "list": this.state.watchList,
                        "load": this.state.load
                    })
                })
                .then((response) => response.json())
                .then((result) => {
                    switch (result) {
                        case 0:
                            alert("Can't get data, try later");
                            break;
                        default:
                            let newData = this.state.watchData.concat(result);
                            if (result.length === 20) {
                                this.setState({watchData: newData, load: this.state.load + 1});
                            } else {
                                this.setState({watchData: newData, load: this.state.load + 1, locker: true});
                            }
                            break;
                    }
                });
            }
        } else if (this.state.list === "love") {
            if (!this.state.loveLocker) {
                fetch("https://thousanday.com/lists/readLove", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "id": this.props.userId,
                        "load": this.state.loveLoad
                    })
                })
                .then((response) => response.json())
                .then((result) => {
                    switch (result) {
                        case 0:
                            alert("Can't get data, try later");
                            break;
                        default:
                            let newLove = this.state.loveData.concat(result);
                            if (result.length === 20) {
                                this.setState({loveData: newLove, loveLoad: this.state.loveLoad + 1});
                            } else {
                                this.setState({loveData: newLove, loveLoad: this.state.loveLoad + 1, loveLocker: true});
                            }
                            break;
                    }
                });
            }
        } else if (this.state.list === "comment") {
            if (!this.state.commentLocker) {
                fetch("https://thousanday.com/lists/readComment", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "id": this.props.userId,
                        "load": this.state.commentLoad
                    })
                })
                .then((response) => response.json())
                .then((result) => {
                    switch (result) {
                        case 0:
                            alert("Can't get data, try later");
                            break;
                        default:
                            let newComment = this.state.commentData.concat(result);
                            if (result.length === 20) {
                                this.setState({commentData: newComment, commentLoad: this.state.commentLoad + 1});
                            } else {
                                this.setState({commentData: newComment, commentLoad: this.state.commentLoad + 1, commentLocker: true});
                            }
                            break;
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
                    fetch("https://thousanday.com/lists/readLove", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "id": this.props.userId,
                            "load": 0
                        })
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        this.setState({refresh: false});
                        switch (result) {
                            case 0:
                                alert("Can't get data, try later");
                                break;
                            default:
                                if (result.length === 20) {
                                    this.setState({loveData: result, loveLoad: 1, list: "love", loveLocker: false});
                                } else {
                                    this.setState({loveData: result, loveLoad: 1, list: "love", loveLocker: true});
                                }
                                break;
                        }
                    });
                } else {
                    this.setState({list: "love"});
                }
            } else if (list === "comment") {
                if (!this.state.commentData) {
                    this.setState({refresh: true});
                    fetch("https://thousanday.com/lists/readComment", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "id": this.props.userId,
                            "load": 0
                        })
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        this.setState({refresh: false});
                        switch (result) {
                            case 0:
                                alert("Can't get data, try later");
                                break;
                            default:
                                if (result.length === 20) {
                                    this.setState({commentData: result, commentLoad: 1, list: "comment", commentLocker: false});
                                } else {
                                    this.setState({commentData: result, commentLoad: 1, list: "comment", commentLocker: true});
                                }
                                break;
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
                        image: "https://thousanday.com/img/pet/" + this.state.watchData[i].pet_id + "/moment/" + this.state.watchData[i].image_name
                    }
                )
            }
        } else if (this.state.list === "love") {
            for (i = 0; i < this.state.loveData.length; i++) {
                data.push(
                    {
                        key: this.state.loveData[i].moment_id,
                        image: "https://thousanday.com/img/pet/" + this.state.loveData[i].pet_id + "/moment/" + this.state.loveData[i].image_name
                    }
                )
            }
        } else if (this.state.list === "comment") {
            for (i = 0; i < this.state.commentData.length; i++) {
                data.push(
                    {
                        key: this.state.commentData[i].moment_id,
                        image: "https://thousanday.com/img/pet/" + this.state.commentData[i].pet_id + "/moment/" + this.state.commentData[i].image_name
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
        width: (Dimensions.get("window").width - 20)/2.02,
        height: 180,
        resizeMode: "cover",
        marginBottom: 4,
        borderRadius: 5
    }
});

export default Love;
