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
            petLocker: (this.props.data[1].length < 20)? true: false,
            //store images
            petImages: this.props.data[1] || [],
            //indicate how many time load more image
            loadTimes: 1
        };
    }
    render() {
        //show second relative if exist
        let parent;
        if (this.props.data[0].relative_id) {
            parent = (
                <TouchableOpacity onPress={this.props.clickUser.bind(null, this.props.data[0].relative_id)}>
                    <CachedImage
                        style={styles.boxRound}
                        source={{uri: "https://thousanday.com/img/user/" + this.props.data[0].relative_id + ".jpg"}}
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
                    <CachedImage
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
                    <CachedImage
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
                    key: "https://thousanday.com/img/pet/" + this.state.petImages[i].pet_id + "/moment/" + this.state.petImages[i].image_name,
                    id: this.state.petImages[i].moment_id
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
                            <TouchableOpacity onPress={this.props.clickUser.bind(null, this.props.data[0].owner_id)}>
                                <CachedImage
                                    style={styles.boxRound}
                                    source={{uri: "https://thousanday.com/img/user/" + this.props.data[0].owner_id + ".jpg"}}
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
                <TouchableOpacity onPress={this.props.petWatch.bind(null)}>
                    <Text style={styles.rootWatch}>
                        {this.props.data[2].indexOf(this.props.userId) === -1?"+ watch":"Watched"} | by {this.props.data[2].length}
                    </Text>
                </TouchableOpacity>
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
    rootWatch: {
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
