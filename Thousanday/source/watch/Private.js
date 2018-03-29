import React, { Component } from 'react';
import {
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity
} from 'react-native';
import { CachedImage } from 'react-native-img-cache';
import { apiUrl, resourceUrl } from '../../js/Params';
import processError from '../../js/processError';

class WatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store watch list
      lists: [],
      // store unwatch lists
      unwatch: []
    };
  }
  componentDidMount() {
    fetch(`${apiUrl}/watch/read?id=${this.props.userId}`, {
      method: 'GET'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        processError(response);
        return false;
      })
      .then((list) => {
        this.setState({ lists: list[2] });
      });
  }
  watchPet(id, action) {
    if (action === 1) {
      fetch(`${apiUrl}/watch/remove`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.props.userToken,
          user: this.props.userId,
          pet: id
        })
      })
        .then((response) => {
          if (response.ok) {
            return true;
          }
          processError(response);
          return false;
        })
        .then(() => {
          this.state.unwatch.push(id);
          this.setState({ unwatch: this.state.unwatch });
        });
    } else {
      fetch(`${apiUrl}/watch/add`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.props.userToken,
          user: this.props.userId,
          pet: id
        })
      })
        .then((response) => {
          if (response.ok) {
            return true;
          }
          processError(response);
          return false;
        })
        .then(() => {
          this.state.unwatch.splice(this.state.unwatch.indexOf(id), 1);
          this.setState({ unwatch: this.state.unwatch });
        });
    }
  }
  render() {
    const lists = [];
    this.state.lists.forEach((l, i) => {
      lists.push({
        key: i,
        id: l.pet_id,
        name: l.pet_name
      });
    });
    return (
      <FlatList
        contentContainerStyle={styles.root}
        data={lists}
        ListHeaderComponent={() => (
          <View style={styles.rootHeader} >
            <Image
              source={require('../../image/follow.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerList}>
              Pets on your watch list
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          this.state.unwatch.indexOf(item.id) === -1 ? (
            <View key={`privatewatch${item.key}`} style={styles.rootRow}>
              <TouchableOpacity
                onPress={this.props.clickPet.bind(null, item.id)}
              >
                <CachedImage
                  source={{
                    uri: `${resourceUrl}/public/pet/${item.id}/0.png`
                  }}
                  style={styles.rowAvatar}
                  mutable
                />
              </TouchableOpacity>
              <Text style={styles.rowName}>
                { item.name }
              </Text>
              <TouchableOpacity
                onPress={this.watchPet.bind(this, item.id, 1)}
              >
                <Text style={styles.rowWatch}>
                  unwatch
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View key={`privatewatch${item.key}`} style={styles.rootRow}>
              <TouchableOpacity
                onPress={this.props.clickPet.bind(null, item.id)}
              >
                <CachedImage
                  source={{
                    uri: `${resourceUrl}/public/pet/${item.id}/0.png`
                  }}
                  style={styles.rowAvatar}
                  mutable
                />
              </TouchableOpacity>
              <Text style={styles.rowName}>
                { item.name }
              </Text>
              <TouchableOpacity
                onPress={this.watchPet.bind(this, item.id, 0)}
              >
                <Text style={styles.rowBack}>
                  watch
                </Text>
              </TouchableOpacity>
            </View>
            )
          )}
      />
    );
  }
}


const styles = StyleSheet.create({
  root: {
    marginHorizontal: 20,
    marginTop: 20
  },
  rootHeader: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  headerList: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  headerIcon: {
    marginRight: 15,
    width: 28,
    height: 28,
    resizeMode: 'contain'
  },
  rootRow: {
    backgroundColor: '#e5e5e5',
    flexDirection: 'row',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowAvatar: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  rowName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  rowWatch: {
    marginRight: 20,
    backgroundColor: '#ef8513',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 5
  },
  rowBack: {
    marginRight: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#ef8513',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 5
  }
});

export default WatchList;
