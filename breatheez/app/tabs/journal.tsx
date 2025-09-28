import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import axios from 'axios'

const REACT_NATIVE_BACKEND_URL = "http://localhost:5050/";

const Page = () => {

  type Entry = {
    id:string;
    asthmaAttack:string;
    symptoms:string;
    comments:string;
    date:string;
  }

  const [symptoms, setSymptoms] = useState("");
  const [comments, setComments] = useState("");
  const [asthmaAttack, setAsthmaAttack] = useState("");
  const [severity, setSeverity] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  {/* Handling new entries */}
  const handleSave = () => {
    // No empty entry (comments section can be empty)
    if (!asthmaAttack || !symptoms) {
      Alert.alert("Error", "Please log your symptoms and whether or not you had an asthma attack.");
      return;
    };
    
    const newEntry: Entry = {
      id: Date.now().toString(),
      asthmaAttack, 
      symptoms, 
      comments,
      date: new Date().toLocaleDateString(),};
    setEntries([...entries, newEntry]);

    // Resetting text fields & Removing modal from view
    setAsthmaAttack("");
    setSymptoms("");
    setComments("");
    setModalVisible(false);
  };

  return (

    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Past Journal Entries</Text>

      {/* Displaying all (past) entries in chronological order (most recent at top-most) */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.entryItem}>
            <Text style={styles.entryDate}>{item.date}</Text>
            <Text style={styles.entryText}>Asthma attack? {item.asthmaAttack}</Text>
            <Text style={styles.entryText}>Symptoms: {item.symptoms}</Text>
            <Text style={styles.entryText}>Additional comments: {item.comments}</Text>
          </View>
        )}
        />
      
      {/* + Icon to add a new entry */}
      <TouchableOpacity style={styles.add} onPress={() => setModalVisible(true)}>
        <Text style={styles.textAdd}>+</Text>
      </TouchableOpacity>

      {/* Adding an entry - Modal */}
      <Modal visible={modalVisible} animationType='slide'>
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Button to remove the entry from view (closes modal) / Entry not saved */}
          <View style={styles.closeButt}>
            <Button title='Close' onPress={() => setModalVisible(false)}/>
          </View>
          <Text style={styles.headerNew}>New Journal Entry</Text>

          {/* Box to specify if user had an asthma attack today */}
          <View style={styles.inputBox}>
            <TextInput 
              style={styles.textInput1}
              placeholder='Did you have an asthma attack today? (y/n)'
              value={asthmaAttack}
              onChangeText={setAsthmaAttack}
            />
          </View>

          {/* Box to specify user's symptoms */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput2}
              placeholder='List your symptoms: '
              value={symptoms}
              onChangeText={setSymptoms}
              multiline={true}
            />
          </View>

          {/* Box for user to write additional comments */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput3}
              placeholder='Comments: '
              value={comments}
              onChangeText={setComments}
              multiline={true}
            />
          </View>

          {/* Button to save the new entry */}
          <View style={styles.saveButt}>
           <Button title='Save' onPress={handleSave}/>
          </View>

        </View>
        </View>
      </Modal>
    </View>

  )

}

export default Page

const styles = StyleSheet.create({
    container:{
      flex:1,
      padding:20,
    },
    header: {
      textAlign:'center',
      fontSize:20,
      fontFamily: 'System',
      paddingBottom:15,
      fontWeight:'bold',
    },
    entryItem: {
      backgroundColor:
    },
    entryDate: {
      textAlign:'center',
      fontFamily: 'System',
      marginLeft:280,
    },
    entryText: {
      fontSize:16,
      fontFamily:'System'
    },
    headerNew: {
      padding:30,
      flex:1,
      textAlign:'center',
      alignSelf:'center',
      marginTop:0.5,
      fontFamily:'System',
      fontSize:20,
      fontWeight:'bold',
    },
    add: {
        position:'absolute',
        bottom:30,
        right:30,
        width:70,
        height:70,
        borderRadius:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#723FEB'
    },
    textAdd: {
      fontSize:50,
      fontFamily:'System',
      lineHeight:55,
    },
    modalContainer: {

    },
    modalContent: {

    },
    textInput1: {
      paddingHorizontal:10,
      borderWidth:1,
      width:'90%',
      padding:10,
      marginBottom:10,
      borderRadius:5,
      backgroundColor:'#eab9ff',
      marginLeft:20,
      fontSize:17,
      height:50,
    },
    textInput2: {
      paddingHorizontal:10,
      borderWidth:1,
      width:'90%',
      padding:10,
      marginBottom:10,
      borderRadius:5,
      backgroundColor:'#eab9ff',
      marginLeft:20,
      fontSize:17,
      height:80,
    },
    textInput3: {
      paddingHorizontal:10,
      paddingTop:10,
      borderWidth:1,
      width:'90%',
      marginBottom:10,
      borderRadius:5,
      backgroundColor:'#eab9ff',
      marginLeft:20,
      fontSize:17,
      height:110,
      textAlignVertical:'top'
    },
    inputBox: {
      borderRadius:20,
    },
    saveButt: {

    },
    closeButt: {
      marginTop:50,
      fontFamily:'System',
      fontSize:20,
      marginLeft:310,
    },
})