const md5 = require('md5')
const crypto = require('crypto')
const config = require('./config.json')
const { weixin } = config
const { buildXML } = require('./xml')
const unifiedorderParams = {
  appid: '', // 必选
  mch_id: '', // 必选
  device_info: '', // 非必选，终端设备号(门店号或收银设备ID)，注意：PC网页或公众号内支付请传"WEB"
  nonce_str: '', // 必选
  sign_type: 'HMAC-SHA256', //'MD5', // 非必选，签名类型，目前支持HMAC-SHA256和MD5，默认为MD5
  body: '收银台订单缴费', // 必选
  detail: '', // 非必选
  attach: '', // 非必选
  out_trade_no: '', // 必选
  fee_type: 'CNY', // 非必选，
  total_fee: 1, // 必选
  spbill_create_ip: '1.1.1.1', // 必选，
  time_start: '', // 非必选，
  time_expire: '', // 非必选，
  goods_tag: '', // 非必选，
  notify_url: 'http://www.abc.com', // 必选，
  trade_type: 'MWEB', // 必选，
  product_id: '', // 非必选，trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。
  limit_pay: 'no_credit', // 非必选，
  openid: '', // 非必选，trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。
  receipt: '', // 非必选，
  scene_info: '', // 必选，
}
const refundParams = {
  appid: '', // 必选
  mch_id: '', // 必选
  nonce_str: '', // 必选
  sign_type: 'HMAC-SHA256', //'MD5', // 非必选，签名类型，目前支持HMAC-SHA256和MD5，默认为MD5
  transaction_id: '',
  out_trade_no: '',
  out_refund_no: '',
  total_fee: '',
  refund_fee: '',
  refund_fee_type: '',
  refund_desc: '',
  refund_account: '',
  notify_url: '',
}

const orderqueryParams = {
  appid: '', // 必选
  mch_id: '', // 必选
  transaction_id: '',
  out_trade_no: '',
  nonce_str: '',
  sign: '',
  sign_type: 'MD5',
}
const getNonceStr = () => {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let nonce = ''
  for (let i = 0; i < 16; i++) {
    nonce += base.charAt(Math.floor(Math.random() * 32))
  }
  return nonce
}
const genSign = (data, sign_type = 'MD5', key = weixin.key) => {
  const _stringA = Object.keys(data)
    .sort()
    .reduce((acc, cur) => {
      return data[cur] ? acc + cur + '=' + data[cur] + '&' : acc
    }, '')
  const stringA = _stringA.substring(0, _stringA.length - 1)
  const stringSignTemp = stringA + '&key=' + key
  // console.log(stringA)
  // console.log(stringSignTemp)
  if (sign_type == 'MD5') {
    return md5(stringSignTemp).toUpperCase()
  } else {
    const hmac = crypto.createHmac('sha256', key)
    return hmac.update(stringSignTemp).digest('hex').toUpperCase()
  }
}

const mockUnifiedorderParams = ({ out_trade_no }) => {
  unifiedorderParams.appid = weixin.appid // 必选
  unifiedorderParams.mch_id = weixin.mch_id // 必选
  unifiedorderParams.nonce_str = getNonceStr()
  unifiedorderParams.out_trade_no = out_trade_no
  unifiedorderParams.scene_info = JSON.stringify({
    h5_info: {
      type: 'Wap', //场景类型
      wap_url: '', //WAP网站URL地址
      wap_name: '收银台', //WAP 网站名
    },
  })
  const strictParams = {}
  for (let k in unifiedorderParams) {
    if (unifiedorderParams[k]) {
      strictParams[k] = unifiedorderParams[k]
    }
  }
  strictParams.sign = genSign(strictParams, strictParams.sign_type)
  return buildXML(strictParams)
}

const mockOrderqueryParams = ({ out_trade_no, transaction_id }) => {
  orderqueryParams.appid = weixin.appid // 必选
  orderqueryParams.mch_id = weixin.mch_id // 必选
  orderqueryParams.nonce_str = getNonceStr()
  orderqueryParams.out_trade_no = out_trade_no
  orderqueryParams.transaction_id = transaction_id
  const strictParams = {}
  for (let k in orderqueryParams) {
    if (orderqueryParams[k]) {
      strictParams[k] = orderqueryParams[k]
    }
  }
  strictParams.sign = genSign(strictParams, strictParams.sign_type)
  return buildXML(strictParams)
}

const mockCloseorderParams = ({ out_trade_no }) => {
  orderqueryParams.appid = weixin.appid // 必选
  orderqueryParams.mch_id = weixin.mch_id // 必选
  orderqueryParams.nonce_str = getNonceStr()
  orderqueryParams.out_trade_no = out_trade_no
  const strictParams = {}
  for (let k in orderqueryParams) {
    if (orderqueryParams[k]) {
      strictParams[k] = orderqueryParams[k]
    }
  }
  strictParams.sign = genSign(strictParams, strictParams.sign_type)
  return buildXML(strictParams)
}

const mockRefundParams = ({ out_trade_no, transaction_id }) => {
  refundParams.appid = weixin.appid // 必选
  refundParams.mch_id = weixin.mch_id // 必选
  refundParams.nonce_str = getNonceStr()
  refundParams.out_trade_no = out_trade_no
  refundParams.transaction_id = transaction_id
  refundParams.out_refund_no = Date.now()
  refundParams.total_fee = 1
  refundParams.refund_fee = 1
  const strictParams = {}
  for (let k in refundParams) {
    if (refundParams[k]) {
      strictParams[k] = refundParams[k]
    }
  }
  strictParams.sign = genSign(strictParams, strictParams.sign_type)
  return buildXML(strictParams)
}
module.exports = { mockUnifiedorderParams, mockOrderqueryParams, mockCloseorderParams, mockRefundParams }
