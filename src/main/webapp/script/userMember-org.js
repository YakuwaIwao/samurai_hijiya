// --------------------------------------------
// 関数関連
// --------------------------------------------

// 一覧を更新する処理
let refreshList = function () {
    // let registUserList = sessionStorage.getItem('userData');

    // webapiでデータ取得
    $.ajax({
        url: './api/User/List',
        type: 'get',
        dataType: 'json'
    }).done(function(data) {
        if (data.status == 'success') {
        	let registUserList = data.resultData;

        	let layoutJsonArray = [{
        		width: 50
        	},
        	{
        		width: 100
        	},
        	{
        		width: 100
        	},
        	{
        		width: 200
        	}
        	]
        	;

            if (registUserList != null ) {
                $('#register').empty();
                // テーブルのヘッダを作成
                $('#register').append(
                    $('<ul>').addClass('nav').append(
                        $('<li>').text('選択')
                    ).append(
                        $('<li>').text('アカウントID')
                    ).append(
                        $('<li>').text('パスワード')
                    ).append(
                        $('<li>').text('更新日時')
                    )
                );
                //let jsonList = JSON.parse(registUserList);
                $.each(registUserList, function () {
                    let user = this;
                    $('#register').append(
                        //$('<ul>').addClass('nav').append(
                        $('<ul>').addClass('nav').addClass('user-list').append(
                            $('<li>').append($('<input>').attr({
                                'type': 'checkbox',
                                'value': user.userId
                            }))
                        ).append(
                            $('<li>').text(user.userId)
                        ).append(
                            $('<li>').text(user.password)
                        ).append(
                            $('<li>').text(user.sys_date)
                        )
                    );
                });

                // 列幅の調整
                $.each(layoutJsonArray, function(index) {
                	let layout = this;
                	 /*ul.nav > li:nth-child(1){
                		    width: 50px;
                	    }*/
                	let liIndex = index + 1;
                	$('ul.nav > li:nth-child(' + liIndex + ')').css('width', layout.width);
                });

                $('ul').on('click', function () {
                    $(this).toggleClass('selected');
                });

            }

        }
    }).fail(function() {
        alert('error');
    });

};

// 編集（追加、修正）
let editFunc = function () {

    let required = function (id) {
        let val = $('#' + id).val();
        return val.trim() != '';
    };

    // 必須チェック
    // 引数は文字列で指定すること。
    let requiredUser = function (id) {
        if (required(id) == false) {
            console.log($('#' + id).closest('.user-tr').find('label').text() + '未入力です');
            let targetName = $('#' + id).closest('.user-tr').find('.user-exp label').text();
            $('#' + id).closest('.user-tr').find('.user-message label').text(targetName + '未入力です');
            $('#' + id).closest('.user-tr').find('.user-message label').css('color', 'red');
            return false;
        }
        return true;
    }

    // 長さチェック
    // 引数は文字列で指定すること。
    let validateSize = function (strId, maxlen) {
        let val = $('#' + strId).val();
        if (val.trim().length > maxlen) {
            let targetName = $('#' + strId).closest('.user-tr').find('.user-exp label').text();
            var $label = $('#' + strId).closest('.user-tr').find('.user-message label');
            $label.text(targetName + '長さが超えています。');
            $label.css('color', 'red');
        }
    };

    // 長さの範囲
    let validateRangeSize = function (strId, min, max) {
        let val = $('#' + strId).val();
        if (val.trim().length < min || val.trim().length > max) {
            let $userTr = $('#' + strId).closest('.user-tr');
            let targetName = $userTr.find('.user-exp label').text();
            var $label = $userTr.find('.user-message label');
            $label.text(targetName + ' ' + min + '以上、' + max + '以下の範囲で入力してください。');
            $label.css('color', 'red');
        }
    };

    // 半角英数のみ
    let validateAlphabetic = function (strId) {
        let val = $('#' + strId).val();
        if (checkCharType(val, 'alphanumeric') == false) {
            let $userTr = $('#' + strId).closest('.user-tr');
            let targetName = $userTr.find('.user-exp label').text();
            var $label = $userTr.find('.user-message label');
            $label.text(targetName + 'は半角英数字のみ入力可能です。');
            $label.css('color', 'red');
        }
    };

    // メッセージクリア
    $('.user-message label').text('');

    let validate = requiredUser('userId');
    if (validate == true) {
        validate = validateAlphabetic('userId');
    }
    requiredUser('password');

    // エラーが存在しないか確認
    if ($('.user-message label').text().trim().length > 0) {
        return false;
    }

    $('#input').hide();
    $('#confirm').show();
    $('#result').hide();

    var $result = $('#resultUserData');
    $result.empty();

    var addElements = $('<ul />')
        .append(
            $('<li />').text('ユーザーID：' + $('#userId').val())
        )
        .append(
            $('<li />').text('パスワード：' + $('#password').val())
        );

    $result.append(addElements);

};

// 確認処理(更新、追加処理)
// @update true:更新処理,false:追加処理
let confirmFunc = function (update) {

    let strUserData = sessionStorage.getItem('userData');
    let userArray = [];
    if (strUserData != null) {
        userArray = JSON.parse(strUserData);
    }

    let addData = {
        'userId': $('#userId').val(),
        'password': $('#password').val()
    };

    if (update == true) {
        // 更新処理
        let findIndex = -1;
        $.each(userArray, function (index) {
            let user = this;
            if (user.userId == addData.userId) {
                findIndex = index;
                return false;
            }
        });
        userArray[findIndex] = addData;

    } else {
        // 追加処理
        userArray.push(addData);

        // オブジェクトを文字列にして送信すること。
        let postData = JSON.stringify(addData);

        // ajax通信
        $.ajax({
            url: './api/User/Add',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: postData,
        }).done(function(data) {
            if (data.status == 'success') {
                $('#input').hide();
                $('#confirm').hide();
                $('#result').show();
            }
        }).fail(function() {
        	alert('error');
        });

    }

    sessionStorage.setItem('userData', JSON.stringify(userArray));

};

// 完了処理
let finishFunc = function () {
    refreshList();

    $('#input').show();
    $('#confirm').hide();
    $('#result').hide();

};

// ストレージから指定したユーザーの情報を取得
let getUser = function (userId) {
    let userList = sessionStorage.getItem('userData');
    if (userList == null) {
        userList = [];
    } else {
        userList = JSON.parse(userList);
    }
    let findIndex = -1;
    $.each(userList, function (index) {
        let user = this;
        if (user.userId == userId) {
            findIndex = index;
            return false;
        }
    });

    return findIndex >= 0 ? userList[findIndex] : { userId: '', password: '' };
};



