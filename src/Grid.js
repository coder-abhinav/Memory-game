import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, FlatList, View, Text, TouchableOpacity,ImageBackground } from "react-native";

const numColumns = 4;
const size = Dimensions.get('window').width / numColumns;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fill(newdata, alpha) {
    let random = getRandomInt(0, 15);
    if (newdata[random] == undefined) {
        newdata[random] = { id: alpha.toLowerCase(), value: alpha.toUpperCase(), show: true };
    }
    else {
        newdata = fill(newdata, alpha);
    }
    return newdata;
}

export default function () {
    const [data, setData] = useState([]);
    const [select, setSelect] = useState({ value: -1, index: -1 });
    const [success, setSucess] = useState(0);
    const [failed, setFailed] = useState(0);
    const [quit,setQuit] = useState(false);
    useEffect(() => {
        let newData = [];
        for (let i = 0; i < 8; i++) {
            let alpha = String.fromCharCode(i + 65);
            for (let j = 0; j < 2; j++) {
                newData = fill(newData, alpha);
            }
        }
        setData(newData);
        setTimeout(() => {
            let newd = [...newData];
            for (let i = 0; i < newd.length; i++) {
                newd[i].show = false;
            }
            setData(newd);
        }, 1500);
    }, []);

    const showGrid = (index) => {
        let newData = [...data];
        newData[index].show = true;
        setData(newData);
    }

    const hideGrid = (index) => {
        let newData = [...data];
        console.log(index, "index");
        newData[index].show = false;
        setData(newData);
    }

    const handleGridPress = (index, value) => {
        showGrid(index);
        if (select["value"] === -1 && select["index"] === -1) {
            setSelect({ ...select, value, index })
        }
        else if (select["value"] !== -1 && select["index"] !== -1) {
            if (select["value"] === value) {
                setSucess(success + 1);
            }
            else {
                setFailed(failed + 1);
                setTimeout(() => {
                    hideGrid(index);
                    hideGrid(select["index"]);
                }, 1000);
            }
            setSelect({ value: -1, index: -1 });
        }
    }

    return (
        <ImageBackground source={{uri:`https://cdn.pixabay.com/photo/2020/02/06/01/52/frame-4822807__340.png`}} resizeMode="cover" style={styles.image}>
        <View style={styles.container}>
          {success==8?
          <View style={styles.playCard}>
              <Text style={styles.Text}>{`You win in ${success} attempts \n Wanna Play Again???`}</Text>
              <TouchableOpacity onPress={()=>{setSucess(0),setFailed(0)}}>
                  <Text style={styles.Yes_Btn}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setQuit(true)}>
                  <Text style={styles.No_Btn}>No</Text>
              </TouchableOpacity>
              {quit?<Text style={styles.Text}>Hope to see you again</Text>:null}
              </View>
          : 
         
          <>
          <Text style={styles.Heading}>Welcome to Memory Game</Text>
      
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <TouchableOpacity  onPress={() => handleGridPress(index, item.value)}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.item}>{item.show == true ? item.value : ""}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                numColumns={numColumns} />
            <Text style={styles.scoreText}>Score: {success}</Text>
            <Text style={styles.failedText}>Failed: {failed}</Text>
            </>
                }
            </View>
            </ImageBackground>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        width: size/1.12,
        height: size,
    },
    item: {
        flex: 1,
        margin: 3,
        backgroundColor: '#428056',
        fontSize: 40,
        fontWeight: "bold",
        textAlign:"center",
        color:"#ffffff",
        borderRadius:1,
        borderColor:"#496653",
        borderWidth:5
    },
    Heading:{
        fontSize:22,
        fontWeight:"bold",
        color:"#ffffff",
        backgroundColor:"#415247",
        textAlign:"center",
        paddingVertical:5,
        borderRadius:10,
        marginBottom:20
    },
    container:{
        marginHorizontal:20,
        marginTop:50
    },
    image:{
        height:Dimensions.get('window').height,
        width:Dimensions.get('window').width
    },
    scoreText:{
        fontSize:16,
        fontWeight:"bold",
        backgroundColor:"#3b5745",
        color:"#ffffff",
        width:100,
        textAlign:"center",
        borderRadius:10,
        marginVertical:10,
        paddingVertical:5
    },
    failedText:{
        backgroundColor:"red",
        fontWeight:"bold",
        fontSize:16,
        color:"#ffffff",
        width:100,
        textAlign:"center",
        borderRadius:10,
        paddingVertical:5
    },
    playCard:{
        backgroundColor:"#428056",
        justifyContent:"center",
        paddingVertical:30,
        paddingHorizontal:10,
        borderRadius:10,
        marginTop:80,
        justifyContent:"center",
        alignItems:"center"
    },
    Yes_Btn:{
        color:"#ffffff",
        borderColor:"#ffffff",
        borderWidth:1,
        borderRadius:10,
        width:50,
        textAlign:"center",
        marginVertical:10
    },
    No_Btn:{
        color:"white",
        borderColor:"red",
        borderWidth:1,
        borderRadius:10,
        width:50,
        textAlign:"center",
        marginVertical:10
    },
    Text:{
        color:"white",
        fontSize:16,
        fontWeight:"bold",
        textAlign:"center"
    }
});