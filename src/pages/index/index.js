import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";

import { AtSegmentedControl, AtNoticebar } from "taro-ui";
import AuthRankList from "../rank/authRankList";
import DemandRankList from "../rank/demandRankList";
import Notice from "../../components/rank/notice";
import "./index.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserAllInfo(id) {
      return dispatch(ajaxGetUserAllInfo(id));
    }
  })
)
class Index extends Component {
  config = {
    navigationBarTitleText: "HelloWorld Rank"
  };
  constructor() {
    super();
    this.state = {
      current: 0,
      basicInfo: {},
      isViewedJoinMyApplet: false,
      isViewedStudyPlan: false
    };
  }
  componentWillMount() {}
  componentDidMount() {
    if (!Taro.getStorageSync("login")) {
      this.handleLogin();
    } else {
      if (Taro.getStorageSync("basicInfo")) {
        const loginInfo = Taro.getStorageSync("login");
        Taro.getSetting().then(res => {
          if (res.authSetting["scope.userInfo"]) {
            Taro.getUserInfo().then(userInfoRes => {
              console.log("userInfoRes", userInfoRes);
            });
          }
        });
        this.props.ajaxGetUserAllInfo(loginInfo.userid).then(res => {
          if (res.code === 0) {
            if (
              this.props.userInfo.allInfo.isViewedJoinMyApplet !=
              this.state.isViewedJoinMyApplet
            ) {
              console.log("11nextProps", this.props);
              this.setState({
                isViewedJoinMyApplet: this.props.userInfo.allInfo
                  .isViewedJoinMyApplet
              });
            }
            if (
              this.props.userInfo.allInfo.isViewedStudyPlan !=
              this.state.isViewedStudyPlan
            ) {
              console.log("22nextProps", this.props);
              this.setState({
                isViewedStudyPlan: this.props.userInfo.allInfo.isViewedStudyPlan
              });
            } else {
              this.setState({
                isViewedStudyPlan: false
              });
            }
          }
        });
      }
    }
  }
  // checkToPlan = () => {
  //   if (this.props) {
  //     const allInfo = this.props.userInfo.allInfo;
  //     Taro.setStorageSync("allInfo", {
  //       isViewedStudyPlan: allInfo.isViewedStudyPlan,
  //       joinedNumber: allInfo.joinedNumber,
  //       joinedToday: allInfo.joinedToday,
  //       myLanguage: allInfo.myLanguage,
  //       studyPlanDay: allInfo.studyPlanDay
  //     });
  //     if (allInfo.isViewedStudyPlan) {
  //       Taro.navigateTo({
  //         url: "/pages/amount/dailyPlan"
  //       });
  //     }
  //   }
  // };
  handleClick(value) {
    this.setState({
      current: value
    });
  }

  checkLogin = () => {
    if (Taro.getStorageSync("login")) {
      if (Taro.getStorageSync("basicInfo")) {
        this.setState({
          isLogin: true
        });
        const loginInfo = Taro.getStorageSync("login");
        const basicInfo = Taro.getStorageSync("basicInfo");
        this.props.ajaxGetUserAllInfo(loginInfo.userid);
        this.setState({
          basicInfo: basicInfo
        });
      } else {
      }
    } else {
      this.handleLogin();
    }
  };
  handleLogin = () => {
    Taro.login({
      success(res) {
        if (res.code) {
          Taro.request({
            url: "https://pgrk.wizzstudio.com/login",
            method: "POST",
            data: {
              code: res.code
            }
          }).then(res => {
            if (res.data.code === 0) {
              const data = res.data.data;
              Taro.setStorageSync("login", {
                userid: data.userId,
                openId: data.openId,
                session_key: data.session_key
              });
            }
          });
        }
      }
    });
  };
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleLogin = () => {
    Taro.login({
      success(res) {
        if (res.code) {
          Taro.request({
            url: "https://pgrk.wizzstudio.com/login",
            method: "POST",
            data: {
              code: res.code
            }
          }).then(res => {
            if (res.data.code === 0) {
              const data = res.data.data;
              Taro.setStorageSync("login", {
                userid: data.userId,
                openId: data.openId,
                session_key: data.session_key
              });
            }
          });
        }
      }
    });
  };
  onShareAppMessage = res => {
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: "/pages/index/index"
    };
  };
  // toPlan = () => {
  //   Taro.navigateTo({
  //     url: "/pages/amount/dailyPlan"
  //   });
  // };
  render() {
    const { isViewedJoinMyApplet, isViewedStudyPlan } = this.state;
    // isViewedStudyPlan ? this.toPlan() : "";
    return (
      <View className="top-bg">
        <View className="blank" />
        <View className="wrap">
          {isViewedJoinMyApplet && <Notice />}
          {/* <Notice /> */}
          <View className="tab-wrap">
            <AtSegmentedControl
              values={["语言热度榜", "雇主需求榜"]}
              onClick={this.handleClick.bind(this)}
              current={this.state.current}
              className="tab-seg"
            />
          </View>
          {this.state.current === 0 ? (
            <View className="tab-content">
              <AuthRankList isViewed={this.state.isViewedStudyPlan} />
            </View>
          ) : null}
          {this.state.current === 1 ? (
            <View className="tab-content">
              <DemandRankList />
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

export default Index;
