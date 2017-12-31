import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, AsyncStorage } from 'react-native';
import Watch from './source/watch/Watch';
import Header from './source/general/Header';
import Footer from './source/general/Footer';
import Pet from './source/pet/Pet';
import AddPet from './source/pet/Add';
import User from './source/user/User';
import Explore from './source/explore/Explore';
import Moment from './source/moment/Moment';
import PostMoment from './source/moment/Post';
import EditProfile from './source/user/Change';
import EditPet from './source/pet/Edit';
import LearnSkill from './source/pet/Learn';
import WatchList from './source/watch/Private';
import Love from './source/love/Love';
import Login from './source/login/Login';
import Signup from './source/login/Signup';
import Request from './source/request/Request';

export default class Thousanday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store current view name
      route: 'watch',
      // store special id used in current view
      id: null,
      // store login user id
      userId: null,
      // store login user id platform
      userPlatform: null,
      // store login user token
      userToken: null,
      // store token for signup
      signupData: null,
      // store signup platform
      signupPlatform: null,
      // record users view history
      history: [],
      // cache result
      cache: {
        moment: null,
        pet: null,
        user: null
      }
    };
  }
  componentDidMount() {
    this.loadUserData().done();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.route !== this.state.route) {
      this.state.history[this.state.history.length] = [this.state.route, this.state.id];
    }
  }
  // set up login info
  async setUserData(key, platform) {
    await AsyncStorage.setItem('USER_KEY', key[0].toString());
    await AsyncStorage.setItem('Platform_KEY', platform);
    await AsyncStorage.setItem('Token_KEY', key[2]);
  }
  // get stored user id
  async loadUserData() {
    const userId = await AsyncStorage.getItem('USER_KEY');
    const platform = await AsyncStorage.getItem('Platform_KEY');
    const token = await AsyncStorage.getItem('Token_KEY');
    if (userId != null) {
      this.setState({
        userId: parseInt(userId, 10), userPlatform: platform, userToken: token
      });
    }
  }
  // logout current user
  userLogout() {
    this.removeUser().done();
    this.setState({
      userId: null, userToken: null, userPlatform: null, route: 'watch'
    });
  }
  // remove user data
  async removeUser() {
    await AsyncStorage.removeItem('USER_KEY');
    await AsyncStorage.removeItem('Platform_KEY');
    await AsyncStorage.removeItem('Token_KEY');
  }
  // change to desired view if user click on footer
  changeView(view) {
    if (this.state.route !== view) {
      if (view === 'postMoment' && !this.state.userId) {
        // require login
        this.setState({ route: 'home' });
      } else if (view === 'love' && !this.state.userId) {
        // require login
        this.setState({ route: 'home' });
      } else {
        this.setState({ route: view });
      }
    }
  }
  // store data for future use
  cacheData(route, id, data) {
    if (id === null) {
      this.state.cache[route] = null;
    } else {
      this.state.cache[route] = {};
      this.state.cache[route].id = id;
      this.state.cache[route].data = data;
    }
  }
  // enter into one moment's view
  clickMoment(id) {
    this.setState({ route: 'moment', id });
  }
  // enter into one pet's view
  clickPet(id) {
    this.setState({ route: 'pet', id });
  }
  // enter into one user's view
  clickUser(id) {
    if (this.state.userId && this.state.userId === id) {
      // enter into current user's own view
      this.setState({ route: 'home', id });
    } else {
      // enter into other user's view
      this.setState({ route: 'user', id });
    }
  }
  // enter into one user's view and update login user's info
  goHome(user, platform) {
    this.setState({
      userId: parseInt(user[0], 10),
      userToken: user[2],
      userPlatform: platform,
      route: 'home',
      id: parseInt(user[0], 10)
    });
  }
  // if user click on add pet
  clickAddPet() {
    this.setState({ route: 'addPet' });
  }
  // if user click on post moment
  // clickPostMoment() {
  //   this.setState({ route: 'postMoment' });
  // }
  // if user click learn skill
  clickLearnSkill(id) {
    this.setState({ route: 'learnSkill', id });
  }
  // if user click on edit pet
  clickEditPet(id) {
    this.setState({ route: 'editPet', id });
  }
  // click edit profile page
  clickEditProfile(name) {
    this.setState({ route: 'editProfile', id: name });
  }
  // click watch lists,get watch list info
  clickWatchList() {
    this.setState({ route: 'watchList' });
  }
  // click msg box
  clickRequestMessage() {
    this.setState({ route: 'requestMessage' });
  }
  // signup feature
  goSignup(data, platform) {
    this.setState({ signupData: data, signupPlatform: platform, route: 'signup' });
  }
  // new user login
  newUser(result, platform) {
    if (platform === 'google') {
      this.setUserData(result, 'google');
      this.setState({
        userId: result[0], userToken: result[1], userPlatform: 'google', route: 'home'
      });
    } else {
      this.setUserData(result, 'facebook');
      this.setState({
        userId: result[0], userToken: result[1], userPlatform: 'facebook', route: 'home'
      });
    }
  }
  // go back button
  backView() {
    if (this.state.history.length > 1) {
      const last = this.state.history[this.state.history.length - 2];
      this.state.history.pop();
      this.setState({ route: last[0], id: last[1] });
    }
  }
  render() {
    // view route system
    let route;
    switch (this.state.route) {
      // default view, watch public images
      case 'watch':
        route = <Watch clickMoment={this.clickMoment.bind(this)} />;
        break;
        // moment view, show one moment's info
      case 'moment':
        route = (<Moment
          key={`moment${this.state.id}`}
          id={this.state.id}
          clickPet={this.clickPet.bind(this)}
          userId={this.state.userId}
          userToken={this.state.userToken}
          cache={this.state.cache}
          cacheData={this.cacheData.bind(this)}
        />);
        break;
      // pet view, show one pet's info
      case 'pet':
        route = (<Pet
          key={`pet${this.state.id}`}
          id={this.state.id}
          clickMoment={this.clickMoment.bind(this)}
          clickLearnSkill={this.clickLearnSkill.bind(this)}
          clickPet={this.clickPet.bind(this)}
          clickUser={this.clickUser.bind(this)}
          userId={this.state.userId}
          userToken={this.state.userToken}
          cache={this.state.cache}
          cacheData={this.cacheData.bind(this)}
        />);
        break;
      // user view, show other user's info
      case 'user':
        route = (<User
          key={`user${this.state.id}`}
          id={this.state.id}
          userId={this.state.userId}
          clickMoment={this.clickMoment.bind(this)}
          clickPet={this.clickPet.bind(this)}
          clickUser={this.clickUser.bind(this)}
          cache={this.state.cache}
          cacheData={this.cacheData.bind(this)}
        />);
        break;
      // home view, show login user's info
      case 'home':
        if (this.state.userId) {
          route = (<User
            // ref='user'
            key={`user${this.state.userId}`}
            id={this.state.userId}
            userId={this.state.userId}
            userToken={this.state.userToken}
            platform={this.state.userPlatform}
            clickMoment={this.clickMoment.bind(this)}
            clickPet={this.clickPet.bind(this)}
            clickUser={this.clickUser.bind(this)}
            clickAddPet={this.clickAddPet.bind(this)}
            clickEditPet={this.clickEditPet.bind(this)}
            clickEditProfile={this.clickEditProfile.bind(this)}
            clickWatchList={this.clickWatchList.bind(this)}
            clickRequestMessage={this.clickRequestMessage.bind(this)}
            userLogout={this.userLogout.bind(this)}
            cache={this.state.cache}
            cacheData={this.cacheData.bind(this)}
          />);
        } else {
          // require user login
          route = (<Login
            goHome={this.goHome.bind(this)}
            goSignup={this.goSignup.bind(this)}
          />);
        }
        break;
      // add pet view
      case 'addPet':
        route = (<AddPet
          userId={this.state.userId}
          userToken={this.state.userToken}
          backHome={this.clickUser.bind(this)}
          cacheData={this.cacheData.bind(this)}
        />);
        break;
      // edit pet view
      case 'editPet':
        route = (<EditPet
          key={`editpet${this.state.id}`}
          id={this.state.id}
          userId={this.state.userId}
          userToken={this.state.userToken}
          backHome={this.clickUser.bind(this)}
          cacheData={this.cacheData.bind(this)}
        />);
        break;
      // click learn skill
      case 'learnSkill':
        route = (<LearnSkill
          key={`learnskill${this.state.id}`}
          id={this.state.id}
          userId={this.state.userId}
          userToken={this.state.userToken}
        />);
        break;
      // edit profile view
      case 'editProfile':
        route = (<EditProfile
          userName={this.state.id}
          userId={this.state.userId}
          userToken={this.state.userToken}
          backHome={this.clickUser.bind(this)}
          cacheData={this.cacheData.bind(this)}
        />);
        break;
      // watch list view
      case 'watchList':
        route = (<WatchList
          userId={this.state.userId}
          userToken={this.state.userToken}
          clickPet={this.clickPet.bind(this)}
        />);
        break;
      // request msg view
      case 'requestMessage':
        route = (<Request
          userId={this.state.userId}
          userToken={this.state.userToken}
        />);
        break;
      // explore page could be seen by public
      case 'explore':
        route = (<Explore clickMoment={this.clickMoment.bind(this)} />);
        break;
      case 'love':
        route = (<Love
          userId={this.state.userId}
          clickMoment={this.clickMoment.bind(this)}
        />);
        break;
      case 'postMoment':
        route = (<PostMoment
          userId={this.state.userId}
          userToken={this.state.userToken}
          goMoment={this.clickMoment.bind(this)}
          cacheData={this.cacheData.bind(this)}
        />);
        break;
      case 'signup':
        route = (<Signup
          data={this.state.signupData}
          platform={this.state.signupPlatform}
          newUser={this.newUser.bind(this)}
        />);
        break;
      default:
        break;
    }
    return (
      <View style={styles.container}>
        <Header
          title={this.state.route}
          backView={this.backView.bind(this)}
        />
        <View style={styles.main}>
          { route }
        </View>
        <Footer
          changeView={this.changeView.bind(this)}
          view={this.state.route}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#F5FCFF'
  },
  main: {
    flex: 10,
    backgroundColor: 'white'
  }
});

AppRegistry.registerComponent('Thousanday', () => Thousanday);
