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
import AppBar from '../components/AppBar';
import {contact_person_list_api, transaction_add_update_api} from '../api';

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
  const [selectionStart, setSelectionStart] = useState(0);

  const dispatch = useDispatch();

  const [addDate, setAddDate] = useState(
    route?.params?.data?.updated_at
      ? new Date(route?.params?.data?.updated_at)
      : new Date(),
  );
  const [openDateModal, setOpenDateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [personListVisible, setPersonListVisible] = useState(false);

  const [personList, setPersonList] = useState([]);

  const [personSelected, setPersonSelected] = useState(null);

  // console.log(route?.params?.data);

  const [personName, setPersonName] = useState('');
  const [personDesc, setPersonDesc] = useState([]);
  const [personAmount, setPersonAmount] = useState('');
  const [personAmountType, setPersonAmountType] = useState('');
  const [personId, setPersonId] = useState(
    route?.params?.data?.contact_person_id || '',
  );
  const [userId, setUserId] = useState(route?.params?.data?.id || '');
  const [inputText, setInputText] = useState(
    route?.params?.data?.transaction_string
      ? route?.params?.data?.transaction_string
      : '',
  );

  useEffect(() => {
    if (personId) {
      const matchedPerson = personList?.find(person => person.id == personId);
      console.log('m', matchedPerson);
      if (matchedPerson?.name != personName && personName != "") {
        console.log('ma')
        setPersonId(''); // Assign ID if name exists
      } 
    }
  }, [personId]);

  useEffect(() => {
    async function fetchData() {
      await contact_person_list();
    }
    fetchData();
  }, [personName]);

  useEffect(() => {
    let name = '';
    let description = '';
    let amount = '';
    let amountType = '';
    let isCursorInPersonListRange = false;

    const indexOfAt = inputText.indexOf('@');
    const indexOfHash = inputText.indexOf('#');
    const indexOfPlus = inputText.indexOf('+');
    const indexOfMinus = inputText.indexOf('-');

    if (indexOfAt > -1) {
      const nextIdentifierIndex = IDENTIFIERS.map(id =>
        inputText.indexOf(id, indexOfAt + 1),
      )
        .filter(index => index > -1)
        .sort((a, b) => a - b)[0];

      name = nextIdentifierIndex
        ? inputText.slice(indexOfAt + 1, nextIdentifierIndex)
        : inputText.slice(indexOfAt + 1);

      setPersonName(name?.trim());

      // Check if cursor is within @ and the next identifier
      if (
        selectionStart > indexOfAt &&
        (nextIdentifierIndex ? selectionStart < nextIdentifierIndex : true)
      ) {
        isCursorInPersonListRange = true;
      }

      contact_person_list();
    }

    if (indexOfHash > -1) {
      let hashCountIndex = [];
      let descData = [];

      for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === '#') {
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

        descData.push(`${description.trim()}`);

        // Check if cursor is within # and next identifier
        if (
          selectionStart > hashCountIndex[i] &&
          (nextIdentifierIndex ? selectionStart < nextIdentifierIndex : true)
        ) {
          isCursorInPersonListRange = false;
        }
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

    // Set visibility based on cursor position
    setPersonListVisible(isCursorInPersonListRange);
  }, [inputText, personSelected, selectionStart]);

  const contact_person_list = async () => {
    let response = await contact_person_list_api({
      name: personName,
    });
    if (response?.status == 1) {
      setPersonList(response?.data?.list);
    } else {
      response?.error &&
        showMessage({
          message: response?.error,
          type: 'danger',
          icon: 'danger',
        });
    }
  };

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
    let transaction_tag_list = [...(route?.params?.data?.tags || [])];

    let transactionTag = [];

    for (let i = 0; i < personDesc?.length; i++) {
      let tag = transaction_tag_list?.find(
        item => item?.title == personDesc[i],
      );
      if (tag) {
        transactionTag.push({
          id: tag?.id,
          title: personDesc[i],
        });
      } else {
        transactionTag.push({
          id: '',
          title: personDesc[i],
        });
      }
    }

    let newEntry = {
      id: userId,
      person_id: personId,
      name: personName,
      transaction_tag: transactionTag,
      amount: personAmount,
      transactionType: personAmountType,
      transactionDate: moment(addDate).format('DD/MM/YYYY'),
      transaction_string: inputText,
    };

    console.log(newEntry);

    setIsLoading(true);

    let response = await transaction_add_update_api({
      ...newEntry,
    });

    console.log(response);

    if (response?.status == 1) {
      // if (personName == '') {
      //   showMessage({
      //     message: 'Add Person Name',
      //     type: 'danger',
      //     icon: 'danger',
      //   });
      // } else if (personDesc == '') {
      //   showMessage({
      //     message: 'Add Description',
      //     type: 'danger',
      //     icon: 'danger',
      //   });
      // } else if (personAmount == '') {
      //   showMessage({
      //     message: 'Add Amount',
      //     type: 'danger',
      //     icon: 'danger',
      //   });
      // } else {

      setInputText('');

      // let entryList = [...(userEntryList || [])];
      // if (route?.params?.data) {
      //   let dataindex = entryList.indexOf(route?.params?.data);
      //   entryList[dataindex] = newEntry;

      //   await AsyncStorage.setItem('userEntryList', JSON.stringify(entryList));
      //   dispatch(setUserEntryList(entryList));
      // } else {
      //   entryList?.push(newEntry);
      //   await AsyncStorage.setItem('userEntryList', JSON.stringify(entryList));
      //   dispatch(setUserEntryList(entryList));
      // }
      navigation.navigate('Drawer');
      showMessage({
        message: 'Entry Added Successfully',
        type: 'success',
        icon: 'success',
      });

      setPersonName('');
      setPersonDesc([]);
      setPersonAmount('');
      setPersonAmountType('');
      // }
    } else {
      response?.error &&
        showMessage({
          message: response?.error,
          type: 'danger',
          icon: 'danger',
        });
    }
  };

  const onPersonSelect = async(value) => {
    console.log('Selected Item ID:', value?.id);

    // Ensure personId is updated on first click
    setPersonId(value?.id);

    const indexOfAt = inputText.indexOf('@');
    if (indexOfAt === -1) return; // No "@" found, do nothing

    // Find the nearest identifier (#, +, -, etc.)
    let nextIdentifierIndex = inputText.length; // Default to end of text
    IDENTIFIERS.forEach(id => {
      const idx = inputText.indexOf(id, indexOfAt + 1);
      if (idx > -1 && idx < nextIdentifierIndex) {
        nextIdentifierIndex = idx;
      }
    });

    // Construct the updated inputText
    const updatedText =
      nextIdentifierIndex !== inputText.length
        ? inputText.slice(0, indexOfAt + 1) +
          value?.name +
          ' ' +
          inputText.slice(nextIdentifierIndex) // Replace within range
        : inputText.slice(0, indexOfAt + 1) + value?.name + ' '; // No identifier found, add space

    setInputText(updatedText);


    // Close the list immediately
    setPersonListVisible(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <AppBar
        navigation={navigation}
        title={route?.params?.data?.contact_person?.name || 'Add New Entry'}
      />

      {/* <Pressable
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
      </Pressable> */}

      <View style={{...styles.container}}>
        <Text style={{...styles.title}}>Name: {personName}</Text>
        <Text style={{...styles.title, marginTop: 5}}>
          Desc: {personDesc ? personDesc?.join(', ') : ''}
        </Text>
        <Text style={{...styles.title, marginTop: 5}}>
          Amount: {personAmountType} {personAmount}
        </Text>
        {/* <Text style={{...styles.title, marginTop: 5}}>
          Date: {addDate ? moment(addDate).format('DD/MM/YYYY') : ''}
        </Text> */}
      </View>


      <View
        style={{
          left: 0,
          right: 0,
          marginHorizontal: 15,
          bottom: 15,
          position: 'absolute',
        }}>
        {personList?.length ? (
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
                  onPress={() => onPersonSelect(item)}>
                  <Text style={{...styles.title}}>{item?.name}</Text>
                </Pressable>
              );
            }}
          />
        </View>
        ) : null}
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
          placeholder="Eg: @Name #cake #taxi +400"
          multiline={true}
          value={inputText || ''}
          onChangeText={text => handleInputChnage(text)}
          right={<TextInput.Icon icon={'send'} onPress={onAddEntry} />}
          contentStyle={{paddingTop: 10}}
          onSelectionChange={event =>
            setSelectionStart(event.nativeEvent.selection.start)
          }
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
