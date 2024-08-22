import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {COLORS} from '../config/constants';
import CustomTextInput from '../components/CustomTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, Menu, TextInput} from 'react-native-paper';

const HistoryScreen = ({navigation}) => {
  const {userEntryList} = useSelector(state => state.app);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const [list, setList] = useState(userEntryList);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [historyType, setHistoryType] = useState(1);

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

  const sortingName = type => {
    let newData = [...list];
    newData.sort(function (a, b) {
      var nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });

    if (type == 'AZ') setList(newData);
    else if (type == 'ZA') setList(newData.reverse());
    closeMenu();
  };

  const sortingDate = (type) => {
    let newData = [...list];
    newData.sort(function (a, b) {
      var c = new Date(a.date);
      var d = new Date(b.date);
      return c-d;
    });

    if (type == 'oldest') setList(newData);
    else if (type == 'latest') setList(newData.reverse());
    closeMenu();
  }

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 15,
        }}>
        <Pressable onPress={() => navigation.goBack()} style={{}}>
          <Image source={require('../assets/images/icons/backArrow.png')} />
        </Pressable>

        <Text
          style={{
            ...styles.headerTitle,
            marginLeft: 15,
          }}>
          History
        </Text>
      </View>

      <View style={{flex: 1}}>
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
            <Menu.Item onPress={() => sortingDate('latest')} title="Latest First" />
            <Menu.Item onPress={() => sortingDate('oldest')} title="Oldest First" />
            <Menu.Item onPress={() => sortingName('AZ')} title="Name A-Z" />
            <Menu.Item onPress={() => sortingName('ZA')} title="Name Z-A" />
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

          {list?.length > 0 ? (
            <FlatList
              data={list}
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
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    color: COLORS.TEXT,
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
  title: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
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
