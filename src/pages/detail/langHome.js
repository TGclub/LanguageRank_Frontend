import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider, AtRate, AtButton, AtBadge } from "taro-ui";
import LineChart from "../../components/echarts/LineChart";
import langInfo from "../../mock/langInfo.json";
import "./langDetail.scss";

import javaLogo from "../../assets/img/language/java.png";
import aliLogo from "../../assets/img/company/alibaba.png";
import share from "../../assets/icon/share.png";
import saveimg from "../../assets/icon/saveimg.png";
import { connect } from "@tarojs/redux";
import { ajaxGetLangHome } from "../../actions/rankList";
@connect(
  ({ rankList }) => ({
    rankList
  }),
  dispatch => ({
    ajaxGetLangHome(langName) {
      dispatch(ajaxGetLangHome(langName));
    }
  })
)
export default class LangHome extends Component {
  constructor() {
    super();
    this.state = {
      langInfo,
      langName: ""
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const { langName } = this.$router.params;
    this.props.ajaxGetLangHome(langName);
    this.setState({
      langName
    });
    // const chartData = {
    //   dimensions: {
    //     data: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    //   },
    //   measures: [
    //     {
    //       data: [10, 52, 200, 334, 390]
    //       // data: this.props.rankList.langHome.exponentOfLastSevenDays
    //     }
    //   ]
    // };
    // this.lineChart.refresh(chartData);
  }
  refLineChart = node => (this.lineChart = node);
  navigateToDetail(name) {
    Taro.navigateTo({
      url: "/pages/detail/langDetail?langName=" + encodeURI(name)
    });
  }
  componentWillReceiveProps(nextprops) {
    console.log("nextprops", nextprops);
    const chartData = {
      dimensions: {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri"]
      },
      measures: [
        {
          // data: [10, 52, 200, 334, 390]
          data: nextprops.rankList.langHome.exponentOfLastSevenDays
        }
      ]
    };
    this.lineChart.refresh(chartData);
  }
  render() {
    const { langName } = this.state;
    const { langHome } = this.props.rankList;
    const detailInfo = this.state.langInfo[langName];
    console.log("langHome", langHome);
    console.log("this.props", this.props);

    return (
      <View>
        <View className="wrap-content">
          <View className="lang-title">
            <View className="icon">
              <Image src={javaLogo} className="logo" />
            </View>
            <View className="name">
              <View>
                {langName}&nbsp;&nbsp;&nbsp;
                <AtBadge value="HOT" className="badge" />
              </View>
              <View>
                <AtRate value={detailInfo.complexity} />
              </View>
            </View>
            <View className="state">
              <View>{langHome.joinedNumber}人</View>
              <View>已加入学习计划</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View class="wrap-content">
          <View className="wrap-title">数据概况</View>
          <View className="data-info">
            <View className="tend-wrap">
              <View className="tend-num">{langHome.fixedFinalExponent}</View>
              <View className="tend-title">猿指数</View>
            </View>
            <View className="tend-wrap">
              <View className="tend-num">
                {langHome.fixedFinalExponentIncreasing}
              </View>
              <View className="tend-title">成长指数</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">指数趋势</View>
          <View className="tend-graph">
            <View className="line-chart">
              <LineChart ref={this.refLineChart} />
            </View>
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">热门公司</View>
          <View className="heat-company">
            <View className="icon">
              <Image src={aliLogo} className="logo" />
            </View>
            <View className="name">阿里巴巴</View>
            <View className="detail">
              <View>热招岗位：xxx个</View>
              <View>最高月薪：xxx元</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">语言简史</View>
          <View className="history">{detailInfo.history.join("\n")}</View>
        </View>
        <View className="wrap-content">
          <AtButton
            type="primary"
            className="to-detail"
            onClick={this.navigateToDetail.bind(this, langName)}>
            更多语言信息
          </AtButton>
        </View>
        <View className="footer-wrap">
          <View className="fix-footer">
            <View className="add-plan">加入学习计划</View>
            <View className="share">
              <Image src={share} className="img" />
              <View className="share-title">分享</View>
            </View>
            <View className="ge-img">
              <Image src={saveimg} className="img" />
              <View className="save-title">生成图片</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}