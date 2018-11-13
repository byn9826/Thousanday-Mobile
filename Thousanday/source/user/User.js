import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import { CachedImage } from 'react-native-img-cache';
import { apiUrl, resourceUrl, getGender, getType } from '../../js/Params';
import processGallery from '../../js/processGallery';
import processError from '../../js/processError';

const FBSDK = require('react-native-fbsdk');

const { LoginButton } = FBSDK;

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // show refresh animation or not
      refresh: true,
      // store moment images
      images: [],
      // allow load more images or not
      locker: false,
      // record load image for how many times
      pin: 1,
      // store pets info belong to current user
      pets: [],
      // store pets list belong to current user
      belong: [],
      // store user info
      user: { user_name: '' }
    };
  }
  componentWillMount() {
    if (this.props.cache.user !== null && this.props.cache.user.id === this.props.id) {
      this.setState(this.props.cache.user.data);
    } else {
      fetch(`${apiUrl}/user/read?id=${this.props.id}`, {
        method: 'GET'
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          processError(response);
          return false;
        })
        .then((user) => {
          const data = {
            images: processGallery(user[2]),
            locker: user[2].length !== 20,
            belong: user[3],
            pets: user[1],
            user: user[0],
            refresh: false
          };
          this.props.cacheData('user', this.props.id, data);
          this.setState(data);
        });
    }
  }
  componentDidMount() {
    this.gSetup();
  }
  async gSetup() {
    await GoogleSignin.hasPlayServices({ autoResolve: true });
    await GoogleSignin.configure({
      webClientId: '824184598797-r7187jnt2pkd7i0nukks3id5f9onpqvd.apps.googleusercontent.com',
      offlineAccess: false
    });
    await GoogleSignin.currentUserAsync();
  }
  gLogout() {
    GoogleSignin.revokeAccess()
      .then(() => GoogleSignin.signOut())
      .then(() => {
        this.setState({ refresh: true });
        fetch(`${apiUrl}/account/logout`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.props.userId,
            token: this.props.userToken
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
            this.setState({ refresh: false });
            this.props.userLogout();
          });
      });
  }
  // load more moments
  loadMore() {
    if (!this.state.locker) {
      fetch(`${apiUrl}/user/load`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          load: this.state.pin,
          belong: this.state.belong
        })
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          processError(response);
          return false;
        })
        .then((result) => {
          const final = processGallery(result);
          if (final.length === 20) {
            this.setState({
              images: this.state.images.concat(final),
              pin: this.state.pin + 1
            });
          } else {
            this.setState({
              images: this.state.images.concat(final),
              pin: this.state.pin + 1,
              locker: true
            });
          }
        });
    }
  }
  render() {
    // show all pets
    const pets = this.state.pets.map(pet => (
      <View key={`pets${pet.pet_id}`} style={styles.petHub}>
        <TouchableOpacity onPress={this.props.clickPet.bind(null, pet.pet_id)}>
          <CachedImage
            source={{ uri: `${resourceUrl}/public/pet/${pet.pet_id}/0.png` }}
            mutable
            style={styles.hubPet}
          />
        </TouchableOpacity>
        {
          this.props.id !== this.props.userId ? (
            <View style={styles.hubDesc} >
              <Text style={styles.descType}>
                { getType(pet.pet_type) }
              </Text>
              <Text style={styles.descGender}>
                { getGender(pet.pet_gender) }
              </Text>
            </View>
          ) : null
        }
        <Text style={styles.hubName}>
          { pet.pet_name }
        </Text>
        {
          this.props.id === this.props.userId ? (
            <TouchableOpacity
              onPress={this.props.clickEditPet.bind(null, pet.pet_id)}
            >
              <Text style={styles.hubEdit}>
                Edit
              </Text>
            </TouchableOpacity>
          ) : null
        }
      </View>
    ));
    // show all relatives
    let reldata = [];
    this.state.pets.forEach((p) => {
      if (p.relative_id) {
        if (parseInt(p.relative_id, 10) === this.props.id) {
          reldata.push({
            index: p.pet_id,
            rel: p.owner_id
          });
        } else {
          reldata.push({
            index: p.pet_id,
            rel: p.relative_id
          });
        }
      }
    });
    reldata = [...new Set(reldata)];
    const relatives = reldata.map(relative => (
      <TouchableOpacity
        key={`relatives${relative.index}`}
        onPress={this.props.clickUser.bind(null, parseInt(relative.rel, 10))}
      >
        <CachedImage
          source={{ uri: `${resourceUrl}/public/user/${relative.rel}.jpg` }}
          mutable
          style={styles.userImg}
        />
      </TouchableOpacity>
    ));
    // show admin panel, show welcome message
    let panel;
    let welcome;
    let logout;
    let user;
    if (this.props.id === this.props.userId) {
      panel = (
        <View style={styles.headerAction}>
          <TouchableOpacity onPress={this.props.clickAddPet.bind(this)}>
            <View style={styles.actionCircle}>
              <Text style={styles.circleContent}>
                Add
              </Text>
              <Text style={styles.circleContent}>
                Pet
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.clickEditProfile.bind(null, this.state.user.user_name)}
          >
            <View style={styles.actionCircle}>
              <Text style={styles.circleContent}>
                Edit
              </Text>
              <Text style={styles.circleContent}>
                Profile
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.clickWatchList.bind(this)}>
            <View style={styles.actionCircle}>
              <Text style={styles.circleContent}>
                Watch
              </Text>
              <Text style={styles.circleContent}>
                List
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.clickRequestMessage.bind(this)}>
            <View style={styles.actionCircle}>
              <Text style={styles.circleContent}>
                Msg
              </Text>
              <Text style={styles.circleContent}>
                Box
              </Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={this.props.clickGameHub.bind(this)}>
            <View style={styles.actionCircle}>
              <Text style={styles.circleContent}>
                Game
              </Text>
              <Text style={styles.circleContent}>
                Hub
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>
      );
      if (this.props.platform === 'facebook') {
        logout = (
          <Facebook
            userId={this.props.userId}
            userToken={this.props.userToken}
            userLogout={this.props.userLogout.bind(this)}
          />
        );
      } else {
        logout = (
          <TouchableOpacity onPress={this.gLogout.bind(this)}>
            <View style={styles.containerGoogle}>
              <Text style={styles.googleOut}>Log out</Text>
            </View>
          </TouchableOpacity>
        );
      }
      welcome = (
        <View style={styles.headerContainer}>
          <Text style={styles.containerHome}>
              Welcome Home! { this.state.user.user_name }
          </Text>
          { logout }
        </View>
      );
      user = (
        <Text style={styles.headerId}>
          Your user id is { this.props.userId }
        </Text>
      );
    } else {
      welcome = (
        <Text style={styles.headerName}>
          Welcome to { this.state.user.user_name }′s Home
        </Text>
      );
    }
    return (
      <FlatList
        style={styles.main}
        ListHeaderComponent={() => (
          <View style={styles.mainHeader}>
            <View style={styles.headerRow}>
              <CachedImage
                source={{ uri: `${resourceUrl}/public/user/${this.props.id}.jpg` }}
                mutable
                style={styles.headerAvatar}
              />
              { welcome }
            </View>
            { user }
            { panel }
            {
              this.state.images.length > 0 ? (
                <Text style={styles.headerTitle}>
                  Pets List
                </Text>
              ) : null
            }
            <View style={styles.headerPet}>
              { pets }
            </View>
            {
              this.state.pets.length > 0 ? (
                <Text style={styles.headerTitle}>
                  Relatives
                </Text>
              ) : null
            }
            <View style={styles.headerUser}>
              { relatives }
            </View>
            {
              this.state.images.length > 0 ? (
                <Text style={styles.headerTitle}>
                  Moments with pets
                </Text>
              ) : null
            }
          </View>
        )}
        contentContainerStyle={styles.mainContainer}
        data={this.state.images}
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
        onRefresh={() => {}}
        refreshing={this.state.refresh}
        onEndReached={
          this.loadMore.bind(this)
        }
      />
    );
  }
}

