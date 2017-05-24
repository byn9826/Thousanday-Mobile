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
            loadTimes: 1,
            refresh: false
        };
    }
    loadMore() {
        if (!this.state.petLocker) {
            fetch("https://thousanday.com/pets/loadMoments", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": this.props.data[0].pet_id,
                    "load": this.state.loadTimes
                })
            })
            .then((response) => response.json())
            .then((pet) => {
                switch (pet) {
                    case 0:
                        alert("Can't get data, try later");
                        break;
                    default:
                        let newImage = this.state.petImages.concat(pet);
                        if (pet.length === 20) {
                            this.setState({petImages: newImage, loadTimes: this.state.loadTimes + 1});
                        } else {
                            this.setState({petImages: newImage, loadTimes: this.state.loadTimes + 1, petLocker: true});
                        }
                        break;
                }
            });
        }
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
            <FlatList
                contentContainerStyle={styles.container}
                ListHeaderComponent={()=>{
                    return (
                        <View style={styles.containerHeader}>
                            <CachedImage
                                source={{uri: "https://thousanday.com/img/pet/" + this.props.data[0].pet_id + "/cover/0.png"}}
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
                                <Text style={styles.headerWatch}>
                                    {this.props.data[2].indexOf(this.props.userId) === -1?"+ watch":"Watched"} | by {this.props.data[2].length}
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
