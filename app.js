var http = require('http');
var request = require('request');
var fs = require('fs');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var url = 'http://www.17k.com/list/2563815.html';
var mulu = [];
var dataArray = [];
var count = 0;


//请求数据
function dataRequest(dataUrl, headerId, callback) {
    request({
        url: dataUrl,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36',
            'headerid': headerId
        },
    }, function (err, res, body) {
        if (err) {
            console.log('错误', err);
            return;
        }
        callback(res, body)
    })
}



//获取目录
function start() {
    dataRequest(url, 0, function (res, bcakData) {
        var $ = cheerio.load(bcakData);
        $('.Volume').find('dd').find('a').each(function () {
            var href = 'http://www.17k.com/' + $(this).attr('href');
            mulu.push(href)
        });
        for (var i = 0; i < mulu.length; i++) {
            headerid = mulu[i];
            dataRequest(mulu[i], i, function (res, conentData) {
                var arry = res.req._headers.headerid * 1
                console.log('响应', arry);
                getContent(conentData, arry);
                count++;
                if (count === mulu.length) {
                    var result = dataArray.join()
                    console.log('end.............');
                    writeToLoacal(result)
                }
            })
        }
    })
}


//写入本地文件
function writeToLoacal(data) {
    fs.writeFile('data.txt', data, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("数据写入成功！");
    });
}

//获取内容
function getContent(conentData, arry) {
    var $ = cheerio.load(conentData);
    $('.qrcode').remove();
    var content = $('.p').text();
    dataArray[arry] = content;
}



start();





