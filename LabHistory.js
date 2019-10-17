import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Alert,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    AsyncStorage
} from 'react-native';
const GLOBAL = require('./Global');
const window = Dimensions.get('window');
import Button from 'react-native-button';
import { TextField } from 'react-native-material-textfield';
type Props = {};

let customDatesStyles = [];

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class LabHistory extends Component {
    state = {
        name :'',
        email:'',
        phone :'',
        company :'',
        loading:false,
        visible:false,
        FlatListItems: [
            {"key": "#1",
                "name": "Appointment with Dr.priya Dua(PT)",
                "address": "Dermatologist, Skin ethics Skin Clinc & Dermatosurgery Center",
                "Backchodi": "Branch famous hai inka",
                "imageUrl": "http://venushospital.in/wp-content/uploads/2019/07/noopurchhasatiya-236x300.png",
                "time": "26 Aug 2019, 8:00 AM",
            },
            {"key": "#2",
                "name": "Appointment with Dr.Rinki Mehta(PT)",
                "address": "Dermatologist, Skin ethics Skin Clinic & Dermatosurgery Center",
                "Backchodi": "Branch famous hai inka",
                "imageUrl": "http://venushospital.in/wp-content/uploads/2019/08/Gulfisha_Ahmed-229x300.png",
                "time": "26 Aug 2019, 8:00 AM",
            },
            {"key": "#3",
                "name": "Appointment with Dr.Payal Khatri(PT)",
                "address": "Dermatologist, Skin ethics Skin Clinc & Dermatosurgery Center",
                "Backchodi": "Branch famous hai inka",
                "imageUrl": "https://letsgetsciencey.com/wp-content/uploads/2019/03/wright_jane.jpg",
                "time": "26 Aug 2019, 8:00 AM",
            },
            {"key": "#4",
                "name": "Appointment with Dr.Riyanshi(PT)",
                "address": "Dermatologist, Skin ethics Skin Clinc & Dermatosurgery Center",
                "Backchodi": "Branch famous hai inka",
                "imageUrl": "http://www.tessgerritsen.com/wp-content/files/Tess-Gerritsen.jpg",
                "time": "26 Aug 2019, 8:00 AM",
            },


        ]
    };


    static navigationOptions = ({ navigation }) => {
        return {
            //   header: () => null,
            title: 'LAB BOOKING',
            headerTitleStyle :{textAlign: 'center',alignSelf:'center',color :'black'},
            headerStyle:{
                backgroundColor:'white',
            },
            headerTintColor :'#0592CC',
            animations: {
                setRoot: {
                    waitForRender: false
                }
            }
        }
    }


    showLoading() {
        this.setState({loading: true})
    }


    hideLoading() {
        this.setState({loading: false})
    }


    showLoading() {
        this.setState({loading: true})
    }
    componentDidMount() {


        const url = GLOBAL.BASE_URL + 'patient_lab_history'

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({
                "user_id": GLOBAL.user_id,


            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                alert(JSON.stringify(responseJson))


                if (responseJson.status == true) {
                    this.setState({results: responseJson.list})


                } else {
                    this.setState({results: []})
                }
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });
    }
    selectedFirst = (item) => {
     GLOBAL.labdetail = item
        this.props.navigation.navigate('LabHistoryDetail')

    }

    renderItem=({item}) => {
        return(
            <TouchableOpacity onPress={() => this.selectedFirst(item)
            }>
            <View style={{backgroundColor:'white',color :'white',flexDirection:'column' , flex: 1 ,marginTop:15,marginLeft:15,marginRight:15, height: 'auto',borderRadius :6,width : Dimensions.get('window').width-30, shadowColor: '#D3D3D3',
                shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.6,shadowRadius: 2}}>










                        <View style={{flexDirection: 'column', marginTop:15,marginLeft:5}}>
                            <Text style={{color:'green', fontSize:14,fontFamily:'Poppins-Medium',marginTop:8}}>{item.booking_status}</Text>
                            <View style = {{flexDirection:'row'}}>
                                <Text style={{color:'grey', fontSize:14,fontFamily:'Poppins-Regular',marginTop:2,width:window.width - 100}}>Booking Id :</Text>
                                <Text style={{color:'black', fontSize:14,fontFamily:'Poppins-Regular',marginTop:2}}> {item.booking_id}</Text>
                            </View>
                            {item.lab_assign_id !="0" && (
                                <View style = {{flexDirection:'row',width:'100%'}}>
                                    <Text style={{color:'grey', fontSize:14,fontFamily:'Poppins-Regular',marginTop:2,width:'70%'}}>Assign Lab :</Text>
                                    <Text style={{color:'black', fontSize:14,fontFamily:'Poppins-Regular',marginTop:2,alignSelf:'flex-end'}}> {item.lab_name}</Text>
                                </View>
                            )}

                            <Text style={{color:'green', fontSize:14,fontFamily:'Poppins-Medium',marginTop:8}}>{item.order_amount}</Text>



                            </View>

                        </View>



</TouchableOpacity>









        );
    }

    _keyExtractor=(item, index)=>item.key;



    render() {


        let { phone } = this.state;
        let { email } = this.state;
        let { name } = this.state;
        let { company } = this.state;
        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator style = {styles.loading}

                                       size="large" color='#006FA5' />
                </View>
            )
        }
        return (
            <View style={{width : Dimensions.get('window').width,flex:1,backgroundColor:'#F2F5F7'}}>
                <FlatList
                    data={this.state.results}

                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    container: {

        backgroundColor :'#f1f1f1',
        height: window.height,
    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },

})