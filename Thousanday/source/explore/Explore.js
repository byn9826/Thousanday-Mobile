import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    Dimensions,
    Image,
    View,
    FlatList,
    ScrollView
} from "react-native";
import {CachedImage} from "react-native-img-cache";

class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //store init images
            initImages: [],
            //indicate choose of type
            type: null,
            //indicate choose of nature
            nature: null,
            //indicate lock the load more function or not
            moreLocker: false,
            //indicate have load how many times
            loadTimes: 1
        };
    }
    //user click on one type
    chooseType(type) {
        if (this.state.type === type) {
            //empty state
            this.setState({type: null, initImages: [], loadTimes: 1, moreLocker: false});
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
                    switch(result) {
                        case 0:
                            alert("Can't get data, try later");
                            break;
                        default:
                            //build data with all images
                            let gallery = [], i;
                            for (i = 0; i < result.length; i++) {
                                gallery.push(
                                    {
                                        key: "https://thousanday.com/img/pet/" + result[i].pet_id + "/moment/" + result[i].image_name
                                    }
                                )
                            }
                            let moreLocker = (result.length < 20)? true: false;
                            this.setState({initImages: gallery, moreLocker: moreLocker});
                    }
                });
			}
        }
    }
    //user click on one nature
    chooseNature(nature) {
        if (this.state.nature === nature) {
            //empty state if already choosed it
            this.setState({nature: null, initImages: [], loadTimes: 1, moreLocker: false});
        } else {
            this.setState({nature: nature});
            //if chosed nature and type do search
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
                    switch(result) {
                        case 0:
                            alert("Can't get data, try later");
                            break;
                        default:
                            //build data with all images
                            let gallery = [], i;
                            for (i = 0; i < result.length; i++) {
                                gallery.push(
                                    {
                                        key: "https://thousanday.com/img/pet/" + result[i].pet_id + "/moment/" + result[i].image_name
                                    }
                                )
                            }
                            let moreLocker = (result.length < 20)? true: false;
                            this.setState({initImages: gallery, moreLocker: moreLocker});
                    }
                });
			}
        }
    }
    loadMore() {
        let data = {
            "type": this.state.type,
            "nature": this.state.nature,
            "load": this.state.loadTimes
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
            switch (result) {
                case 0:
                    alert("Can't get data, try later");
                    break;
                default:
                    //update when there's new data
                    if (result.length !== 0) {
                        //consist watch data with all image src
                        let newImages = [], i;
                        for (i = 0; i < result.length; i++) {
                            newImages.push(
                                {
                                    key: "https://thousanday.com/img/pet/" + result[i].pet_id + "/moment/" + result[i].image_name
                                }
                            )
                        }
                        //lock load more watch public image function
                        if (result.length < 20) {
                            this.setState({
                                initImages: this.state.initImages.concat(newImages),
                                loadTimes: this.state.loadTimes + 1,
                                moreLocker: true
                            });
                        } else {
                            this.setState({
                                initImages: this.state.initImages.concat(newImages),
                                loadTimes: this.state.loadTimes + 1
                            });
                        }
                    } else {
                        //active lock when no more images
                        this.setState({moreLocker: true});
                    }
            }
        });
    }
    render() {
        return (
            <ScrollView contentContainerStyle={styles.watch}>
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
                <FlatList
                    contentContainerStyle={styles.watchContainer}
                    data = {this.state.initImages}
                    renderItem={({item}) =>
                        <CachedImage
                            source={{uri: item.key}}
                            style={styles.containerImage}
                        />
                    }
                    onEndReached={()=>{
                        //Scroll to end, Call load more images function
                        if (!this.state.moreLocker) {
                            this.loadMore();
                        }
                    }}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    watch: {
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    watchHeader: {
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
    watchContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 2
    },
    containerImage: {
        width: Dimensions.get("window").width/2.01,
        height: 180,
        resizeMode: "cover",
        marginBottom: 2,
        borderRadius: 5
    }
});

export default Explore;
