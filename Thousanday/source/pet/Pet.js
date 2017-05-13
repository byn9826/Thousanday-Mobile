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
import {CachedImage} from "react-native-img-cache";
import noGetGender from "../../js/noGetGender.js";
import noGetType from "../../js/noGetType.js";
import noGetNature from "../../js/noGetNature.js";
class Pet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //indicate lock load more function
            petLocker: (this.props.data[4].length < 20)? true: false,
            //store images
            petImages: this.props.data[4] || [],
            //indicate how many time load more image
            loadTimes: 1
        };
    }
    //load more image
    loadMore() {
        let data = {
            "petId": this.props.data[0].pet_name,
            "showMore": this.state.loadTimes,
            "addOne": 0
        };
        fetch("https://thousanday.com/pet/loadMoment", {
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
                        //lock load more image
                        if (result.length < 20) {
                            this.setState({
                                petImages: this.state.petImages.concat(result),
                                loadTimes: this.state.loadTimes + 1,
                                petLocker: true
                            });
                        } else {
                            this.setState({
                                petImages: this.state.petImages.concat(result),
                                loadTimes: this.state.loadTimes + 1
                            });
                        }
                    } else {
                        //active lock when no more images
                        this.setState({petLocker: true});
                    }
            }
        });
    }
    render() {
        //show second relative if exist
        let parent;
        if (this.props.data[1][1]) {
            parent = (
                <TouchableOpacity onPress={this.props.clickUser.bind(null, this.props.data[1][1].user_id)}>
                    <Image
                        style={styles.boxRound}
                        source={{uri: "https://thousanday.com/img/user/" + this.props.data[1][1].user_id + ".jpg"}}
                        mutable
                    />
                </TouchableOpacity>
            )
        }
        //show friends if exist
        let friend1, friend2;
        if (this.props.data[0].companion_first) {
            friend1 = (
                <TouchableOpacity onPress={this.props.clickPet.bind(null, this.props.data[0].companion_first)}>
                    <Image
                        style={styles.boxImage}
                        source={{uri: "https://thousanday.com/img/pet/" + this.props.data[0].companion_first + "/cover/0.png"}}
                        mutable
                    />
                </TouchableOpacity>
            )
        }
        if (this.props.data[0].companion_second) {
            friend2 = (
                <TouchableOpacity onPress={this.props.clickPet.bind(null, this.props.data[0].companion_second)}>
                    <Image
                        style={styles.boxImage}
                        source={{uri: "https://thousanday.com/img/pet/" + this.props.data[0].companion_second + "/cover/0.png"}}
                        mutable
                    />
                </TouchableOpacity>
            )
        }
        //process data to get all images
        let gallery = [], i;
        for (i = 0; i < this.state.petImages.length; i++) {
            gallery.push(
                {
                    key: "https://thousanday.com/img/pet/" + this.state.petImages[i][3] + "/moment/" + this.state.petImages[i][1],
                    id: this.state.petImages[i][0]
                }
            )
        }
        return (
            <ScrollView contentContainerStyle={styles.root}>
                <CachedImage
                    source={{uri: "https://thousanday.com/img/pet/" + this.props.data[0].pet_id + "/cover/0.png"}}
                    style={styles.rootAvatar}
                    mutable
                />
                <Text style={styles.rootName}>
                    {this.props.data[0].pet_name}
                </Text>
                <View style={styles.rootRow}>
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
                <View style={styles.rootTeam}>
                    <View style={styles.teamParent}>
                        <Text style={styles.parentTitle}>
                            {this.props.data[0].pet_gender === 0 ? "His ": "Her "}Family
                        </Text>
                        <View style={styles.parentBox}>
                            <TouchableOpacity onPress={this.props.clickUser.bind(null, this.props.data[1][0].user_id)}>
                                <Image
                                    style={styles.boxRound}
                                    source={{uri: "https://thousanday.com/img/user/" + this.props.data[1][0].user_id + ".jpg"}}
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
                <View style={styles.rootHolder}>
                    <Image style={styles.holderIcon} source={require("../../image/moment.png")} />
                    <Text style={styles.holderTitle}>
                        {this.props.data[0].pet_name + "'s"} Moments
                    </Text>
                </View>
                <FlatList
                    contentContainerStyle={styles.rootContainer}
                    data = {gallery}
                    renderItem={({item}) =>
                        <TouchableOpacity onPress={this.props.clickMoment.bind(null, item.id)} >
                            <CachedImage
                                source={{uri: item.key}}
                                style={styles.containerImage}
                            />
                        </TouchableOpacity>
                    }
                    onEndReached={()=>{
                        //Scroll to end, Call load more images function
                        if (!this.state.petLocker) {
                            this.loadMore();
                        }
                    }}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginHorizontal: 20,
        paddingTop: 20,
        alignItems: "center"
    },
    rootAvatar: {
        width: 100,
        height: 100,
        borderRadius: 5
    },
    rootName: {
        fontSize: 24,
        marginTop: 5,
        fontWeight: "bold"
    },
    rootRow: {
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
    rootTeam: {
        flexDirection: "row",
        marginBottom: 30
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
    rootHolder: {
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
    rootContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    containerImage: {
        width: (Dimensions.get("window").width - 40 )/2.02,
        height: 180,
        resizeMode: "cover",
        marginBottom: 3,
        borderRadius: 5
    }
});

export default Pet;
