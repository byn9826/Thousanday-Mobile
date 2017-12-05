import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image
} from 'react-native';

function Header(props) {
  let title;
  switch (props.title) {
    case 'watch':
      title = 'Watch the world';
      break;
    case 'explore':
      title = 'Explore the cute';
      break;
    case 'pet':
      title = 'Pet in digital hub';
      break;
    case 'user':
      title = 'Pets Mommy or Daddy';
      break;
    case 'home':
      title = 'A hive for your pets';
      break;
    case 'moment':
      title = 'Love Moments with pets';
      break;
    case 'love':
      title = 'Moments on your list';
      break;
    case 'addPet':
      title = 'Add new pet';
      break;
    case 'postMoment':
      title = 'Share your moment';
      break;
    case 'editProfile':
      title = 'Tell the world about you';
      break;
    case 'editPet':
      title = 'Edit your pet';
      break;
    case 'signup':
      title = 'Register for your digital home';
      break;
    case 'requestMessage':
      title = 'Message Box';
      break;
    case 'watchList':
      title = 'Cutes you are watching';
      break;
    default:
      break;
  }
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerBack} onPress={props.backView.bind(this)}>
        <Image source={require('../../image/back.png')} />
      </TouchableOpacity>
      <Text style={styles.headerBrand}>
        { title }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ef8513',
    paddingHorizontal: 5
  },
  headerBack: {
    padding: 6
  },
  headerBrand: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10
  }
});

export default Header;
