import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./attention.scss";
const codeImg =
  "http://qiniu.ben286.top/HelloWorld%20Rank%E6%B6%88%E6%81%AF%E5%8A%A9%E6%89%8B%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.jpg";
export default class Attention extends Component {
  config = {
    navigationBarTitleText: "关注公众号"
  };
  showImage = () => {
    Taro.previewImage({
      urls: [codeImg],
      current: codeImg
    });
  };
  copyContent = () => {
    Taro.setClipboardData({
      data: "HelloWorld Rank"
    })
      .then(() => {
        Taro.showToast({
          title: "已成功复制公众号名称,快去关注吧",
          icon: "none"
        });
      })
      .catch(() => {
        Taro.showToast({
          title: "复制失败"
        });
      });
  };
  render() {
    return (
      <View className="attention">
        <Image src={codeImg} className="sub-img" onClick={this.showImage} />
        <View className="text-bottom" onClick={this.copyContent}>
          点击预览图片，长按扫描二维码，\n或搜索公众号：HelloWorld Rank
          \n(点击即可复制)\n
          关注公众号，\n了解编程语言最新热点资讯，\n掌握雇主最新动态。
        </View>
      </View>
    );
  }
}
