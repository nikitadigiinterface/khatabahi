import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {Divider, FAB, Menu, TextInput} from 'react-native-paper';
import CustomTextInput from '../components/CustomTextInput';
import {home_api, transaction_history_api} from '../api';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const {userEntryList} = useSelector(state => state.app);
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);

  const [list, setList] = useState([]);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [sortBy, setSortBy] = useState('');
  const [transactionType, setTransactionType] = useState('');

  useEffect(() => {
    if (isFocused) homeApi();
  }, [isFocused]);

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

  const homeApi = async () => {
    let response = await home_api();

    if (response?.status == 1) {
      setData(response?.data);
    } else {
      response?.error &&
        showMessage({
          message: response?.error,
          type: 'danger',
          icon: 'danger',
        });
    }
  };

  useEffect(() => {
    if (isFocused) transactionHistoryApi();
  }, [sortBy, transactionType, isFocused]);

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
        key={index}
        onPress={() => navigation.navigate('AddEntry', {data: item})}
        style={{
          padding: 10,
          borderBottomColor: COLORS.LIGHTGREY,
          borderBottomWidth: list?.slice(0, 4)?.length == index + 1 ? 0 : 1,
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
        <View style={{...styles.container, marginTop: 5}}>
          <Text style={{...styles.text2, marginLeft: 5}}>
            {item?.transaction_type == 'credit' ? '+' : '-'} {item?.amount}{' '}
            {'  '} #{item?.tags?.map(tag => tag?.title)?.join(', #')}
          </Text>
        </View>
      </Pressable>
    );
  });

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const totalAmount = () => {
    let amount = '';
    if (data?.list?.total_receivable || data?.list?.total_payable) {
      // console.log(data?.list?.total_receivable , data?.list?.total_payable)
      if (
        Number(data?.list?.total_receivable) > Number(data?.list?.total_payable)
      ) {
        amount = `${'\u20B9'}${
          data?.list?.total_receivable - data?.list?.total_payable
        }`;
        return amount;
      } else {
        amount = `- ${'\u20B9'}${Math.abs(
          data?.list?.total_receivable - data?.list?.total_payable,
        )}`;
        return amount;
      }
    } else {
      amount = `${'\u20B9'}0`;
      return amount;
    }
  };


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
        <Text
          style={{
            fontSize: 20,
            color: COLORS.PRIMARY,
            textAlign: 'center',
            fontFamily: 'Inter-Bold',
            marginTop: 10,
          }}>
          {totalAmount()}
        </Text>
        <Text
          style={{
            ...styles.text,
            textAlign: 'center',
          }}>
          Total Amount In Hand
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 15,
          }}>
          <View
            style={{
              ...styles.card2,
              marginRight: 15,
            }}>
            <Image
              style={{height: 30, width: 30}}
              source={require('../assets/images/icons/upArrow.png')}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{...styles.text}}>Total Debit</Text>
              <Text style={{...styles.buttonText, flex: 1}}>
                {'\u20B9'}
                {data?.list?.total_receivable}
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.card2,
            }}>
            <Image
              style={{height: 30, width: 30}}
              source={require('../assets/images/icons/downArrow.png')}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{...styles.text}}>Total Credit</Text>
              <Text style={{...styles.buttonText, flex: 1}}>
                {'\u20B9'}
                {data?.list?.total_payable}
              </Text>
            </View>
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
            Recent Transactions
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
              data={list?.slice(0, 4)}
              contentContainerStyle={{}}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{...styles.text, marginVertical: 50}}>
                No Entry Found
              </Text>
            </View>
          )}
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate('AddEntry')}
        style={{position: 'absolute', margin: 10, right: 0, bottom: 0}}>
        <Image
          style={{
            height: 70,
            width: 70,
          }}
          source={require('../assets/images/icons/addIcon.png')}
        />
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
  card2: {
    backgroundColor: COLORS.WHITE,
    padding: 10,
    borderRadius: 10,
    // marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    flex: 1,
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
  buttonText: {
    color: COLORS.TEXT,
    fontSize: 14,
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
