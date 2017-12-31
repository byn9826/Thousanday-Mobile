import React, { Component } from 'react';
import {
  StyleSheet, ScrollView, Text, RefreshControl, View, TextInput, Picker, Image, Button
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import processError from '../../js/processError';
import { apiUrl } from '../../js/Params';

class LearnSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store pet's skills info
      skills: {},
      // store skills list
      options: [],
      // show refresh
      refresh: true,
      // store uploaded image
      image: null
    };
  }
  componentDidMount() {
    fetch(`${apiUrl}/learn/read?pet=${this.props.id}`, {
      method: 'GET'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        processError(response);
        return false;
      })
      .then((data) => {
        this.setState({ skills: data[0], options: data[1], refresh: false });
      });
  }
  // pick profile image
  pickImg() {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      mediaType: 'photo',
      cropping: true
    }).then((image) => {
      this.setState({
        image: {
          uri: image.path, width: image.width, height: image.height, mime: '0.png'
        }
      });
    });
  }
  render() {
    let i = 0;
    const skills = [];
    const options = [];
    this.state.options.forEach((option, index) => {
      options.push(<Picker.Item
        key={`skillitem${option[0]}`}
        label={`Skill - ${option[0]}:`}
        value={index}
      />);
      options.push(<Picker.Item
        key={`skillitem${option[1]}`}
        label={`${option[1]}:`}
        value={index}
      />);
    });
    for (i; i < 4; i += 1) {
      skills.push((
        <View key={`skillarea${i}`} style={styles.skills}>
          <Text>Set Skill {i + 1}: </Text>
          <TextInput value={this.state.skills[`skill${i}_name`]} />
          <Picker
            selectedValue={this.state.skills[`skill${i}_index`]}
          >
            <Picker.Item label="Choose a skill" value="choose" />
            {options}
          </Picker>
          <Button
            onPress={this.pickImg.bind(this)}
            title="Upload Skill Image"
            color="#052456"
          />
          <Image
            source={this.state.image}
          />
        </View>
      ));
    }
    return (
      <ScrollView
        contentContainerStyle={styles.root}
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={() => {}}
          />
        }
      >
        {skills}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 20,
    paddingBottom: 50
  },
  skills: {
    marginTop: 20,
    backgroundColor: '#f7d7b4',
    padding: 10
  }
});

export default LearnSkill;
