const Router = require('express').Router()
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const https = require('https')
const { parseString } = require('xml2js')
const { parseXML } = require('../services/xml')
const { request } = require('../util/request')
const { mockUnifiedorderParams, mockOrderqueryParams, mockCloseorderParams, mockRefundParams } = require('../services/weixin')
const config = require('../services/config.json')
// 统一下单
Router.post('/unifiedorder', async (req, res, next) => {
  try {
    const out_trade_no = Date.now()
    const result = await request({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      method: 'post',
      data: mockUnifiedorderParams({ out_trade_no }),
    })
    const data = await parseXML(result.data)
    return res.json({ ...data, out_trade_no })
  } catch (err) {
    return res.send(err.message)
  }
})
// 查询订单
Router.post('/orderquery', async (req, res, next) => {
  try {
    const result = await request({
      url: 'https://api.mch.weixin.qq.com/pay/orderquery',
      method: 'post',
      data: mockOrderqueryParams({
        // transaction_id: 'wx191106259887189eeb54682de8542b0000',
        out_trade_no: '1666149877603',
      }),
    })
    const data = await parseXML(result.data)
    const { return_code, return_msg, result_code, err_code, err_code_des } = data
    // trade_state
    // SUCCESS--支付成功
    // REFUND--转入退款
    // NOTPAY--未支付
    // CLOSED--已关闭
    // REVOKED--已撤销(刷卡支付)
    // USERPAYING--用户支付中
    // PAYERROR--支付失败(其他原因，如银行返回失败)
    // ACCEPT--已接收，等待扣款
    if (return_code == 'SUCCESS') {
      return res.json(data)
    } else {
      return res.json(wxResult)
    }
  } catch (err) {
    return res.send(err.message)
  }
})
// 关闭订单
Router.post('/closeorder', async (req, res, next) => {
  try {
    const result = await request({
      url: 'https://api.mch.weixin.qq.com/pay/closeorder',
      method: 'post',
      data: mockCloseorderParams({
        out_trade_no: '1666149877603',
      }),
    })
    const data = await parseXML(result.data)
    const { return_code, return_msg, result_code, err_code, err_code_des } = data
    if (return_code == 'SUCCESS') {
      return res.json(data)
    } else {
      return res.send(return_msg)
    }
  } catch (err) {
    return res.send(err.message)
  }
})
// 退款
Router.post('/refund', async (req, res, next) => {
  try {
    const result = await request({
      url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
      method: 'post',
      data: mockRefundParams({
        out_trade_no: '1666149877603',
      }),
      httpsAgent: new https.Agent({ pfx: fs.readFileSync(path.join(__dirname, '../services/apiclient_cert.p12')), passphrase: config.weixin.mch_id }),
    })
    const data = await parseXML(result.data)
    const { return_code, return_msg, result_code, err_code, err_code_des } = data
    if (return_code == 'SUCCESS') {
      return res.json(data)
    } else {
      return res.send(return_msg)
    }
  } catch (err) {
    return res.send(err.message)
  }
})

module.exports = Router
