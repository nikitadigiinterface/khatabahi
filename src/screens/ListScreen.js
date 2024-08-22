import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {COLORS} from '../config/constants';
import CustomTextInput from '../components/CustomTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Divider, Menu, TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';

const ListScreen = ({navigation}) => {
  const {userEntryList} = useSelector(state => state.app);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const renderItem = useCallback(({item, index}) => {
    return (
      <Pressable
        key={index}
        style={{
          padding: 10,
          borderBottomColor: COLORS.LIGHTGREY,
          borderBottomWidth: 1,
        }}>
        <View style={{...styles.rowcenter}}>
          <FontAwesome5 name="user" size={18} color={COLORS.DARKGREY} />
          <Text style={{...styles.text, marginLeft: 10}}>{item?.name}</Text>
        </View>

        <View
          style={{
            ...styles.rowcenter,
            marginTop: 10,
            justifyContent: 'flex-end',
          }}>
          <View style={{...styles.rowcenter}}>
            <MaterialCommunityIcons
              name="arrow-top-right"
              size={20}
              color={'red'}
            />
            <Text style={{...styles.text, marginLeft: 5, color: 'red'}}>
              {'\u20B9'}500
            </Text>
          </View>

          <View style={{...styles.rowcenter, marginLeft: 15}}>
            <MaterialCommunityIcons
              name="arrow-bottom-left"
              size={20}
              color={'#1AB700'}
            />
            <Text style={{...styles.text, marginLeft: 5, color: '#1AB700'}}>
              {'\u20B9'}500
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
          List
        </Text>
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
          <Menu.Item onPress={() => {}} title="Name A-Z" />
          <Menu.Item onPress={() => {}} title="Name Z-A" />
        </Menu>
      </View>

      <View style={{...styles.card}}>
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
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    color: COLORS.TEXT,
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
  text: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});
