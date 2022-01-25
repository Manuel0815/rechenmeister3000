var min_num = 1, max_num = 10;
var operator_list = {
    "+": "+"
    , "-": "-"
    , "*": "*"
    , "/": "/"
    , "+ -": "+-"
    , "* /": "*/"
    , "+ - * /": "+-*/"
};
var small_mult_table = true, over_tens = false;
var static_n2 = '-';
var num1, num2;
var operator = "+";

// stopwatch
var seconds = 0; var minutes = 0; var hours = 0; var t;

var n_right = 0, n_wrong = 0;

var valid_settings = true;

var motivational_quotes = [
    'Du kannst schon super rechnen, weiter so!',
    'Schon wieder richtig! Du wirst immer besser!',
    'Gut gemacht!',
    'Super!',
    'Sehr gut!',
    'Weiter so!'
]

var alpaca_facts = [
    'Alpakas können summen.',
    '80% aller Alpakas leben in Peru.',
    'Alpakas sind Herdentiere.',
    'Es gibt Alpakas in mehr als 20 verschiedenen Farben.',
    'Weibliche Alpakas spucken Männchen an, wenn sie nicht an ihnen interessiert sind.',
    'Alpakas werden vor allem wegen ihrem Fell und ihrer Wolle gezüchtet.',
    'Alpakas sind Vegetarier.',
    'Alpakas werden bis zu 25 Jahre alt.',
    'Alpakas werden nicht gerne gestreichelt.',
    'Alpakas sind keine Lasttiere.'
]

$(document).ready(function () {
    var $el = $("#operators");
    $el.empty(); // remove old options
    $.each(operator_list, function (key, value) {
        $el.append($("<option></option>")
            .attr("value", value).text(key));
    });

    function generate_random_number(min, max, cur_op, n) {
        if ((n == 2 && !over_tens && '+-'.includes(cur_op)) || ('*/'.includes(cur_op) && small_mult_table))
            return Math.floor(Math.random() * (10 - 0 + 1) + 0); // between 0 and 10
        else
            return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function get_random_operator(operators) {
        return operators[[Math.floor(Math.random() * operators.length)]];
    }

    function set_min_num() {
        if (min_num != parseInt($('#minnum').val(), 10)) {
            min_num = parseInt($('#minnum').val(), 10);
            validate_settings();
        }
    }

    function set_max_num() {
        if (max_num != parseInt($('#maxnum').val(), 10)) {
            max_num = parseInt($('#maxnum').val(), 10);
            validate_settings();
        }
    }

    function validate_settings() {
        valid_settings = false;
        msg = "";
        if (min_num < -10000 || max_num > 10000) {
            msg = "Bitte einen Zahlenraum von -10.000 bis + 10.000 eingeben.";
        }
        else if (min_num >= max_num) {
            msg = "Die kleinste Zahl muss kleiner als die größere Zahl sein.";
        } else {
            valid_settings = true;
        }
        mark_settings(valid_settings, msg);
        generate_calculation();
    }

    function mark_settings(valid, msg) {
        if (valid) {
            $("#minnum").removeClass("wrong");
            $("#maxnum").removeClass("wrong");
            $("#alert-wrong-settings").fadeOut();
        } else {
            $("#minnum").addClass("wrong");
            $("#maxnum").addClass("wrong");
            $("#alert-wrong-settings").text(msg);
            $("#alert-wrong-settings").fadeIn();
        }
    }

    function invalid_calculation(num1, num2, cur_op, old_num1, old_num2) {
        var invalid = false;
        if (cur_op == '+' && (num1 + num2 > max_num || num1 + num2 < min_num || (!over_tens && Math.floor((num1 + num2) / 10) != Math.floor(num1 / 10)))) // addition
            invalid = true;
        else if (cur_op == "-" && (num1 - num2 < min_num || num1 - num2 > max_num || (!over_tens && Math.floor((num1 - num2) / 10) != Math.floor(num1 / 10)))) // subtraction
            invalid = true;
        else if (cur_op == "*" && (num1 * num2 > max_num || num1 * num2 < min_num || (small_mult_table && (num1 > 10 || num2 > 10)))) // multiplication
            invalid = true;
        else if (cur_op == "/" && (num1 / num2 < min_num || num1 / num2 > max_num || num1 < num2 || num1 % num2 != 0 || (small_mult_table && (num1 / num2 > 10 || num2 > 10)))) // division
            invalid = true;
        else if (old_num1 == num1 && old_num2 == num2 && static_n2 == '-')
            invalid = true;

        return invalid;
    }

    function generate_calculation() {
        if (valid_settings) {
            if (operator.length > 1)
                cur_op = get_random_operator(operator);
            else
                cur_op = operator;

            old_num1 = num1;
            old_num2 = num2;
            c = 0;
            do {
                if (c >= 5000000) {
                    valid_settings = false;
                    mark_settings(valid_settings, "Für diese Einstellungen können keine Rechnungen generiert werden.");
                    break;
                }
                num1 = generate_random_number(min_num, max_num, cur_op, 1);
                if ('*/'.includes(cur_op) && static_n2 != '-')
                    num2 = static_n2;
                else
                    num2 = generate_random_number(min_num, max_num, cur_op, 2);
                c++;
            } while (invalid_calculation(num1, num2, cur_op, old_num1, old_num2))
            if (valid_settings)
                write_calc(num1, num2, cur_op);
            else
                write_calc('...', '...', '+')
        }
    }

    function write_calc(num1, num2, cur_op) {
        calc = num1 + " " + cur_op + " " + num2 + " = ";
        $('#calculation').text(calc);
    }

    function update_n_right() {
        $('#status_right').text("Richtig: " + n_right);
    }

    function update_n_wrong() {
        $('#status_wrong').text("Falsch: " + n_wrong);
    }

    function reset_clock() {
        seconds = 0; minutes = 0; hours = 0;
        $('#clock').text("00:00:00");
    }

    function timer() {
        t = setTimeout(add, 1000);
    }

    function stop_clock() {
        clearTimeout(t);
    }

    function start_clock() {
        timer();
    }

    function add() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        $('#clock').text((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
        timer();
    }

    function wrong_result() {
        $("#result").addClass("wrong");
        $("#result").removeClass("correct");
        $("#alert-correct").fadeOut();
        $("#alert-wrong").fadeIn();
        n_wrong++;
        update_n_wrong();
    }

    function correct_result() {
        $("#result").removeClass("wrong");
        $("#result").addClass("correct");
        $("#alert-wrong").fadeOut();
        n_right++;
        if (n_right % 10 == 0) {
            $("#alert-correct").text(motivational_quotes[[Math.floor(Math.random() * motivational_quotes.length)]]);
            $("#alert-correct").fadeIn();
        } else
            $("#alert-correct").fadeOut();
        update_n_right();
        generate_calculation();
    }

    $("#gen").click(function () {
        generate_calculation();
    });

    $("#toggle-settings").click(function () {
        $("#settings").fadeToggle();
    });

    $('#result').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('#solve').click();
            return false;
        }
    });

    $('#minnum').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            set_min_num();
            return false;
        }
    });

    $('#maxnum').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            set_max_num();
            return false;
        }
    });

    $('#minnum').focusout(function (e) {
        set_min_num();
    });

    $('#maxnum').focusout(function (e) {
        set_max_num();
    });

    $('#small-mult-table').change(function () {
        small_mult_table = $('#small-mult-table').is(':checked');
        validate_settings();
    });

    $('#over-tens').change(function () {
        over_tens = $('#over-tens').is(':checked');
        validate_settings();
    });

    $("#solve").click(function () {
        var res = $('#result').val();
        var c = $('#calculation').text().replace(/\s/g, '').replace(/=/g, '').replace(/--/g, '+');
        if (res == eval(c)) {
            correct_result();
        } else {
            wrong_result();
        }
        $("#result").val('');
        $("#result").select();
    });

    $('#operators').change(function () {
        if ($(this).val().includes('*') || $(this).val().includes('/')) {
            $("#settings-mult").fadeIn();
        } else {
            $("#settings-mult").fadeOut();
        }
        operator = $(this).val();
        validate_settings();
    });
    $('#operators').change();

    $('#mult-series').change(function () {
        static_n2 = $(this).val();
        validate_settings();
    });

    $('#start').click(function (e) {
        start_clock();
    });

    $('#stop').click(function (e) {
        stop_clock();
    });

    $("#reset").click(function () {
        n_right = 0;
        n_wrong = 0;
        update_n_wrong();
        update_n_right();
        stop_clock();
        reset_clock();
    });

    $('#use-clock').change(function () {
        if ($('#use-clock').is(':checked')) {
            $("#stop-watch").fadeIn();
            $("#stop-watch-btn").fadeIn();
        } else {
            stop_clock();
            $("#stop-watch").fadeOut();
            $("#stop-watch-btn").fadeOut();
        }
    });

    $('#refresh').click(function (e) {
        generate_calculation();
    });

    function update_alpaca_fact() {
        $("#alpaca-fact").text(alpaca_facts[[Math.floor(Math.random() * alpaca_facts.length)]]);
    }

    generate_calculation();
    update_alpaca_fact();
});


