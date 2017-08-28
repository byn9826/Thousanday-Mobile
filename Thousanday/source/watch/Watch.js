import React, { Component } from "react";
import { StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { CachedImage } from "react-native-img-cache";
import { apiUrl } from "../../js/Params.js";
import processGallery from "../../js/processGallery.js";
import processError from "../../js/processError.js";

class Watch extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            //store data for images
            data: null,
            //show refresh animation or not
            refresh: true,
            //allow load more moment or not
            locker: false,
            //record load times,
            pin: 1,
        }
    }
    componentWillMount() {
        //load 20 newest public moments
        fetch( apiUrl + "/index/read?load=0", {
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
            let moments = processGallery( result );
            this.setState({ refresh: false, data: moments });
        });
    }
    loadMoment() {
        //check if locker is active
        if ( !this.state.locker ) {
            fetch( apiUrl + "/index/read?load=" + this.state.pin, {
                method: "GET",
            })
            .then( response => {
                if ( response.ok ) {
                    return response.json()
                } else {
                    processError( response );
                }
            })
            .then( result => {
                if ( result.length !== 0 ) {
                    let more = processGallery( result );
                    if ( result.length < 20 ) {
                        this.setState({
                            data: this.state.data.concat( more ),
                            pin: this.state.pin + 1,
                            locker: true
                        });
                    } else {
                        this.setState({
                            data: this.state.data.concat( more ),
                            pin: this.state.pin + 1,
                        });
                    }
                } else {
                    this.setState({ locker: true });
                }
            });
        }
    }
    render() {
        return (
            <FlatList
                contentContainerStyle={ styles.container } data = { this.state.data }
                renderItem={ ( { item } ) =>
                    <TouchableOpacity 
                        key={ "publicwatch" + item.key } 
                        onPress={ this.props.clickMoment.bind( null, item.id ) }
                    >
                        <CachedImage 
                            source={ { uri: item.key } } 
                            style={ styles.containerImage }
                        />
                    </TouchableOpacity>
                }
                numColumns={ 2 }
                columnWrapperStyle={{ justifyContent: "space-between" }}
                onEndReached={ this.loadMoment.bind( this ) }
                onRefresh={ () => {} }
                refreshing={ this.state.refresh }
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 2
    },
    containerImage: {
        width: Dimensions.get( "window" ).width/2 - 1,
        height: Dimensions.get( "window" ).width/2 - 1,
        resizeMode: "cover",
        marginBottom: 2,
        borderRadius: 5
    }
});

export default Watch;