import React, { Component } from "react";
import { 
    StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button, ScrollView,
    RefreshControl
} from "react-native";
import processError from "../../js/processError.js";
import ImagePicker from 'react-native-image-crop-picker';
import { ImageCache, CachedImage } from "react-native-img-cache";
import { apiUrl } from "../../js/Params.js";

class EditPet extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            saveName: "Save",
            name: "",
            avatar: null,
            button: null,
            role: null,
            end: false,
            add: false,
            input: "",
            relative: null,
            getName: null,
            search: null,
            addResult: false,
            remove: false,
            transfer: false,
            refresh: true
        };
    }
    componentDidMount() {
        fetch( apiUrl + "/edit/read?pet=" + this.props.id + "&user=" + this.props.userId, {
            method: "GET",
        })
        .then( response => {
            if ( response.ok ) {
                return response.json();
            } else {
                processError( response );
            }
        })
        .then( data => {
            this.setState({ 
                name: data.pet_name,
                role: data.owner_id == this.props.userId,
                relative: data.relative_id ? data.relative_id : null,
                petName: data.pet_name,
                refresh: false
            });
        });
    }
    //save name
    saveName() {
        fetch( apiUrl + "/edit/name", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user": this.props.userId,
                "token": this.props.userToken,
                "pet": this.props.id,
                "name": this.state.name
            })
        })
        .then( response => {
            if ( response.ok ) {
                return true;
            } else {
                processError(response);
            }
        })
        .then( result => {
            this.props.cacheData( 'pet', null );
            this.props.cacheData( 'user', null );
            this.setState({ saveName: "Saved!" });
        });
    }
    //pick profile image
    pickImg() {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            mediaType: "photo",
            cropping: true
        }).then( image => {
            this.setState({
                avatar: {
                    uri: image.path, width: image.width, height: image.height, 
                    mime: "0.png"
                },
                button: "Confirm Update?"
            });
        });
    }
    //confirm update profile image
    confirmImg() {
        let image = this.state.avatar;
        let file = { uri: image.uri, type: 'multipart/form-data', name: "0.png" };
        let data = new FormData();
        data.append( "file", file, this.props.id + ".png" );
        data.append( "token", this.props.userToken );
        data.append( "user", this.props.userId );
        data.append( "pet", this.props.id );
        fetch( apiUrl + "/upload/pet", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
            },
            body: data
        })
        .then( response => {
            if ( response.ok ) {
                return true;
            } else {
                processError( response );
            }
        })
        .then( result => {
            ImageCache.get().bust( apiUrl + "/img/pet/" + this.props.id + "/0.png" );
            this.setState({ button: "Update Success!" });
        });
    }
    //click end relationship
    clickEnd() {
        this.setState({ end: true });
    }
    //confirm end relationship
    confirmEnd() {
        fetch( apiUrl + "/edit/end", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user": this.props.userId,
                "token": this.props.userToken,
                "pet": this.props.id
            })
        })
        .then( response => {
            if ( response.ok ) {
                return true;
            } else {
                processError( response );
            }
        })
        .then( result => {
            this.props.cacheData( 'user', null );
            this.props.backHome( this.props.userId );
        });
    }
    //click Add relative
    clickAdd() {
        this.setState({ add: true, addResult: false });
    }
    //confirm send request
    confirmSend() {
        fetch( apiUrl + "/edit/add", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user": this.props.userId,
                "add": this.state.search,
                "pet": this.props.id,
                "token": this.props.userToken,
            })
        })
        .then( response => {
            if ( response.ok ) {
                return true;
            } else {
                processError( response );
            }
        })
        .then( result => {
            this.setState({ addResult: true });
        });
    }
    //click transfer owner ship
    clickTransfer() {
        this.setState({ transfer: true, remove: false });
    }
    //confirmTransfer Ownership
    confirmTransfer() {
        fetch( apiUrl + "/edit/transfer", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user": this.props.userId,
                "token": this.props.userToken,
                "pet": this.props.id,
                "relative": this.state.relative
            })
        })
        .then( response => {
            if ( response.ok ) {
                return true;
            } else {
                processError( response );
            }
        })
        .then( result => {
            this.setState({ relative: this.props.userId, role: false });
        });
    }
    //click remove pet
    clickRemove() {
        this.setState({ remove: true, transfer: false });
    }
    //confirm remove pet
    confirmRemove() {
        fetch( apiUrl + "/edit/remove", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user": this.props.userId,
                "token": this.props.userToken,
                "pet": this.props.id
            })
        })
        .then( response => {
            if ( response.ok ) {
                return true;
            } else {
                processError( response );
            }
        })
        .then( result => {
            this.props.cacheData( 'user', null );
            this.props.cacheData( 'pet', null );
            this.setState({ relative: null, remove: false, input: "" });
        });
    }
    render() {
        let role, action;
        if ( this.state.role ) {
            role = "You are the Owner:";
            if ( this.state.end ) {
                action = null;
            } else {
                if ( this.state.relative ) {
                    if ( !this.state.remove && !this.state.transfer ) {
                        action = (
                            <View style={ styles.ownerAction }>
                                <View style={ styles.actionButton }>
                                    <Button
                                        onPress={ this.clickTransfer.bind( this ) }
                                        title="Transfer Ownership?"
                                        color="red"
                                    />
                                </View>
                                <Button
                                    onPress={ this.clickRemove.bind( this ) }
                                    title="Remove Relative?"
                                    color="red"
                                />
                            </View>
                        )
                    } else if ( this.state.transfer ) {
                        action = (
                            <View style={ styles.ownerConfirm }>
                                <Text style={ styles.confirmHint }>
                                    Type in "Confirm Transfer" to transfer your ownership to {this.state.name}'s relative
                                </Text>
                                <TextInput
                                    style={ styles.confirmInput }
                                    onChangeText={ text =>
                                        this.setState({ input: text })
                                    }
                                    value={ this.state.input }
                                />
                                {
                                    this.state.input.trim() === "Confirm Transfer"? (
                                        <Button
                                            onPress={ this.confirmTransfer.bind( this ) }
                                            title="Confirm"
                                            color="black"
                                        />
                                    ) : null
                                }
                            </View>
                        )
                    } else if ( this.state.remove ) {
                        action = (
                            <View style={ styles.ownerConfirm }>
                                <Text style={ styles.confirmHint }>
                                    Type in "Confirm Remove" to remove { this.state.name }'s relative
                                </Text>
                                <TextInput
                                    style={ styles.confirmInput }
                                    onChangeText={ text =>
                                        this.setState({ input: text })
                                    }
                                    value={ this.state.input }
                                />
                                {
                                    this.state.input.trim() === "Confirm Remove" ? (
                                        <Button
                                            onPress={ this.confirmRemove.bind( this ) }
                                            title="Confirm"
                                            color="black"
                                        />
                                    ) : null
                                }
                            </View>
                        )
                    }
                } else {
                    if ( this.state.add && !this.state.addResult ) {
                        action = (
                            <View style={ styles.ownerAdd }>
                                <Text style={ styles.confirmHint }>
                                    Search user by user id:
                                </Text>
                                <TextInput
                                    style={ styles.confirmInput }
                                    onChangeText={ text => {
                                        id = parseInt( text );
                                        if ( id >= 0 || text === "" ) {
                                            this.setState({ search: text })
                                            if ( text !== "" ) {
                                                fetch( apiUrl + "/edit/search?id=" + id, {
                                                    method: "GET",
                                                })
                                                .then( response => {
                                                    if (response.ok) {
                                                        return response.json();
                                                    } else {
                                                        processError( response );
                                                    }
                                                })
                                                .then( result => {
                                                    if ( result ) {
                                                        this.setState({
                                                            getName: result.user_name
                                                        });
                                                    } else {
                                                        this.setState({ getName: null });
                                                    }
                                                });
                                            }
                                        }
                                    }}
                                    value={ this.state.search }
                                />
                                {
                                    ( this.state.getName && this.state.search ) ? (
                                        <View style={ styles.confirmInfo }>
                                            <Image
                                                source={{
                                                    uri: apiUrl + "/img/user/" + this.state.search + ".jpg"
                                                }}
                                                style={ styles.infoImage }
                                            />
                                            <Text style={ styles.infoName }>
                                                { this.state.getName }
                                            </Text>
                                            <TouchableOpacity 
                                                style={ styles.infoSend } 
                                                onPress={ 
                                                    this.state.search == this.props.userId
                                                        ? null : this.confirmSend.bind( this )
                                                }
                                            >
                                                <Text style={ styles.sendButton }>
                                                    { 
                                                        this.state.search == this.props.userId
                                                            ? "Yourself" : "Send Request"
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : null
                                }
                            </View>
                        )
                    } else if ( this.state.add && this.state.addResult ) {
                        action = (
                            <Text style={ styles.ownerReuslt }>
                                Request Sent!
                            </Text>
                        )
                    } else {
                        action = (
                            <View style={ styles.ownerAction }>
                                <Button
                                    onPress={ this.clickAdd.bind( this ) }
                                    title="Add Relative?"
                                    color="red"
                                />
                            </View>
                        );
                    }
                }
            }
        } else {
            role = "You are the relative:";
            if ( !this.state.end ) {
                action = (
                    <View style={ styles.ownerAction }>
                        <Button
                            onPress={ this.clickEnd.bind( this ) }
                            title="End Relation?"
                            color="red"
                        />
                    </View>
                )
            } else {
                action = (
                    <View style={ styles.ownerConfirm }>
                        <Text style={ styles.confirmHint }>
                            Type in "Confirm End" to end relationship with { this.state.name }
                        </Text>
                        <TextInput
                            style={ styles.confirmInput }
                            onChangeText={ text =>
                                this.setState({ input: text })
                            }
                            value={ this.state.input }
                        />
                        {
                            this.state.input.trim() === "Confirm End" ? (
                                <Button
                                    onPress={ this.confirmEnd.bind( this ) }
                                    title="Confirm"
                                    color="black"
                                />
                            ) : null
                        }
                    </View>
                )
            }

        }
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
                <View style={ styles.rootRow }>
                    <View style={ styles.rowTitle }>
                        <Text style={ styles.titleHint }>
                            Update { this.state.name }'s Name:
                        </Text>
                        <TouchableOpacity onPress={ this.saveName.bind( this ) }>
                            <Text style={ styles.titleSave }>
                                { this.state.saveName }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={ styles.rowInput }
                        onChangeText={ text =>
                            this.setState({ name: text.substr( 0, 10 ) })
                        }
                        value={ this.state.name }
                    />
                    <Text style={ styles.rowHint }>
                        { this.state.name.length } / 10
                    </Text>
                </View>
                <View style={ styles.rootPicture }>
                    {
                        this.state.avatar ? (
                            <Image
                                style={ styles.pictureProfile }
                                source={ this.state.avatar }
                            />
                        ) : (
                            <CachedImage
                                style={ styles.pictureProfile }
                                source={{
                                    uri: apiUrl + "/img/pet/" + this.props.id + "/0.png"
                                }}
                                mutable
                            />
                        )
                    }
                    <View style={ styles.pictureUpload }>
                        <Button
                            onPress={ this.pickImg.bind( this ) }
                            title="Upload Avatar"
                            color="#052456"
                        />
                        {
                            this.state.avatar ? (
                                <View style={ styles.pictureUpload }>
                                    <Button
                                        onPress={ this.confirmImg.bind( this ) }
                                        title={ this.state.button }
                                        color="#ef8513"
                                    />
                                </View>
                            ) : null
                        }
                    </View>
                </View>
                <View style={ styles.rootOwner }>
                    <Text style={ styles.ownerTitle }>
                        { role }
                    </Text>
                    { action }
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginHorizontal: 20,
        marginTop: 20
    },
    rootRow: {
        backgroundColor: "#f7f9fc",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5
    },
    rowInput: {
		fontSize: 18
	},
    rowTitle: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    titleHint: {
        fontSize: 16,
        fontWeight: "bold"
    },
    titleSave: {
        marginRight: 10,
        backgroundColor: "#ef8513",
        paddingVertical: 3,
        paddingHorizontal: 8,
        color: "white",
        borderRadius: 5
    },
    rowHint: {
        marginLeft: 5,
        fontSize: 12
    },
    rootPicture: {
        backgroundColor: "#f7f9fc",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 40
    },
    pictureProfile: {
        width: 200,
        height: 200,
        borderRadius: 5,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    },
    pictureUpload: {
        width: 250,
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 30
    },
    rootOwner: {
        backgroundColor: "#f7f9fc",
        paddingHorizontal: 15,
        paddingTop: 10,
        borderRadius: 5,
        marginTop: 40,
        marginBottom: 50,
        paddingBottom: 20
    },
    ownerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 10
    },
    ownerAction: {
        width: 250,
        alignSelf: "center"
    },
    ownerConfirm: {
        width: 320,
        alignSelf: "center",
        backgroundColor: "red",
        borderRadius: 5,
        paddingBottom: 20
    },
    confirmHint: {
        alignSelf: "center",
        fontSize: 14,
        color: "white",
        marginTop: 10,
        paddingHorizontal: 10,
    },
    confirmInput: {
        marginHorizontal: 20
    },
    ownerAdd: {
        width: 320,
        alignSelf: "center",
        backgroundColor: "#ef8513",
        borderRadius: 5,
        paddingBottom: 20
    },
    confirmInfo: {
        flexDirection: "row",
        marginLeft: 20,
        alignItems: "center"
    },
    infoImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    infoName: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 10
    },
    infoSend: {
        backgroundColor: "#052456",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 20
    },
    sendButton: {
        fontSize: 12,
        color: "white"
    },
    ownerReuslt: {
        fontWeight: "bold",
        fontSize: 14,
        alignSelf: "center",
        color: "red"
    },
    actionButton: {
        marginBottom: 15
    }
});

export default EditPet;