function beimLaden(){
    Einheiten.Ausgabe(0,0);
    Einheiten.Ausgabe(1,1);
    Einheiten.Ausgabe(2,2);
    Einheiten.Ausgabe(3,3);
    Einheiten.Ausgabe(4,4);
    Einheiten.Ausgabe(5,5);
    Einheiten.Ausgabe(6,6);
    ARAusEin.los();
	 ARAusEin.Nr=["1","2","3","4","5","6","7"];
    Resultatanzeige.los("Einfache Gr&ouml;&szlig;en","", 1,"Gr&ouml;&szlig;en > Einfache Gr&ouml;&szlig;en umrechnen");
}

	var Einheiten={
			$id:function(id){
			return document.getElementById(id);
		},
		zZahl:function(von,bis,kommastellen){
			kommastellen=(typeof(kommastellen)=="undefined")?0:kommastellen;
			if(von>=1){
				var vonX = von;
				var bisY = bis-von;
				var minus = 0;
			}
			else{	
				var vonX = 1;
				var bisY = bis+Math.abs(von);
				var minus = Math.abs(von)+1;		
			}
		var Zahl  = (bis-von!=0)?(Math.random()*Math.pow(10,12)%bisY+vonX-minus).toFixed(kommastellen):von;
		return Zahl;
		},
		mischen:function(Arr){
			var MischObj=Arr;
			var tmp, rand;
			 for(var i =0; i < MischObj.length; i++){
			   var zufall = Math.floor(Math.random() * MischObj.length);
		   	tmp = MischObj[zufall]; 
		   	MischObj.splice(zufall,1);
		   	MischObj.push(tmp);
			 }
			 return MischObj;
		},
		Einh:{
			0:{
				0:"EinhLaenge", //id
				1:["mm","cm","dm","m","km"], //Einheit
				2:[1,10,100,1000,1000000], //Umrechnung
				3:[],//LoesungG
				4:[]//LoesungK
			},
			1:{
				0:"EinhFlaeche",
				1:["mm&sup2;","cm&sup2;","dm&sup2;","m&sup2;","a","ha","km&sup2;"],
				2:[1,100,10000,1000000,100000000,10000000000,1000000000000],
				3:[],
				4:[]
			},
			2:{
				0:"EinhVolumen",
				1:["mm&sup3;","cm&sup3;","ml","dm&sup3;","l","m&sup3;","km&sup3;"],
				2:[1,1000,1000,1000000,1000000,1000000000,1000000000000000000],
				3:[],
				4:[]
			},
			3:{
				0:"EinhGewicht",
				1:["mg","g","kg","t"],
				2:[1,1000,1000000,1000000000],
				3:[],
				4:[]
			},
			4:{
				0:"EinhGeld",
				1:["ct","&euro;"],
				2:[1,100],
				3:[],
				4:[]
			},
			5:{
				0:"EinhZeit",
				1:["s","min","h","d"],
				2:[1,60,3600,86400],
				3:[],
				4:[]
			},
			6:{
				0:"EinhTempo",
				1:["m/s","km/h"],
				2:[3.6,1],
				3:[],
				4:[]
				}
		},
		Wahl:function(iID){
			var Wahl_Ist=[];
			var Inp=document.getElementById(iID).getElementsByTagName("input");
			var z=0;
			var Volumen_i=[0,1,3,5,6,2,4];
			for(var i=0;i<Inp.length;i++){
				if(Inp[i].checked == true){
					Wahl_Ist[z]=i;
					if (iID=="EinhVolumen") {
						Wahl_Ist[z]=Volumen_i[i];
					}
					z++;
				}
			}
			return Wahl_Ist;
		},
		Ausgabe:function(Ausg_von,Ausg_bis){
		this.Versuche[Ausg_von]=0;
		var NumAlphG=["a) ","b) ","c) ","d) ","e) "];
		var NumAlphK=["f) ","g) ","h) ","i) ","j) "];
		for(var j=Ausg_von;j<=Ausg_bis;j++){
				var RechnungG="<table border='0' cellspacing='0' cellpadding='4'></tbody>";
				var RechnungK="<table border='0' cellspacing='0' cellpadding='4'></tbody>";
				
				for(var i=0;i<5;i++){
					var Vorwahl1=this.mischen(this.Wahl(this.Einh[j][0]));
					var Vorwahl2=[Vorwahl1[0],Vorwahl1[1]];
					var Auswahl=Vorwahl2.sort();
					if(i==0){
						var AuswZahl=this.zZahl(1,10);
						if(j==6){
							AuswZahl=AuswZahl*36;
						}
					}	
					if(i==1){
						var AuswZahl=this.zZahl(11,50);
						if(j==6){
							AuswZahl=this.zZahl(11,20)*36;
						}
					}	
					if(i==2){
						var AuswZahl=this.zZahl(51,100);
						if(j==6){
							AuswZahl=this.zZahl(21,30)*36;
						}
					}	
					if(i==3){
						var AuswZahl=this.zZahl(101,1000);
						if(j==6){
							AuswZahl=this.zZahl(31,40)*36;
						}
					}	
					if(i==4){
						if(j==0){
							var AuswZahl=this.zZahl(1,10)/10;
						}	
						if(j==1){
							var AuswZahl=this.zZahl(1,99)/100;
						}	
						if(j==2){
							var AuswZahl=this.zZahl(1,99)/1000;
						}	
						if(j==3){
							var AuswZahl=this.zZahl(1,99)/1000;
						}	
						if(j==4){
							var AuswZahl=this.zZahl(1,99)/100;
						}
						if(j==5){
							var AuswZahl=this.zZahl(1,10)/10;
						}	
						if(j==6){
							var AuswZahl=this.zZahl(41,50)*36;
						}			
					}

					var ZahlEintrag2=AuswZahl*this.Einh[j][2][Auswahl[1]]/this.Einh[j][2][Auswahl[0]];
					if (Ausg_von!=2 && Ausg_bis!=2) {
							 ZahlEintrag2= ZahlEintrag2.toFixed(0);
					}	
					else {
						if (i<4) {
							ZahlEintrag2= ZahlEintrag2.toFixed(0);	
						}
						else {
							if (this.Einh[j][2][Auswahl[1]]!=this.Einh[j][2][Auswahl[0]]) {
								ZahlEintrag2= ZahlEintrag2.toFixed(0);	
							}
							else {
								ZahlEintrag2= ZahlEintrag2.toFixed(3);		
							}	
						}	
					}		 
					
					this.Einh[j][3][i]=ZahlEintrag2;
					RechnungG+="<tr><td>"+NumAlphG[i]+"</td>";
					RechnungG+="<td align='right'>"+AuswZahl.toString().replace(/\./,",")+" "+this.Einh[j][1][Auswahl[1]]+" = ";
					RechnungG+="<input id='EinhInpG"+j+"_"+i+"' style='width:2em;font-size:1em;text-align:center;' onkeyup='Einheiten.inpLaenge(this.id,this.value)'  /></td>";
					RechnungG+="<td>"+this.Einh[j][1][Auswahl[0]]+"</td></tr>";
				}
				
				RechnungG+="</tbody></table>";
				for(var i=0;i<5;i++){
					var Vorwahl1=this.mischen(this.Wahl(this.Einh[j][0]));
					var Vorwahl2=[Vorwahl1[0],Vorwahl1[1]];
					var Auswahl=Vorwahl2.sort();
					if(i==0){
						var AuswZahl=this.zZahl(1,10);
						if(j==1){
							AuswZahl=this.zZahl(1,100);
						}
						if(j==5){
							if(Auswahl[0]==0&&Auswahl[1]==3){
								var TeilerArr=[200,400];
									Teiler=TeilerArr[this.zZahl(0,1)];
								AuswZahl=86400/Teiler;
							}
							else{
								AuswZahl=this.zZahl(1,6)*36;	
							}	
						}
						if(j==6){
								AuswZahl=AuswZahl*5;
						}
					}	
					if(i==1){					
						var AuswZahl=this.zZahl(11,50);
						if(j==1){
							AuswZahl=this.zZahl(101,500);
						}
						if(j==5){
							if(Auswahl[0]==0&&Auswahl[1]==3){
								var TeilerArr=[50,80,100];
									Teiler=TeilerArr[this.zZahl(0,2)];
								AuswZahl=86400/Teiler;
							}
							else{
								AuswZahl=this.zZahl(7,13)*5;	
							}	
						}
						if(j==6){
							AuswZahl=this.zZahl(11,20)*5;
						}
					}	
					if(i==2){
						var AuswZahl=this.zZahl(51,100);
						if(j==1){
							AuswZahl=this.zZahl(501,1000);
						}
						if(j==5){
							if(Auswahl[0]==0&&Auswahl[1]==3){
								var TeilerArr=[10,20,40];
									Teiler=TeilerArr[this.zZahl(0,2)];
								AuswZahl=86400/Teiler;
							}
							else{
								AuswZahl=this.zZahl(1,6)*360;	
							}	
						}
						if(j==6){
							AuswZahl=this.zZahl(21,30)*5;
						}
					}	
					if(i==3){
						var AuswZahl=this.zZahl(101,1000);
						if(j==1){
							AuswZahl=this.zZahl(1001,10000);
						}
						if(j==5){
							if(Auswahl[0]==0&&Auswahl[1]==3){
								var TeilerArr=[1,2,4,5,8];
									Teiler=TeilerArr[this.zZahl(0,4)];
								AuswZahl=86400/Teiler;
							}
							else{
								AuswZahl=this.zZahl(7,13)*360;	
							}	
						}
						if(j==6){
							AuswZahl=this.zZahl(31,40)*5;
						}
					}	
					if(i==4){
						if(j==0){
							var AuswZahl=this.zZahl(1,10)/10;
						}	
						if(j==1){
							var AuswZahl=this.zZahl(1,10)/10;
						}	
						if(j==2){
							var AuswZahl=this.zZahl(1,10)/10;
						}	
						if(j==3){
							var AuswZahl=this.zZahl(1,10)/10;
						}	
						if(j==4){
							var AuswZahl=this.zZahl(1,10)/10;
						}
						if(j==5){
							if(Auswahl[0]==0&&Auswahl[1]==3){
								var TeilerArr=[1000,2000,4000];
									Teiler=TeilerArr[this.zZahl(0,2)];
								AuswZahl=86400/Teiler;
							}
							else{
								AuswZahl=this.zZahl(14,19)*360;	
							}	
						}	
						if(j==6){
							var AuswZahl=this.zZahl(41,50)*5;
						}			
					}
					
					var ZahlEintrag2=AuswZahl*this.Einh[j][2][Auswahl[0]]/this.Einh[j][2][Auswahl[1]];
					
					if(j<=4){
						var ZE2F=(this.Einh[j][2][Auswahl[1]]/this.Einh[j][2][Auswahl[0]]).toString().length;
							 	ZahlEintrag2= ZahlEintrag2.toFixed(ZE2F);
							 	ZahlEintrag2=ZahlEintrag2.replace(/\.0+$/,"");//.replace(/(\.\d+)000+\d+$/,"$1");
					}		 				
					this.Einh[j][4][i]=ZahlEintrag2;
					RechnungK+="<tr><td>"+NumAlphK[i]+"</td>";
					RechnungK+= "<td align='right'>"+AuswZahl.toString().replace(/\./,",")+" "+this.Einh[j][1][Auswahl[0]]+" = ";
					RechnungK+="<input id='EinhInpK"+j+"_"+i+"' style='width:2em;font-size:1em;text-align:center;' onkeyup='Einheiten.inpLaenge(this.id,this.value)' /></td>";
					RechnungK+="<td>"+this.Einh[j][1][Auswahl[1]]+"</td>";
				}
				RechnungK+="</tbody></table>";
				this.$id(this.Einh[j][0]+"G").innerHTML=RechnungG;
				this.$id(this.Einh[j][0]+"K").innerHTML=RechnungK;
			}	
			
			var WneuNR=["EinhLaengeGKrichtig","EinhFlaecheGKrichtig","EinhVolumenGKrichtig","EinhGewichtGKrichtig","EinhGeldGKrichtig", "EinhZeitGKrichtig","EinhTempoGKrichtig"];
			
			T_Wertung.neu(WneuNR[j-1]);
		},
		inpKlick:function(inpID,InpNr){
			var Kontr=this.Wahl(inpID).length;
			if(Kontr<2){
				this.$id(inpID).getElementsByTagName("input")[InpNr].checked=true;
				alert("Es m\u00fcssen mindestens 2 Einheiten markiert sein.")
				
			}
		},
		inpLaenge:function(inpL_id,inpL_Wert){
			if(inpL_Wert.length<=3){
				document.getElementById(inpL_id).style.width="2em";	
			}
			else{
				document.getElementById(inpL_id).style.width=(inpL_Wert.length*0.65)+"em";	
			}
			
		},
		Versuche:[0,0,0,0,0,0,0,0,0],
		Auswertung:function(AusWNR,AusWID1,AusWID2){
			var inpID=[];
			var Loes=[];
			for(var i=0;i<5;i++){
				inpID[i]="EinhInpG"+AusWNR+"_"+i;
				inpID[parseInt(i)+5]="EinhInpK"+AusWNR+"_"+i;
				Loes[i]=this.Einh[AusWNR][3][i];
				Loes[parseInt(i)+5]=this.Einh[AusWNR][4][i];	
			}	
			
			var RiFa=AusWID1.substring(0, AusWID1.length-1);
			
			if (this.Versuche[AusWNR] ==5) {
				var AuswInpa=this.$id(AusWID1).getElementsByTagName("input");
				var AuswInpb=this.$id(AusWID2).getElementsByTagName("input");
				for(var i=0;i<5;i++){
					var ZiffAnzA=this.Einh[AusWNR][3][i].length;
					var ZiffAnzB=this.Einh[AusWNR][4][i].length;
					
					if (ZiffAnzA==1) {
						AuswInpa[i].style.width="1.2em";	
					}
					else {
						AuswInpa[i].style.width=(this.Einh[AusWNR][3][i]).toString().replace(/\.0+$/,"").length*0.75+"em";			
					}
					
					if (ZiffAnzB==1) {
						AuswInpb[i].style.width="1.2em";	
					}
					else {
						AuswInpb[i].style.width=(this.Einh[AusWNR][4][i]).toString().replace(/\.0+$/,"").replace(/\./,",").replace(/(\d)0$/,"$1").length*0.75+"em";		
					}				
					
				
				}	
			}
			
			this.Versuche[AusWNR] ++;
			
			 T_Wertung.los(inpID,Loes,RiFa+"GKrichtig",RiFa+"GKfalsch");
		}	
	};
	

		
