import React, { Component } from "react";
import { 
    StyleSheet, Platform, Text, View, Dimensions, TouchableOpacity, ScrollView,
    TextInput, Button, Share, RefreshControl
} from "react-native";
import { CachedImage } from "react-native-img-cache";
import { apiUrl } from "../../js/Params.js";
import processGallery from "../../js/processGallery.js";
import processError from "../../js/processError.js";

class Moment extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            //store data for images
            data: {},
            //users' id list for who like this moment
            like: [],
            //store comment list
            list: [],
            //load more comment
            load: 1,
            //store content in comment field
            comment: "",
            //record current user has sent how many comment
            send: 0,
            //show refresh animation or not
            refresh: true
        };
    }
    componentWillMount() {
        if (this.props.cache.moment !== null && this.props.cache.moment.id === this.props.id) {
            this.setState(this.props.cache.moment.data);
        } else {
            fetch( apiUrl + "/moment/read?id=" + this.props.id, {
                method: "GET",
            })
            .then( response => {
                if ( response.ok ) {
                    return response.json();
                } else {
                    processError( response );
                }
            })
            .then( moment => {
                let like = [];
                moment[ 2 ].forEach( d => {
                    like.push( parseInt( d.user_id ) );
                });
                let data;
                if ( moment[ 3 ].length === 5 ) {
                    data = { 
                        data: moment[ 0 ], like: like, list: moment[ 3 ], refresh: false 
                    }
                    this.setState(data);
                } else {
                    data = { 
                        data: moment[ 0 ], like: like, list: moment[ 3 ], 
                        load: false, refresh: false 
                    }
                    this.setState(data);
                }
                this.props.cacheData( 'moment', this.props.id, data );
            });
        }
    }
    clickLike() {
        if ( !this.props.userId ) {
            alert( "Please login first!" );
            return false;
        }
        let action;
        this.state.like.indexOf( this.props.userId ) === -1 ? action = 1 : action = 0;
        fetch( apiUrl + "/moment/like", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "action": action,
                "user": this.props.userId,
                "moment": this.state.data.moment_id,
                "token": this.props.userToken
            })
        })
        .then( response => {
            if (response.ok) {
                return true;
            } else {
                processError(response);
            }
        })
        .then( () => {
            if ( this.state.like.indexOf( this.props.userId ) === -1 ) {
                this.state.like.push( this.props.userId );
                this.setState({ like: this.state.like });
            } else {
                this.state.like.splice( 
                    this.state.like.indexOf( this.props.userId ), 1 
                );
                this.setState({ like: this.state.like });
            }
        });
        this.props.cacheData( 'moment', null );
    }
    //send new comment
    sendMessage() {
        if ( !this.props.userId ) {
            alert( "Please login first!" );
            return false;
        }
        fetch( apiUrl + "/moment/comment", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user": this.props.userId,
                "moment": this.state.data.moment_id,
                "token": this.props.userToken,
                "content": this.state.comment
            })
        })
        .then( response  => {
            if ( response.ok ) {
                return true;
            } else {
                processError( response );
            }
        })
        .then( () => {
            let post = {
                "comment_content": this.state.comment,
                "user_id": this.props.userId
            };
            this.state.list.unshift( post );
            this.setState({ 
                list: this.state.list, comment: "", send: this.state.send + 1
            });
        });
        this.props.cacheData( 'moment', null );
    }
    //load more comment
    loadMore() {
        fetch( apiUrl + "/moment/load?id=" + this.props.id + "&load=" + ( this.state.load - 1 ) + "&add=" + this.state.send , {
            method: "GET",
        })
        .then( response => {
            if ( response.ok ) {
                return response.json();
            } else {
                processError( response );
            }
        })
        .then( result => {
            let add = this.state.list.concat( result );
            if ( result.length === 10 ) {
                this.setState({ list: add, load: this.state.load + 1 });
            } else {
                this.setState({ list: add, load: false });
            }
        });
    }
    //share moment
    shareMoment() {
        Share.share({
            message: this.state.data.moment_message + " - See more at https://thousanday.com/moment/" + this.state.data.moment_id,
            url: apiUrl + "/moment/" + this.state.data.moment_id,
            title: "Thousanday - Your pets and you"
        }, {
            dialogTitle: "Share moment to the world",
            tintColor: "green"
        });
    }
    render() {
        let comments = this.state.list.map( ( comment, index ) =>
            <View key={ "comments"+ index } style={ styles.commentLine }>
                <CachedImage
                    source={ { uri: apiUrl + "/img/user/" + comment.user_id + ".jpg" } }
                    style={ styles.lineAvatar }
                />
                <Text style={ styles.lineContent }>
                    { comment.comment_content }
                </Text>
            </View>
        )
        return (
            <ScrollView 
                contentContainerStyle={ styles.root } keyboardShouldPersistTaps="always"
                refreshControl={ 
                    <RefreshControl
                        refreshing={ this.state.refresh }
                        onRefresh={ () => {} }
                    />
                }
            >
                <View style={ styles.rootTop }>
                    <TouchableOpacity 
                        onPress={ 
                            this.props.clickPet.bind( null, this.state.data.pet_id )
                        }
                    >
                        <CachedImage
                            source={{
                                uri: apiUrl + "/img/pet/" + this.state.data.pet_id + "/0.png"
                            }}
                            style={ styles.topAvatar }
                        />
                    </TouchableOpacity>
                    <View style={ styles.topMessage }>
                        <Text style={ styles.messageMoment }>
                            { this.state.data.moment_message }
                        </Text>
                        <Text style={ styles.messageDate} >
                            {
                                this.state.data.moment_date ? (
                                    new Date( this.state.data.moment_date ).toISOString().substring( 0, 10 )
                                ) : null
                            }
                        </Text>
                    </View>
                </View>
                <CachedImage
                    source={{
                        uri: apiUrl + "/img/pet/" + this.state.data.pet_id + "/moment/" + this.state.data.image_name
                    }}
                    style={ styles.rootImg }
                />
                <View style={ styles.rootSocial }>
                    {
                        this.state.like.indexOf( this.props.userId ) === -1 ? (
                            <TouchableOpacity onPress={ this.clickLike.bind( this ) }>
                                <Text style={ styles.socialLove }>
                                    &#128151; { this.state.like.length }
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={ this.clickLike.bind( this ) }>
                                <Text style={ styles.socialLove }>
                                    &#128152; { this.state.like.length }
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                    <TouchableOpacity onPress={ this.shareMoment.bind( this ) }>
                        <Text style={ styles.socialShare }>Share</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.list.length > 0 ? (
                        <Text style={ styles.rootTitle }>Comments</Text>
                    ) : null
                }
                <View style={ styles.rootComment }>
                    { comments }
                    {
                        this.state.load ? (
                            <TouchableOpacity onPress={ this.loadMore.bind( this ) }>
                                <Text style={ styles.commentMore }>
                                    Load More Comments ...
                                </Text>
                            </TouchableOpacity>
                        ) : null
                    }
                </View>
                {
                    this.props.userId ? (
                        <View style={ styles.rootContain }>
                            <Text style={ styles.rootLeave }>Leave a comment:</Text>
                            <TextInput
                                style={ styles.rootInput }
                                multiline={ true } numberOfLines={5}
                                onChangeText={ text =>
                                    this.setState({ comment: text.substr( 0, 150 ) })
                                }
                                value={ this.state.comment }
                            />
                            <Text style={ styles.rootHint }>
                                { this.state.comment.length } / 150
                            </Text>
                            {
                                this.state.comment.length > 0 ? (
                                    <View style={ styles.rootButton }>
                                        <Button
                                            onPress={ this.sendMessage.bind( this ) }
                                            title="Send"
                                            color="#052456"
                                        />
                                    </View>
                                ) : null
                            }
                        </View>
                    ) : (
                        <Text style={ styles.rootLogin }>
                            Login to leave a comment.
                        </Text>
                    )
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginTop: 10,
        alignItems: "center",
        marginHorizontal: 10,
    },
    rootTop: {
        marginVertical: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    topAvatar: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 15
    },
    topMessage: {
        flex: 5,
    },
    messageMoment: {
        fontSize: 16,
        backgroundColor: "black",
        color: "white",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    messageDate: {
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5
    },
    rootImg: {
        width: Dimensions.get("window").width - 40,
        height: 300,
        resizeMode: "contain",
        borderRadius: 5
    },
    rootSocial: {
        flexDirection: "row",
        alignSelf: "flex-start",
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: "center"
    },
    socialLove: {
        fontSize: 20,
    },
    socialShare: {
        fontSize: 14,
        backgroundColor: "#ef8513",
        color: "white",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
        marginLeft: 15
    },
    rootTitle: {
        marginTop: 20,
        alignSelf: "flex-start",
        marginLeft: 20,
        fontWeight: "bold",
        fontSize: 18
    },
    rootComment: {
        borderTopWidth: 1,
        borderTopColor: "black",
        paddingTop: 15,
        marginTop: 5,
        marginBottom: 20,
        marginHorizontal: 20,
        alignSelf: "stretch",
    },
    commentLine: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7d7b4",
        borderRadius: 5,
        marginBottom: 10
    },
    lineAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginVertical: 5,
        marginHorizontal: 5
    },
    lineContent: {
        flex: 1,
        marginHorizontal: 10,
    },
    commentMore: {
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: "#052456",
        alignSelf: "center",
        color: "white",
        textAlign: "center"
    },
    rootContain: {
        alignSelf: "stretch"
    },
    rootLogin: {
        marginBottom: 40
    },
    rootLeave: {
        alignSelf: "flex-start",
        marginBottom: 10,
        marginLeft: 20,
        fontWeight: "bold",
        fontSize: 18
    },
    rootInput: {
        backgroundColor: "#f7f9fc",
        alignSelf: "stretch",
        marginBottom: 5,
        marginHorizontal: 20
    },
    rootHint: {
        marginBottom: 20,
        alignSelf: "flex-start",
        marginLeft: 25
    },
    rootButton: {
        marginBottom: 50,
        marginHorizontal: 20
    }
});

export default Moment;
