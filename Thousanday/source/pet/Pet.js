import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from "react-native";
import processError from "../../js/processError.js";
import processGallery from "../../js/processGallery.js";
import {CachedImage} from "react-native-img-cache";
import noGetGender from "../../js/noGetGender.js";
import noGetType from "../../js/noGetType.js";
import noGetNature from "../../js/noGetNature.js";
class Pet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //indicate lock load more function
            petLocker: (this.props.data[3].length < 20)? true: false,
            //store images
            petImages: this.props.data[3] || [],
            //indicate how many time load more image
            loadTimes: 1,
            refresh: false,
            //store watch id list
            watchData: []
        };
    }
    componentWillMount() {
        //get all watcher id
        let watch = [], i;
        for (i = 0; i < this.props.data[4].length; i++) {
            watch[i] = parseInt(this.props.data[4][i].user_id);
        }
        this.setState({watchData: watch});
    }
    loadMore() {
        if (!this.state.petLocker) {
            fetch("http://192.168.0.13:7999/pet/load?add=0&load=" + this.state.loadTimes + "&pet=" + this.props.data[0].pet_id, {
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
                let newImage = this.state.petImages.concat(pet);
                if (pet.length === 20) {
                    this.setState({petImages: newImage, loadTimes: this.state.loadTimes + 1});
                } else {
                    this.setState({petImages: newImage, loadTimes: this.state.loadTimes + 1, petLocker: true});
                }
            });
        }
    }
    //watch a pet
    petWatch() {
        if (!this.props.userId) {
            //must login first
            alert("Please login first");
        } else  {
            let action;
            if (this.state.watchData.indexOf(this.props.userId) !== -1) {
                action = 0;
            } else {
                action = 1;
            }
            //watch or unwatch pet
            fetch("http://192.168.0.13:7999/pet/watch", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "action": action,
                    "user": this.props.userId,
                    "pet": this.props.data[0].pet_id,
                    "token": this.props.userToken
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
                if (action === 1) {
                    this.state.watchData.push(this.props.userId);
                    this.setState({watchData: this.state.watchData});
                } else {
                    this.state.watchData.splice(this.state.watchData.indexOf(this.props.userId), 1);
                    this.setState({watchData: this.state.watchData});
                }
            });
        }
    }
    render() {
        //show second relative if exist
        let parent;
        if (this.props.data[0].relative_id) {
            parent = (
                <TouchableOpacity onPress={this.props.clickUser.bind(null, parseInt(this.props.data[0].relative_id))}>
                    <CachedImage
                        style={styles.boxRound}
                        source={{uri: "http://192.168.0.13:7999/img/user/" + this.props.data[0].relative_id + ".jpg"}}
                        mutable
                    />
                </TouchableOpacity>
            )
        }
        //show friends if exist
        let friend1, friend2;
        if (this.props.data[2][0]) {
            friend1 = (
                <TouchableOpacity onPress={this.props.clickPet.bind(null, this.props.data[2][0].pet_id)}>
                    <CachedImage
                        style={styles.boxImage}
                        source={{uri: "http://192.168.0.13:7999/img/pet/" + this.props.data[2][0].pet_id + "/0.png"}}
                        mutable
                    />
                </TouchableOpacity>
            )
        }
        if (this.props.data[2][1]) {
            friend2 = (
                <TouchableOpacity onPress={this.props.clickPet.bind(null, this.props.data[2][1].pet_id)}>
                    <CachedImage
                        style={styles.boxImage}
                        source={{uri: "http://192.168.0.13:7999/img/pet/" + this.props.data[2][1].pet_id + "/0.png"}}
                        mutable
                    />
                </TouchableOpacity>
            )
        }
        //process data to get all images
        let gallery = processGallery(this.state.petImages);
        return (
            <FlatList
                contentContainerStyle={styles.container}
                ListHeaderComponent={()=>{
                    return (
                        <View style={styles.containerHeader}>
                            <CachedImage
                                source={{uri: "http://192.168.0.13:7999/img/pet/" + this.props.data[0].pet_id + "/0.png"}}
                                style={styles.headerAvatar}
                                mutable
                            />
                            <Text style={styles.headerName}>
                                {this.props.data[0].pet_name}
                            </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.rowGender}>
                                    {noGetGender(this.props.data[0].pet_gender)}
                                </Text>
                                <Text style={styles.rowType}>
                                    {noGetType(this.props.data[0].pet_type)}
                                </Text>
                                <Text style={styles.rowType}>
                                    {noGetNature(this.props.data[0].pet_nature)}
                                </Text>
                            </View>
                            <View style={styles.headerTeam}>
                                <View style={styles.teamParent}>
                                    <Text style={styles.parentTitle}>
                                        {this.props.data[0].pet_gender === 0 ? "His ": "Her "}Family
                                    </Text>
                                    <View style={styles.parentBox}>
                                        <TouchableOpacity onPress={this.props.clickUser.bind(null, parseInt(this.props.data[0].owner_id))}>
                                            <CachedImage
                                                style={styles.boxRound}
                                                source={{uri: "http://192.168.0.13:7999/img/user/" + this.props.data[0].owner_id + ".jpg"}}
                                                mutable
                                            />
                                        </TouchableOpacity>
                                        {parent}
                                    </View>
                                </View>
                                <View style={styles.teamFriend}>
                                    <Text style={styles.parentTitle}>
                                        Best Friends
                                    </Text>
                                    <View style={styles.parentBox}>
                                        {friend1}
                                        {friend2}
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity onPress={this.petWatch.bind(this)}>
                                <Text style={styles.headerWatch}>
                                    {this.state.watchData.indexOf(this.props.userId) === -1?"+ Watch":"Watched"} | by {this.state.watchData.length}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.headerHolder}>
                                <Image style={styles.holderIcon} source={require("../../image/moment.png")} />
                                <Text style={styles.holderTitle}>
                                    {this.props.data[0].pet_name + "'s"} Moments
                                </Text>
                            </View>
                        </View>
                    )
                }}
                data = {gallery}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                }}
                onRefresh={()=>{}}
                refreshing={this.state.refresh}
                onEndReached={this.loadMore.bind(this)}
                renderItem={({item}) =>
                    <TouchableOpacity onPress={this.props.clickMoment.bind(null, item.id)} >
                        <CachedImage
                            source={{uri: item.key}}
                            style={styles.containerImage}
                        />
                    </TouchableOpacity>
                }
            />
        )
    }
}


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 20,
    },
    containerHeader: {
        alignItems: "center"
    },
    headerAvatar: {
        width: 100,
        height: 100,
        borderRadius: 5
    },
    headerName: {
        fontSize: 24,
        marginTop: 5,
        fontWeight: "bold"
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    rowGender: {
        fontSize: 28,
        marginRight: 15,
        marginBottom: 5
    },
    rowType: {
        backgroundColor: "orange",
        color: "white",
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 5,
        marginRight: 15
    },
    headerTeam: {
        flexDirection: "row"
    },
    teamParent: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 12,
        alignItems: "center",
        marginTop: 15,
        backgroundColor: "#f7d7b4",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    teamFriend: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 12,
        alignItems: "center",
        marginTop: 15,
        backgroundColor: "#f7d7b4",
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    parentTitle: {
        color: "#052456",
        paddingVertical: 2,
        width: 124,
        textAlign: "center",
        borderRadius: 5,
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 10
    },
    parentBox: {
        flexDirection: "row"
    },
    boxRound: {
        width: 50,
        height: 50,
        marginHorizontal: 6,
        borderRadius: 25,
        resizeMode: "contain"
    },
    boxImage: {
        width: 50,
        height: 50,
        marginHorizontal: 6,
        borderRadius: 5,
        resizeMode: "contain"
    },
    headerWatch: {
        backgroundColor: "#052456",
        alignItems: "center",
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 50,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 30,
        fontSize: 16
    },
    headerHolder: {
        flexDirection: "row",
        alignSelf: "flex-start",
        marginBottom: 15,
        alignItems: "center"
    },
    holderIcon: {
        marginLeft: 5,
        resizeMode: "contain",
        width: 35,
        height: 35
    },
    holderTitle: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: "bold"
    },
    containerImage: {
        width: Dimensions.get("window").width/2 - 12,
        height: Dimensions.get("window").width/2 - 12,
        resizeMode: "cover",
        marginBottom: 4,
        borderRadius: 5
    }
});

export default Pet;