var AufgVergleich={
	$id:function(ID){
		return document.getElementById(ID);
	},
	Kennung:"0",
	sollIst:"0",
	AufgVergleichLos:0,
	los:function () {
		var Anhang=window.location.search.replace(/\s/g,"");
		var AnhangTeile=Anhang.split("&");
		var DiffIstSoll=0;
		
		for (var i=0;i<AnhangTeile.length;i++) {	
			if (AnhangTeile[i].toString().replace(/\?/,"").substr(0,6)=="gleich") {
				this.AufgVergleichLos=1;
				var HausaufgNr=AnhangTeile[i].replace(/.*\(/,"").replace(/\).*/,"").replace(/%20/g,"");
					HausaufgNr=HausaufgNr.split(",");	

					for (var n=0;n<HausaufgNr.length;n++) {
						if (parseInt(HausaufgNr[n])<10) {
							HausaufgNr[n]="0"+HausaufgNr[n];	
						}	
					}	
					var AufgabenNr=[];
					for (var j=0;j<Resultatanzeige.Buttonwerte.length;j++) {
						if (parseInt(Resultatanzeige.Buttonwerte[j][1])<10) {
							AufgabenNr[j]="0"+(Resultatanzeige.Buttonwerte[j][1].replace(/\s/g,""));
						}
						else {
							AufgabenNr[j]=Resultatanzeige.Buttonwerte[j][1].replace(/\s/g,"");
						}		
					}	
						
					if (AufgabenNr.length!=HausaufgNr.length) {
						DiffIstSoll=1	
					}	
					
					var vorhanden=0;
					if (AufgabenNr.length==HausaufgNr.length) {	 
						for (var k=0;k<HausaufgNr.length;k++) {
							var soll=HausaufgNr[k].toString().replace(/\s/g,"");
							
							for (var l=0;l<HausaufgNr.length;l++) {	
								var ist=AufgabenNr[l].toString().replace(/\s/g,"");
								if (soll==ist) {
									vorhanden++;	
								}	
							}		
						}
						
						if (vorhanden!=HausaufgNr.length) {
							DiffIstSoll=1;
						}	
					}
										
					HausaufgNr=HausaufgNr.sort();
					AufgabenNr=AufgabenNr.sort();
					
					for (var p=0;p<HausaufgNr.length;p++) {
						HausaufgNr[p]=	HausaufgNr[p].replace(/^0/,"");	
					}	
					for (var q=0;q<AufgabenNr.length;q++) {
						AufgabenNr[q]=	AufgabenNr[q].replace(/^0/,"");	
					}	
					
					HausaufgNr=HausaufgNr.join(", ");
					AufgabenNr=AufgabenNr.join(", ");
					
					if (AufgabenNr.length==0){
						AufgabenNr="keine";
					}
					
					if (DiffIstSoll==1) {
						if(this.$id("Codetabelle").style.display!="block"){
							if (this.Kennung==0) {
								alert("Erteilte und erledigte Aufgaben unterscheiden sich.\nEin falscher Wertungscode wird erzeugt.\nErteilte Aufgaben: "+HausaufgNr+"\nErledigte Aufgaben: "+AufgabenNr);
							}	
						}
						this.sollIst=0;		
					}
					else {
						this.sollIst=1;		
					}		
			}
			
		}
	}
}				

//Aufgabenrahmen markieren, ausw&auml;hlen, Hinweis und Kennung setzen.
var AufgRaMark={
	$id:function(ID){
		return document.getElementById(ID);
	},
	los:function () {
		Hinweis=0;
		var Anhang=window.location.search.replace(/\s/g,"");
		var AnhangTeile=Anhang.split("&");

		for (var i=0;i<AnhangTeile.length;i++) {
			
			if (AnhangTeile[i].toString().replace(/\?/,"").substr(0,8)=="sichtbar"){	
				var sichtbarNr=AnhangTeile[i].replace(/.*\(/,"").replace(/\).*/,"").replace(/%20/g,"");
					 sichtbarNr=sichtbarNr.split(",");
				var divTags=document.getElementsByTagName("div");
				var m=1;
				for (var j=0;j<divTags.length; j++) {
					if (divTags[j].className=="Aufgabenrahmen" || divTags[j].className=="AufgabenrahmenAus") {
						divTags[j].style.display="none";
						for (var k=0;k<sichtbarNr.length;k++) {
							if (sichtbarNr[k]==m) {	
								divTags[j].style.display="block";
							}
						}	
  					m++;
					}	 	
				}
				NavAnzeige.los();
			}
			
			if (AnhangTeile[i].toString().replace(/\?/,"").substr(0,7)=="Hinweis"){	
				var Hinweis=decodeURI(AnhangTeile[i].replace(/.*\(/,"").replace(/\)\s*$/,""));
				var HinwDiv = document.createElement("div");
				var Hinw = document.createTextNode(Hinweis);
				HinwDiv.appendChild(Hinw);
				HinwDiv.style.fontSize="20px";
				HinwDiv.style.color="red";
				HinwDiv.style.paddingTop="1.5em";
				HinwDiv.style.textAlign="center";
				document.getElementsByTagName("article")[0].insertBefore(HinwDiv,document.getElementsByTagName("article")[0].firstChild);
			}
			
			if (AnhangTeile[i].toString().replace(/\?/,"").substr(0,7)=="Kennung"){
				var Kennung=decodeURI(AnhangTeile[i].replace(/.*\(/,"").replace(/\)\s*$/,""));
				Resultatanzeige.Name=Kennung;
				Resultatanzeige.aufVorderseiteAnzeigen=1;
				this.$id("ResultatanzeigeVorn").style.display="block";
				AufgVergleich.Kennung=1;
				
				var Div=document.getElementsByTagName("div");
				for (var di=0;di<Div.length;di++) {
					var neuSpan = document.createElement("p");
					neuSpan.className="AufgName";
					var neuSpanText = document.createTextNode(Kennung.substring(0,30));
					neuSpan.appendChild(neuSpanText);
					if (Div[di].className=="Aufgabenrahmen") {
								Div[di].insertBefore(neuSpan, Div[di].firstChild);
					}
				}
			}
			
			if (AnhangTeile[i].toString().replace(/\?/,"").substr(0,6)=="Rahmen") {	
				var divTags=document.getElementsByTagName("div");
				var k=1;
				for (var t=0;t<divTags.length; t++) {
					if (divTags[t].className=="Aufgabenrahmen" || divTags[t].className=="AufgabenrahmenAus") {
						divTags[t].style.border="1px solid red";	
					var NrDiv = document.createElement("div");
					var Nr = document.createTextNode(k);
					NrDiv.appendChild(Nr);
					NrDiv.style.fontSize="20px";
					NrDiv.style.color="red";
					divTags[t].insertBefore(NrDiv,divTags[t].firstChild);
	  				k++;
					}
				}
			}
			
		}	
			
	}
}




var ARAusEin={
	$id:function(ID){
		return document.getElementById(ID);
	},
	los:function () {
		this.$id("ARAusEinRahmen").style.display="block";	
	},
	Nr:[],
	menueAnAus:0,
	menue:function () {
		if (this.$id("Aufgabenausblenden").innerHTML=="") {
			var Inh="";
			for (var i=0;i<this.Nr.length;i++) {
				Inh+="<label for='AufgAusblNr"+i+"' ><input id='AufgAusblNr"+i+"' style='max-width:1em;' class='nichtAusblenden' type='checkbox'>"+this.Nr[i]+"</label><br />";		
			}
			this.$id("Aufgabenausblenden").innerHTML=Inh;
		}
		if (this.menueAnAus==0) {
			this.$id("ARAusEinMenue").style.display="block";
			this.menueAnAus=1;	
		}
		else {
			this.$id("ARAusEinMenue").style.display="none";	
			this.menueAnAus=0;
		}
		
		if (this.$id("ARAEPauseSel").options.length > 0) {
			this.$id("ARAEPauseSel").options[1].selected = true;
			this.$id("EingPauseSel").options[1].selected = true;
		}	
	},
	aus:function () {
		var Aufg=document.getElementsByTagName("div");
		var inp=0;
		for (var i=0;i<Aufg.length;i++) {
			if (Aufg[i].className=="Aufgabenrahmen") {
				if (this.$id("AufgAusblNr"+inp).checked==true) {
					Aufg[i].style.display="block";	
				}
				else {
					Aufg[i].style.display="none";	
				}
				inp++;	
			}
			if (Aufg[i].className=="AufgabenrahmenAus") {
				Aufg[i].style.display="none";	
			}		
		}
		
		this.$id("ARAusEinMenue").style.display="none";	
		this.$id("ARAEAuge").style.display="none";
		
		var Pause=this.$id("ARAEPauseSel").value;
		this.Zeit(Pause);
	},
	autoZeitSetzen:function () {
		var inpChecked=0;
		for (var i=0;i<this.Nr.length;i++) {
			if (this.$id("AufgAusblNr"+i).checked==true) {
				inpChecked++;		
			}	
		}	
		if (inpChecked<10) {
			this.$id("ARAEPauseSel").options[1].text="0"+inpChecked+"\u2009\u2022";
			this.$id("EingPauseSel").options[1].text="0"+inpChecked+"\u2009\u2022";
		}
		else {
			this.$id("ARAEPauseSel").options[1].text=inpChecked+"\u2009\u2022";
			this.$id("EingPauseSel").options[1].text=inpChecked+"\u2009\u2022";
		}		
		this.$id("ARAEPauseSel").options[1].value=inpChecked;
		this.$id("EingPauseSel").options[1].value=inpChecked;
	},	
	ein:function () {
		var Aufg=document.getElementsByTagName("div");
		for (var i=0;i<Aufg.length;i++) {
			if (Aufg[i].className=="Aufgabenrahmen") {
				Aufg[i].style.display="block";	
			}
			if (Aufg[i].className=="AufgabenrahmenAus") {
				Aufg[i].style.display="block";	
			}		
		}
		
		this.$id("AuNrAlle").style.display="none";
		this.$id("ARAEAuge").style.display="block";
		
		this.menueAnAus=0;	
	},	
	selectAnp:function (SelIdIst,SelIdSoll) {
		var gewaehlt=this.$id(SelIdIst).selectedIndex;
		this.$id(SelIdSoll).options[gewaehlt].selected = true;	
	},
   Zeit:function (PZeit) {
   	this.$id("AuNrReduziertDauer").style.display="block";
 		this.$id("AuNrReduziertDauer").innerHTML=PZeit+" min Teil-<br />aufgaben";
 		PZeit--;
 		if (PZeit>=0) {
 			window.setTimeout("ARAusEin.Zeit("+PZeit+")", 60000);	
 		}	
 		if (PZeit==-1) {
 			this.$id("AuNrReduziertDauer").style.display="none";	
 			this.$id("AuNrAlle").style.display="block";	
 			this.menueAnAus=1;
 		}
   },
	kontrolle:function () {
		var Aufg=document.getElementsByTagName("div");
		var inp=0;
		for (var i=0;i<Aufg.length;i++) {
			if (Aufg[i].className=="Aufgabenrahmen") {
				var NrSpan = document.createElement("span");
				var NrText = document.createTextNode(this.Nr[inp]);
				NrSpan.appendChild(NrText);
				Aufg[i].insertBefore(NrSpan,Aufg[i].firstChild);
				inp++;	
			}	
		}		
	}
}


