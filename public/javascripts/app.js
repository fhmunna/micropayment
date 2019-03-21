$.getJSON('http://api.etherscan.io/api?module=contract&action=getabi&address=0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359', function (data) {
    var contractABI = "";
    contractABI = JSON.parse(data.result);
    if (contractABI !== ''){
        console.log(contractABI)
    } else {
        console.log("Error");
    }
});