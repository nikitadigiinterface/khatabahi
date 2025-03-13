import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {COLORS} from '../../config/constants';
import {Divider, Menu, TextInput} from 'react-native-paper';
import CustomTextInput from '../../components/CustomTextInput';
import AppBar from '../../components/AppBar';
import {showMessage} from 'react-native-flash-message';
import {contact_people_list_api, transaction_tags_list_api} from '../../api';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyTagsScreen = ({navigation}) => {
  const {userEntryList} = useSelector(state => state.app);
  const [visible, setVisible] = useState(false);

  const [sortBy, setSortBy] = useState('');

  const [list, setList] = useState([]);

  useEffect(() => {
      transactionTagsListApi();
  }, [sortBy]);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const transactionTagsListApi = async () => {

    let response = await transaction_tags_list_api({
      a_to_z: sortBy == 'a_to_z' ? 1 : '',
      z_to_a: sortBy == 'z_to_a' ? 1 : '',
    });

    // console.log(response?.data?.list)

    if (response?.status == 1) {
      setList(response?.data?.list);
    } else {
      response?.error &&
        showMessage({
          message: response?.error,
          type: 'danger',
          icon: 'danger',
        });
    }
  };

  const renderItem = useCallback(({item, index}) => {
    return (
      <Pressable
      onPress={() => navigation.navigate('TagsChat', {tag: item})}
        key={index}
        style={{
          padding: 10,
          paddingVertical: 15,
          borderBottomColor: COLORS.LIGHTGREY,
          borderBottomWidth: 0.5,
        }}>
        <View style={{...styles.rowcenterbetween}}>
          <Text style={{...styles.text}}>#{item?.title}</Text>

          <View
            style={{
              ...styles.rowcenter,
            }}>
            {item?.total_debit ? (
              <View style={{...styles.rowcenter}}>
                <MaterialCommunityIcons
                  name="arrow-top-right"
                  size={20}
                  color={COLORS.SECONDARY}
                  style={{marginRight: 5}}
                />
                <Text style={{...styles.text, color: COLORS.SECONDARY}}>
                  {'\u20B9'}
                  {item?.total_debit}
                </Text>
              </View>
            ) : null}

            {item?.total_credit ? (
              <View style={{...styles.rowcenter, marginLeft: 15}}>
                <MaterialCommunityIcons
                  name="arrow-bottom-left"
                  size={20}
                  color={'#1AB700'}
                  style={{marginRight: 5}}
                />
                <Text style={{...styles.text, color: '#1AB700'}}>
                  {'\u20B9'}
                  {item?.total_credit}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  });


  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <AppBar navigation={navigation} title={'My Tags'} />

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
          contentStyle={{backgroundColor: COLORS.WHITE, borderRadius: 10}}
          anchor={
            <Pressable onPress={openMenu} style={{...styles.filterButton}}>
              <MaterialCommunityIcons
                name="filter"
                size={25}
                color={COLORS.PRIMARY}
              />
            </Pressable>
          }>
          <Menu.Item
            trailingIcon={'close'}
            onPress={() => {
              setSortBy('');
              setVisible(false);
            }}
            title="Sort By"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setSortBy('a_to_z');
              setVisible(false);
            }}
            title="Name A-Z"
            titleStyle={{
              color: sortBy == 'a_to_z' ? COLORS.SECONDARY : COLORS.TEXT,
            }}
          />
          <Menu.Item
            onPress={() => {
              setSortBy('z_to_a');
              setVisible(false);
            }}
            title="Name Z-A"
            titleStyle={{
              color: sortBy == 'z_to_a' ? COLORS.SECONDARY : COLORS.TEXT,
            }}
          />
        </Menu>
      </View>

      <View style={{...styles.card}}>
        {list?.length > 0 ? (
          <FlatList
            data={list}
            contentContainerStyle={{paddingBottom: 200}}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{...styles.text}}>No Entry Found</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyTagsScreen;

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
    flex: 1,
  },
  text: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  rowcenterbetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
