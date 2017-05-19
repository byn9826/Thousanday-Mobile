import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity
} from "react-native";
import {CachedImage} from "react-native-img-cache";
class WatchList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //store watch list
            lists: this.props.data || [],
            //store unwatch lists
            unwatch: []
        };
    }
    watchPet(id, action) {
        //watch or unwatch pet
        fetch("https://thousanday.com/pets/updateWatch", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "action": action,
                "petId": id,
                "userToken": this.props.userToken,
                "userId": this.props.userId
            })
        })
        .then((response) => response.json())
        .then((result) => {
            switch (result) {
                case 0:
                    alert("Can't get data, please try later");
                    break;
                case 1:
                    if (action === 1) {
                        this.state.unwatch.push(id);
                        this.setState({unwatch: this.state.unwatch});
                        this.props.refreshPet();
                    } else {
                        this.state.unwatch.splice(this.state.unwatch.indexOf(id), 1);
                        this.setState({unwatch: this.state.unwatch});
                        this.props.refreshPet();
                    }
                    break;
                case 2:
                    alert("Please login first");
                    break;
            }
        });
    }
    render() {
        let lists = this.state.lists.map((list, index) => {
            return (this.state.unwatch.indexOf(list.pet_id) === -1)? (
                <View key={"privatewatch" + index} style={styles.rootRow}>
                    <TouchableOpacity onPress={this.props.clickPet.bind(null, list.pet_id)}>
                        <CachedImage
                            source={{uri: "https://thousanday.com/img/pet/" + list.pet_id + "/cover/0.png"}}
                            style={styles.rowAvatar}
                            mutable
                        />
                    </TouchableOpacity>
                    <Text style={styles.rowName}>
                        {list.pet_name}
                    </Text>
                    <TouchableOpacity onPress={this.watchPet.bind(this, list.pet_id, 1)}>
                        <Text style={styles.rowWatch}>
                            unwatch
                        </Text>
                    </TouchableOpacity>
                </View>
            ): (
                <View key={"privatewatch" + index} style={styles.rootRow}>
                    <TouchableOpacity onPress={this.props.clickPet.bind(null, list.pet_id)}>
                        <CachedImage
                            source={{uri: "https://thousanday.com/img/pet/" + list.pet_id + "/cover/0.png"}}
                            style={styles.rowAvatar}
                            mutable
                        />
                    </TouchableOpacity>
                    <Text style={styles.rowName}>
                        {list.pet_name}
                    </Text>
                    <TouchableOpacity onPress={this.watchPet.bind(this, list.pet_id, 0)}>
                        <Text style={styles.rowBack}>
                            watch
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        })
        return (
            <ScrollView contentContainerStyle={styles.root}>
                <View style={styles.rootHeader}>
                    <Image
                        source={require("../../image/watch.png")}
                        style={styles.headerIcon}
                    />
                    <Text style={styles.headerList}>
                        Pets on your watch list
                    </Text>
                </View>
                {lists}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginHorizontal: 20,
        marginTop: 20
    },
    rootHeader: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center"
    },
    headerList: {
        fontSize: 16,
        fontWeight: "bold"
    },
    headerIcon: {
        marginRight: 15,
        width: 28,
        height: 28,
        resizeMode: "contain"
    },
    rootRow: {
        backgroundColor: "#e5e5e5",
        flexDirection: "row",
        borderRadius: 5,
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "space-between"
    },
    rowAvatar: {
        width: 80,
        height: 80,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    rowName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    rowWatch: {
        marginRight: 20,
        backgroundColor: "#ef8513",
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        borderRadius: 5
    },
    rowBack: {
        marginRight: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: "#ef8513",
        fontSize: 16,
        fontWeight: "bold",
        borderRadius: 5
    }
});

export default WatchList;
