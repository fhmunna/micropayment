var App = {
    bindEvents: function () {
        App.handleGetBalance();
    },

    handleGetBalance: function () {
        $('#btn_balance').on('click', function () {
            var sender = '0x18c8bA8eA6Ba89AA3e4a329CF752E71cBA061025';
            MicroRaiden.getBalance(sender, function (balance) {
                $('#txt_balance').text(balance);
            });
        });
    }
};

$(document).ready(function () {
    MicroRaiden.init(function () {
        App.bindEvents();
    });
});



