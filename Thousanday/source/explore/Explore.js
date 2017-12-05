import React, { Component } from 'react';
import {
  StyleSheet, Text, Dimensions, Image, View, FlatList, TouchableOpacity
} from 'react-native';
import { CachedImage } from 'react-native-img-cache';
import processGallery from '../../js/processGallery';
import processError from '../../js/processError';
import { apiUrl } from '../../js/Params';

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store init images
      initImages: [],
      // indicate choose of type
      type: null,
      // indicate choose of nature
      nature: null,
      // indicate lock the load more function or not
      moreLocker: false,
      // indicate have load how many times
      loadTimes: 1,
      // show refresh
      refresh: false
    };
  }
  // user click on one type
  chooseType(type) {
    if (this.state.type === type) {
      // empty state
      this.setState({
        type: null, initImages: [], loadTimes: 1, moreLocker: false
      });
    } else {
      this.setState({ type });
      // require info
      if (this.state.nature) {
        this.setState({ refresh: true });
        fetch(`${apiUrl}/explore/read?load=0&nature=${this.state.nature}&type=${type}`, {
          method: 'GET'
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            processError(response);
            return false;
          })
          .then((result) => {
            this.setState({ refresh: false });
            // build data with all images
            const gallery = processGallery(result);
            const moreLocker = result.length < 20;
            this.setState({ initImages: gallery, moreLocker, loadTimes: 1 });
          });
      }
    }
  }
  // user click on one nature
  chooseNature(nature) {
    if (this.state.nature === nature) {
      // empty state if already choosed it
      this.setState({
        nature: null, initImages: [], loadTimes: 1, moreLocker: false
      });
    } else {
      this.setState({ nature });
      // if chosed nature and type do search
      if (this.state.type) {
        fetch(`${apiUrl}/explore/read?load=0&nature=${nature}&type=${this.state.type}`, {
          method: 'GET'
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            processError(response);
            return false;
          })
          .then((result) => {
            this.setState({ refresh: false });
            // build data with all images
            const gallery = processGallery(result);
            const moreLocker = result.length < 20;
            this.setState({
              initImages: gallery, moreLocker, loadTimes: 1
            });
          });
      }
    }
  }
  // load more momentCursor
  loadMore() {
    if (this.state.type && this.state.nature && !this.state.moreLocker) {
      fetch(`${apiUrl}/explore/read?load=${this.state.loadTimes}&nature=${this.state.nature}&type=${this.state.type}`, {
        method: 'GET'
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          processError(response);
          return false;
        })
        .then((result) => {
          this.setState({ refresh: false });
          // build data with all images
          const gallery = processGallery(result);
          const allImages = this.state.initImages.concat(gallery);
          const moreLocker = result.length < 20;
          this.setState({
            initImages: allImages, moreLocker, loadTimes: this.state.loadTimes + 1
          });
        });
    }
  }
  // header
  header() {
    return (
      <View style={styles.containerHeader}>
        <View style={styles.headerFilter}>
          <Image
            style={styles.filterIcon}
            source={require('../../image/filter.png')}
          />
          <Text style={styles.filterContent}>
              Filter
          </Text>
        </View>
        <View style={styles.headerOption}>
          <View style={styles.optionType}>
            <Text
              onPress={this.chooseType.bind(this, '0')}
              style={
                this.state.type === '0'
                  ? styles.typeChoose : styles.typeSingle
              }
            >
              Dog
            </Text>
            <Text
              onPress={this.chooseType.bind(this, '1')}
              style={
                this.state.type === '1'
                  ? styles.typeChoose : styles.typeSingle
              }
            >
              Cat
            </Text>
            <Text
              onPress={this.chooseType.bind(this, '2')}
              style={
                this.state.type === '2'
                  ? styles.typeChoose : styles.typeSingle
              }
            >
              Bird
            </Text>
            <Text
              onPress={this.chooseType.bind(this, '3')}
              style={
                this.state.type === '3'
                  ? styles.typeChoose : styles.typeSingle
              }
            >
              Fish
            </Text>
            <Text
              onPress={this.chooseType.bind(this, '4')}
              style={
                this.state.type === '4'
                  ? styles.typeChoose : styles.typeSingle
              }
            >
              Other
            </Text>
          </View>
          <View style={styles.optionType}>
            <Text
              onPress={this.chooseNature.bind(this, '0')}
              style={
                  this.state.nature === '0'
                    ? styles.typeChoose : styles.typeSingle
              }
            >
              Cute
            </Text>
            <Text
              onPress={this.chooseNature.bind(this, '1')}
              style={
                this.state.nature === '1'
                    ? styles.typeChoose : styles.typeSingle
              }
            >
              Strong
            </Text>
            <Text
              onPress={this.chooseNature.bind(this, '2')}
              style={
                this.state.nature === '2'
                  ? styles.typeChoose : styles.typeSingle
              }
            >
              Smart
            </Text>
            <Text
              onPress={this.chooseNature.bind(this, '3')}
              style={
                this.state.nature === '3'
                  ? styles.typeChoose : styles.typeSingle
              }
            >
              Beauty
            </Text>
          </View>
        </View>
      </View>
    );
  }
  render() {
    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={this.state.initImages}
        ListHeaderComponent={this.header.bind(this)}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between'
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={this.props.clickMoment.bind(null, item.id)}
          >
            <CachedImage
              source={{ uri: item.key }}
              style={styles.containerImage}
            />
          </TouchableOpacity>
        )}
        onEndReached={this.loadMore.bind(this)}
        onRefresh={() => {}}
        refreshing={this.state.refresh}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderStyle: 'solid',
    borderColor: '#f7d7b4',
    borderBottomWidth: 1,
    marginBottom: 10
  },
  headerFilter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  filterIcon: {
    resizeMode: 'contain'
  },
  filterContent: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  },
  headerOption: {
    flex: 6,
    flexDirection: 'column'
  },
  optionType: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  typeChoose: {
    fontSize: 16,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    marginVertical: 8,
    backgroundColor: '#052456',
    paddingVertical: 2,
    borderStyle: 'solid',
    borderColor: '#052456',
    borderWidth: 1,
    borderRadius: 3,
    color: 'white'
  },
  typeSingle: {
    fontSize: 16,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    marginVertical: 8,
    paddingVertical: 2,
    borderStyle: 'solid',
    borderColor: '#f7d7b4',
    borderWidth: 1,
    borderRadius: 3
  },
  containerImage: {
    width: (Dimensions.get('window').width / 2) - 1,
    height: (Dimensions.get('window').width / 2) - 1,
    resizeMode: 'cover',
    marginBottom: 2,
    borderRadius: 5
  }
});

export default Explore;