const Facebook = React.createClass({
  render() {
    return (
      <LoginButton
        onLogoutFinished={
          () => {
            this.setState({ refresh: true });
            fetch(`${apiUrl}/account/logout`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: this.props.userId,
                token: this.props.userToken
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
                this.setState({ refresh: false });
                this.props.userLogout();
              });
          }
        }
      />
    );
  }
});

const styles = StyleSheet.create({
  main: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingBottom: 20
  },
  mainHeader: {
    alignItems: 'flex-start'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerAvatar: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20
  },
  headerContainer: {
    alignItems: 'center'
  },
  containerHome: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },
  containerGoogle: {
    width: 186,
    backgroundColor: '#052456',
    height: 30,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  googleOut: {
    color: 'white',
    fontSize: 14
  },
  headerId: {
    fontSize: 12,
    marginLeft: 10,
    marginTop: 10
  },
  headerAction: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    backgroundColor: '#e5e5e5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  actionCircle: {
    backgroundColor: '#ef8513',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginRight: 15
  },
  circleContent: {
    fontSize: 11,
    color: 'white'
  },
  headerTitle: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#052456',
    width: 250,
    marginBottom: 10,
    marginTop: 20
  },
  headerPet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    marginBottom: 15
  },
  petHub: {
    backgroundColor: '#f7f9fc',
    alignItems: 'center',
    marginRight: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 15,
    marginTop: 10,
    borderRadius: 5
  },
  hubPet: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  hubEdit: {
    fontSize: 12,
    backgroundColor: '#ef8513',
    width: 90,
    paddingVertical: 5,
    color: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    textAlign: 'center'
  },
  hubDesc: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  descType: {
    fontSize: 12,
    backgroundColor: '#ef8513',
    color: 'white',
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRadius: 3
  },
  descGender: {
    marginLeft: 5,
    fontSize: 20
  },
  hubName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  headerUser: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10
  },
  userImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  containerImage: {
    width: (Dimensions.get('window').width / 2) - 12,
    height: (Dimensions.get('window').width / 2) - 12,
    resizeMode: 'cover',
    marginBottom: 4,
    borderRadius: 5
  },
  headerName: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default User;
