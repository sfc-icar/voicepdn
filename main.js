var flag_speech = 0;//認識確定状況フラグ
var flag_charaPlay = false;	//イベントモーション再生中フラグ
var rtnString;	//認識結果格納用


//ロード時に読み込み・イベントモーションを隠す
function charaHide(){
	document.getElementById("charaWave").style.display = "none";
	document.getElementById("charaGreet").style.display = "none";
	document.getElementById("charaSurprise").style.display = "none";
	voiceRec();	//音声認識メイン関数を実行
}
//音声認識メイン関数
function voiceRec() {
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    var recognition = new webkitSpeechRecognition();
    recognition.lang = 'ja';	//認識言語
    recognition.interimResults = true;	//暫定結果を返す
    recognition.continuous = true;	//継続的な結果を返す
	//音声認識エラー
    recognition.onerror = function() {
		//認識未確定中でなければ再実行
        if(flag_speech == 0){
            voiceRec();
        }
    };

			//音の検出が停止された場合
    recognition.onsoundend = function() {
		console.log("停止中");
    	voiceRec();
    };

			//認識結果が返った場合
    recognition.onresult = function(event) {
        var results = event.results;

		//認識候補をループ
        for (var i = event.resultIndex; i < results.length; i++) {

		//認識結果確定時
            if (results[i].isFinal) {
			    rtnString = results[i][0].transcript
                console.log("【"+rtnString+"】");//確定結果をコンソール表示

    			//イベントモーション再生中の場合500ミリ秒waitして再度認識
	    		if(flag_charaPlay == true){
		    		setTimeout("voiceRec()", 500);
						//キーワード分岐
		    	}else{
                    text_match();
                }
            }else{
                console.log("[認識中] " + results[i][0].transcript);//認識状況をコンソール表示
                flag_speech = 1;//認識中
            }
        }
    }
    flag_speech = 0;
    console.log("認識開始");
    //音声認識開始
    recognition.start();
}
//テキストマッチ関数
function text_match(){
    if(~rtnString.indexOf("手を振って")){
        var video_id="wave";
        var div_id="charaWave";
        play_movie(video_id,div_id);
    }else if(~rtnString.indexOf("お疲れ")){
        var video_id="greet";
        var div_id="charaGreet";
        play_movie(video_id,div_id);
    }else  if(~rtnString.indexOf("緒方")||~rtnString.indexOf("智絵里")||~rtnString.indexOf("結婚")){
        var video_id="surprise";
        var div_id="charaSurprise";
        play_movie(video_id,div_id);
    }
}
//ビデオ再生用関数
function play_movie(video_id,div_id){
    var wait=document.getElementById("wait");
    var movie_event=document.getElementById(video_id);
    movie_event.play();//イベントモーション再生開始
    flag_charaPlay = true;
    document.getElementById("charaWait").style.display = "none";//待機モーション消去
    document.getElementById(div_id).style.display = "block";//イベントモーション表示
    //イベントモーション再生終了時
    movie_event.addEventListener('ended', function(e){
        document.getElementById(div_id).style.display = "none";//イベントモーション消去
        wait.play();//待機モーション再生開始
        document.getElementById("charaWait").style.display = "block";//待機モーション表示
        flag_charaPlay = false;
        voiceRec();//音声認識開始
    }, false);
}
