import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../config/constants';
import moment from 'moment';
import {setUserEntryList} from '../redux/reducer/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {Divider, Menu, TextInput} from 'react-native-paper';
import CustomTextInput from '../components/CustomTextInput';

const HomeScreen = ({navigation}) => {
  const {userEntryList} = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const [historyType, setHistoryType] = useState(1);

  const deleteEntry = async value => {
    let data = [...userEntryList];

    let newData = data.filter(item => item != value);
    dispatch(setUserEntryList(newData));
    await AsyncStorage.setItem('userEntryList', JSON.stringify(newData));

    showMessage({
      message: 'Deleted Successfully',
      type: 'success',
      icon: 'success',
    });
  };

  const renderItem = useCallback(({item, index}) => {
    return (
      <Pressable
        key={index}
        onPress={() => navigation.navigate('AddEntry', {data: item})}
        style={{
          padding: 10,
          borderBottomColor: COLORS.LIGHTGREY,
          borderBottomWidth: 1,
        }}>
        <View style={{...styles.container, justifyContent: 'space-between'}}>
          <View style={{...styles.container}}>
            <FontAwesome5 name="user" size={18} color={COLORS.DARKGREY} />
            <Text style={{...styles.text, marginLeft: 5}}>{item?.name}</Text>
          </View>
          <Pressable style={{padding: 5}} onPress={() => deleteEntry(item)}>
            <FontAwesome5 name="trash-alt" size={18} color={COLORS.SECONDARY} />
          </Pressable>
        </View>
        <View style={{...styles.container, marginTop: 5}}>
          <FontAwesome5 name="file-invoice" size={18} color={COLORS.DARKGREY} />
          <Text style={{...styles.text, marginLeft: 8}}>
            {item?.desc.join(', ')}
          </Text>
        </View>
        <View
          style={{
            ...styles.container,
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <View style={{...styles.container}}>
            {item?.amountType == '+' ? (
              <MaterialCommunityIcons
                name="arrow-bottom-left"
                size={20}
                color={'#1AB700'}
              />
            ) : (
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={20}
                color={'red'}
              />
            )}
            <Text style={{...styles.text, marginLeft: 5}}>
              {'\u20B9'} {item?.amount}
            </Text>
          </View>

          <View style={{...styles.container}}>
            <FontAwesome5
              name="calendar-alt"
              size={18}
              color={COLORS.DARKGREY}
            />
            <Text style={{...styles.text, marginLeft: 5}}>
              {moment(item?.date).format('DD-MM-YYYY') || ''}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  });

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 15,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{height: 30, width: 25}}
          />
          <Text style={{...styles.title, marginLeft: 10}}>DG BOOK</Text>
        </View>

        <Pressable onPress={() => navigation.openDrawer()}>
          <Image source={require('../assets/images/icons/drawer.png')} />
        </Pressable>
      </View>

      <View style={{flex: 1}}>
        <View
          style={{
            ...styles.card,

            flexDirection: 'row',
            padding: 15,
          }}>
          <View style={{flex: 1}}>
            <Text style={{...styles.text}}>Pending Payable Amount</Text>
            <Text style={{...styles.buttonText, color: COLORS.PRIMARY}}>
              {'\u20B9'} 500
            </Text>
          </View>
          <Divider
            style={{
              ...styles.border,
            }}
          />
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={{...styles.text, textAlign: 'right'}}>
              Pending Receivable Amount
            </Text>
            <Text style={{...styles.buttonText, color: '#1AB700'}}>
              {'\u20B9'} 1000
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.rowcenter,
            marginHorizontal: 15,
            marginTop: 15,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              ...styles.text,
              fontSize: 16,
              fontFamily: 'Inter-Medium',
            }}>
            History
          </Text>
          <Pressable
            onPress={() => navigation.navigate('History')}
            style={{padding: 5}}>
            <Text
              style={{
                ...styles.text,
                color: COLORS.PRIMARY,
                fontFamily: 'Inter-Medium',
              }}>
              View All
            </Text>
          </Pressable>
        </View>

        <View style={{...styles.rowcenter, margin: 15}}>
          <CustomTextInput
            dense={true}
            style={{flex: 1}}
            placeholder={'Type to search'}
            right={<TextInput.Icon icon={'magnify'} />}
          />
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            contentStyle={{backgroundColor: COLORS.WHITE}}
            anchor={
              <Pressable onPress={openMenu} style={{...styles.filterButton}}>
                <MaterialCommunityIcons
                  name="swap-vertical"
                  size={25}
                  color={COLORS.PRIMARY}
                />
              </Pressable>
            }>
            <Menu.Item onPress={() => {}} title="Sort By" />
            <Divider />
            <Menu.Item onPress={() => {}} title="Latest First" />
            <Menu.Item onPress={() => {}} title="Oldest First" />
            <Menu.Item onPress={() => {}} title="Name A-Z" />
            <Menu.Item onPress={() => {}} title="Name Z-A" />
          </Menu>
        </View>

        <View style={{...styles.card}}>
          <View style={{...styles.rowcenter}}>
            <Pressable
              onPress={() => setHistoryType(1)}
              style={{
                ...styles.historyTypeContainer,
                borderBottomWidth: historyType == 1 ? 1 : 0,
              }}>
              <Text
                style={{
                  ...styles.text,
                  color: historyType == 1 ? COLORS.PRIMARY : COLORS.DARKGREY,
                }}>
                All
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setHistoryType(2)}
              style={{
                ...styles.historyTypeContainer,
                borderBottomWidth: historyType == 2 ? 1 : 0,
              }}>
              <Text
                style={{
                  ...styles.text,
                  color: historyType == 2 ? COLORS.PRIMARY : COLORS.DARKGREY,
                }}>
                Sent
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setHistoryType(3)}
              style={{
                ...styles.historyTypeContainer,
                borderBottomWidth: historyType == 3 ? 1 : 0,
              }}>
              <Text
                style={{
                  ...styles.text,
                  color: historyType == 3 ? COLORS.PRIMARY : COLORS.DARKGREY,
                }}>
                Received
              </Text>
            </Pressable>
          </View>

          {userEntryList?.length > 0 ? (
            <FlatList
              data={userEntryList}
              contentContainerStyle={{paddingBottom: 400}}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{...styles.text}}>No Entry Found</Text>
            </View>
          )}
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate('AddEntry')}
        style={{...styles.bottomContainer}}>
        <LinearGradient
          colors={['#E93134', '#AF373A']}
          style={{...styles.bottomContainer2}}>
          <FontAwesome5 name="plus" size={20} color={COLORS.WHITE} />
          <Text style={{...styles.buttonText, marginLeft: 5}}>Add Entry</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomContainer2: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    padding: 10,
    borderRadius: 10,
    margin: 15,
    marginVertical: 10,
    // borderWidth: 0.8,
    borderColor: '#CACACA',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  title: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  border: {
    borderWidth: 0.3,
    height: '100%',
    marginHorizontal: 15,
    borderColor: COLORS.LIGHTGREY,
  },
  rowcenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    borderWidth: 1,
    borderColor: COLORS.LIGHTGREY,
    borderRadius: 10,
    padding: 10,
    marginLeft: 15,
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTypeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: COLORS.PRIMARY,
  },
});
