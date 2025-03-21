import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {COLORS} from '../config/constants';
import CustomTextInput from '../components/CustomTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Divider, Menu, TextInput} from 'react-native-paper';
import AppBar from '../components/AppBar';
import {transaction_history_api} from '../api';
import {showMessage} from 'react-native-flash-message';

const HistoryScreen = ({navigation}) => {
  const {userEntryList} = useSelector(state => state.app);
  const dispatch = useDispatch();

  const [sortBy, setSortBy] = useState('');
  const [transactionType, setTransactionType] = useState('');

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [visible, setVisible] = useState(false);

  const [list, setList] = useState([]);

  useEffect(() => {
    transactionHistoryApi();
  }, [sortBy, transactionType]);

  const closeMenu = () => setVisible(false);

  const transactionHistoryApi = async () => {
    let prevPage = 1;
    let response = await transaction_history_api({
      transaction_type: transactionType || '',
      a_to_z: sortBy == 'a_to_z' ? 1 : '',
      z_to_a: sortBy == 'z_to_a' ? 1 : '',
      latest_first: sortBy == 'latest_first' ? 1 : '',
      oldest_first: sortBy == 'oldest_first' ? 1 : '',
      page: prevPage,
    });

    if (response?.status == 1) {
      page == 1 && setTotalPages(response?.data?.total_pages);
      page > 1 && setPage(prevPage);
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

  const loadMore = async () => {
    if (loadingMore) return;

    // console.log(page, totalPages);

    if (page < totalPages) {
      console.log('Loading page: ' + (page + 1) + ' of ' + totalPages);
      setLoadingMore(true);

      let res = await transaction_history_api({
        page: page + 1,
        transaction_type: transactionType || '',
        a_to_z: sortBy == 'a_to_z' ? 1 : '',
        z_to_a: sortBy == 'z_to_a' ? 1 : '',
        latest_first: sortBy == 'latest_first' ? 1 : '',
        oldest_first: sortBy == 'oldest_first' ? 1 : '',
      });

      if (res) {
        if (res?.status == 1) {
          setList(prev => [...prev, ...res?.data?.list]);
          setPage(prev => prev + 1);
        }
      }
      setLoadingMore(false);
    }
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
            {item?.transaction_type == 'credit' ? (
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
              {item?.contact_person?.name}
            </Text>
          </View>
          {/* <Pressable style={{padding: 5}} onPress={() => deleteEntry(item)}>
            <FontAwesome5 name="trash-alt" size={18} color={COLORS.SECONDARY} />
          </Pressable> */}
        </View>
        {/* <View style={{...styles.container, marginTop: 5}}>
          <FontAwesome5 name="file-invoice" size={18} color={COLORS.DARKGREY} />
          <Text style={{...styles.text, marginLeft: 8}}>
            {item?.desc.join(', ')}
          </Text>
        </View> */}
        <View
          style={{
            ...styles.container,
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <View style={{...styles.container}}>
            <Text style={{...styles.text2}}>
              {item?.transaction_type == 'credit' ? '+' : '-'} {item?.amount} #
              {item?.tags?.map(tag => tag?.title)?.join(', #')}
            </Text>
          </View>

          {/* <View style={{...styles.container}}>
            <FontAwesome5
              name="calendar-alt"
              size={18}
              color={COLORS.DARKGREY}
            />
            <Text style={{...styles.text, marginLeft: 5}}>
              {moment(item?.updated_at).format('DD-MM-YYYY') || ''}
            </Text>
          </View> */}
        </View>
      </Pressable>
    );
  });

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

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

  const sortingDate = type => {
    let newData = [...list];
    newData.sort(function (a, b) {
      var c = new Date(a.date);
      var d = new Date(b.date);
      return c - d;
    });

    if (type == 'oldest') setList(newData);
    else if (type == 'latest') setList(newData.reverse());
    closeMenu();
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <AppBar navigation={navigation} title={'History'} />

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
              <Pressable
                onPress={() => setVisible(true)}
                style={{...styles.filterButton}}>
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
                setSortBy('latest_first');
                setVisible(false);
              }}
              title="Latest First"
              titleStyle={{
                color:
                  sortBy == 'latest_first' ? COLORS.SECONDARY : COLORS.TEXT,
              }}
            />
            <Menu.Item
              onPress={() => {
                setSortBy('oldest_first');
                setVisible(false);
              }}
              titleStyle={{
                color:
                  sortBy == 'oldest_first' ? COLORS.SECONDARY : COLORS.TEXT,
              }}
              title="Oldest First"
            />
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
          <View style={{...styles.rowcenter}}>
            <Pressable
              onPress={() => {
                setTransactionType('');
              }}
              style={{
                ...styles.historyTypeContainer,
                borderBottomWidth: transactionType == '' ? 1 : 0,
              }}>
              <Text
                style={{
                  ...styles.text,
                  color:
                    transactionType == '' ? COLORS.PRIMARY : COLORS.DARKGREY,
                }}>
                All
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTransactionType('debit');
              }}
              style={{
                ...styles.historyTypeContainer,
                borderBottomWidth: transactionType == 'debit' ? 1 : 0,
              }}>
              <Text
                style={{
                  ...styles.text,
                  color:
                    transactionType == 'debit'
                      ? COLORS.PRIMARY
                      : COLORS.DARKGREY,
                }}>
                Debit
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTransactionType('credit');
              }}
              style={{
                ...styles.historyTypeContainer,
                borderBottomWidth: transactionType == 'credit' ? 1 : 0,
              }}>
              <Text
                style={{
                  ...styles.text,
                  color:
                    transactionType == 'credit'
                      ? COLORS.PRIMARY
                      : COLORS.DARKGREY,
                }}>
                Credit
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
              onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                  loadMore();
                }
              }}
              ListFooterComponent={() => {
                return loadingMore ? (
                  <ActivityIndicator
                    size={30}
                    animating
                    style={{marginVertical: 16}}
                  />
                ) : null;
              }}
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
  text2: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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
