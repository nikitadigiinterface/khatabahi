import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {setUserEntryList} from '../redux/reducer/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {COLORS} from '../config/constants';
import CustomTextInput from '../components/CustomTextInput';

const PEOPLE = [
  {
    name: 'Person 1',
  },
  {
    name: 'Person 2',
  },
  {
    name: 'Person 3',
  },
  {
    name: 'Person 4',
  },
  {
    name: 'Person 5',
  },
];

const IDENTIFIERS = ['+', '-', '#', '@'];

const AddEntryScreen = ({navigation, route}) => {
  const {userEntryList} = useSelector(state => state.app);

  const dispatch = useDispatch();

  const [addDate, setAddDate] = useState(
    route?.params?.data?.date
      ? new Date(route?.params?.data?.date)
      : new Date(),
  );
  const [openDateModal, setOpenDateModal] = useState(false);

  const [personListVisible, setPersonListVisible] = useState(false);

  const [personList, setPersonList] = useState(userEntryList);

  const [personSelected, setPersonSelected] = useState(null);

  const [personName, setPersonName] = useState('');
  const [personDesc, setPersonDesc] = useState('');
  const [personAmount, setPersonAmount] = useState('');
  const [personAmountType, setPersonAmountType] = useState('');
  const [inputText, setInputText] = useState(
    route?.params?.data?.name
      ? `@${route?.params?.data?.name} #${route?.params?.data?.desc.join(
          ', ',
        )} ${route?.params?.data?.amountType}${route?.params?.data?.amount}`
      : '',
  );

  useEffect(() => {
    let name = '';
    let description = '';
    let amount = '';
    let amountType = '';

    const indexOfAt = inputText.indexOf('@');
    const indexOfHash = inputText.indexOf('#');
    const indexOfPlus = inputText.indexOf('+');
    const indexOfMinus = inputText.indexOf('-');

    if (indexOfAt > -1) {
      setPersonListVisible(true);
      const nextIdentifierIndex = IDENTIFIERS.map(id =>
        inputText.indexOf(id, indexOfAt + 1),
      )
        .filter(index => index > -1)
        .sort((a, b) => a - b)[0];

      name = nextIdentifierIndex
        ? inputText.slice(indexOfAt + 1, nextIdentifierIndex)
        : inputText.slice(indexOfAt + 1);

      setPersonName(name.trim());
      if (name.trim().length > 0) {
        setPersonList(
          userEntryList.filter(item =>
            item.name.toLowerCase().includes(name.trim().toLowerCase()),
          ),
        );

    
        personList?.length > 0
          ? setPersonListVisible(true)
          : nextIdentifierIndex
          ? setPersonListVisible(false)
          : setPersonListVisible(false);
      } else {
        setPersonList(userEntryList);
      }
    }

    if (indexOfHash > -1) {
      let hashCountIndex = [];
      let descData = [];

      for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] == '#') {
          hashCountIndex.push(i);
        }
      }

      for (let i = 0; hashCountIndex.length > i; i++) {
        const nextIdentifierIndex = IDENTIFIERS.map(id =>
          inputText.indexOf(id, hashCountIndex[i] + 1),
        )
          .filter(index => index > -1)
          .sort((a, b) => a - b)[0];

        description = nextIdentifierIndex
          ? inputText.slice(hashCountIndex[i] + 1, nextIdentifierIndex)
          : inputText.slice(hashCountIndex[i] + 1);

        descData.push(description.trim());
      }
      setPersonDesc(descData);
    }

    const indexOfAmount = Math.min(
      indexOfPlus > -1 ? indexOfPlus : Infinity,
      indexOfMinus > -1 ? indexOfMinus : Infinity,
    );

    if (indexOfAmount > -1 && indexOfAmount !== Infinity) {
      const nextIdentifierIndex = IDENTIFIERS.map(id =>
        inputText.indexOf(id, indexOfAmount + 1),
      )
        .filter(index => index > -1)
        .sort((a, b) => a - b)[0];

      amount = nextIdentifierIndex
        ? inputText.slice(indexOfAmount + 1, nextIdentifierIndex)
        : inputText.slice(indexOfAmount + 1);

      amountType = inputText[indexOfAmount];

      setPersonAmount(amount.trim());
      setPersonAmountType(amountType);
    }
  }, [inputText, personSelected]);

  const handleInputChnage = text => {
    if (
      inputText.includes('@') &&
      (text.match(new RegExp('@', 'g')) || []).length > 1
    )
      return;

    // if (
    //   inputText.includes('#') &&
    //   (text.match(new RegExp('#', 'g')) || []).length > 1
    // )
    //   return;

    if (
      inputText.includes('+') &&
      (text.match(new RegExp('\\+', 'g')) || []).length > 1
    )
      return;

    if (
      inputText.includes('-') &&
      (text.match(new RegExp('-', 'g')) || []).length > 1
    )
      return;

    if (
      (inputText.includes('+') && text.includes('-')) ||
      (inputText.includes('-') && text.includes('+'))
    )
      return;

    setInputText(text);
  };

  const onAddEntry = async () => {
    Keyboard.dismiss();

    if (personName == '') {
      showMessage({
        message: 'Add Person Name',
        type: 'danger',
        icon: 'danger',
      });
    } else if (personDesc == '') {
      showMessage({
        message: 'Add Description',
        type: 'danger',
        icon: 'danger',
      });
    } else if (personAmount == '') {
      showMessage({
        message: 'Add Amount',
        type: 'danger',
        icon: 'danger',
      });
    } else {
      setInputText('');

      let newEntry = {
        name: personName,
        desc: personDesc,
        amount: personAmount,
        amountType: personAmountType,
        date: moment(addDate).format('YYYY-MM-DD'),
      };

      let entryList = [...(userEntryList || [])];
      if (route?.params?.data) {
        let dataindex = entryList.indexOf(route?.params?.data);
        entryList[dataindex] = newEntry;

        await AsyncStorage.setItem('userEntryList', JSON.stringify(entryList));
        dispatch(setUserEntryList(entryList));
      } else {
        entryList?.push(newEntry);
        await AsyncStorage.setItem('userEntryList', JSON.stringify(entryList));
        dispatch(setUserEntryList(entryList));
      }
      navigation.navigate('Drawer');
      showMessage({
        message: 'Entry Added Successfully',
        type: 'success',
        icon: 'success',
      });

      setPersonName('');
      setPersonDesc('');
      setPersonAmount('');
      setPersonAmountType('');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 15,
        }}>
        <Pressable onPress={()=> navigation.goBack()} style={{}}>
        <Image source={require('../assets/images/icons/backArrow.png')} />
        </Pressable>
       
        <Text
          style={{
            ...styles.title,
            fontSize: 18,
            marginLeft: 15
          }}>
          {route?.params?.data?.name || 'Add New Entry'}
        </Text>
      </View>

      <Pressable
        onPress={() => setOpenDateModal(true)}
        style={{
          padding: 12,
          margin: 3,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <FontAwesome5 name="plus" size={20} color={COLORS.PRIMARY} />
        <Text
          style={{
            ...styles.title,
            marginLeft: 10,
            fontSize: 16,
            color: COLORS.PRIMARY,
          }}>
          Add Date
        </Text>
      </Pressable>
      <View style={{...styles.container}}>
        <Text style={{...styles.title}}>Name: {personName}</Text>
        <Text style={{...styles.title, marginTop: 5}}>Desc: {personDesc}</Text>
        <Text style={{...styles.title, marginTop: 5}}>
          Amount: {personAmountType} {personAmount}
        </Text>
        <Text style={{...styles.title, marginTop: 5}}>
          Date: {addDate ? moment(addDate).format('DD/MM/YYYY') : ''}
        </Text>
      </View>

      <View
        style={{
          left: 0,
          right: 0,
          marginHorizontal: 15,
          bottom: 15,
          position: 'absolute',
        }}>
        <View
          style={{
            maxHeight: 200,
            width: '100%',
            backgroundColor: '#F1f1f1',
            display: personListVisible ? 'flex' : 'none',
            padding: 10,
            borderRadius: 15,
          }}>
          <FlatList
            data={personList}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  key={index}
                  style={{paddingVertical: 12, marginBottom: 2}}
                  onPress={() => {
                    setPersonSelected(item?.name);

                    setInputText(inputText.replace(personName, item?.name));
                    // setInputText('@'.concat(item.name + ' '))
                  }}>
                  <Text style={{...styles.title}}>{item?.name}</Text>
                </Pressable>
              );
            }}
          />
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => navigation.navigate('Home')}
            style={{padding: 5}}>
            <FontAwesome5 name="home" size={25} color={COLORS.PRIMARY} />
          </Pressable> */}
          <CustomTextInput
            // style={{width: '85%'}}
            dense={true}
            placeholder="Message...."
            multiline={true}
            value={inputText || ''}
            onChangeText={text => handleInputChnage(text)}
            right={<TextInput.Icon icon={'send'} onPress={onAddEntry} />}
            contentStyle={{paddingTop: 10}}
          />
        {/* </View> */}
      </View>

      <DatePicker
        modal
        mode="date"
        open={openDateModal}
        date={addDate}
        onConfirm={date => {
          setOpenDateModal(false);
          setAddDate(date);
        }}
        onCancel={() => {
          setOpenDateModal(false);
        }}
      />
    </View>
  );
};

export default AddEntryScreen;

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: COLORS.WHITE,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  container: {
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: '#DADADA',
    marginHorizontal: 15,
  },
});
