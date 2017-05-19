import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity
} from "react-native";
class Request extends Component {
    acceptRequest(pet) {
        alert(pet);
    }
    render() {
        console.log(this.props.data);
        let requests = this.props.data.map((request, index) =>
            <View style={styles.rootContainer}>
                <View style={styles.rootRow}>
                    <Image
                        style={styles.rowImage}
                        source={{uri: "https://thousanday.com/img/user/" + request.sender_id + ".jpg"}}
                    />
                    <Text style ={styles.rowWant}>
                        wants to add you as
                    </Text>
                    <Image
                        style={styles.rowPet}
                        source={{uri: "https://thousanday.com/img/pet/" + request.pet_id + "/cover/0.png"}}
                    />
                    <Text style ={styles.rowWant}>
                        {"'s relative"}
                    </Text>
                </View>
                <View style={styles.rootAction}>
                    <TouchableOpacity onPress={this.acceptRequest.bind(this, request.pet_id)}>
                        <Text style={styles.actionAccept}>
                            Accept
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.actionDelete}>
                        Delete
                    </Text>
                </View>
            </View>
        )
        return (
            <ScrollView contentContainerStyle={styles.root}>
                {requests}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginHorizontal: 20,
        marginTop: 20
    },
    rootContainer: {
        backgroundColor: "#f7d7b4",
        marginBottom: 30,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    rootRow: {
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    rowImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    rowWant: {
        marginHorizontal: 5,
        fontSize: 14
    },
    rowPet: {
        width: 50,
        height: 50,
        borderRadius: 5
    },
    rootAction: {
        flexDirection: "row",
        borderTopWidth: 1,
        marginTop: 20
    },
    actionAccept: {
        fontSize: 12,
        backgroundColor: "#052456",
        color: "white",
        marginTop: 10,
        borderRadius: 3,
        paddingHorizontal: 6,
        paddingVertical: 3,
        marginRight: 50
    },
    actionDelete: {
        fontSize: 12,
        backgroundColor: "#9b0f0f",
        color: "white",
        marginTop: 10,
        borderRadius: 3,
        paddingHorizontal: 6,
        paddingVertical: 3
    }
});

export default Request;
