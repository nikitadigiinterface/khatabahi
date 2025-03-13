import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {COLORS} from '../../config/constants';
import {ActivityIndicator, Divider, Menu, TextInput} from 'react-native-paper';
import CustomTextInput from '../../components/CustomTextInput';
import AppBar from '../../components/AppBar';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {transaction_tags_details_api} from '../../api';

const TagsChatScreen = ({navigation, route}) => {
  const {userEntryList} = useSelector(state => state.app);
  const dispatch = useDispatch();

  const [sortBy, setSortBy] = useState('');
  const [transactionType, setTransactionType] = useState('');

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [visible, setVisible] = useState(false);

  const [list, setList] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    transactionTagsDetailsApi();
  }, [sortBy, transactionType]);

  const closeMenu = () => setVisible(false);

  const transactionTagsDetailsApi = async () => {
    let prevPage = 1;
    let response = await transaction_tags_details_api({
      transaction_type: transactionType || '',
      a_to_z: sortBy == 'a_to_z' ? 1 : '',
      z_to_a: sortBy == 'z_to_a' ? 1 : '',
      latest_first: sortBy == 'latest_first' ? 1 : '',
      oldest_first: sortBy == 'oldest_first' ? 1 : '',
      page: prevPage,
      tag: route?.params?.tag?.title,
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

  // const loadMore = async () => {
  //   if (loadingMore) return;

  //   // console.log(page, totalPages);

  //   if (page < totalPages) {
  //     console.log('Loading page: ' + (page + 1) + ' of ' + totalPages);
  //     setLoadingMore(true);

  //     let res = await transaction_history_api({
  //       page: page + 1,
  //       transaction_type: transactionType || '',
  //       a_to_z: sortBy == 'a_to_z' ? 1 : '',
  //       z_to_a: sortBy == 'z_to_a' ? 1 : '',
  //       latest_first: sortBy == 'latest_first' ? 1 : '',
  //       oldest_first: sortBy == 'oldest_first' ? 1 : '',
  //     });

  //     if (res) {
  //       if (res?.status == 1) {
  //         setList(prev => [...prev, ...res?.data?.list]);
  //         setPage(prev => prev + 1);
  //       }
  //     }
  //     setLoadingMore(false);
  //   }
  // };

  const renderItem = useCallback(({item, index}) => {
    return (
      <Pressable
        key={index}
        // onPress={() => navigation.navigate('AddEntry', {data: item})}
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
        </View>

        <View
          style={{
            ...styles.container,
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <View style={{...styles.container}}>
            <Text style={{...styles.text2}}>
              {item?.transaction_type == 'credit' ? '+' : '-'} {item?.amount}{' '}
              {'  '} #
              {item?.transaction_tag
                ? JSON?.parse(item?.transaction_tag)
                    ?.map(tag => tag?.title)
                    ?.join(', #')
                : ''}
            </Text>
          </View>
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

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <AppBar navigation={navigation} title={`#${route?.params?.tag?.title}`} />

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
          {list?.length > 0 ? (
            <FlatList
              data={list}
              contentContainerStyle={{paddingBottom: 400}}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              // onScroll={({nativeEvent}) => {
              //   if (isCloseToBottom(nativeEvent)) {
              //     loadMore();
              //   }
              // }}
              // ListFooterComponent={() => {
              //   return loadingMore ? (
              //     <ActivityIndicator
              //       size={30}
              //       animating
              //       style={{marginVertical: 16}}
              //     />
              //   ) : null;
              // }}
            />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{...styles.text}}>No Entry Found</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default TagsChatScreen;

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
