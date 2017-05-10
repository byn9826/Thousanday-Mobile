import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    //FlatList,
    ListView
} from "react-native";

class Watch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    render() {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let gallery = [], i;
        for (i = 0; i < this.props.gallery.length; i += 2) {
            if (this.props.gallery[i+1]) {
                gallery.push(
                    [
                        "https://thousanday.com/img/pet/" + this.props.gallery[i].pet_id + "/moment/" + this.props.gallery[i].image_name,
                        "https://thousanday.com/img/pet/" + this.props.gallery[i+1].pet_id + "/moment/" + this.props.gallery[i+1].image_name
                    ]
                )
            } else {
                gallery.push(
                    [
                        "https://thousanday.com/img/pet/" + this.props.gallery[i].pet_id + "/moment/" + this.props.gallery[i].image_name,
                        null
                    ]
                )
            }
            
        }
        let dataSource = ds.cloneWithRows(gallery);
        return (
            <View>
                <ListView
                    dataSource={dataSource}
                    enableEmptySections={true}
                    renderRow={(row) =>
                        <View style={styles.row}>
                            <Image
                                source={{uri: row[0]}}
                                style={styles.rowImage}
                            />
                            <Image
                                source={{uri: row[1]}}
                                style={styles.rowImage}
                            />
                        </View>
                    }
                />
            </View>
        )
    }
}

/*
<FlatList
                contentContainerStyle={styles.list}
                data = {gallery}
                renderItem={({item}) => 
                    <Image
                        source={{uri: item.key}}
                        style={styles.rowImage}
                    />
                }
                getItemLayout={(data, index) => (
                    {length: 180, offset: 180 * index, index}
                )}
            />
*/


const styles = StyleSheet.create({
    /*
    list: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    rowImage: {
        width: Dimensions.get("window").width/2.01,
        height: 180,
        marginBottom: 2,
        borderRadius: 5
    }*/
    row: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    rowImage: {
        width: Dimensions.get("window").width/2.01,
        height: 180,
        marginBottom: 2,
        borderRadius: 5
    }
});

export default Watch;
