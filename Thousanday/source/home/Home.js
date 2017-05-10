import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from "react-native";
import noGetGender from "../../js/noGetGender.js";
import noGetType from "../../js/noGetType.js";
import {CachedImage} from "react-native-img-cache";
class Home extends Component {
    render() {
        console.log(this.props.data);
        let pets = this.props.data[3].map((pet, index) =>
            <View style={styles.hub} key={"petsthousn" + index}>
                <TouchableOpacity onPress={this.props.clickPet.bind(null, pet.pet_id)}>
                    <CachedImage
                        source={{uri: "https://thousanday.com/img/pet/" + pet.pet_id + "/cover/0.png"}}
                        style={styles.hubPet}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.clickPet.bind(null, pet.pet_id)}>
                    <View style={styles.hubDesc} >
                        <View style={styles.descFirst}>
                            <Text style={styles.firstType}>
                                {noGetType(pet.pet_type)}
                            </Text>
                            <Text style={styles.firstName}>
                                {pet.pet_name}
                            </Text>
                            <Text style={styles.firstGender}>
                                {noGetGender(pet.pet_gender)}
                            </Text>
                        </View>
                        <View style={styles.descFirst}>
                            <View style={styles.firstContain}>
                                <Image style={styles.containIcon} source={require("../../image/ability.png")} />
                                <Text style={styles.containAbility}>
                                    Ability: {pet.pet_ability}
                                </Text>
                            </View>
                            <View style={styles.firstContain}>
                                <Image style={styles.containIcon} source={require("../../image/potential.png")} />
                                <Text style={styles.containAbility}>
                                    Potential: {pet.pet_potential}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let gallery = [], i;
        for (i = 0; i < this.props.data[4].length; i += 2) {
            if (this.props.data[4][i+1]) {
                gallery.push(
                    [
                        "https://thousanday.com/img/pet/" + this.props.data[4][i].pet_id + "/moment/" + this.props.data[4][i].image_name,
                        "https://thousanday.com/img/pet/" + this.props.data[4][i+1].pet_id + "/moment/" + this.props.data[4][i+1].image_name
                    ]
                )
            } else {
                gallery.push(
                    [
                        "https://thousanday.com/img/pet/" + this.props.data[4][i].pet_id + "/moment/" + this.props.data[4][i].image_name,
                        null
                    ]
                )
            }
        }
        let dataSource = ds.cloneWithRows(gallery);
        return (
            <ScrollView contentContainerStyle={styles.main}>
                <View style={styles.row}>
                    <CachedImage
                        source={{uri: "https://thousanday.com/img/user/" + this.props.data[0].user_id + ".jpg"}}
                        style={styles.avatar}
                    />
                    <Text style={styles.rowName}>
                        Welcome!
                    </Text>
                    <Text style={styles.rowName}>
                        {this.props.data[0].user_name}
                    </Text>
                </View>
                {pets}
                <View style={styles.moment}>
                    <Image style={styles.momentIcon} source={require("../../image/moment.png")} />
                    <Text style={styles.momentTitle}>
                        Your Moments
                    </Text>
                </View>
                <ListView
                    dataSource={dataSource}
                    enableEmptySections={true}
                    renderRow={(row) =>
                        <View style={styles.gallery}>
                            <CachedImage
                                source={{uri: row[0]}}
                                style={styles.galleryImage}
                                mutable
                            />
                            <CachedImage
                                source={{uri: row[1]}}
                                style={styles.galleryImage}
                                mutable
                            />
                        </View>
                    }
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        marginHorizontal: 10
    },
    gallery: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    galleryImage: {
        width: (Dimensions.get("window").width - 20)/2.05,
        height: 180,
        marginBottom: 2,
        borderRadius: 5
    },
    moment: {
        marginTop: 30,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    momentIcon: {
        width: 40,
        height: 40,
        resizeMode: "contain"
    },
    momentTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 16
    },
    row: {
        marginTop: 10,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    rowName: {
        fontSize: 24,
        marginLeft: 10
    },
    user: {
        flexDirection: "row",
    },
    avatar: {
        marginTop: 10,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    hub: {
        marginVertical: 5,
        flexDirection: "row",
        marginHorizontal: 5,
        backgroundColor: "#f7f9fc"
    },
    hubPet: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    hubDesc: {
        marginLeft: 10,
        paddingTop: 10
    },
    descFirst: {
        flexDirection: "row",
        alignItems: "center"
    },
    firstName: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "bold"
    },
    firstGender: {
        marginLeft: 10,
        fontSize: 20
    },
    firstType: {
        fontSize: 12,
        backgroundColor: "#ef8513",
        color: "white",
        paddingVertical: 1,
        paddingHorizontal: 2,
        borderRadius: 3
    },
    firstContain: {
        backgroundColor: "#f7d7b4",
        paddingHorizontal: 4,
        marginTop: 5,
        paddingVertical: 4,
        borderRadius: 3,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10
    },
    containIcon: {
        width: 18,
        height: 18,
        resizeMode: "contain"
    },
    containAbility: {
        marginLeft: 5,
    }
});

export default Home;
