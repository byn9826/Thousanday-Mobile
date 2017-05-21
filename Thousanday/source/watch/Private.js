import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
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
            unwatch: [],
            //store load how many times
            load: 1,
            //lock load more
            locker: (this.props.data.length === 20)?false:true
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
    //load more watch
    loadMore() {
        if (!this.state.locker) {
            fetch("https://thousanday.com/panels/watchList", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": this.props.userId,
                    "pin": this.state.load
                })
            })
            .then((response) => response.json())
            .then((list) => {
                let newList = this.state.lists.concat(list);
                this.setState({lists: newList, load: this.state.load + 1});
            });
        }
    }
    render() {
        let lists = [], i;
        for (i = 0; i < this.state.lists.length; i++) {
            lists.push(
                {
                    key: i,
                    id: this.state.lists[i].pet_id,
                    name: this.state.lists[i].pet_name
                }
            )
        }
        return (
            <FlatList
                contentContainerStyle={styles.root}
                data = {lists}
                ListHeaderComponent={()=>
                    <View style={styles.rootHeader}>
                        <Image
                            source={require("../../image/follow.png")}
                            style={styles.headerIcon}
                        />
                        <Text style={styles.headerList}>
                            Pets on your watch list
                        </Text>
                    </View>
                }
                renderItem={({item}) =>
                    (this.state.unwatch.indexOf(item.id) === -1)? (
                        <View key={"privatewatch" + item.key} style={styles.rootRow}>
                            <TouchableOpacity onPress={this.props.clickPet.bind(null, item.id)}>
                                <CachedImage
                                    source={{uri: "https://thousanday.com/img/pet/" + item.id + "/cover/0.png"}}
                                    style={styles.rowAvatar}
                                    mutable
                                />
                            </TouchableOpacity>
                            <Text style={styles.rowName}>
                                {item.name}
                            </Text>
                            <TouchableOpacity onPress={this.watchPet.bind(this, item.id, 1)}>
                                <Text style={styles.rowWatch}>
                                    unwatch
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ):(
                        <View key={"privatewatch" + item.key} style={styles.rootRow}>
                            <TouchableOpacity onPress={this.props.clickPet.bind(null, item.id)}>
                                <CachedImage
                                    source={{uri: "https://thousanday.com/img/pet/" + item.id + "/cover/0.png"}}
                                    style={styles.rowAvatar}
                                    mutable
                                />
                            </TouchableOpacity>
                            <Text style={styles.rowName}>
                                {item.name}
                            </Text>
                            <TouchableOpacity onPress={this.watchPet.bind(this, item.id, 0)}>
                                <Text style={styles.rowBack}>
                                    watch
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                onEndReached={this.loadMore.bind(this)}
            />
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
