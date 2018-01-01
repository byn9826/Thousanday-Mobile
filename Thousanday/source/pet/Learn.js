import React, { Component } from 'react';
import {
  StyleSheet, ScrollView, Text, RefreshControl, View, Picker, Button
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
      // record update result
      update: [false, false, false, false]
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
  // update skill index
  updateIndex(index) {
    console.log(this.state.skills[`skill${index}_index`]);
    fetch(`${apiUrl}/learn/update`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: this.props.userId,
        token: this.props.userToken,
        pet: this.props.id,
        index,
        skill: this.state.skills[`skill${index}_index`]
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
        const update = this.state.update;
        update[index] = true;
        this.setState({ update });
        this.props.cacheData('pet', null);
      });
  }
  // pick profile image
  pickImg(index) {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      mediaType: 'photo',
      cropping: true
    }).then((image) => {
      const name = `${index + 1}.png`;
      const file = { uri: image.path, type: 'multipart/form-data', name };
      const data = new FormData();
      data.append('file', file, name);
      data.append('token', this.props.userToken);
      data.append('user', this.props.userId);
      data.append('pet', this.props.id);
      data.append('index', index);
      data.append('skill', this.state.skills[`skill${index}_index`]);
      fetch(`${apiUrl}/upload/skill`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: data
      })
        .then((response) => {
          if (response.ok) {
            return true;
          }
          processError(response);
          return false;
        })
        .then(() => {
          const update = this.state.update;
          update[index] = true;
          this.setState({ update });
          this.props.cacheData('pet', null);
        });
    });
  }
  changeIndex(index, i) {
    if (index !== null) {
      const skills = this.state.skills;
      skills[`skill${i}_index`] = index.toString();
      this.setState({ skills });
    }
  }
  render() {
    const skills = [];
    const options = [];
    this.state.options.forEach((option, index) => {
      options.push(<Picker.Item
        key={`skillitem${option[0]}`}
        label={`${option[0]}: ${option[1]}`}
        value={index.toString()}
      />);
    });
    for (let i = 0; i < 4; i += 1) {
      skills.push((
        <View key={`skillarea${i}`} style={styles.skills}>
          <Text>Set Skill {i + 1}: </Text>
          <Picker
            selectedValue={this.state.skills[`skill${i}_index`]}
            onValueChange={(index) => { this.changeIndex(index, i); }}
          >
            <Picker.Item label="Choose a skill" value={null} />
            {options}
          </Picker>
          {
            this.state.skills[`skill${i}_index`] !== null ? (
              <View style={styles.confirmRow}>
                <Button
                  onPress={this.updateIndex.bind(this, i)}
                  title="Confirm"
                  color="#052456"
                />
                <Button
                  onPress={this.pickImg.bind(this, i)}
                  title="Confirm and upload image"
                  color="#052456"
                />
              </View>
            ) : null
          }
          {
            this.state.update[i] ? (<Text>Updated!</Text>) : null
          }
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
  },
  confirmRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default LearnSkill;