//Wertungstabelle
var LC ={
		ABC:["A","a","B","b","C","c","D","d","E","e","F","f","G","g","H","h","I","i","J","j","K","k","L","l","M","m", "N","n","O","o","P","p","Q","q","R","r","S","s","T","t","U","u","V","v","W","w","X","x","Y","y","Z","z"],
		PrA:[],
		PrB:[],
		PrC:[],
		PrD:[],
		PrE:[],
		ABCNr:{
			0:[], //100%
			1:[],	// 80%
			2:[], // 60%
			3:[],	// 40%
			4:[]	//20%
		},
		zZahl:function(von,bis,kommastellen){
			kommastellen=(typeof(kommastellen)=="undefined")?0:kommastellen;
			if(von>=1){
				var vonX = von;
				var bisY = bis-von;
				var minus = 0;
			}
			else{	
				var vonX = 1;
				var bisY = bis+Math.abs(von);
				var minus = Math.abs(von)+1;		
			}
		var Zahl  = (bis-von!=0)?(Math.random()*Math.pow(10,12)%bisY+vonX-minus).toFixed(kommastellen):von;
		return Zahl;
		},
		Numsort:function(a, b) {
  			return a - b;
		},
		inpLeeren:function (IDNR,Wert) {
			
			if (Wert=="Anmerkung") {	
				document.getElementById(IDNR).value="";
			}
		},	
		klUebTr:function () {
			var Wert=document.getElementById("WtKlasseL").value;
			if (Wert.replace(/\s/g,"")!="") {
				document.getElementById("WtKlasseR").innerHTML="Klasse "+Wert+" | ";	
				document.getElementById("WtKlasseLinks").innerHTML="Klasse "+Wert+" | ";	
			}
			else {
				document.getElementById("WtKlasseR").innerHTML="";
				document.getElementById("WtKlasseLinks").innerHTML="";	
			}
		},	
		tabelle:function (Anzahl) {
			
			var Kontr="";
			var Klickpfad=Resultatanzeige.Klickpfad;
			var AufgabenNr=[];
			for (var i=0;i<Resultatanzeige.Buttonwerte.length;i++) {	
				AufgabenNr[i]=Resultatanzeige.Buttonwerte[i][1];	
			}
			
			var Aufg=AufgabenNr.sort();
			
			var jetzt = new Date(); 
			var Tag=jetzt.getDate();
				 Tag=(Tag<=9)?"0"+Tag:Tag;	
			var Monat=parseInt(jetzt.getMonth())+1;
				 Monat=(Monat<=9)?"0"+Monat:Monat;
			var Jahr=(jetzt.getYear()).toString().substr(1,2);
			var Datum=Tag+"."+Monat+"."+Jahr;
			
			var ZA=this.ABC[this.zZahl(0,this.ABC.length-1)];
			var ZB=this.ABC[this.zZahl(0,this.ABC.length-1)];
			var ZC=this.ABC[this.zZahl(0,this.ABC.length-1)];
			var ZD=this.ABC[this.zZahl(0,this.ABC.length-1)];
			var ZE=this.ABC[this.zZahl(0,this.ABC.length-1)];
			
			var ABC=ZA+ZB+ZC+ZD+ZE;
			
			var ABCTitel=ABC.replace(/([a-z])/g,"<span style='color:#bb0000'>$1</span>");
			
			Praefix=[];
			for (var i=0;i<ABC.length;i++) {
				Praefix[i]=parseInt(ABC.charCodeAt(i),16);
			}
			
			var PfadIst=window.location.pathname;
			
			var AufgNum=Aufg.join(", ");
			
			//var Pfadname=("https://mathe.aufgabenfuchs.de"+window.location.pathname).replace(/\.de\/mathematik/,".de");			
			
			var tab="<table id='Wertungstabelle' align='center' border='1' align='center' rules='all' cellpadding='3' cellspacing='0' style='font-size:small;'><tr><td colspan='10' style='pading-bottom:5px;'><div style='float:right;font-size:large;padding:0.5em 0.5em 0 0;'>aufgabenfuchs.de<br />Codetabelle<div style='font-size:small;'><span id='WtKlasseR'></span><span id='WtDatumR'>"+Datum+"</span><br /><span id='WtAnmerkR'></span></div></div><strong>"+Resultatanzeige.Seitentitel+" | Klasse: <input onkeyup='LC.klUebTr();' id='WtKlasseL' class='WertungInpRand' style='width:2em;font-size:small;font-weight:bold;' /></strong><br />Aufgabe/n: "+AufgNum+" | <input class='WertungInpRand' onkeyup='document.getElementById(\"AufgLinkDatum\").innerHTML=this.value;document.getElementById(\"WtDatumR\").innerHTML=this.value;' value='"+Datum+"' style='width:5em;font-size:small;' /><br /><input  id='WTAnmerkung' class='WertungInpRand' style='font-size:large;text-align:left;width:14em;' value='Anmerkung' onfocus='LC.inpLeeren(this.id,this.value)' style='width:15em;text-align:left;font-size:small;' onkeyup='document.getElementById(\"WtAnmerkR\").innerHTML=this.value;' /><div style='font-size:small;font-style:italic;'>Klickpfad:</div><div style='font-size:small;padding-left:1em;font-style:italic;'>"+Klickpfad+"</div></td></tr>";
			tab+="<tr><td  align='center' style='border-bottom:2px solid black;border-right:1px dashed black;'><span style='font-size:0.85em;'>Kennung</span><br /><span style='font-weight:bold;font-size:1.1em' title='Kleinbuchstaben sind rot gekennzeichnet.'>"+ABCTitel+"</span></td><td style='border-bottom:2px solid black;border-left:1px dashed black;'>Nr<br /><span style='font-weight:bold;font-size:1.1em'>&thinsp;.&thinsp;.</span></td><td nowrap='nowrap'  align='center' width='114' style='border-bottom:2px solid black;'>Wertungscodes<br /><span style='font-size:x-small'>der Sch&uuml;ler</span></td><td style='width:24px;border-bottom:2px solid black;border-right:3px black double;' align='center'><img src='/inc/basis/ok.png' width='16' height='16' /></td><td  align='center' style='border-bottom:2px solid black;'>A<br /><span style='font-size:x-small'>100&thinsp;-&thinsp;91&thinsp;%</span></td><td  align='center' style='border-bottom:2px solid black;'>B<br /><span style='font-size:x-small'>90&thinsp;-&thinsp;81 %</span></td><td  align='center' style='border-right:3px double black;border-bottom:2px solid black;'>C<br /><span style='font-size:x-small'>80&thinsp;-&thinsp;71&thinsp;%</span></td><td  align='center' style='border-bottom:2px solid black;'>D<br /><span style='font-size:x-small'>70&thinsp;-&thinsp;51 %</span></td><td  align='center' style='border-bottom:2px solid black;'>E<br /><span style='font-size:x-small'>50&thinsp;-&thinsp;21 %</span></td><td  align='center' style='border-bottom:2px solid black;'>F<br /><span style='font-size:x-small'><=&thinsp;20&thinsp;%</span></td></tr>";
			
			var backgrC=""
			
			var k=0;
			
			var Schuelerlink="";
			
			for (var i=1;i<=Anzahl;i++) {
				
				if (i%2==0) {
					backgrC='white';	
				}
				else {
					backgrC='#ddd';		
				}		
				
				if (i<=9) {
					k="0"+i;
				}
				else {
					k=i;	
				}
				
				if (i%5==0) {	
					var RandU="2px solid black;";
				}else {
					var RandU="1px solid black;";	
				}	
				
				tab+="<tr><td id='Kennungszelle"+(i-1)+"' align='left' style='background-color:"+backgrC+";border-bottom:"+RandU+";border-right:1px dashed black;' >"+ABC+"</td><td style='background-color:"+backgrC+";border-bottom:"+RandU+";border-left:1px dashed black;' align='center'>"+k+"</td><td align='left' style='background-color:"+backgrC+";border-bottom:"+RandU+";'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>-</strong></td><td style='background-color:"+backgrC+";border-bottom:"+RandU+";border-right:3px black double;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";	
				
				for (var j=0;j<=4;j++) {
					Kontr+=Praefix+"~"+k+"~"+j+"<br />";
					var WC=this.codieren(Praefix,k,j);
					if (j==2) {
						var Rand="border-right:3px black double;";	
					}	
					else {
						var Rand="";	
					}	
					tab+="<td align='center' style='background-color:"+backgrC+";"+Rand+";border-bottom:"+RandU+";'>"+WC+"</td>";
				}
				
			//this.codieren(Praefix,PraefixNr,ProzNr)

				tab+="<td style='background-color:"+backgrC+";border-bottom:"+RandU+";' align='center'>mau</td></tr>";
				
				var DivArr=document.getElementsByTagName("div");
				var SichbarDivNr=[];
				var kk=1;
				var l=0;
				for (var j=0; j<DivArr.length;j++) {
					if (DivArr[j].className=="AufgabenrahmenAus") {	
						kk++;
					}
					if (DivArr[j].className=="Aufgabenrahmen") {	
						SichbarDivNr[l]=kk;//An dieser Stelle der durchsuchten Arrays befindet sich die Aufgabe an der Position l im Aufgabenarray (sichtbarNr unten).
						l++;
						kk++;
					}				
				}	
				
				var Suchdaten=AufgNum.replace(/\s/g,"").split(",");
				var sichtbarNr=[];
				var xZ=0;
				for (var j=0;j<ARAusEin.Nr.length;j++) {//Aufgabenarray durchsuchen
					var AusEinArr=ARAusEin.Nr[j].replace(/\s/g,"").split(",");//Mehrfachaufgaben splitten
					for (var kk=0;kk<AusEinArr.length;kk++) {
						for (var l=0;l<Suchdaten.length;l++) {
							if (AusEinArr[kk]==Suchdaten[l].replace(/\D/g,"")) {//Pruefen, ob die gesuchte Aufgabennummer existiert
								sichtbarNr[xZ]=j;//An dieser Position im ARAusEin.Nr-Array befindet sich die Aufgabe
								xZ++;
								l=Suchdaten.length;
								kk=AusEinArr.length;
							}	
						}
						
					}				
						
				}
				
				var sichbarKennung=[];
				for (var j=0;j<sichtbarNr.length;j++) {
					sichbarKennung[j]=SichbarDivNr[sichtbarNr[j]];			
				}	
				var Adresszeile=window.location.toString();
				Adresszeile=Adresszeile.split('#')[0];
				
				var AufgHW=(Suchdaten.length==1)?"Wertungsaufgabe Sch&uuml;lerIn ":"Wertungsaufgaben Sch&uuml;lerIn ";
				var AufgAufg=(Suchdaten.length==1)?"Aufgabe ":"Aufgaben ";
				
				var pdfUmbruch="";
				
				if (i%11==0) {
					pdfUmbruch="pdfUmbruch11";	
				}	
				if (i%12==0) {
					pdfUmbruch="pdfUmbruch12";	
				}
				if (i%13==0) {
					pdfUmbruch="pdfUmbruch13";	
				}	
				if (i%14==0) {
					pdfUmbruch="pdfUmbruch14";	
				}		
				if (i%15==0) {
					pdfUmbruch="pdfUmbruch15";	
				}
				if (i%16==0) {
					pdfUmbruch="pdfUmbruch16";	
				}	
				Schuelerlink+="<dt id='SchuelerlinkName"+k.toString().replace(/^0/,"")+"' class='"+pdfUmbruch+"' >Sch&uuml;lerIn "+k+":</dt><dd style='margin-bottom:0.5em;'><a id='SchuelerlinkA"+k.toString().replace(/^0/,"")+"' href='"+Adresszeile+"?Hinweis("+AufgHW+k+": "+AufgNum+")&sichtbar("+sichbarKennung.join(",")+")&Kennung("+ABC+k+")&gleich("+AufgNum+")' target='_blank'>"+Adresszeile+"?Hinweis("+AufgHW+k+": "+AufgNum+")&sichtbar("+sichbarKennung.join(",")+")&Kennung("+ABC+k+")&gleich("+AufgNum.replace(/\s/g,"")+")</a></dd>";
								
			}
			
			tab+="</table>";	
			
			tab+="<p align='center' style='font-size:x-small;' class='nichtDrucken'>Durch Semikolons getrennte Namensliste eintragen um Kennungen durch Namen zu ersetzen. Kennungen bleiben Anmeldemuster.<br /><input onkeyup='LC.kennungName(this.value);' onblur='LC.kennungName(this.value);' style='width:35em;margin-top:3px;font-size:small;'  /></p><p align='center'><button onclick='linkPDF.los(\"Wertungstabelle\");'>Codetabelle als PDF-Datei speichern</button></p>";
			
			document.getElementById("Codetabelle").innerHTML=tab+"<div align='center' class='nichtDrucken'><p align='center' style='margin-top:2em;'><strong>Linkliste zu den Aufgaben</strong></p><p align='center' style='color:red;'>Durch einen Klick auf den unteren Button kann die folgende Linkliste gespeichert und an die Sch&uuml;lerInnen weitergeleitet werden.</p><table cellpadding='0' cellspacing='0' align='center'><tr><td><div id='SchuelerlinkPDF'><p style='font-size:large;font-weight:bold;'><span id='WtKlasseLinks'></span>"+Resultatanzeige.Seitentitel+" (<span id='AufgLinkDatum'>"+Datum+"</span>)</p><p><strong>Klicke auf \"deinen\" Link, l&ouml;se die "+AufgAufg+" "+AufgNum+" und trage den erzielten Wertungscode in den daf&uuml;r vorgesehenen Bereich ein!</strong></p><dl>"+Schuelerlink+"</dl></div></td></tr></table><p><button style='font-size:medium;' onclick='linkPDF.los(\"SchuelerlinkPDF\");'>Links als PDF-Datei speichern</button> <select id='pdfLinksUmbruch' style='font-size:medium;'><option value='.pdfUmbruch11'>10 Links &crarr;</option><option value='.pdfUmbruch12' selected='selected'>11 Links &crarr;</option><option value='.pdfUmbruch13'>12 Links &crarr;</option><option value='.pdfUmbruch14'>13 Links &crarr;</option><option value='.pdfUmbruch15'>14 Links &crarr;</option><option value='.pdfUmbruch16'>15 Links &crarr;</option></select></p><br /><br /></div>";
			

			if (Anzahl==0) {
				document.getElementById("Codetabelle").style.display="none";	
			}
			else {
				document.getElementById("Codetabelle").style.display="block";
			}		
		},
		kennungName:function (Wert) {	
		
			var Namen=Wert.split(";");

			for (var i =0;i<Namen.length;i++) {
				if (document.getElementById("Kennungszelle"+i)) {
					document.getElementById("Kennungszelle"+i).innerHTML=	Namen[i];
					var SchuelerNr=parseInt(i)+1;
					var Praef=(i<9)?"0":"";
					document.getElementById("SchuelerlinkName"+SchuelerNr).innerHTML=Praef+SchuelerNr+" "+Namen[i];	
					
					document.getElementById("SchuelerlinkA"+SchuelerNr).search= document.getElementById("SchuelerlinkA"+SchuelerNr).search.replace(/Wertungsaufga(\w+).+(\d\d:)/,"Wertungsaufga$1 "+Namen[i]+" $2");
					
					document.getElementById("SchuelerlinkA"+SchuelerNr).innerHTML= document.getElementById("SchuelerlinkA"+SchuelerNr).innerHTML.replace(/Wertungsaufga(\w+).+(\d\d:)/,"Wertungsaufga$1 "+Namen[i]+" $2");
				}
				else {
					break;	
				}		
				
			}	
		
		},	
		los:function () {
			var Buchst="";
			var Praefix=[0];
			var PraefixNr=parseInt(Resultatanzeige.Name.substr(Resultatanzeige.Name.length-2,2));
			if (isNaN(PraefixNr)) {
				PraefixNr=01;	
			}
			if (PraefixNr<=9) {
				PraefixNr="0"+PraefixNr;	
			}			
		
			for (var i=0;i<Resultatanzeige.Name.length-2;i++) {
				Praefix[i]=parseInt(Resultatanzeige.Name.charCodeAt(i),16);
			}
			
			var Proz=Resultatanzeige.ProzGes;
			var ProzNr=0;
			
			if (Proz<=50) {
				ProzNr=4;
				Buchst="E - ";	
			}
			
			if (Proz>50&&Proz<=70) {
				ProzNr=3;
				Buchst="D - ";		
			}	
			
			if (Proz>70&&Proz<=80) {
				ProzNr=2;
				Buchst="C - ";		
			}	
			
			if (Proz>80&&Proz<=90) {
				ProzNr=1;
				Buchst="B - ";		
			}	
			
			if (Proz>90) {
				ProzNr=0;
				Buchst="A - ";		
			}		
			
			var LCode=this.codieren(Praefix,PraefixNr,ProzNr);
			
			if (Proz<=20) {
				LCode="mau";
				Buchst="F - ";		
			}	
			
			var AugNr=[];
			for (var i=0; i<Resultatanzeige.Buttonwerte.length;i++) {
				AugNr[i]=Resultatanzeige.Buttonwerte[i][1];	
			}	
			
			
			document.getElementById("Loesungscode").innerHTML=Buchst+LCode;
			document.getElementById("Pruefdaten").innerHTML=Resultatanzeige.Name+"&nbsp;&nbsp;"+AugNr.sort().join(", ");
			
			if (Resultatanzeige.aufVorderseiteAnzeigen==1) {
				AufgVergleich.los();
				
				if (AufgVergleich.Kennung="1"&&AufgVergleich.AufgVergleichLos==1) {
					if (AufgVergleich.sollIst==0) {
						document.getElementById("ResultatanzeigeVorn").innerHTML="<div align='center' style='font-size:large;color:green;font-weight;bold;'>Kennung: "+Resultatanzeige.Name+" | Wertungscode: momentan ung&uuml;ltig</div>";
					}
					else {
						document.getElementById("ResultatanzeigeVorn").innerHTML="<div align='center' style='font-size:large;color:green;font-weight;bold;'>Kennung: "+Resultatanzeige.Name+" | Wertungscode: "+Buchst+LCode+"</div>";		
					}			
				}
				
				else {
					document.getElementById("ResultatanzeigeVorn").innerHTML="<div align='center' style='font-size:large;color:green;font-weight;bold;'>Kennung: "+Resultatanzeige.Name+" | Wertungscode: "+Buchst+LCode+"</div>";		
				}
				
			document.getElementById("ResultatanzeigeVorn").style.display="block";	
			
			
		}		

			return LCode;
					
		},	
		codieren:function (Praefix,PraefixNr,ProzNr) {
		
		var PraefixNr0=PraefixNr.toString().substr(0,1);
		var PraefixNr1=PraefixNr.toString().substr(1,1);
		
		var Pfad = (window.location.pathname).replace(/\/mathematik\//,"").replace(/\//,"");

		var AufgNr=[0];
		
		var AufgAnz=Resultatanzeige.Buttonwerte.length;
		var NumSum=0;
		if (AufgAnz>0) {
			var Max=0;
			for (var i=0;i<AufgAnz;i++) {
				var NumAkt=Resultatanzeige.Buttonwerte[i][1].replace(/\W/g,"").replace(/a/,"10").replace(/b/,"11").replace(/c/,"12").replace(/d/,"13").replace(/e/,"14").replace(/f/,"15").replace(/g/,"16").replace(/h/,"17").replace(/i/,"18").replace(/j/,"19").replace(/k/,"20").replace(/l/,"21").replace(/m/,"22").replace(/n/,"23").replace(/o/,"24").replace(/p/,"25").replace(/q/,"26").replace(/r/,"27").replace(/s/,"28").replace(/t/,"29").replace(/u/,"30").replace(/v/,"31").replace(/w/,"32").replace(/x/,"33").replace(/y/,"34").replace(/z/,"35");
				NumAkt=parseInt(NumAkt);
				if(isNaN(NumAkt)){
					NumAkt=1;
				}
				
				NumSum=parseInt(NumSum)+parseInt(NumAkt);
				NumSum=(NumSum<11)?parseInt(NumSum)+11:NumSum;
					
				if (NumAkt>Max) {
					Max=NumAkt;	
				}
			}	
		}
		else {
			var Max=0;	
		}		
			
		for (var i =0; i<AufgAnz;i++) {
			if (parseInt(Resultatanzeige.Buttonwerte[i][1])!="NaN") {
				AufgNr[i]= parseInt(Resultatanzeige.Buttonwerte[i][1]);
			}
			else {
				AufgNr[i]=i;	
			}		
		}
		
		AufgNr=AufgNr.sort();	
		
		var UniCode="";
		var j=0;
		var k=0;
		for (var i=0;i<Pfad.length;i++) {
			UniCode+=parseInt(Max)+parseInt(Pfad.charCodeAt(i),16)+parseInt(AufgNr[j])+parseInt(Praefix[k]);
			j++;
			k++;
			if (j==AufgNr.length) {	
				j=0;
			}
			if (k==Praefix.length) {	
				k=0;
			}
		}	
			 
	UniCode=UniCode+""+UniCode+""+UniCode+""+UniCode+""+UniCode+""+UniCode+""+UniCode+""+UniCode+""+UniCode+""+UniCode+""+UniCode;
		
		var j=0;
		for (var i=AufgAnz;i<UniCode.length;i=i+3) {
			this.PrA[j]=UniCode.substr(i,3)+"~"+j;
			if (j==51) {
				break;	
			}	
			j++;	
		}
		
		this.PrA=this.PrA.sort();
		
		for (var i=0;i<this.PrA.length;i++) {
			this.ABCNr[0][i]=this.PrA[i].replace(/\d+~/,"");	
		}	

		var j=0;
		for (var i=parseInt(AufgAnz)+4;i<UniCode.length;i=i+3) {
			this.PrB[j]=UniCode.substr(i,3)+"~"+j;
			if (j==51) {
				break;	
			}	
			j++;	
		}
		
		this.PrB=this.PrB.sort();
		
		for (var i=0;i<this.PrB.length;i++) {
			this.ABCNr[1][i]=this.PrB[i].replace(/\d+~/,"");	
		}
		
		var j=0;
		for (var i=parseInt(AufgAnz)+9;i<UniCode.length;i=i+3) {
			this.PrC[j]=UniCode.substr(i,3)+"~"+j;
			if (j==51) {
				break;	
			}	
			j++;	
		}
		
		this.PrC=this.PrC.sort();
		
		for (var i=0;i<this.PrC.length;i++) {
			this.ABCNr[2][i]=this.PrC[i].replace(/\d+~/,"");	
		}
		
		var j=0;
		for (var i=AufgAnz;i<UniCode.length;i=i+4) {
			this.PrD[j]=UniCode.substr(i,3)+"~"+j;
			if (j==51) {
				break;	
			}	
			j++;	
		}
		
		this.PrD=this.PrD.sort();
		
		for (var i=0;i<this.PrD.length;i++) {
			this.ABCNr[3][i]=this.PrD[i].replace(/\d+~/,"");	
		}	
		
		var j=0;
		for (var i=parseInt(AufgAnz)+1;i<UniCode.length;i=i+4) {
			this.PrE[j]=UniCode.substr(i,3)+"~"+j;
			if (j==51) {
				break;	
			}	
			j++;	
		}
		
		this.PrE=this.PrE.sort();
		
		for (var i=0;i<this.PrE.length;i++) {
			this.ABCNr[4][i]=this.PrE[i].replace(/\d+~/,"");	
		}
		
		var LoesCode="";
		
		var j=parseInt(NumSum%11)+parseInt(PraefixNr0)*7;
		k=0;		
		for (var i=0;i<5;i++) {
			PraefixNr1=(PraefixNr1==0)?k:PraefixNr1;
			if (j>=32) {
				j=0;	
			}	
			j=parseInt(j)+parseInt(PraefixNr1);
			LoesCode+= this.ABC[this.ABCNr[ProzNr][j]];
			
			k=k+4;	
		}
		 		
		return LoesCode;
		
		
	}
}


function encode64(inp){
var key="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var chr1,chr2,chr3,enc3,enc4,i=0,out="";
while(i<inp.length){
chr1=inp.charCodeAt(i++);if(chr1>127) chr1=88;
chr2=inp.charCodeAt(i++);if(chr2>127) chr2=88;
chr3=inp.charCodeAt(i++);if(chr3>127) chr3=88;
if(isNaN(chr3)) {enc4=64;chr3=0;} else enc4=chr3&63;
if(isNaN(chr2)) {enc3=64;chr2=0;} else enc3=((chr2<<2)|(chr3>>6))&63;
out+=key.charAt((chr1>>2)&63)+key.charAt(((chr1<<4)|(chr2>>4))&63)+key.charAt(enc3)+key.charAt(enc4);
}
return encodeURIComponent(out);
}

	
Basis={
	
	init:function(){
		AufgRaMark.los();
		if(typeof(beimLaden)!="undefined"){beimLaden();}
		Basis.LinkMarkieren();
		BildschirmnotizTZ();
		Verweildauer.StartZeit();
	}
}


var Eingabepause={
    		$id:function (ID) {
    			return document.getElementById(ID);
    		},
    		anAus:function (tagId,sicht) {
    			if (sicht==0) {
    				this.$id(tagId).style.display="none";		
    			}	
    			if (sicht==1) {
    				this.$id(tagId).style.display="block";				
    			}
    		},
    		anAusWIst:0,
    		anAusW:function () {
    			if (this.anAusWIst==1) {
    				this.$id("EingPauseWahl").style.display="none";	
    				this.anAusWIst=0;	
    			}
    			else {
    				this.$id("EingPauseWahl").style.display="block";
    				this.anAusWIst=1;				
    			}	
    		},
    		TFDisabled:[],
    		los:function () {
    			var Pausenzeit=this.$id("EingPauseSel").value;
    			var Pause=Pausenzeit*60000;
 				var TF=document.getElementsByTagName("input");
 				var But=document.getElementsByTagName("button");
 				
 				for (var i=0;i<TF.length;i++) {
 					if (TF[i].disabled==true) {
 						this.TFDisabled[i]=1;	
 					}
 					else {
 						this.TFDisabled[i]=0;		
 					}
 					
 					if (TF[i].className!="nichtAusblenden") {
 						TF[i].disabled=true;
 					}	
 				}
 				
 				for (var i=0;i<But.length;i++) {
 					var ButNeu=But[i].innerHTML.replace(/\s/g,"");
 					if (ButNeu=="Neu"||ButNeu=="Auswertung") {
 						But[i].style.visibility="hidden";		
 					}
 				}
 				Eingabepause.Zaehler(Pausenzeit);
 				if (Pausenzeit>0) {
 					this.$id("EingPauseDauer").style.display="block";	
 				}
    		},
    		Ende:function () {
    			var TF=document.getElementsByTagName("input");
    				for (var i=0;i<TF.length;i++) {
    					if (this.TFDisabled[i]==0) {
    						TF[i].disabled=false;		
    					}	
    				}
    			var But=document.getElementsByTagName("button");
    			for (var i=0;i<But.length;i++) {
 					var ButNeu=But[i].innerHTML.replace(/\s/g,"");
 					if (ButNeu=="Neu"||ButNeu=="Auswertung") {
 						But[i].style.visibility="visible";		
 					}
    			}	
    			this.$id("EingPauseSel").selectedIndex=0;
    		},
    		Zaehler:function (PZeit) {
    			this.$id("EingPauseDauer").innerHTML=PZeit+" min ohne<br />Auswertung";
    			PZeit--;
    			if (PZeit>=0) {
    				window.setTimeout("Eingabepause.Zaehler("+PZeit+")", 60000);	
    			}
    			if (PZeit==-1) {
    				Eingabepause.anAus("EingPauseAus",1);
    				Eingabepause.anAus("EingPauseDauer",0);
    			}
    		},
    		Info:'"Auswertung"- sowie "Neu"-Buttons und Textfelder werden oft ablenkend genutzt. Ihr zeitweiliges Ausblenden lenkt den Blick st\u00e4rker auf die Aufgaben. Nach gew\u00e4hlter Zeit ist ein Button aktivierbar, der alle Elemente wieder einblendet.',
		}

var Resultatanzeige={ //Zeigt die Resultate der durchgef&uuml;hrten Aufgaben einer Seite komprimiert an.
	Buttonwerte:[],//0=ID, 1=Aufgabennummer, 2=richtig, 3=falsch
	Seitentitel:" ",
	keinResultat:"",
	Klickpfad:" ",
	aufVorderseiteAnzeigen:0,
	ProzAufg:function () {
		var AnzahlIst=this.Buttonwerte.length;
		var AnzahlSoll=document.getElementById("ProzAufgInp").value;
		if (AnzahlIst>0) {
			if (AnzahlIst<10) {
				if (AnzahlSoll<AnzahlIst) {	
					document.getElementById("ProzAufgInp").value=AnzahlIst;	
					AnzahlSoll=AnzahlIst;
				}
				document.getElementById("ProzAufgAnz").innerHTML=(this.ProzGes/AnzahlSoll*AnzahlIst).toFixed(0);
			}
			
			if (AnzahlIst>=10) {
				if (AnzahlSoll>=10&&AnzahlSoll<=AnzahlIst) {
					document.getElementById("ProzAufgInp").value=AnzahlIst;
					AnzahlSoll=AnzahlIst;
					document.getElementById("ProzAufgAnz").innerHTML=(this.ProzGes/AnzahlSoll*AnzahlIst).toFixed(0);	
				}
				
				if (AnzahlSoll>=10&&AnzahlSoll>AnzahlIst) {
					document.getElementById("ProzAufgAnz").innerHTML=(this.ProzGes/AnzahlSoll*AnzahlIst).toFixed(0);	
				}
				
				if (AnzahlSoll<10) {
					document.getElementById("ProzAufgAnz").innerHTML="---";	
				}
			}
		}
		else {
			document.getElementById("ProzAufgAnz").innerHTML="0";	
			document.getElementById("ProzAufgInp").value=0;
		}		
	
	},
	ProzGes:0,	
	los:function (Seitentitel,keinResultat,sichtbar,Klickpfad) {
		
			document.getElementById("Linkinfo").style.display="block"; //Linkinfo anzeigen
			document.getElementById("EingPauseDiv").style.display="block"; //Wertungspause anzeigen
			
			var jetzt = new Date();
			var Tag= jetzt.getDate();
			var Monate=["Jan","Feb","M&auml;rz","Apr","Mai","Jun","Jul","Aug","Sept","Okt","Nov","Dez"]
			var Monat= Monate[jetzt.getMonth()];
			var Stunde=(jetzt.getHours()<10)?"0"+jetzt.getHours():jetzt. getHours();
			var Minute=(jetzt.getMinutes()<10)?"0"+jetzt.getMinutes():jetzt. getMinutes();
			
			if(typeof(Seitentitel)!="undefined"){
				this.Seitentitel=Seitentitel;
			}	
			
			if(typeof(Klickpfad)!="undefined"){
				this.Klickpfad="> Mathematik<br />> "+Klickpfad.replace(/ >/g,"<br />>");
			}	
			
			if(typeof(keinResultat)!="undefined"){
				this.keinResultat="<small>Ohne Wertung:<br />Aufgabe "+keinResultat+"</small><br />";
				if (keinResultat=="") {	
					this.keinResultat="";
				}
			}
			
			if(typeof(sichtbar)!="undefined"){
				document.getElementById("Uebungsresultate").style.display="block";
			}
					
			var Ausgabereihen=[];
			var ProzentGesamt=0;
			var linkTargetSetzen=0;
			
			for (var i=0; i<this.Buttonwerte.length;i++) {
				this.Buttonwerte[i][4]=(this.Buttonwerte[i][4]==undefined)?"---":this.Buttonwerte[i][4];
				var Prozent=(100/(parseInt(this.Buttonwerte[i][2])+parseInt(this.Buttonwerte[i][3]))*parseInt(this.Buttonwerte[i][2])).toFixed(0);
				if (isNaN(Prozent)) {
					Prozent=0;	
				}
				if (Prozent>20) {
					linkTargetSetzen=1;	
				}	
				ProzentGesamt=parseInt(ProzentGesamt)+parseInt(Prozent);
					
				
				Ausgabereihen[i]=	"<tr><td style='padding:0 4px;' align='center'  class='Resultate_Nummer'>"+this.Buttonwerte[i][1]+"</td><td style='padding:0 4px;' align='center' class='Resultate_Auswertung'>"+this.Buttonwerte[i][4]+"</td><td style='padding:0 4px;' align='center' class='Resultate_richtig'>"+this.Buttonwerte[i][2]+"</td><td style='padding:0 4px;' align='center' class='Resultate_falsch'>"+this.Buttonwerte[i][3]+"</td><td style='padding:0 4px;' align='center' class='Resultate_Prozent'>"+Prozent+"</td></tr>";
			}	
			
			if (linkTargetSetzen==1) {
				var ax=document.getElementsByTagName("a");//Der erste Link[0] scrollt auf der selben Seite nach oben.
				for (var anker=1;anker<ax.length;anker++) {
					if (ax[anker].className!="linkintern") { //interne Links werden nicht zu neuen Tabs verwiesen
						ax[anker].target="_blank";	
					}		
				}			
			}	
			
			ProzentGesamt=ProzentGesamt/i;
			
			if(isNaN(ProzentGesamt)){
				ProzentGesamt=0;
			}

			AusgSort=Ausgabereihen.sort();
			
			this.ProzGes=ProzentGesamt.toFixed(0);
			
			var Ausgabe="<table style='position:static; page-break-after:always;background-color:white;z-index:5000;' id='ResTabRahmen' align='right' cellpadding='0' cellspacing='0' border='0'>";
			Ausgabe+="<tr><td align='center' style='padding-bottom:0.5em;min-width:7.5em;' id='Resultatbutton'><button onclick='Resultatanzeige.sichtbar();' class='nichtDrucken'>Resultate</button></td></tr>";
			Ausgabe+="<tr><td id='ResultateAF' align='center' style='background-color:white;padding-bottom:0.5em;'><span style='color:#444;'>Wertung:<br /><small>Aufgabenfuchs</small></span></td></tr>";
			Ausgabe+="<tr><td id='ResultateNameTd' align='center' style='background-color:white;padding-bottom:0.5em;'></td></tr>";
			Ausgabe+="<tr><td id='Resultattitel' align='center' style='background-color:white;padding-bottom:0.5em;'>"+this.Seitentitel+"<br /><small>"+Tag+". "+Monat+"."+" - "+Stunde+":"+Minute+"</small>";
			
			Ausgabe+="<br /><small>Verweildauer: <span id='Verweildauer'></span> min</small></td></tr>";
			Ausgabe+="<tr><td style='background-color:white;' align='center'>";
				Ausgabe+="<table id='Resultattabelle' cellpadding='0' cellspacing='0' border='2' style='background-color:white;min-width:7.5em;' rules='rows'>";
			
				Ausgabe+="<tr><td style='padding:0 4px;' align='center' class='Resultate_Nummer' title='Aufgabennummer'><strong>Nr</strong></td><td style='padding:0 4px;' title='Anzahl der Auswertungen' align='center' class='Resultate_Auswertung'><strong>A</strong></td><td style='padding:0 4px;' title='richtig' align='center' class='Resultate_richtig'><strong>r</strong></td><td style='padding:0 4px;' title='falsch' align='center' class='Resultate_falsch'><strong>f</strong></td><td style='padding:0 4px;' title='Prozentangabe richtiger Antworten' class='Resultate_Prozent'align='center'><strong>%</strong></td></tr>"+AusgSort.join('\n');
			Ausgabe+="<tr><td title='Mittelwert aller Prozentangaben' colspan='3' align='right'></td><td align='center' title='Mittelwert aller Prozentangaben'>&oslash;</td><td align='center'>"+ProzentGesamt.toFixed(0)+"</td></tr>";
			Ausgabe+="<tr><td colspan='5' align='center' style='background-color:silver;padding:1px 0;' title='Anzahl der ausgewerteten Aufgaben'>A: "+this.Buttonwerte.length+" von <input id='ProzAufgInp' class='nichtAusblenden' maxlength='2' onkeyup='Resultatanzeige.ProzAufg();' onfocus='this.value=\"\"' onblur='Resultatanzeige.ProzAufg();' style='width:2em;text-align:center;font-size:1em;' value='"+this.Buttonwerte.length+"' /></td></tr>";
			Ausgabe+="<tr><td title='Mittelwert :  erwartete Aufgaben x erreichte Aufgaben' style='background-color:white;' colspan='5' align='center'>Prozent: <span id='ProzAufgAnz'></span></td></tr>";
			Ausgabe+="</table>";
			
			Ausgabe+="<tr id='Resultat_Symbole'><td align='center'>";
			
			Ausgabe+="<table border='0' align='center' style='padding:1em 0;' cellpadding='0' cellspacing='0' id='ResErklaerung'><tr><td valign='top'>Nr:&nbsp;</td><td>Aufgabenummer</td></tr>";
			Ausgabe+="<tr><td valign='top'>A:</td><td>Auswertungen</td></tr>";
			Ausgabe+="<tr><td valign='top'>r:</td><td>richtige Antworten</td></tr>";
			Ausgabe+="<tr><td valign='top'>f:</td><td>falsche Antworten</td></tr>";
			Ausgabe+="<tr><td valign='top'>%:</td><td>Prozent richtig</td></tr></table>";
			
			Ausgabe+="</td></tr>";
			
			Ausgabe+="<tr><td id='Resultat_ohne' align='center' style='background-color:white;padding:0.1em 0 0.5em 0;background-color:#eee;'>"+this.keinResultat+"<p style='padding:0.5em 0 0 0;margin:0;'><button id='ResDruckButton' class='PDFunsichtbar' onclick='AufgVergleich.los();Resultatanzeige.Druckschau();LC.los();Verweildauer.Dauer();'>Druckvorschau<br />Wertungscode</button></p></td></tr>";
			Ausgabe+="<tr><td align='center' id='ResultatDruck'><p class='PDFunsichtbar'><button onclick='linkPDF.los(\"ResTabRahmen\");'>Ergebnisse als PDF-Datei speichern</button></p><p class='nichtDrucken PDFunsichtbar'><a href='javascript:window.print()'>Drucken</a>&nbsp;<img src='/inc/basis/info.png' onclick='alert(\"In vielen Druckmen\u00fcs kann die Seite als PDF-Datei gespeichert werden: Das spart Papier.\")' width='18' height='18' alt='i' align='absmiddle' style='cursor:pointer;' /></p>";
			Ausgabe+="<hr /><p title='Wertungscode' style='font-size:small'>Aktueller Wertungscode: <strong><span id='Loesungscode'></span></strong></p>";
			Ausgabe+="<p style='font-size:small'>Pr&uuml;fdaten: <span id='Pruefdaten'></span></p><hr />";
			Ausgabe+="<table class='nichtDrucken' cellpadding='0' cellspacing='0' align='center' style='font-size:small;color:#333;'><tr><td align='left'>";
			Ausgabe+="<ul class='PDFunsichtbar'><li><select onchange='LC.tabelle(this.value);'><option value='0'>Hier</option><option  value='5'>5</option><option  value='10'>10</option><option  value='15'>15</option><option  value='20'>20</option><option  value='25'>25</option><option  value='30'>30</option><option  value='35'>35</option></select> Wertungscodes generieren</li><li><a href='/inc/basis/Lehrerinfo.pdf' target='_blank'>Lehrerinfo.pdf</a></li><li><a href='/inc/basis/Schuelerinfo.pdf' target='_blank'>Sch&uuml;lerinfo.pdf</a></li></ul>";
			Ausgabe+="</td></tr></table>";
			Ausgabe+="</td></tr>";
			Ausgabe+="</td></tr></table>";
			Ausgabe+="<div id='Codetabelle' style='page-break-before:always'></div>";
			
			document.getElementById("Uebungsresultate").innerHTML=Ausgabe;
			
		if (this.anaus==1) {
			document.getElementById("Resultattabelle").style.display="table";	
			document.getElementById("Resultattitel").style.display="none";	
			document.getElementById("ResultatDruck").style.display="none";
			document.getElementById("Resultat_ohne").style.display="block";	
			document.getElementById("ResultateNameTd").style.display="block";
			document.getElementById("ResultateAF").style.display="block";
			document.getElementById("Resultat_Symbole").style.display="none";
			
		}
		else {
			document.getElementById("Resultattabelle").style.display="none";	
			document.getElementById("Resultattitel").style.display="none";	
			document.getElementById("ResultatDruck").style.display="none";
			document.getElementById("Resultat_ohne").style.display="none";
			document.getElementById("ResultateNameTd").style.display="none";	
			document.getElementById("ResultateAF").style.display="none";
			document.getElementById("Resultat_Symbole").style.display="none";
		}		
		
		this.ProzAufg();
		var LoesungsCode=LC.los();	
		document.getElementById("Loesungscode").innerHTML=LoesungsCode;
	},
	anaus:0,
	sichtbar:function () {	
		if (this.anaus==0) {
			document.getElementById("Resultattabelle").style.display="table";	
			document.getElementById("Resultat_ohne").style.display="block";	
			
			if (this.VorschauAnAus==1) {
				document.getElementById("Resultattitel").style.display="block";
				document.getElementById("ResultatDruck").style.display="block";
				document.getElementById("ResultateNameTd").style.display="block";	
				document.getElementById("ResultateAF").style.display="block";
				document.getElementById("Resultat_Symbole").style.display="none";
			}	
			else {
				document.getElementById("Resultattitel").style.display="none";	
				document.getElementById("ResultatDruck").style.display="none";
				document.getElementById("ResultateNameTd").style.display="none";	
				document.getElementById("ResultateAF").style.display="none";
				document.getElementById("Resultat_Symbole").style.display="none";
			}	
			this.anaus=1;
		}
		else {
			document.getElementById("Resultattabelle").style.display="none";
			document.getElementById("Resultattitel").style.display="none";	
			document.getElementById("ResultatDruck").style.display="none";
			document.getElementById("Resultat_ohne").style.display="none";	
			document.getElementById("ResultateNameTd").style.display="none";
			document.getElementById("ResultateAF").style.display="none";
			document.getElementById("Resultat_Symbole").style.display="none";
			
					
			this.anaus=0;
		}		
	},
	VorschauAnAus:0,
	Druckschau:function () {
		if (this.VorschauAnAus==0) {	
			if (this.Name=="") {
				var Eingabe=prompt("Kennung oder Name eingetragen", "");
				if (Eingabe!=null) {
					Eingabe=Eingabe.toString().replace(/^\s+$/g,"");	
					if (Eingabe!="") {
						this.Name = Eingabe.substring(0,30);
						var Div=document.getElementsByTagName("div");
						for (var di=0;di<Div.length;di++) {
							var neuSpan = document.createElement("p");
							neuSpan.className="AufgName";
							var neuSpanText = document.createTextNode(Eingabe.substring(0,30));
							neuSpan.appendChild(neuSpanText);
							if (Div[di].className=="Aufgabenrahmen") {
								Div[di].insertBefore(neuSpan, Div[di].firstChild);
							}
						}
						
					}
				}					
			}
			LC.los();
			
			document.getElementById("Codetabelle").style.display="block";
			document.getElementById("Uebungsresultate").style.left="0";
			document.getElementById("Uebungsresultate").style.width="100%";
			document.getElementById("Uebungsresultate").style.position="static";
			document.getElementsByTagName("article")[0].style.display="none";
			document.getElementById("ResTabRahmen").setAttribute("align", "center");
			document.getElementById("ResDruckButton").innerHTML=">> zur&uuml;ck zur Seitenansicht >>";
			document.getElementById("ResDruckButton").style.backgroundColor="#a9ff4f";
			document.getElementById("ResultateNameTd").style.display="block";
			document.getElementById("ResultateNameTd").innerHTML="<strong>"+this.Name+"</strong>";
			document.getElementById("ResultateAF").style.display="block";
			document.getElementById("Resultatbutton").style.display="none";
			document.getElementById("Resultattitel").style.display="block";
			document.getElementById("ResultatDruck").style.display="block";	
			document.getElementById("Resultat_Symbole").style.display="table-row";

			
			this.VorschauAnAus=1;
		}
		else {
			document.getElementById("Codetabelle").style.display="none";
			document.getElementById("Uebungsresultate").style.width="120px";
			document.getElementById("Uebungsresultate").style.right="0px";
			document.getElementById("Uebungsresultate").style.left="auto";
			document.getElementById("Uebungsresultate").style.paddingLeft="0";
			document.getElementById("Uebungsresultate").style.position="absolute";
			document.getElementsByTagName("article")[0].style.display="block";
			document.getElementById("ResultateNameTd").style.display="none";
			document.getElementById("ResultateAF").style.display="none";
			document.getElementById("ResTabRahmen").setAttribute("align", "right");	
			document.getElementById("ResDruckButton").innerHTML="Druckvorschau<br />Wertungscode";
			document.getElementById("ResDruckButton").style.backgroundColor="transparent";
			document.getElementById("Resultattitel").style.display="none";	
			document.getElementById("ResultatDruck").style.display="none";
			document.getElementById("Resultatbutton").style.display="table-cell";
			document.getElementById("Resultat_Symbole").style.display="none";

			this.VorschauAnAus=0;
		}		
		
	},
	Name:"",
	gescrollt:function () {
			if (document.getElementById("Uebungsresultate").style.display=="block"&&this.VorschauAnAus==0) {
				document.getElementById("Uebungsresultate").style.right="0px";
				document.getElementById("Uebungsresultate").style.left="auto";
				document.getElementById("Uebungsresultate").style.paddingLeft="0";
				document.getElementById("Uebungsresultate").style.position="absolute";
				document.getElementsByTagName("article")[0].style.display="block";
				document.getElementById("ResultateNameTd").style.display="none";
				document.getElementById("ResultateAF").style.display="none";
				document.getElementById("ResTabRahmen").setAttribute("align", "right");	
				document.getElementById("ResDruckButton").innerHTML="Druckvorschau<br />Wertungscode";
				document.getElementById("ResDruckButton").style.backgroundColor="transparent";
				document.getElementById("Resultattitel").style.display="none";	
				document.getElementById("ResultatDruck").style.display="none";
				document.getElementById("Resultatbutton").style.display="table-cell";
				document.getElementById("Resultattabelle").style.display="table";	
				document.getElementById("Resultat_ohne").style.display="block";
				
				this.anaus=1;
			}	
	}	
}


var T_Wertung = {
	$id:function(id){
			return document.getElementById(id);
		},
	Versuche:{},
	riGes:{},//Gesamtpunktzahl richtig
	faGes:{},//Gesamtpunktzahl falsch
	richtig:{},//Kennung f&uuml;r die Inputfelder, die eine richtige L&ouml;sung haben.	
	Kennung:["&nbsp;<span class='Versuchekennung'>&bull;&bull;&bull;&bull;&bull;</span>&nbsp;","&nbsp;&bull;<span class='Versuchekennung'>&bull;&bull;&bull;&bull;</span>&nbsp;","&nbsp;&bull;&bull;<span class='Versuchekennung'>&bull;&bull;&bull;</span>&nbsp;","&nbsp;&bull;&bull;&bull;<span class='Versuchekennung'>&bull;&bull;</span>&nbsp;","&nbsp;&bull;&bull;&bull;&bull;<span class='Versuchekennung'>&bull;</span>&nbsp;"],
	neu:function(richtigID){
		
		//Wertungs&uuml;bernahme 
		if (typeof(T_Wertung.riGes[richtigID])=="undefined") {
			T_Wertung.riGes[richtigID]=0;	
		}	
		
		if (typeof(T_Wertung.richtig[richtigID])=="undefined") {
			T_Wertung.richtig[richtigID]=[];	
		}
		else {
			for (var i=0; i<T_Wertung.richtig[richtigID].length; i++) {	
				if (T_Wertung.richtig[richtigID][i]==1) {
					T_Wertung.riGes[richtigID]++;
					T_Wertung.richtig[richtigID][i]=0;
				}	
			}
		}
		
		if (typeof(T_Wertung.faGes[richtigID])=="undefined") {
			T_Wertung.faGes[richtigID]=0;	
		}			
		
		T_Wertung.Versuche[richtigID]=5;
		
		this.$id(richtigID).nextSibling.innerHTML="<span>&nbsp;&bull;&bull;&bull;&bull;&bull;&nbsp;</span>";
		//this.$id(richtigID).nextSibling.style.fontSize="x-large";
	},
	los:function(istID,sollWerte,richtigID,falschID,ZahlNein,GrossKlein){//istID = Inputwerte (Sollten sie durchnummeriert sein, reicht ein Wert ohne Nummer / sollWerte = Array der L&ouml;sungen / richtigID = Id der Ausgabe der richtigen Angaben / falschID = Id der Ausgabe der falschen Angaben )
	
		T_Wertung.Versuche[richtigID]=T_Wertung.Versuche[richtigID]-1;
			
		var ZahlN=(typeof(ZahlNein)=="undefined")?0:ZahlNein;
		var GrKlUnterscheiden=(typeof(GrossKlein)=="undefined")?0:GrossKlein;
		
		if (typeof(sollWerte)=="string"||typeof(sollWerte)=="number") { //Werteanzahl f&uuml;r die for-Schleife wird ermittelt.
	   	WerteAnzahl=1;	
	   }
	   else {
	   	WerteAnzahl=sollWerte.length;
	   }	
	  
	   if (T_Wertung.Versuche[richtigID] >= 0) { //Auswertung solange noch Versuche zur Verf&uuml;gung stehen
	   	var richtigKontrolle=0;
		   for (var i=0;i<WerteAnzahl;i++) {
		   	T_Wertung.richtig[richtigID][i]=0;//Kennung f&uuml;r richtig geloeste Inputfelder wird auf 0 gesetzt.
				var WertIstID=(typeof(istID)=="string")?istID+i:istID[i];
				var WertIst=this.$id(WertIstID).value;
					 WertIst=(GrKlUnterscheiden!=1)?WertIst.toString().toLowerCase():WertIst;
					 WertIst=WertIst.replace(/\s/g,"");
		     
		      if (typeof(sollWerte)=="string"||typeof(sollWerte)=="number") {
		      	var WertSoll=sollWerte;	
		      }
		      else {
		      	var WertSoll=sollWerte[i];	
		      }
		      
		      if (ZahlN==0||ZahlN==1) { //Umwandlung auch bei Variablen: 1.5x, die als Nicht-Zahl deklariert sein m&uuml;ssen. Texte mit Komma erhalten dann die 2 >>>ZahlN==2
					WertIst=WertIst.toString().replace(/,/g,".");	
					WertSoll=WertSoll.toString().replace(/,/g,".");		
				}	
		     	
				if (ZahlN==0) {
					if (WertSoll.toString().search(/[a-zA-Z]/)==-1) {
						var LoesRichtig=(parseFloat(WertIst)==parseFloat(WertSoll))?1:0;		
					}
					else {
						WertSoll=(GrKlUnterscheiden!=1)?WertSoll.toString().toLowerCase().replace(/\s/g,""):WertSoll;
						var LoesRichtig=(WertIst==WertSoll)?1:0;		
					}					
		     	}
		     	else {
		     		WertSoll=(GrKlUnterscheiden!=1)?WertSoll.toString().toLowerCase().replace(/\s/g,""):WertSoll;
		     		var LoesRichtig=(WertIst==WertSoll)?1:0;		
		     	}
		     	
		     	if (LoesRichtig==1) {		
		     		T_Wertung.richtig[richtigID][i]=1;
					this.$id(WertIstID).className="richtig";
					this.$id(WertIstID).disabled=true;
					this.$id(WertIstID).style.color="black";
					
					richtigKontrolle++;
				}
				else{
					this.$id(WertIstID).className="falsch";
					T_Wertung.faGes[richtigID]=parseInt(T_Wertung.faGes[richtigID])+1;	
				}

		   }
		   
		   var r=0;
			for (var i=0;i<T_Wertung.richtig[richtigID].length;i++) {
				if (T_Wertung.richtig[richtigID][i]==1) {	
					r++;
				}
			}
			
			this.$id(falschID).innerHTML=T_Wertung.faGes[richtigID];	
				
			this.$id(richtigID).innerHTML=parseInt(r)+parseInt(T_Wertung.riGes[richtigID]);
					
					
			
			if (richtigKontrolle<WerteAnzahl) {
				this.$id(richtigID).nextSibling.innerHTML=this.Kennung[T_Wertung.Versuche[richtigID]];	
			}	
			
			if (richtigKontrolle==WerteAnzahl) {
				T_Wertung.Versuche[richtigID]=T_Wertung.Versuche[richtigID]+1;
				
				this.$id(richtigID).nextSibling.innerHTML=this.Kennung[((T_Wertung.Versuche[richtigID])-1)];	
			}	
			
			if (T_Wertung.Versuche[richtigID]==0 && richtigKontrolle<WerteAnzahl) {
				for (var j=0;j<WerteAnzahl;j++) {
					if (T_Wertung.richtig[richtigID][j]==0) {	
						var WertBIstID=(typeof(istID)=="string")?istID+j:istID[j];
						this.$id(WertBIstID).disabled=true;	
					}
				}			
					alert('Die n\u00e4chste Auswertung zeigt die L\u00f6sung an.')	
			} 	
		} 
		
		else {
				for (var i=0;i<WerteAnzahl;i++) {
					if (T_Wertung.richtig[richtigID][i]==0) {
						var WertIstID=(typeof(istID)=="string")?istID+i:istID[i];
						
						if (typeof(sollWerte)=="string"||typeof(sollWerte)=="number") {
				      	var WertSoll=[];
				      	WertSoll[0]=sollWerte;	
				      }
				      else {
				      	var WertSoll=sollWerte[i];	
				      }
						
						if (ZahlN==0) {
							this.$id(WertIstID).value=WertSoll.toString().replace(/\./,",");	
						}
						else {
							this.$id(WertIstID).value=WertSoll;	
						}
						this.$id(WertIstID).className="loesung";
						this.$id(WertIstID).disabled=true;
						this.$id(WertIstID).style.color="black";
					}	
				}
				
		}
	}
}	


function T_Resultat(ID,AufgNr,richtigID,falschID) {
	var richtig=document.getElementById(richtigID).innerHTML;
	var falsch=document.getElementById(falschID).innerHTML;
	
	var ResultatIDIst=0;
	for (var i=0; i<Resultatanzeige.Buttonwerte.length;i++) {
		if (Resultatanzeige.Buttonwerte[i][0]==ID) {	
		
			var riFaEing=parseInt(richtig)+parseInt(falsch);
			var riFaIst=parseInt(Resultatanzeige.Buttonwerte[i][2])+parseInt(Resultatanzeige.Buttonwerte[i][3]);
			if (riFaEing!=riFaIst) {
				Resultatanzeige.Buttonwerte[i][4]=parseInt(Resultatanzeige.Buttonwerte[i][4])+1;
			}
			
			Resultatanzeige.Buttonwerte[i][1]=AufgNr;
			Resultatanzeige.Buttonwerte[i][2]=richtig;
			Resultatanzeige.Buttonwerte[i][3]=falsch;
			
			ResultatIDIst=1;
		}
	}	
	
	if (ResultatIDIst==0) {
		Resultatanzeige.Buttonwerte.unshift([ID,AufgNr,richtig,falsch,1]);
	}
	
	Resultatanzeige.los();

}

function FR_Resultat(QuizID,AufgNr) { //ID= quiz0, quiz1, quiz2... //Wenn der L&uuml;ckentext vollst&auml;ndig ist und die Wertung angezeigt wird, erscheint im Auswertungsbereich die Klasse quiz-bewertung, die ausgelesen wird.
	

	if (typeof(document.getElementById(QuizID).getElementsByClassName("quiz-bewertung")[0])!="undefined") {
		var Text= document.getElementById(QuizID).getElementsByClassName("quiz-bewertung")[0].innerHTML;
		var Anzahl=Text.replace(/ersten/,"1").replace(/zwei/,"2").replace(/\D/g,"");
		
		var ResultatIDIst=0;
	for (var i=0; i<Resultatanzeige.Buttonwerte.length;i++) {
		if (Resultatanzeige.Buttonwerte[i][0]==QuizID) {	
		
			Resultatanzeige.Buttonwerte[i][1]=AufgNr;
			Resultatanzeige.Buttonwerte[i][2]=1;
			Resultatanzeige.Buttonwerte[i][3]=parseInt(Anzahl)-1;
			Resultatanzeige.Buttonwerte[i][4]=Anzahl;
			
			ResultatIDIst=1;
		}
	}	
	
	if (ResultatIDIst==0) {
		Resultatanzeige.Buttonwerte.unshift([QuizID,AufgNr,1,parseInt(Anzahl)-1,Anzahl]);
	}

		Resultatanzeige.los();
	}				

};

var LT_Test={
		$id:function(id){
			return document.getElementById(id);
		},
		leeren:function(InpId){
			for(var i=0;i<InpId.length;i++){
				this.$id(InpId[i]).value="";
				this.$id(InpId[i]).disabled=false;
			}		
		},
		los:function(B_Id,W_Id,Zahl,klein,AufgNr){ //ID des Auswertungsbuttons, IDs der abzufragenden Inputfelder (Array), 
		                                                   //Zahl(1) oder Text(0), Grossschreibung egal(1) nicht egal(0), Aufgabennummer			
			
			if(typeof(this.Versuche[B_Id])=="undefined"){
				this.Versuche[B_Id]=0;	
			}
			
			if(typeof(this.VersucheStopp[B_Id])=="undefined"){
				this.VersucheStopp[B_Id]=0;	
			}	
			
			if(typeof(AufgNr)=="undefined"){
				AufgNr="???";	
			}		
			
			Zahl=(Zahl!=1)?0:1;
			var Gross=(Gross!=1)?0:1;
			var richtig=0;
				
			if(this.VersucheStopp[B_Id]==0){this.Versuche[B_Id]++;}
			this.VersucheStopp[B_Id]=0;	
			for(var i=0;i<W_Id.length;i++){
				for(var j=0;j<LT_Test[W_Id[i]].length;j++){	
					var W_Ist=this.$id(W_Id[i]).value.replace(/^\s+/g,"").replace(/\s+$/g,"").replace(/\s+/g," "); //Leerstellen angleichen
					var W_Soll=LT_Test[W_Id[i]][j];

					if(Zahl==1){
						//W_Ist=parseFloat(W_Ist.replace(/,/,".").replace(/\s/g,"")).toFixed(6);
						W_Ist=W_Ist.replace(/,/g,".").replace(/\s/g,"");
						W_Ist=eval(W_Ist);
						W_Ist=parseFloat(W_Ist).toFixed(6);	
						
						W_Soll=parseFloat(W_Soll.toString().replace(/,/,".")).toFixed(6);	
					}
					if(Zahl==0){
						W_Ist=W_Ist.toString().replace(/\./,",").replace(/\s/g,"");
						W_Soll=W_Soll.toString().replace(/\./,",");
					}	
					
					if(klein==1){
						W_Ist=W_Ist.toString().toLowerCase();
						W_Soll=W_Soll.toString().toLowerCase();
					}
						
					if(W_Ist==W_Soll){
						this.$id(W_Id[i]).disabled=true;
						this.$id(W_Id[i]).style.backgroundColor="#9f0";
						this.$id(W_Id[i]).style.color="#000";
						
						if (this.$id("L_Blende"+W_Id[i])) {						

						}
						else {
							var Breite=this.$id(W_Id[i]).style.width;
							if (Breite.length>1) {								
								window.setTimeout("LT_Test.BlendeAn('"+W_Id[i]+"')", 3000);
							}
						}		
						richtig++;
					}	
					else{
						if(this.$id(W_Id[i]).disabled==false){
							this.$id(W_Id[i]).style.backgroundColor="#f90";
						}	
					}
				}
				
				this.$id(B_Id).nextSibling.innerHTML="Versuche: "+this.Versuche[B_Id];	
				
			}

			if(richtig==W_Id.length){
				this.VersucheStopp[B_Id]=1;
				
				var ResultatIDIst=0;
				for (var i=0; i<Resultatanzeige.Buttonwerte.length;i++) {
					if (Resultatanzeige.Buttonwerte[i][0]==B_Id) {	
					
						Resultatanzeige.Buttonwerte[i][1]=AufgNr;
						Resultatanzeige.Buttonwerte[i][2]=1;
						Resultatanzeige.Buttonwerte[i][3]=this.Versuche[B_Id]-1;
						Resultatanzeige.Buttonwerte[i][4]=this.Versuche[B_Id];
						
						ResultatIDIst=1;
					}
				}	
				
				if (ResultatIDIst==0) {
					Resultatanzeige.Buttonwerte.unshift([B_Id,AufgNr,1,0,1])	
				}
				
			}
			else {
			
				var ResultatIDIst=0;
				for (var i=0; i<Resultatanzeige.Buttonwerte.length;i++) {
					if (Resultatanzeige.Buttonwerte[i][0]==B_Id) {	
						Resultatanzeige.Buttonwerte[i][1]=AufgNr;
						Resultatanzeige.Buttonwerte[i][2]=0;
						Resultatanzeige.Buttonwerte[i][3]=this.Versuche[B_Id];
						Resultatanzeige.Buttonwerte[i][4]=this.Versuche[B_Id];
						
						ResultatIDIst=1;
					}
				}	
				
				if (ResultatIDIst==0) {
					Resultatanzeige.Buttonwerte.unshift([B_Id,AufgNr,0,1,1])	
				}
			}
			Resultatanzeige.los();	
		},
		Versuche:{},
		VersucheStopp:{},
		BlendeAn:function (BlendenID,Blende) {		
			var Breite=this.$id(BlendenID).style.width;
						var Blende = document.createElement("span");
						Blende.style.position="absolute";
						Blende.innerHTML="<div id='L_Blende"+BlendenID+"' style='width:"+Breite+";background-image:url(https://www.aufgabenfuchs.de/inc/basis/smiley.png);background-repeat:no-repeat;background-position:center;background-color:#9f0;text-align:center;' onmouseover='LT_Test.LoesBlende(this.id,0)' onmouseout='LT_Test.LoesBlende(this.id,1)'><br /></div>";
			
			this.$id(BlendenID).parentNode.insertBefore(Blende,this.$id(BlendenID));	
		},	
		LoesBlende:function (BlendenID,anaus) {
			if (anaus==0) {
				this.$id(BlendenID).style.backgroundColor="transparent";	
				this.$id(BlendenID).style.backgroundImage="none";
				this.$id(BlendenID).innerHTML="<br />";
			}
			if (anaus==1) {
				this.$id(BlendenID).style.backgroundColor="#9f0";	
				this.$id(BlendenID).style.backgroundImage="url(https://www.aufgabenfuchs.de/inc/basis/smiley.png)";
				this.$id(BlendenID).style.backgroundRepeat="no-repeat";
				this.$id(BlendenID).style.backgroundPosition="center";				
				
			}
			
		}	
}

if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ 
 		var ieversion=new Number(RegExp.$1)
 		if (ieversion>=9){
		document.createElement("header");
		document.createElement("nav");
		document.createElement("article");
		document.createElement("section");
		document.createElement("footer");
	}
}
window.onload = Basis.init;