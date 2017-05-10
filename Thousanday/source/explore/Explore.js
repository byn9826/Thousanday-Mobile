import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    ListView,
    Image,
    View
} from "react-native";

class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //store choose of type
            type: null,
            //store choose of nature
            nature: null,
            //store load for how many times
            load: 0,
            //store all moment data
            moment: [],
            //indicate more to load or not
            more: true,
            //indicate connect error
            error: null
        };
    }
    chooseType(type) {
        if (this.state.type === type) {
            this.setState({type: null});
        } else {
            this.setState({type: type});
            //require info
            if (this.state.nature) {
                let data = {
                    "type": type,
                    "nature": this.state.nature,
                    "load": 0
                };
                fetch("https://thousanday.com/explore/getMoment", {
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
                    console.log(result);
                    switch(result) {
                        case 0:
                            this.setState({error: "Can't connect to database"});
                            break;
                        default:
                            let more = (result.length < 20)?false:true;
                            this.setState({moment: result, load: 1, more: more, error: null});
                    }
                });
			}
        }
    }
    chooseNature(nature) {
        if (this.state.nature === nature) {
            this.setState({nature: null});
        } else {
            this.setState({nature: nature});
            if (this.state.type) {
                let data = {
                    "type": this.state.type,
                    "nature": nature,
                    "load": 0
                };
                fetch("https://thousanday.com/explore/getMoment", {
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
                    console.log(result);
                    switch(result) {
                        case 0:
                            this.setState({error: "Can't connect to database"});
                            break;
                        default:
                            let more = (result.length < 20)?false:true;
                            this.setState({moment: result, load: 1, more: more, error: null});
                    }
                });
			}
        }
    }
    render() {
        //data to show image gallery
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let gallery = ds.cloneWithRows(this.state.moment);
        return (
            <View style={styles.watch}>
                <View style={styles.watchHeader}>
                    <View style={styles.headerFilter}>
                        <Image style={styles.filterIcon} source={require("../../image/filter.png")} />
                        <Text style={styles.filterContent}>
                            Filter
                        </Text>
                    </View>
                    <View style={styles.headerOption}>
                        <View style={styles.optionType}>
                            <Text onPress={this.chooseType.bind(this, "0")} style={(this.state.type === "0")?styles.typeChoose:styles.typeSingle}>
                                Dog
                            </Text>
                            <Text onPress={this.chooseType.bind(this, "1")} style={(this.state.type === "1")?styles.typeChoose:styles.typeSingle}>
                                Cat
                            </Text>
                            <Text onPress={this.chooseType.bind(this, "2")} style={(this.state.type === "2")?styles.typeChoose:styles.typeSingle}>
                                Bird
                            </Text>
                            <Text onPress={this.chooseType.bind(this, "3")} style={(this.state.type === "3")?styles.typeChoose:styles.typeSingle}>
                                Fish
                            </Text>
                            <Text onPress={this.chooseType.bind(this, "4")} style={(this.state.type === "4")?styles.typeChoose:styles.typeSingle}>
                                Other
                            </Text>
                        </View>
                        <View style={styles.optionType}>
                            <Text onPress={this.chooseNature.bind(this, "0")} style={(this.state.nature === "0")?styles.typeChoose:styles.typeSingle}>
                                Cute
                            </Text>
                            <Text onPress={this.chooseNature.bind(this, "1")} style={(this.state.nature === "1")?styles.typeChoose:styles.typeSingle}>
                                Strong
                            </Text>
                            <Text onPress={this.chooseNature.bind(this, "2")} style={(this.state.nature === "2")?styles.typeChoose:styles.typeSingle}>
                                Smart
                            </Text>
                            <Text onPress={this.chooseNature.bind(this, "3")} style={(this.state.nature === "3")?styles.typeChoose:styles.typeSingle}>
                                Beauty
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.watchDisplay}>
                    <ListView
                        dataSource={gallery}
                        enableEmptySections={true}
                        renderRow={(row) =>
                            <View style={styles.displayRow}>
                                <Image
                                    source={{uri: "https://thousanday.com/img/pet/" + row.pet_id + "/moment/" + row.image_name}}
                                    style={styles.rowImage}
                                />
                                <View style={styles.rowView}>
                                    <Text
                                        style={styles.viewMessage}
                                        numberOfLines={4}
                                    >
                                        {row.moment_message}
                                    </Text>
                                    <Image
                                        source={{uri: "https://thousanday.com/img/pet/" + row.pet_id + "/cover/0.png" }}
                                        style={styles.viewImage}
                                    />
                                    <Text
                                        style={styles.viewDate}
                                        numberOfLines={2}
                                    >
                                        {new Date(row.moment_date).toISOString().substring(0, 10)}
                                    </Text>
                                </View>
                            </View>
                        }
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    watch: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    watchHeader: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderStyle: "solid",
        borderColor: "#f7d7b4",
        borderBottomWidth: 1,
        marginBottom: 10
    },
    headerFilter: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center"
    },
    filterIcon: {
        resizeMode: "contain"
    },
    filterContent: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10
    },
    headerOption: {
        flex: 6,
        flexDirection: "column",
    },
    optionType: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    typeSingle: {
        fontSize: 16,
        paddingHorizontal: 10,
        marginHorizontal: 6,
        marginVertical: 8,
        paddingVertical: 2,
        borderStyle: "solid",
        borderColor: "#f7d7b4",
        borderWidth: 1,
        borderRadius: 3
    },
    typeChoose: {
        fontSize: 16,
        paddingHorizontal: 10,
        marginHorizontal: 6,
        marginVertical: 8,
        backgroundColor: "#052456",
        paddingVertical: 2,
        borderStyle: "solid",
        borderColor: "#052456",
        borderWidth: 1,
        borderRadius: 3,
        color: "white"
    },
    watchDisplay: {
        flex: 5,
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    displayRow: {
        flex: 1,
        backgroundColor: "#f7f9fc",
        marginVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    rowImage: {
        width: 250,
        height: 250
    },
    rowView: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    viewMessage: {
        marginVertical: 10,
        fontSize: 16
    },
    viewImage: {
        width: 40,
        height: 40,
        borderRadius: 3
    },
    viewDate: {
        marginVertical: 5,
        fontSize: 12
    }
});

export default Explore;