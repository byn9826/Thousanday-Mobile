import React, { Component } from "react";
import {
    StyleSheet, Text, View, Image, FlatList, Dimensions, TouchableOpacity
} from "react-native";
import { CachedImage } from "react-native-img-cache";
import { apiUrl, getGender, getType, getNature } from "../../js/Params.js";
import processGallery from "../../js/processGallery.js";
import processError from "../../js/processError.js";

class Pet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //allow load more images or not
            locker: false,
            //store images
            images: [],
            //record load images for how many times
            pin: 1,
            //show load animation or not
            refresh: true,
            //store watchers' id list
            watch: [],
            //store pet info
            pet: {},
            //store friends info
            friends: []
        };
    }
    componentWillMount() {
        fetch( apiUrl + "/pet/read?id=" + this.props.id, { method: "GET" } )
        .then( response => {
            if ( response.ok ) {
                return response.json();
            } else {
                processError( response );
            }
        })
        .then( pet => {
            let watch = [];
            pet[ 4 ].forEach( p => {
                watch.push( parseInt( p.user_id ) );
            });
            this.setState({
                locker: pet[ 3 ].length < 20 ? true : false,
                images: processGallery( pet[ 3 ] ),
                watch: watch,
                pet: pet[ 0 ],
                friends: pet[ 2 ],
                refresh: false
            });
        });
    }
    //load more moment for current pet
    loadMore() {
        if ( !this.state.locker ) {
            fetch( apiUrl + "/pet/load?add=0&load=" + this.state.pin + "&pet=" + this.state.pet.pet_id, {
                method: "GET"
            })
            .then( response => {
                if ( response.ok ) {
                    return response.json();
                } else {
                    processError( response );
                }
            })
            .then( result => {
                if ( result.length !== 0 ) {
                    let more = processGallery( result );
                    if ( result.length === 20 ) {
                        this.setState({
                            images: this.state.images.concat( more ),
                            pin: this.state.pin + 1,
                        });
                    } else {
                        this.setState({
                            images: this.state.images.concat( more ),
                            pin: this.state.pin + 1,
                            locker: true
                        });
                    }
                } else {
                    this.setState({ locker: true });
                }
            });
        }
    }
    //watch a pet
    petWatch() {
        if ( !this.props.userId ) {
            alert( "Please login first" );
            return false;
        } 
        let action;
        this.state.watch.indexOf( this.props.userId ) !== -1 ? action = 0 : action = 1;
        //watch or unwatch pet
        fetch( apiUrl + "/pet/watch", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "action": action,
                "user": this.props.userId,
                "pet": this.props.id,
                "token": this.props.userToken
            })
        })
        .then( response => {
            if ( response.ok ) {
                return response.json();
            } else {
                processError( response );
            }
        })
        .then( result => {
            if ( action === 1 ) {
                this.state.watch.push( this.props.userId );
                this.setState({ watch: this.state.watch });
            } else {
                this.state.watch.splice( 
                    this.state.watch.indexOf( this.props.userId ), 1
                );
                this.setState({ watch: this.state.watch });
            }
        });
    }
    render() {
        //show second relative if exist
        let relative;
        if ( this.state.pet.relative_id ) {
            relative = (
                <TouchableOpacity 
                    onPress={ 
                        this.props.clickUser.bind( 
                            null, parseInt( this.state.pet.relative_id ) 
                        )
                    }>
                    <CachedImage
                        mutable style={ styles.boxRound }
                        source={{
                            uri: apiUrl + "/img/user/" + this.state.pet.relative_id + ".jpg"
                        }}
                    />
                </TouchableOpacity>
            )
        }
        //show friends if exist
        let friends = this.state.friends.map( ( f, i ) =>
            <TouchableOpacity 
                key={ "friend" + i }
                onPress={ this.props.clickPet.bind( null, f.pet_id ) }>
                <CachedImage
                    mutable style={ styles.boxImage }
                    source={{ uri: apiUrl + "/img/pet/" + f.pet_id + "/0.png" }}
                />
            </TouchableOpacity>
        );
        return (
            <FlatList
                contentContainerStyle={ styles.container }
                ListHeaderComponent={ () => {
                    return (
                        <View style={ styles.containerHeader }>
                            <CachedImage
                                source={{
                                    uri: apiUrl + "/img/pet/" + this.state.pet.pet_id + "/0.png"
                                }}
                                mutable style={ styles.headerAvatar }
                            />
                            <Text style={ styles.headerName }>
                                { this.state.pet.pet_name}
                            </Text>
                            <View style={ styles.headerRow }>
                                <Text style={ styles.rowGender }>
                                    { getGender( this.state.pet.pet_gender ) }
                                </Text>
                                <Text style={ styles.rowType }>
                                    { getType( this.state.pet.pet_type ) }
                                </Text>
                                <Text style={ styles.rowType }>
                                    { getNature( this.state.pet.pet_nature ) }
                                </Text>
                            </View>
                            <View style={ styles.headerTeam }>
                                <View style={ styles.teamParent }>
                                    <Text style={ styles.parentTitle }>
                                        { 
                                            this.state.pet.pet_gender === 0 
                                                ? "His ": "Her "
                                        }
                                        Family
                                    </Text>
                                    <View style={ styles.parentBox }>
                                        <TouchableOpacity 
                                            onPress={
                                                this.props.clickUser.bind(
                                                    null, 
                                                    parseInt( this.state.pet.owner_id)
                                                )
                                            }>
                                            <CachedImage
                                                style={ styles.boxRound }
                                                source={{
                                                    uri: apiUrl + "/img/user/" + this.state.pet.owner_id + ".jpg"
                                                }}
                                                mutable
                                            />
                                        </TouchableOpacity>
                                        { relative }
                                    </View>
                                </View>
                                <View style={ styles.teamFriend }>
                                    <Text style={ styles.parentTitle }>
                                        Best Friends
                                    </Text>
                                    <View style={ styles.parentBox }>
                                        { friends }
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity onPress={ this.petWatch.bind( this ) }>
                                <Text style={ styles.headerWatch }>
                                    { 
                                        this.state.watch.indexOf( this.props.userId ) === -1
                                            ? "+ Watch" : "Watched"
                                    } | by { this.state.watch.length }
                                </Text>
                            </TouchableOpacity>
                            <View style={ styles.headerHolder }>
                                <Image 
                                    style={ styles.holderIcon } 
                                    source={ require( "../../image/moment.png" ) } 
                                />
                                <Text style={ styles.holderTitle }>
                                    { this.state.pet.pet_name + "'s"} Moments
                                </Text>
                            </View>
                        </View>
                    )
                }}
                data = { this.state.images }
                numColumns={ 2 }
                columnWrapperStyle={{
                    justifyContent: "space-between",
                }}
                onRefresh={ () => {} }
                refreshing={ this.state.refresh }
                onEndReached={ this.loadMore.bind( this ) }
                renderItem={ ( {item} ) =>
                    <TouchableOpacity 
                        onPress={ this.props.clickMoment.bind( null, item.id ) } 
                    >
                        <CachedImage
                            source={{ uri: item.key }} style={ styles.containerImage }
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
