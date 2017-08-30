import React, { Component } from "react";
import {
    StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Button,
    RefreshControl
} from "react-native";
import { CachedImage } from "react-native-img-cache";
import ImagePicker from 'react-native-image-crop-picker';
import processError from "../../js/processError.js";
import { apiUrl } from "../../js/Params.js";

class PostMoment extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            info: "",
            image: null,
            error: null,
            pet: null,
            refresh: true,
            petList: []
        };
    }
    componentWillMount() {
        fetch( apiUrl + "/user/read?id=" + this.props.userId, {
            method: "GET",
        })
        .then( response => {
            if ( response.ok ) {
                return response.json();
            } else {
                processError( response );
            }
        })
        .then( user => {
            this.setState({ refresh: false });
            this.setState({ 
                petList: user[ 1 ]
            });
        });
    }
    //pick photo
    pickImg() {
        ImagePicker.openPicker({
            mediaType: "photo",
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000
        }).then( image => {
            this.setState({
                image: {
                    uri: image.path, width: image.width, 
                    height: image.height, mime: image.mime
                }
            });
        });
    }
    //take photo
    useCamera() {
        ImagePicker.openCamera({
            mediaType: "photo",
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000
        }).then( image => {
            this.setState({
                image: {
                    uri: image.path, width: image.width, height: image.height, 
                    mime: image.mime
                }
            });
        });
    }
    //send moment
    sendMoment() {
        let content = this.state.info.trim();
        let image = this.state.image;
        let pet = this.state.pet;
        if ( !pet ) {
            this.setState({ error: "Please choose a pet!" });
        } else if ( content.length <= 0 || content.length > 120 ) {
            this.setState({ error: "Please write something!" });
        } else if ( !image ) {
            this.setState({ error: "Please choose an image!" });
        } else {
            this.setState({ refresh: true });
            this.setState({ error: null });
            let type = image.mime;
            type = type.split( "/" )[ 1 ];
            type = "." + type;
            let file = { uri: image.uri, type: 'multipart/form-data', name: type };
            let data = new FormData();
            data.append( "file", file, type );
            data.append( "message", content );
            data.append( "token", this.props.userToken );
            data.append( "user", this.props.userId );
            data.append( "pet", pet );
            fetch( apiUrl + "/upload/moment", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "multipart/form-data",
                },
                body: data
            })
            .then( response => {
                this.setState({ refresh: false });
                if ( response.ok ) {
                    return response.json();
                } else {
                    processError( response );
                }
            })
            .then( result => {
                this.props.goMoment( parseInt( result[ 0 ] ) );
            })
        }
    }
    //choose a pet
    choosePet( id ) {
        if ( id === this.state.pet ) {
            this.setState({ pet: null });
        } else {
            this.setState({ pet: id });
        }
    }
    render() {
        let image;
        if ( this.state.image ){
            image = <Image source={ this.state.image } style={ styles.rootImage } />
        }
        let pets = this.state.petList.map( ( pet, index ) =>
            <TouchableOpacity 
                key={ "choosepet" + index } 
                style={ 
                    this.state.pet === pet.pet_id
                        ? styles.petChoose : null
                } 
                onPress={ this.choosePet.bind( this, pet.pet_id ) }>
                <CachedImage
                    source={{ uri: apiUrl + "/img/pet/" + pet.pet_id + "/0.png" }}
                    style={ styles.petOption }
                    mutable
                />
            </TouchableOpacity>
        )
        return (
            <ScrollView 
                style={ styles.root }
                refreshControl={ 
                    <RefreshControl
                        refreshing={ this.state.refresh }
                        onRefresh={ () => {} }
                    />
                }
            >
                <View style={ styles.rootHeader }>
                    <Text style={ styles.headerError }>
                        { this.state.error }
                    </Text>
                    <Button
                        style={ styles.headerSend }
                        title="Send"
                        onPress={ this.sendMoment.bind( this ) }
                    />
                </View>
                <Text style={ styles.rootTitle }>
                    Please choose one of your pet:
                </Text>
                <View style={ styles.rootPet }>
                    { pets }
                </View>
                <Text style={ styles.rootTitle }>
                    Write something for this moment:
                </Text>
                <TextInput
                    style={ styles.rootInput }
                    multiline={ true }
                    numberOfLines={ 4 }
                    onChangeText={ text =>
                        this.setState({ info: text.substr( 0, 120 ) })
                    }
                    value={ this.state.info }
                />
                <Text style={ styles.rootHint }>
                    { this.state.info.length } / 120
                </Text>
                <View style={ styles.rootRow }>
                    <TouchableOpacity onPress={ this.pickImg.bind( this ) }>
                        <View style={ styles.rowButton }>
                            <Image 
                                style={ styles.buttonIcon } 
                                source={ require( "../../image/watch.png" ) } 
                            />
                            <Text style={ styles.buttonTitle }>
                                Upload Image
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ this.useCamera.bind( this ) }>
                        <View style={ styles.rowButton }>
                            <Image 
                                style={ styles.buttonIcon } 
                                source={ require( "../../image/camera.png" ) } />
                            <Text style={ styles.buttonTitle }>
                                Take Photo
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                { image }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    rootPet: {
        flexDirection: "row",
        marginBottom: 15,
        flexWrap: "wrap",
        alignItems: "center"
    },
    petChoose: {
        borderBottomColor: "orange",
        borderBottomWidth: 3,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10
    },
    petOption: {
        width: 60,
        height: 60,
        borderRadius: 5,
        margin: 10
    },
    rootHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        alignItems: "center"
    },
    headerButton: {
        borderRadius: 5
    },
    headerError: {
        color: "red",
        fontSize: 14,
    },
    rootTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10
    },
    rootInput: {
		backgroundColor:"#f7f9fc",
	},
    rootHint: {
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 20
    },
    rootRow: {
        flexDirection: "row",
        justifyContent: "center"
    },
    rowButton:{
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7d7b4",
        paddingVertical: 15,
        width: 160,
        borderRadius: 8
    },
    buttonIcon: {
        width: 26,
        height: 26,
        resizeMode: "contain"
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: "bold"
    },
    rootImage: {
        width: 400,
        height: 400,
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 30,
        borderRadius: 5,
        marginBottom: 10
    }
});

export default PostMoment;
