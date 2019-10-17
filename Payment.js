import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Alert,

    TouchableOpacity,
    TextInput,
    Image,
    ImageBackground,
    Linking,
    FlatList,
    Dimensions,



} from 'react-native';



const window = Dimensions.get('window')
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, {Component} from 'react';
import Button from 'react-native-button';
const GLOBAL = require('./Global');
import RazorpayCheckout from 'react-native-razorpay';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


class Payment extends React.Component{
    constructor(props){
        super(props);


        this.state = {
            promo :'',
            finalPrice:GLOBAL.price,
            calPrice:'0',
            value: 0,
            radio_props: [
                {label: 'Debit/Credit Card/Netbanking ', value:0},

            ]

        }

    }

    static navigationOptions = ({ navigation }) => {
        return {
            //   header: () => null,
            title: 'PAYMENT',
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

    verify = () => {

            const url =  GLOBAL.BASE_URL +'coupan_verify'

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    "module":GLOBAL.module,
                    "coupan_code":this.state.promo,





                }),
            }).then((response) => response.json())
                .then((responseJson) => {


                    if (responseJson.status == true) {

                      if (responseJson.discount_type == "percentage"){
                          var perce = responseJson.condition
                          var cal = GLOBAL.price - ((GLOBAL.price  * perce) /100)
                          var d =   (GLOBAL.price  * perce) /100
                          this.setState({finalPrice : cal})
                          this.setState({calPrice : d})

                      }else{
                          var perce = responseJson.condition
                          var cal = GLOBAL.price - perce
                          this.setState({calPrice : perce})
                          this.setState({finalPrice : cal})
                      }
                            GLOBAL.price = this.state.finalPrice

                    }else{
                        this.setState({finalPrice : GLOBAL.price})

                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.hideLoading()
                });
            //   this._handlePressLogin()

    }


    capture = (a,s) =>{
//https://rzp_test_26ccbdbfe0e84b:69b2e24411e384f91213f22a@api.razorpay.com/v1/payments/pay_29QQoUBi66xm2f/capture
        alert(a)
        var commonHtml = `https://rzp_test_CDbzQjcE3QD5L3:ipNPnUwhDwPkIjNfyngYOzju@api.razorpay.com/v1/payments/${a}/capture`;



        fetch(commonHtml, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: s.toString(),



            }),
        }).then((response) => response.json())
            .then((responseJson) => {
           this.props.navigation.navigate('Thankyou')

            })
            .catch((error) => {
                alert(error);
                this.hideLoading();
                alert('Unable to process your request Please try again after some time')

            });


    }

    rajorPay = (ss) =>{

        var b = parseInt(GLOBAL.price) * 100

        var options = {
            description: ss,
            image: require('./loginlogo.png'),
            currency: 'INR',
            key: 'rzp_test_CDbzQjcE3QD5L3',
            amount:b,

            name: GLOBAL.myname,
            prefill: {
                email: GLOBAL.myemail,
                contact: GLOBAL.mymobile,
                name: GLOBAL.myname
            },
            theme: {color: '#F37254'}
        }

        RazorpayCheckout.open(options).then((data) => {
            var a = data.razorpay_payment_id
            this.capture(a,b);



        }).catch((error) => {
            // handle failure
           // this.myPayments(s,error.description,'')

        });
        RazorpayCheckout.onExternalWalletSelection(data => {



        });
    }

    componentDidMount() {
       // this.rajorPay()
    }

    finalPay = () =>{



        if (GLOBAL.bookingtype == "package"){
            this.rajorPay(GLOBAL.mytypes)
        } else {


            if (GLOBAL.type == "1") {

                const url = GLOBAL.BASE_URL + 'add_temporary_booking'

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify({


                        "user_id": GLOBAL.user_id,
                        "for": "1",
                        "module": 'emergency',
                        "address": GLOBAL.selectedAddress.address,
                        "area": GLOBAL.selectedAddress.area,
                        "pincode": GLOBAL.selectedAddress.pincode,
                        "city_state": GLOBAL.selectedAddress.city_state,
                        "problem": '',
                        "coupan_code": this.state.promo,
                        "coupan_code_id": "s",
                        "total_amount": this.state.finalPrice,
                        "discount_amount": this.state.calPrice,
                        "trxn_mode": "ss"


                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {


                        if (responseJson.status == true) {
                            var commonHtml = `${GLOBAL.user_id}|emergency|${responseJson.id}`;

                            this.rajorPay(commonHtml)

                            //  this.props.navigation.navigate('Thankyou')

                        } else {


                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.hideLoading()
                    });

            } else if (GLOBAL.type == "2") {
                const url = GLOBAL.BASE_URL + 'add_temporary_booking'

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify({


                        "user_id": GLOBAL.user_id,
                        "for": "2",
                        "module": 'nurse',
                        "service_id": GLOBAL.serviceid,
                        "booking_time": GLOBAL.time,
                        "booking_date": GLOBAL.date,
                        "nurse_gender_prefer": GLOBAL.nurse,
                        "address": GLOBAL.selectedAddress.address,
                        "area": GLOBAL.selectedAddress.area,
                        "pincode": GLOBAL.selectedAddress.pincode,
                        "city_state": GLOBAL.selectedAddress.city_state,
                        "problem": '',
                        "coupan_code": this.state.promo,
                        "coupan_code_id": "s",
                        "total_amount": this.state.finalPrice,
                        "discount_amount": this.state.calPrice,
                        "trxn_mode": "ss"


                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {


                        if (responseJson.status == true) {
                            var commonHtml = `${GLOBAL.user_id}|nurse|${responseJson.id}`;

                            this.rajorPay(commonHtml)

                          //  this.rajorPay(responseJson.id)
                            //   this.props.navigation.navigate('Thankyou')

                        } else {


                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.hideLoading()
                    });

            } else if (GLOBAL.type == "13") {
                const url = GLOBAL.BASE_URL + 'add_temporary_booking'

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify({


                        "user_id": GLOBAL.user_id,
                        "for": "13",
                        "module": 'medical equipment',
                        "payment_from":"rajorpay",
                        "booking_date": GLOBAL.date,
                        "booking_type":GLOBAL.equipmentfor,
                        "address": GLOBAL.selectedAddress.address,
                        "area": GLOBAL.selectedAddress.area,
                        "pincode": GLOBAL.selectedAddress.pincode,
                        "city_state": GLOBAL.selectedAddress.city_state,
                        "name":GLOBAL.myname,
                        "email":GLOBAL.myemail,
                        "mobile":GLOBAL.mymobile,
                        "coupan_code": this.state.promo,
                        "coupan_code_id": "s",
                        "total_amount": this.state.finalPrice,
                        "discount_amount": this.state.calPrice,
                        "trxn_mode": "ss"


                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {


                        if (responseJson.status == true) {
                            var commonHtml = `${GLOBAL.user_id}|medical_equipment|${responseJson.id}`;

                            this.rajorPay(commonHtml)

                            //  this.rajorPay(responseJson.id)
                            //   this.props.navigation.navigate('Thankyou')

                        } else {


                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.hideLoading()
                    });

            }




            else if (GLOBAL.type == "8") {
                const url = GLOBAL.BASE_URL + 'add_temporary_booking'

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify({


                        "user_id": GLOBAL.user_id,
                        "for": "12",
                        "module": 'test',
                        "booking_time": GLOBAL.time,
                        "booking_date": GLOBAL.date,
                        "payment_from":"rajor_pay",
                        "address": GLOBAL.selectedAddress.address,
                        "area": GLOBAL.selectedAddress.area,
                        "pincode": GLOBAL.selectedAddress.pincode,
                        "city_state": GLOBAL.selectedAddress.city_state,
                        "coupan_code": this.state.promo,
                        "coupan_code_id": "s",
                        "order_amount": this.state.finalPrice,
                        "discount_amount": this.state.calPrice,



                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {


                        // alert(JSON.stringify(responseJson))

                        //  this.rajorPay()
                        if (responseJson.status == true) {
                            var commonHtml = `${GLOBAL.user_id}|lab_test|${responseJson.id}`;

                            this.rajorPay(commonHtml)



                            //   this.props.navigation.navigate('Thankyou')

                        } else {


                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.hideLoading()
                    });

            }


            else if (GLOBAL.type == "3") {
                const url = GLOBAL.BASE_URL + 'add_temporary_booking'

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify({


                        "user_id": GLOBAL.user_id,
                        "for": "3",
                        "module": 'medical_services',
                        "service_id": GLOBAL.serviceid,
                        "booking_time": GLOBAL.time,
                        "booking_date": GLOBAL.date,

                        "address": GLOBAL.selectedAddress.address,
                        "area": GLOBAL.selectedAddress.area,
                        "pincode": GLOBAL.selectedAddress.pincode,
                        "city_state": GLOBAL.selectedAddress.city_state,
                        "problem": '',
                        "coupan_code": this.state.promo,
                        "coupan_code_id": "s",
                        "total_amount": this.state.finalPrice,
                        "discount_amount": this.state.calPrice,
                        "trxn_mode": "ss"


                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {


                        // alert(JSON.stringify(responseJson))

                        //  this.rajorPay()
                        if (responseJson.status == true) {
                            var commonHtml = `${GLOBAL.user_id}|medical_services|${responseJson.id}`;

                            this.rajorPay(commonHtml)



                            //   this.props.navigation.navigate('Thankyou')

                        } else {


                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.hideLoading()
                    });

            }
            else if (GLOBAL.type == "5") {

                var memberid = "";

                if (GLOBAL.onlineMember.length == 0) {
                    memberid = "0";
                } else {
                    memberid = memberid + GLOBAL.onlineMember[i].id + ','

                }


                const url = GLOBAL.BASE_URL + 'add_temporary_booking'

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify({


                        "user_id": GLOBAL.user_id,
                        "for": "5",
                        "module": "offline",
                        "doctor_id": GLOBAL.appointmentArray.id,
                        "booking_for": "self",
                        "member_id": memberid,
                        "booking_time": GLOBAL.time,
                        "booking_date": GLOBAL.date,
                        "name": GLOBAL.onlinename,
                        "gender": GLOBAL.onlinegender,
                        "dob": GLOBAL.onlinedob,
                        "address": GLOBAL.onlineaddress,
                        "area": GLOBAL.onlinearea,
                        "pincode": GLOBAL.onlinecity,
                        "city_state": GLOBAL.onlinecity,
                        "coupan_code": this.state.promo,
                        "coupan_code_id": "s",
                        "total_amount": this.state.finalPrice,
                        "discount_amount": this.state.calPrice,
                        "trxn_mode": "ss",
                        "images": GLOBAL.listofimages,


                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {


                        // alert(JSON.stringify(responseJson))

                        //  this.rajorPay()
                        if (responseJson.status == true) {
                            var commonHtml = `${GLOBAL.user_id}|offline|${responseJson.id}`;

                            this.rajorPay(commonHtml)


                            //   this.props.navigation.navigate('Thankyou')

                        } else {


                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.hideLoading()
                    });

            }



            else if (GLOBAL.type == "4") {

                var memberid = "";

                if (GLOBAL.onlineMember.length == 0) {
                    memberid = "0";
                } else {
                    for (var i = 0 ; i <GLOBAL.onlineMember.length ; i ++) {
                        memberid = memberid + GLOBAL.onlineMember[i].id + ','
                    }

                }


                const url = GLOBAL.BASE_URL + 'add_temporary_booking'

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify({


                        "user_id": GLOBAL.user_id,
                        "for": "4",
                        "module": GLOBAL.onlinetype,
                        "doctor_id": GLOBAL.appointmentArray.id,
                        "booking_for": "self",
                        "member_id": memberid,
                        "booking_time": GLOBAL.time,
                        "booking_date": GLOBAL.date,
                        "name": GLOBAL.onlinename,
                        "gender": GLOBAL.onlinegender,
                        "dob": GLOBAL.onlinedob,
                        "address": GLOBAL.onlineaddress,
                        "area": GLOBAL.onlinearea,
                        "pincode": GLOBAL.onlinecity,
                        "city_state": GLOBAL.onlinecity,
                        "coupan_code": this.state.promo,
                        "coupan_code_id": "s",
                        "total_amount": this.state.finalPrice,
                        "discount_amount": this.state.calPrice,
                        "trxn_mode": "ss",
                        "images": GLOBAL.listofimages,


                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {


                        // alert(JSON.stringify(responseJson))

                        //  this.rajorPay()
                        if (responseJson.status == true) {
                            var commonHtml = `${GLOBAL.user_id}|online|${responseJson.id}`;

                            this.rajorPay(commonHtml)


                            //   this.props.navigation.navigate('Thankyou')

                        } else {


                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.hideLoading()
                    });

            } else {

                const url = GLOBAL.BASE_URL + 'add_temporary_booking'

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify({


                        "user_id": GLOBAL.user_id,
                        "for": "1",
                        "module": 'planned',
                        "booking_time": GLOBAL.time,
                        "booking_date": GLOBAL.date,
                        "address": GLOBAL.selectedAddress.address,
                        "area": GLOBAL.selectedAddress.area,
                        "pincode": GLOBAL.selectedAddress.pincode,
                        "city_state": GLOBAL.selectedAddress.city_state,
                        "problem": GLOBAL.problem,
                        "coupan_code": this.state.promo,
                        "coupan_code_id": "s",
                        "total_amount": this.state.finalPrice,
                        "discount_amount": this.state.calPrice,
                        "trxn_mode": "ss"


                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {




                        //  this.rajorPay()
                        if (responseJson.status == true) {
                         var commonHtml = `${GLOBAL.user_id}|planned|${responseJson.id}`;

                            this.rajorPay(commonHtml)
                            //    this.props.navigation.navigate('Thankyou')

                        } else {


                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.hideLoading()
                    });
            }
        }
    }

    render(){
        return(


            <KeyboardAwareScrollView keyboardShouldPersistTaps ='always'>
                <View style={{flex:1,flexDirection:'column',backgroundColor:'#F5F5F5',width:window.width}}>


                    <View style={{height:150,width:window.width,marginTop:17,backgroundColor:'white',flexDirection:'column'}}>
                        <Text style={{fontSize:17, color:'black',marginLeft:12,marginTop:10,fontFamily:'Poppins-Medium',fontWeight:'bold'}}>Payment Options</Text>
                        <View
                            style={{borderBottomColor: '#CCCCCC',borderBottomWidth: 1, marginTop:10}}>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column',marginLeft:15,marginTop:24}}>
                                <RadioForm
                                    radio_props={this.state.radio_props}
                                    initial={0}
                                    onPress={(value) => {this.setState({value:value})}}>
                                    <RadioButtonInput
                                        borderWidth={1}
                                        buttonInnerColor={'#0592CC'}
                                        buttonOuterColor={'#0592CC'}
                                        buttonWrapStyle={{marginLeft:5}}

                                    />
                                    <RadioButtonLabel

                                        labelStyle={{fontSize:14,fontFamily:'Poppins-Medium',color: '#2ecc71'}}

                                    />
                                </RadioForm>
                            </View>

                            <View style={{flexDirection:'column',marginLeft:32,marginTop:18}}>
                                <Image
                                    style={{height:40,width:40}}
                                    source={require('./cardlogo.png')}
                                />


                            </View>
                        </View>


                    </View>

                    <View style={{height:150,backgroundColor:'white',width:window.width,marginTop:17,flexDirection:'column'}}>

                        <View style={{flexDirection:'row',marginTop:10}}>
                            <Image
                                style={{height:30,width:30,marginLeft:12,marginTop:6}}
                                source={require('./discologo.jpg')}
                            />
                            <Text style={{fontSize:13,fontFamily:'Poppins-Regular',marginLeft:10,marginTop:10}}>Apply Promo/Referral Code</Text>
                        </View>


                        <TextInput style={{fontSize:16,height:50,width: window.width- 20,borderWidth:1,borderColor:'#e1e1e1',marginTop:20,alignSelf:'center',marginLeft:10}}
                                   placeholder="Enter Promo Code"
                                   placeholderTextColor="lightgrey"

                                   returnKeyType='go'
                                   onChangeText = {(text)=> this.setState({promo: text})}
                                   secureTextEntry={false}
                                   autoCorrect={false}
                        />
                    </View>


                    <Button
                        style={{padding:4,marginTop:5,fontSize: 20,color:'#0592CC',marginLeft:'5%',width:'90%',height:40,fontFamily:'Poppins-Medium',borderRadius:4}}
                        styleDisabled={{color: 'red'}}
                        onPress={() => this.verify()}>
                        VERIFY
                    </Button>

                    <View style={{height:140,width:window.width,marginTop:17,backgroundColor:'white',flexDirection:'column'}}>

                        <Text style={{fontSize:16, color:'black',marginLeft:12,marginTop:12,fontFamily:'Poppins-Medium',fontWeight:'bold'}}>Price Details</Text>
                        <View
                            style={{borderBottomColor: '#CCCCCC',borderBottomWidth: 1, marginTop:12}}>
                        </View>
                        <View style={{marginTop:12,flexDirection:'row',width:'100%'}}>
                            <Text style={{fontSize:15,color:'black',marginLeft:17,fontFamily:'Poppins-Medium',width:'70%'}}>Order Amount</Text>
                            <Text style={{fontSize:15,color:'black',fontFamily:'Poppins-Medium',alignSelf:'flex-end',marginRight:20}}>₹{GLOBAL.price }/-</Text>
                        </View>
                        <View
                            style={{borderBottomColor: '#CCCCCC',borderBottomWidth: 1, marginTop:12}}>
                        </View>
                        <View style={{marginTop:12,flexDirection:'row',width:'100%'}}>
                            <Text style={{fontSize:14,color:'black',marginLeft:17,fontFamily:'Poppins-Regular',width:'70%'}}>Sub-Total</Text>
                            <Text style={{fontSize:15,color:'black',fontFamily:'Poppins-Medium',alignSelf:'flex-end',marginRight:20}}>₹{this.state.calPrice }/-</Text>
                        </View>

                    </View>


                    <View style={{marginTop:12,flexDirection:'row',width:'100%',backgroundColor:'white',height:40}}>
                        <Text style={{fontSize:14,color:'black',marginLeft:17,fontFamily:'Poppins-Regular',width:'70%',marginTop:12}}>Amount Payable</Text>
                        <Text style={{fontSize:15,color:'black',fontFamily:'Poppins-Medium',alignSelf:'flex-end',marginRight:20,marginTop:12}}>₹{this.state.finalPrice }/-</Text>
                    </View>


                    <Button
                        style={{padding:4,marginTop:40,fontSize: 20, color: 'white',backgroundColor:'#0592CC',marginLeft:'5%',width:'90%',height:40,fontFamily:'Poppins-Medium',borderRadius:4}}
                        styleDisabled={{color: 'red'}}
                        onPress={() => this.finalPay()}>
                       SUBMIT
                    </Button>

                </View>
            </KeyboardAwareScrollView>


        );
    }
}

export default Payment;